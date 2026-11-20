import type { Payload } from 'payload'

/**
 * Plain Payload reads shared by Next.js pages (through the cached wrappers in
 * data.ts) and the /api/v1 endpoints. Public reads run with access control
 * as an anonymous visitor; draft reads are only used by verified previews.
 * Slug lookups go through the shared `findBySlug()` helper.
 */

export type ReadOptions = { draft?: boolean }

/**
 * The shared slug lookup from src/lib/payload.ts, loaded lazily: that module
 * imports the Payload config, which imports the /api/v1 endpoints that import
 * this file. A static import would create a module cycle.
 */
const findBySlug: (typeof import('./payload'))['findBySlug'] = async (...args) => {
  const helpers = await import('./payload')
  return helpers.findBySlug(...args)
}

type AnyDoc = Record<string, any>

export async function fetchSiteSettings(payload: Payload): Promise<AnyDoc> {
  return payload.findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: false })
}

export async function fetchBranding(payload: Payload): Promise<AnyDoc> {
  return payload.findGlobal({ slug: 'branding', depth: 1, overrideAccess: false })
}

export async function fetchNavigation(payload: Payload): Promise<AnyDoc> {
  return payload.findGlobal({ slug: 'navigation', depth: 1, overrideAccess: false })
}

export async function fetchPmbSettings(payload: Payload): Promise<AnyDoc> {
  return payload.findGlobal({ slug: 'pmb-settings', depth: 0, overrideAccess: false })
}

export async function fetchPage(
  _payload: Payload,
  slug: string,
  options?: ReadOptions,
): Promise<AnyDoc | null> {
  return (await findBySlug('pages', slug, {
    depth: 2,
    previewAccess: Boolean(options?.draft),
  })) as AnyDoc | null
}

export async function fetchPageSlugs(payload: Payload): Promise<string[]> {
  const result = await payload.find({
    collection: 'pages',
    limit: 200,
    depth: 0,
    overrideAccess: false,
    select: { slug: true },
  })
  return (result.docs as AnyDoc[]).map((doc) => doc.slug).filter(Boolean)
}

export type CurriculumData = {
  version: AnyDoc | null
  courses: AnyDoc[]
}

export async function fetchActiveCurriculum(payload: Payload): Promise<CurriculumData> {
  const versions = await payload.find({
    collection: 'curriculum-versions',
    where: { isActive: { equals: true } },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  const version = (versions.docs[0] as AnyDoc) ?? null
  if (!version) return { version: null, courses: [] }
  const courses = await payload.find({
    collection: 'courses',
    where: { version: { equals: version.id } },
    sort: ['semester', 'sortOrder', 'code'],
    limit: 300,
    depth: 0,
    overrideAccess: false,
    select: {
      code: true,
      name: true,
      nameSource: true,
      credits: true,
      semester: true,
      tags: true,
      slug: true,
      type: true,
      shortDescription: true,
      sortOrder: true,
      syllabusCompleteness: true,
    },
  })
  return { version, courses: courses.docs as AnyDoc[] }
}

export async function fetchCourse(
  payload: Payload,
  slug: string,
  options?: ReadOptions & { versionId?: string | number | null },
): Promise<AnyDoc | null> {
  let versionId = options?.versionId
  if (versionId === undefined) {
    const versions = await payload.find({
      collection: 'curriculum-versions',
      where: { isActive: { equals: true } },
      limit: 1,
      depth: 0,
      overrideAccess: false,
    })
    versionId = versions.docs[0]?.id ?? null
  }
  return (await findBySlug('courses', slug, {
    depth: 2,
    where: versionId ? { version: { equals: versionId } } : undefined,
    previewAccess: Boolean(options?.draft),
  })) as AnyDoc | null
}

export async function fetchCourseSlugs(payload: Payload): Promise<string[]> {
  const { courses } = await fetchActiveCurriculum(payload)
  return courses.map((course) => course.slug).filter(Boolean)
}

export async function fetchFacultyList(payload: Payload): Promise<AnyDoc[]> {
  const result = await payload.find({
    collection: 'faculty',
    sort: ['sortOrder', 'name'],
    limit: 200,
    depth: 1,
    overrideAccess: false,
    joins: { coursesTaught: { limit: 30 } },
  })
  return result.docs as AnyDoc[]
}

export async function fetchFacultyMember(
  _payload: Payload,
  slug: string,
  options?: ReadOptions,
): Promise<AnyDoc | null> {
  return (await findBySlug('faculty', slug, {
    depth: 2,
    joins: { coursesTaught: { limit: 30 } },
    previewAccess: Boolean(options?.draft),
  })) as AnyDoc | null
}

export async function fetchPosts(payload: Payload, limit = 60): Promise<AnyDoc[]> {
  const result = await payload.find({
    collection: 'posts',
    sort: ['-featured', '-publishedAt'],
    limit,
    depth: 1,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      cover: true,
      category: true,
      tags: true,
      featured: true,
      publishedAt: true,
      readingMinutes: true,
      authorName: true,
    },
  })
  return result.docs as AnyDoc[]
}

export async function fetchLatestPosts(payload: Payload, limit = 3): Promise<AnyDoc[]> {
  const result = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    limit,
    depth: 1,
    overrideAccess: false,
  })
  return result.docs as AnyDoc[]
}

