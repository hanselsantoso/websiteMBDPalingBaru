import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { getRedirect } from '@/lib/data'
import { normalizePath } from '@/lib/links'
import { withLocale, type Locale } from '@/lib/i18n'

/** Applies an admin-managed redirect (Sistem → Redirect) when configured. */
export async function redirectIfConfigured(path: string, locale: Locale = 'id'): Promise<void> {
  const target = await getRedirect(normalizePath(path))
  if (target?.to && normalizePath(target.to) !== normalizePath(path)) {
    if (target.statusCode === '302') redirect(withLocale(target.to, locale))
    permanentRedirect(withLocale(target.to, locale))
  }
}

export async function notFoundOrRedirect(path: string, locale: Locale = 'id'): Promise<never> {
  await redirectIfConfigured(path, locale)
  notFound()
}
