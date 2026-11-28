import type { Payload } from 'payload'
import { findEnglishSourceMatches, getContentTranslator } from '@/lib/content-translations'
import { withLocale, type Locale } from '@/lib/i18n'
import { uiCopy } from '@/lib/i18n-copy'

export type SearchHit = { type: 'mata-kuliah' | 'dosen' | 'artikel'; title: string; href: string; meta: string }

export async function searchSite(payload: Payload, rawQuery: string, locale: Locale = 'id'): Promise<SearchHit[]> {
  const q = rawQuery.trim().slice(0, 80)
  if (q.length < 2) return []

  const [translate, matches, activeVersion] = await Promise.all([
    getContentTranslator(locale),
    locale === 'en' ? findEnglishSourceMatches(q) : [],
    payload.find({
    collection: 'curriculum-versions',
    where: { isActive: { equals: true } },
    limit: 1,
    depth: 0,
    overrideAccess: false,
    }),
  ])
  const versionId = activeVersion.docs[0]?.id

  const [courses, faculty, posts] = await Promise.all([
    payload.find({
      collection: 'courses',
      where: {
        and: [
          ...(versionId ? [{ version: { equals: versionId } }] : []),
          { or: [{ name: { like: q } }, { code: { like: q } }, { nameSource: { like: q } }, ...(matches.length ? [{ name: { in: matches } }] : [])] },
        ],
      },
      limit: 5,
      depth: 0,
      overrideAccess: false,
    }),
    payload.find({ collection: 'faculty', where: { name: { like: q } }, limit: 5, depth: 0, overrideAccess: false }),
    payload.find({
      collection: 'posts',
      where: { or: [{ title: { like: q } }, { excerpt: { like: q } }, ...(matches.length ? [{ title: { in: matches } }, { excerpt: { in: matches } }] : [])] },
      limit: 5,
      depth: 0,
      overrideAccess: false,
    }),
  ])

  return [
    ...(courses.docs as Record<string, any>[]).map((c) => ({
      type: 'mata-kuliah' as const,
      title: translate(c.name),
      href: withLocale(`/kurikulum/${c.slug}`, locale),
      meta: `${c.code ?? '[ISI]'} · Semester ${c.semester}`,
    })),
    ...(faculty.docs as Record<string, any>[]).map((f) => ({
      type: 'dosen' as const,
      title: f.name,
      href: withLocale(`/dosen/${f.slug}`, locale),
      meta: f.position ? translate(f.position) : uiCopy(locale, 'Dosen'),
    })),
    ...(posts.docs as Record<string, any>[]).map((p) => ({
      type: 'artikel' as const,
      title: translate(p.title),
      href: withLocale(`/blog/${p.slug}`, locale),
      meta: locale === 'en' ? 'Article' : 'Artikel',
    })),
  ]
}
