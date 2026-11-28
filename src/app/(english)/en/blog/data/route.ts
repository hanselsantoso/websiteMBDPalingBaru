import { parseBlogPageInput } from '@/lib/blog-pagination'
import { getLocalizedBlogPage } from '@/lib/localized-content'

export async function GET(request: Request) {
  const input = parseBlogPageInput(new URL(request.url).searchParams)
  if (!input) return Response.json({ message: 'Invalid search parameters.' }, { status: 400 })
  try {
    return Response.json(await getLocalizedBlogPage(input), { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ message: 'Articles couldn’t be loaded. Please try again.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
