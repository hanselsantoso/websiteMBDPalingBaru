'use client'

import { uiCopy } from '@/lib/i18n-copy'
import { LocaleLink as Link, useLocale } from '@/components/providers/LocaleProvider'


import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BrochureButton, QuizLink, WhatsAppLink } from '@/components/cta/CtaLinks'
import { useSite } from '@/components/providers/SiteProvider'
import { Icon } from '@/components/ui/Icon'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'

/**
 * Mobile-only bottom bar (< md). Appears after 40% of the hero, steps aside while
 * the keyboard is open, during PMB form steps, or when another primary CTA is visible.
 */
export function StickyBar() {
  const locale = useLocale()
  const site = useSite()
  const pathname = usePathname()
  const [pastHero, setPastHero] = useState(false)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    setPastHero(false)
    const sentinel = document.querySelector('[data-sticky-sentinel]')
    if (!sentinel) {
      const onScroll = () => setPastHero(window.scrollY > 240)
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }
    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0))
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    const isField = (target: EventTarget | null) =>
      target instanceof HTMLElement && (target.matches('input:not([type=checkbox]):not([type=radio]), textarea, select') || target.isContentEditable)
    const onFocusIn = (event: FocusEvent) => isField(event.target) && setTyping(true)
    const onFocusOut = () => setTimeout(() => setTyping(isField(document.activeElement)), 50)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  if (!site.mobileBar.enabled) return null
  const visible = pastHero && !typing && !site.stickySuppressed && !site.isOtherPrimaryVisible('sticky')
  const items = site.mobileBar.items.length
    ? site.mobileBar.items
    : [
        { kind: 'daftar', label: site.cta.primaryLabel },
        { kind: 'whatsapp', label: site.cta.whatsappLabel },
        { kind: 'kuis', label: site.cta.quizLabel },
      ]

  const iconButton = 'grid size-12 shrink-0 place-items-center rounded-full border-2 border-white/40 text-white'

  return (
    <div
      data-sticky-bar
      aria-hidden={visible ? undefined : true}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t-4 border-blue bg-navy pb-[env(safe-area-inset-bottom)] transition-[transform,opacity] duration-300 md:hidden',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-full opacity-0',
      )}
    >
      <nav aria-label={uiCopy(locale, "Aksi cepat")} className="flex h-16 items-center gap-2 px-3">
        {items.map((item) => {
          switch (item.kind) {
            case 'daftar':
              return site.cta.primaryExternal ? (
                <a
                  key="daftar"
                  href={site.cta.primaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('cta_register_click', { placement: 'sticky' })}
                  className="pill h-12 min-h-0 flex-1 border-2 border-navy bg-lime px-4 text-navy"
                >
                  {item.label || site.cta.primaryLabel}
                </a>
              ) : (
                <Link
                  key="daftar"
                  href={site.cta.primaryHref}
                  onClick={() => track('cta_register_click', { placement: 'sticky' })}
                  className="pill h-12 min-h-0 flex-1 border-2 border-navy bg-lime px-4 text-navy"
                >
                  {item.label || site.cta.primaryLabel}
                </Link>
              )
            case 'whatsapp':
              return (
                <WhatsAppLink key="wa" placement="sticky" className={iconButton}>
                  <Icon name="whatsapp" size={22} />
                  <span className="sr-only">{item.label || site.cta.whatsappLabel}</span>
                </WhatsAppLink>
              )
            case 'kuis':
              return (
                <QuizLink key="kuis" className={iconButton}>
                  <Icon name="compass" size={22} />
                  <span className="sr-only">{item.label || site.cta.quizLabel}</span>
                </QuizLink>
              )
            case 'brosur':
              return (
                <BrochureButton key="brosur" placement="sticky" className={iconButton}>
                  <Icon name="download" size={22} />
                  <span className="sr-only">{item.label || site.cta.brochureLabel}</span>
                </BrochureButton>
              )
            default:
              return null
          }
        })}
      </nav>
    </div>
  )
}

export function WhatsAppFab() {
  const { cta } = useSite()
  return (
    <WhatsAppLink
      placement="fab"
      className="fixed right-6 bottom-6 z-40 hidden size-14 place-items-center rounded-full border-2 border-navy bg-lime text-navy shadow-hard transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.96] md:grid"
    >
      <Icon name="whatsapp" size={26} />
      <span className="sr-only">{cta.whatsappLabel}</span>
    </WhatsAppLink>
  )
}
