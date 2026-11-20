// @vitest-environment jsdom
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Turnstile } from '../fields'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let root: Root
let host: HTMLDivElement
beforeEach(() => { host = document.createElement('div'); document.body.append(host); root = createRoot(host) })
afterEach(async () => { await act(() => root.unmount()); host.remove(); delete window.turnstile; vi.restoreAllMocks() })

describe('Turnstile lifecycle', () => {
  it('keeps one widget on rerender while delivering tokens to the latest callback', async () => {
    let options: Record<string, unknown> = {}
    let widgets = 0
    window.turnstile = { render: (_el, next) => { options = next; return String(++widgets) }, remove: () => {} }
    const tokens: string[] = []
    await act(() => root.render(createElement(Turnstile, { siteKey: 'site-key', onToken: (token) => tokens.push(`old:${token}`) })))
    await act(() => root.render(createElement(Turnstile, { siteKey: 'site-key', onToken: (token) => tokens.push(`new:${token}`) })))
    ;(options.callback as (token: string) => void)('accepted')
    expect(widgets).toBe(1)
    expect(tokens).toEqual(['old:', 'new:accepted'])
  })

  it('clears a token when the provider expires it', async () => {
    let options: Record<string, unknown> = {}
    window.turnstile = { render: (_el, next) => { options = next; return 'widget' }, remove: () => {} }
    const tokens: string[] = []
    await act(() => root.render(createElement(Turnstile, { siteKey: 'site-key', onToken: (token) => tokens.push(token) })))
    ;(options.callback as (token: string) => void)('accepted')
    const expired = options['expired-callback'] as (() => void) | undefined
    expired?.()
    expect(tokens).toEqual(['', 'accepted', ''])
  })
})
