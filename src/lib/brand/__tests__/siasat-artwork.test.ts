import { stat } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import sharp from 'sharp'
import { getSiasatArtwork, HERO_WAVE_ART, PROGRAM_WORDMARK, PROGRAM_WORDMARK_DARK, SIASAT_VARIANTS } from '../artwork'
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

  it('ships a transparent white wordmark for dark backgrounds', async () => {
    const logo = sharp(`public${PROGRAM_WORDMARK_DARK.src}`)
    const { width, height, hasAlpha } = await logo.metadata()
    expect({ width, height, hasAlpha }).toEqual({
      width: PROGRAM_WORDMARK_DARK.width,
      height: PROGRAM_WORDMARK_DARK.height,
      hasAlpha: true,
    })
    const { channels, isOpaque } = await logo.stats()
    expect(isOpaque).toBe(false)
    expect(channels.slice(0, 3).map(channel => channel.max)).toEqual([255, 255, 255])
  })

  it('ships the shallow hero divider as a lightweight transparent WebP', async () => {
    const path = `public${HERO_WAVE_ART}`
    const [{ format, width, height, hasAlpha }, { size }] = await Promise.all([sharp(path).metadata(), stat(path)])
    expect(format).toBe('webp')
    expect(hasAlpha).toBe(true)
    expect(width! / height!).toBeGreaterThan(5)
    expect(size).toBeLessThanOrEqual(60_000)
  })

  it('ships a transparent square image for each of the 25 expressions', async () => {
    expect(SIASAT_VARIANTS).toHaveLength(25)
    for (const variant of SIASAT_VARIANTS) {
      const { width, height, hasAlpha } = await sharp(`public${getSiasatArtwork(variant).url}`).metadata()
      expect(width, variant).toBe(height)
      expect(hasAlpha, variant).toBe(true)
    }
  })

  it('ships three sets of transparent 2×2 sprites sized for their network budgets', async () => {
    expect(SIASAT_CLIP_NAMES).toHaveLength(3)
    const maxBytes = { 192: 16_000, 384: 40_000, 640: 80_000, 896: 120_000 }
    for (const name of SIASAT_CLIP_NAMES) {
      const { poster, spriteSources } = SIASAT_CLIPS[name]
      const still = await sharp(`public${poster}`).metadata()
      expect(still.width).toBe(448)
      expect(still.height).toBe(448)
      expect(still.hasAlpha).toBe(true)
      expect(spriteSources.map(({ width }) => width)).toEqual([192, 384, 640, 896])
      for (const { src, width } of spriteSources) {
        const file = `public${src}`
        const [sheet, { size }] = await Promise.all([sharp(file).metadata(), stat(file)])
        expect(sheet.width, src).toBe(width)
        expect(sheet.height, src).toBe(width)
        expect(sheet.hasAlpha, src).toBe(true)
        expect(size, src).toBeLessThanOrEqual(maxBytes[width as keyof typeof maxBytes])
      }
    }
  })
})
