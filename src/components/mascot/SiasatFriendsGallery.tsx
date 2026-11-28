import Image from 'next/image'
import { LocaleLink as Link } from '@/components/providers/LocaleProvider'
import { uiCopy } from '@/lib/i18n-copy'
import type { Locale } from '@/lib/i18n'
import { Icon } from '@/components/ui/Icon'
import { courseSlug } from '@/lib/domain/curriculum'

type Pose = readonly [slug: string, label: string]
type Mascot = {
  slug: string
  name: string
  species: string
  color: string
  skill: string
  meaning: string
  example: string
  courses: readonly [code: string, title: string][]
  poses: readonly [Pose, ...Pose[]]
}

const MASCOTS: readonly Mascot[] = [
  {
    slug: 'siasat',
    name: 'Siasat',
    species: 'Rubah',
    color: 'bg-[#ffcfad]',
    skill: 'Strategi bisnis digital',
    meaning: 'Rubah yang cepat membaca situasi melambangkan cara berpikir strategis.',
    example: 'Menilai peluang pasar dan menyusun model bisnis digital.',
    courses: [
      ['BD305', 'Strategi Bisnis Digital'],
      ['BD206', 'Technopreneurship'],
    ],
    poses: [['greeting', 'Menyapa']],
  },
  {
    slug: 'rara',
    name: 'Rara',
    species: 'Rubah perempuan',
    color: 'bg-[#c7ead9]',
    skill: 'Desain produk digital',
    meaning: 'Rara mencatat ide di tabletnya dan mengajak tim melihat produk dari sisi pengguna.',
    example: 'Menerjemahkan kebutuhan pelanggan menjadi alur dan prototipe aplikasi.',
    courses: [
      ['BD405', 'UI/UX untuk Aplikasi Bisnis'],
      ['BD406', 'Manajemen Hubungan Pelanggan'],
    ],
    poses: [
      ['menyapa', 'Menyapa'],
      ['tertawa', 'Tertawa lepas'],
      ['kaget', 'Kaget'],
      ['fokus', 'Fokus'],
      ['merayakan', 'Merayakan'],
      ['skeptis', 'Skeptis'],
    ],
  },
  {
    slug: 'kiko',
    name: 'Kiko',
    species: 'Kucing hitam',
    color: 'bg-[#f8db86]',
    skill: 'Analisis data bisnis',
    meaning: 'Tatapan Kiko yang tajam menggambarkan kebiasaan memeriksa bukti sebelum menarik kesimpulan.',
    example: 'Mengolah data penjualan dan menjelaskan pola yang relevan untuk keputusan bisnis.',
    courses: [
      ['BD401', 'Analisis Data Bisnis'],
      ['BD501', 'Data Science untuk Bisnis Digital'],
    ],
    poses: [
      ['percaya-diri', 'Percaya diri'],
      ['kaget', 'Kaget'],
      ['curiga', 'Curiga'],
      ['tertawa', 'Tertawa lepas'],
    ],
  },
  {
    slug: 'bimo',
    name: 'Bimo',
    species: 'Berang-berang',
    color: 'bg-[#bce4f3]',
    skill: 'Operasi dan rantai pasok',
    meaning: 'Bimo menggambarkan kerja tim dan pentingnya menghubungkan setiap tahap pekerjaan.',
    example: 'Memetakan alur pesanan dan stok, lalu memilih sistem untuk merapikan proses.',
    courses: [
      ['BD403', 'Manajemen Rantai Pasok'],
      ['BD202', 'Manajemen Sistem Informasi untuk Bisnis'],
    ],
    poses: [
      ['menyapa', 'Menyapa'],
      ['bingung', 'Bingung'],
      ['kaget', 'Kaget'],
      ['acung-jempol', 'Acung jempol'],
    ],
  },
  {
    slug: 'uli',
    name: 'Uli',
    species: 'Burung hantu',
    color: 'bg-[#e2d6f6]',
    skill: 'AI untuk bisnis',
    meaning: 'Uli yang gemar membaca melambangkan kebiasaan belajar dan memeriksa kembali jawaban.',
    example: 'Memilih alat AI, menulis prompt, dan memeriksa hasilnya untuk tugas bisnis.',
    courses: [
      ['BD204', 'Prompt Engineering untuk Aplikasi Bisnis'],
      ['BD404', 'Teknologi AI untuk Bisnis'],
    ],
    poses: [
      ['membaca', 'Membaca'],
      ['dapat-ide', 'Dapat ide'],
      ['mengantuk', 'Mengantuk'],
      ['merayakan', 'Merayakan'],
    ],
  },
  {
    slug: 'piko',
    name: 'Piko',
    species: 'Kelinci',
    color: 'bg-[#ffd5bc]',
    skill: 'Pemasaran dan e-commerce',
    meaning: 'Piko yang gesit menggambarkan keberanian mencoba ide dan menyesuaikannya dari respons pelanggan.',
    example: 'Merancang kampanye digital dan mengevaluasi hasil penjualan di kanal online.',
    courses: [
      ['BD105', 'Pemasaran Digital'],
      ['BD301', 'Pengembangan Bisnis E-Commerce'],
    ],
    poses: [
      ['antusias', 'Antusias'],
      ['malu', 'Malu'],
      ['kaget', 'Kaget'],
      ['bertekad', 'Bertekad'],
    ],
  },
]

