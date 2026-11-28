import { CREW_PATH } from '@/lib/brand/crew'
import { getContentTranslator, translateContent } from '@/lib/content-translations'
import { uiCopy } from '@/lib/i18n-copy'
import { withLocale, type Locale } from '@/lib/i18n'
import Image from '@/components/ui/CmsImage'
import { LocaleLink as Link } from '@/components/providers/LocaleProvider'
import { PrimaryCta, SecondaryActions, WhatsAppLink, QuizLink, BrochureButton } from '@/components/cta/CtaLinks'
import { Siasat } from '@/components/mascot/Siasat'
import { RotatingWords } from '@/components/motion/Interactive'
import { PaintedDivider } from '@/components/patterns/PaintedDivider'
import { Fin, Marquee, StarField, Wave } from '@/components/patterns/Patterns'
import { buttonStyles } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PendingChip } from '@/components/ui/Isi'
import { Chip, Eyebrow } from '@/components/ui/Section'
import { PAGE_HEADER_ART, SIASAT_GROUP_ART } from '@/lib/brand/artwork'
import { isSiasatPose } from '@/lib/brand/mascot'
import { getCurriculum, getPartners } from '@/lib/data'
import { asMedia, cn } from '@/lib/utils'
import { HeroVisual } from './HeroVisual'
import { anchor, type BlockProps } from './types'

