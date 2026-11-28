'use client'

import Link from 'next/link'
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react'
import { withLocale, type Locale } from '@/lib/i18n'

const LocaleContext = createContext<Locale>('id')

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

export function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const locale = useLocale()
  return <Link href={typeof href === 'string' ? withLocale(href, locale) : href} {...props} />
}
