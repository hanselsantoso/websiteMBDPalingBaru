'use client'

import { usePathname } from 'next/navigation'
import { useLocale } from '@/components/providers/LocaleProvider'
import { withLocale, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname() || '/'
  const locale = useLocale()
  return (
    <div role="group" aria-label={locale === 'en' ? 'Website language' : 'Bahasa situs'} className={cn('inline-flex shrink-0 gap-0.5 rounded-full border border-white/45 p-0.5 text-xs font-bold text-white', className)}>
      {(['id', 'en'] as Locale[]).map((language) => {
        const active = language === locale
        const path = withLocale(pathname, language)
        return (
          <a
            key={language}
            href={path}
            hrefLang={language}
            lang={language}
            title={language === 'id' ? 'Bahasa Indonesia' : 'English'}
            aria-current={active ? 'true' : undefined}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
              if (active) {
                event.preventDefault()
              } else if (window.location.search || window.location.hash) {
                event.preventDefault()
                window.location.assign(path + window.location.search + window.location.hash)
              }
            }}
            className={cn('grid min-h-9 min-w-9 place-items-center rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-lime', active ? 'bg-lime text-navy' : 'hover:bg-white/20')}
          >
            {language.toUpperCase()}
          </a>
        )
      })}
    </div>
  )
}
