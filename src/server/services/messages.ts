import type { Payload, PayloadRequest } from 'payload'
import { applicationStatusLabel, renderTemplate } from '@/lib/domain/templates'
import { siteUrl } from '@/lib/preview'
import type { MessageTemplate } from '@/payload-types'
import { failure, success, type ServiceResult } from './result'

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

/** Tests exactly the editor-selected template; delivery failures reach the caller. */
export async function sendTemplateTest(
  req: PayloadRequest,
  templateId: MessageTemplate['id'],
): Promise<ServiceResult<{ sentTo: string }>> {
  try {
    const template = await req.payload.findByID({ collection: 'message-templates', id: templateId, depth: 0, overrideAccess: false, user: req.user, req })
    const email = req.user?.collection === 'admins' ? req.user.email : undefined
    if (template.channel !== 'email' || !email) return failure('not_email', 'Tes kirim hanya untuk template email.')
    if (!template.body?.trim()) return failure('empty_template', 'Isi template email masih kosong.')
    const variables = {
      nama: 'Calon Mahasiswa (tes)', nomor_pendaftaran: 'MBD-0000-0000',
      gelombang: 'Gelombang (tes)', jalur: 'Jalur (tes)',
      status: applicationStatusLabel(template.statusKey), tautan_status: `${siteUrl()}/pmb#cek-status`,
    }
    await req.payload.sendEmail({
      to: email,
      subject: renderTemplate(template.subject || 'Info pendaftaran S1 Manajemen Bisnis Digital ISTTS', variables),
      text: renderTemplate(template.body, variables),
    })
    return success({ sentTo: email })
  } catch (error) {
    req.payload.logger.warn({ err: error, msg: 'Tes email template gagal dikirim' })
    return failure('email_failed', 'Email tes belum terkirim. Periksa konfigurasi email dan coba lagi.')
  }
}
