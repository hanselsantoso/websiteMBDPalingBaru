import type { Metadata } from 'next'
import { siteUrl } from '@/lib/preview'

type Doc = Record<string, any>

type MediaRef = {
  url?: string | null
  width?: number | null
  height?: number | null
  alt?: string | null
}

const mediaOf = (value: unknown): MediaRef | null =>
  value && typeof value === 'object' && (value as MediaRef).url ? (value as MediaRef) : null

export const absoluteUrl = (path: string) =>
  /^https?:\/\//i.test(path) ? path : `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`

/**
 * Metadata from the SEO plugin's `meta` group (title, description, image,
 * canonical URL, robots) with sensible fallbacks from the document itself.
 */
export function docMetadata({
  doc,
  path,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
  type = 'website',
  publishedTime,
  modifiedTime,
}: {
  doc: Doc | null | undefined
  path: string
  fallbackTitle?: string | null
  fallbackDescription?: string | null
  fallbackImage?: unknown
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string | null
  modifiedTime?: string | null
}): Metadata {
  const meta = (doc?.meta ?? {}) as Doc
  // The SEO plugin generates complete titles ("… · MBD ISTTS"); use them verbatim.
  const metaTitle = typeof meta.title === 'string' && meta.title.trim() ? meta.title.trim() : null
  const title = metaTitle ?? fallbackTitle ?? undefined
  const description =
    (typeof meta.description === 'string' && meta.description.trim()) ||
    fallbackDescription ||
    undefined
  const image = mediaOf(meta.image) ?? mediaOf(fallbackImage)
  const canonical =
    typeof meta.canonicalUrl === 'string' && meta.canonicalUrl.trim()
      ? meta.canonicalUrl.trim()
      : path
  const images = image?.url
    ? [
        {
          url: absoluteUrl(image.url),
          width: image.width ?? undefined,
          height: image.height ?? undefined,
          alt: image.alt ?? undefined,
        },
      ]
    : undefined
  return {
    ...(title ? { title: metaTitle ? { absolute: metaTitle } : title } : {}),
    description,
    alternates: { canonical },
    ...(meta.noIndex || meta.noFollow
      ? { robots: { index: !meta.noIndex, follow: !meta.noFollow } }
      : {}),
    openGraph: {
      type,
      locale: 'id_ID',
      url: path,
      ...(title ? { title: metaTitle ?? title } : {}),
      ...(description ? { description } : {}),
      ...(images ? { images } : {}),
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: images
      ? { card: 'summary_large_image', images: images.map((item) => item.url) }
      : { card: 'summary' },
  }
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
