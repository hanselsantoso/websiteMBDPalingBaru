import type { CollectionConfig, CollectionBeforeOperationHook } from 'payload'
import { APIError, createFolderField, createTagField } from 'payload'
import { serverOwned, write } from '@/access'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'
import { revalidateHooks } from '@/hooks/revalidate'
import { findMediaUsage } from '@/server/media-usage'

export const MEDIA_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/svg+xml',
  'application/pdf',
  'video/mp4',
  'video/webm',
  'model/gltf-binary',
]

const DEFAULT_LIMITS_MB = { image: 8, pdf: 20, video: 60, model: 3 }

const UNSAFE_SVG = [/<script/i, /\son[a-z]+\s*=/i, /javascript:/i, /<foreignObject/i, /<iframe/i, /<embed/i, /<object/i, /xlink:href\s*=\s*["']\s*(?!#)/i]

const validateUpload: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (operation !== 'create' && operation !== 'update') return args
  const file = req.file as { data?: Buffer; mimetype?: string; size?: number; name?: string } | undefined
  if (!file?.data) return args

  const mime = file.mimetype ?? ''
  let limits = DEFAULT_LIMITS_MB
  try {
    const settings = (await req.payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true, req })) as {
      uploadLimits?: Partial<typeof DEFAULT_LIMITS_MB>
    }
    limits = { ...DEFAULT_LIMITS_MB, ...Object.fromEntries(Object.entries(settings.uploadLimits ?? {}).filter(([, v]) => Number(v) > 0)) }
  } catch {
    // Settings not seeded yet; defaults apply.
  }

  const group = mime.startsWith('image/') ? 'image' : mime === 'application/pdf' ? 'pdf' : mime.startsWith('video/') ? 'video' : 'model'
  const limitMb = limits[group]
  const size = file.size ?? file.data.length
  if (size > limitMb * 1024 * 1024) {
    throw new APIError(`Ukuran file melebihi batas ${limitMb} MB untuk jenis ini. Kompres file lalu unggah ulang.`, 400)
  }

  if (mime === 'image/svg+xml') {
    const content = file.data.toString('utf8')
    if (UNSAFE_SVG.some((pattern) => pattern.test(content))) {
      throw new APIError('SVG ditolak karena berisi skrip atau tautan eksternal. Ekspor ulang SVG tanpa skrip.', 400)
    }
  }
  return args
}

const revalidation = revalidateHooks(() => ['media'])

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  admin: {
    group: 'Konten',
    defaultColumns: ['filename', 'alt', 'mimeType', 'folder', 'updatedAt'],
    description: 'Teks alternatif wajib diisi. Gunakan folder Maskot untuk pose Pivot dan folder Brosur untuk PDF brosur.',
  },
  access: {
    read: () => true,
    create: write('media', 'buat'),
    update: write('media', 'ubah', { ownerField: 'uploadedBy' }),
    delete: write('media', 'hapus', { ownerField: 'uploadedBy' }),
  },
  fields: [
    {
      name: 'alt',
      label: 'Teks alternatif',
      type: 'text',
      required: true,
      admin: { description: 'Jelaskan isi gambar untuk pembaca layar. Tulis "dekoratif" bila gambar hanya hiasan.' },
    },
    { name: 'caption', label: 'Keterangan', type: 'text' },
    createFolderField({ relationTo: 'folders' }),
    createTagField({ relationTo: 'tags' }),
    {
      name: 'uploadedBy',
      label: 'Diunggah oleh',
      type: 'relationship',
      relationTo: 'admins',
      access: { create: serverOwned, update: serverOwned },
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'usage',
      label: 'Dipakai di',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '/components/admin/MediaUsage#MediaUsage' } },
    },
  ],
  upload: {
    staticDir: process.env.MEDIA_DIR || '.local-data/media',
    focalPoint: true,
    crop: true,
    mimeTypes: MEDIA_MIME_TYPES,
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
      return headers
    },
  },
  hooks: {
    beforeOperation: [validateUpload],
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create' && req.user?.collection === 'admins') data.uploadedBy = req.user.id
        return data
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const usages = await findMediaUsage(req.payload, id, req)
        if (usages.length) {
          const list = usages.slice(0, 4).map((u) => `${u.where}: ${u.title}`).join('; ')
          throw new APIError(`Media ini masih dipakai (${list}). Ganti file di tempat tersebut sebelum menghapus.`, 400)
        }
      },
    ],
    afterChange: [...revalidation.afterChange, auditAfterChange],
    afterDelete: [...revalidation.afterDelete, auditAfterDelete],
  },
}
