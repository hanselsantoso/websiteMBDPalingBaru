// @vitest-environment jsdom
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, expect, it, vi } from 'vitest'
const pending = vi.hoisted(() => new Map<string, (hits: unknown[]) => void>())
vi.mock('@/app/(frontend)/actions', () => ({ searchAction: (query: string) => new Promise((resolve) => pending.set(query, resolve)) }))
vi.mock('@/lib/analytics', () => ({ track: () => {} }))
import { SiteSearch } from './SiteSearch'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
afterEach(() => { vi.useRealTimers(); pending.clear() })

it('keeps the newer query results when an older request finishes last', async () => {
  vi.useFakeTimers()
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  try {
    await act(() => root.render(createElement(SiteSearch)))
    const input = host.querySelector('input')!
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
    const enter = async (value: string) => {
      await act(() => { setValue.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })) })
      await act(() => vi.advanceTimersByTime(300))
    }
    await enter('lama')
    await enter('baru')
    expect([...pending.keys()]).toEqual(['lama', 'baru'])
    await act(async () => { pending.get('baru')!([{ type: 'artikel', title: 'Hasil terbaru', href: '/blog/baru', meta: '' }]) })
    await act(async () => { pending.get('lama')!([{ type: 'artikel', title: 'Hasil lama', href: '/blog/lama', meta: '' }]) })
    expect(host.textContent).toContain('Hasil terbaru')
    expect(host.textContent).not.toContain('Hasil lama')
  } finally { await act(() => root.unmount()); host.remove() }
})