export async function fetchPost(
  _payload: Payload,
  slug: string,
  options?: ReadOptions,
): Promise<AnyDoc | null> {
  return (await findBySlug('posts', slug, {
    depth: 2,
    previewAccess: Boolean(options?.draft),
  })) as AnyDoc | null
}

export async function fetchRelatedPosts(
  payload: Payload,
  postId: string,
  categoryId: string | null,
  manualIds: string[],
): Promise<AnyDoc[]> {
  if (manualIds.length) {
    const manual = await payload.find({
      collection: 'posts',
      where: { id: { in: manualIds } },
      limit: 3,
      depth: 1,
      overrideAccess: false,
    })
    if (manual.docs.length) return manual.docs as AnyDoc[]
  }
  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { id: { not_equals: postId } },
        ...(categoryId ? [{ category: { equals: categoryId } }] : []),
      ],
    },
    sort: '-publishedAt',
    limit: 3,
    depth: 1,
    overrideAccess: false,
  })
  return result.docs as AnyDoc[]
}

export async function fetchPostSlugs(payload: Payload): Promise<string[]> {
  const result = await payload.find({
    collection: 'posts',
    limit: 500,
    depth: 0,
    overrideAccess: false,
    select: { slug: true },
  })
  return (result.docs as AnyDoc[]).map((doc) => doc.slug).filter(Boolean)
}

export async function fetchFacultySlugs(payload: Payload): Promise<string[]> {
  const result = await payload.find({
    collection: 'faculty',
    limit: 300,
    depth: 0,
    overrideAccess: false,
    select: { slug: true },
  })
  return (result.docs as AnyDoc[]).map((doc) => doc.slug).filter(Boolean)
}

export type SitemapDoc = { slug: string; updatedAt?: string | null; noIndex?: boolean }

/** Published, indexable documents for sitemap.xml. */
export async function fetchSitemapDocs(
  payload: Payload,
): Promise<Record<'pages' | 'posts' | 'faculty', SitemapDoc[]>> {
  const read = async (collection: 'pages' | 'posts' | 'faculty') => {
    const result = await payload.find({
      collection,
      limit: 1000,
      depth: 0,
      overrideAccess: false,
      select: { slug: true, updatedAt: true, meta: true } as never,
    })
    return (result.docs as AnyDoc[])
      .filter((doc) => doc.slug)
      .map((doc) => ({
        slug: String(doc.slug),
        updatedAt: doc.updatedAt ?? null,
        noIndex: Boolean(doc.meta?.noIndex),
      }))
  }
  const [pages, posts, faculty] = await Promise.all([read('pages'), read('posts'), read('faculty')])
  return { pages, posts, faculty }
}

