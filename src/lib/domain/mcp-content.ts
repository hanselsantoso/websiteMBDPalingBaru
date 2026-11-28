import type { ActionKey, ModuleKey, ResolvedPermissions } from '@/lib/domain/permissions'

export const MCP_CONTENT_ACCOUNTS = 'mcp-content-accounts'

export const MCP_CONTENT_COLLECTIONS = {
  courses: 'matakuliah',
  'curriculum-versions': 'kurikulum',
  faculty: 'dosen',
  pages: 'halaman',
  'content-translations': 'halaman',
  posts: 'blog',
  'post-categories': 'blog',
  'post-tags': 'blog',
  media: 'media',
  folders: 'media',
  tags: 'media',
  programs: 'kontenLain',
  'career-paths': 'kontenLain',
  'job-posts': 'kontenLain',
  partners: 'kontenLain',
  testimonials: 'kontenLain',
  faqs: 'kontenLain',
  'pmb-tracks': 'pmb',
  'pmb-waves': 'pmb',
  'quiz-questions': 'kuis',
  'quiz-results': 'kuis',
} satisfies Record<string, ModuleKey>

export const MCP_CONTENT_GLOBALS = {
  'pmb-settings': 'pmb',
  branding: 'branding',
  navigation: 'menu',
} satisfies Record<string, ModuleKey>

const editorialModules = [
  ...Object.values(MCP_CONTENT_COLLECTIONS),
  ...Object.values(MCP_CONTENT_GLOBALS),
]

type ContentMode = 'reader' | 'editor'

export function isMcpContentAccount(user: unknown): user is {
  collection: typeof MCP_CONTENT_ACCOUNTS
  _strategy?: string
  active?: boolean | null
  mode?: ContentMode | null
} {
  return Boolean(user && typeof user === 'object' && 'collection' in user
    && user.collection === MCP_CONTENT_ACCOUNTS)
}

export function mcpContentMode(user: unknown): ContentMode | null {
  if (!isMcpContentAccount(user) || user._strategy !== 'api-key' || user.active !== true) return null
  return user.mode === 'reader' || user.mode === 'editor' ? user.mode : null
}

function editorialPermissions(mode: ContentMode): ResolvedPermissions {
  const actions: ActionKey[] = mode === 'editor' ? ['lihat', 'buat', 'ubah'] : ['lihat']
  return {
    isSuperAdmin: false,
    roleKey: null,
    matrix: Object.fromEntries(editorialModules.map((module) => [module, { actions }])),
  }
}

export const MCP_PERMISSIONS = {
  reader: editorialPermissions('reader'),
  editor: editorialPermissions('editor'),
}
