import type { Payload, PayloadRequest } from 'payload'
import { can, type ResolvedPermissions } from '@/lib/domain/permissions'
import { APPLICATION_STATUSES, LEAD_SOURCES } from '@/lib/domain/templates'
import { collectPlaceholders } from './placeholders'

const DAY = 24 * 3600 * 1000

export type DashboardSummary = {
  leadsThisWeek: number | null
  applicationsByStatus: { status: string; label: string; count: number }[] | null
  brochureDownloads: number
  quizCompletions: number
  syllabus: { average: number; complete: number; total: number } | null
  placeholders: number
  topPosts: { slug: string; views: number }[]
  leadsPerDay: { date: string; count: number }[] | null
  leadSources: { source: string; label: string; count: number }[] | null
  funnel: { label: string; value: number }[] | null
  needsAction: { label: string; count: number; href: string }[]
}

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * DAY).toISOString()
}

async function count(payload: Payload, collection: string, where: Record<string, unknown>, req?: PayloadRequest) {
  try {
    const result = await payload.count({ collection: collection as never, where: where as never, overrideAccess: true, req })
    return result.totalDocs
  } catch {
    return 0
  }
}

export async function dashboardSummary(
  payload: Payload,
  permissions: ResolvedPermissions | null,
  req?: PayloadRequest,
): Promise<DashboardSummary> {
  const canLeads = can(permissions, 'leads', 'lihat')
  const canPmb = can(permissions, 'pmb', 'lihat')
  const since30 = isoDaysAgo(30)

  const [brochureDownloads, quizCompletions, placeholderItems] = await Promise.all([
    count(payload, 'analytics-events', { and: [{ name: { equals: 'brochure_download' } }, { createdAt: { greater_than: since30 } }] }, req),
    count(payload, 'analytics-events', { and: [{ name: { equals: 'quiz_complete' } }, { createdAt: { greater_than: since30 } }] }, req),
    collectPlaceholders(payload, permissions, req),
  ])

  const leadsThisWeek = canLeads ? await count(payload, 'leads', { createdAt: { greater_than: isoDaysAgo(7) } }, req) : null

  const applicationsByStatus = canPmb
    ? await Promise.all(
        APPLICATION_STATUSES.map(async (s) => ({
          status: s.value,
          label: s.label,
          count: await count(payload, 'pmb-applications', { status: { equals: s.value } }, req),
        })),
      )
    : null

  let syllabus: DashboardSummary['syllabus'] = null
  if (can(permissions, 'matakuliah', 'lihat')) {
    const version = await payload.find({ collection: 'curriculum-versions', where: { isActive: { equals: true } }, limit: 1, depth: 0, overrideAccess: true, req })
    const versionId = version.docs[0]?.id
    if (versionId) {
      const courses = await payload.find({
        collection: 'courses',
        where: { version: { equals: versionId } },
        limit: 300,
        depth: 0,
        overrideAccess: true,
        select: { syllabusCompleteness: true },
        req,
      })
      const values = (courses.docs as { syllabusCompleteness?: number }[]).map((c) => c.syllabusCompleteness ?? 0)
      syllabus = {
        total: values.length,
        complete: values.filter((v) => v >= 100).length,
        average: values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0,
      }
    }
  }

  const views = await payload.find({
    collection: 'analytics-events',
    where: { and: [{ name: { equals: 'post_view' } }, { createdAt: { greater_than: since30 } }] },
    limit: 2000,
    depth: 0,
    overrideAccess: true,
    select: { props: true },
    req,
  })
  const viewCounts = new Map<string, number>()
  for (const event of views.docs as { props?: { slug?: string } }[]) {
    const slug = event.props?.slug
    if (slug) viewCounts.set(slug, (viewCounts.get(slug) ?? 0) + 1)
  }
  const topPosts = [...viewCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([slug, total]) => ({ slug, views: total }))

  let leadsPerDay: DashboardSummary['leadsPerDay'] = null
  let leadSources: DashboardSummary['leadSources'] = null
  let funnel: DashboardSummary['funnel'] = null
  if (canLeads) {
    const leads = await payload.find({
      collection: 'leads',
      where: { createdAt: { greater_than: since30 } },
      limit: 5000,
      depth: 0,
      overrideAccess: true,
      select: { createdAt: true, firstSource: true },
      req,
    })
    const byDay = new Map<string, number>()
    for (let i = 29; i >= 0; i--) byDay.set(new Date(Date.now() - i * DAY + 7 * 3600 * 1000).toISOString().slice(0, 10), 0)
    const bySource = new Map<string, number>()
    for (const lead of leads.docs as { createdAt: string; firstSource?: string }[]) {
      const day = new Date(new Date(lead.createdAt).getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10)
      if (byDay.has(day)) byDay.set(day, (byDay.get(day) ?? 0) + 1)
      const source = lead.firstSource ?? 'lainnya'
      bySource.set(source, (bySource.get(source) ?? 0) + 1)
    }
    leadsPerDay = [...byDay.entries()].map(([date, value]) => ({ date, count: value }))
    leadSources = LEAD_SOURCES.map((s) => ({ source: s.value, label: s.label, count: bySource.get(s.value) ?? 0 }))

    const [visits, preRegistrations, verified, enrolled] = await Promise.all([
      count(payload, 'analytics-events', { and: [{ name: { equals: 'session_start' } }, { createdAt: { greater_than: since30 } }] }, req),
      count(payload, 'pmb-applications', { createdAt: { greater_than: since30 } }, req),
      count(payload, 'pmb-applications', { and: [{ createdAt: { greater_than: since30 } }, { status: { in: ['terverifikasi', 'seleksi', 'lulus', 'daftar-ulang'] } }] }, req),
      count(payload, 'pmb-applications', { and: [{ createdAt: { greater_than: since30 } }, { status: { equals: 'daftar-ulang' } }] }, req),
    ])
    funnel = [
      { label: 'Kunjungan', value: visits },
      { label: 'Lead', value: leads.totalDocs },
      { label: 'Pra-daftar', value: preRegistrations },
      { label: 'Terverifikasi', value: verified },
      { label: 'Daftar ulang', value: enrolled },
    ]
  }

  const needsAction: DashboardSummary['needsAction'] = []
  if (canLeads) {
    needsAction.push({
      label: 'Pesan belum dibaca lebih dari 24 jam',
      count: await count(payload, 'contact-messages', { and: [{ status: { equals: 'baru' } }, { createdAt: { less_than: isoDaysAgo(1) } }] }, req),
      href: '/admin/collections/contact-messages?where[status][equals]=baru',
    })
  }
  if (canPmb) {
    needsAction.push({
      label: 'Pendaftar menunggu verifikasi',
      count: await count(payload, 'pmb-applications', { status: { equals: 'baru' } }, req),
      href: '/admin/collections/pmb-applications?where[status][equals]=baru',
    })
  }
  if (can(permissions, 'blog', 'lihat')) {
    needsAction.push({
      label: 'Artikel menunggu review',
      count: await count(payload, 'posts', { reviewStatus: { equals: 'review' } }, req),
      href: '/admin/collections/posts?where[reviewStatus][equals]=review',
    })
  }
  if (syllabus) {
    needsAction.push({
      label: 'Mata kuliah dengan silabus belum lengkap',
      count: syllabus.total - syllabus.complete,
      href: '/admin/collections/courses?where[syllabusCompleteness][less_than]=100',
    })
  }
  if (can(permissions, 'kontenLain', 'lihat')) {
    needsAction.push({
      label: 'Lowongan berakhir dalam 7 hari',
      count: await count(payload, 'job-posts', { and: [{ deadline: { greater_than_equal: new Date().toISOString() } }, { deadline: { less_than: new Date(Date.now() + 7 * DAY).toISOString() } }] }, req),
      href: '/admin/collections/job-posts',
    })
  }

  return {
    leadsThisWeek,
    applicationsByStatus,
    brochureDownloads,
    quizCompletions,
    syllabus,
    placeholders: placeholderItems.length,
    topPosts,
    leadsPerDay,
    leadSources,
    funnel,
    needsAction,
  }
}