export async function fetchPostCategories(payload: Payload): Promise<AnyDoc[]> {
  const result = await payload.find({
    collection: 'post-categories',
    sort: 'sortOrder',
    limit: 50,
    depth: 0,
    overrideAccess: false,
  })
  return result.docs as AnyDoc[]
}

export async function fetchCollection(
  payload: Payload,
  collection: 'testimonials' | 'partners' | 'programs' | 'career-paths' | 'job-posts',
  limit = 50,
): Promise<AnyDoc[]> {
  const result = await payload.find({
    collection,
    sort: collection === 'job-posts' ? 'deadline' : 'sortOrder',
    limit,
    depth: 1,
    overrideAccess: false,
  })
  return result.docs as AnyDoc[]
}

export async function fetchFaqs(payload: Payload, scope: string, limit = 20): Promise<AnyDoc[]> {
  const result = await payload.find({
    collection: 'faqs',
    where: { scope: { in: [scope] } },
    sort: 'sortOrder',
    limit,
    depth: 0,
    overrideAccess: false,
  })
  return result.docs as AnyDoc[]
}

export type PmbInfo = {
  waves: AnyDoc[]
  tracks: AnyDoc[]
  settings: AnyDoc | null
  activeWave: AnyDoc | null
}

export function pickActiveWave(waves: AnyDoc[], now = new Date()): AnyDoc | null {
  const open = waves.filter((w) => w.status === 'dibuka')
  const upcoming = open
    .filter(
      (w) => !w.closeDate || new Date(w.closeDate).getTime() >= now.getTime() - 24 * 3600 * 1000,
    )
    .sort(
      (a, b) =>
        (a.closeDate ? new Date(a.closeDate).getTime() : Infinity) -
        (b.closeDate ? new Date(b.closeDate).getTime() : Infinity),
    )
  return upcoming[0] ?? open[0] ?? null
}

export async function fetchPmbInfo(payload: Payload): Promise<PmbInfo> {
  const [waves, tracks, settings] = await Promise.all([
    payload.find({
      collection: 'pmb-waves',
      sort: ['sortOrder', 'openDate'],
      limit: 20,
      depth: 0,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'pmb-tracks',
      sort: 'sortOrder',
      limit: 20,
      depth: 0,
      overrideAccess: false,
    }),
    fetchPmbSettings(payload).catch(() => null),
  ])
  const waveDocs = waves.docs as AnyDoc[]
  return {
    waves: waveDocs,
    tracks: tracks.docs as AnyDoc[],
    settings,
    activeWave: pickActiveWave(waveDocs),
  }
}

export type PublicQuizQuestion = {
  id: string
  text: string
  helpText?: string | null
  image?: {
    url?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
  options: { id: string; label: string }[]
}

/** Quiz questions without scoring weights (scoring happens on the server). */
export async function fetchQuiz(payload: Payload): Promise<PublicQuizQuestion[]> {
  const result = await payload.find({
    collection: 'quiz-questions',
    sort: 'sortOrder',
    limit: 50,
    depth: 1,
    overrideAccess: false,
  })
  return (result.docs as AnyDoc[]).map((q) => ({
    id: String(q.id),
    text: q.text,
    helpText: q.helpText ?? null,
    image:
      q.image && typeof q.image === 'object'
        ? { url: q.image.url, alt: q.image.alt, width: q.image.width, height: q.image.height }
        : null,
    options: ((q.options as AnyDoc[]) ?? []).map((o) => ({ id: String(o.id), label: o.label })),
  }))
}

export async function fetchRedirect(
  payload: Payload,
  path: string,
): Promise<{ to: string; statusCode: string } | null> {
  const result = await payload.find({
    collection: 'redirects',
    where: { from: { equals: path } },
    limit: 1,
    depth: 0,
    overrideAccess: false,
  })
  const doc = result.docs[0] as AnyDoc | undefined
  return doc ? { to: doc.to, statusCode: doc.statusCode ?? '301' } : null
}
