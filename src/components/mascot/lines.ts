import type { Locale } from '@/lib/i18n'
import type { SiasatPose } from '@/lib/brand/mascot'

/** Fallback speech lines (Part 3 of the brief); the CMS (Branding → Maskot) overrides these. */
export const DEFAULT_LINES: Record<Locale, Record<SiasatPose, string[]>> = {
  id: {
    greeting: ['Halo! Aku Pivot. Yuk jelajahi strategi bisnis digital bersama.'],
    pointing: ['Siap ambil langkah pertama? Daftar sekarang, jalurnya sudah kupetakan.'],
    thinking: ['Hmm, kamu cocok di mana ya? Coba kuis singkat ini dulu.'],
    celebrating: ['Yeay! Langkah pertamamu sudah tercatat.'],
    confused: ['Waduh, halaman ini tidak ada di peta strategiku. Yuk balik ke beranda.'],
    tablet: ['Strategi yang bagus butuh tampilan yang jelas. Lihat karya mahasiswa kami.'],
  },
  en: {
    greeting: ['Hi, I’m Pivot. Let’s explore digital business strategy together.'],
    pointing: ['Ready to take the first step? Explore the admissions tracks.'],
    thinking: ['Which skills fit you? Try the program quiz.'],
    celebrating: ['Well done! You’ve taken the first step.'],
    confused: ['This page isn’t on my map. Let’s head home.'],
    tablet: ['Explore how our students turn ideas into working designs.'],
  },
}

export const POSE_LABEL: Record<Locale, Record<SiasatPose, string>> = {
  id: {
    greeting: 'menyapa',
    pointing: 'menunjuk',
    thinking: 'berpikir',
    celebrating: 'merayakan',
    confused: 'bingung',
    tablet: 'menggambar di tablet',
  },
  en: { greeting: 'waving', pointing: 'pointing', thinking: 'thinking', celebrating: 'celebrating', confused: 'looking puzzled', tablet: 'drawing on a tablet' },
}
