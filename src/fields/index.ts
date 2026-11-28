import type { Field, GroupField, SelectField } from 'payload'

export const MASCOT_POSES = [
  { label: 'Menyapa (greeting)', value: 'greeting' },
  { label: 'Menunjuk (pointing)', value: 'pointing' },
  { label: 'Berpikir (thinking)', value: 'thinking' },
  { label: 'Merayakan (celebrating)', value: 'celebrating' },
  { label: 'Bingung (confused)', value: 'confused' },
  { label: 'Menggambar di tablet (tablet)', value: 'tablet' },
] as const

export type MascotPose = (typeof MASCOT_POSES)[number]['value']

export const mascotPoseField = (
  name = 'mascotPose',
  label = 'Pose Pivot',
  options: { allowNone?: boolean; defaultValue?: string } = {},
): SelectField => {
  const allowNone = options.allowNone ?? true
  return {
    name,
    label,
    type: 'select',
    options: allowNone ? [{ label: 'Tanpa maskot', value: 'none' }, ...MASCOT_POSES] : [...MASCOT_POSES],
    defaultValue: options.defaultValue ?? (allowNone ? 'none' : 'greeting'),
  }
}

export const ICONS = [
  { label: 'AI', value: 'ai' },
  { label: 'Data', value: 'data' },
  { label: 'Bisnis', value: 'bisnis' },
  { label: 'E-Commerce', value: 'ecommerce' },
  { label: 'Fintech', value: 'fintech' },
  { label: 'Teknologi', value: 'teknologi' },
  { label: 'Kreatif', value: 'kreatif' },
  { label: 'Kampus', value: 'kampus' },
  { label: 'Capstone', value: 'capstone' },
  { label: 'Enrichment', value: 'enrichment' },
  { label: 'Beasiswa', value: 'beasiswa' },
  { label: 'Komunitas', value: 'komunitas' },
  { label: 'Industri', value: 'industri' },
  { label: 'Target', value: 'target' },
  { label: 'Roket', value: 'roket' },
  { label: 'Bintang', value: 'bintang' },
] as const

export const iconField = (name = 'icon', label = 'Ikon'): SelectField => ({
  name,
  label,
  type: 'select',
  options: [...ICONS],
  defaultValue: 'bintang',
})

export const sortOrderField: Field = {
  name: 'sortOrder',
  label: 'Urutan',
  type: 'number',
  defaultValue: 0,
  index: true,
  admin: { position: 'sidebar', description: 'Angka kecil tampil lebih dulu.' },
}

export const activeField = (label = 'Tampilkan di situs'): Field => ({
  name: 'isActive',
  label,
  type: 'checkbox',
  defaultValue: true,
  index: true,
  admin: { position: 'sidebar' },
})

export const LINK_TYPES = [
  { label: 'Rute situs (mis. /pmb)', value: 'path' },
  { label: 'Halaman', value: 'page' },
  { label: 'Artikel blog', value: 'post' },
  { label: 'Mata kuliah', value: 'course' },
  { label: 'URL eksternal', value: 'external' },
  { label: 'Anchor (#bagian)', value: 'anchor' },
] as const

/** A link that can point to a route, a CMS record, an external URL, or an anchor. */
export const linkFields = (): Field[] => [
  {
    type: 'row',
    fields: [
      { name: 'label', label: 'Label', type: 'text', required: true, admin: { width: '50%' } },
      {
        name: 'linkType',
        label: 'Jenis tautan',
        type: 'select',
        defaultValue: 'path',
        options: [...LINK_TYPES],
        admin: { width: '50%' },
      },
    ],
  },
  {
    name: 'path',
    label: 'Rute',
    type: 'text',
    admin: { condition: (_, sibling) => !sibling?.linkType || sibling?.linkType === 'path', description: 'Contoh: /kurikulum' },
  },
  { name: 'page', label: 'Halaman', type: 'relationship', relationTo: 'pages', admin: { condition: (_, s) => s?.linkType === 'page' } },
  { name: 'post', label: 'Artikel', type: 'relationship', relationTo: 'posts', admin: { condition: (_, s) => s?.linkType === 'post' } },
  { name: 'course', label: 'Mata kuliah', type: 'relationship', relationTo: 'courses', admin: { condition: (_, s) => s?.linkType === 'course' } },
  { name: 'url', label: 'URL', type: 'text', admin: { condition: (_, s) => s?.linkType === 'external', description: 'Awali dengan https://' } },
  { name: 'anchor', label: 'Anchor', type: 'text', admin: { condition: (_, s) => s?.linkType === 'anchor', description: 'Contoh: #faq' } },
  {
    type: 'row',
    fields: [
      { name: 'newTab', label: 'Buka di tab baru', type: 'checkbox', admin: { width: '33%' } },
      { name: 'isVisible', label: 'Tampilkan', type: 'checkbox', defaultValue: true, admin: { width: '33%' } },
      { name: 'asButton', label: 'Tampilkan sebagai tombol', type: 'checkbox', admin: { width: '33%' } },
    ],
  },
]

export const blockSettings = (): Field[] => [
  {
    type: 'row',
    fields: [
      {
        name: 'visible',
        label: 'Tampilkan blok ini',
        type: 'checkbox',
        defaultValue: true,
        admin: { width: '50%' },
      },
      {
        name: 'anchorId',
        label: 'ID anchor (opsional)',
        type: 'text',
        admin: { width: '50%', description: 'Contoh: kurikulum, untuk tautan /#kurikulum' },
      },
    ],
  },
]

export const placeholderNote = 'Biarkan [ISI] bila data belum tersedia. Penanda ini terlacak di dashboard.'

export const seoGroupFields = (): GroupField['fields'] => [
  {
    name: 'canonicalUrl',
    label: 'URL kanonis',
    type: 'text',
    admin: { description: 'Kosongkan untuk memakai URL halaman ini.' },
  },
  {
    type: 'row',
    fields: [
      { name: 'noIndex', label: 'Jangan indeks (noindex)', type: 'checkbox', admin: { width: '50%' } },
      { name: 'noFollow', label: 'Jangan ikuti tautan (nofollow)', type: 'checkbox', admin: { width: '50%' } },
    ],
  },
  { name: 'jsonLd', label: 'Sertakan data terstruktur (JSON-LD)', type: 'checkbox', defaultValue: true },
]
