import Image from 'next/image'
import Link from 'next/link'
import { PrimaryCta, SecondaryActions, WhatsAppLink, QuizLink, BrochureButton } from '@/components/cta/CtaLinks'
import { Siasat } from '@/components/mascot/Siasat'
import { RotatingWords } from '@/components/motion/Interactive'
import { Fin, Marquee, StarField, Wave } from '@/components/patterns/Patterns'
import { buttonStyles } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PendingChip } from '@/components/ui/Isi'
import { Chip, Eyebrow } from '@/components/ui/Section'
import { isSiasatPose } from '@/lib/brand/mascot'
import { getCurriculum, getPartners } from '@/lib/data'
import { asMedia, cn } from '@/lib/utils'
import { HeroVisual } from './HeroVisual'
import { anchor, type BlockProps } from './types'

async function PartnerStrip({ label, showPlaceholders }: { label?: string | null; showPlaceholders: boolean }) {
  const partners = await getPartners()
  const items = partners
    .map((partner) => ({ name: String(partner.name), logo: asMedia(partner.logo), url: partner.url as string | undefined }))
    .filter((partner) => partner.name)
  if (!items.length && !showPlaceholders) return null
  return (
    <div className="relative z-10 border-t border-white/10">
      <div className="container-arus flex items-center gap-6 py-4">
        <p className="label-mono hidden shrink-0 text-white/60 sm:block">{label || 'Akreditasi dan mitra'}</p>
        <Marquee duration={45} className="min-w-0 flex-1 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]" label={label || 'Akreditasi dan mitra'}>
          {items.length
            ? items.map((partner) =>
                partner.logo ? (
                  <Image
                    key={partner.name}
                    src={partner.logo.url!}
                    alt={partner.logo.alt || partner.name}
                    width={140}
                    height={40}
                    className="h-9 w-auto rounded-md bg-white px-2 py-1"
                  />
                ) : (
                  <span key={partner.name} className="font-display text-lg font-bold whitespace-nowrap text-white/85">
                    {partner.name}
                  </span>
                ),
              )
            : ['logo akreditasi', 'logo mitra industri 1', 'logo mitra industri 2', 'logo mitra industri 3'].map((hint) => (
                <PendingChip key={hint} hint={hint} />
              ))}
        </Marquee>
      </div>
    </div>
  )
}

export async function HeroBlock({ block, ctx }: BlockProps) {
  const words = ((block.rotatingWords as { word?: string }[]) ?? []).map((item) => item.word).filter(Boolean) as string[]
  const chips = ((block.orbitChips as { label?: string }[]) ?? []).map((item) => item.label).filter(Boolean) as string[]
  const sentence = `${block.headlinePrefix ?? ''} ${words.join(', ')}`.trim()
  const pose = isSiasatPose(block.mascotPose) ? block.mascotPose : 'greeting'

  return (
    <section data-tone="dark" id={anchor(block)} aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-navy text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--brand-navy)_0%,var(--brand-navy)_48%,color-mix(in_oklab,var(--brand-blue)_42%,var(--brand-navy))_100%)]" />
      <StarField tone="lime" />
      
      <div className="container-arus relative grid gap-12 pt-[calc(var(--header-h)+40px)] pb-16 lg:grid-cols-12 lg:items-center lg:gap-6 lg:pt-[calc(var(--header-h)+56px)] lg:pb-24">
        <div className="lg:col-span-7">
          {block.eyebrow ? <Eyebrow dark>{block.eyebrow}</Eyebrow> : null}
          <h1 id="hero-title" className="mt-5 text-hero font-extrabold">
            <span className="sr-only">{sentence}</span>
            <span aria-hidden="true">
              {block.headlinePrefix} <RotatingWords words={words} />
            </span>
          </h1>
          {block.subheadline ? <p className="mt-6 max-w-xl text-lead text-white/80">{block.subheadline}</p> : null}
          <div className="mt-9 flex flex-col items-start gap-5">
            <PrimaryCta id="hero" tone="dark" placement="hero" label={block.primaryLabel} />
            <SecondaryActions placement="hero" labels={{ quiz: block.quizLabel, whatsapp: block.whatsappLabel, brochure: block.brochureLabel }} />
          </div>
        </div>
        <div className="relative lg:col-span-5">
          <HeroVisual pose={pose} chips={chips} />
        </div>
      </div>
      {block.showPartnerStrip ? <PartnerStrip label={block.partnerStripLabel} showPlaceholders={ctx.showPlaceholders} /> : null}
      <div className="relative h-[clamp(64px,9vw,128px)]">
        <Fin className="anim-fin pattern-fin absolute bottom-[clamp(26px,4vw,52px)] left-0 size-[clamp(36px,4.5vw,64px)] text-cyan" />
        <Wave preset="toWhite" />
      </div>
    </section>
  )
}

