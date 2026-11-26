import Link from 'next/link'
import { PrimaryCta, SecondaryActions } from '@/components/cta/CtaLinks'
import { Siasat } from '@/components/mascot/Siasat'
import { CountUp, Reveal } from '@/components/motion/Interactive'
import { Fin, Marquee, Star, StarField, Wave } from '@/components/patterns/Patterns'
import { Icon } from '@/components/ui/Icon'
import { PendingChip, TextOr } from '@/components/ui/Isi'
import { Eyebrow, SectionHeading } from '@/components/ui/Section'
import { isSiasatPose } from '@/lib/brand/mascot'
import { programTotals } from '@/lib/domain/curriculum'
import { isPlaceholder } from '@/lib/domain/placeholders'
import { getCurriculum, getPartners, getPmbInfo } from '@/lib/data'
import { asMedia, cn, formatDate } from '@/lib/utils'
import Image from '@/components/ui/CmsImage'
import { anchor, type BlockProps } from './types'

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

function CourseCodes({ codes, onDark }: { codes?: string | null; onDark?: boolean }) {
  const list = String(codes ?? '')
    .split(',')
    .map((code) => code.trim())
    .filter(Boolean)
  if (!list.length) return null
  return (
    <ul className="mt-auto flex flex-wrap gap-2 pt-5" aria-label="Mata kuliah terkait">
      {list.map((code) => (
        <li key={code}>
          <Link
            href={`/kurikulum/${code.toLowerCase()}`}
            prefetch={false}
            className={cn(
              'label-mono inline-flex min-h-9 items-center rounded-full border-2 px-3 transition-colors duration-150',
              onDark
                ? 'border-white/60 text-white hover:bg-white hover:text-blue'
                : 'border-navy text-navy hover:bg-navy hover:text-white',
            )}
          >
            {code}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function WhyMbdBlock({ block, ctx }: BlockProps) {
  const cards = (block.cards as Record<string, any>[]) ?? []
  const large = cards.find((card) => card.size === 'large') ?? cards[0]
  const rest = cards.filter((card) => card !== large)
  const small = rest.slice(0, 4)
  const wide = rest.slice(4)

  return (
    <section data-tone="light" id={anchor(block)} className="relative bg-ink-50 py-20 lg:py-28">
      <div className="container-arus">
        <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          {large ? (
            <Reveal
              as="article"
              className="group relative isolate flex min-h-[22rem] flex-col overflow-hidden rounded-[28px] border-2 border-navy bg-blue p-7 text-white shadow-hard transition-transform duration-200 hover:-rotate-[0.6deg] md:col-span-2 lg:col-span-6 lg:row-span-2 lg:p-9"
            >
              <Fin className="pattern-fin absolute -right-6 -bottom-8 -z-10 size-[min(70%,22rem)] text-lime transition-transform duration-500 group-hover:-translate-y-2" />
              <span className="grid size-14 place-items-center rounded-2xl border-2 border-white/70 text-white">
                <Icon name={large.icon ?? 'bisnis'} size={28} strokeWidth={2} />
              </span>
              <h3 className="mt-6 max-w-sm text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] leading-[1.05] font-bold">
                {large.title}
              </h3>
              <p className="mt-4 max-w-sm text-lead text-white/90">
                <TextOr value={large.body} show={ctx.showPlaceholders} />
              </p>
              <CourseCodes codes={large.courseCodes} onDark />
            </Reveal>
          ) : null}
          {small.map((card, index) => (
            <Reveal
              as="article"
              key={card.id ?? index}
              delay={(index + 1) * 90}
              className="sticker flex min-h-60 flex-col p-6 transition-transform duration-200 hover:rotate-[0.8deg] lg:col-span-3"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-navy text-lime">
                <Icon name={card.icon ?? 'bintang'} size={22} />
              </span>
              <h3 className="mt-5 text-xl leading-tight font-bold">{card.title}</h3>
              <p className="mt-2 text-ink-600">
                <TextOr value={card.body} show={ctx.showPlaceholders} />
              </p>
              <CourseCodes codes={card.courseCodes} />
            </Reveal>
          ))}
          {wide.map((card, index) => (
            <Reveal
              as="article"
              key={card.id ?? index}
              className="flex flex-col gap-4 rounded-[28px] border-2 border-dashed border-navy bg-white p-6 md:col-span-2 md:flex-row md:items-center lg:col-span-12"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-navy text-lime">
                <Icon name={card.icon ?? 'kampus'} size={22} />
              </span>
              <h3 className="text-xl font-bold md:w-72 md:shrink-0">{card.title}</h3>
              <p className="text-ink-600">
                <TextOr value={card.body} show={ctx.showPlaceholders} />
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export async function MarqueeBlock({ block, ctx }: BlockProps) {
  const tones: Record<string, { section: string; star: string; text: string }> = {
    navy: { section: 'bg-navy', star: 'text-lime', text: 'text-white' },
    blue: { section: 'bg-blue', star: 'text-lime', text: 'text-white' },
    light: { section: 'bg-white border-y-2 border-navy', star: 'text-blue', text: 'text-navy' },
  }
  const tone = tones[block.tone as string] ?? tones.navy
  const isDark = block.tone !== 'light'

  if (block.source === 'partners') {
    const partners = await getPartners()
    if (!partners.length && !ctx.showPlaceholders) return null
    return (
      <section
        data-tone={isDark ? 'dark' : 'light'}
        id={anchor(block)}
        className={cn('py-8', tone.section)}
        aria-label={block.label || 'Mitra industri'}
      >
        <div className="container-arus mb-4">
          <p className={cn('label-mono', isDark ? 'text-white/70' : 'text-ink-600')}>
            {block.label || 'Mitra industri'}
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
  label,
  showPlaceholders,
}: {
  label?: string | null
  showPlaceholders: boolean
}) {
  const info = await getPmbInfo().catch(() => null)
  const wave = info?.activeWave
  if (!wave && !showPlaceholders) return null
  const date = wave?.closeDate ? formatDate(wave.closeDate) : null
  return (
    <p className="label-mono inline-flex flex-wrap items-center gap-2 rounded-full border-2 border-lime px-4 py-2 text-lime">
      <Icon name="calendar" size={16} />
      <span>{label || 'Batas akhir pendaftaran'}</span>
      {wave?.name ? <span className="text-white">· {wave.name}</span> : null}
      <span className="text-white">·</span>
      {date ? (
        <span className="text-white">{date}</span>
      ) : (
        <PendingChip hint="batas akhir pendaftaran gelombang berjalan" />
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
                <DeadlineChip label={block.deadlineLabel} showPlaceholders={ctx.showPlaceholders} />
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
      id={anchor(block)}
      aria-labelledby={`cta-${block.id}`}
      className="relative isolate overflow-hidden bg-navy text-white"
    >
      <StarField tone="lime" />
      <div className="container-arus relative grid items-center gap-10 py-20 lg:grid-cols-12 lg:py-28">
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
              <DeadlineChip label={block.deadlineLabel} showPlaceholders={ctx.showPlaceholders} />
            ) : null}
          </div>
        </div>
      </div>
      {ctx.isLast ? (
        <div className="relative h-[clamp(48px,7vw,96px)]">
          <Wave preset="toNavy" />
        </div>
      ) : (
        <div className="relative h-[clamp(56px,8vw,112px)]">
          <Wave preset="toWhite" />
        </div>
      )}
    </section>
  )
}