export function SiasatFriendsGallery({ locale, translate }: { locale: Locale; translate: (text: string) => string }) {
  const copy = (text: string) => uiCopy(locale, translate(text))
  return (
    <section id="teman-siasat" aria-labelledby="teman-siasat-title" className="scroll-mt-[calc(var(--header-h)+1rem)]">
      <h2 id="teman-siasat-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
{copy('Skill yang diwakili tiap maskot')}
      </h2>
      <p className="mt-3 max-w-2xl text-ink-700">
{copy('Dari membaca peluang pasar sampai merancang kampanye, ini contoh kemampuan yang kamu asah di Kurikulum MBD 2024.')}
      </p>
      <div className="mt-6 grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MASCOTS.map((mascot) => {
          const [portrait] = mascot.poses
          const directory = mascot.slug === 'siasat' ? '/images/mascot/toon' : `/images/mascot/friends/${mascot.slug}`

          return (
            <article
              key={mascot.slug}
              id={`maskot-${mascot.slug}`}
              aria-labelledby={`nama-maskot-${mascot.slug}`}
              className="min-w-0 scroll-mt-[calc(var(--header-h)+1rem)] overflow-hidden rounded-3xl border border-navy/20 bg-white"
            >
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-4">
                  <div className={`rounded-2xl ${mascot.color}`}>
                    <Image
                      src={`${directory}/${portrait[0]}.webp`}
                      alt=""
                      width={448}
                      height={448}
                      sizes="(min-width: 640px) 96px, 88px"
                      className="h-auto w-full"
                    />
                  </div>
                  <div>
                    <h3 id={`nama-maskot-${mascot.slug}`} className="font-display text-2xl leading-tight font-extrabold">{mascot.name}</h3>
                    <p className="text-xs text-ink-700">{copy(mascot.species)}</p>
                    <p className="mt-1 text-sm leading-snug font-bold text-blue">{copy(mascot.skill)}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-700">{copy(mascot.meaning)}</p>
                <p className="mt-2 text-sm leading-relaxed font-semibold">{copy(mascot.example)}</p>
                <ul aria-label={copy('Mata kuliah terkait')} className="mt-4 space-y-1">
                  {mascot.courses.map(([code, title]) => (
                    <li key={code}>
                      <Link
                        href={`/kurikulum/${courseSlug(code, title)}`}
                        prefetch={false}
                        className="inline-flex min-h-7 items-center gap-1.5 text-sm text-navy underline decoration-navy/25 underline-offset-4 hover:text-blue"
                      >
                        <span>{copy(title)}</span> <Icon name="arrow-right" size={12} className="shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {mascot.poses.length > 1 ? (
                <details className="group border-t border-navy/10">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-4 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-blue sm:px-5 [&::-webkit-details-marker]:hidden">
                    <span className="group-open:hidden">{locale === 'en' ? `See ${mascot.poses.length} ${mascot.name} expressions` : `Lihat ${mascot.poses.length} ekspresi ${mascot.name}`}</span>
                    <span className="hidden group-open:inline">{locale === 'en' ? 'Hide expressions' : `Tutup ekspresi ${mascot.name}`}</span>
                    <Icon name="chevron-down" size={16} className="group-open:rotate-180" />
                  </summary>
                  <ul className="grid grid-cols-2 gap-2 px-3 pb-3 xs:grid-cols-3">
                    {mascot.poses.map(([pose, label]) => (
                      <li key={pose} className="min-w-0 overflow-hidden rounded-xl bg-ink-50">
                        <figure>
                          <Image
                            src={`${directory}/${pose}.webp`}
                            alt=""
                            width={448}
                            height={448}
                            sizes="(min-width: 1280px) 115px, (min-width: 768px) 15vw, (min-width: 360px) 28vw, 43vw"
                            className={`h-auto w-full ${mascot.color}`}
                          />
                          <figcaption className="px-1 py-1.5 text-center text-xs leading-tight font-semibold">
                            {copy(label)}
                          </figcaption>
                        </figure>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <a href="#pose-siasat" className="flex min-h-12 items-center justify-between gap-2 border-t border-navy/10 px-4 text-sm font-bold hover:text-blue sm:px-5">
                  {copy('Lihat 25 ekspresi Siasat')} <Icon name="arrow-right" size={16} />
                </a>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
