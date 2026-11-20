import { describe, expect, it } from 'vitest'
import { readServerEnvironment } from '../environment'

const valid = { PAYLOAD_SECRET: 'test-only-secret-of-at-least-32-characters', DATABASE_URL: 'postgresql://user:password@localhost:55432/arus', NEXT_PUBLIC_SITE_URL: 'http://localhost:3000' }
describe('standalone runtime environment', () => {
  it('rejects missing or short secrets without disclosing their contents', () => {
    expect(() => readServerEnvironment({ ...valid, PAYLOAD_SECRET: undefined })).toThrow('PAYLOAD_SECRET')
    expect(() => readServerEnvironment({ ...valid, PAYLOAD_SECRET: 'too-short' })).toThrow('PAYLOAD_SECRET')
  })
  it('requires a PostgreSQL URL and a production HTTPS origin', () => {
    expect(() => readServerEnvironment({ ...valid, DATABASE_URL: 'mysql://localhost/arus' })).toThrow('DATABASE_URL')
    expect(() => readServerEnvironment({ ...valid, NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'http://public.example' })).toThrow('HTTPS')
  })
  it('normalizes the site origin and preserves server-only credentials', () => {
    const result = readServerEnvironment({ ...valid, NEXT_PUBLIC_SITE_URL: 'https://arus.example/' })
    expect(result.siteURL).toBe('https://arus.example')
    expect(result.databaseURL).toBe(valid.DATABASE_URL)
    expect(result.secret).toBe(valid.PAYLOAD_SECRET)
  })
})
