import { z } from 'zod'
import { normalizePhone } from './domain/phone'
import { jakartaYear } from './domain/reg-number'

/** Shared form schemas: used by client components (React Hook Form) and server actions. */

const nameField = z
  .string()
  .trim()
  .min(2, 'Tulis nama lengkap, minimal 2 huruf.')
  .max(100, 'Nama terlalu panjang, maksimal 100 karakter.')

const emailField = z
  .string()
  .trim()
  .min(1, 'Email wajib diisi.')
  .max(160, 'Email terlalu panjang.')
  .email('Masukkan email yang valid, misalnya nama@email.com.')

const phoneField = z
  .string()
  .trim()
  .min(1, 'Nomor WhatsApp wajib diisi.')
  .refine((value) => normalizePhone(value) !== null, 'Masukkan nomor WhatsApp aktif, misalnya 0812 3456 7890.')

const consentField = z
  .boolean()
  .refine((value) => value === true, 'Centang persetujuan agar kami boleh menyimpan dan menggunakan datamu.')

/** Honeypot: real visitors never fill this hidden field. */
const honeypotField = z.string().max(200).optional()

const optionalText = (max: number) => z.string().trim().max(max).optional()

export const utmSchema = z.object({
  utmSource: optionalText(100),
  utmMedium: optionalText(100),
  utmCampaign: optionalText(100),
})

export const CONTACT_TOPICS = [
  { value: 'info-pmb', label: 'Info pendaftaran (PMB)' },
  { value: 'kurikulum', label: 'Kurikulum dan perkuliahan' },
  { value: 'beasiswa', label: 'Beasiswa dan biaya' },
  { value: 'kerja-sama', label: 'Kerja sama dan kemitraan' },
  { value: 'lainnya', label: 'Lainnya' },
] as const

export const contactSchema = z
  .object({
    name: nameField,
    email: emailField,
    phone: phoneField,
    topic: z.enum(
      CONTACT_TOPICS.map((t) => t.value) as [string, ...string[]],
      'Pilih topik pesanmu.',
    ),
    message: z
      .string()
      .trim()
      .min(10, 'Ceritakan pertanyaanmu minimal 10 karakter.')
      .max(2000, 'Pesan terlalu panjang, maksimal 2.000 karakter.'),
    consent: consentField,
    website: honeypotField,
    turnstileToken: z.string().optional(),
  })
  .extend(utmSchema.shape)

export type ContactInput = z.infer<typeof contactSchema>

export const TIME_SLOTS = [
  { value: 'pagi', label: 'Pagi (09.00–11.00 WIB)' },
  { value: 'siang', label: 'Siang (13.00–15.00 WIB)' },
  { value: 'sore', label: 'Sore (15.00–17.00 WIB)' },
] as const

const todayJakarta = () => new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10)

export const consultationSchema = z
  .object({
    name: nameField,
    email: emailField,
    phone: phoneField,
    preferredDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Pilih tanggal konsultasi.')
      .refine((value) => value >= todayJakarta(), 'Pilih tanggal mulai hari ini.'),
    timeSlot: z.enum(TIME_SLOTS.map((t) => t.value) as [string, ...string[]], 'Pilih slot waktu.'),
    message: z.string().trim().max(1000, 'Catatan maksimal 1.000 karakter.').optional(),
    consent: consentField,
    website: honeypotField,
    turnstileToken: z.string().optional(),
  })
  .extend(utmSchema.shape)

export type ConsultationInput = z.infer<typeof consultationSchema>

export const brochureSchema = z
  .object({
    name: nameField,
    phone: phoneField,
    email: emailField,
    consent: consentField,
    website: honeypotField,
    turnstileToken: z.string().optional(),
  })
  .extend(utmSchema.shape)

export type BrochureInput = z.infer<typeof brochureSchema>

const currentYear = jakartaYear()

export const pmbStepSchemas = {
  personal: z.object({
    fullName: nameField,
    email: emailField,
    phone: phoneField,
    city: z.string().trim().min(2, 'Tulis kota domisilimu.').max(80, 'Nama kota terlalu panjang.'),
  }),
  school: z.object({
    schoolName: z.string().trim().min(3, 'Tulis nama sekolah asalmu.').max(120, 'Nama sekolah terlalu panjang.'),
    schoolMajor: z.string().trim().min(2, 'Tulis jurusanmu, misalnya IPS atau Akuntansi.').max(80),
    graduationYear: z
      .string()
      .trim()
      .regex(/^\d{4}$/, 'Tulis tahun lulus 4 digit, misalnya 2026.')
      .refine((value) => {
        const year = Number(value)
        return year >= currentYear - 15 && year <= currentYear + 3
      }, `Tahun lulus harus antara ${currentYear - 15} dan ${currentYear + 3}.`),
  }),
  choices: z.object({
    trackId: z.string().min(1, 'Pilih jalur pendaftaran.'),
    waveId: z.string().min(1, 'Pilih gelombang pendaftaran.'),
    source: z.string().trim().min(1, 'Pilih dari mana kamu mengenal MBD.').max(80),
  }),
  consent: z.object({
    consent: consentField,
  }),
}

export const pmbApplicationSchema = pmbStepSchemas.personal
  .extend(pmbStepSchemas.school.shape)
  .extend(pmbStepSchemas.choices.shape)
  .extend(pmbStepSchemas.consent.shape)
  .extend({ website: honeypotField, turnstileToken: z.string().optional() })
  .extend(utmSchema.shape)

export type PmbApplicationInput = z.infer<typeof pmbApplicationSchema>

export const pmbStatusSchema = z.object({
  regNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^MBD-\d{4}-\d{4}$/, 'Tulis nomor pendaftaran dengan format MBD-2026-0001.'),
  phoneSuffix: z.string().trim().regex(/^\d{4}$/, 'Tulis 4 digit terakhir nomor WhatsApp yang kamu daftarkan.'),
})

export type PmbStatusInput = z.infer<typeof pmbStatusSchema>

export const quizAttemptSchema = z.object({
  answers: z
    .record(z.string().max(64), z.string().max(64))
    .refine((value) => Object.keys(value).length > 0 && Object.keys(value).length <= 40, 'Jawab pertanyaan kuis terlebih dahulu.'),
  sessionId: z.string().max(64).optional(),
  isTest: z.boolean().optional(),
})

export type QuizAttemptInput = z.infer<typeof quizAttemptSchema>

export const quizLeadSchema = z
  .object({
    attemptId: z.string().min(1).max(64),
    name: nameField,
    phone: phoneField,
    consent: consentField,
    website: honeypotField,
    turnstileToken: z.string().optional(),
  })
  .extend(utmSchema.shape)

export type QuizLeadInput = z.infer<typeof quizLeadSchema>

export const TRACKED_EVENTS = [
  'session_start',
  'cta_register_click',
  'cta_whatsapp_click',
  'brochure_download',
  'quiz_start',
  'quiz_complete',
  'pmb_submit',
  'contact_submit',
  'post_view',
  'not_found',
] as const

export type TrackedEvent = (typeof TRACKED_EVENTS)[number]

export const eventSchema = z.object({
  name: z.enum(TRACKED_EVENTS),
  path: z.string().max(300).optional(),
  sessionId: z.string().max(64).optional(),
  referrer: z.string().max(300).optional(),
  props: z.record(z.string().max(40), z.union([z.string().max(200), z.number(), z.boolean()])).optional(),
})

export type EventInput = z.infer<typeof eventSchema>

/** Flattens Zod issues into `{ field: message }` for form display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'form'
    if (!result[key]) result[key] = issue.message
  }
  return result
}
