import { describe, expect, it } from 'vitest'
import { isActivePath, normalizePath, resolveHref } from '../links'
import { docMetadata } from '../seo'

describe('links', () => {
  it('normalizes redirect paths', () => {
    expect(normalizePath('prodi-lama/')).toBe('/prodi-lama')
    expect(normalizePath('https://contoh.ac.id/lama/?a=1#b')).toBe('/lama')
    expect(normalizePath('/')).toBe('/')
  })

  it('resolves CMS links', () => {
    expect(resolveHref({ linkType: 'page', page: { slug: 'beranda' } })).toBe('/')
    expect(resolveHref({ linkType: 'page', page: { slug: 'pmb' } })).toBe('/pmb')
    expect(resolveHref({ linkType: 'course', course: { slug: 'bd009' } })).toBe('/kurikulum/bd009')
    expect(isActivePath('/kurikulum/bd009', '/kurikulum')).toBe(true)
    expect(isActivePath('/kurikulum', '/')).toBe(false)
  })
})

describe('docMetadata', () => {
  it('uses SEO plugin fields verbatim with canonical and robots', () => {
    const metadata = docMetadata({
      doc: {
        meta: {
          title: 'Kurikulum · MBD ISTTS',
          description: 'Deskripsi',
          canonicalUrl: 'https://contoh.ac.id/k',
          noIndex: true,
        },
      },
      path: '/kurikulum',
      fallbackTitle: 'Kurikulum',
    })
    expect(metadata.title).toEqual({ absolute: 'Kurikulum · MBD ISTTS' })
    expect(metadata.description).toBe('Deskripsi')
    expect(metadata.alternates?.canonical).toBe('https://contoh.ac.id/k')
    expect(metadata.robots).toEqual({ index: false, follow: true })
  })

  it('falls back to document values', () => {
    const metadata = docMetadata({
      doc: {},
      path: '/blog/a',
      fallbackTitle: 'Artikel A',
      fallbackDescription: 'Ringkas',
      fallbackImage: { url: '/api/media/file/a.png', width: 1200, height: 630 },
    })
    expect(metadata.title).toBe('Artikel A')
    expect(metadata.alternates?.canonical).toBe('/blog/a')
    expect(metadata.robots).toBeUndefined()
    expect(JSON.stringify(metadata.openGraph)).toContain('/api/media/file/a.png')
  })
})
