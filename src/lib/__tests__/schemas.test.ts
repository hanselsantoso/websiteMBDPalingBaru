import { describe, expect, it } from 'vitest'
import {
  contactSchema,
  eventSchema,
  fieldErrors,
  pmbApplicationSchema,
  pmbStatusSchema,
  quizAttemptSchema,
} from '../schemas'

const validContact = {
  name: 'Sari Wulandari',
  email: 'sari@email.com',
  phone: '0812 3456 7890',
  topic: 'info-pmb',
  message: 'Kapan gelombang berikutnya dibuka?',
  consent: true,
}

describe('form schemas', () => {
  it('accepts a valid contact message', () => {
    expect(contactSchema.safeParse(validContact).success).toBe(true)
  })

  it('returns Indonesian field errors', () => {
    const result = contactSchema.safeParse({
      ...validContact,
      email: 'salah',
      phone: '123',
      consent: false,
      topic: 'x',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = fieldErrors(result.error)
      expect(Object.keys(errors).sort()).toEqual(['consent', 'email', 'phone', 'topic'])
      expect(errors.email).toMatch(/email yang valid/)
    }
  })

  it('normalizes registration numbers when checking PMB status', () => {
    const result = pmbStatusSchema.safeParse({ regNumber: ' mbd-2026-0001 ', phoneSuffix: '7890' })
    expect(result.success && result.data.regNumber).toBe('MBD-2026-0001')
    expect(
      pmbStatusSchema.safeParse({ regNumber: 'MBD-2026-0001', phoneSuffix: '78' }).success,
    ).toBe(false)
  })

  it('validates the full PMB application', () => {
    const year = String(new Date().getUTCFullYear())
    const base = {
      fullName: 'Budi Santoso',
      email: 'budi@email.com',
      phone: '081234567890',
      city: 'Surabaya',
      schoolName: 'SMA Negeri 1',
      schoolMajor: 'IPS',
      graduationYear: year,
      trackId: 'track-1',
      waveId: 'wave-1',
      source: 'Instagram',
      consent: true,
    }
    expect(pmbApplicationSchema.safeParse(base).success).toBe(true)
    expect(pmbApplicationSchema.safeParse({ ...base, graduationYear: '1990' }).success).toBe(false)
    expect(pmbApplicationSchema.safeParse({ ...base, consent: false }).success).toBe(false)
  })

  it('bounds quiz answers and analytics events', () => {
    expect(quizAttemptSchema.safeParse({ answers: {} }).success).toBe(false)
    expect(quizAttemptSchema.safeParse({ answers: { q1: 'a' } }).success).toBe(true)
    expect(eventSchema.safeParse({ name: 'not_found', path: '/x' }).success).toBe(true)
    expect(eventSchema.safeParse({ name: 'hack' }).success).toBe(false)
  })
})
