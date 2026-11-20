import type { Payload, PayloadRequest } from 'payload'
import { applicationStatusLabel, renderTemplate } from '@/lib/domain/templates'
import { siteUrl } from '@/lib/preview'

type ApplicationLike = {
  id: string | number
  fullName?: string | null
  email?: string | null
  regNumber?: string | null
  status?: string | null
  wave?: unknown
  track?: unknown
}

async function nameOf(payload: Payload, collection: 'pmb-waves' | 'pmb-tracks', value: unknown, req?: PayloadRequest) {
  if (!value) return ''
  if (typeof value === 'object') return String((value as { name?: string }).name ?? '')
  try {
    const doc = await payload.findByID({ collection, id: value as string, depth: 0, overrideAccess: true, req })
    return String((doc as { name?: string }).name ?? '')
  } catch {
    return ''
  }
}

/** Sends the active email template for the application's current status (if any). Never throws. */
export async function sendApplicationEmail(payload: Payload, application: ApplicationLike, req?: PayloadRequest) {
  try {
    if (!application.email || !application.status) return
    const templates = await payload.find({
      collection: 'message-templates',
      where: {
        and: [
          { statusKey: { equals: application.status } },
          { channel: { equals: 'email' } },
          { isActive: { equals: true } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    })
    const template = templates.docs[0] as { subject?: string; body?: string } | undefined
    if (!template?.body) return
    const variables = {
      nama: application.fullName ?? '',
      nomor_pendaftaran: application.regNumber ?? '',
      gelombang: await nameOf(payload, 'pmb-waves', application.wave, req),
      jalur: await nameOf(payload, 'pmb-tracks', application.track, req),
      status: applicationStatusLabel(application.status),
      tautan_status: `${siteUrl()}/pmb#cek-status`,
    }
    await payload.sendEmail({
      to: application.email,
      subject: renderTemplate(template.subject || 'Info pendaftaran S1 Manajemen Bisnis Digital ISTTS', variables),
      text: renderTemplate(template.body, variables),
    })
  } catch (error) {
    payload.logger.warn({ err: error, msg: 'Email template pendaftar gagal dikirim' })
  }
}

export async function sendStatusMessage(req: PayloadRequest, application: ApplicationLike) {
  await sendApplicationEmail(req.payload, application, req)
}
