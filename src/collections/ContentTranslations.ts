import { createHash } from 'node:crypto'
import type { CollectionConfig, Validate } from 'payload'
import { allow, serverOwned, write } from '@/access'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'
import { revalidateHooks } from '@/hooks/revalidate'
import { CONTENT_TRANSLATIONS, translationReadContext } from '@/lib/content-translations'

const readTranslations = allow('halaman', 'lihat')
const revalidation = revalidateHooks(() => [CONTENT_TRANSLATIONS])

const nonemptyText: Validate = (value, { req }) =>
  (typeof value === 'string' && value.trim().length > 0)
  || req.t('validation:required')

export const ContentTranslations: CollectionConfig = {
  slug: CONTENT_TRANSLATIONS,
  versions: false,
  labels: {
    singular: { id: 'Terjemahan konten', en: 'Content translation' },
    plural: { id: 'Terjemahan konten', en: 'Content translations' },
  },
  admin: {
    group: 'Konten',
    useAsTitle: 'source',
    defaultColumns: ['source', 'english', 'updatedAt'],
    description: {
      id: 'Terjemahan langsung berlaku untuk teks konten yang tampil di situs berbahasa Inggris.',
      en: 'Saving a translation updates matching copy on the English site.',
    },
  },
  access: {
    read: (args) => (args.req.payloadAPI === 'local' && args.req.context.translationRead === translationReadContext)
      || readTranslations(args),
    create: write('halaman', 'buat'),
    update: write('halaman', 'ubah'),
    delete: write('halaman', 'hapus'),
  },
  fields: [
    {
      name: 'source',
      label: { id: 'Teks Indonesia', en: 'Indonesian source text' },
      type: 'textarea',
      required: true,
      validate: nonemptyText,
      admin: {
        description: {
          id: 'Salin teks asli secara persis, termasuk spasi, huruf besar, dan tanda baca.',
          en: 'Copy the original text exactly, including spaces, capitalization, and punctuation.',
        },
      },
    },
    {
      name: 'english',
      label: { id: 'Terjemahan Inggris', en: 'English translation' },
      type: 'textarea',
      required: true,
      validate: nonemptyText,
    },
    {
      name: 'sourceKey',
      type: 'text',
      required: true,
      defaultValue: '',
      unique: true,
      admin: { hidden: true },
      access: { create: serverOwned, update: serverOwned, read: serverOwned },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const source = data.source === undefined ? originalDoc?.source : data.source
        if (typeof source === 'string' && source.trim()) {
          data.sourceKey = createHash('sha256').update(source).digest('hex')
        }
        return data
      },
    ],
    afterChange: [...revalidation.afterChange, auditAfterChange],
    afterDelete: [...revalidation.afterDelete, auditAfterDelete],
  },
}
