import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

const IGNORED_KEYS = new Set(['updatedAt', 'createdAt', 'id', 'sizes', 'updatedBy', 'createdBy'])
const MAX_VALUE_LENGTH = 400

function compact(value: unknown): unknown {
  if (value === undefined) return null
  const json = JSON.stringify(value)
  if (!json) return null
  if (json.length <= MAX_VALUE_LENGTH) return value
  return `${json.slice(0, MAX_VALUE_LENGTH)}…`
}

/** Shallow diff of top-level fields, with long values truncated. */
export function diffDocs(before: Record<string, unknown> | undefined, after: Record<string, unknown> | undefined) {
  const changes: Record<string, { dari: unknown; ke: unknown }> = {}
  const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})])
  for (const key of keys) {
    if (IGNORED_KEYS.has(key)) continue
    const a = before?.[key]
    const b = after?.[key]
    if (JSON.stringify(a) !== JSON.stringify(b)) changes[key] = { dari: compact(a), ke: compact(b) }
  }
  return changes
}

function clientIp(req: PayloadRequest): string | null {
  const forwarded = req.headers?.get?.('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0].trim() : null
}

function titleOf(doc: Record<string, any> | undefined): string {
  if (!doc) return ''
  const candidate =
    doc.title ?? doc.name ?? doc.fullName ?? doc.regNumber ?? doc.question ?? doc.text ?? doc.role ?? doc.email ?? doc.path ?? doc.from
  return typeof candidate === 'string' ? candidate.slice(0, 200) : String(doc.id ?? '')
}

async function writeAudit(
  req: PayloadRequest,
  data: {
    action: string
    entityType: string
    entityId?: string
    entityTitle?: string
    changes?: unknown
  },
) {
  try {
    await req.payload.create({
      collection: 'audit-logs',
      overrideAccess: true,
      req,
      data: {
        ...data,
        user: req.user?.collection === 'admins' ? req.user.id : null,
        ip: clientIp(req),
      } as never,
    })
  } catch (error) {
    req.payload.logger.warn({ err: error, msg: `Audit log gagal ditulis untuk ${data.entityType}` })
  }
}

const isAutosave = (req: PayloadRequest) => {
  const query = req.query as Record<string, unknown> | undefined
  return query?.autosave === 'true' || query?.autosave === true
}

export const auditAfterChange: CollectionAfterChangeHook = async ({ collection, doc, previousDoc, operation, req }) => {
  if (collection.slug === 'audit-logs' || isAutosave(req)) return doc
  const published = doc?._status === 'published' && previousDoc?._status !== 'published'
  const unpublished = previousDoc?._status === 'published' && doc?._status === 'draft'
  const action = operation === 'create' ? 'create' : published ? 'publish' : unpublished ? 'unpublish' : 'update'
  const changes = diffDocs(operation === 'create' ? undefined : previousDoc, doc)
  if (operation === 'update' && Object.keys(changes).length === 0) return doc
  await writeAudit(req, {
    action,
    entityType: collection.slug,
    entityId: String(doc.id),
    entityTitle: titleOf(doc),
    changes,
  })
  return doc
}

export const auditAfterDelete: CollectionAfterDeleteHook = async ({ collection, doc, req }) => {
  if (collection.slug === 'audit-logs') return doc
  await writeAudit(req, {
    action: 'delete',
    entityType: collection.slug,
    entityId: String(doc?.id ?? ''),
    entityTitle: titleOf(doc),
  })
  return doc
}

export const auditGlobalChange: GlobalAfterChangeHook = async ({ global, doc, previousDoc, req }) => {
  const changes = diffDocs(previousDoc, doc)
  if (Object.keys(changes).length === 0) return doc
  await writeAudit(req, {
    action: 'update',
    entityType: `global:${global.slug}`,
    entityId: global.slug,
    entityTitle: typeof global.label === 'string' ? global.label : global.slug,
    changes,
  })
  return doc
}

export async function auditEvent(req: PayloadRequest, action: string, entityType: string, entityTitle?: string) {
  await writeAudit(req, { action, entityType, entityTitle })
}
