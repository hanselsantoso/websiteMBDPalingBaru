import type { CollectionConfig } from 'payload'
import { publicOr, write } from '@/access'
import { sortOrderField } from '@/fields'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'
import { revalidateHooks } from '@/hooks/revalidate'

const revalidation = revalidateHooks(() => ['posts', 'post-categories'])

const access = {
  read: publicOr('blog', { publicWhere: true }),
  create: write('blog', 'buat'),
  update: write('blog', 'ubah'),
  delete: write('blog', 'hapus'),
}

export const PostCategories: CollectionConfig = {
  slug: 'post-categories',
  labels: { singular: 'Kategori blog', plural: 'Kategori blog' },
  admin: { group: 'Konten', useAsTitle: 'name', defaultColumns: ['name', 'slug', 'sortOrder'] },
  access,
  fields: [
    { name: 'name', label: 'Nama', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'slug', useAsSlug: 'name' },
    { name: 'description', label: 'Deskripsi', type: 'textarea' },
    sortOrderField,
  ],
  hooks: {
    afterChange: [...revalidation.afterChange, auditAfterChange],
    afterDelete: [...revalidation.afterDelete, auditAfterDelete],
  },
}

export const PostTags: CollectionConfig = {
  slug: 'post-tags',
  labels: { singular: 'Tag blog', plural: 'Tag blog' },
  admin: { group: 'Konten', useAsTitle: 'name', defaultColumns: ['name', 'slug'] },
  access,
  fields: [
    { name: 'name', label: 'Nama', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'slug', useAsSlug: 'name' },
  ],
  hooks: {
    afterChange: [...revalidation.afterChange, auditAfterChange],
    afterDelete: [...revalidation.afterDelete, auditAfterDelete],
  },
}
