/** Use Next.js's internal image request for Payload files served by this site. */
export function cmsImageSrc(src: string, site = process.env.NEXT_PUBLIC_SITE_URL): string {
  if (!site || !/^https?:\/\//i.test(src)) return src
  try {
    const url = new URL(src)
    if (url.origin === new URL(site).origin && !url.username && !url.password && url.pathname.startsWith('/api/media/file/')) {
      return `${url.pathname}${url.search}`
    }
  } catch {
    return src
  }
  return src
}
