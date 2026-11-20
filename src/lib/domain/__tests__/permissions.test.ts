import { describe, expect, it } from 'vitest'
import {
  can,
  normalizeMatrix,
  parseLetters,
  resolvePermissions,
  scopeFor,
  SYSTEM_ROLES,
  toLetters,
} from '../permissions'

describe('permission matrix', () => {
  it('parses compact letter specs', () => {
    expect(parseLetters('lbuh')).toEqual(['lihat', 'buat', 'ubah', 'hapus'])
    expect(parseLetters('LLX')).toEqual(['lihat'])
    expect(toLetters({ actions: ['ubah', 'lihat'] })).toBe('LU')
    expect(toLetters(undefined)).toBe('-')
  })

  it('drops unknown modules, actions and empty entries from stored JSON', () => {
    expect(
      normalizeMatrix({
        blog: { actions: ['lihat', 'terbang', 'lihat'], scope: 'own' },
        rahasia: { actions: ['lihat'] },
        media: { actions: [] },
      }),
    ).toEqual({ blog: { actions: ['lihat'], scope: 'own' } })
    expect(normalizeMatrix('bukan objek')).toEqual({})
  })

  it('grants super admins everything', () => {
    const permissions = resolvePermissions({ key: 'super-admin' })
    expect(can(permissions, 'pengguna', 'hapus')).toBe(true)
    expect(scopeFor(permissions, 'blog', 'ubah')).toBe('all')
  })

  it('applies role matrices with own scope', () => {
    const writer = resolvePermissions({
      key: 'penulis',
      permissions: { blog: { actions: ['lihat', 'buat', 'ubah'], scope: 'own' } },
    })
    expect(can(writer, 'blog', 'ubah')).toBe(true)
    expect(can(writer, 'blog', 'terbitkan')).toBe(false)
    expect(scopeFor(writer, 'blog', 'ubah')).toBe('own')
    expect(scopeFor(writer, 'pmb', 'lihat')).toBeNull()
    expect(can(null, 'blog', 'lihat')).toBe(false)
  })

  it('defines the six system roles', () => {
    expect(Object.keys(SYSTEM_ROLES).sort()).toEqual([
      'admin',
      'editor',
      'penulis',
      'staf-marketing',
      'staf-pmb',
      'super-admin',
    ])
  })
})
