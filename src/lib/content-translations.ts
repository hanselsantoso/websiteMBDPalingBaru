import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { getPayloadClient } from './payload'

export const CONTENT_TRANSLATIONS = 'content-translations'
export const translationReadContext = Symbol.for('mbd.content-translations.render')

async function readContentTranslations() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: CONTENT_TRANSLATIONS,
    context: { translationRead: translationReadContext },
    depth: 0,
    overrideAccess: false,
    limit: 0,
    pagination: false,
    select: { source: true, english: true },
  })
  return docs.map(({ source, english }) => [source, english] as const)
}

const readCachedContentTranslations = unstable_cache(
  readContentTranslations,
  [CONTENT_TRANSLATIONS],
  { tags: [CONTENT_TRANSLATIONS] },
)

export const getContentTranslator = cache(async (
  locale: 'id' | 'en',
): Promise<(text: string) => string> => {
  if (locale === 'id') return (text) => text
  const read = process.env.NODE_ENV === 'development' ? readContentTranslations : readCachedContentTranslations
  const translations = new Map(await read())
  return (text) => translations.get(text) ?? text
})

/** Find canonical source text for filtering published content by its English translation. */
export async function findEnglishSourceMatches(query: string): Promise<string[]> {
  if (typeof query !== 'string' || query.length > 120 || query.includes('\0')) return []
  const term = query.trim().replace(/\s+/g, ' ')
  if (term.length < 2 || !/[\p{L}\p{N}]/u.test(term)) return []

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: CONTENT_TRANSLATIONS,
    context: { translationRead: translationReadContext },
    depth: 0,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    select: { source: true },
    sort: 'id',
    where: { english: { like: term.replace(/[\\%_]/g, '\\$&') } },
  })
  return docs.map(({ source }) => source)
}

const structuralFields = new Set([
  'id', 'slug', 'url', 'href', 'src', 'path', 'filename', 'mimeType', 'email', 'phone',
  'integrations', 'customScripts', 'features', 'turnstileSiteKey',
  'form', 'section', 'scope', 'tone', 'target', 'date', 'openDate', 'closeDate',
  'code', 'key', 'type', 'blockType', 'blockName', 'linkType', 'relationTo', 'variant',
  'icon', 'mascotPose', 'imagePosition', 'locale', 'direction', 'format', 'style', 'mode',
  'align', 'kind', 'level', 'status', '_status', 'createdAt', 'updatedAt', 'publishedAt',
])

const structuralSuffix = /(?:Id|IDs|Ids|Slug|Hrefs?|URLs?|Urls?|Paths?|Filenames?|Type|Pose|Position|Color|Variant)$/
const structuralText = /^(?:(?:[/#]|(?:https?|mailto|tel):)\S*|[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})$/i

/** Translate copy in JSON-shaped Payload data while retaining routing and rich-text structure. */
export function translateContent<T>(value: T, translate: (text: string) => string): T {
  function visit(item: unknown): unknown {
    if (typeof item === 'string') return structuralText.test(item) ? item : translate(item)
    if (Array.isArray(item)) return item.map(visit)
    if (!item || typeof item !== 'object') return item
    const prototype = Object.getPrototypeOf(item)
    if (prototype !== Object.prototype && prototype !== null) return item

    const isRelationship = Object.hasOwn(item, 'relationTo')
    return Object.fromEntries(Object.entries(item).map(([key, entry]) => {
      const structural = structuralFields.has(key) || (
        typeof entry === 'string' && (structuralSuffix.test(key) || (isRelationship && key === 'value'))
      )
      return [key, structural ? entry : visit(entry)]
    }))
  }

  return visit(value) as T
}
