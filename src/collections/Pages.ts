import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { publicOr, serverOwned, write } from '@/access'
import { pageBlocks } from '@/blocks/pageBlocks'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'
import { revalidateHooks } from '@/hooks/revalidate'
import { buildPreviewUrl, pathForDoc } from '@/lib/preview'

const revalidation = revalidateHooks((doc, prev) => [
  'pages',
  doc?.slug && `page:${doc.slug}`,
  prev?.slug && `page:${prev.slug}`,
])

export const reviewStatusField = {
  name: 'reviewStatus',
  label: 'Alur kerja',
  type: 'select' as const,
  defaultValue: 'none',
  index: true,
  options: [
    { label: 'Normal', value: 'none' },
    { label: 'Menunggu review', value: 'review' },
    { label: 'Arsip (disembunyikan dari situs)', value: 'archived' },
  ],
  admin: {
    position: 'sidebar' as const,
    description: 'Status Draft, Terbit, dan Terjadwal diatur dengan tombol di atas.',
  },
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Halaman', plural: 'Halaman' },
  admin: {
    group: 'Konten',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'isSystem', '_status', 'updatedAt'],
    description:
      'Setiap halaman tersusun dari blok. Seret untuk mengurutkan, gandakan, atau matikan "Tampilkan blok ini" untuk menyembunyikan bagian tanpa menghapusnya.',
    livePreview: {
      url: ({ data, req }) => buildPreviewUrl(req.payload.secret, pathForDoc('pages', data)),
    },
    preview: (doc, { req }) => buildPreviewUrl(req.payload.secret, pathForDoc('pages', doc as { slug?: string })),
    components: {
      edit: { beforeDocumentControls: ['/components/admin/PlaceholderBadge#PlaceholderBadge'] },
    },
  },
  access: {
    read: publicOr('halaman', {
      publicWhere: { and: [{ _status: { equals: 'published' } }, { reviewStatus: { not_equals: 'archived' } }] },
    }),
    create: write('halaman', 'buat', { publishGate: true }),
    update: write('halaman', 'ubah', { publishGate: true }),
    delete: write('halaman', 'hapus'),
  },
  versions: {
    drafts: { autosave: { interval: 30000 }, schedulePublish: true },
    maxPerDoc: 50,
  },
  trash: true,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Konten',
          fields: [
            { name: 'title', label: 'Judul', type: 'text', required: true },
            { name: 'layout', label: 'Blok halaman', type: 'blocks', blocks: pageBlocks },
          ],
        },
      ],
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'slug',
      useAsSlug: 'title',
      admin: { description: 'Beranda memakai slug "beranda". Slug halaman sistem dikunci.' },
    },
    {
      name: 'isSystem',
      label: 'Halaman sistem',
      type: 'checkbox',
      defaultValue: false,
      access: { create: serverOwned, update: serverOwned },
      admin: { position: 'sidebar', readOnly: true, description: 'Halaman sistem tidak dapat dihapus.' },
    },
    {
      name: 'template',
      label: 'Templat',
      type: 'select',
      defaultValue: 'standar',
      options: [
        { label: 'Standar', value: 'standar' },
        { label: 'Dokumen legal', value: 'legal' },
      ],
      admin: { position: 'sidebar' },
    },
    reviewStatusField,
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        if (operation === 'update' && originalDoc?.isSystem) {
          // Routes depend on system slugs, so they stay fixed.
          data.slug = originalDoc.slug
          if (data.deletedAt) throw new APIError('Halaman sistem tidak dapat dipindahkan ke tempat sampah.', 400)
        }
        return data
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        const result = await req.payload.find({
          collection: 'pages',
          where: { id: { equals: id } },
          depth: 0,
          limit: 1,
          overrideAccess: true,
          trash: true,
          req,
        })
        if (result.docs[0]?.isSystem) throw new APIError('Halaman sistem tidak dapat dihapus.', 400)
      },
    ],
    afterChange: [...revalidation.afterChange, auditAfterChange],
    afterDelete: [...revalidation.afterDelete, auditAfterDelete],
  },
}
