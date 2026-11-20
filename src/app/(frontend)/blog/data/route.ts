import { parseBlogPageInput } from '@/lib/blog-pagination'
import { getPostsPage } from '@/lib/data'

export async function GET(request: Request) {
  const input = parseBlogPageInput(new URL(request.url).searchParams)
  if (!input) return Response.json({ message: 'Parameter pencarian tidak valid.' }, { status: 400 })
  try {
    return Response.json(await getPostsPage(input), { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ message: 'Artikel belum dapat dimuat. Coba lagi.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
