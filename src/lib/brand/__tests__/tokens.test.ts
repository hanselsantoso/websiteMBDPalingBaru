import { describe, expect, it } from 'vitest'
import {
  assertBrandContrast,
  buildInkScale,
  contrastRatio,
  DEFAULT_BRAND,
  evaluateBrandContrast,
  mix,
  resolveBrandColors,
} from '../tokens'

describe('brand tokens', () => {
  it('computes WCAG contrast ratios', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBe(21)
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBe(1)
  })

  it('passes every required text pair with the default palette', () => {
    const failures = evaluateBrandContrast(DEFAULT_BRAND).filter((result) => !result.pass)
    expect(failures).toEqual([])
    expect(() => assertBrandContrast()).not.toThrow()
  })

  it('rejects palettes that break contrast', () => {
    expect(() => assertBrandContrast({ ...DEFAULT_BRAND, blue: '#9CC2FF' })).toThrow(/WCAG AA/)
  })

  it('derives the ink scale from navy toward white', () => {
    const ink = buildInkScale(DEFAULT_BRAND.navy)
    expect(ink['50']).toBe(mix(DEFAULT_BRAND.navy, '#FFFFFF', 0.04))
    expect(contrastRatio(ink['900'], '#FFFFFF')).toBeGreaterThan(
      contrastRatio(ink['100'], '#FFFFFF'),
    )
  })

  it('falls back to defaults for invalid CMS colors', () => {
    expect(resolveBrandColors({ blue: 'merah', navy: ' #000000 ' })).toEqual({
      ...DEFAULT_BRAND,
      navy: '#000000',
    })
  })
})
