'use client'

import { m, useMotionValue, useSpring } from 'motion/react'
import Link from 'next/link'
import { useEffect, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { useMotionPreference } from '@/components/providers/MotionProvider'
import { useSite } from '@/components/providers/SiteProvider'
import { Icon } from '@/components/ui/Icon'
import { buttonStyles, type ButtonVariant } from '@/components/ui/Button'
import { track } from '@/lib/analytics'
import { springs } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * The single primary action ("Daftar Sekarang"). Registers its visibility so the
 * header, footer, and mobile bar can step back: never two primaries per viewport.
 */
export function PrimaryCta({
  id,
  tone = 'dark',
  label,
  placement,
  magnetic = true,
  className,
  hideWhenOtherVisible = false,
  register = true,
}: {
  id: string
  tone?: 'dark' | 'light'
  label?: string | null
  placement: string
  magnetic?: boolean
  className?: string
  /** Downgrade to a quieter style when another primary CTA is on screen. */
  hideWhenOtherVisible?: boolean
  /** Content CTAs register their visibility; chrome CTAs (header, drawer) do not. */
  register?: boolean
}) {
  const { cta, setPrimaryVisibility, isOtherPrimaryVisible } = useSite()
  const { reduced } = useMotionPreference()
  const ref = useRef<HTMLSpanElement>(null)
  const x = useSpring(useMotionValue(0), springs.snappy)
  const y = useSpring(useMotionValue(0), springs.snappy)

  useEffect(() => {
    const node = ref.current
    if (!node || !register) return
    const observer = new IntersectionObserver(([entry]) => setPrimaryVisibility(id, entry.isIntersecting), { threshold: 0.6 })
    observer.observe(node)
    return () => {
      observer.disconnect()
      setPrimaryVisibility(id, false)
    }
  }, [id, register, setPrimaryVisibility])

  const quiet = hideWhenOtherVisible && isOtherPrimaryVisible(id)
  const variant: ButtonVariant = quiet ? (tone === 'dark' ? 'secondaryDark' : 'secondary') : tone === 'dark' ? 'primaryDark' : 'primary'
  const text = label || cta.primaryLabel

  const onMove = (event: ReactPointerEvent) => {
    if (!magnetic || reduced || event.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 12)
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * 10)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const content = (
    <>
      {text}
      <Icon name={cta.primaryExternal ? 'arrow-up-right' : 'arrow-right'} size={18} strokeWidth={2.5} />
    </>
  )
  const classes = cn(buttonStyles[variant], 'min-h-[52px] px-7 text-base', className)
  const onClick = () => track('cta_register_click', { placement })

  return (
    <m.span ref={ref} style={{ x, y }} className="inline-flex" onPointerMove={onMove} onPointerLeave={reset}>
      {cta.primaryExternal ? (
        <a href={cta.primaryHref} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick}>
          {content}
          <span className="sr-only">(membuka situs pendaftaran ISTTS di tab baru)</span>
        </a>
      ) : (
        <Link href={cta.primaryHref} className={classes} onClick={onClick}>
          {content}
        </Link>
      )}
    </m.span>
  )
}

export function WhatsAppLink({
  placement,
  className,
  children,
  label,
}: {
  placement: string
  className?: string
  children?: ReactNode
  label?: string | null
}) {
  const { cta } = useSite()
  const href = cta.whatsappHref ?? '/kontak'
  const external = Boolean(cta.whatsappHref)
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={className}
      onClick={() => track('cta_whatsapp_click', { placement, configured: external })}
      title={external ? undefined : 'Nomor WhatsApp belum diatur, menuju halaman kontak'}
    >
      {children ?? (
        <>
          <Icon name="whatsapp" size={18} />
          {label || cta.whatsappLabel}
        </>
      )}
    </a>
  )
}

export function QuizLink({ className, children, label }: { className?: string; children?: ReactNode; label?: string | null }) {
  const { cta } = useSite()
  return (
    <Link href={cta.quizHref} className={className}>
      {children ?? (
        <>
          <Icon name="compass" size={18} />
          {label || cta.quizLabel}
        </>
      )}
    </Link>
  )
}

export function BrochureButton({
  placement,
  className,
  children,
  label,
}: {
  placement: string
  className?: string
  children?: ReactNode
  label?: string | null
}) {
  const { cta, openBrochure } = useSite()
  return (
    <button type="button" className={className} onClick={() => openBrochure(placement)} aria-haspopup="dialog">
      {children ?? (
        <>
          <Icon name="download" size={18} />
          {label || cta.brochureLabel}
        </>
      )}
    </button>
  )
}

/** Three secondary actions shown beside the primary one. */
export function SecondaryActions({
  placement,
  dark = true,
  labels,
  className,
}: {
  placement: string
  dark?: boolean
  labels?: { quiz?: string | null; whatsapp?: string | null; brochure?: string | null }
  className?: string
}) {
  const link = cn(
    'group inline-flex min-h-11 items-center gap-2 rounded-full px-1 font-semibold underline decoration-2 underline-offset-[6px] transition-[text-decoration-color] duration-150',
    dark ? 'text-white decoration-white/30 hover:decoration-lime' : 'text-navy decoration-navy/25 hover:decoration-blue',
  )
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-6 gap-y-1', className)}>
      <li>
        <QuizLink className={link} label={labels?.quiz} />
      </li>
      <li>
        <WhatsAppLink placement={placement} className={link} label={labels?.whatsapp} />
      </li>
      <li>
        <BrochureButton placement={placement} className={link} label={labels?.brochure} />
      </li>
    </ul>
  )
}
