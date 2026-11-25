import type { PayloadRequest } from 'payload'
import { describe, expect, it, vi } from 'vitest'
import { v1Endpoints } from '../v1'

const findEndpoint = (path: string, method = 'get') => {
  const ep = v1Endpoints.find((item) => item.path === path && item.method === method)
  if (!ep) throw new Error(`Endpoint ${method.toUpperCase()} ${path} not found`)
  return ep.handler
}

describe('v1Endpoints', () => {
  it('rejects malformed analytics JSON without reading the request body twice', async () => {
    const request = new Request('http://localhost/api/v1/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-real-ip': '198.51.100.32' },
      body: '{',
    })
    const req = Object.assign(request, { payload: { logger: { error: vi.fn() } } })
    const res = await findEndpoint('/v1/events', 'post')(req as unknown as PayloadRequest)
    expect(res.status).toBe(422)
  })

  it('returns an empty 204 when analytics requests exceed the limit', async () => {
    const handler = findEndpoint('/v1/events', 'post')
    const req = { headers: new Headers({ 'x-real-ip': '198.51.100.203' }), json: async () => ({}), payload: {} } as unknown as PayloadRequest
    for (let i = 0; i < 60; i++) expect((await handler(req)).status).toBe(422)
    const response = await handler(req)
    expect(response.status).toBe(204)
    expect(await response.text()).toBe('')
    expect(response.headers.get('cache-control')).toBe('no-store')
  })

  it('sends the selected email template and reports provider failure', async () => {
    const delivered: { subject: string; text: string; to: string }[] = []
    let providerFails = false
    const selected = { id: 'template-b', channel: 'email', statusKey: 'baru', subject: 'Selected {{nama}}', body: 'Selected body {{nomor_pendaftaran}}' }
    const req = {
      user: { id: 'admin-1', collection: 'admins', email: 'admin@example.test', role: { key: 'super-admin' } },
      context: {}, routeParams: { id: 'template-b' },
      payload: {
        findByID: async () => selected,
        find: async () => ({ docs: [{ ...selected, id: 'template-a', subject: 'Wrong template', body: 'Wrong body' }] }),
        sendEmail: async (message: typeof delivered[number]) => { if (providerFails) throw new Error('Provider unavailable'); delivered.push(message) },
        logger: { warn: vi.fn(), error: vi.fn() },
      },
    } as unknown as PayloadRequest
    const handler = findEndpoint('/v1/admin/message-templates/:id/test', 'post')
    const success = await handler(req)
    expect(success.status).toBe(200)
    expect(delivered[0]).toMatchObject({ to: 'admin@example.test', subject: 'Selected Calon Mahasiswa (tes)', text: 'Selected body MBD-0000-0000' })
    providerFails = true
    const failed = await handler(req)
    expect(failed.status).toBeGreaterThanOrEqual(400)
    expect(await failed.json()).toMatchObject({ data: null, error: { code: 'email_failed' } })
  })
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
    expect(json.data.settings.siteName).toBe('S1 Manajemen Bisnis Digital')
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
