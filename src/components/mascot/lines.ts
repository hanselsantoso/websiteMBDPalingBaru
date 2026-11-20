import type { SiasatPose } from '@/lib/brand/mascot'

/** Fallback speech lines (Part 3 of the brief); the CMS (Branding → Maskot) overrides these. */
export const DEFAULT_LINES: Record<SiasatPose, string[]> = {
  greeting: ['Halo! Aku Sia, strategis kecil yang siap temani kamu menjelajah dunia bisnis digital.'],
  pointing: ['Siap ambil langkah pertama? Daftar sekarang, jalurnya sudah kupetakan.'],
  thinking: ['Hmm, kamu cocok di mana ya? Coba kuis singkat ini dulu.'],
  celebrating: ['Yeay! Langkah pertamamu sudah tercatat.'],
  confused: ['Waduh, halaman ini tidak ada di peta strategiku. Yuk balik ke beranda.'],
  tablet: ['Strategi yang bagus butuh tampilan yang jelas. Lihat karya mahasiswa kami.'],
}

export const POSE_LABEL: Record<SiasatPose, string> = {
  greeting: 'menyapa',
  pointing: 'menunjuk',
  thinking: 'berpikir',
  celebrating: 'merayakan',
  confused: 'bingung',
  tablet: 'menggambar di tablet',
}
