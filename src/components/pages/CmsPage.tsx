import { uiCopy } from '@/lib/i18n-copy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { JsonLd } from '@/components/seo/JsonLd'
import { getPage, getSiteSettings, isDraftMode } from '@/lib/data'
import { redirectIfConfigured } from '@/lib/routing'
import { breadcrumbLd, docMetadata } from '@/lib/seo'
import { getContentTranslator, translateContent } from '@/lib/content-translations'
import { withLocale, type Locale } from '@/lib/i18n'

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

export async function cmsPageMetadata(slug: string, path: string, emptyTitle?: string, locale: Locale = 'id'): Promise<Metadata> {
  const [rawPage, rawSettings, cmsTranslate] = await Promise.all([loadCmsPage(slug), getSiteSettings(), getContentTranslator(locale)])
  const translate = (text: string) => uiCopy(locale, cmsTranslate(text))
  const page = translateContent(rawPage, translate)
  const settings = translateContent(rawSettings, translate)
  if (!page) return { title: emptyTitle ?? (locale === 'en' ? 'Page not found' : 'Halaman tidak ditemukan'), robots: { index: false } }
  return docMetadata({
    doc: page,
    locale,
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
  locale = 'id',
}: {
  slug: string
  path: string
  emptyState?: ReactElement
  locale?: Locale
}) {
  const [rawPage, rawSettings, cmsTranslate] = await Promise.all([loadCmsPage(slug), getSiteSettings(), getContentTranslator(locale)])
  const translate = (text: string) => uiCopy(locale, cmsTranslate(text))
  const page = translateContent(rawPage, translate)
  const settings = translateContent(rawSettings, translate)
  if (!page) {
    await redirectIfConfigured(path, locale)
    return emptyState ?? notFound()
  }
  const meta = (page.meta ?? {}) as Doc
  return (
    <>
      {meta.jsonLd !== false && path !== '/' ? (
        <JsonLd
          data={breadcrumbLd([
            { name: locale === 'en' ? 'Home' : 'Beranda', path: withLocale('/', locale) },
            { name: String(page.title ?? ''), path: withLocale(path, locale) },
          ])}
        />
      ) : null}
      <RenderBlocks blocks={page.layout} pageSlug={slug} locale={locale} translate={translate} {...siteFlags(settings)} />
    </>
  )
}
