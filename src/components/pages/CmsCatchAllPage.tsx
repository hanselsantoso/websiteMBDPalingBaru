import { withLocale, type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'
import { getPageSlugs } from '@/lib/data'
import { notFoundOrRedirect } from '@/lib/routing'

/** Slugs served by dedicated routes, or never served directly. */
const RESERVED = new Set([
  'en',
  'beranda',
  'halaman-404',
  'kurikulum',
  'dosen',
  'program',
  'karier',
  'blog',
  'pmb',
  'kuis',
  'kontak',
  'siasat',
  'mbd-crew',
])

type Props = { params: Promise<{ path: string[] }> }

/** Other CMS pages (privacy, terms, editor-created pages); unknown paths fall through to redirects or 404. */
export async function pageStaticParams() {
  const slugs = await getPageSlugs()
  return slugs.filter((slug) => !RESERVED.has(slug)).map((slug) => ({ path: [slug] }))
}

export async function pageMetadata(params: Props['params'], locale: Locale): Promise<Metadata> {
  const { path } = await params
  if (path.length !== 1 || RESERVED.has(path[0])) return { title: locale === 'en' ? 'Page not found' : 'Halaman tidak ditemukan' }
  return cmsPageMetadata(path[0], `/${path[0]}`, undefined, locale)
}

export default async function CmsCatchAllPage({ params, locale }: Props & { locale: Locale }) {
  const { path } = await params
  const route = `/${path.join('/')}`
  if (path.length === 1 && path[0] === 'beranda') permanentRedirect(withLocale('/', locale))
  if (path.length !== 1 || RESERVED.has(path[0])) return notFoundOrRedirect(route, locale)
  return <CmsPage slug={path[0]} path={route} locale={locale} />
}
