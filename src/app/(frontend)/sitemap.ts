import { withLocale } from '@/lib/i18n'
import type { MetadataRoute } from 'next'
import { getCurriculum, getSitemapDocs } from '@/lib/data'
import { siteUrl } from '@/lib/preview'

const EXCLUDED_CMS_PAGES = new Set(['halaman-404', 'siasat'])

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const [docs, curriculum] = await Promise.all([getSitemapDocs(), getCurriculum()])
  const date = (value?: string | null) => (value ? new Date(value) : undefined)
  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/siasat`, changeFrequency: 'monthly' },
    ...docs.pages
      .filter((page) => !page.noIndex && !EXCLUDED_CMS_PAGES.has(page.slug))
      .map((page) => ({
        url: page.slug === 'beranda' ? `${base}/` : `${base}/${page.slug}`,
        lastModified: date(page.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: page.slug === 'beranda' ? 1 : page.slug === 'pmb' ? 0.9 : 0.7,
      })),
    ...curriculum.courses.map((course) => ({
      url: `${base}/kurikulum/${course.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    ...docs.faculty
      .filter((member) => !member.noIndex)
      .map((member) => ({
        url: `${base}/dosen/${member.slug}`,
        lastModified: date(member.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })),
    ...docs.posts
      .filter((post) => !post.noIndex)
      .map((post) => ({
        url: `${base}/blog/${post.slug}`,
        lastModified: date(post.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
  ]
  return pages.flatMap((page) => {
    const en = base + withLocale(new URL(page.url).pathname, 'en')
    const alternates = { languages: { id: page.url, en } }
    return [{ ...page, alternates }, { ...page, url: en, alternates }]
  })
}
