import { translateContent } from '@/lib/content-translations'
import { uiCopy } from '@/lib/i18n-copy'
import { LocaleLink as Link } from '@/components/providers/LocaleProvider'
import { PrimaryCta, SecondaryActions } from '@/components/cta/CtaLinks'
import { Siasat } from '@/components/mascot/Siasat'
import { CountUp, Reveal } from '@/components/motion/Interactive'
import { Fin, Marquee, Star, StarField, Wave } from '@/components/patterns/Patterns'
import { Icon } from '@/components/ui/Icon'
import { PendingChip, TextOr } from '@/components/ui/Isi'
import { Eyebrow, SectionHeading } from '@/components/ui/Section'
import { HERO_WAVE_ART } from '@/lib/brand/artwork'
import { isSiasatPose } from '@/lib/brand/mascot'
import { programTotals } from '@/lib/domain/curriculum'
import { isPlaceholder } from '@/lib/domain/placeholders'
import { getCurriculum, getPartners, getPmbInfo } from '@/lib/data'
import { asMedia, cn, formatDate } from '@/lib/utils'
import type { WhyMbdBlock as WhyMbdBlockData } from '@/payload-types'
import Image from '@/components/ui/CmsImage'
import { anchor, type BlockProps } from './types'
import { WhyMbdCards } from './WhyMbdCards'

