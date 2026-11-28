import { localeTag, type Locale } from './i18n'

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

const TZ = 'Asia/Jakarta'

export function formatDate(value: string | Date | null | undefined, style: 'long' | 'short' = 'long', locale: Locale = 'id'): string {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(localeTag(locale), {
    timeZone: TZ,
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(value: string | null | undefined, locale: Locale = 'id'): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(localeTag(locale), {
    timeZone: TZ,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export type MediaLike = {
  id?: string | number
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
  focalX?: number | null
  focalY?: number | null
}

export function asMedia(value: unknown): MediaLike | null {
  if (!value || typeof value !== 'object') return null
  const media = value as MediaLike
  return media.url ? media : null
}

export function relationId(value: unknown): string | null {
  if (!value) return null
  if (typeof value === 'object') return String((value as { id?: string | number }).id ?? '') || null
  return String(value)
}

/** Stable small hash for deterministic decorative variants. */
export function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) | 0
  return Math.abs(hash)
}

export function initials(name: string): string {
  const clean = name.replace(/\[ISI[^\]]*\]/g, '').trim()
  if (!clean) return 'MBD'
  return clean
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
