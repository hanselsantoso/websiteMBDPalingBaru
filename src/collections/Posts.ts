import type { CollectionConfig } from 'payload'
import { fieldAllow, getPermissions, publicOr, write } from '@/access'
import { reviewStatusField } from '@/collections/Pages'
import { articleEditor } from '@/fields/richText'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'
import { revalidateHooks } from '@/hooks/revalidate'
import { can } from '@/lib/domain/permissions'
import { readingMinutes } from '@/lib/lexical'
import { buildPreviewUrl, pathForDoc } from '@/lib/preview'

const revalidation = revalidateHooks((doc, prev) => [
  'posts',
  doc?.slug && `post:${doc.slug}`,
  prev?.slug && `post:${prev.slug}`,
])

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Artikel', plural: 'Blog' },
  admin: {
    group: 'Konten',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', '_status', 'reviewStatus', 'publishedAt'],
    livePreview: {
      url: ({ data, req }) => buildPreviewUrl(req.payload.secret, pathForDoc('posts', data)),
    },
    preview: (doc, { req }) => buildPreviewUrl(req.payload.secret, pathForDoc('posts', doc as { slug?: string })),
    components: {
      edit: { beforeDocumentControls: ['/components/admin/PlaceholderBadge#PlaceholderBadge'] },
    },
  },
  access: {
    read: publicOr('blog', {
      ownerField: 'author',
      publicWhere: { and: [{ _status: { equals: 'published' } }, { reviewStatus: { not_equals: 'archived' } }] },
    }),
    create: write('blog', 'buat', { publishGate: true }),
    update: write('blog', 'ubah', { publishGate: true, ownerField: 'author' }),
    delete: write('blog', 'hapus', { ownerField: 'author' }),
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
          {
            name: 'excerpt',
            label: 'Ringkasan',
            type: 'textarea',
            maxLength: 240,
            admin: { description: 'Tampil di kartu artikel dan cuplikan mesin pencari. Maksimal 240 karakter.' },
          },
          {
            name: 'cover',
            label: 'Gambar sampul',
            type: 'upload',
            relationTo: 'media',
            admin: { description: 'Teks alternatif diambil dari media. Tanpa sampul, situs membuat sampul berpola merek.' },
          },
          {
            name: 'content',
            label: 'Isi artikel',
            type: 'richText',
            editor: articleEditor,
            required: true,
            admin: {
              description: 'Pilih teks lalu buka menu gaya untuk memilih font, ukuran, atau warna. Gunakan menu tambah untuk menyisipkan gambar dari Media.',
            },
          },
          {
            name: 'relatedPosts',
            label: 'Artikel terkait (manual)',
            type: 'relationship',
            relationTo: 'posts',
            hasMany: true,
            maxRows: 3,
            filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
            admin: { description: 'Kosongkan agar situs memilih otomatis dari kategori yang sama.' },
          },
          ],
        },
      ],
    },
    { name: 'slug', label: 'Slug', type: 'slug', useAsSlug: 'title' },
    {
      name: 'category',
      label: 'Kategori',
      type: 'relationship',
      relationTo: 'post-categories',
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      label: 'Tag',
      type: 'relationship',
      relationTo: 'post-tags',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      label: 'Penulis',
      type: 'relationship',
      relationTo: 'admins',
      index: true,
      defaultValue: ({ user }) => user?.collection === 'admins' ? user.id : undefined,
      access: { create: fieldAllow('blog', 'terbitkan'), update: fieldAllow('blog', 'terbitkan') },
      admin: { position: 'sidebar' },
    },
    {
      name: 'authorName',
      label: 'Nama penulis yang tampil',
      type: 'text',
      admin: { position: 'sidebar', description: 'Kosongkan untuk memakai nama akun penulis.' },
    },
    {
      name: 'featured',
      label: 'Artikel unggulan',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      label: 'Tanggal terbit',
      type: 'date',
      index: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'readingMinutes',
      label: 'Waktu baca (menit)',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true, description: 'Dihitung otomatis.' },
    },
    reviewStatusField,
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        if (data.content) data.readingMinutes = readingMinutes(data.content)
        if (operation === 'create' && !data.author && req.user?.collection === 'admins') data.author = req.user.id
        const authorId = data.author ?? originalDoc?.author
        if (!data.authorName && !originalDoc?.authorName && authorId) {
          try {
            const author = (await req.payload.findByID({
              collection: 'admins',
              id: typeof authorId === 'object' ? authorId.id : authorId,
              depth: 0,
              overrideAccess: true,
              req,
            })) as { name?: string | null; email?: string }
            data.authorName = author.name || 'Tim MBD ISTTS'
          } catch {
            data.authorName = 'Tim MBD ISTTS'
          }
        }
        if (data._status === 'published') {
          if (!data.publishedAt && !originalDoc?.publishedAt) data.publishedAt = new Date().toISOString()
          data.reviewStatus = 'none'
        } else {
          const permissions = await getPermissions(req)
          if (permissions && !can(permissions, 'blog', 'terbitkan')) {
            // Writers cannot archive; their drafts move to review.
            data.reviewStatus = 'review'
          }
        }
        return data
      },
    ],
    afterChange: [...revalidation.afterChange, auditAfterChange],
    afterDelete: [...revalidation.afterDelete, auditAfterDelete],
  },
}
