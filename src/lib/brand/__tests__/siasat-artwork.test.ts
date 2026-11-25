import { describe, expect, it } from 'vitest'
import sharp from 'sharp'
import { getSiasatArtwork, PROGRAM_WORDMARK, SIASAT_VARIANTS } from '../artwork'
import { SIASAT_CLIPS, SIASAT_CLIP_NAMES } from '../animation'

describe('illustrations shipped with the Siasat gallery', () => {
  it('ships the selected Jejak Siasat wordmark with its declared dimensions', async () => {
    expect(PROGRAM_WORDMARK.src).toBe('/images/brand/mbd-jejak-siasat.webp')
    const { width, height, hasAlpha } = await sharp(`public${PROGRAM_WORDMARK.src}`).metadata()
    expect({ width, height, hasAlpha }).toEqual({
      width: PROGRAM_WORDMARK.width,
      height: PROGRAM_WORDMARK.height,
      hasAlpha: true,
    })
  })

  it('ships a transparent square image for each of the 25 expressions', async () => {
    expect(SIASAT_VARIANTS).toHaveLength(25)
    for (const variant of SIASAT_VARIANTS) {
      const { width, height, hasAlpha } = await sharp(`public${getSiasatArtwork(variant).url}`).metadata()
      expect(width, variant).toBe(height)
      expect(hasAlpha, variant).toBe(true)
    }
  })

  it('ships three registered 2×2 sprite sheets and matching static posters', async () => {
    expect(SIASAT_CLIP_NAMES).toHaveLength(3)
    for (const name of SIASAT_CLIP_NAMES) {
      const { sprite, poster } = SIASAT_CLIPS[name]
      const [sheet, still] = await Promise.all([sharp(`public${sprite}`).metadata(), sharp(`public${poster}`).metadata()])
      expect(sheet.width).toBe(2 * still.width)
      expect(sheet.height).toBe(2 * still.height)
      expect(sheet.hasAlpha && still.hasAlpha).toBe(true)
    }
  })
})
