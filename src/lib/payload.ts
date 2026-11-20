import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import type { Config } from '@/payload-types'

type CollectionSlug = keyof Config['collections']

type FindOneOptions = {
  /** Include draft documents (default: false, only published) */
  draft?: boolean
  /** Relationship population depth (default: 2) */
  depth?: number
  /** Extra constraints combined with the field match (e.g. the active curriculum version). */
  where?: Where
  /** Join field options, e.g. `{ coursesTaught: { limit: 30 } }`. */
  joins?: Record<string, { limit?: number; sort?: string; where?: Where } | false>
  /**
   * Signed draft previews only: read the latest draft without the public
   * access filter. Never enable this for ordinary public requests.
   */
  previewAccess?: boolean
}

/**
 * Get the Payload instance configured for this project.
 * Use this in server components and route handlers.
 */
export async function getPayloadClient() {
  const payloadConfig = await config
  return getPayload({ config: payloadConfig })
}

/**
 * Find a single document by slug in any collection.
 * Returns the document if found, or null if not found.
 *
 * Use this shared helper instead of duplicating slug lookup logic
 * in each route file. Call `notFound()` from `next/navigation`
 * when this returns null.
 *
 * @example
 * ```tsx
 * import { findBySlug } from '@/lib/payload'
 * import { notFound } from 'next/navigation'
 *
 * export default async function ArticlePage({ params }) {
 *   const { slug } = await params
 *   const article = await findBySlug('articles', slug)
 *   if (!article) notFound()
 *   return <Article data={article} />
 * }
 * ```
 */
export async function findBySlug<T extends CollectionSlug>(
  collection: T,
  slug: string,
  options?: FindOneOptions,
): Promise<Config['collections'][T] | null> {
  return findByField(collection, 'slug', slug, options)
}

/**
 * Find a single document by a custom field value.
 * Returns the document if found, or null if not found.
 *
 * Useful for collections that use a field other than `slug` for routing,
 * such as `title`, `handle`, or `sku`.
 *
 * @example
 * ```tsx
 * import { findByField } from '@/lib/payload'
 * import { notFound } from 'next/navigation'
 *
 * export default async function ProductPage({ params }) {
 *   const { sku } = await params
 *   const product = await findByField('products', 'sku', sku)
 *   if (!product) notFound()
 *   return <Product data={product} />
 * }
 * ```
 */
export async function findByField<T extends CollectionSlug>(
  collection: T,
  field: string,
  value: string,
  options?: FindOneOptions,
): Promise<Config['collections'][T] | null> {
  const payload = await getPayloadClient()
  const { draft = false, depth = 2, where, joins, previewAccess = false } = options ?? {}
  const match: Where = { [field]: { equals: value } }

  const result = await payload.find({
    collection,
    // Public reads run as an anonymous visitor; only verified previews bypass access.
    overrideAccess: previewAccess,
    where: where ? { and: [match, where] } : match,
    depth,
    limit: 1,
    draft: previewAccess ? true : draft,
    ...(joins ? { joins: joins as never } : {}),
  })

  return (result.docs[0] as Config['collections'][T]) ?? null
}
