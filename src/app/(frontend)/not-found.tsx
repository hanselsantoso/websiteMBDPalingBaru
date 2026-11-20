import { NotFoundHeroBlock } from '@/components/blocks/InteractiveBlocks'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { siteFlags } from '@/components/pages/CmsPage'
import { getPage, getSiteSettings } from '@/lib/data'

/**
 * Localized 404 for missing routes and records. Content comes from the CMS
 * page "halaman-404" (blok Hero 404), with a built-in fallback.
 */
export default async function NotFound() {
  const [page, settings] = await Promise.all([
    getPage('halaman-404').catch(() => null),
    getSiteSettings().catch(() => ({})),
  ])
  const blocks = ((page?.layout as Record<string, any>[] | undefined) ?? []).filter(
    (block) => block.visible !== false,
  )
  if (!blocks.length) return <NotFoundHeroBlock block={{}} />
  return (
    <RenderBlocks
      blocks={blocks as never}
      pageSlug="halaman-404"
      {...siteFlags(settings as Record<string, any>)}
    />
  )
}
