import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { getPayloadClient } from './payload'
import * as queries from './queries'
import type { BlogPageInput } from './blog-pagination'

/**
 * Cached reads for public routes. Every entry is tagged; Payload hooks
 * (src/hooks/revalidate.ts) expire the tags on each write so published edits
 * show up on the next request. Development reads are uncached; draft-mode
 * reads bypass the cache and include unpublished content.
 */

const isDev = process.env.NODE_ENV === 'development'

const MAX_CONCURRENT = 3
let activeCount = 0
const waitQueue: (() => void)[] = []

async function acquireSlot(): Promise<void> {
  if (activeCount < MAX_CONCURRENT) {
    activeCount++
    return
  }
  await new Promise<void>((resolve) => waitQueue.push(resolve))
  activeCount++
}

function releaseSlot(): void {
  activeCount--
  const next = waitQueue.shift()
  if (next) next()
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 5): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= attempts; attempt++) {
    await acquireSlot()
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 400 * attempt))
    } finally {
      releaseSlot()
    }
  }
  throw lastError
}

function cached<Args extends unknown[], Result>(
  key: string,
  tags: string[] | ((...args: Args) => string[]),
  fn: (...args: Args) => Promise<Result>,
  revalidate: number | false = false,
) {
  return (...args: Args): Promise<Result> => {
    const run = (...callArgs: Args) => withRetry(() => fn(...callArgs))
    if (isDev) return run(...args)
    const tagList = typeof tags === 'function' ? tags(...args) : tags
    return unstable_cache(run, [key], { tags: tagList, revalidate })(...args)
  }
}

const payload = () => getPayloadClient()

export async function isDraftMode(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}

export const getSiteSettings = cached(
  'site-settings',
  ['global:site-settings', 'media', 'pages'],
  async () => queries.fetchSiteSettings(await payload()),
)

export const getBranding = cached('branding', ['global:branding', 'media'], async () =>
  queries.fetchBranding(await payload()),
)

export const getNavigation = cached(
  'navigation',
  ['global:navigation', 'pages', 'posts', 'curriculum', 'media'],
  async () => queries.fetchNavigation(await payload()),
)

export const getPmbInfo = cached(
  'pmb-info',
  ['pmb', 'pmb-waves', 'pmb-tracks', 'global:pmb-settings'],
  async () => queries.fetchPmbInfo(await payload()),
  3600,
)

const cachedPage = cached(
  'page',
  (slug: string) => ['pages', `page:${slug}`, 'media'],
  async (slug: string) => queries.fetchPage(await payload(), slug),
)

export async function getPage(slug: string, draft = false) {
  if (draft) return queries.fetchPage(await payload(), slug, { draft: true })
  return cachedPage(slug)
}

export const getPageSlugs = cached('page-slugs', ['pages'], async () =>
  queries.fetchPageSlugs(await payload()),
)

export const getCurriculum = cached('curriculum', ['curriculum', 'media'], async () =>
  queries.fetchActiveCurriculum(await payload()),
)

const cachedCourse = cached(
  'course',
  (slug: string, _versionId: string | number | null) => [
    'curriculum',
    `course:${slug}`,
    'faculty',
    'media',
  ],
  async (slug: string, versionId: string | number | null) =>
    queries.fetchCourse(await payload(), slug, { versionId }),
)

export async function getCourse(slug: string, draft = false) {
  const { version } = await getCurriculum()
  const versionId = (version?.id as string | number | undefined) ?? null
  if (draft) return queries.fetchCourse(await payload(), slug, { draft: true, versionId })
  return cachedCourse(slug, versionId)
}

export const getCourseSlugs = cached('course-slugs', ['curriculum'], async () =>
  queries.fetchCourseSlugs(await payload()),
)

export const getFacultyList = cached('faculty-list', ['faculty', 'curriculum', 'media'], async () =>
  queries.fetchFacultyList(await payload()),
)

export const getFacultySlugs = cached('faculty-slugs', ['faculty'], async () =>
  queries.fetchFacultySlugs(await payload()),
)

const cachedFacultyMember = cached(
  'faculty-member',
  (slug: string) => ['faculty', `faculty:${slug}`, 'curriculum', 'media'],
  async (slug: string) => queries.fetchFacultyMember(await payload(), slug),
)

export async function getFacultyMember(slug: string, draft = false) {
  if (draft) return queries.fetchFacultyMember(await payload(), slug, { draft: true })
  return cachedFacultyMember(slug)
}

export const getPosts = cached('posts', ['posts', 'post-categories', 'media'], async () =>
  queries.fetchPosts(await payload()),
)

const getFirstPostsPage = cached('posts-page', ['posts', 'post-categories', 'post-tags', 'media'], async (limit: number) => queries.fetchPostsPage(await payload(), { page: 1, limit }))
export async function getPostsPage(input: BlogPageInput) {
  if (input.page === 1 && !input.category && !input.tag && !input.query) return getFirstPostsPage(input.limit)
  return queries.fetchPostsPage(await payload(), input)
}
export const getPostTags = cached('post-tags', ['post-tags'], async () => queries.fetchPostTags(await payload()))

export const getLatestPosts = cached(
  'latest-posts',
  ['posts', 'post-categories', 'media'],
  async (limit: number) => queries.fetchLatestPosts(await payload(), limit),
)

const cachedPost = cached(
  'post',
  (slug: string) => ['posts', `post:${slug}`, 'post-categories', 'media'],
  async (slug: string) => queries.fetchPost(await payload(), slug),
)

export async function getPost(slug: string, draft = false) {
  if (draft) return queries.fetchPost(await payload(), slug, { draft: true })
  return cachedPost(slug)
}

export const getPostSlugs = cached('post-slugs', ['posts'], async () =>
  queries.fetchPostSlugs(await payload()),
)

export const getRelatedPosts = cached(
  'related-posts',
  ['posts', 'post-categories', 'media'],
  async (postId: string, categoryId: string | null, manualIds: string[]) =>
    queries.fetchRelatedPosts(await payload(), postId, categoryId, manualIds),
)

export const getPostCategories = cached('post-categories', ['post-categories'], async () =>
  queries.fetchPostCategories(await payload()),
)

export const getTestimonials = cached('testimonials', ['testimonials', 'media'], async () =>
  queries.fetchCollection(await payload(), 'testimonials'),
)
export const getPartners = cached('partners', ['partners', 'media'], async () =>
  queries.fetchCollection(await payload(), 'partners'),
)
export const getPrograms = cached('programs', ['programs', 'media'], async () =>
  queries.fetchCollection(await payload(), 'programs'),
)
export const getCareerPaths = cached('career-paths', ['career-paths', 'curriculum'], async () =>
  queries.fetchCollection(await payload(), 'career-paths'),
)
export const getJobs = cached(
  'job-posts',
  ['job-posts'],
  async () => queries.fetchCollection(await payload(), 'job-posts'),
  3600,
)

export const getFaqs = cached('faqs', ['faqs'], async (scope: string, limit: number) =>
  queries.fetchFaqs(await payload(), scope, limit),
)

export const getQuiz = cached('quiz-public-v2', ['quiz', 'media'], async (assessment?: boolean) =>
  queries.fetchQuiz(await payload(), assessment),
)

export const getRedirect = cached('redirect', ['redirects'], async (path: string) =>
  queries.fetchRedirect(await payload(), path),
)

export const getSitemapDocs = cached('sitemap-docs', ['pages', 'posts', 'faculty'], async () =>
  queries.fetchSitemapDocs(await payload()),
)
