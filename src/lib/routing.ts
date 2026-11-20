import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { getRedirect } from '@/lib/data'
import { normalizePath } from '@/lib/links'

/**
 * Ends a request for a missing document: follows an admin-managed redirect
 * (Sistem → Redirect) when one exists for the path, otherwise renders 404.
 */
export async function notFoundOrRedirect(path: string): Promise<never> {
  const target = await getRedirect(normalizePath(path))
  if (target?.to && normalizePath(target.to) !== normalizePath(path)) {
    if (target.statusCode === '302') redirect(target.to)
    permanentRedirect(target.to)
  }
  notFound()
}
