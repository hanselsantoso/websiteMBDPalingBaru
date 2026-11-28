import type { Locale } from '@/lib/i18n'

export const CREW_NAME = 'MBD Crew'
export const CREW_PATH = '/mbd-crew'

// Keep the keys stable for existing artwork folders and saved CMS content.
export const CREW_CHARACTERS = {
  siasat: 'Pivot',
  rara: 'Proto',
  kiko: 'Metric',
  bimo: 'Flow',
  uli: 'Sage',
  piko: 'Reach',
} as const

const legacyGroups = /\b(?:Galeri Siasat dan Teman-teman|Siasat dan Teman-teman|Siasat and Friends(?: Gallery)?|(?:Tim|Team) Siasat)\b/gi
const legacyNames: Record<string, string> = {
  ...CREW_CHARACTERS,
  sia: CREW_CHARACTERS.siasat,
}

/** Apply only to copy whose subject is the mascots or their artwork. */
export function crewCopy(text: string): string {
  return text
    .replace(legacyGroups, CREW_NAME)
    .replace(/\bJejak Siasat\b/gi, 'MBD')
    .replace(/\b(?:Siasat|Sia|Rara|Kiko|Bimo|Uli|Piko)\b/g, (name) => legacyNames[name.toLowerCase()])
}

/** Pay special attention to saved CTA labels and URLs pointing to the former gallery. */
const oldGalleryLabels = /\b(?:Galeri Siasat|(?:the )?Siasat Gallery)\b/gi

export function crewGalleryLabel(text: string): string {
  return text.replace(legacyGroups, CREW_NAME).replace(oldGalleryLabels, CREW_NAME)
}

export function pivotDisplayName(value: string | null | undefined): string {
  const name = value?.trim()
  return !name || /^(?:sia|siasat)$/i.test(name) ? CREW_CHARACTERS.siasat : name
}

export function crewGalleryTitle(locale: Locale): string {
  return locale === 'en' ? 'Meet the MBD Crew' : 'Kenali MBD Crew'
}

/** Keep internal gallery links canonical without rewriting old asset names or external links. */
export function canonicalCrewHref(href: string): string {
  return href.replace(/^(\/en)?\/siasat\/?(?=[?#]|$)/, (_, prefix?: string) => (prefix ?? '') + CREW_PATH)
}
