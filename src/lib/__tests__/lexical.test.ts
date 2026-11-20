import { describe, expect, it } from 'vitest'
import { extractHeadings, lexicalText, readingMinutes } from '../lexical'

const paragraph = (text: string) => ({ type: 'paragraph', children: [{ type: 'text', text }] })
const heading = (tag: string, text: string) => ({
  type: 'heading',
  tag,
  children: [{ type: 'text', text }],
})

describe('lexical helpers', () => {
  it('extracts plain text and reading time', () => {
    const state = { root: { children: [paragraph('satu dua tiga'), paragraph('empat')] } }
    expect(lexicalText(state)).toBe('satu dua tiga\nempat')
    expect(readingMinutes(state)).toBe(1)
    expect(
      readingMinutes({
        root: { children: [paragraph(Array.from({ length: 1000 }, () => 'kata').join(' '))] },
      }),
    ).toBe(5)
    expect(readingMinutes(null)).toBe(1)
  })

  it('builds a table of contents from h2/h3 headings', () => {
    const state = {
      root: {
        children: [
          heading('h2', 'Kenapa MBD?'),
          heading('h4', 'Abaikan'),
          heading('h3', 'Karier'),
          heading('h2', '  '),
        ],
      },
    }
    expect(extractHeadings(state)).toEqual([
      { id: 'kenapa-mbd', text: 'Kenapa MBD?', level: 2 },
      { id: 'karier', text: 'Karier', level: 3 },
    ])
  })
})
