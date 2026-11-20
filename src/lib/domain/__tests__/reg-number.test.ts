import { describe, expect, it } from 'vitest'
import {
  formatRegNumber,
  isValidRegNumber,
  jakartaYear,
  nextRegNumber,
  parseRegNumber,
} from '../reg-number'

describe('registration numbers', () => {
  it('formats MBD-YYYY-NNNN', () => {
    expect(formatRegNumber(2026, 7)).toBe('MBD-2026-0007')
    expect(() => formatRegNumber(2026, 0)).toThrow()
    expect(() => formatRegNumber(2026, 10000)).toThrow()
  })

  it('parses case-insensitively and validates', () => {
    expect(parseRegNumber(' mbd-2026-0042 ')).toEqual({ year: 2026, sequence: 42 })
    expect(parseRegNumber('MBD-26-42')).toBeNull()
    expect(isValidRegNumber('MBD-2026-0000')).toBe(false)
  })

  it('increments within a year and restarts at 0001 in a new year', () => {
    const existing = ['MBD-2026-0001', 'MBD-2026-0009', 'MBD-2025-0120']
    expect(nextRegNumber(2026, existing)).toBe('MBD-2026-0010')
    expect(nextRegNumber(2027, existing)).toBe('MBD-2027-0001')
  })

  it('uses the Asia/Jakarta calendar year for rollover', () => {
    expect(jakartaYear(new Date('2026-12-31T16:59:00Z'))).toBe(2026)
    expect(jakartaYear(new Date('2026-12-31T17:00:00Z'))).toBe(2027)
  })
})
