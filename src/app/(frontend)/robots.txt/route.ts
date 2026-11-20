import { getSiteSettings } from '@/lib/data'
import { makeSiteSettings } from '@/lib/make-site-settings'
import { siteUrl } from '@/lib/preview'

const DEFAULT_RULES = [
  'User-agent: *',
  'Allow: /',
  'Disallow: /admin',
  'Disallow: /api/',
  'Disallow: /pratinjau',
  'Disallow: /unduh/',
  'Disallow: /internal/',
].join('\n')

/** robots.txt from Pengaturan situs → SEO (or the default rules), plus the sitemap line. */
export async function GET() {
  const settings = await getSiteSettings().catch(() => ({}) as Record<string, any>)
  const custom = typeof settings.robotsTxt === 'string' ? settings.robotsTxt.trim() : ''
  const blocked = makeSiteSettings.robots?.index === false
  const rules = blocked ? 'User-agent: *\nDisallow: /' : custom || DEFAULT_RULES
  const sitemap = /^sitemap:/im.test(rules) ? '' : `\n\nSitemap: ${siteUrl()}/sitemap.xml`
  return new Response(`${rules}${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
