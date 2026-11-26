import { describe, expect, it } from 'vitest'
import { articleTextStyle } from '../article-text-state'

describe('article text styles', () => {
  it('combines recognized font, size, and color settings', () => {
    expect(articleTextStyle({ fontFamily: 'font-serif', fontSize: 'size-24', textColor: 'color-blue' })).toEqual({
      fontFamily: 'Georgia, serif',
      fontSize: '1.5rem',
      color: '#1646a3',
    })
  })

  it('preserves legacy text and ignores arbitrary stored keys and values', () => {
    expect(articleTextStyle(undefined)).toEqual({})
    expect(articleTextStyle({ fontFamily: 'url(https://example.invalid)', __proto__: 'pollute', fontSize: 'constructor' })).toEqual({})
  })
})
