export type CmsLink = {
  label?: string | null
  linkType?: string | null
  path?: string | null
  page?: unknown
  post?: unknown
  course?: unknown
  url?: string | null
  anchor?: string | null
  newTab?: boolean | null
  isVisible?: boolean | null
  asButton?: boolean | null
  children?: CmsLink[] | null
}

const slugOf = (value: unknown): string | null =>
  value && typeof value === 'object' ? ((value as { slug?: string }).slug ?? null) : null

export function resolveHref(link: CmsLink): string {
  switch (link.linkType) {
    case 'page': {
      const slug = slugOf(link.page)
      return !slug || slug === 'beranda' ? '/' : `/${slug}`
    }
    case 'post':
      return `/blog/${slugOf(link.post) ?? ''}`
    case 'course':
      return `/kurikulum/${slugOf(link.course) ?? ''}`
    case 'external':
      return link.url || '#'
    case 'anchor':
      return link.anchor || '#'
    default:
      return link.path || '/'
  }
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
}

export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  const clean = href.split('#')[0]
  return pathname === clean || pathname.startsWith(`${clean}/`)
}

/** Canonical form for redirect sources and lookups: leading slash, no trailing slash, no origin. */
export function normalizePath(value: string): string {
  let path = value.trim()
  try {
    if (/^https?:\/\//i.test(path)) path = new URL(path).pathname
  } catch {
    // keep as typed
  }
  path = path.split('?')[0].split('#')[0]
  if (!path.startsWith('/')) path = `/${path}`
  if (path.length > 1) path = path.replace(/\/+$/, '')
  return path
}
