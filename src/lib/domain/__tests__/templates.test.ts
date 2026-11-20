import { describe, expect, it } from 'vitest'
import { applicationStatusLabel, renderTemplate } from '../templates'

describe('message templates', () => {
  it('replaces known variables and keeps unknown ones visible', () => {
    expect(
      renderTemplate('Halo {{nama}}, nomormu {{ nomor_pendaftaran }}. {{lainnya}}', {
        nama: 'Sari',
        nomor_pendaftaran: 'MBD-2026-0001',
      }),
    ).toBe('Halo Sari, nomormu MBD-2026-0001. {{lainnya}}')
    expect(renderTemplate('Gelombang {{gelombang}}', { gelombang: '' })).toBe(
      'Gelombang {{gelombang}}',
    )
  })

  it('labels application statuses in Indonesian', () => {
    expect(applicationStatusLabel('daftar-ulang')).toBe('Daftar Ulang')
    expect(applicationStatusLabel('tidak-dikenal')).toBe('Diproses')
  })
})
