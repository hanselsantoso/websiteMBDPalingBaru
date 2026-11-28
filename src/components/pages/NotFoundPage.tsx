import { getContentTranslator, translateContent } from '@/lib/content-translations'
import type { Locale } from '@/lib/i18n'
import { NotFoundHeroBlock } from '@/components/blocks/InteractiveBlocks'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { siteFlags } from '@/components/pages/CmsPage'
import { getPage, getSiteSettings } from '@/lib/data'

/**
 * Localized 404 for missing routes and records. Content comes from the CMS
 * page "halaman-404" (blok Hero 404), with a built-in fallback.
 */
export default async function NotFoundPage({ locale }: { locale: Locale }) {
  const [rawPage, settings, translate] = await Promise.all([
    getPage('halaman-404').catch(() => null),
    getSiteSettings().catch(() => ({})),
    getContentTranslator(locale),
  ])
  const page = translateContent(rawPage, translate)
  const blocks = ((page?.layout as Record<string, any>[] | undefined) ?? []).filter(
    (block) => block.visible !== false,
  )
  if (!blocks.length) return <NotFoundHeroBlock block={{}} locale={locale} translate={translate} />
  return (
    <RenderBlocks
      locale={locale}
      translate={translate}
      blocks={blocks as never}
      pageSlug="halaman-404"
      {...siteFlags(settings as Record<string, any>)}
    />
  )
}
