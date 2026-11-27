import type { Metadata } from 'next'
import { HeroVisual } from '@/components/blocks/HeroVisual'
import { CmsPage, cmsPageMetadata } from '@/components/pages/CmsPage'
import { StarField } from '@/components/patterns/Patterns'
import { PaintedDivider } from '@/components/patterns/PaintedDivider'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Eyebrow } from '@/components/ui/Section'
import { INSTITUTION_NAME, PROGRAM_NAME } from '@/lib/brand/identity'

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata('beranda', '/', PROGRAM_NAME)
}

function HomeWelcome() {
  return (
    <section data-tone="dark" aria-labelledby="judul-beranda" className="relative isolate overflow-hidden bg-navy text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-navy via-navy to-blue/35" />
      <StarField tone="lime" />
      <div className="container-arus relative grid items-center gap-8 pt-[calc(var(--header-h)+40px)] pb-10 lg:grid-cols-12 lg:pt-[calc(var(--header-h)+56px)] lg:pb-16">
        <div className="lg:col-span-7">
          <Eyebrow dark>{INSTITUTION_NAME}</Eyebrow>
          <h1 id="judul-beranda" className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,6vw,5rem)] leading-[1.06] font-extrabold tracking-[-0.045em]">
            S1 Manajemen <span className="text-lime">Bisnis Digital</span>
          </h1>
          <p className="mt-6 max-w-lg text-lead text-white/80">
            Kenalan dengan Siasat, rubah berkacamata yang menemani kamu menjelajahi bisnis, data, dan teknologi.
          </p>
          <ButtonLink href="/siasat" variant="primaryDark" className="mt-8">
            Lihat Galeri Siasat <Icon name="arrow-right" size={18} />
          </ButtonLink>
        </div>
        <div className="lg:col-span-5">
          <HeroVisual pose="greeting" chips={[]} />
        </div>
      </div>
      <PaintedDivider />
    </section>
  )
}

export default function HomePage() {
  return <CmsPage slug="beranda" path="/" emptyState={<HomeWelcome />} />
}
