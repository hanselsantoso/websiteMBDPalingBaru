import type { Post } from '@/payload-types'

export type BlogPageInput = { page: number; limit: number; category?: string; tag?: string; query?: string }
export type BlogPost = Pick<Post, 'id' | 'title' | 'slug' | 'excerpt' | 'cover' | 'category' | 'tags' | 'featured' | 'publishedAt' | 'readingMinutes' | 'authorName'>
export type BlogPage = { docs: BlogPost[]; page: number; totalPages: number; totalDocs: number; hasNextPage: boolean }

export function parseBlogPageInput(params: URLSearchParams): BlogPageInput | null {
  const page = Number(params.get('page') || 1)
  const limit = Number(params.get('limit') || 9)
  const query = (params.get('q') || '').trim()
  const category = (params.get('kategori') || '').trim()
  const tag = (params.get('tag') || '').trim()
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 30 || query.length > 80 || category.length > 100 || tag.length > 100) return null
  return { page, limit, query, category, tag }
}
