'use server'

import { headers } from 'next/headers'
import type { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import {
  brochureSchema,
  consultationSchema,
  contactSchema,
  fieldErrors,
  pmbApplicationSchema,
  pmbStatusSchema,
  quizAttemptSchema,
  quizLeadSchema,
} from '@/lib/schemas'
import { clientIp, guardForm, rateLimit } from '@/server/guard'
import * as forms from '@/server/services/forms'
import type { ServiceResult } from '@/server/services/result'

export type ActionResult<T> = { ok: true; data: T } | { ok: false; message: string; fieldErrors?: Record<string, string> }

const INVALID = 'Periksa kembali isian yang ditandai.'

function toAction<T>(result: ServiceResult<T>): ActionResult<T> {
  return result.ok ? { ok: true, data: result.data } : { ok: false, message: result.message, fieldErrors: result.fieldErrors }
}

async function guarded<S extends z.ZodType, T>(
  schema: S,
  raw: unknown,
  form: string,
  botResult: T,
  handler: (input: z.infer<S>) => Promise<ServiceResult<T>>,
): Promise<ActionResult<T>> {
  const parsed = schema.safeParse(raw)
  if (!parsed.success) return { ok: false, message: INVALID, fieldErrors: fieldErrors(parsed.error) }
  const input = parsed.data as { website?: string; turnstileToken?: string }
  const payload = await getPayloadClient()
  const guard = await guardForm(payload, {
    form,
    ip: clientIp(await headers()),
    honeypot: input.website,
    turnstileToken: input.turnstileToken,
  })
  if (guard.status === 'bot') return { ok: true, data: botResult }
  if (guard.status === 'blocked') return { ok: false, message: guard.message }
  return toAction(await handler(parsed.data))
}

export async function submitContactAction(raw: unknown) {
  return guarded(contactSchema, raw, 'kontak', { name: '' }, async (input) => forms.submitContact(await getPayloadClient(), input))
}

export async function submitConsultationAction(raw: unknown) {
  return guarded(consultationSchema, raw, 'konsultasi', { name: '' }, async (input) =>
    forms.submitConsultation(await getPayloadClient(), input),
  )
}

export async function requestBrochureAction(raw: unknown) {
  return guarded(brochureSchema, raw, 'brosur', { downloadUrl: null as string | null }, async (input) =>
    forms.requestBrochure(await getPayloadClient(), input),
  )
}

export async function submitPmbAction(formData: FormData) {
  let raw: Record<string, unknown> = {}
  try {
    raw = JSON.parse(String(formData.get('payload') ?? '{}')) as Record<string, unknown>
  } catch {
    return { ok: false as const, message: INVALID }
  }
  const files = formData.getAll('documents').filter((item): item is File => typeof item === 'object' && item !== null && 'arrayBuffer' in item && (item as File).size > 0)
  const kinds = formData.getAll('documentKinds').map(String)
  const documents = await Promise.all(
    files.slice(0, 4).map(async (file, index) => ({
      name: file.name.slice(0, 120),
      type: file.type,
      size: file.size,
      kind: kinds[index] ?? 'lainnya',
      data: Buffer.from(await file.arrayBuffer()),
    })),
  )
  return guarded(pmbApplicationSchema, raw, 'pmb', { regNumber: '', name: '', waveName: '', documents: [] } as forms.PmbSubmissionData, async (input) =>
    forms.submitPmbApplication(await getPayloadClient(), input, documents),
  )
}

export async function checkPmbStatusAction(raw: unknown) {
  const limited = rateLimit(`pmb-status:${clientIp(await headers())}`, 5, 60_000)
  if (!limited.ok) return { ok: false as const, message: `Terlalu banyak percobaan. Coba lagi dalam ${limited.retryAfter} detik.` }
  const parsed = pmbStatusSchema.safeParse(raw)
  if (!parsed.success) return { ok: false as const, message: INVALID, fieldErrors: fieldErrors(parsed.error) }
  return toAction(await forms.checkPmbStatus(await getPayloadClient(), parsed.data))
}

export async function submitQuizAction(raw: unknown) {
  const limited = rateLimit(`quiz:${clientIp(await headers())}`, 10, 60_000)
  if (!limited.ok) return { ok: false as const, message: 'Terlalu banyak percobaan. Tunggu sebentar, ya.' }
  const parsed = quizAttemptSchema.safeParse(raw)
  if (!parsed.success) return { ok: false as const, message: 'Jawab semua pertanyaan dulu, ya.' }
  return toAction(await forms.submitQuizAttempt(await getPayloadClient(), parsed.data))
}

export async function submitQuizLeadAction(raw: unknown) {
  return guarded(quizLeadSchema, raw, 'kuis-lead', { name: '' }, async (input) => forms.submitQuizLead(await getPayloadClient(), input))
}

export async function searchAction(query: string) {
  const limited = rateLimit(`search:${clientIp(await headers())}`, 30, 60_000)
  if (!limited.ok) return []
  const { searchSite } = await import('@/server/services/search')
  return searchSite(await getPayloadClient(), String(query ?? '').slice(0, 80))
}
