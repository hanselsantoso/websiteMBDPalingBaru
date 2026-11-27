import type { SiasatPose } from './mascot'

export const PROGRAM_MARK = '/images/brand/mbd-siasat-icon.png'
export const PROGRAM_WORDMARK = { src: '/images/brand/mbd-jejak-siasat.webp', width: 640, height: 241 } as const
export const PROGRAM_WORDMARK_DARK = { ...PROGRAM_WORDMARK, src: '/images/brand/mbd-jejak-siasat-putih.webp' } as const
export const HERO_WAVE_ART = '/images/illustrations/hero-divider-pita-siasat.webp'
export const CURRICULUM_ART = '/images/illustrations/curriculum-journey.webp'
export const FACULTY_ART = '/images/illustrations/faculty-editorial.webp'
export const BLOG_COVER_ART = '/images/illustrations/digital-business-ai.webp'

export const SIASAT_LABELS = {
  greeting: 'Menyapa',
  pointing: 'Menunjuk',
  thinking: 'Berpikir',
  celebrating: 'Merayakan',
  confused: 'Bingung',
  tablet: 'Memegang tablet',
  excited: 'Antusias',
  focused: 'Fokus',
  waiting: 'Menunggu',
  proud: 'Bangga',
  reassuring: 'Menenangkan',
  curious: 'Penasaran',
  surprised: 'Kaget',
  panic: 'Panik',
  mischievous: 'Jahil',
  unimpressed: 'Tatapan datar',
  shocked: 'Terperanjat',
  exasperated: 'Kesal',
  embarrassed: 'Malu',
  laughing: 'Tertawa lepas',
  suspecting: 'Curiga',
  idea: 'Dapat ide',
  exhausted: 'Lelah',
  dejected: 'Sedih',
  determined: 'Bertekad',
} satisfies Record<SiasatPose, string> & Record<string, string>

export type SiasatVariant = keyof typeof SIASAT_LABELS
export const SIASAT_VARIANTS = Object.keys(SIASAT_LABELS) as SiasatVariant[]

export function getSiasatArtwork(variant: SiasatVariant) {
  return {
    url: `/images/mascot/toon/${variant}.webp`,
    alt: `Siasat: ${SIASAT_LABELS[variant].toLowerCase()}`,
  }
}
