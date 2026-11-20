/**
 * Role & permission model shared by Payload access control, the admin UI,
 * and tests. Letters follow the brief: L lihat, B buat, U ubah, H hapus,
 * T terbitkan, E ekspor.
 */

export const MODULES = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'halaman', label: 'Halaman' },
  { key: 'blog', label: 'Blog' },
  { key: 'media', label: 'Media' },
  { key: 'kurikulum', label: 'Kurikulum' },
  { key: 'matakuliah', label: 'Mata kuliah dan silabus' },
  { key: 'dosen', label: 'Dosen' },
  { key: 'pmb', label: 'PMB' },
  { key: 'leads', label: 'Leads dan inbox' },
  { key: 'branding', label: 'Branding' },
  { key: 'menu', label: 'Menu dan CTA' },
  { key: 'kuis', label: 'Kuis' },
  { key: 'kontenLain', label: 'Konten lain' },
  { key: 'pengaturan', label: 'Pengaturan dan SEO' },
  { key: 'pengguna', label: 'Pengguna dan peran' },
  { key: 'audit', label: 'Audit log' },
] as const

export type ModuleKey = (typeof MODULES)[number]['key']

export const ACTIONS = [
  { key: 'lihat', letter: 'L', label: 'Lihat' },
  { key: 'buat', letter: 'B', label: 'Buat' },
  { key: 'ubah', letter: 'U', label: 'Ubah' },
  { key: 'hapus', letter: 'H', label: 'Hapus' },
  { key: 'terbitkan', letter: 'T', label: 'Terbitkan' },
  { key: 'ekspor', letter: 'E', label: 'Ekspor' },
] as const

export type ActionKey = (typeof ACTIONS)[number]['key']
export type PermissionScope = 'all' | 'own'

export type ModulePermission = {
  actions: ActionKey[]
  /** `own` limits the module to records the user created or authored. */
  scope?: PermissionScope
}

export type PermissionMatrix = Partial<Record<ModuleKey, ModulePermission>>

export const SYSTEM_ROLE_KEYS = [
  'super-admin',
  'admin',
  'editor',
  'penulis',
  'staf-pmb',
  'staf-marketing',
] as const

export type SystemRoleKey = (typeof SYSTEM_ROLE_KEYS)[number]

const MODULE_KEYS = new Set<string>(MODULES.map((m) => m.key))
const ACTION_BY_LETTER = new Map<string, ActionKey>(ACTIONS.map((a) => [a.letter, a.key]))
const ACTION_KEYS = new Set<string>(ACTIONS.map((a) => a.key))

/** Parse a compact letter spec such as `LBUHT` into action keys. */
export function parseLetters(spec: string): ActionKey[] {
  const actions: ActionKey[] = []
  for (const letter of spec.toUpperCase()) {
    const action = ACTION_BY_LETTER.get(letter)
    if (action && !actions.includes(action)) actions.push(action)
  }
  return actions
}

export function toLetters(permission: ModulePermission | undefined): string {
  if (!permission) return '-'
  const letters = ACTIONS.filter((a) => permission.actions.includes(a.key))
    .map((a) => a.letter)
    .join('')
  return letters || '-'
}

const p = (spec: string, scope?: PermissionScope): ModulePermission =>
  scope ? { actions: parseLetters(spec), scope } : { actions: parseLetters(spec) }

export const SYSTEM_ROLES: Record<
  SystemRoleKey,
  { name: string; description: string; matrix: PermissionMatrix }
