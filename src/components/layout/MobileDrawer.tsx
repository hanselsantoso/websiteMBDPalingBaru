'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { PrimaryCta, SecondaryActions } from '@/components/cta/CtaLinks'
import { Siasat } from '@/components/mascot/Siasat'
import { Fin, Wave } from '@/components/patterns/Patterns'
import { Icon } from '@/components/ui/Icon'
import { isActivePath, isExternalHref } from '@/lib/links'
import { cn } from '@/lib/utils'
import type { NavItem } from './Header'
import { Wordmark } from './Wordmark'

export function MobileDrawer({
  open,
  onClose,
  items,
  logoUrl,
  pathname,
}: {
  open: boolean
  onClose: () => void
  items: NavItem[]
  logoUrl: string | null
  pathname: string
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label="Menu navigasi"
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-navy p-0 text-white backdrop:bg-navy"
    >
      <div className="relative flex h-full flex-col overflow-y-auto overscroll-contain">
        <div className="container-arus flex h-[var(--header-h)] shrink-0 items-center justify-between">
          <Wordmark logoUrl={logoUrl} onNavigate={onClose} />
          <button
            type="button"
            onClick={onClose}
            className="grid size-12 place-items-center rounded-full border-2 border-white/40 hover:border-lime"
            aria-label="Tutup menu"
          >
            <Icon name="close" size={22} strokeWidth={2.5} />
          </button>
        </div>
        <nav aria-label="Menu utama" className="container-arus mt-4 flex-1 pb-56">
          <ul className="grid gap-1">
            {items.map((item, index) => {
              const active = isActivePath(pathname, item.href)
              return (
                <li key={item.href + item.label} className="anim-rise" style={{ ['--rise-delay' as string]: `${index * 40}ms` }}>
                  <Link
                    href={item.href}
                    target={item.newTab || isExternalHref(item.href) ? '_blank' : undefined}
                    rel={item.newTab || isExternalHref(item.href) ? 'noopener noreferrer' : undefined}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex min-h-14 items-center gap-3 font-display text-[clamp(2rem,9vw,3rem)] leading-none font-bold tracking-[-0.03em]',
                      active ? 'text-lime' : 'text-white hover:text-lime',
                    )}
                  >
                    <span className="label-mono w-8 text-xs text-white/50">{String(index + 1).padStart(2, '0')}</span>
                    {item.label}
                    {active ? <Fin className="size-6 text-lime" /> : null}
                  </Link>
                  {item.children?.length ? (
                    <ul className="mb-2 ml-11 grid gap-1">
                      {item.children.map((child) => (
                        <li key={child.href + child.label}>
                          <Link href={child.href} target={child.newTab || isExternalHref(child.href) ? '_blank' : undefined} rel={child.newTab || isExternalHref(child.href) ? 'noopener noreferrer' : undefined} onClick={onClose} className="inline-flex min-h-11 items-center text-lg font-semibold text-white/80 hover:text-lime">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ul>
          <div className="mt-10 grid gap-5">
            <PrimaryCta id="drawer" placement="drawer" register={false} magnetic={false} className="w-full sm:w-auto" />
            <SecondaryActions placement="drawer" className="flex-col items-start gap-y-2" />
          </div>
        </nav>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40">
          <Wave preset="toNavy" className="h-full" />
        </div>
        <div className="pointer-events-none absolute right-2 bottom-0 translate-y-[18%]">
          <Siasat pose="greeting" size="md" decorative onDark loop={open} />
        </div>
      </div>
    </dialog>
  )
}
