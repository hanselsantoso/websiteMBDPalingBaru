import type { SiasatPose } from './mascot'

export const PROGRAM_MARK = '/images/brand/mbd-siasat-icon.png'
export const PROGRAM_WORDMARK = { src: '/images/brand/mbd-jejak-siasat.webp', width: 640, height: 241 } as const
export const PROGRAM_WORDMARK_DARK = { ...PROGRAM_WORDMARK, src: '/images/brand/mbd-jejak-siasat-putih.webp' } as const
export const HERO_WAVE_ART = '/images/illustrations/hero-divider-pita-siasat.webp'
export const BUSINESS_STRATEGY_ART = { src: '/images/illustrations/strategi-bisnis-kartun.webp', width: 336, height: 281 } as const
export const CURRICULUM_ART = '/images/illustrations/peta-semester-siasat-rara.webp'
export const CURRICULUM_CARD_ART = '/images/illustrations/peta-kurikulum-uli.webp'
const PAGE_ART_SIZE = { width: 960, height: 720 } as const
export const PAGE_HEADER_ART = {
  program: { ...PAGE_ART_SIZE, src: '/images/illustrations/hero-program-siasat.webp', alt: 'Proto dan Sage meninjau prototipe aplikasi' },
  karier: { ...PAGE_ART_SIZE, src: '/images/illustrations/hero-karier-siasat.webp', alt: 'Metric dan Flow menjelajahi arah karier dengan grafik dan portofolio' },
  blog: { ...PAGE_ART_SIZE, src: '/images/illustrations/hero-blog-siasat.webp', alt: 'Reach dan Sage bertukar ide untuk sebuah tulisan' },
  pmb: { ...PAGE_ART_SIZE, src: '/images/illustrations/hero-pmb-siasat.webp', alt: 'Pivot menyambut calon mahasiswa dan Flow menunjukkan daftar persiapan' },
} as const
export const FACULTY_ART = '/images/illustrations/faculty-editorial.webp'
export const BLOG_COVER_ART = PAGE_HEADER_ART.blog.src
export const SIASAT_GROUP_ART = {
  src: '/images/mascot/friends/siasat-dan-teman.webp',
  alt: 'MBD Crew (Pivot, Proto, Metric, Flow, Sage, Reach)',
  width: 1120,
  height: 682,
} as const

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
    alt: `Pivot: ${SIASAT_LABELS[variant].toLowerCase()}`,
  }
}
