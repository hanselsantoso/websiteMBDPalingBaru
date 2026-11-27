import Image from 'next/image'
import { INVERSE_WORDMARK } from '../Brand'
import type { WidgetProps } from './summary'
import { SiasatBadge } from './SiasatBadge'
import '../admin.css'

const TIPS = [
  'Matikan “Tampilkan penanda [ISI]” di Pengaturan situs hanya setelah semua penanda terisi.',
  'Gunakan “Pratinjau” untuk mengirim tautan draf yang kedaluwarsa dalam 24 jam ke reviewer.',
  'Lead dengan nomor WhatsApp atau email yang sama digabung otomatis. Cek tab “Semua sumber”.',
  'Filter mata kuliah dengan “Kelengkapan silabus < 100” untuk melihat silabus yang belum lengkap.',
  'Isi “Arahkan ke” di Log 404 untuk langsung membuat redirect 301 dari URL lama.',
  'Hero beranda punya daftar kata berputar. Urutkan dengan seret dan lepas di blok Hero.',
  'Total SKS program tetap tersembunyi sampai sakelar “Tampilkan total SKS” dinyalakan.',
]

export function WelcomeWidget({ req }: WidgetProps) {
  const user = req.user as { name?: string | null; email?: string } | null
  const name = user?.name || user?.email?.split('@')[0] || 'Admin'
  const tip = TIPS[Math.floor(Date.now() / 86_400_000) % TIPS.length]
  return (
    <section className="ad-widget ad-widget--welcome" aria-label="Sapaan Siasat">
      <SiasatBadge pose="greeting" />
      <div>
        <div className="ad-welcome__identity">
          <Image {...INVERSE_WORDMARK} alt="MBD" sizes="56px" />
          <span className="ad-mono">Sapaan dari Siasat</span>
        </div>
        <h3>Halo, {name}! Siap atur strategi hari ini?</h3>
        <p>Tips: {tip}</p>
        <nav className="ad-quick" aria-label="Aksi cepat">
          <a href="/admin/collections/posts/create">Post baru</a>
          <a href="/admin/collections/faculty/create">Tambah dosen</a>
          <a href="/admin/collections/media/create">Unggah media</a>
          <a href="/admin/collections/pmb-applications">Lihat pendaftar</a>
        </nav>
      </div>
    </section>
  )
}
