import type { Payload } from 'payload'
import { applicationStatusLabel } from '@/lib/domain/templates'
import { phoneSuffix } from '@/lib/domain/phone'
import { pairKeyOf, scoreQuiz } from '@/lib/domain/quiz'
import type {
  BrochureInput,
  ConsultationInput,
  ContactInput,
  PmbApplicationInput,
  PmbStatusInput,
  QuizAttemptInput,
  QuizLeadInput,
} from '@/lib/schemas'
import { signDownload } from '@/server/tokens'
import { recordEvent } from './events'
import { upsertLead } from './leads'
import { sendApplicationEmail } from './messages'
import { failure, GENERIC_ERROR, success, type ServiceResult } from './result'

const relId = (value: unknown) =>
  value && typeof value === 'object' ? (value as { id: string }).id : (value as string)

export async function submitContact(
  payload: Payload,
  input: ContactInput,
): Promise<ServiceResult<{ name: string }>> {
  try {
    const lead = await upsertLead(payload, { ...input, source: 'kontak', consent: input.consent })
    await payload.create({
      collection: 'contact-messages',
      overrideAccess: true,
      depth: 0,
      data: {
        kind: 'pesan',
        status: 'baru',
        name: input.name,
        email: input.email,
        phone: input.phone,
        topic: input.topic,
        message: input.message,
        lead: lead.id,
      } as never,
    })
    await recordEvent(payload, { name: 'contact_submit', props: { topic: input.topic } })
    return success({ name: input.name })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Pesan kontak gagal disimpan' })
    return failure('server_error', GENERIC_ERROR)
  }
}

export async function submitConsultation(
  payload: Payload,
  input: ConsultationInput,
): Promise<ServiceResult<{ name: string }>> {
  try {
    const lead = await upsertLead(payload, {
      ...input,
      source: 'konsultasi',
      consent: input.consent,
    })
    await payload.create({
      collection: 'contact-messages',
      overrideAccess: true,
      depth: 0,
      data: {
        kind: 'konsultasi',
        status: 'baru',
        name: input.name,
        email: input.email,
        phone: input.phone,
        topic: 'info-pmb',
        message: input.message,
        preferredDate: input.preferredDate,
        timeSlot: input.timeSlot,
        lead: lead.id,
      } as never,
    })
    await recordEvent(payload, { name: 'contact_submit', props: { kind: 'konsultasi' } })
    return success({ name: input.name })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Jadwal konsultasi gagal disimpan' })
    return failure('server_error', GENERIC_ERROR)
  }
}

export async function requestBrochure(
  payload: Payload,
  input: BrochureInput,
): Promise<ServiceResult<{ downloadUrl: string | null }>> {
  try {
    await upsertLead(payload, { ...input, source: 'brosur', consent: input.consent })
    await recordEvent(payload, { name: 'brochure_download' })
    const navigation = (await payload.findGlobal({
      slug: 'navigation',
      depth: 0,
      overrideAccess: true,
    })) as {
      cta?: { brochureFile?: unknown }
    }
    const fileId = relId(navigation.cta?.brochureFile)
    if (!fileId) return success({ downloadUrl: null })
    const { exp, sig } = signDownload(payload.secret, String(fileId))
    const params = new URLSearchParams({ f: String(fileId), exp: String(exp), sig })
    return success({ downloadUrl: `/unduh/brosur?${params.toString()}` })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Lead brosur gagal disimpan' })
    return failure('server_error', GENERIC_ERROR)
  }
}

export type UploadedDocument = {
  name: string
  type: string
  size: number
  data: Buffer
  kind: string
}

