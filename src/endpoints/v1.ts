import type { Endpoint, PayloadRequest } from 'payload'
import { addDataAndFileToRequest } from 'payload'
import type { z } from 'zod'
import { getPermissions } from '@/access'
import { slugify } from '@/lib/domain/curriculum'
import { can } from '@/lib/domain/permissions'
import * as queries from '@/lib/queries'
import {
  brochureSchema,
  contactSchema,
  eventSchema,
  fieldErrors,
  pmbApplicationSchema,
  pmbStatusSchema,
  quizAttemptSchema,
} from '@/lib/schemas'
import { dashboardSummary } from '@/server/dashboard'
import { clientIp, guardForm, rateLimit } from '@/server/guard'
import { findMediaUsage } from '@/server/media-usage'
import { collectPlaceholders } from '@/server/placeholders'
import { recordEvent } from '@/server/services/events'
import {
  checkPmbStatus,
  requestBrochure,
  submitContact,
  submitPmbApplication,
  submitQuizAttempt,
} from '@/server/services/forms'
import { sendTemplateTest } from '@/server/services/messages'
import type { ServiceResult } from '@/server/services/result'
import { searchSite } from '@/server/services/search'

/** REST API v1: envelope `{ data, meta, error }` with Indonesian error messages. */

const PUBLIC_CACHE = 'public, max-age=0, s-maxage=300, stale-while-revalidate=600'

const respond = (status: number, body: unknown, cache = 'no-store') =>
  status === 204
    ? new Response(null, { status, headers: { 'Cache-Control': cache } })
    : Response.json(body, { status, headers: { 'Cache-Control': cache } })

const ok = (data: unknown, meta: Record<string, unknown> = {}, cache?: string) =>
  respond(200, { data, meta, error: null }, cache)

const fail = (status: number, code: string, message: string, extra?: Record<string, unknown>) =>
  respond(status, { data: null, meta: {}, error: { code, message, ...extra } })

async function readBody(req: PayloadRequest): Promise<Record<string, unknown>> {
  await addDataAndFileToRequest(req)
  return (req.data as Record<string, unknown>) ?? {}
}

function fromService<T>(result: ServiceResult<T>) {
  if (result.ok) return ok(result.data)
  return fail(result.code === 'not_found' ? 404 : 400, result.code, result.message, {
    fieldErrors: result.fieldErrors,
  })
}

function formEndpoint<S extends z.ZodType>(
  path: string,
  schema: S,
  form: string,
  handler: (req: PayloadRequest, input: z.infer<S>) => Promise<Response>,
): Endpoint {
  return {
    path,
    method: 'post',
    handler: async (req) => {
      const body = await readBody(req)
      const parsed = schema.safeParse(body)
      if (!parsed.success) {
        return fail(422, 'validation_error', 'Periksa kembali isian yang ditandai.', {
          fieldErrors: fieldErrors(parsed.error),
        })
      }
      const input = parsed.data as Record<string, unknown>
      const guard = await guardForm(req.payload, {
        form,
        ip: clientIp(req.headers),
        honeypot: input.website as string | undefined,
        turnstileToken: input.turnstileToken as string | undefined,
      })
      if (guard.status === 'bot') return ok({ received: true })
      if (guard.status === 'blocked') return fail(429, 'rate_limited', guard.message)
      return handler(req, parsed.data)
    },
  }
}

async function requireAdmin(req: PayloadRequest) {
  if (req.user?.collection !== 'admins') return null
  return getPermissions(req)
}

function mascotPayload(branding: Record<string, any>) {
  const poses = (branding.poses ?? {}) as Record<string, any>
  return {
    name: branding.mascotName ?? 'Siasat',
    nickname: branding.mascotNickname ?? 'Sia',
    tagline: branding.mascotTagline ?? null,
    bio: branding.mascotBio ?? null,
    settings: branding.mascotSettings ?? {},
    poses: Object.fromEntries(
      Object.entries(poses).map(([pose, value]) => [
        pose,
        {
          url: value?.image?.url ?? null,
          url2x: value?.image2x?.url ?? null,
          alt: value?.alt ?? null,
          placeholder: !value?.image?.url,
        },
      ]),
    ),
    lines: ((branding.lines as Record<string, any>[]) ?? [])
      .filter((line) => line.isActive !== false)
      .map((line) => ({ pose: line.pose, text: line.text })),
  }
}

