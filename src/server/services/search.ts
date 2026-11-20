import type { Payload } from 'payload'

export type SearchHit = { type: 'mata-kuliah' | 'dosen' | 'artikel'; title: string; href: string; meta: string }

export async function searchSite(payload: Payload, rawQuery: string): Promise<SearchHit[]> {
  const q = rawQuery.trim().slice(0, 80)
  if (q.length < 2) return []

  const activeVersion = await payload.find({
    collection: 'curriculum-versions',
    where: { isActive: { equals: true } },
    limit: 1,
    depth: 0,
    overrideAccess: false,
  })
  const versionId = activeVersion.docs[0]?.id

  const [courses, faculty, posts] = await Promise.all([
    payload.find({
      collection: 'courses',
      where: {
        and: [
          ...(versionId ? [{ version: { equals: versionId } }] : []),
          { or: [{ name: { like: q } }, { code: { like: q } }, { nameSource: { like: q } }] },
        ],
      },
      limit: 5,
      depth: 0,
      overrideAccess: false,
    }),
    payload.find({ collection: 'faculty', where: { name: { like: q } }, limit: 5, depth: 0, overrideAccess: false }),
    payload.find({
      collection: 'posts',
      where: { or: [{ title: { like: q } }, { excerpt: { like: q } }] },
      limit: 5,
      depth: 0,
      overrideAccess: false,
    }),
  ])

  return [
    ...(courses.docs as Record<string, any>[]).map((c) => ({
      type: 'mata-kuliah' as const,
      title: c.name,
      href: `/kurikulum/${c.slug}`,
      meta: `${c.code ?? '[ISI]'} · Semester ${c.semester}`,
    })),
    ...(faculty.docs as Record<string, any>[]).map((f) => ({
      type: 'dosen' as const,
      title: f.name,
      href: `/dosen/${f.slug}`,
      meta: f.position ?? 'Dosen',
    })),
    ...(posts.docs as Record<string, any>[]).map((p) => ({
      type: 'artikel' as const,
      title: p.title,
      href: `/blog/${p.slug}`,
      meta: 'Artikel',
    })),
  ]
}