> = {
  'super-admin': {
    name: 'Super Admin',
    description: 'Akses penuh, termasuk integrasi, skrip kustom, pengguna, dan audit log.',
    matrix: {
      dashboard: p('L'),
      halaman: p('LBUHT'),
      blog: p('LBUHTE'),
      media: p('LBUH'),
      kurikulum: p('LBUHTE'),
      matakuliah: p('LBUHTE'),
      dosen: p('LBUHTE'),
      pmb: p('LBUHTE'),
      leads: p('LBUHE'),
      branding: p('LBUHT'),
      menu: p('LBUHT'),
      kuis: p('LBUHTE'),
      kontenLain: p('LBUHT'),
      pengaturan: p('LBUH'),
      pengguna: p('LBUH'),
      audit: p('LE'),
    },
  },
  admin: {
    name: 'Admin',
    description: 'Mengelola seluruh konten dan pengguna, kecuali Super Admin, integrasi, dan skrip.',
    matrix: {
      dashboard: p('L'),
      halaman: p('LBUHT'),
      blog: p('LBUHTE'),
      media: p('LBUH'),
      kurikulum: p('LBUHTE'),
      matakuliah: p('LBUHTE'),
      dosen: p('LBUHTE'),
      pmb: p('LBUHTE'),
      leads: p('LBUHE'),
      branding: p('LBUT'),
      menu: p('LBUT'),
      kuis: p('LBUHTE'),
      kontenLain: p('LBUHT'),
      pengaturan: p('LU'),
      pengguna: p('LBU'),
      audit: p('L'),
    },
  },
  editor: {
    name: 'Editor',
    description: 'Menyunting dan menerbitkan konten publik.',
    matrix: {
      dashboard: p('L'),
      halaman: p('LBUT'),
      blog: p('LBUHT'),
      media: p('LBUH'),
      kurikulum: p('LU'),
      matakuliah: p('LBUT'),
      dosen: p('LBUT'),
      pmb: p('L'),
      branding: p('L'),
      menu: p('LBU'),
      kuis: p('LBUT'),
      kontenLain: p('LBUHT'),
    },
  },
  penulis: {
    name: 'Penulis',
    description: 'Menulis artikel sendiri dan mengajukannya untuk direview.',
    matrix: {
      dashboard: p('L'),
      halaman: p('L'),
      blog: p('LBU', 'own'),
      media: p('LB', 'own'),
      kurikulum: p('L'),
      matakuliah: p('L'),
      dosen: p('L'),
    },
  },
  'staf-pmb': {
    name: 'Staf PMB',
    description: 'Mengelola pendaftar, leads, dan pengaturan PMB.',
    matrix: {
      dashboard: p('L'),
      media: p('L'),
      kurikulum: p('L'),
      matakuliah: p('L'),
      pmb: p('LBUE'),
      leads: p('LBUE'),
    },
  },
  'staf-marketing': {
    name: 'Staf Marketing',
    description: 'Mengelola leads, konten promosi, dan menu CTA.',
    matrix: {
      dashboard: p('L'),
      halaman: p('L'),
      blog: p('LBU'),
      media: p('LBU'),
      kurikulum: p('L'),
      matakuliah: p('L'),
      dosen: p('L'),
      pmb: p('L'),
      leads: p('LBUE'),
      branding: p('L'),
      menu: p('LU'),
      kuis: p('LU'),
      kontenLain: p('LBU'),
    },
  },
}

export type ResolvedPermissions = {
  isSuperAdmin: boolean
  roleKey: string | null
  matrix: PermissionMatrix
}

export const NO_PERMISSIONS: ResolvedPermissions = {
  isSuperAdmin: false,
  roleKey: null,
  matrix: {},
}

/** Validate and clean an untrusted matrix value (for example, stored JSON). */
export function normalizeMatrix(value: unknown): PermissionMatrix {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const matrix: PermissionMatrix = {}
  for (const [moduleKey, raw] of Object.entries(value as Record<string, unknown>)) {
    if (!MODULE_KEYS.has(moduleKey) || !raw || typeof raw !== 'object') continue
    const rawActions = (raw as { actions?: unknown }).actions
    const actions = Array.isArray(rawActions)
      ? (rawActions.filter((a) => typeof a === 'string' && ACTION_KEYS.has(a)) as ActionKey[])
      : []
    const scope = (raw as { scope?: unknown }).scope === 'own' ? 'own' : 'all'
    if (actions.length) {
      matrix[moduleKey as ModuleKey] = { actions: Array.from(new Set(actions)), scope }
    }
  }
  return matrix
}

export function can(
  permissions: ResolvedPermissions | null | undefined,
  moduleKey: ModuleKey,
  action: ActionKey,
): boolean {
  if (!permissions) return false
  if (permissions.isSuperAdmin) return true
  return permissions.matrix[moduleKey]?.actions.includes(action) ?? false
}

/** Returns the scope for an allowed action, or null when the action is not allowed. */
export function scopeFor(
  permissions: ResolvedPermissions | null | undefined,
  moduleKey: ModuleKey,
  action: ActionKey,
): PermissionScope | null {
  if (!can(permissions, moduleKey, action)) return null
  if (permissions?.isSuperAdmin) return 'all'
  return permissions?.matrix[moduleKey]?.scope === 'own' ? 'own' : 'all'
}

export function resolvePermissions(role: {
  key?: string | null
  permissions?: unknown
} | null): ResolvedPermissions {
  if (!role) return NO_PERMISSIONS
  const key = role.key ?? null
  if (key === 'super-admin') {
    return { isSuperAdmin: true, roleKey: key, matrix: SYSTEM_ROLES['super-admin'].matrix }
  }
  return { isSuperAdmin: false, roleKey: key, matrix: normalizeMatrix(role.permissions) }
}
