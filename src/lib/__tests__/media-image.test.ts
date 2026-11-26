import { describe, expect, it } from 'vitest'
import { cmsImageSrc } from '../media-image'

const site = 'http://127.0.0.1:3002'

describe('CMS image input for Next.js', () => {
  it('uses internal optimization for an uploaded file on the configured site', () => {
    expect(cmsImageSrc(`${site}/api/media/file/logo%20baru.webp?v=2`, site)).toBe('/api/media/file/logo%20baru.webp?v=2')
  })

  it('preserves bundled files and other asset origins', () => {
    expect(cmsImageSrc('/images/brand/mbd-jejak-siasat.webp', site)).toBe('/images/brand/mbd-jejak-siasat.webp')
    expect(cmsImageSrc('https://cdn.example.com/api/media/file/logo.webp', site)).toBe('https://cdn.example.com/api/media/file/logo.webp')
    expect(cmsImageSrc('http://127.0.0.1:3000/api/media/file/logo.webp', site)).toBe('http://127.0.0.1:3000/api/media/file/logo.webp')
  })

  it('only switches the public Media file route to an internal path', () => {
    expect(cmsImageSrc(`${site}/api/pmb-documents/file/private.pdf`, site)).toBe(`${site}/api/pmb-documents/file/private.pdf`)
  })
})
