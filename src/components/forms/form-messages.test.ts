import { describe, expect, it } from 'vitest'
import { englishFormMessage } from './form-messages'

describe('englishFormMessage', () => {
  it('keeps actionable details in localized validation feedback', () => {
    expect(englishFormMessage('Coba lagi.')).toBe('Coba lagi.')
    expect(englishFormMessage('Rapor.pdf melebihi 2 MB.')).toBe('Rapor.pdf exceeds 2 MB.')
    expect(englishFormMessage('Terlalu banyak percobaan. Coba lagi dalam 12 detik.')).toBe(
      'Too many attempts. Try again in 12 seconds.',
    )
  })
})
