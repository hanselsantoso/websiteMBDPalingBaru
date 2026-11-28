import { describe, expect, it } from 'vitest'
import { canonicalCrewHref, crewCopy, crewGalleryLabel, pivotDisplayName } from '@/lib/brand/crew'
import { withLocale } from '@/lib/i18n'
import { buildNav } from '@/lib/site'

describe('MBD Crew branding compatibility', () => {
  it('updates historical mascot copy while keeping the selected team name', () => {
    expect(crewCopy('Siasat, Rara, Kiko, Bimo, Uli, Piko')).toBe('Pivot, Proto, Metric, Flow, Sage, Reach')
    expect(crewCopy('Siasat and Friends Gallery')).toBe('MBD Crew')
    expect(crewGalleryLabel('Lihat Galeri Siasat')).toBe('Lihat MBD Crew')
    expect(crewGalleryLabel('Rara dan Uli berbagi pengalaman')).toBe('Rara dan Uli berbagi pengalaman')
  })

  it('maps legacy CMS names and retains an explicit custom name', () => {
    expect(pivotDisplayName(' Sia ')).toBe('Pivot')
    expect(pivotDisplayName('Siasat')).toBe('Pivot')
    expect(pivotDisplayName(undefined)).toBe('Pivot')
    expect(pivotDisplayName('Custom mascot')).toBe('Custom mascot')
  })

  it('normalizes old gallery paths without rewriting assets or external URLs', () => {
    expect(withLocale('/siasat?from=home#teman-siasat', 'en')).toBe('/en/mbd-crew?from=home#teman-siasat')
    expect(withLocale('/en/siasat#maskot-rara', 'id')).toBe('/mbd-crew#maskot-rara')
    expect(canonicalCrewHref('/images/mascot/siasat.webp')).toBe('/images/mascot/siasat.webp')
    expect(canonicalCrewHref('https://example.org/siasat')).toBe('https://example.org/siasat')
  })

  it('keeps the original translation key for stored navigation labels', () => {
    const [link] = buildNav([{ label: 'Lihat Galeri Siasat', linkType: 'path', path: '/siasat' }])
    expect(link.label).toBe('Lihat Galeri Siasat')
    expect(link.href).toBe('/mbd-crew')
  })
})
