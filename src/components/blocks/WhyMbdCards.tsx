'use client'

import { uiCopy } from '@/lib/i18n-copy'
import { useLocale } from '@/components/providers/LocaleProvider'

import { useState } from 'react'
import { LocaleLink as Link } from '@/components/providers/LocaleProvider'
import Image from '@/components/ui/CmsImage'
import { Icon } from '@/components/ui/Icon'
import { TextOr } from '@/components/ui/Isi'
import { Reveal } from '@/components/motion/Interactive'
import { Fin } from '@/components/patterns/Patterns'
import { BUSINESS_STRATEGY_ART } from '@/lib/brand/artwork'
import { cn } from '@/lib/utils'
import type { WhyMbdBlock as WhyMbdBlockData } from '@/payload-types'

function CourseCodes({ codes, onDark }: { codes?: string | null; onDark?: boolean }) {
  const locale = useLocale()
  const copy = (text: string) => uiCopy(locale, text)
  const list = String(codes ?? '')
    .split(',')
    .map((code) => code.trim())
    .filter(Boolean)
  if (!list.length) return null
  return (
    <ul className="mt-auto flex flex-wrap gap-2 pt-5" aria-label={copy("Mata kuliah terkait")}>
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

const WHY_MBD_MASCOTS = {
  bisnis: {
    id: 'rara',
    pose: 'fokus',
    analogy: { id: 'Proto mulai dari kebutuhan pelanggan, lalu membuat prototipe yang bisa diuji.', en: 'Proto starts with customer needs and builds a prototype the team can test.' },
  },
  data: {
    id: 'kiko',
    pose: 'curiga',
    analogy: { id: 'Metric mencari pola penjualan sebelum memilih produk yang akan dipromosikan.', en: 'Metric finds patterns in sales before choosing which products to promote.' },
  },
  teknologi: {
    id: 'uli',
    pose: 'dapat-ide',
    analogy: { id: 'Sage memakai AI untuk merangkum masukan pelanggan dan memeriksa hasilnya.', en: 'Sage uses AI to summarise customer feedback and checks the result.' },
  },
} as const

type WhyMascotIcon = keyof typeof WHY_MBD_MASCOTS
type WhyMascot = (typeof WHY_MBD_MASCOTS)[WhyMascotIcon]
type WhyCard = NonNullable<WhyMbdBlockData['cards']>[number]

function WhyMascotArt({ mascot, featured }: { mascot: WhyMascot; featured?: boolean }) {
  return (
    <Image
      src={`/images/mascot/friends/${mascot.id}/${mascot.pose}.webp`}
      alt=""
      width={448}
      height={448}
      sizes={featured ? '(min-width: 1280px) 224px, (min-width: 1024px) 192px, 176px' : '128px'}
      className={cn('h-auto shrink-0', featured ? 'w-44 self-center lg:w-48 xl:w-56' : 'w-32')}
    />
  )
}

export function WhyMbdCards({
  cards,
  showPlaceholders,
  showMascots,
}: {
  cards: WhyCard[]
  showPlaceholders: boolean
  showMascots: boolean
}) {
  const locale = useLocale()
  const copy = (text: string) => uiCopy(locale, text)
  const leadIndex = cards.findIndex((card) => card.size === 'large')
  const ordered = leadIndex > 0 ? [cards[leadIndex], ...cards.filter((_, index) => index !== leadIndex)] : cards
  const [selection, setSelection] = useState<{ index: number; direction?: 'next' | 'previous' }>({ index: 0 })
  const active = selection.index < ordered.length ? selection.index : 0
  const showControls = showMascots && ordered.length > 1
  const large = ordered[showControls ? active : 0]

  function selectCard(step: 1 | -1) {
    setSelection((current) => {
      const index = current.index < ordered.length ? current.index : 0
      return {
        index: (index + step + ordered.length) % ordered.length,
        direction: step === 1 ? 'next' : 'previous',
      }
    })
  }
  const mascotFor = (icon: WhyCard['icon']) =>
    showMascots && icon && Object.hasOwn(WHY_MBD_MASCOTS, icon)
      ? WHY_MBD_MASCOTS[icon as WhyMascotIcon]
      : undefined
  const largeMascot = mascotFor(large?.icon)
  const strategyArtwork = !largeMascot && large?.icon === 'bisnis'
  const hasLargeArt = Boolean(largeMascot || strategyArtwork)
  const rest = ordered.filter((card) => card !== large)
  const small = rest.slice(0, 4)
  const wide = rest.slice(4)
  const spansTwoRows = !showMascots || small.length > 2

  return (
    <div className={showControls ? 'mt-7' : 'mt-12'}>
      {showControls ? (
        <div className="mb-4 flex items-center justify-end gap-2">
          <p role="status" aria-atomic="true" className="mr-2 min-w-12 text-center text-sm font-semibold tabular-nums text-ink-700">
            <span className="sr-only">{copy("Kartu") + " "}{active + 1}{" " + copy("dari") + " "}{ordered.length}{copy(". Dipilih") + " "}{large.title}.</span>
            <span aria-hidden="true">{active + 1} / {ordered.length}</span>
          </p>
          <button
            type="button"
            aria-label={copy("Kartu sebelumnya")}
            className="grid size-11 place-items-center rounded-full border border-navy text-navy hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() => selectCard(-1)}
          >
            <Icon name="arrow-left" size={19} />
          </button>
          <button
            type="button"
            aria-label={copy("Kartu berikutnya")}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-navy px-4 text-sm font-bold text-white hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() => selectCard(1)}
          >{copy("Berikutnya") + " "}<Icon name="arrow-right" size={19} />
          </button>
        </div>
      ) : null}
      <div className={cn('grid gap-5 md:grid-cols-2 lg:grid-cols-12', spansTwoRows && 'lg:grid-rows-[auto_auto]')}>
        {large ? (
          <Reveal
            as="article"
            className={cn(
              'group relative isolate flex min-h-[22rem] flex-col overflow-hidden rounded-[28px] border-2 border-navy bg-blue p-7 text-white shadow-hard transition-transform duration-200 hover:-rotate-[0.6deg] md:col-span-2 lg:col-span-6 lg:p-9',
              showControls && 'lg:min-h-[26rem]',
              spansTwoRows && 'lg:row-span-2',
            )}
          >
            <div
              key={active}
              data-why-selected
              data-why-enter={showControls ? selection.direction : undefined}
              className={cn('flex min-w-0 flex-1 flex-col', hasLargeArt && 'gap-4 lg:flex-row lg:gap-5')}
            >
              {hasLargeArt ? null : (
                <Fin className="pattern-fin absolute -right-6 -bottom-8 -z-10 size-[min(70%,22rem)] text-lime transition-transform duration-500 group-hover:-translate-y-2" />
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="grid size-14 place-items-center rounded-2xl border-2 border-white/70 text-white">
                  <Icon name={large.icon ?? 'bisnis'} size={28} strokeWidth={2} />
                </span>
                <h3 className="mt-6 max-w-sm text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] leading-[1.05] font-bold">
                  {large.title}
                </h3>
                <p className="mt-4 max-w-sm text-lead">
                  <TextOr value={large.body} show={showPlaceholders} />
                </p>
                {largeMascot ? (
                  <p className="mt-5 border-l-2 border-white/55 pl-3 text-sm leading-relaxed font-semibold">
                    {largeMascot.analogy[locale]}
                  </p>
                ) : null}
                <CourseCodes codes={large.courseCodes} onDark />
              </div>
              {largeMascot ? <WhyMascotArt mascot={largeMascot} featured /> : null}
              {strategyArtwork ? (
                <Image
                  {...BUSINESS_STRATEGY_ART}
                  alt=""
                  sizes="(min-width: 1024px) 144px, 112px"
                  className="h-auto w-28 shrink-0 self-end lg:w-36"
                />
              ) : null}
            </div>
          </Reveal>
        ) : null}
        {small.map((card, index) => {
          const mascot = mascotFor(card.icon)

          return (
            <Reveal
              as="article"
              key={card.id ?? index}
              delay={(index + 1) * 90}
              className="sticker flex min-h-60 flex-col p-6 transition-transform duration-200 hover:rotate-[0.8deg] lg:col-span-3"
            >
              {mascot ? (
                <WhyMascotArt mascot={mascot} />
              ) : (
                <span className="grid size-11 place-items-center rounded-xl bg-navy text-lime">
                  <Icon name={card.icon ?? 'bintang'} size={22} />
                </span>
              )}
              <h3 className="mt-5 text-xl leading-tight font-bold">{card.title}</h3>
              <p className="mt-2 text-ink-600">
                <TextOr value={card.body} show={showPlaceholders} />
              </p>
              {mascot ? <p className="mt-3 border-l-2 border-blue/40 pl-3 text-sm leading-relaxed font-semibold">{mascot.analogy[locale]}</p> : null}
              <CourseCodes codes={card.courseCodes} />
            </Reveal>
          )
        })}
        {wide.map((card, index) => {
          const mascot = mascotFor(card.icon)

          return (
            <Reveal
              as="article"
              key={card.id ?? index}
              className="flex flex-col gap-4 rounded-[28px] border-2 border-dashed border-navy bg-white p-6 md:col-span-2 md:flex-row md:items-center lg:col-span-12"
            >
              {mascot ? (
                <WhyMascotArt mascot={mascot} />
              ) : (
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-navy text-lime">
                  <Icon name={card.icon ?? 'kampus'} size={22} />
                </span>
              )}
              <h3 className="text-xl font-bold md:w-72 md:shrink-0">{card.title}</h3>
              <div>
                <p className="text-ink-600">
                  <TextOr value={card.body} show={showPlaceholders} />
                </p>
                {mascot ? <p className="mt-2 border-l-2 border-blue/40 pl-3 text-sm leading-relaxed font-semibold">{mascot.analogy[locale]}</p> : null}
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
