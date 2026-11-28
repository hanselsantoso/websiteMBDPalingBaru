// @vitest-environment jsdom
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { LocaleProvider } from '@/components/providers/LocaleProvider'
import type { BlogPage } from '@/lib/blog-pagination'
import { BlogIndex } from './BlogIndex'

vi.mock('@/components/cards/Cards', () => ({ PostCard: ({ post }: { post: { title: string } }) => post.title }))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

it.each([
  { locale: 'id', dataPath: '/blog/data', retryLabel: 'Coba lagi', moreLabel: 'Muat lebih banyak' },
  { locale: 'en', dataPath: '/en/blog/data', retryLabel: 'Try again', moreLabel: 'Load more' },
] as const)('retries page one in $locale without displaying old articles', async ({ locale, dataPath, retryLabel, moreLabel }) => {
  vi.useFakeTimers()
  window.history.replaceState(null, '', '/')
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  const initialPage: BlogPage = { docs: [{ id: 'old', title: 'Artikel sebelumnya', slug: 'old' }], page: 1, hasNextPage: true, totalPages: 2, totalDocs: 10 }
  const filterPage: BlogPage = { docs: [{ id: 'new', title: 'Artikel data', slug: 'new' }], page: 1, hasNextPage: false, totalPages: 1, totalDocs: 1 }
  const fetchPage = vi.fn().mockResolvedValueOnce(new Response(null, { status: 503 })).mockResolvedValueOnce(Response.json(filterPage))
  vi.stubGlobal('fetch', fetchPage)
  const button = (name: string) => [...host.querySelectorAll('button')].find((item) => item.textContent?.trim() === name)
  try {
    const blog = createElement(BlogIndex, { initialPage, categories: [{ name: 'Data', slug: 'data' }], tags: [] })
    await act(() => root.render(createElement(LocaleProvider, { locale, children: blog })))
    await act(() => button('Data')?.click())
    await act(() => vi.advanceTimersByTimeAsync(300))
    expect(host.querySelector('[role=alert]')).not.toBeNull()
    expect(host.textContent).not.toContain('Artikel sebelumnya')
    expect(button(moreLabel)).toBeUndefined()
    await act(() => button(retryLabel)?.click())
    await act(() => vi.advanceTimersByTimeAsync(300))
    const urls = fetchPage.mock.calls.map(([url]) => new URL(String(url), 'http://localhost'))
    expect(urls.map((url) => url.pathname)).toEqual([dataPath, dataPath])
    expect(urls.map((url) => url.searchParams.get('page'))).toEqual(['1', '1'])
    expect(host.textContent).toContain('Artikel data')
  } finally {
    await act(() => root.unmount())
    host.remove()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  }
})
