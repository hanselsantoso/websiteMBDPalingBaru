import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cache = vi.hoisted(() => ({ revalidateTag: vi.fn(), revalidatePath: vi.fn() }))
vi.mock('next/cache', () => cache)

import { verifyRevalidation } from '@/server/tokens'
import { revalidate, revalidateHooks } from '../revalidate'

const req = (context: Record<string, unknown> = {}) =>
  ({ context, payload: { secret: 'uji' } }) as never

beforeEach(() => {
  cache.revalidateTag.mockReset()
  cache.revalidatePath.mockReset()
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('revalidate', () => {
  it('expires each unique tag and path inside a Next.js request', async () => {
    await revalidate(req(), ['posts', 'post:a', 'posts', null, false], ['/blog', undefined])
    expect(cache.revalidateTag.mock.calls).toEqual([
      ['posts', { expire: 0 }],
      ['post:a', { expire: 0 }],
    ])
    expect(cache.revalidatePath.mock.calls).toEqual([['/blog']])
  })

  it('skips work when revalidation is disabled for the request', async () => {
    await revalidate(req({ disableRevalidate: true }), ['posts'])
    expect(cache.revalidateTag).not.toHaveBeenCalled()
  })

  it('asks the running site to expire tags when called outside a request', async () => {
    cache.revalidateTag.mockImplementation(() => {
      throw new Error('Invariant: static generation store missing')
    })
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('REVALIDATE_URL', 'http://127.0.0.1:3100/')

    await revalidate(req(), ['posts', 'post:a'])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [
      string,
      RequestInit & { headers: Record<string, string> },
    ]
    expect(url).toBe('http://127.0.0.1:3100/internal/revalidate')
    const body = String(init.body)
    expect(JSON.parse(body)).toMatchObject({ tags: ['posts', 'post:a'], paths: [] })
    expect(verifyRevalidation('uji', body, init.headers['x-arus-signature'])).toBe(true)
    expect(verifyRevalidation('lain', body, init.headers['x-arus-signature'])).toBe(false)
  })
})

describe('revalidateHooks', () => {
  it('covers the list plus the previous and current detail keys', async () => {
    const hooks = revalidateHooks((doc, prev) => [
      'posts',
      doc?.slug && `post:${doc.slug}`,
      prev?.slug && `post:${prev.slug}`,
    ])
    const doc = { slug: 'baru' }
    const result = await hooks.afterChange[0]({
      doc,
      previousDoc: { slug: 'lama' },
      req: req(),
    } as never)
    expect(result).toBe(doc)
    expect(cache.revalidateTag.mock.calls.map(([tag]) => tag)).toEqual([
      'posts',
      'post:baru',
      'post:lama',
    ])

    cache.revalidateTag.mockClear()
    await hooks.afterDelete[0]({ doc: { slug: 'hapus' }, req: req() } as never)
    expect(cache.revalidateTag.mock.calls.map(([tag]) => tag)).toEqual(['posts', 'post:hapus'])
  })
})
