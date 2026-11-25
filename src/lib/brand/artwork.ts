import type { SiasatPose } from './mascot'

export const PROGRAM_MARK = '/images/brand/manajemen-bisnis-digital-mark.png'
export const CURRICULUM_ART = '/images/illustrations/curriculum-journey.webp'
export const FACULTY_ART = '/images/illustrations/faculty-editorial.webp'
export const BLOG_COVER_ART = '/images/illustrations/digital-business-ai.webp'

// Bundled brand artwork is used when a pose has no Media upload.
export const SIASAT_ARTWORK: Record<SiasatPose, { url: string; alt: string }> = {
  greeting: { url: '/images/mascot/siasat-greeting-v2.png', alt: 'Siasat sedang menyapa' },
  tablet: { url: '/images/mascot/siasat-tablet-v2.png', alt: 'Siasat sedang memegang tablet' },
  pointing: { url: '/images/mascot/siasat-pointing-v3.webp', alt: 'Siasat sedang menunjuk' },
  thinking: { url: '/images/mascot/siasat-thinking-v3.webp', alt: 'Siasat sedang berpikir' },
  celebrating: { url: '/images/mascot/siasat-celebrating-v3.webp', alt: 'Siasat sedang merayakan keberhasilan' },
  confused: { url: '/images/mascot/siasat-confused-v3.webp', alt: 'Siasat terlihat bingung' },
}