const MAGIC: Record<string, (b: Buffer) => boolean> = {
  'application/pdf': (b) => b.subarray(0, 4).toString('latin1') === '%PDF',
  'image/png': (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
}

const DOCUMENT_KINDS = new Set(['rapor', 'ijazah', 'identitas', 'foto', 'prestasi', 'lainnya'])

export async function submitPmbApplication(
  payload: Payload,
  input: PmbApplicationInput,
  documents: UploadedDocument[] = [],
): Promise<ServiceResult<{ regNumber: string; name: string; waveName: string }>> {
  try {
    const [wave, track, settings] = await Promise.all([
      payload
        .findByID({ collection: 'pmb-waves', id: input.waveId, depth: 0, overrideAccess: true })
        .catch(() => null),
      payload
        .findByID({ collection: 'pmb-tracks', id: input.trackId, depth: 0, overrideAccess: true })
        .catch(() => null),
      payload
        .findGlobal({ slug: 'pmb-settings', depth: 0, overrideAccess: true })
        .catch(() => null),
    ])
    const waveDoc = wave as { id: string; name?: string; status?: string } | null
    const trackDoc = track as { id: string; name?: string; isActive?: boolean } | null
    if (!waveDoc || waveDoc.status !== 'dibuka') {
      return failure('invalid_wave', 'Gelombang ini sedang tidak dibuka.', {
        waveId: 'Pilih gelombang yang sedang dibuka.',
      })
    }
    if (!trackDoc || trackDoc.isActive === false) {
      return failure('invalid_track', 'Jalur ini tidak tersedia.', {
        trackId: 'Pilih jalur pendaftaran yang tersedia.',
      })
    }

    const settingsDoc = settings as {
      documentUploadEnabled?: boolean
      maxDocumentMb?: number
    } | null
    const accepted: UploadedDocument[] = []
    if (documents.length && settingsDoc?.documentUploadEnabled) {
      const maxBytes = (settingsDoc.maxDocumentMb || 2) * 1024 * 1024
      for (const doc of documents.slice(0, 4)) {
        if (!MAGIC[doc.type]?.(doc.data)) {
          return failure('invalid_document', 'Format dokumen tidak didukung.', {
            documents: `${doc.name}: unggah PDF, JPG, atau PNG.`,
          })
        }
        if (doc.size > maxBytes) {
          return failure('document_too_large', 'Dokumen terlalu besar.', {
            documents: `${doc.name} melebihi ${settingsDoc.maxDocumentMb || 2} MB.`,
          })
        }
        accepted.push(doc)
      }
    }

    let application: Record<string, any> | null = null
    for (let attempt = 0; attempt < 3 && !application; attempt++) {
      try {
        application = await payload.create({
          collection: 'pmb-applications',
          overrideAccess: true,
          depth: 0,
          data: {
            fullName: input.fullName,
            email: input.email,
            phone: input.phone,
            city: input.city,
            schoolName: input.schoolName,
            schoolMajor: input.schoolMajor,
            graduationYear: Number(input.graduationYear),
            wave: waveDoc.id,
            track: trackDoc.id,
            source: input.source,
            status: 'baru',
            consentAt: new Date().toISOString(),
            utm: { source: input.utmSource, medium: input.utmMedium, campaign: input.utmCampaign },
          } as never,
        })
      } catch (error) {
        // A concurrent submission may have taken the same registration number; retry.
        if (attempt === 2) throw error
      }
    }
    if (!application) return failure('server_error', GENERIC_ERROR)
    const saved = application

    // The application is stored; follow-up steps must not turn this into a failure
    // (a failure message would invite a duplicate submission).
    const followUp = async (label: string, step: () => Promise<unknown>) => {
      try {
        await step()
      } catch (error) {
        payload.logger.error({ err: error, msg: `Pendaftaran ${saved.regNumber}: ${label} gagal` })
      }
    }

    await followUp('menautkan lead', async () => {
      const lead = await upsertLead(payload, {
        name: input.fullName,
        phone: input.phone,
        email: input.email,
        school: input.schoolName,
        source: 'pmb',
        consent: true,
        application: saved.id,
        utmSource: input.utmSource,
        utmMedium: input.utmMedium,
        utmCampaign: input.utmCampaign,
      })
      await payload.update({
        collection: 'pmb-applications',
        id: saved.id,
        data: { lead: lead.id } as never,
        overrideAccess: true,
        depth: 0,
      })
    })

    for (const doc of accepted) {
      await followUp(`menyimpan dokumen ${doc.name}`, () =>
        payload.create({
          collection: 'pmb-documents',
          overrideAccess: true,
          depth: 0,
          data: {
            label: doc.name,
            type: DOCUMENT_KINDS.has(doc.kind) ? doc.kind : 'lainnya',
            application: saved.id,
          } as never,
          file: { data: doc.data, mimetype: doc.type, name: doc.name, size: doc.size },
        }),
      )
    }

    await sendApplicationEmail(payload, saved as never)
    await followUp('mencatat analitik', () =>
      recordEvent(payload, { name: 'pmb_submit', props: { track: trackDoc.name ?? '' } }),
    )
    return success({
      regNumber: String(saved.regNumber),
      name: input.fullName,
      waveName: waveDoc.name ?? '',
    })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Pendaftaran PMB gagal disimpan' })
    return failure('server_error', GENERIC_ERROR)
  }
}

export async function checkPmbStatus(
  payload: Payload,
  input: PmbStatusInput,
): Promise<
  ServiceResult<{
    status: string
    statusLabel: string
    updatedAt: string
    waveName: string
    trackName: string
  }>
> {
  const notFound = failure(
    'not_found',
    'Data tidak ditemukan. Periksa nomor pendaftaran dan 4 digit terakhir WhatsApp yang kamu daftarkan.',
  )
  try {
    const result = await payload.find({
      collection: 'pmb-applications',
      where: { regNumber: { equals: input.regNumber } },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    })
    const doc = result.docs[0] as Record<string, any> | undefined
    if (!doc || phoneSuffix(doc.phoneNormalized ?? doc.phone) !== input.phoneSuffix) return notFound
    return success({
      status: doc.status,
      statusLabel: applicationStatusLabel(doc.status),
      updatedAt: doc.updatedAt,
      waveName: doc.wave?.name ?? '',
      trackName: doc.track?.name ?? '',
    })
  } catch {
    return notFound
  }
}

export type QuizResultPayload = {
  attemptId: string
  matchPercent: number
  normalized: Record<string, number>
  pairKey: string
  result: {
    archetype: string
    description: string
    traits: string[]
    pose: string
    semesters: string[]
    courses: { code: string | null; name: string; slug: string; semester: number }[]
  } | null
}

export async function submitQuizAttempt(
  payload: Payload,
  input: QuizAttemptInput,
): Promise<ServiceResult<QuizResultPayload>> {
  try {
    const questions = await payload.find({
      collection: 'quiz-questions',
      where: { isActive: { equals: true } },
      sort: 'sortOrder',
      limit: 50,
      depth: 0,
      overrideAccess: true,
    })
    const mapped = (questions.docs as Record<string, any>[]).map((q) => ({
      id: String(q.id),
      options: ((q.options as Record<string, any>[]) ?? []).map((o) => ({
        id: String(o.id),
        weights: o.weights,
      })),
    }))
    const score = scoreQuiz(mapped, input.answers)
    if (score.answered < mapped.length) {
      return failure('incomplete', 'Jawab semua pertanyaan dulu, ya.')
    }
    const results = await payload.find({
      collection: 'quiz-results',
      where: { pairKey: { equals: pairKeyOf(score.topPair[0], score.topPair[1]) } },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    })
    const result = results.docs[0] as Record<string, any> | undefined
    const attempt = await payload.create({
      collection: 'quiz-attempts',
      overrideAccess: true,
      depth: 0,
      data: {
        result: result?.id,
        matchPercent: score.matchPercent,
        answers: input.answers,
        scores: { raw: score.raw, normalized: score.normalized },
        sessionId: input.sessionId,
        isTest: Boolean(input.isTest),
      } as never,
    })
    if (!input.isTest) {
      await recordEvent(payload, {
        name: 'quiz_complete',
        sessionId: input.sessionId,
        props: { archetype: String(result?.archetype ?? score.pairKey), match: score.matchPercent },
      })
    }
    return success({
      attemptId: String(attempt.id),
      matchPercent: score.matchPercent,
      normalized: score.normalized,
      pairKey: score.pairKey,
      result: result
        ? {
            archetype: result.archetype,
            description: result.description,
            traits: result.traits ?? [],
            pose: result.pose ?? 'celebrating',
            semesters: result.semesters ?? [],
            courses: ((result.courses as Record<string, any>[]) ?? [])
              .filter((c) => c && typeof c === 'object')
              .map((c) => ({
                code: c.code ?? null,
                name: c.name,
                slug: c.slug,
                semester: c.semester,
              })),
          }
        : null,
    })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Hasil kuis gagal diproses' })
    return failure('server_error', 'Maaf, hasil kuis belum bisa dihitung. Coba lagi sebentar lagi.')
  }
}

export async function submitQuizLead(
  payload: Payload,
  input: QuizLeadInput,
): Promise<ServiceResult<{ name: string }>> {
  try {
    const attempt = (await payload.findByID({
      collection: 'quiz-attempts',
      id: input.attemptId,
      depth: 1,
      overrideAccess: true,
    })) as Record<string, any>
    const lead = await upsertLead(payload, {
      name: input.name,
      phone: input.phone,
      source: 'kuis',
      consent: input.consent,
      quizArchetype: attempt.result?.archetype ?? null,
      quizAttempt: attempt.id,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
    })
    await payload.update({
      collection: 'quiz-attempts',
      id: attempt.id,
      data: { lead: lead.id } as never,
      overrideAccess: true,
      depth: 0,
    })
    return success({ name: input.name })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Lead kuis gagal disimpan' })
    return failure('server_error', GENERIC_ERROR)
  }
}
