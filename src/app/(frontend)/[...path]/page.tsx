import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'
import { getPageSlugs } from '@/lib/data'
import { notFoundOrRedirect } from '@/lib/routing'

/** Slugs served by dedicated routes, or never served directly. */
const RESERVED = new Set([
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
])

type Props = { params: Promise<{ path: string[] }> }

/** Other CMS pages (privacy, terms, editor-created pages); unknown paths fall through to redirects or 404. */
export async function generateStaticParams() {
  const slugs = await getPageSlugs()
  return slugs.filter((slug) => !RESERVED.has(slug)).map((slug) => ({ path: [slug] }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params
  if (path.length !== 1 || RESERVED.has(path[0])) return { title: 'Halaman tidak ditemukan' }
  return cmsPageMetadata(path[0], `/${path[0]}`)
}

export default async function CmsCatchAllPage({ params }: Props) {
  const { path } = await params
  const route = `/${path.join('/')}`
  if (path.length === 1 && path[0] === 'beranda') permanentRedirect('/')
  if (path.length !== 1 || RESERVED.has(path[0])) return notFoundOrRedirect(route)
  return <CmsPage slug={path[0]} path={route} />
}
