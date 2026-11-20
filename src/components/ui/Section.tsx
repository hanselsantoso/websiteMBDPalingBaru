import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Eyebrow({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <p className={cn('label-mono flex items-center gap-2', dark ? 'text-lime' : 'text-blue', className)}>
      <svg viewBox="0 0 100 100" className="size-3 shrink-0" aria-hidden="true">
        <path d="M50 0C54 38 62 46 100 50C62 54 54 62 50 100C46 62 38 54 0 50C38 46 46 38 50 0Z" fill="currentColor" />
      </svg>
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark,
  aside,
  className,
  id,
}: {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  dark?: boolean
  aside?: ReactNode
  className?: string
  id?: string
}) {
  if (!eyebrow && !title && !intro && !aside) return null
  return (
    <div className={cn('grid gap-6 lg:grid-cols-12 lg:items-end', className)}>
      <div className="lg:col-span-8">
        {eyebrow ? <Eyebrow dark={dark}>{eyebrow}</Eyebrow> : null}
        {title ? (
          <h2 id={id} className={cn('mt-3 text-section font-bold', dark ? 'text-white' : 'text-navy')}>
            {title}
          </h2>
        ) : null}
        {intro ? <p className={cn('mt-4 max-w-2xl text-lead', dark ? 'text-white/75' : 'text-ink-600')}>{intro}</p> : null}
      </div>
      {aside ? <div className="lg:col-span-4 lg:justify-self-end">{aside}</div> : null}
    </div>
  )
}

export function Chip({ children, className, tone = 'light' }: { children: ReactNode; className?: string; tone?: 'light' | 'dark' | 'lime' }) {
  const tones = {
    light: 'border-navy bg-white text-navy',
    dark: 'border-white/40 bg-white/5 text-white',
    lime: 'border-navy bg-lime text-navy',
  }
  return (
    <span className={cn('label-mono inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 whitespace-nowrap', tones[tone], className)}>
      {children}
    </span>
  )
}
