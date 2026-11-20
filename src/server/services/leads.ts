import type { Payload, Where } from 'payload'
import { normalizeEmail, normalizePhone } from '@/lib/domain/phone'
import type { LeadSource } from '@/lib/domain/templates'

export type LeadInput = {
  name: string
  phone?: string | null
  email?: string | null
  school?: string | null
  source: LeadSource
  consent?: boolean
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  quizArchetype?: string | null
  quizAttempt?: string | number | null
  application?: string | number | null
}

const STATUS_RANK = ['baru', 'dihubungi', 'tertarik', 'pre-registrasi', 'daftar']

function upgradeStatus(current: string | null | undefined, source: LeadSource): string {
  const target = source === 'pmb' ? 'pre-registrasi' : 'baru'
  if (!current || current === 'tidak-tertarik')
    return target === 'pre-registrasi' ? target : (current ?? 'baru')
  return STATUS_RANK.indexOf(target) > STATUS_RANK.indexOf(current) ? target : current
}

type LeadDoc = {
  id: string | number
  name?: string | null
  phone?: string | null
  email?: string | null
  school?: string | null
  status?: string | null
  sources?: string[] | null
  consentAt?: string | null
  quizArchetype?: string | null
  quizAttempt?: unknown
  application?: unknown
}

/** Creates a lead, or merges into an existing one matched by normalized phone or email. */
export async function upsertLead(payload: Payload, input: LeadInput): Promise<LeadDoc> {
  const phoneNormalized = normalizePhone(input.phone)
  const email = normalizeEmail(input.email)
  const now = new Date().toISOString()
  const or: Where[] = [
    ...(phoneNormalized ? [{ phoneNormalized: { equals: phoneNormalized } }] : []),
    ...(email ? [{ email: { equals: email } }] : []),
  ]

  const existing = or.length
    ? ((
        await payload.find({
          collection: 'leads',
          where: { or },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
      ).docs[0] as LeadDoc | undefined)
    : undefined

  const utm = {
    ...(input.utmSource ? { utmSource: input.utmSource } : {}),
    ...(input.utmMedium ? { utmMedium: input.utmMedium } : {}),
    ...(input.utmCampaign ? { utmCampaign: input.utmCampaign } : {}),
  }

  if (existing) {
    const relation = (value: unknown) =>
      value && typeof value === 'object' ? (value as { id: string }).id : value
    return (await payload.update({
      collection: 'leads',
      id: existing.id,
      overrideAccess: true,
      depth: 0,
      data: {
        name: existing.name || input.name,
        phone: existing.phone || input.phone || undefined,
        email: existing.email || email || undefined,
        school: existing.school || input.school || undefined,
        sources: Array.from(new Set([...(existing.sources ?? []), input.source])),
        status: upgradeStatus(existing.status, input.source),
        consentAt: input.consent ? now : existing.consentAt,
        quizArchetype: input.quizArchetype ?? existing.quizArchetype,
        quizAttempt: input.quizAttempt ?? relation(existing.quizAttempt),
        application: input.application ?? relation(existing.application),
        ...utm,
      } as never,
    })) as unknown as LeadDoc
  }

  return (await payload.create({
    collection: 'leads',
    overrideAccess: true,
    depth: 0,
    data: {
      name: input.name,
      phone: input.phone || undefined,
      email: email || undefined,
      school: input.school || undefined,
      firstSource: input.source,
      sources: [input.source],
      status: input.source === 'pmb' ? 'pre-registrasi' : 'baru',
      consentAt: input.consent ? now : undefined,
      quizArchetype: input.quizArchetype ?? undefined,
      quizAttempt: input.quizAttempt ?? undefined,
      application: input.application ?? undefined,
      ...utm,
    } as never,
  })) as unknown as LeadDoc
}
