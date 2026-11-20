import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'
import {
  can,
  NO_PERMISSIONS,
  resolvePermissions,
  scopeFor,
  type ActionKey,
  type ModuleKey,
  type ResolvedPermissions,
} from '@/lib/domain/permissions'

type AdminUser = {
  id: string | number
  collection?: string
  role?: unknown
  status?: string | null
}

export const isAdminUser = (user: unknown): user is AdminUser =>
  Boolean(user) && (user as AdminUser).collection === 'admins'

/**
 * Resolves the signed-in admin's permission matrix from their role document.
 * Cached on `req.context` so repeated access checks in one request hit the DB once.
 */
export async function getPermissions(req: PayloadRequest): Promise<ResolvedPermissions | null> {
  const user = req.user as AdminUser | null
  if (!isAdminUser(user)) return null
  if (user.status === 'nonaktif') return NO_PERMISSIONS

  const context = req.context as Record<string, unknown>
  const cacheKey = `__permissions:${String(user.id)}`
  const cached = context[cacheKey] as ResolvedPermissions | undefined
  if (cached) return cached

  let role = user.role as
    | { key?: string | null; permissions?: unknown }
    | string
    | number
    | null
    | undefined
  if (role && typeof role !== 'object') {
    try {
      role = (await req.payload.findByID({
        collection: 'roles',
        id: role,
        depth: 0,
        overrideAccess: true,
        req,
      })) as { key?: string | null; permissions?: unknown }
    } catch {
      role = null
    }
  }

  const resolved = resolvePermissions(
    (role as { key?: string | null; permissions?: unknown }) ?? null,
  )
  context[cacheKey] = resolved
  return resolved
}

export const isLoggedIn: Access = ({ req }) => isAdminUser(req.user)
export const denyAll: Access = () => false
export const anyone: Access = () => true

export const allow =
  (moduleKey: ModuleKey, action: ActionKey): Access =>
  async ({ req }) =>
    can(await getPermissions(req), moduleKey, action)

type ReadOptions = {
  /** Field holding the owning admin, used for the `own` scope (Penulis). */
  ownerField?: string
  /** Filter applied for anonymous visitors. Defaults to published documents. */
  publicWhere?: Where | boolean
}

/** Public visitors see published/visible records; staff see everything their scope allows. */
export const publicOr =
  (moduleKey: ModuleKey, options: ReadOptions = {}): Access =>
  async ({ req }) => {
    const publicWhere = options.publicWhere ?? { _status: { equals: 'published' } }
    const permissions = await getPermissions(req)
    const scope = scopeFor(permissions, moduleKey, 'lihat')
    if (scope === 'all') return true
    if (scope === 'own' && options.ownerField && req.user) {
      if (publicWhere === true) return true
      const own: Where = { [options.ownerField]: { equals: req.user.id } }
      return publicWhere === false ? own : { or: [own, publicWhere] }
    }
    const draftRequested = req.query?.draft === 'true' || req.query?.draft === true
    if (draftRequested) return false
    return publicWhere
  }

/** Staff-only read (private operational records). */
export const staffRead =
  (moduleKey: ModuleKey, options: { ownerField?: string } = {}): Access =>
  async ({ req }) => {
    const scope = scopeFor(await getPermissions(req), moduleKey, 'lihat')
    if (!scope) return false
    if (scope === 'own' && options.ownerField && req.user) {
      return { [options.ownerField]: { equals: req.user.id } }
    }
    return true
  }

type WriteOptions = {
  ownerField?: string
  /** When true, writing `_status: 'published'` additionally requires `terbitkan`. */
  publishGate?: boolean
}

export const write =
  (moduleKey: ModuleKey, action: 'buat' | 'ubah' | 'hapus', options: WriteOptions = {}): Access =>
  async ({ req, data }) => {
    const permissions = await getPermissions(req)
    const scope = scopeFor(permissions, moduleKey, action)
    if (!scope) return false
    if (options.publishGate && !can(permissions, moduleKey, 'terbitkan')) {
      const status = (data as { _status?: string } | undefined)?._status
      if (status === 'published') return false
      if (
        data &&
        action === 'ubah' &&
        !status &&
        req.query?.draft !== 'true' &&
        req.query?.draft !== true
      ) {
        return false
      }
    }
    if (scope === 'own' && options.ownerField && action !== 'buat' && req.user) {
      return { [options.ownerField]: { equals: req.user.id } }
    }
    return true
  }

/** Standard CRUD access for a module. */
export function moduleAccess(
  moduleKey: ModuleKey,
  options: ReadOptions & WriteOptions & { publicRead?: boolean } = {},
) {
  return {
    read: options.publicRead ? publicOr(moduleKey, options) : staffRead(moduleKey, options),
    create: write(moduleKey, 'buat', options),
    update: write(moduleKey, 'ubah', options),
    delete: write(moduleKey, 'hapus', options),
  }
}

export const fieldAllow =
  (moduleKey: ModuleKey, action: ActionKey): FieldAccess =>
  async ({ req }) =>
    can(await getPermissions(req), moduleKey, action)

export const superAdminField: FieldAccess = async ({ req }) =>
  (await getPermissions(req))?.isSuperAdmin ?? false

/** Server-owned fields: only trusted server code (overrideAccess) may write them. */
export const serverOwned: FieldAccess = () => false
