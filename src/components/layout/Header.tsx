'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { PrimaryCta } from '@/components/cta/CtaLinks'
import { Fin } from '@/components/patterns/Patterns'
import { useSite } from '@/components/providers/SiteProvider'
import { Icon } from '@/components/ui/Icon'
import { isActivePath, isExternalHref } from '@/lib/links'
import { cn } from '@/lib/utils'
import { MobileDrawer } from './MobileDrawer'
import { Wordmark } from './Wordmark'

export type NavItem = { label: string; href: string; newTab?: boolean; asButton?: boolean; children?: NavItem[] }

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActivePath(pathname, item.href)
  const external = item.newTab || isExternalHref(item.href)
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn(
        'relative inline-flex min-h-11 items-center rounded-full px-3 text-[0.9375rem] font-semibold transition-colors duration-150',
        active ? 'text-white' : 'text-white/75 hover:text-white',
        item.asButton && 'border-2 border-white/40 px-4',
      )}
    >
      {item.label}
      {active ? <Fin className="absolute -bottom-0.5 left-1/2 size-3.5 -translate-x-1/2 text-lime" /> : null}
    </Link>
  )
}

function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const ref = useRef<HTMLLIElement>(null)
  const active = isActivePath(pathname, item.href) || (item.children ?? []).some((child) => isActivePath(pathname, child.href))

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    const onClick = (event: MouseEvent) => !ref.current?.contains(event.target as Node) && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [open])

  return (
    <li ref={ref} className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        onMouseEnter={() => setOpen(true)}
        className={cn('relative inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-[0.9375rem] font-semibold', active ? 'text-white' : 'text-white/75 hover:text-white')}
      >
        {item.label}
        <Icon name="chevron-down" size={16} strokeWidth={2.5} className={cn('transition-transform duration-150', open && 'rotate-180')} />
        {active ? <Fin className="absolute -bottom-0.5 left-1/2 size-3.5 -translate-x-1/2 text-lime" /> : null}
      </button>
      <ul id={id} hidden={!open} className="absolute top-full left-0 mt-2 min-w-56 rounded-2xl border-2 border-navy bg-white p-2 shadow-hard">
        {[{ ...item, children: undefined }, ...(item.children ?? [])].map((child) => (
          <li key={child.href + child.label}>
            <Link
              href={child.href}
              aria-current={isActivePath(pathname, child.href) ? 'page' : undefined}
              className="flex min-h-11 items-center rounded-xl px-3 font-semibold text-navy hover:bg-ink-100 aria-[current=page]:text-blue"
              onClick={() => setOpen(false)}
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  )
}

export function Header({ items, logoUrl }: { items: NavItem[]; logoUrl: string | null }) {
  const pathname = usePathname() ?? '/'
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { isOtherPrimaryVisible } = useSite()
  const hideCta = isOtherPrimaryVisible('header')

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 24))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => setDrawerOpen(false), [pathname])

  return (
    <header
      data-site-header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300',
        scrolled ? 'bg-navy shadow-[0_1px_0_rgb(255_255_255/0.1)]' : 'bg-transparent',
      )}
    >
      <div className="container-arus flex h-[var(--header-h)] items-center justify-between gap-4">
        <Wordmark logoUrl={logoUrl} />
        <nav aria-label="Menu utama" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {items.map((item) =>
              item.children?.length ? (
                <NavGroup key={item.href + item.label} item={item} pathname={pathname} />
              ) : (
                <li key={item.href + item.label}>
                  <NavLink item={item} pathname={pathname} />
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <div
            className={cn('hidden transition-opacity duration-200 sm:block', hideCta ? 'invisible opacity-0' : 'opacity-100')}
            aria-hidden={hideCta ? true : undefined}
          >
            <PrimaryCta id="header" placement="header" register={false} magnetic={false} className="min-h-11 px-5 text-[0.9375rem]" />
          </div>
          <button
            type="button"
            className="grid size-12 place-items-center rounded-full border-2 border-white/40 text-white hover:border-lime xl:hidden"
            aria-label="Buka menu"
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <Icon name="menu" size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} items={items} logoUrl={logoUrl} pathname={pathname} />
    </header>
  )
}