async function PartnerStrip({ label, showPlaceholders, locale }: { label?: string | null; showPlaceholders: boolean; locale: Locale }) {
  const copy = (text: string) => uiCopy(locale, text)
  const partners = translateContent(await getPartners(), await getContentTranslator(locale))
  const items = partners
    .map((partner) => ({ name: String(partner.name), logo: asMedia(partner.logo), url: partner.url as string | undefined }))
    .filter((partner) => partner.name)
  if (!items.length && !showPlaceholders) return null
  return (
    <div className="relative z-10 border-t border-white/10">
      <div className="container-arus flex items-center gap-6 py-4">
        <p className="label-mono hidden shrink-0 text-white/60 sm:block">{label || copy("Akreditasi dan mitra")}</p>
        <Marquee duration={45} className="min-w-0 flex-1 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]" label={label || copy("Akreditasi dan mitra")}>
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
  const copy = (text: string) => uiCopy(ctx.locale, text)
  const words = ((block.rotatingWords as { word?: string }[]) ?? []).map((item) => item.word).filter(Boolean) as string[]
  const chips = ((block.orbitChips as { label?: string }[]) ?? []).map((item) => item.label).filter(Boolean) as string[]
  const sentence = `${block.headlinePrefix ?? ''} ${words.join(', ')}`.trim()
  const pose = isSiasatPose(block.mascotPose) ? block.mascotPose : 'greeting'
  const isHomeOpening = ctx.pageSlug === 'beranda' && ctx.isFirst
  const actions = (
    <div
      className={cn(
        'flex flex-col items-start gap-5',
        isHomeOpening ? 'lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start' : 'mt-9',
      )}
    >
      <PrimaryCta id="hero" tone="dark" placement="hero" label={block.primaryLabel} />
      <SecondaryActions placement="hero" labels={{ quiz: block.quizLabel, whatsapp: block.whatsappLabel, brochure: block.brochureLabel }} />
      {ctx.pageSlug === 'beranda' && !isHomeOpening ? (
        <Link href={CREW_PATH} className="inline-flex min-h-11 items-center gap-2 rounded-full font-semibold text-lime hover:underline">{copy("Lihat MBD Crew") + " "}<Icon name="arrow-right" size={18} />
        </Link>
      ) : null}
    </div>
  )

  return (
    <section data-tone="dark" id={anchor(block)} aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-navy text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--brand-navy)_0%,var(--brand-navy)_48%,color-mix(in_oklab,var(--brand-blue)_42%,var(--brand-navy))_100%)]" />
      <StarField tone="lime" />
      
      <div className={cn(
        'container-arus relative grid pt-[calc(var(--header-h)+40px)] pb-16 lg:grid-cols-12 lg:items-center lg:gap-6 lg:pt-[calc(var(--header-h)+56px)] lg:pb-24',
        isHomeOpening ? 'gap-7' : 'gap-12',
      )}>
        <div className={isHomeOpening ? 'lg:col-span-5 lg:self-end' : 'lg:col-span-7'}>
          {block.eyebrow ? <Eyebrow dark>{block.eyebrow}</Eyebrow> : null}
          <h1 id="hero-title" className={cn('mt-5 text-hero font-extrabold', isHomeOpening && 'lg:text-[clamp(3.25rem,5vw,4.5rem)]')}>
            <span className="sr-only">{sentence}</span>
            <span aria-hidden="true">
              {block.headlinePrefix} <RotatingWords words={words} />
            </span>
          </h1>
          {block.subheadline ? <p className="mt-6 max-w-xl text-lead text-white/80">{block.subheadline}</p> : null}
          {isHomeOpening ? null : actions}
        </div>
        {isHomeOpening ? (
          <>
            <div className="mx-auto w-full min-w-0 sm:max-w-xl lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:max-w-none">
              <Image {...SIASAT_GROUP_ART} preload sizes="(min-width: 1280px) 690px, (min-width: 1024px) 55vw, (min-width: 640px) 576px, calc(100vw - 32px)" className="h-auto w-full" />
              {chips.length ? (
                <ul className="mt-3 flex flex-wrap justify-center gap-2">
                  {chips.slice(0, 4).map((chip, index) => (
                    <li key={chip + index} className="rounded-full border border-white/25 px-3 py-1 font-mono text-xs text-white/90">
                      {chip}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-2 text-center">
                <Link
                  href={CREW_PATH + "#characters"}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-bold text-lime hover:underline"
                >{copy("Kenali skill lulusan MBD") + " "}<Icon name="arrow-right" size={16} />
                </Link>
              </div>
            </div>
            {actions}
          </>
        ) : (
          <div className="relative lg:col-span-5">
            <HeroVisual pose={pose} chips={chips} />
          </div>
        )}
      </div>
      {block.showPartnerStrip ? <PartnerStrip locale={ctx.locale} label={block.partnerStripLabel} showPlaceholders={ctx.showPlaceholders} /> : null}
      <PaintedDivider />
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

export async function PageHeaderBlock({ block, ctx }: BlockProps) {
  const pose = isSiasatPose(block.mascotPose) ? block.mascotPose : null
  const pageArt = ctx.isFirst && Object.hasOwn(PAGE_HEADER_ART, ctx.pageSlug)
    ? PAGE_HEADER_ART[ctx.pageSlug as keyof typeof PAGE_HEADER_ART]
    : null
  const actions = (block.actions as { label: string; kind: string; href?: string }[]) ?? []
  const needsPdf = actions.some((action) => action.kind === 'curriculumPdf')
  const pdfHref = needsPdf ? await curriculumPdfHref() : null

  return (
    <section data-tone="dark" id={anchor(block)} aria-labelledby={`judul-${block.id}`} className="relative isolate overflow-hidden bg-navy text-white">
      <StarField tone="lime" count={5} />
      {pageArt ? null : <Fin className="pattern-fin pointer-events-none absolute -bottom-10 -left-16 size-80 text-white/[0.04]" />}
      
      <div className={cn(
        'container-arus relative grid gap-10 pt-[calc(var(--header-h)+40px)] pb-20 lg:grid-cols-12 lg:pt-[calc(var(--header-h)+64px)] lg:pb-24',
        pageArt ? 'lg:items-center' : 'lg:items-end',
      )}>
        <div className={pageArt ? 'lg:col-span-7' : pose ? 'lg:col-span-8' : 'lg:col-span-10'}>
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
                      <a key={key} href={withLocale(pdfHref ?? '/kurikulum/cetak', ctx.locale)} className={cn(buttonStyles.primaryDark)} target={pdfHref?.startsWith('/kurikulum') ? undefined : '_blank'} rel="noopener">
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
        {pageArt ? (
          <Image
            {...pageArt}
            preload
            sizes="(min-width: 1280px) 480px, (min-width: 1024px) 38vw, (min-width: 640px) 480px, calc(100vw - 32px)"
            className="mx-auto h-auto w-full max-w-[480px] lg:col-span-5"
          />
        ) : pose ? (
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
