export type Locale = 'id' | 'en'

export const localeTag = (locale: Locale) => locale === 'en' ? 'en-US' : 'id-ID'

export function withoutLocale(path: string): string {
  if (path === '/en') return '/'
  if (path.startsWith('/en/')) return path.slice(3)
  if (path.startsWith('/en?') || path.startsWith('/en#')) return '/' + path.slice(3)
  return path
}

/** Localize navigable public pages. Keep infrastructure, files and external URLs shared. */
export function withLocale(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const path = withoutLocale(href)
  if (/^\/(?:api|admin|health|internal|pratinjau|unduh|images|_next)(?:[/?#]|$)/.test(path)
    || /\.[a-z0-9]+(?:[?#]|$)/i.test(path)) return path
  if (locale === 'id') return path
  return path.startsWith('/?') || path.startsWith('/#') || path === '/'
    ? '/en' + path.slice(1)
    : '/en' + path
}

export function localizedAlternates(path: string, locale: Locale) {
  return {
    canonical: withLocale(path, locale),
    languages: { id: withLocale(path, 'id'), en: withLocale(path, 'en'), 'x-default': withLocale(path, 'id') },
  }
}

export function bilingual(locale: Locale, indonesian: string, english: string): string {
  return locale === 'en' ? english : indonesian
}
