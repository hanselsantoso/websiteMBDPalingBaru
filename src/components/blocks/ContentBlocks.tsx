import Image from '@/components/ui/CmsImage'
import Link from 'next/link'
import { Siasat } from '@/components/mascot/Siasat'
import { Reveal, VideoEmbed } from '@/components/motion/Interactive'
import { Star } from '@/components/patterns/Patterns'
import { RichText } from '@/components/richtext/RichText'
import { JsonLd } from '@/components/seo/JsonLd'
import { Icon } from '@/components/ui/Icon'
import { TextOr } from '@/components/ui/Isi'
import { Eyebrow, SectionHeading } from '@/components/ui/Section'
import { ArrowLink } from '@/components/cards/Cards'
import { isSiasatPose } from '@/lib/brand/mascot'
import { isPlaceholder } from '@/lib/domain/placeholders'
import { getFaqs } from '@/lib/data'
import { asMedia, cn } from '@/lib/utils'
import { anchor, type BlockProps } from './types'

export function RichTextBlock({ block, ctx }: BlockProps) {
  return (
    <section data-tone="light" id={anchor(block)} className="bg-white py-16 lg:py-24">
      <div className={cn('container-arus', block.width === 'wide' ? '' : '')}>
        <div className={cn(block.width === 'wide' ? 'max-w-4xl' : 'mx-auto max-w-[42rem]')}>
          {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
          {block.heading ? <h2 className="mt-3 mb-8 text-section font-bold">{block.heading}</h2> : null}
          <RichText data={block.content} showPlaceholders={ctx.showPlaceholders} />
        </div>
      </div>
    </section>
  )
}

export function ImageTextBlock({ block, ctx }: BlockProps) {
  const media = asMedia(block.image)
  const pose = isSiasatPose(block.mascotPose) ? block.mascotPose : null
  const left = block.imagePosition === 'left'
  return (
    <section data-tone="light" id={anchor(block)} className="relative overflow-hidden bg-ink-50 py-20 lg:py-28">
      <div className="container-arus grid items-center gap-12 lg:grid-cols-12">
        <div className={cn('lg:col-span-6', left ? 'lg:order-2 lg:col-start-7' : '')}>
          {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
          <h2 className="mt-3 text-section font-bold">{block.heading}</h2>
          <RichText data={block.body} showPlaceholders={ctx.showPlaceholders} className="mt-6 text-ink-700" />
          {block.linkLabel && block.linkHref ? (
            <div className="mt-8">
              <ArrowLink href={block.linkHref}>{block.linkLabel}</ArrowLink>
            </div>
          ) : null}
        </div>
        <div className={cn('lg:col-span-5', left ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8')}>
          {media ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] rounded-tr-[120px] border-2 border-navy shadow-hard-lg">
              <Image src={media.url!} alt={media.alt ?? ''} fill sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
            </div>
          ) : pose ? (
            <div className="relative mx-auto grid w-fit place-items-center">
              <div aria-hidden="true" className="absolute inset-[8%] -z-0 rounded-full border-2 border-dashed border-navy/30" />
              <Siasat pose={pose} size="lg" interactive showArtTag />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export async function FaqBlock({ block, ctx }: BlockProps) {
  const faqs = await getFaqs(String(block.scope ?? 'umum'), Number(block.limit ?? 8))
  const visible = faqs.filter((faq) => ctx.showPlaceholders || !isPlaceholder(faq.answer))
  if (!visible.length) return null
  const structured = visible.filter((faq) => !isPlaceholder(faq.answer))
  return (
    <section data-tone="light" id={anchor(block)} className="bg-white py-20 lg:py-24">
      {structured.length ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: structured.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          }}
        />
      ) : null}
      <div className="container-arus grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
          <h2 className="mt-3 text-section font-bold">{block.heading}</h2>
        </div>
        <div className="divide-y-2 divide-navy border-y-2 border-navy lg:col-span-8">
          {visible.map((faq) => (
            <details key={faq.id} className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-navy transition-transform duration-200 group-open:rotate-45">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <div className="max-w-2xl pb-6 text-ink-700">
                <TextOr value={faq.answer} show={ctx.showPlaceholders} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TimelineBlock({ block, ctx }: BlockProps) {
  const items = (block.items as Record<string, any>[]) ?? []
  if (!items.length) return null
  return (
    <section data-tone="light" id={anchor(block)} className="bg-white py-20 lg:py-24">
      <div className="container-arus">
        <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
        <ol className="relative mt-12 grid gap-8 border-l-2 border-dashed border-navy pl-8 lg:ml-4">
          {items.map((item, index) => (
            <Reveal as="li" key={item.id ?? index} delay={index * 80} className="relative">
              <Star className="absolute top-1 -left-[2.6rem] size-5 bg-white text-blue" />
              {item.label ? <p className="label-mono text-blue">{item.label}</p> : null}
              <h3 className="mt-1 text-xl font-bold">{item.title}</h3>
              {item.body ? (
                <p className="mt-2 max-w-2xl text-ink-600">
                  <TextOr value={item.body} show={ctx.showPlaceholders} />
                </p>
              ) : null}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function CardGridBlock({ block, ctx }: BlockProps) {
  const cards = (block.cards as Record<string, any>[]) ?? []
  if (!cards.length) return null
  const pose = isSiasatPose(block.mascotPose) ? block.mascotPose : null
  const cols = { '2': 'lg:grid-cols-2', '3': 'lg:grid-cols-3', '4': 'lg:grid-cols-4' }[String(block.columns ?? '3')] ?? 'lg:grid-cols-3'
  const style = block.style ?? 'sticker'
  return (
    <section data-tone="light" id={anchor(block)} className={cn('py-20 lg:py-24', style === 'plain' ? 'bg-ink-50' : 'bg-white')}>
      <div className="container-arus">
        <SectionHeading
          eyebrow={block.eyebrow}
          title={block.heading}
          intro={block.intro}
          aside={pose ? <Siasat pose={pose} size="md" interactive /> : undefined}
        />
        <ul className={cn('mt-12 grid gap-5 sm:grid-cols-2', cols)}>
          {cards.map((card, index) => {
            const inner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  {style === 'numbered' ? (
                    <span className="font-mono text-4xl font-medium text-blue">{String(index + 1).padStart(2, '0')}</span>
                  ) : (
                    <span className={cn('grid size-11 place-items-center rounded-xl', style === 'plain' ? 'bg-white text-navy' : 'bg-navy text-lime')}>
                      <Icon name={card.icon ?? 'bintang'} size={22} />
                    </span>
                  )}
                  {card.tag ? <span className="label-mono text-ink-600">{card.tag}</span> : null}
                </div>
                <h3 className="mt-5 text-xl leading-tight font-bold">{card.title}</h3>
                {card.body ? (
                  <p className="mt-2 text-ink-600">
                    <TextOr value={card.body} show={ctx.showPlaceholders} />
                  </p>
                ) : null}
              </>
            )
            return (
              <Reveal
                as="li"
                key={card.id ?? index}
                delay={index * 70}
                className={cn(
                  'relative flex flex-col',
                  style === 'plain' ? 'rounded-[24px] p-2' : 'sticker p-6',
                  card.linkHref && style !== 'plain' && 'sticker-press transition-transform duration-200 hover:-translate-y-1',
                )}
              >
                {inner}
                {card.linkHref ? (
                  <Link href={card.linkHref} className="mt-4 inline-flex items-center gap-1 font-semibold text-blue after:absolute after:inset-0">
                    Selengkapnya <span className="sr-only">tentang {card.title}</span>
                    <Icon name="arrow-right" size={16} strokeWidth={2.5} />
                  </Link>
                ) : null}
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export function VideoBlock({ block }: BlockProps) {
  return (
    <section data-tone="light" id={anchor(block)} className="bg-white py-16 lg:py-24">
      <div className="container-arus max-w-5xl">
        {block.heading ? <h2 className="mb-8 text-section font-bold">{block.heading}</h2> : null}
        <VideoEmbed url={block.url} title={block.heading} caption={block.caption} />
      </div>
    </section>
  )
}
