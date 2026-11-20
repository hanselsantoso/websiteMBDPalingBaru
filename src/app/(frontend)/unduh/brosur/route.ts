import { getPayloadClient } from '@/lib/payload'
import { verifyDownload } from '@/server/tokens'

const text = (message: string, status: number) =>
  new Response(message, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  })

/** Signed, short-lived brochure link issued after the brochure form is submitted. */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const fileId = url.searchParams.get('f') ?? ''
  const payload = await getPayloadClient()
  if (
    !verifyDownload(
      payload.secret,
      fileId,
      url.searchParams.get('exp') ?? '',
      url.searchParams.get('sig') ?? '',
    )
  ) {
    return text(
      'Tautan unduhan sudah kedaluwarsa. Isi lagi formulir brosur untuk mendapatkan tautan baru.',
      403,
    )
  }
  const media = (await payload
    .findByID({ collection: 'media', id: fileId, depth: 0, overrideAccess: false })
    .catch(() => null)) as { url?: string | null } | null
  if (!media?.url) return text('Brosur belum tersedia.', 404)
  return new Response(null, {
    status: 302,
    headers: { Location: new URL(media.url, url.origin).toString(), 'Cache-Control': 'no-store' },
  })
}
