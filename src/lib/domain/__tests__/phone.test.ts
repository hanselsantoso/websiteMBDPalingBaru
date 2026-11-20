import { describe, expect, it } from 'vitest'
import { maskPhone, normalizeEmail, normalizePhone, phoneSuffix, waLink } from '../phone'

describe('normalizePhone', () => {
  it.each([
    ['0812-3456-7890', '6281234567890'],
    ['+62 812 3456 7890', '6281234567890'],
    ['812 3456 7890', '6281234567890'],
    ['6281234567890', '6281234567890'],
  ])('normalizes %s', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected)
  })

  it.each(['', '12345', 'abc', '+1 415 555 0100', null, undefined])('rejects %s', (input) => {
    expect(normalizePhone(input)).toBeNull()
  })
})

describe('phone helpers', () => {
  it('builds wa.me links and skips placeholders', () => {
    expect(waLink('0812 3456 7890', 'Halo MBD')).toBe('https://wa.me/6281234567890?text=Halo%20MBD')
    expect(waLink('[ISI: nomor WhatsApp]')).toBeNull()
    expect(waLink('0812 3456 7890', '[ISI]')).toBe('https://wa.me/6281234567890')
  })

  it('masks and extracts suffixes', () => {
    expect(maskPhone('081234567890')).toMatch(/^62812•+7890$/)
    expect(phoneSuffix('0812-3456-7890')).toBe('7890')
  })

  it('normalizes emails', () => {
    expect(normalizeEmail('  Nama@Email.COM ')).toBe('nama@email.com')
    expect(normalizeEmail('bukan-email')).toBeNull()
  })
})
