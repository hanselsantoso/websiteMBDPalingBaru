import { CREW_PATH } from '@/lib/brand/crew'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'
import Image from 'next/image'
import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'
import { StarField } from '@/components/patterns/Patterns'
import { PaintedDivider } from '@/components/patterns/PaintedDivider'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Eyebrow } from '@/components/ui/Section'
import { SIASAT_GROUP_ART } from '@/lib/brand/artwork'
import { INSTITUTION_NAME, PROGRAM_NAME } from '@/lib/brand/identity'

export function pageMetadata(locale: Locale): Promise<Metadata> {
  return cmsPageMetadata('beranda', '/', locale === 'en' ? 'Digital Business Management' : PROGRAM_NAME, locale)
}

function HomeWelcome({ locale }: { locale: Locale }) {
  const en = locale === 'en'
  return (
    <section data-tone="dark" aria-labelledby="judul-beranda" className="relative isolate overflow-hidden bg-navy text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-navy via-navy to-blue/35" />
      <StarField tone="lime" />
      <div className="container-arus relative grid items-center gap-8 pt-[calc(var(--header-h)+40px)] pb-10 lg:grid-cols-12 lg:pt-[calc(var(--header-h)+56px)] lg:pb-16">
        <div className="lg:col-span-5 lg:self-end">
          <Eyebrow dark>{INSTITUTION_NAME}</Eyebrow>
          <h1 id="judul-beranda" className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,6vw,5rem)] leading-[1.06] font-extrabold tracking-[-0.045em]">
            {en ? 'BSc in Digital' : 'S1 Manajemen'} <span className="text-lime">{en ? 'Business Management' : 'Bisnis Digital'}</span>
          </h1>
          <p className="mt-6 max-w-lg text-lead text-white/80">
            {en ? 'Meet the MBD Crew and explore business, data, and technology.' : 'Kenali MBD Crew sambil menjelajahi bisnis, data, dan teknologi.'}
          </p>
        </div>
        <Image
          {...SIASAT_GROUP_ART}
          preload
          sizes="(min-width: 1280px) 680px, (min-width: 1024px) 55vw, (min-width: 640px) 576px, calc(100vw - 32px)"
          className="mx-auto h-auto w-full sm:max-w-xl lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:max-w-none"
        />
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start">
          <ButtonLink href={CREW_PATH + "#characters"} variant="primaryDark">
            {en ? 'Explore graduate skills' : 'Kenali skill lulusan MBD'} <Icon name="arrow-right" size={18} />
          </ButtonLink>
        </div>
      </div>
      <PaintedDivider />
    </section>
  )
}

export default function HomePage({ locale }: { locale: Locale }) {
  return <CmsPage slug="beranda" path="/" locale={locale} emptyState={<HomeWelcome locale={locale} />} />
}
