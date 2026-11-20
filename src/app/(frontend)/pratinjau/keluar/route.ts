import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/** Leaves draft preview and returns to the published page. */
export async function GET(request: Request) {
  ;(await draftMode()).disable()
  const back = new URL(request.url).searchParams.get('path')
  redirect(back && back.startsWith('/') && !back.startsWith('//') ? back : '/')
}
