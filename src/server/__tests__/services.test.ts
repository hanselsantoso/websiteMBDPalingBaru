import type { Payload } from 'payload'
import { describe, expect, it, vi } from 'vitest'
import { pickActiveWave } from '@/lib/queries'
import { recordEvent } from '../services/events'
import {
  checkPmbStatus,
  requestBrochure,
  submitContact,
  submitPmbApplication,
  submitQuizAttempt,
  submitQuizLead,
} from '../services/forms'
import { upsertLead } from '../services/leads'
import { searchSite } from '../services/search'

describe('upsertLead', () => {
  it('creates a new lead and merges subsequent touches without downgrading status', async () => {
    let stored: Record<string, any> | null = null
    const payload = {
      find: vi.fn(async () => ({ docs: stored ? [stored] : [] })),
      create: vi.fn(async ({ data }: { data: Record<string, any> }) => {
        stored = { id: 'lead-1', ...data }
        return stored
      }),
      update: vi.fn(async ({ data }: { data: Record<string, any> }) => {
        stored = { ...stored, ...data }
        return stored
      }),
    } as unknown as Payload

    const first = await upsertLead(payload, {
      name: 'Rina',
      phone: '0812-3456-7890',
      email: 'Rina@Email.com',
      source: 'brosur',
      consent: true,
    })
    expect(first.status).toBe('baru')
    expect(first.sources).toEqual(['brosur'])

    const merged = await upsertLead(payload, {
      name: 'Rina Putri',
      phone: '+62 812 3456 7890',
      source: 'pmb',
      consent: true,
    })
    expect(merged.sources).toEqual(['brosur', 'pmb'])
    expect(merged.status).toBe('pre-registrasi')

    stored!.status = 'daftar'
    const afterDaftar = await upsertLead(payload, {
      name: 'Rina',
      phone: '081234567890',
      source: 'kontak',
    })
    expect(afterDaftar.status).toBe('daftar')
  })
})

describe('recordEvent & searchSite', () => {
  it('logs 404 paths once and increments hits while ignoring system prefixes', async () => {
    const logs: Record<string, { id: string; hits: number }> = {}
    const payload = {
      create: vi.fn(
        async ({ collection, data }: { collection: string; data: Record<string, any> }) => {
          if (collection === 'not-found-logs') logs[data.path] = { id: 'nf-1', hits: data.hits }
          return { id: '1' }
        },
      ),
      find: vi.fn(async ({ where }: { where: Record<string, any> }) => {
        const hit = logs[where.path.equals]
        return { docs: hit ? [hit] : [] }
      }),
      update: vi.fn(async ({ data }: { data: { hits: number } }) => {
        logs['/hilang'].hits = data.hits
      }),
      logger: { warn: vi.fn() },
    } as unknown as Payload

    await recordEvent(payload, { name: 'not_found', path: '/_next/static/chunk.js' })
    expect(Object.keys(logs)).toEqual([])

    await recordEvent(payload, { name: 'not_found', path: '/hilang?x=1#top' })
    await recordEvent(payload, { name: 'not_found', path: '/hilang' })
    expect(logs['/hilang']?.hits).toBe(2)
  })

  it('searches courses, faculty, and articles and skips 1-character queries', async () => {
    const payload = {
      find: vi.fn(async ({ collection }: { collection: string }) => {
        if (collection === 'curriculum-versions') return { docs: [{ id: 'v1' }] }
        if (collection === 'courses')
          return { docs: [{ name: 'Analitik Bisnis', slug: 'bd201', code: 'BD201', semester: 2 }] }
        if (collection === 'faculty')
          return { docs: [{ name: 'Dr. Andi', slug: 'andi', position: 'Lektor' }] }
        return { docs: [{ title: 'Belajar Data', slug: 'belajar-data' }] }
      }),
    } as unknown as Payload

    expect(await searchSite(payload, 'a')).toEqual([])
    const hits = await searchSite(payload, 'data')
    expect(hits.map((h) => h.href)).toEqual([
      '/kurikulum/bd201',
      '/dosen/andi',
      '/blog/belajar-data',
    ])
  })
})

