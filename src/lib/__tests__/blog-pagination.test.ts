import type { Payload } from 'payload'
import { describe, expect, it } from 'vitest'
import { fetchPostsPage } from '../queries'
import { parseBlogPageInput } from '../blog-pagination'

describe('blog pagination', () => {
  it('rejects invalid pages and bounds caller-controlled page sizes', () => {
    expect(parseBlogPageInput(new URLSearchParams('page=0'))).toBeNull()
    expect(parseBlogPageInput(new URLSearchParams('limit=31'))).toBeNull()
    expect(parseBlogPageInput(new URLSearchParams('page=7&limit=9&q=data'))).toEqual({ page: 7, limit: 9, query: 'data', category: '', tag: '' })
  })
  it('requests the seventh page so the 61st published article can be reached', async () => {
    const rows = Array.from({ length: 61 }, (_, index) => ({ id: String(index + 1), title: `Article ${index + 1}` }))
    let observed: Record<string, unknown> = {}
    const payload = { find: async (options: { page: number; limit: number }) => {
      observed = options
      return { docs: rows.slice((options.page - 1) * options.limit, options.page * options.limit), page: options.page, totalPages: 7, totalDocs: 61, hasNextPage: false }
    } } as unknown as Payload
    const result = await fetchPostsPage(payload, { page: 7, limit: 9 })
    expect(result.docs.map((post) => post.id)).toContain('61')
    expect(result.hasNextPage).toBe(false)
    expect(observed.overrideAccess).toBe(false)
    expect(observed.where).toMatchObject({ and: [{ _status: { equals: 'published' } }] })
  })
})
