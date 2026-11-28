import { CREW_CHARACTERS } from '@/lib/brand/crew'
import Image from 'next/image'
import { LocaleLink as Link } from '@/components/providers/LocaleProvider'
import { uiCopy } from '@/lib/i18n-copy'
import type { Locale } from '@/lib/i18n'
import { Icon } from '@/components/ui/Icon'
import { courseSlug } from '@/lib/domain/curriculum'

type Pose = readonly [slug: string, label: string]
type Mascot = {
  slug: keyof typeof CREW_CHARACTERS
  species: string
  color: string
  skill: string
  meaning: Record<Locale, string>
  example: string
  courses: readonly [code: string, title: string][]
  poses: readonly [Pose, ...Pose[]]
}

const MASCOTS: readonly Mascot[] = [
  {
    slug: 'siasat',
    species: 'Rubah',
    color: 'bg-[#ffcfad]',
    skill: 'Strategi bisnis digital',
    meaning: { id: "Pivot membaca perubahan pasar, menguji ide, lalu menentukan kapan strategi bisnis perlu disesuaikan.", en: "Pivot reads changes in the market, tests ideas, and decides when the business strategy needs to change." },
    example: 'Menilai peluang pasar dan menyusun model bisnis digital.',
    courses: [
      ['BD305', 'Strategi Bisnis Digital'],
      ['BD206', 'Technopreneurship'],
    ],
    poses: [['greeting', 'Menyapa']],
  },
  {
    slug: 'rara',
    species: 'Rubah perempuan',
    color: 'bg-[#c7ead9]',
    skill: 'Desain produk digital',
    meaning: { id: "Proto mengubah kebutuhan pengguna menjadi prototipe yang bisa dicoba dan diperbaiki bersama.", en: "Proto turns user needs into prototypes that people can test and improve together." },
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
    species: 'Kucing hitam',
    color: 'bg-[#f8db86]',
    skill: 'Analisis data bisnis',
    meaning: { id: "Metric memilih indikator yang tepat dan membaca pola penjualan sebelum menarik kesimpulan.", en: "Metric chooses the right measures and looks for patterns in sales before drawing conclusions." },
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
    species: 'Berang-berang',
    color: 'bg-[#bce4f3]',
    skill: 'Operasi dan rantai pasok',
    meaning: { id: "Flow menjaga alur pesanan, stok, dan pengiriman agar tiap tahap operasi terhubung.", en: "Flow keeps orders, inventory, and shipping connected throughout the operation." },
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
    species: 'Burung hantu',
    color: 'bg-[#e2d6f6]',
    skill: 'AI untuk bisnis',
    meaning: { id: "Sage mengajukan pertanyaan yang tepat dan memeriksa hasil AI sebelum menggunakannya.", en: "Sage asks the right questions and checks AI outputs before using them." },
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
    species: 'Kelinci',
    color: 'bg-[#ffd5bc]',
    skill: 'Pemasaran dan e-commerce',
    meaning: { id: "Reach memilih kanal yang sesuai untuk menjangkau audiens, lalu mengevaluasi respons pelanggan.", en: "Reach chooses the right channels to connect with an audience and measures how customers respond." },
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
    <section id="characters" aria-labelledby="crew-characters-title" className="scroll-mt-[calc(var(--header-h)+1rem)]">
      <span id="teman-siasat" className="block scroll-mt-[calc(var(--header-h)+1rem)]" />
      <h2 id="crew-characters-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
{copy('Skill yang diwakili tiap maskot')}
      </h2>
      <p className="mt-3 max-w-2xl text-ink-700">
{copy('Dari membaca peluang pasar sampai merancang kampanye, ini contoh kemampuan yang kamu asah di Kurikulum MBD 2024.')}
      </p>
      <div className="mt-6 grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MASCOTS.map((mascot) => {
          const [portrait] = mascot.poses
          const name = CREW_CHARACTERS[mascot.slug]
          const id = `maskot-${name.toLowerCase()}`
          const directory = mascot.slug === 'siasat' ? '/images/mascot/toon' : `/images/mascot/friends/${mascot.slug}`

          return (
            <article
              key={mascot.slug}
              id={id}
              aria-labelledby={id + "-nama"}
              className="min-w-0 scroll-mt-[calc(var(--header-h)+1rem)] overflow-hidden rounded-3xl border border-navy/20 bg-white"
            >
              <span id={`maskot-${mascot.slug}`} className="block scroll-mt-[calc(var(--header-h)+1rem)]" />
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
                    <h3 id={id + "-nama"} className="font-display text-2xl leading-tight font-extrabold">{name}</h3>
                    <p className="text-xs text-ink-700">{copy(mascot.species)}</p>
                    <p className="mt-1 text-sm leading-snug font-bold text-blue">{copy(mascot.skill)}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-700">{mascot.meaning[locale]}</p>
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
                    <span className="group-open:hidden">{locale === 'en' ? `See ${mascot.poses.length} ${name} expressions` : `Lihat ${mascot.poses.length} ekspresi ${name}`}</span>
                    <span className="hidden group-open:inline">{locale === 'en' ? 'Hide expressions' : `Tutup ekspresi ${name}`}</span>
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
                <a href="#poses" className="flex min-h-12 items-center justify-between gap-2 border-t border-navy/10 px-4 text-sm font-bold hover:text-blue sm:px-5">
                  {(locale === 'en' ? 'See all 25 Pivot expressions' : 'Lihat 25 ekspresi Pivot')} <Icon name="arrow-right" size={16} />
                </a>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
