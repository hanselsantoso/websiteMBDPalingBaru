import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { JsonLd } from '@/components/seo/JsonLd'
import { getPage, getSiteSettings, isDraftMode } from '@/lib/data'
import { redirectIfConfigured } from '@/lib/routing'
import { breadcrumbLd, docMetadata } from '@/lib/seo'

type Doc = Record<string, any>

export function siteFlags(settings: Doc) {
  const features = (settings.features ?? {}) as Doc
  return {
    showPlaceholders: features.showPlaceholders !== false,
    showTotalSks: features.showTotalSks === true,
  }
}

/** Published page (or the latest draft inside a verified preview). */
export async function loadCmsPage(slug: string): Promise<Doc | null> {
  const draft = await isDraftMode()
  return getPage(slug, draft)
}

export async function cmsPageMetadata(slug: string, path: string, emptyTitle = 'Halaman tidak ditemukan'): Promise<Metadata> {
  const [page, settings] = await Promise.all([loadCmsPage(slug), getSiteSettings()])
  if (!page) return { title: emptyTitle, robots: { index: false } }
  return docMetadata({
    doc: page,
    path,
    // The home page keeps the site-wide default title from the layout.
    fallbackTitle: slug === 'beranda' ? null : page.title,
    fallbackDescription: settings.defaultDescription,
    fallbackImage: settings.defaultOgImage,
  })
}

export async function CmsPage({
  slug,
  path,
  emptyState,
}: {
  slug: string
  path: string
  emptyState?: ReactElement
}) {
  const [page, settings] = await Promise.all([loadCmsPage(slug), getSiteSettings()])
  if (!page) {
    await redirectIfConfigured(path)
    return emptyState ?? notFound()
  }
  const meta = (page.meta ?? {}) as Doc
  return (
    <>
      {meta.jsonLd !== false && path !== '/' ? (
        <JsonLd
          data={breadcrumbLd([
            { name: 'Beranda', path: '/' },
            { name: String(page.title ?? ''), path },
          ])}
        />
      ) : null}
      <RenderBlocks blocks={page.layout} pageSlug={slug} {...siteFlags(settings)} />
    </>
  )
}