describe('forms service', () => {
  const validPmb = {
    fullName: 'Budi Santoso',
    email: 'budi@email.com',
    phone: '081234567890',
    city: 'Surabaya',
    schoolName: 'SMA 1',
    schoolMajor: 'IPA',
    graduationYear: '2026',
    trackId: 't1',
    waveId: 'w1',
    source: 'Instagram',
    consent: true,
  }

  it('validates PMB wave/track, checks document magic bytes, retries regNumber collisions, and survives follow-up errors', async () => {
    let createAttempts = 0
    const payload = {
      secret: 'secret',
      logger: { error: vi.fn(), warn: vi.fn() },
      findByID: vi.fn(async ({ collection }: { collection: string }) => {
        if (collection === 'pmb-waves') return { id: 'w1', name: 'Gelombang 1', status: 'dibuka' }
        if (collection === 'pmb-tracks') return { id: 't1', name: 'Reguler', isActive: true }
        return null
      }),
      findGlobal: vi.fn(async () => ({ documentUploadEnabled: true, maxDocumentMb: 1 })),
      find: vi.fn(async () => ({ docs: [] })),
      create: vi.fn(async ({ collection }: { collection: string }) => {
        if (collection === 'pmb-applications') {
          createAttempts++
          if (createAttempts === 1) throw new Error('duplicate regNumber')
          return { id: 'app-1', regNumber: 'MBD-2026-0001', email: validPmb.email, status: 'baru' }
        }
        if (collection === 'leads') throw new Error('simulated lead failure')
        return { id: 'doc-1' }
      }),
      update: vi.fn(async () => ({})),
      sendEmail: vi.fn(async () => ({})),
    } as unknown as Payload

    const badPdf = await submitPmbApplication(payload, validPmb, [
      {
        name: 'rapor.pdf',
        type: 'application/pdf',
        size: 100,
        data: Buffer.from('NOT_A_PDF'),
        kind: 'rapor',
      },
    ])
    expect(badPdf.ok).toBe(false)

    const goodPdf = await submitPmbApplication(payload, validPmb, [
      {
        name: 'rapor.pdf',
        type: 'application/pdf',
        size: 100,
        data: Buffer.from('%PDF-1.7 test'),
        kind: 'rapor',
      },
    ])
    expect(goodPdf).toEqual({
      ok: true,
      data: { regNumber: 'MBD-2026-0001', name: 'Budi Santoso', waveName: 'Gelombang 1' },
    })
    expect(createAttempts).toBe(2)
  })

  it('checks PMB status only when both regNumber and phoneSuffix match', async () => {
    const payload = {
      find: vi.fn(async () => ({
        docs: [
          {
            regNumber: 'MBD-2026-0001',
            phoneNormalized: '6281234567890',
            status: 'terverifikasi',
            updatedAt: '2026-05-01T00:00:00.000Z',
            wave: { name: 'Gelombang 1' },
            track: { name: 'Reguler' },
          },
        ],
      })),
    } as unknown as Payload

    expect(
      (await checkPmbStatus(payload, { regNumber: 'MBD-2026-0001', phoneSuffix: '0000' })).ok,
    ).toBe(false)
    const ok = await checkPmbStatus(payload, { regNumber: 'MBD-2026-0001', phoneSuffix: '7890' })
    expect(ok.ok && ok.data.statusLabel).toBe('Terverifikasi')
  })

  it('issues signed brochure download links and scores quiz attempts', async () => {
    const payload = {
      secret: 'secret',
      logger: { error: vi.fn(), warn: vi.fn() },
      findGlobal: vi.fn(async () => ({ cta: { brochureFile: { id: 'media-99' } } })),
      findByID: vi.fn(async () => ({ id: 'att-1', result: { archetype: 'Strategis Data' } })),
      find: vi.fn(async ({ collection }: { collection: string }) => {
        if (collection === 'quiz-questions') {
          return {
            docs: [
              { id: 'q1', options: [{ id: 'o1', weights: { bisnis: 4, data: 3 } }] },
              { id: 'q2', options: [{ id: 'o2', weights: { bisnis: 3, data: 4 } }] },
            ],
          }
        }
        if (collection === 'quiz-results') {
          return {
            docs: [
              {
                id: 'r1',
                archetype: 'Strategis Data',
                description: 'Deskripsi',
                traits: ['Analitis'],
                courses: [],
              },
            ],
          }
        }
        return { docs: [] }
      }),
      create: vi.fn(async () => ({ id: 'att-1' })),
      update: vi.fn(async () => ({})),
    } as unknown as Payload

    const brochure = await requestBrochure(payload, {
      name: 'Sari',
      email: 'sari@email.com',
      phone: '081234567890',
      consent: true,
    })
    expect(brochure.ok && brochure.data.downloadUrl).toMatch(
      /^\/unduh\/brosur\?f=media-99&exp=\d+&sig=[0-9a-f]{40}$/,
    )

    const contact = await submitContact(payload, {
      name: 'Sari',
      email: 'sari@email.com',
      phone: '081234567890',
      topic: 'info-pmb',
      message: 'Halo tim MBD, saya ingin bertanya.',
      consent: true,
    })
    expect(contact).toEqual({ ok: true, data: { name: 'Sari' } })

    const incomplete = await submitQuizAttempt(payload, { answers: { q1: 'o1' } })
    expect(incomplete.ok).toBe(false)

    const quiz = await submitQuizAttempt(payload, { answers: { q1: 'o1', q2: 'o2' }, isTest: true })
    expect(quiz.ok && quiz.data.matchPercent).toBe(100)
    expect(quiz.ok && quiz.data.result?.archetype).toBe('Strategis Data')

    const lead = await submitQuizLead(payload, {
      attemptId: 'att-1',
      name: 'Sari',
      phone: '081234567890',
      consent: true,
    })
    expect(lead).toEqual({ ok: true, data: { name: 'Sari' } })
  })
})

describe('pickActiveWave', () => {
  it('selects the open wave with the nearest upcoming close date', () => {
    const now = new Date('2026-05-10T00:00:00Z')
    const waves = [
      { id: 'closed', status: 'ditutup', closeDate: '2026-05-12' },
      { id: 'later', status: 'dibuka', closeDate: '2026-07-01' },
      { id: 'sooner', status: 'dibuka', closeDate: '2026-06-01' },
    ]
    expect(pickActiveWave(waves, now)?.id).toBe('sooner')
  })
})
