import type { PayloadRequest } from 'payload'
import { describe, expect, it, vi } from 'vitest'
import { v1Endpoints } from '../v1'

const findEndpoint = (path: string, method = 'get') => {
  const ep = v1Endpoints.find((item) => item.path === path && item.method === method)
  if (!ep) throw new Error(`Endpoint ${method.toUpperCase()} ${path} not found`)
  return ep.handler
}

describe('v1Endpoints', () => {
  it('strips custom scripts and turnstile keys from /v1/site while keeping public analytics IDs', async () => {
    const handler = findEndpoint('/v1/site', 'get')
    const req = {
      payload: {
        findGlobal: vi.fn(async ({ slug }: { slug: string }) =>
          slug === 'site-settings'
            ? {
                siteName: 'Arus Digital',
                integrations: {
                  ga4Id: 'G-TEST123',
                  metaPixelId: 'PX-1',
                  turnstileSiteKey: 'secret-site-key',
                  customHeadScripts: '<script>evil()</script>',
                },
              }
            : { header: [] },
        ),
      },
    } as unknown as PayloadRequest

    const res = await handler(req)
    const json = (await res.json()) as { data: { settings: Record<string, any> }; error: null }
    expect(res.status).toBe(200)
    expect(json.data.settings.integrations).toBeUndefined()
    expect(json.data.settings.analytics).toEqual({ ga4Id: 'G-TEST123', metaPixelId: 'PX-1' })
  })

  it('returns 422 on invalid form data and silently succeeds on honeypot bot submissions', async () => {
    const handler = findEndpoint('/v1/contact', 'post')
    const badReq = {
      headers: new Headers(),
      data: { name: 'A' },
      payload: {},
    } as unknown as PayloadRequest
    const badRes = await handler(badReq)
    expect(badRes.status).toBe(422)

    const botReq = {
      headers: new Headers(),
      data: {
        name: 'Bot',
        email: 'bot@example.com',
        phone: '081234567890',
        topic: 'info-pmb',
        message: 'Pesan spam minimal sepuluh karakter',
        consent: true,
        website: 'https://spam.example',
      },
      payload: {},
    } as unknown as PayloadRequest
    const botRes = await handler(botReq)
    expect(botRes.status).toBe(200)
    expect(await botRes.json()).toEqual({ data: { received: true }, meta: {}, error: null })
  })

  it('enforces admin authentication and module permissions on /v1/admin/* endpoints', async () => {
    const placeholders = findEndpoint('/v1/admin/placeholders', 'get')
    const unauthRes = await placeholders({
      user: null,
      context: {},
      payload: {},
    } as unknown as PayloadRequest)
    expect(unauthRes.status).toBe(401)

    const mediaUsage = findEndpoint('/v1/admin/media-usage/:id', 'get')
    const writerReq = {
      user: {
        id: 'w1',
        collection: 'admins',
        role: { key: 'penulis', permissions: { blog: { actions: ['lihat'] } } },
      },
      routeParams: { id: 'm1' },
      context: {},
      payload: {},
    } as unknown as PayloadRequest
    const forbiddenRes = await mediaUsage(writerReq)
    expect(forbiddenRes.status).toBe(403)
  })
})
