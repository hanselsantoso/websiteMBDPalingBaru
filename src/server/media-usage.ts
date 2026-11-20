import type { Payload, PayloadRequest } from 'payload'

export type MediaUsage = { where: string; title: string; href: string }

/** Direct upload fields that reference media, per collection. */
const DIRECT_FIELDS: { collection: string; field: string; label: string; titleField: string }[] = [
  { collection: 'faculty', field: 'photo', label: 'Dosen', titleField: 'name' },
  { collection: 'testimonials', field: 'photo', label: 'Testimoni', titleField: 'name' },
  { collection: 'partners', field: 'logo', label: 'Mitra industri', titleField: 'name' },
  { collection: 'programs', field: 'image', label: 'Program unggulan', titleField: 'title' },
  { collection: 'courses', field: 'rps', label: 'Mata kuliah (RPS)', titleField: 'name' },
  { collection: 'curriculum-versions', field: 'pdf', label: 'Versi kurikulum', titleField: 'name' },
  { collection: 'quiz-questions', field: 'image', label: 'Pertanyaan kuis', titleField: 'text' },
]

/** Collections whose JSON is scanned because media can sit deep inside blocks or rich text. */
const SCANNED: { collection: string; label: string; titleField: string }[] = [
  { collection: 'pages', label: 'Halaman', titleField: 'title' },
  { collection: 'posts', label: 'Blog', titleField: 'title' },
]

const GLOBALS: { slug: string; label: string }[] = [
  { slug: 'branding', label: 'Branding' },
  { slug: 'navigation', label: 'Menu dan CTA' },
  { slug: 'site-settings', label: 'Pengaturan situs' },
]

export async function findMediaUsage(payload: Payload, id: string | number, req?: PayloadRequest): Promise<MediaUsage[]> {
  const usages: MediaUsage[] = []
  const needle = JSON.stringify(id)

  for (const item of DIRECT_FIELDS) {
    try {
      const result = await payload.find({
        collection: item.collection as never,
        where: { [item.field]: { equals: id } },
        limit: 5,
        depth: 0,
        overrideAccess: true,
        req,
      })
      for (const doc of result.docs as Record<string, unknown>[]) {
        usages.push({
          where: item.label,
          title: String(doc[item.titleField] ?? doc.id),
          href: `/admin/collections/${item.collection}/${doc.id}`,
        })
      }
    } catch {
      // Collection may not exist in older configs.
    }
  }

  for (const item of SCANNED) {
    try {
      const result = await payload.find({
        collection: item.collection as never,
        limit: 200,
        depth: 0,
        overrideAccess: true,
        draft: true,
        req,
      })
      for (const doc of result.docs as Record<string, unknown>[]) {
        if (JSON.stringify(doc).includes(needle)) {
          usages.push({
            where: item.label,
            title: String(doc[item.titleField] ?? doc.id),
            href: `/admin/collections/${item.collection}/${doc.id}`,
          })
        }
      }
    } catch {
      // ignore
    }
  }

  for (const item of GLOBALS) {
    try {
      const doc = await payload.findGlobal({ slug: item.slug as never, depth: 0, overrideAccess: true, req })
      if (JSON.stringify(doc).includes(needle)) {
        usages.push({ where: item.label, title: item.label, href: `/admin/globals/${item.slug}` })
      }
    } catch {
      // ignore
    }
  }

  return usages
}
