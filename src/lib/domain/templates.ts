/** Replaces `{{variable}}` tokens. Unknown variables are left visible so staff notice them. */
export function renderTemplate(body: string, variables: Record<string, string | number | null | undefined>): string {
  return body.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (match, key: string) => {
    const value = variables[key.toLowerCase()]
    return value === undefined || value === null || value === '' ? match : String(value)
  })
}

export const TEMPLATE_VARIABLES = ['nama', 'nomor_pendaftaran', 'gelombang', 'jalur', 'status', 'tautan_status'] as const

export const APPLICATION_STATUSES = [
  { value: 'baru', label: 'Baru' },
  { value: 'terverifikasi', label: 'Terverifikasi' },
  { value: 'seleksi', label: 'Seleksi' },
  { value: 'lulus', label: 'Lulus' },
  { value: 'daftar-ulang', label: 'Daftar Ulang' },
  { value: 'tidak-lanjut', label: 'Tidak Lanjut' },
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]['value']

export function applicationStatusLabel(value: string | null | undefined): string {
  return APPLICATION_STATUSES.find((s) => s.value === value)?.label ?? 'Diproses'
}

export const LEAD_STATUSES = [
  { value: 'baru', label: 'Baru' },
  { value: 'dihubungi', label: 'Dihubungi' },
  { value: 'tertarik', label: 'Tertarik' },
  { value: 'pre-registrasi', label: 'Pre-registrasi' },
  { value: 'daftar', label: 'Daftar' },
  { value: 'tidak-tertarik', label: 'Tidak Tertarik' },
] as const

export const LEAD_SOURCES = [
  { value: 'brosur', label: 'Brosur' },
  { value: 'kuis', label: 'Kuis' },
  { value: 'kontak', label: 'Kontak' },
  { value: 'whatsapp', label: 'Klik WhatsApp' },
  { value: 'pmb', label: 'PMB' },
  { value: 'konsultasi', label: 'Konsultasi' },
  { value: 'event', label: 'Event' },
] as const

export type LeadSource = (typeof LEAD_SOURCES)[number]['value']
