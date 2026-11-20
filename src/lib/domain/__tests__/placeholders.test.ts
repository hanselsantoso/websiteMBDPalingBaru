import { describe, expect, it } from 'vitest'
import { findPlaceholders, isPlaceholder, placeholderHint } from '../placeholders'

describe('placeholders', () => {
  it('detects [ISI] tokens and empty values', () => {
    expect(isPlaceholder('[ISI]')).toBe(true)
    expect(isPlaceholder('Rp [ISI: nominal]')).toBe(true)
    expect(isPlaceholder('  ')).toBe(true)
    expect(isPlaceholder(null)).toBe(true)
    expect(isPlaceholder('Surabaya')).toBe(false)
    expect(isPlaceholder(0)).toBe(false)
  })

  it('extracts hints', () => {
    expect(placeholderHint('[ISI: tahun akademik]')).toBe('tahun akademik')
    expect(placeholderHint('[ISI]')).toBeNull()
  })

  it('lists nested placeholder paths and skips system keys', () => {
    const hits = findPlaceholders({
      id: '[ISI]',
      title: 'OK',
      layout: [{ blockType: '[ISI]', heading: '[ISI: judul]' }],
      contact: { phone: '[ISI]' },
    })
    expect(hits).toEqual([
      { path: 'layout.0.heading', value: '[ISI: judul]' },
      { path: 'contact.phone', value: '[ISI]' },
    ])
  })
})
