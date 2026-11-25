import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { getRedirect } from '@/lib/data'
import { normalizePath } from '@/lib/links'

/** Applies an admin-managed redirect (Sistem → Redirect) when configured. */
export async function redirectIfConfigured(path: string): Promise<void> {
  const target = await getRedirect(normalizePath(path))
  if (target?.to && normalizePath(target.to) !== normalizePath(path)) {
    if (target.statusCode === '302') redirect(target.to)
    permanentRedirect(target.to)
  }
}

export async function notFoundOrRedirect(path: string): Promise<never> {
  await redirectIfConfigured(path)
  notFound()
}
