import { describe, expect, it, vi } from 'vitest'
const database = vi.hoisted(() => ({ healthy: true }))
vi.mock('@/lib/payload', () => ({ getPayloadClient: async () => {
  if (!database.healthy) throw new Error('private connection failure')
  return { count: async () => ({ totalDocs: 0 }) }
} }))
import { GET } from '@/app/(frontend)/health/route'

describe('health endpoint', () => {
  it('distinguishes process liveness from database readiness without exposing errors', async () => {
    database.healthy = false
    expect((await GET(new Request('http://localhost/health'))).status).toBe(200)
    const unavailable = await GET(new Request('http://localhost/health?ready=1'))
    expect(unavailable.status).toBe(503)
    expect(await unavailable.json()).toEqual({ status: 'unavailable' })
    database.healthy = true
    expect((await GET(new Request('http://localhost/health?ready=1'))).status).toBe(200)
  })
})
