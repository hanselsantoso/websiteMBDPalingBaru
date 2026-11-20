import { revalidatePath, revalidateTag } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { verifyRevalidation } from '@/server/tokens'

const TAG_PATTERN = /^[a-z0-9:_-]{1,160}$/i
const MAX_BODY = 10_000

const reply = (status: number) =>
  new Response(null, { status, headers: { 'Cache-Control': 'no-store' } })

/**
 * Signed cache invalidation for Payload writes that happen outside a Next.js
 * request (scheduled publish jobs, Payload CLI). See src/hooks/revalidate.ts.
 */
export async function POST(request: Request) {
  const body = await request.text()
  if (body.length > MAX_BODY) return reply(413)
  const payload = await getPayloadClient()
  if (!verifyRevalidation(payload.secret, body, request.headers.get('x-arus-signature') ?? ''))
    return reply(401)

  let input: { tags?: unknown; paths?: unknown; exp?: unknown }
  try {
    input = JSON.parse(body)
  } catch {
    return reply(400)
  }
  const now = Date.now()
  if (typeof input.exp !== 'number' || input.exp < now || input.exp > now + 10 * 60 * 1000)
    return reply(401)

  const tags = (Array.isArray(input.tags) ? input.tags : []).filter(
    (tag): tag is string => typeof tag === 'string' && TAG_PATTERN.test(tag),
  )
  const paths = (Array.isArray(input.paths) ? input.paths : []).filter(
    (path): path is string =>
      typeof path === 'string' &&
      path.startsWith('/') &&
      !path.startsWith('//') &&
      path.length <= 300,
  )
  for (const tag of tags.slice(0, 50)) revalidateTag(tag, { expire: 0 })
  for (const path of paths.slice(0, 50)) revalidatePath(path)
  return reply(204)
}
