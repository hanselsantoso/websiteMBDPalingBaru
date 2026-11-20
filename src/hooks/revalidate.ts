import { revalidatePath, revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'
import { signRevalidation } from '@/server/tokens'

type MaybeString = string | null | undefined | false

export const REVALIDATE_ROUTE = '/internal/revalidate'

/**
 * Base URL of the running site for out-of-request invalidation: an explicit
 * REVALIDATE_URL, otherwise the local server port (scheduled jobs run inside it).
 */
function siteBaseUrl(): string | null {
  const explicit = process.env.REVALIDATE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')
  return process.env.PORT ? `http://127.0.0.1:${process.env.PORT}` : null
}

async function notifySite(secret: string | undefined, tags: string[], paths: string[]) {
  const base = siteBaseUrl()
  if (!secret || !base) return
  const body = JSON.stringify({ tags, paths, exp: Date.now() + 5 * 60 * 1000 })
  try {
    await fetch(`${base}${REVALIDATE_ROUTE}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-arus-signature': signRevalidation(secret, body),
      },
      body,
      signal: AbortSignal.timeout(4000),
    })
  } catch {
    // The site is not running (for example while seeding); nothing is cached yet.
  }
}

/**
 * Expires Next.js cache entries after Payload writes, with `{ expire: 0 }` so the
 * next visitor gets fresh content. Inside a Next.js request (admin edits) the tags
 * are expired directly; outside one (scheduled publish jobs, Payload CLI) the
 * running site is asked to expire them through a signed request.
 */
export async function revalidate(
  req: PayloadRequest | undefined,
  tags: MaybeString[],
  paths: MaybeString[] = [],
) {
  if ((req?.context as Record<string, unknown> | undefined)?.disableRevalidate) return
  const tagList = [...new Set(tags.filter(Boolean) as string[])]
  const pathList = [...new Set(paths.filter(Boolean) as string[])]
  if (!tagList.length && !pathList.length) return
  try {
    for (const tag of tagList) revalidateTag(tag, { expire: 0 })
    for (const path of pathList) revalidatePath(path)
  } catch {
    await notifySite(req?.payload?.secret, tagList, pathList)
  }
}

type Doc = Record<string, any>

export function revalidateHooks(
  tagsFor: (doc: Doc, previousDoc?: Doc) => MaybeString[],
  pathsFor?: (doc: Doc, previousDoc?: Doc) => MaybeString[],
): { afterChange: CollectionAfterChangeHook[]; afterDelete: CollectionAfterDeleteHook[] } {
  return {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        await revalidate(req, tagsFor(doc, previousDoc), pathsFor?.(doc, previousDoc) ?? [])
        return doc
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        await revalidate(req, tagsFor(doc), pathsFor?.(doc) ?? [])
        return doc
      },
    ],
  }
}

export const revalidateGlobal =
  (...tags: string[]): GlobalAfterChangeHook =>
  async ({ doc, req }) => {
    await revalidate(req, tags)
    return doc
  }
