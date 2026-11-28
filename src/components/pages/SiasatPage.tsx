import { uiCopy } from '@/lib/i18n-copy'
import { getContentTranslator } from '@/lib/content-translations'
import { localizedAlternates, type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'
import Image from 'next/image'
import { SiasatAnimationGallery } from '@/components/mascot/SiasatAnimationGallery'
import { SiasatFriendsGallery } from '@/components/mascot/SiasatFriendsGallery'
import { getSiasatArtwork, SIASAT_GROUP_ART, SIASAT_LABELS, SIASAT_VARIANTS } from '@/lib/brand/artwork'

export function pageMetadata(locale: Locale): Metadata {
  return {
  title: locale === 'en' ? 'Siasat and Friends Gallery' : 'Galeri Siasat dan Teman-teman',
  description: locale === 'en' ? 'Meet the six Digital Business Management mascots and explore their skills, poses and animations.' : 'Kenali enam maskot Manajemen Bisnis Digital ISTTS, skill yang mereka wakili, serta pose dan animasinya.',
  alternates: localizedAlternates('/siasat', locale),
  }
}

const BACKGROUNDS = ['bg-[#ffbc9e]', 'bg-[#aadfe7]', 'bg-[#f6d985]', 'bg-[#c6caf8]', 'bg-[#d6e5aa]']

export default async function SiasatPage({ locale }: { locale: Locale }) {
  const copy = (text: string) => uiCopy(locale, text)
  const t = await getContentTranslator(locale)
  return (
    <div className="bg-[#fff7e7] text-navy">
      <div className="container-arus pt-[calc(var(--header-h)+40px)] pb-12 sm:pt-[calc(var(--header-h)+56px)] sm:pb-20">
        <header className="mb-10 grid items-center gap-6 sm:mb-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h1 className="font-display text-5xl leading-[0.95] font-extrabold tracking-[-0.055em] sm:text-7xl">{copy("Siasat dan teman-teman")}</h1>
            <p className="mt-5 max-w-lg text-lg text-ink-700">{copy("Kenali enam maskot Manajemen Bisnis Digital ISTTS dan kemampuan yang mereka wakili.")}</p>
          </div>
          <Image
            {...SIASAT_GROUP_ART}
            preload
            sizes="(min-width: 1280px) 690px, (min-width: 1024px) 55vw, (min-width: 640px) 576px, calc(100vw - 32px)"
            className="mx-auto h-auto w-full sm:max-w-xl lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:max-w-none"
          />
          <nav aria-label={copy("Bagian galeri")} className="flex flex-wrap gap-2 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start">
            <a href="#teman-siasat" className="pill border border-navy bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-blue">{copy("Skill Maskot")}</a>
            <a href="#animasi-siasat" className="pill border border-navy/20 bg-white px-4 py-2 text-sm font-bold hover:border-navy">{copy("Animasi Siasat")}</a>
            <a href="#pose-siasat" className="pill border border-navy/20 bg-white px-4 py-2 text-sm font-bold hover:border-navy">{copy("Pose Siasat")}</a>
          </nav>
        </header>
        <SiasatFriendsGallery locale={locale} translate={t} />
        <SiasatAnimationGallery />
        <section id="pose-siasat" aria-labelledby="siasat-expression-title" className="mt-12 scroll-mt-[calc(var(--header-h)+1rem)] sm:mt-16">
          <h2 id="siasat-expression-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{copy("25 pose dan ekspresi")}</h2>
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
                <figcaption className="px-2 py-2.5 text-center text-sm font-bold sm:text-base">{copy(SIASAT_LABELS[variant])}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
