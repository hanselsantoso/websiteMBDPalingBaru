export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  if (new URL(request.url).searchParams.get('ready') !== '1') return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    await payload.count({ collection: 'pages', overrideAccess: false })
    return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ status: 'unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