export const v1Endpoints: Endpoint[] = [
  {
    path: '/v1/site',
    method: 'get',
    handler: async (req) => {
      const [settings, navigation] = await Promise.all([
        queries.fetchSiteSettings(req.payload),
        queries.fetchNavigation(req.payload),
      ])
      const { integrations, ...publicSettings } = settings as Record<string, any>
      return ok(
        {
          settings: {
            ...publicSettings,
            analytics: {
              ga4Id: integrations?.ga4Id ?? null,
              metaPixelId: integrations?.metaPixelId ?? null,
            },
          },
          navigation,
        },
        {},
        PUBLIC_CACHE,
      )
    },
  },
  {
    path: '/v1/branding',
    method: 'get',
    handler: async (req) => {
      const branding = await queries.fetchBranding(req.payload)
      return ok(
        {
          colors: branding.colors,
          patterns: branding.patterns,
          logos: {
            wordmarkLight: branding.wordmarkLight?.url ?? null,
            wordmarkDark: branding.wordmarkDark?.url ?? null,
            symbol: branding.symbol?.url ?? null,
            favicon: branding.favicon?.url ?? null,
          },
          mascot: mascotPayload(branding),
        },
        {},
        PUBLIC_CACHE,
      )
    },
  },
  {
    path: '/v1/branding/mascot',
    method: 'get',
    handler: async (req) =>
      ok(mascotPayload(await queries.fetchBranding(req.payload)), {}, PUBLIC_CACHE),
  },
  {
    path: '/v1/pages/:slug',
    method: 'get',
    handler: async (req) => {
      const page = await queries.fetchPage(req.payload, String(req.routeParams?.slug ?? ''))
      if (!page) return fail(404, 'not_found', 'Halaman tidak ditemukan.')
      return ok(
        {
          ...page,
          layout: ((page.layout as Record<string, any>[]) ?? []).filter((b) => b.visible !== false),
        },
        {},
        PUBLIC_CACHE,
      )
    },
  },
  {
    path: '/v1/curriculum',
    method: 'get',
    handler: async (req) => {
      const data = await queries.fetchActiveCurriculum(req.payload)
      return ok(data, { totalCourses: data.courses.length }, PUBLIC_CACHE)
    },
  },
  {
    path: '/v1/courses/:code',
    method: 'get',
    handler: async (req) => {
      // Accepts a course code (BD009) or its URL slug (bd009); both map to the same slug.
      const course = await queries.fetchCourse(
        req.payload,
        slugify(String(req.routeParams?.code ?? '')),
      )
      if (!course) return fail(404, 'not_found', 'Mata kuliah tidak ditemukan.')
      return ok(course, {}, PUBLIC_CACHE)
    },
  },
  {
    path: '/v1/faculty',
    method: 'get',
    handler: async (req) => ok(await queries.fetchFacultyList(req.payload), {}, PUBLIC_CACHE),
  },
  {
    path: '/v1/faculty/:slug',
    method: 'get',
    handler: async (req) => {
      const member = await queries.fetchFacultyMember(
        req.payload,
        String(req.routeParams?.slug ?? ''),
      )
      if (!member) return fail(404, 'not_found', 'Dosen tidak ditemukan.')
      return ok(member, {}, PUBLIC_CACHE)
    },
  },
  {
    path: '/v1/posts',
    method: 'get',
    handler: async (req) => ok(await queries.fetchPosts(req.payload), {}, PUBLIC_CACHE),
  },
  {
    path: '/v1/posts/:slug',
    method: 'get',
    handler: async (req) => {
      const post = await queries.fetchPost(req.payload, String(req.routeParams?.slug ?? ''))
      if (!post) return fail(404, 'not_found', 'Artikel tidak ditemukan.')
      return ok(post, {}, PUBLIC_CACHE)
    },
  },
  {
    path: '/v1/post-categories',
    method: 'get',
    handler: async (req) => ok(await queries.fetchPostCategories(req.payload), {}, PUBLIC_CACHE),
  },
  ...(['programs', 'careers', 'partners', 'testimonials', 'jobs'] as const).map(
    (name): Endpoint => ({
      path: `/v1/${name}`,
      method: 'get',
      handler: async (req) => {
        const collection = (
          {
            programs: 'programs',
            careers: 'career-paths',
            partners: 'partners',
            testimonials: 'testimonials',
            jobs: 'job-posts',
          } as const
        )[name]
        return ok(await queries.fetchCollection(req.payload, collection), {}, PUBLIC_CACHE)
      },
    }),
  ),
  {
    path: '/v1/pmb/info',
    method: 'get',
    handler: async (req) => {
      const [info, faqs] = await Promise.all([
        queries.fetchPmbInfo(req.payload),
        queries.fetchFaqs(req.payload, 'pmb'),
      ])
      return ok({ ...info, faqs }, {}, PUBLIC_CACHE)
    },
  },
  {
    path: '/v1/quiz',
    method: 'get',
    handler: async (req) => ok(await queries.fetchQuiz(req.payload), {}, PUBLIC_CACHE),
  },
  {
    path: '/v1/search',
    method: 'get',
    handler: async (req) => {
      const limited = rateLimit(`search:${clientIp(req.headers)}`, 30, 60_000)
      if (!limited.ok)
        return fail(429, 'rate_limited', 'Terlalu banyak pencarian. Tunggu sebentar.')
      const q = String((req.query as Record<string, unknown>)?.q ?? '')
      return ok(await searchSite(req.payload, q), { q })
    },
  },
  {
    path: '/v1/events',
    method: 'post',
    handler: async (req) => {
      const limited = rateLimit(`events:${clientIp(req.headers)}`, 60, 60_000)
      if (!limited.ok) return respond(204, null)
      let body: unknown = {}
      try {
        body = await req.json?.()
      } catch {
        body = await readBody(req)
      }
      const parsed = eventSchema.safeParse(body)
      if (!parsed.success) return fail(422, 'validation_error', 'Data peristiwa tidak valid.')
      await recordEvent(req.payload, parsed.data)
      return respond(202, { data: { received: true }, meta: {}, error: null })
    },
  },
  formEndpoint('/v1/pmb/applications', pmbApplicationSchema, 'pmb', async (req, input) =>
    fromService(await submitPmbApplication(req.payload, input)),
  ),
  {
    path: '/v1/pmb/status',
    method: 'post',
    handler: async (req) => {
      const limited = rateLimit(`pmb-status:${clientIp(req.headers)}`, 5, 60_000)
      if (!limited.ok)
        return fail(
          429,
          'rate_limited',
          `Terlalu banyak percobaan. Coba lagi dalam ${limited.retryAfter} detik.`,
        )
      const parsed = pmbStatusSchema.safeParse(await readBody(req))
      if (!parsed.success)
        return fail(422, 'validation_error', 'Periksa kembali isian yang ditandai.', {
          fieldErrors: fieldErrors(parsed.error),
        })
      return fromService(await checkPmbStatus(req.payload, parsed.data))
    },
  },
  formEndpoint('/v1/leads/brochure', brochureSchema, 'brosur', async (req, input) =>
    fromService(await requestBrochure(req.payload, input)),
  ),
  formEndpoint('/v1/contact', contactSchema, 'kontak', async (req, input) =>
    fromService(await submitContact(req.payload, input)),
  ),
  {
    path: '/v1/quiz/attempts',
    method: 'post',
    handler: async (req) => {
      const limited = rateLimit(`quiz:${clientIp(req.headers)}`, 10, 60_000)
      if (!limited.ok)
        return fail(429, 'rate_limited', 'Terlalu banyak percobaan. Tunggu sebentar.')
      const parsed = quizAttemptSchema.safeParse(await readBody(req))
      if (!parsed.success) return fail(422, 'validation_error', 'Jawaban kuis tidak valid.')
      return fromService(await submitQuizAttempt(req.payload, { ...parsed.data, isTest: false }))
    },
  },
  {
    path: '/v1/admin/placeholders',
    method: 'get',
    handler: async (req) => {
      const permissions = await requireAdmin(req)
      if (!permissions) return fail(401, 'unauthorized', 'Masuk sebagai admin terlebih dahulu.')
      const items = await collectPlaceholders(req.payload, permissions, req)
      return ok(items, { total: items.length })
    },
  },
  {
    path: '/v1/admin/dashboard/summary',
    method: 'get',
    handler: async (req) => {
      const permissions = await requireAdmin(req)
      if (!permissions) return fail(401, 'unauthorized', 'Masuk sebagai admin terlebih dahulu.')
      return ok(await dashboardSummary(req.payload, permissions, req))
    },
  },
  {
    path: '/v1/admin/media-usage/:id',
    method: 'get',
    handler: async (req) => {
      const permissions = await requireAdmin(req)
      if (!permissions || !can(permissions, 'media', 'lihat'))
        return fail(403, 'forbidden', 'Kamu tidak memiliki akses ke media.')
      return ok(await findMediaUsage(req.payload, String(req.routeParams?.id ?? ''), req))
    },
  },
  {
    path: '/v1/admin/message-templates/:id/test',
    method: 'post',
    handler: async (req) => {
      const permissions = await requireAdmin(req)
      if (!permissions || !can(permissions, 'pmb', 'ubah'))
        return fail(403, 'forbidden', 'Kamu tidak memiliki izin mengirim tes.')
      return fromService(await sendTemplateTest(req, String(req.routeParams?.id ?? '')))
    },
  },
]
