import type { Payload } from 'payload'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { clientIp, guardForm, rateLimit, verifyCaptcha } from '../guard'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

const fakePayload = (siteKey: string | null = null) =>
  ({
    findGlobal: vi.fn().mockResolvedValue({ integrations: { turnstileSiteKey: siteKey } }),
  }) as unknown as Payload

describe('clientIp', () => {
  it('prefers the first x-forwarded-for entry and falls back to x-real-ip', () => {
    expect(clientIp(new Headers({ 'x-forwarded-for': '203.0.113.1, 10.0.0.1' }))).toBe(
      '203.0.113.1',
    )
    expect(clientIp(new Headers({ 'x-real-ip': '198.51.100.5' }))).toBe('198.51.100.5')
    expect(clientIp(new Headers())).toBe('unknown')
  })
})

describe('rateLimit', () => {
  it('enforces the sliding window and recovers after expiry', () => {
    vi.useFakeTimers()
    const key = `test:${Date.now()}`
    expect(rateLimit(key, 2, 10_000)).toEqual({ ok: true, retryAfter: 0 })
    expect(rateLimit(key, 2, 10_000)).toEqual({ ok: true, retryAfter: 0 })
    const blocked = rateLimit(key, 2, 10_000)
    expect(blocked.ok).toBe(false)
    expect(blocked.retryAfter).toBeGreaterThan(0)
    vi.advanceTimersByTime(10_001)
    expect(rateLimit(key, 2, 10_000).ok).toBe(true)
  })
})

describe('verifyCaptcha & guardForm', () => {
  it('blocks verification when captcha settings are temporarily unavailable', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', '')
    const payload = { findGlobal: async () => { throw new Error('Storage unavailable') } } as unknown as Payload
    expect(await verifyCaptcha(payload, undefined, '127.0.0.1')).toBe(false)
  })
  it('allows disabled captcha but rejects partially configured protection', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', '')
    expect(await verifyCaptcha(fakePayload(null), undefined, '1.1.1.1')).toBe(true)
    expect(await verifyCaptcha(fakePayload('site-key'), undefined, '1.1.1.1')).toBe(false)
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secret')
    expect(await verifyCaptcha(fakePayload(null), undefined, '1.1.1.1')).toBe(false)
  })

  it('verifies the token with Cloudflare when both keys are set', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secret')
    const payload = fakePayload('site-key')
    expect(await verifyCaptcha(payload, undefined, '1.1.1.1')).toBe(false)

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ success: true })))
    expect(await verifyCaptcha(payload, 'tok-ok', '1.1.1.1')).toBe(true)

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ success: false })))
    expect(await verifyCaptcha(payload, 'tok-bad', '1.1.1.1')).toBe(false)
  })

  it('flags honeypot submissions as bot without hitting rate limits', async () => {
    const payload = fakePayload(null)
    expect(
      await guardForm(payload, { form: 'kontak', ip: '9.9.9.9', honeypot: 'http://spam' }),
    ).toEqual({ status: 'bot' })
    expect(await guardForm(payload, { form: 'kontak-ok', ip: '9.9.9.9', honeypot: '' })).toEqual({
      status: 'ok',
    })
  })
})
