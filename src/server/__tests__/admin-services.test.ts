import type { Payload } from 'payload'
import { describe, expect, it, vi } from 'vitest'
import { resolvePermissions } from '@/lib/domain/permissions'
import { dashboardSummary } from '../dashboard'
import { findMediaUsage } from '../media-usage'
import { collectPlaceholders } from '../placeholders'
import { sendApplicationEmail } from '../services/messages'

describe('collectPlaceholders', () => {
  it('filters collections and globals by module view permission and flags courses without a code', async () => {
    const payload = {
      find: vi.fn(async ({ collection }: { collection: string }) => {
        if (collection === 'posts') {
          return { docs: [{ id: 'p1', title: 'Artikel Uji', excerpt: '[ISI: ringkasan]' }] }
        }
        if (collection === 'courses') {
          return { docs: [{ id: 'c1', name: 'Agama', code: null }] }
        }
        return { docs: [] }
      }),
      findGlobal: vi.fn(async ({ slug }: { slug: string }) =>
        slug === 'site-settings' ? { phone: '[ISI: nomor telepon]' } : {},
      ),
    } as unknown as Payload

    const writer = resolvePermissions({
      key: 'penulis',
      permissions: { blog: { actions: ['lihat'] } },
    })
    const writerItems = await collectPlaceholders(payload, writer)
    expect(writerItems).toEqual([
      {
        source: 'posts',
        label: 'Blog',
        title: 'Artikel Uji',
        path: 'excerpt',
        value: '[ISI: ringkasan]',
        href: '/admin/collections/posts/p1',
      },
    ])

    const superAdmin = resolvePermissions({ key: 'super-admin' })
    const adminItems = await collectPlaceholders(payload, superAdmin)
    expect(adminItems.map((i) => `${i.source}:${i.path}`)).toEqual([
      'posts:excerpt',
      'courses:code',
      'site-settings:phone',
    ])
  })
})

describe('findMediaUsage', () => {
  it('detects direct upload fields, nested block/richText references, and global references', async () => {
    const payload = {
      find: vi.fn(async ({ collection }: { collection: string }) => {
        if (collection === 'faculty') return { docs: [{ id: 'f1', name: 'Dr. Budi' }] }
        if (collection === 'pages') {
          return { docs: [{ id: 'pg1', title: 'Beranda', layout: [{ image: 'media-42' }] }] }
        }
        return { docs: [] }
      }),
      findGlobal: vi.fn(async ({ slug }: { slug: string }) =>
        slug === 'branding' ? { wordmarkDark: 'media-42' } : {},
      ),
    } as unknown as Payload

    const usages = await findMediaUsage(payload, 'media-42')
    expect(usages).toEqual([
      { where: 'Dosen', title: 'Dr. Budi', href: '/admin/collections/faculty/f1' },
      { where: 'Halaman', title: 'Beranda', href: '/admin/collections/pages/pg1' },
      { where: 'Branding', title: 'Branding', href: '/admin/globals/branding' },
    ])
  })
})

describe('dashboardSummary', () => {
  it('omits restricted sections for limited roles and aggregates KPIs for super-admin', async () => {
    const payload = {
      count: vi.fn(async () => ({ totalDocs: 3 })),
      find: vi.fn(async ({ collection }: { collection: string }) => {
        if (collection === 'curriculum-versions') return { docs: [{ id: 'v1' }], totalDocs: 1 }
        if (collection === 'courses') {
          return {
            docs: [{ syllabusCompleteness: 100 }, { syllabusCompleteness: 50 }],
            totalDocs: 2,
          }
        }
        if (collection === 'analytics-events') {
          return {
            docs: [{ props: { slug: 'artikel-a' } }, { props: { slug: 'artikel-a' } }],
            totalDocs: 2,
          }
        }
        if (collection === 'leads') {
          return {
            docs: [{ createdAt: new Date().toISOString(), firstSource: 'kuis' }],
            totalDocs: 1,
          }
        }
        return { docs: [], totalDocs: 0 }
      }),
      findGlobal: vi.fn(async () => ({})),
    } as unknown as Payload

    const writer = resolvePermissions({
      key: 'penulis',
      permissions: { blog: { actions: ['lihat'] } },
    })
    const limited = await dashboardSummary(payload, writer)
    expect(limited.leadsThisWeek).toBeNull()
    expect(limited.applicationsByStatus).toBeNull()
    expect(limited.syllabus).toBeNull()

    const full = await dashboardSummary(payload, resolvePermissions({ key: 'super-admin' }))
    expect(full.leadsThisWeek).toBe(3)
    expect(full.syllabus).toEqual({ total: 2, complete: 1, average: 75 })
    expect(full.topPosts).toEqual([{ slug: 'artikel-a', views: 2 }])
    expect(full.funnel?.map((f) => f.label)).toEqual([
      'Kunjungan',
      'Lead',
      'Pra-daftar',
      'Terverifikasi',
      'Daftar ulang',
    ])
  })
})

describe('sendApplicationEmail', () => {
  it('renders template variables into subject and text and never throws on send failure', async () => {
    const sendEmail = vi.fn().mockResolvedValue(undefined)
    const payload = {
      find: vi.fn(async () => ({
        docs: [
          {
            subject: 'Halo {{nama}} ({{nomor_pendaftaran}})',
            body: 'Status {{status}} di {{gelombang}} / {{jalur}}: {{tautan_status}}',
          },
        ],
      })),
      findByID: vi.fn(async ({ collection }: { collection: string }) =>
        collection === 'pmb-waves' ? { name: 'Gelombang 1' } : { name: 'Reguler' },
      ),
      sendEmail,
      logger: { warn: vi.fn() },
    } as unknown as Payload

    await sendApplicationEmail(payload, {
      id: 'app-1',
      fullName: 'Rina',
      email: 'rina@email.com',
      regNumber: 'MBD-2026-0001',
      status: 'terverifikasi',
      wave: 'w1',
      track: 't1',
    })

    expect(sendEmail).toHaveBeenCalledTimes(1)
    expect(sendEmail.mock.calls[0][0]).toMatchObject({
      to: 'rina@email.com',
      subject: 'Halo Rina (MBD-2026-0001)',
      text: expect.stringContaining('Status Terverifikasi di Gelombang 1 / Reguler:'),
    })

    sendEmail.mockRejectedValueOnce(new Error('SMTP down'))
    await expect(
      sendApplicationEmail(payload, {
        id: 'app-1',
        fullName: 'Rina',
        email: 'rina@email.com',
        regNumber: 'MBD-2026-0001',
        status: 'terverifikasi',
      }),
    ).resolves.toBeUndefined()
  })
})
