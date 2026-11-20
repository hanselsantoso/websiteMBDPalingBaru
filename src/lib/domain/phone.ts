/**
 * Normalizes Indonesian phone/WhatsApp numbers to the international `62…`
 * format used by wa.me links and lead de-duplication.
 */
export function normalizePhone(input: string | null | undefined): string | null {
  if (!input) return null
  let digits = String(input).replace(/\D/g, '')
  if (!digits) return null
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`
  else if (digits.startsWith('8')) digits = `62${digits}`
  if (!/^62\d{8,13}$/.test(digits)) return null
  return digits
}

export function isValidPhone(input: string | null | undefined): boolean {
  return normalizePhone(input) !== null
}

export function phoneSuffix(input: string | null | undefined, length = 4): string {
  const digits = String(input ?? '').replace(/\D/g, '')
  return digits.slice(-length)
}

export function maskPhone(input: string | null | undefined): string {
  const digits = normalizePhone(input) ?? String(input ?? '').replace(/\D/g, '')
  if (digits.length < 7) return '••••'
  return `${digits.slice(0, 5)}${'•'.repeat(Math.max(3, digits.length - 9))}${digits.slice(-4)}`
}

/** Builds a wa.me URL, or null when the number is missing or still a placeholder. */
export function waLink(number: string | null | undefined, message?: string | null): string | null {
  if (!number || number.includes('[ISI')) return null
  const normalized = normalizePhone(number)
  if (!normalized) return null
  const text = message && !message.includes('[ISI') ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${normalized}${text}`
}

export function normalizeEmail(input: string | null | undefined): string | null {
  const value = String(input ?? '').trim().toLowerCase()
  return value.includes('@') ? value : null
}