function Highlighted({ title, highlight }: { title: string; highlight?: string | null }) {
  if (!highlight) return <>{title}</>
  const index = title.toLowerCase().indexOf(highlight.toLowerCase())
  if (index < 0) return <>{title}</>
  return (
    <>
      {title.slice(0, index)}
      <span className="relative inline-block -rotate-1 rounded-2xl bg-lime px-[0.18em] text-navy">{title.slice(index, index + highlight.length)}</span>
      {title.slice(index + highlight.length)}
    </>
  )
}

async function curriculumPdfHref(): Promise<string> {
  const { version } = await getCurriculum()
  const pdf = asMedia(version?.pdf)
  return pdf?.url ?? '/kurikulum/cetak'
}

export async function PageHeaderBlock({ block }: BlockProps) {
  const pose = isSiasatPose(block.mascotPose) ? block.mascotPose : null
  const actions = (block.actions as { label: string; kind: string; href?: string }[]) ?? []
  const needsPdf = actions.some((action) => action.kind === 'curriculumPdf')
  const pdfHref = needsPdf ? await curriculumPdfHref() : null

  return (
    <section data-tone="dark" id={anchor(block)} aria-labelledby={`judul-${block.id}`} className="relative isolate overflow-hidden bg-navy text-white">
      <StarField tone="lime" count={5} />
      <Fin className="pattern-fin pointer-events-none absolute -bottom-10 -left-16 size-80 text-white/[0.04]" />
      
      <div className="container-arus relative grid gap-10 pt-[calc(var(--header-h)+40px)] pb-20 lg:grid-cols-12 lg:items-end lg:pt-[calc(var(--header-h)+64px)] lg:pb-24">
        <div className={cn(pose ? 'lg:col-span-8' : 'lg:col-span-10')}>
          <div className="flex flex-wrap items-center gap-3">
            {block.eyebrow ? <Eyebrow dark>{block.eyebrow}</Eyebrow> : null}
            {block.chip ? <Chip tone="lime">{block.chip}</Chip> : null}
          </div>
          <h1 id={`judul-${block.id}`} className="mt-5 text-[clamp(2.25rem,1.3rem+4.2vw,4.75rem)] leading-[1.04] font-extrabold tracking-[-0.03em]">
            <Highlighted title={String(block.title ?? '')} highlight={block.highlight} />
          </h1>
          {block.intro ? <p className="mt-6 max-w-2xl text-lead text-white/80">{block.intro}</p> : null}
          {actions.length ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {actions.map((action, index) => {
                const key = `${action.kind}-${index}`
                const secondary = cn(buttonStyles.secondaryDark)
                switch (action.kind) {
                  case 'primaryCta':
                    return <PrimaryCta key={key} id={`header-${block.id}`} tone="dark" placement="page-header" label={action.label} />
                  case 'whatsapp':
                    return <WhatsAppLink key={key} placement="page-header" className={secondary} label={action.label} />
                  case 'quiz':
                    return <QuizLink key={key} className={secondary} label={action.label} />
                  case 'brochure':
                    return <BrochureButton key={key} placement="page-header" className={secondary} label={action.label} />
                  case 'curriculumPdf':
                    return (
                      <a key={key} href={pdfHref ?? '/kurikulum/cetak'} className={cn(buttonStyles.primaryDark)} target={pdfHref?.startsWith('/kurikulum') ? undefined : '_blank'} rel="noopener">
                        <Icon name="download" size={18} strokeWidth={2.5} />
                        {action.label}
                      </a>
                    )
                  default:
                    return (
                      <Link key={key} href={action.href || '#'} className={index === 0 ? cn(buttonStyles.primaryDark) : secondary}>
                        {action.label}
                        <Icon name="arrow-right" size={18} strokeWidth={2.5} />
                      </Link>
                    )
                }
              })}
            </div>
          ) : null}
        </div>
        {pose ? (
          <div className="hidden justify-self-end lg:col-span-4 lg:block">
            <Siasat pose={pose} size="lg" interactive onDark showArtTag />
          </div>
        ) : null}
      </div>
      <div className="relative h-[clamp(56px,8vw,112px)]">
        <Wave preset="toWhite" />
      </div>
    </section>
  )
}
