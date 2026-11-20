import crypto from 'node:crypto'

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
}

export function signValue(secret: string, value: string): string {
  return crypto.createHmac('sha256', secret).update(value).digest('hex').slice(0, 40)
}

export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && crypto.timingSafeEqual(left, right)
}

/** Signed, expiring preview URL that enables Next.js draft mode for `path`. */
export function buildPreviewUrl(secret: string, path: string, ttlHours = 24): string {
  const exp = Date.now() + ttlHours * 3600 * 1000
  const sig = signValue(secret, `preview|${path}|${exp}`)
  const params = new URLSearchParams({ path, exp: String(exp), sig })
  return `${siteUrl()}/pratinjau?${params.toString()}`
}

export function verifyPreview(secret: string, path: string, exp: string, sig: string): boolean {
  const expiresAt = Number(exp)
  if (!path.startsWith('/') || path.startsWith('//') || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return false
  return safeEqual(signValue(secret, `preview|${path}|${expiresAt}`), sig)
}

export function pathForDoc(collection: string, doc: { slug?: string | null } | null | undefined): string {
  const slug = doc?.slug || ''
  switch (collection) {
    case 'pages':
      return slug === 'beranda' || !slug ? '/' : `/${slug}`
    case 'posts':
      return `/blog/${slug}`
    case 'courses':
      return `/kurikulum/${slug}`
    case 'faculty':
      return `/dosen/${slug}`
    default:
      return '/'
  }
}