export async function StatsBlock({ block, ctx }: BlockProps) {
  const items = (block.items as Record<string, any>[]) ?? []
  const needsCurriculum = items.some((item) => item.source && item.source !== 'manual')
  const curriculum = needsCurriculum ? await getCurriculum() : null
  const totals = curriculum ? programTotals(curriculum.courses as never) : null
  const resolved = items
    .map((item) => {
      if (item.source === 'totalCourses')
        return totals ? { ...item, value: String(totals.count) } : null
      if (item.source === 'totalCredits')
        return totals && ctx.showTotalSks ? { ...item, value: String(totals.credits) } : null
      return item
    })
    .filter((item): item is Record<string, any> => Boolean(item))
    .filter((item) => ctx.showPlaceholders || !isPlaceholder(item.value))
  if (!resolved.length) return null

  return (
    <section data-tone="light" id={anchor(block)} className="relative bg-white py-14 lg:py-20">
      <div className="container-arus grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-4">
          {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
          {block.heading ? (
            <h2 className="mt-3 text-title font-bold text-navy">{block.heading}</h2>
          ) : null}
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:col-span-8 lg:grid-cols-4">
          {resolved.map((item, index) => {
            const numeric = /^\d+$/.test(String(item.value).trim())
            const featured = index === 0
            return (
              <Reveal
                as="li"
                key={item.id ?? index}
                delay={index * 90}
                className={cn(
                  'sticker flex min-h-44 flex-col justify-between p-5',
                  featured && 'bg-blue text-white',
                )}
              >
                <p className="font-display text-[clamp(2.75rem,2rem+3vw,4rem)] leading-none font-extrabold tracking-[-0.04em]">
                  {isPlaceholder(item.value) ? (
                    <PendingChip hint={item.label} />
                  ) : numeric ? (
                    <CountUp value={Number(item.value)} />
                  ) : (
                    item.value
                  )}
                  {item.suffix && !isPlaceholder(item.value) ? (
                    <span
                      className={cn(
                        'label-mono ml-2 align-top text-sm',
                        featured ? 'text-lime' : 'text-blue',
                      )}
                    >
                      {item.suffix}
                    </span>
                  ) : null}
                </p>
                <div className="mt-4">
                  <p
                    className={cn(
                      'font-semibold leading-snug',
                      featured ? 'text-white' : 'text-navy',
                    )}
                  >
                    {item.label}
                  </p>
                  {item.note && (ctx.showPlaceholders || !isPlaceholder(item.note)) ? (
                    <p
                      className={cn(
                        'label-mono mt-1 text-[0.6875rem]',
                        featured ? 'text-white/75' : 'text-ink-600',
                      )}
                    >
                      <TextOr value={item.note} show={ctx.showPlaceholders} />
                    </p>
                  ) : null}
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export function WhyMbdBlock({ block, ctx }: BlockProps) {
  const cards = ((block.cards as WhyMbdBlockData['cards']) ?? []).map(({ id, title, body, icon, courseCodes, size }) => ({
    id, title, body, icon, courseCodes, size,
  }))

  return (
    <section data-tone="light" id={anchor(block)} className="relative bg-ink-50 py-20 lg:py-28">
      <div className="container-arus">
        <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
        <WhyMbdCards cards={cards} showPlaceholders={ctx.showPlaceholders} showMascots={ctx.pageSlug === 'beranda'} />
      </div>
    </section>
  )
}

export async function MarqueeBlock({ block, ctx }: BlockProps) {
  const copy = (text: string) => uiCopy(ctx.locale, text)
  const tones: Record<string, { section: string; star: string; text: string }> = {
    navy: { section: 'bg-navy', star: 'text-lime', text: 'text-white' },
    blue: { section: 'bg-blue', star: 'text-lime', text: 'text-white' },
    light: { section: 'bg-white border-y-2 border-navy', star: 'text-blue', text: 'text-navy' },
  }
  const tone = tones[block.tone as string] ?? tones.navy
  const isDark = block.tone !== 'light'

  if (block.source === 'partners') {
    const partners = translateContent(await getPartners(), ctx.translate)
    if (!partners.length && !ctx.showPlaceholders) return null
    return (
      <section
        data-tone={isDark ? 'dark' : 'light'}
        id={anchor(block)}
        className={cn('py-8', tone.section)}
        aria-label={block.label || copy("Mitra industri")}
      >
        <div className="container-arus mb-4">
          <p className={cn('label-mono', isDark ? 'text-white/70' : 'text-ink-600')}>
            {block.label || copy("Mitra industri")}
          </p>
        </div>
        <Marquee duration={50}>
          {partners.length
            ? partners.map((partner) => {
                const logo = asMedia(partner.logo)
                return logo ? (
                  <Image
                    key={partner.id}
                    src={logo.url!}
                    alt={logo.alt || partner.name}
                    width={160}
                    height={48}
                    className="h-10 w-auto"
                  />
                ) : (
                  <span
                    key={partner.id}
                    className={cn('font-display text-2xl font-bold whitespace-nowrap', tone.text)}
                  >
                    {partner.name}
                  </span>
                )
              })
            : ['logo mitra 1', 'logo mitra 2', 'logo mitra 3', 'logo mitra 4'].map((hint) => (
                <PendingChip key={hint} hint={hint} />
              ))}
        </Marquee>
      </section>
    )
  }

  const words = ((block.words as { text?: string }[]) ?? [])
    .map((item) => item.text)
    .filter(Boolean) as string[]
  if (!words.length) return null
  return (
    <section
      data-tone={isDark ? 'dark' : 'light'}
      id={anchor(block)}
      className={cn('overflow-hidden py-5 lg:py-6', tone.section)}
      aria-label={block.label || words.join(', ')}
    >
      <Marquee duration={36}>
        {words.map((word) => (
          <span
            key={word}
            className={cn(
              'flex items-center gap-10 font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] leading-none font-extrabold tracking-[-0.03em] whitespace-nowrap',
              tone.text,
            )}
          >
            {word}
            <Star className={cn('size-6 shrink-0', tone.star)} />
          </span>
        ))}
      </Marquee>
    </section>
  )
}

async function DeadlineChip({
  ctx,
  label,
  showPlaceholders,
}: {
  ctx: BlockProps['ctx']
  label?: string | null
  showPlaceholders: boolean
}) {
  const copy = (text: string) => uiCopy(ctx.locale, text)
  const info = await getPmbInfo().catch(() => null)
  const wave = translateContent(info?.activeWave, ctx.translate)
  if (!wave && !showPlaceholders) return null
  const date = wave?.closeDate ? formatDate(wave.closeDate, 'long', ctx.locale) : null
  return (
    <p className="label-mono inline-flex flex-wrap items-center gap-2 rounded-full border-2 border-lime px-4 py-2 text-lime">
      <Icon name="calendar" size={16} />
      <span>{label || copy("Batas akhir pendaftaran")}</span>
      {wave?.name ? <span className="text-white">· {wave.name}</span> : null}
      <span className="text-white">·</span>
      {date ? (
        <span className="text-white">{date}</span>
      ) : (
        <PendingChip hint={copy("batas akhir pendaftaran gelombang berjalan")} />
      )}
    </p>
  )
}

export async function CtaBandBlock({ block, ctx }: BlockProps) {
  const pose = isSiasatPose(block.mascotPose) ? block.mascotPose : null

  if (block.variant === 'strip') {
    return (
      <section data-tone="light" id={anchor(block)} className="bg-white py-10">
        <div className="container-arus">
          <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-[32px] border-2 border-navy bg-navy p-7 text-white shadow-[6px_6px_0_0_var(--brand-blue)] md:flex-row md:items-center md:justify-between md:p-9">
            <Fin className="pattern-fin absolute -top-8 right-[30%] -z-10 size-40 text-white/[0.06]" />
            <div className="grid gap-3">
              <h2 className="text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] leading-tight font-bold">
                {block.heading}
              </h2>
              {block.body ? <p className="text-white/75">{block.body}</p> : null}
              {block.showDeadline ? (
                <DeadlineChip ctx={ctx} label={block.deadlineLabel} showPlaceholders={ctx.showPlaceholders} />
              ) : null}
            </div>
            <div className="shrink-0">
              <PrimaryCta id={`strip-${block.id ?? ctx.index}`} tone="dark" placement="cta-strip" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      data-tone="dark"
      data-joins-footer={ctx.isLast || undefined}
      id={anchor(block)}
      aria-labelledby={`cta-${block.id}`}
      className="relative isolate overflow-hidden bg-navy text-white"
    >
      <StarField tone="lime" />
      <div
        className={cn(
          'container-arus relative grid items-center gap-10 pt-20 lg:grid-cols-12 lg:pt-28',
          ctx.isLast ? 'pb-12 lg:pb-16' : 'pb-20 lg:pb-28',
        )}
      >
        {pose ? (
          <Reveal className="order-2 justify-self-center lg:order-1 lg:col-span-4 lg:justify-self-start">
            <Siasat pose={pose} size="lg" onDark interactive showArtTag />
          </Reveal>
        ) : null}
        <div className={cn('order-1 lg:order-2', pose ? 'lg:col-span-8' : 'lg:col-span-10')}>
          {block.eyebrow ? <Eyebrow dark>{block.eyebrow}</Eyebrow> : null}
          <h2
            id={`cta-${block.id}`}
            className="mt-4 max-w-3xl text-[clamp(2.25rem,1.4rem+3.6vw,4.5rem)] leading-[1.02] font-extrabold tracking-[-0.03em]"
          >
            {block.heading}
          </h2>
          {block.body ? (
            <p className="mt-5 max-w-xl text-lead text-white/80">{block.body}</p>
          ) : null}
          <div className="mt-9 flex flex-col items-start gap-5">
            <PrimaryCta id={`band-${block.id ?? ctx.index}`} tone="dark" placement="cta-band" />
            {block.showSecondary ? <SecondaryActions placement="cta-band" /> : null}
            {block.showDeadline ? (
              <DeadlineChip ctx={ctx} label={block.deadlineLabel} showPlaceholders={ctx.showPlaceholders} />
            ) : null}
          </div>
        </div>
      </div>
      {ctx.isLast ? (
        <div
          aria-hidden="true"
          className="container-arus pointer-events-none relative flex items-center gap-4 before:h-px before:flex-1 before:bg-white/20 after:h-px after:flex-1 after:bg-white/20 sm:gap-7"
        >
          <Image
            src={HERO_WAVE_ART}
            alt=""
            width={1440}
            height={179}
            sizes="(max-width: 639px) 55vw, 416px"
            className="pattern-wave h-auto w-[55vw] max-w-[416px] shrink-0"
          />
        </div>
      ) : (
        <div className="relative h-[clamp(56px,8vw,112px)]">
          <Wave preset="toWhite" />
        </div>
      )}
    </section>
  )
}
