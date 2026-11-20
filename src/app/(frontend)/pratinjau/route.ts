import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { verifyPreview } from '@/lib/preview'

/** Enables draft mode for a signed, expiring preview link created in the admin panel. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const path = params.get('path') ?? ''
  const payload = await getPayloadClient()
  if (!verifyPreview(payload.secret, path, params.get('exp') ?? '', params.get('sig') ?? '')) {
    return new Response(
      'Tautan pratinjau tidak valid atau sudah kedaluwarsa. Buka lagi pratinjau dari panel admin.',
      {
        status: 401,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
      },
    )
  }
  ;(await draftMode()).enable()
  redirect(path)
}
