import type { MetadataRoute } from 'next'
import { getCurriculum, getSitemapDocs } from '@/lib/data'
import { siteUrl } from '@/lib/preview'

const HIDDEN_PAGES = new Set(['halaman-404'])

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const [docs, curriculum] = await Promise.all([getSitemapDocs(), getCurriculum()])
  const date = (value?: string | null) => (value ? new Date(value) : undefined)
  return [
    ...docs.pages
      .filter((page) => !page.noIndex && !HIDDEN_PAGES.has(page.slug))
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
}
