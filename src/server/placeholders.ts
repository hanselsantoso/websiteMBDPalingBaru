import type { Payload, PayloadRequest } from 'payload'
import { findPlaceholders } from '@/lib/domain/placeholders'
import { can, type ModuleKey, type ResolvedPermissions } from '@/lib/domain/permissions'

export type PlaceholderItem = {
  source: string
  label: string
  title: string
  path: string
  value: string
  href: string
}

const COLLECTIONS: { slug: string; label: string; titleField: string; module: ModuleKey; draft?: boolean }[] = [
  { slug: 'pages', label: 'Halaman', titleField: 'title', module: 'halaman', draft: true },
  { slug: 'posts', label: 'Blog', titleField: 'title', module: 'blog', draft: true },
  { slug: 'courses', label: 'Mata kuliah', titleField: 'name', module: 'matakuliah' },
  { slug: 'curriculum-versions', label: 'Kurikulum', titleField: 'name', module: 'kurikulum' },
  { slug: 'faculty', label: 'Dosen', titleField: 'name', module: 'dosen', draft: true },
  { slug: 'testimonials', label: 'Testimoni', titleField: 'name', module: 'kontenLain' },
  { slug: 'career-paths', label: 'Prospek karier', titleField: 'role', module: 'kontenLain' },
  { slug: 'programs', label: 'Program unggulan', titleField: 'title', module: 'kontenLain' },
  { slug: 'faqs', label: 'FAQ', titleField: 'question', module: 'kontenLain' },
  { slug: 'pmb-waves', label: 'Gelombang PMB', titleField: 'name', module: 'pmb' },
  { slug: 'pmb-tracks', label: 'Jalur PMB', titleField: 'name', module: 'pmb' },
]

const GLOBALS: { slug: string; label: string; module: ModuleKey }[] = [
  { slug: 'site-settings', label: 'Pengaturan situs', module: 'pengaturan' },
  { slug: 'navigation', label: 'Menu dan CTA', module: 'menu' },
  { slug: 'pmb-settings', label: 'Pengaturan PMB', module: 'pmb' },
  { slug: 'branding', label: 'Branding', module: 'branding' },
]

/** Lists every field that still contains `[ISI` across the CMS, limited to modules the user can view. */
export async function collectPlaceholders(
  payload: Payload,
  permissions: ResolvedPermissions | null,
  req?: PayloadRequest,
): Promise<PlaceholderItem[]> {
  const items: PlaceholderItem[] = []

  for (const item of COLLECTIONS) {
    if (!can(permissions, item.module, 'lihat')) continue
    try {
      const result = await payload.find({
        collection: item.slug as never,
        limit: 300,
        depth: 0,
        overrideAccess: true,
        draft: item.draft,
        req,
      })
      for (const doc of result.docs as Record<string, any>[]) {
        for (const hit of findPlaceholders(doc)) {
          items.push({
            source: item.slug,
            label: item.label,
            title: String(doc[item.titleField] ?? doc.id),
            path: hit.path,
            value: hit.value.slice(0, 120),
            href: `/admin/collections/${item.slug}/${doc.id}`,
          })
        }
        // Courses without a code count as one placeholder too.
        if (item.slug === 'courses' && !doc.code) {
          items.push({
            source: item.slug,
            label: item.label,
            title: String(doc.name),
            path: 'code',
            value: '[ISI: kode mata kuliah]',
            href: `/admin/collections/courses/${doc.id}`,
          })
        }
      }
    } catch {
      // Collection not available.
    }
  }

  for (const item of GLOBALS) {
    if (!can(permissions, item.module, 'lihat')) continue
    try {
      const doc = await payload.findGlobal({ slug: item.slug as never, depth: 0, overrideAccess: true, req })
      for (const hit of findPlaceholders(doc)) {
        items.push({
          source: item.slug,
          label: item.label,
          title: item.label,
          path: hit.path,
          value: hit.value.slice(0, 120),
          href: `/admin/globals/${item.slug}`,
        })
      }
    } catch {
      // Global not available.
    }
  }

  return items
}
