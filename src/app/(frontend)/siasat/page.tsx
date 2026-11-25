import type { Metadata } from 'next'
import Image from 'next/image'
import { SiasatAnimationGallery } from '@/components/mascot/SiasatAnimationGallery'
import { getSiasatArtwork, SIASAT_LABELS, SIASAT_VARIANTS } from '@/lib/brand/artwork'

export const metadata: Metadata = {
  title: 'Galeri Siasat',
  description: 'Kenali Siasat, maskot Manajemen Bisnis Digital ISTTS, lewat 25 ekspresi dan tiga animasi.',
  alternates: { canonical: '/siasat' },
}

const BACKGROUNDS = ['bg-[#ffbc9e]', 'bg-[#aadfe7]', 'bg-[#f6d985]', 'bg-[#c6caf8]', 'bg-[#d6e5aa]']

export default function SiasatPage() {
  return (
    <div className="bg-[#fff7e7] text-navy">
      <div className="container-arus pt-[calc(var(--header-h)+40px)] pb-12 sm:pt-[calc(var(--header-h)+56px)] sm:pb-20">
        <header className="mb-10 max-w-2xl sm:mb-14">
          <h1 className="font-display text-5xl leading-[0.95] font-extrabold tracking-[-0.055em] sm:text-7xl">Kenalan dengan Siasat</h1>
          <p className="mt-5 max-w-lg text-lg text-ink-700">
            Rubah berkacamata yang menemani kamu menjelajahi Manajemen Bisnis Digital ISTTS.
          </p>
        </header>
        <SiasatAnimationGallery />
        <section aria-labelledby="siasat-expression-title" className="mt-12 sm:mt-16">
          <h2 id="siasat-expression-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">25 pose dan ekspresi</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {SIASAT_VARIANTS.map((variant, index) => (
              <figure key={variant} className="overflow-hidden rounded-2xl border border-navy/20 bg-white">
                <div className={`p-1.5 sm:p-2 ${BACKGROUNDS[index % BACKGROUNDS.length]}`}>
                  <Image
                    src={getSiasatArtwork(variant).url}
                    alt=""
                    width={220}
                    height={220}
                    sizes="(min-width: 1024px) 208px, (min-width: 640px) 30vw, 47vw"
                    className="mx-auto h-auto w-full max-w-52"
                  />
                </div>
                <figcaption className="px-2 py-2.5 text-center text-sm font-bold sm:text-base">{SIASAT_LABELS[variant]}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
