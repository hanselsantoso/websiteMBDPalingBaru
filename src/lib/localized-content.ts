import { findEnglishSourceMatches, getContentTranslator, translateContent } from './content-translations'
import type { BlogPageInput } from './blog-pagination'
import { getPostsPage } from './data'
import { getPayloadClient } from './payload'
import { fetchPostsPage } from './queries'

export async function getLocalizedBlogPage(input: BlogPageInput) {
  const translate = await getContentTranslator('en')
  if (!input.query) return translateContent(await getPostsPage(input), translate)
  const [payload, sources] = await Promise.all([getPayloadClient(), findEnglishSourceMatches(input.query)])
  return translateContent(await fetchPostsPage(payload, input, sources), translate)
}
