import type { Payload } from 'payload'
import type { EventInput } from '@/lib/schemas'

const IGNORED_404_PREFIXES = ['/_next', '/api', '/admin', '/favicon', '/.well-known']

export async function recordEvent(payload: Payload, input: EventInput & { lead?: string | number }) {
  try {
    await payload.create({
      collection: 'analytics-events',
      overrideAccess: true,
      depth: 0,
      data: {
        name: input.name,
        path: input.path?.slice(0, 300),
        sessionId: input.sessionId,
        referrer: input.referrer?.slice(0, 300),
        props: input.props ?? {},
        lead: input.lead,
      } as never,
    })
    if (input.name === 'not_found' && input.path) await logNotFound(payload, input.path, input.referrer)
  } catch (error) {
    payload.logger.warn({ err: error, msg: `Peristiwa ${input.name} gagal dicatat` })
  }
}

async function logNotFound(payload: Payload, rawPath: string, referrer?: string) {
  const path = rawPath.split('?')[0].split('#')[0].slice(0, 300) || '/'
  if (IGNORED_404_PREFIXES.some((prefix) => path.startsWith(prefix))) return
  const now = new Date().toISOString()
  const existing = await payload.find({
    collection: 'not-found-logs',
    where: { path: { equals: path } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const doc = existing.docs[0] as { id: string; hits?: number } | undefined
  if (doc) {
    await payload.update({
      collection: 'not-found-logs',
      id: doc.id,
      data: { hits: (doc.hits ?? 0) + 1, lastSeenAt: now, referrer: referrer?.slice(0, 300) } as never,
      overrideAccess: true,
    })
    return
  }
  try {
    await payload.create({
      collection: 'not-found-logs',
      data: { path, hits: 1, lastSeenAt: now, referrer: referrer?.slice(0, 300) } as never,
      overrideAccess: true,
    })
  } catch {
    // Parallel request created it first; ignore.
  }
}
