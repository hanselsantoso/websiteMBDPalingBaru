import { uiCopy } from '@/lib/i18n-copy'
import type { Locale } from '@/lib/i18n'
import Image from '@/components/ui/CmsImage'
import type { ReactNode } from 'react'
import { LocaleLink as Link } from '@/components/providers/LocaleProvider'
import { Icon } from '@/components/ui/Icon'
import { PendingChip, TextOr } from '@/components/ui/Isi'
import { BLOG_COVER_ART, FACULTY_ART } from '@/lib/brand/artwork'
import { isPlaceholder } from '@/lib/domain/placeholders'
import { asMedia, cn, formatDate } from '@/lib/utils'

type Doc = Record<string, any>

export function facultyDisplayName(member: Doc): string {
  const front = member.titleFront && !isPlaceholder(member.titleFront) ? `${member.titleFront} ` : ''
  const back = member.titleBack && !isPlaceholder(member.titleBack) ? `, ${member.titleBack}` : ''
  return `${front}${member.name ?? ''}${back}`
}

export function Portrait({
  locale = 'id',
  photo,
  name,
  mask = 'fin',
  sizes,
  className,
  priority,
}: {
  locale?: Locale
  photo: unknown
  name: string
  mask?: 'fin' | 'round'
  sizes: string
  className?: string
  priority?: boolean
}) {
  const media = asMedia(photo)
  const shape = mask === 'fin' ? 'rounded-[24px] rounded-tr-[96px]' : 'rounded-[24px]'
  return (
    <div className={cn('relative aspect-[4/5] overflow-hidden border-2 border-navy bg-navy', shape, className)}>
      {media ? (
        <Image
          src={media.url!}
          alt={media.alt || `Foto ${name}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: `${media.focalX ?? 50}% ${media.focalY ?? 30}%` }}
        />
      ) : (
        <>
          <Image src={FACULTY_ART} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
          <span className="absolute bottom-3 left-3 rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
            {uiCopy(locale, 'Foto belum tersedia')}
          </span>
        </>
      )}
    </div>
  )
}

export function FacultyCard({ member, showPlaceholders, mask = 'fin', priority, locale = 'id' }: { locale?: Locale; member: Doc; showPlaceholders: boolean; mask?: 'fin' | 'round'; priority?: boolean }) {
  const name = facultyDisplayName(member)
  const expertise = ((member.expertise as string[]) ?? []).filter((tag) => showPlaceholders || !isPlaceholder(tag))
  return (
    <article className="group relative grid gap-4">
      <Portrait locale={locale} photo={member.photo} name={String(member.name ?? '')} mask={mask} sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw" priority={priority} className="transition-transform duration-200 group-hover:-translate-y-1" />
      <div>
        <h3 className="text-xl leading-tight font-bold">
          <Link href={`/dosen/${member.slug}`} className="after:absolute after:inset-0 hover:text-blue">
            <TextOr value={name} show={showPlaceholders} hint={uiCopy(locale, 'nama dosen')} />
          </Link>
        </h3>
        <p className="mt-1 text-ink-600">
          <TextOr value={member.position} show={showPlaceholders} hint={uiCopy(locale, 'jabatan akademik')} />
        </p>
        {expertise.length ? (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Bidang keahlian">
            {expertise.slice(0, 3).map((tag) => (
              <li key={tag} className="label-mono rounded-full bg-ink-100 px-2.5 py-1 text-[0.6875rem] text-navy">
                {isPlaceholder(tag) ? <PendingChip hint="keahlian" /> : tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  )
}

export function PostCover({ post, sizes, priority, className }: { post: Doc; sizes: string; priority?: boolean; className?: string }) {
  const cover = asMedia(post.cover)
  return (
    <div className={cn('relative overflow-hidden bg-navy', className)}>
      <Image
        src={cover?.url || BLOG_COVER_ART}
        alt={cover?.alt ?? ''}
        fill
        sizes={sizes}
        priority={priority}
        className={cover?.url ? 'object-cover' : 'object-contain p-4'}
        style={cover ? { objectPosition: `${cover.focalX ?? 50}% ${cover.focalY ?? 50}%` } : undefined}
      />
    </div>
  )
}

export function PostMeta({ post, dark, locale = 'id' }: { locale?: Locale; post: Doc; dark?: boolean }) {
  return (
    <p className={cn('label-mono flex flex-wrap items-center gap-x-3 gap-y-1', dark ? 'text-white/70' : 'text-ink-600')}>
      {post.publishedAt ? <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, 'long', locale)}</time> : null}
      {post.readingMinutes ? <span>· {post.readingMinutes} {locale === 'en' ? 'min read' : 'menit baca'}</span> : null}
    </p>
  )
}

export function PostCard({ post, featured = false, priority, locale = 'id' }: { locale?: Locale; post: Doc; featured?: boolean; priority?: boolean }) {
  const category = typeof post.category === 'object' ? post.category : null
  return (
    <article className={cn('sticker sticker-press group relative flex h-full flex-col overflow-hidden', featured && 'lg:flex-row')}>
      <PostCover
        post={post}
        priority={priority}
        sizes={featured ? '(min-width: 1024px) 640px, 100vw' : '(min-width: 1024px) 420px, 100vw'}
        className={cn('aspect-[16/9] w-full border-b-2 border-navy', featured && 'lg:aspect-auto lg:min-h-[22rem] lg:w-[58%] lg:border-r-2 lg:border-b-0')}
      />
      <div className={cn('flex flex-1 flex-col gap-3 p-6', featured && 'lg:justify-center lg:p-9')}>
        {category ? <span className="label-mono text-blue">{category.name}</span> : null}
        <h3 className={cn('leading-tight font-bold', featured ? 'text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)]' : 'text-xl')}>
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-blue">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && featured ? <p className="text-ink-600">{post.excerpt}</p> : null}
        <div className="mt-auto pt-2">
          <PostMeta locale={locale} post={post} />
        </div>
      </div>
    </article>
  )
}

export function ArrowLink({ href, children, dark }: { href: string; children: ReactNode; dark?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-2 underline-offset-[6px]',
        dark ? 'text-white decoration-white/40 hover:decoration-lime' : 'text-navy decoration-navy/30 hover:decoration-blue',
      )}
    >
      {children}
      <Icon name="arrow-right" size={18} strokeWidth={2.5} className="transition-transform duration-150 group-hover:translate-x-0.5" />
    </Link>
  )
}
