import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildPreviewUrl, verifyPreview } from '@/lib/preview'
import { signDownload, verifyDownload } from '../tokens'

const SECRET = 'uji-rahasia'

afterEach(() => vi.useRealTimers())

describe('signed links', () => {
  it('verifies brochure download signatures and expiry', () => {
    const { exp, sig } = signDownload(SECRET, 'file-1', 30)
    expect(verifyDownload(SECRET, 'file-1', String(exp), sig)).toBe(true)
    expect(verifyDownload(SECRET, 'file-2', String(exp), sig)).toBe(false)
    expect(verifyDownload('lain', 'file-1', String(exp), sig)).toBe(false)
    vi.useFakeTimers()
    vi.setSystemTime(exp + 1)
    expect(verifyDownload(SECRET, 'file-1', String(exp), sig)).toBe(false)
  })

  it('only accepts signed, same-site preview paths', () => {
    const url = new URL(buildPreviewUrl(SECRET, '/blog/draf'))
    const exp = url.searchParams.get('exp') ?? ''
    const sig = url.searchParams.get('sig') ?? ''
    expect(verifyPreview(SECRET, '/blog/draf', exp, sig)).toBe(true)
    expect(verifyPreview(SECRET, '/blog/lain', exp, sig)).toBe(false)
    expect(verifyPreview(SECRET, '//evil.example', exp, sig)).toBe(false)
  })
})
