import type { Access, CollectionConfig } from 'payload'
import { fieldAllow, getPermissions, write } from '@/access'
import { activeField, iconField, mascotPoseField, sortOrderField } from '@/fields'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'
import { revalidateHooks } from '@/hooks/revalidate'
import { scopeFor } from '@/lib/domain/permissions'

const group = 'Konten'

const staffOr =
  (publicWhere: () => Record<string, unknown>): Access =>
  async ({ req }) => {
    if (scopeFor(await getPermissions(req), 'kontenLain', 'lihat')) return true
    return publicWhere() as never
  }

const writes = {
  create: write('kontenLain', 'buat'),
  update: write('kontenLain', 'ubah'),
  delete: write('kontenLain', 'hapus'),
}

function hooksFor(tag: string) {
  const revalidation = revalidateHooks(() => [tag])
  return {
    afterChange: [...revalidation.afterChange, auditAfterChange],
    afterDelete: [...revalidation.afterDelete, auditAfterDelete],
  }
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimoni', plural: 'Testimoni' },
  admin: {
    group,
    useAsTitle: 'name',
    defaultColumns: ['name', 'classYear', 'workplace', 'approved', 'sortOrder'],
    description: 'Hanya testimoni yang disetujui tampil di situs. Blok testimoni tersembunyi otomatis bila belum ada.',
  },
  access: { read: staffOr(() => ({ approved: { equals: true } })), ...writes },
  versions: { maxPerDoc: 20 },
  fields: [
    { name: 'name', label: 'Nama', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'classYear', label: 'Angkatan', type: 'text', admin: { width: '50%' } },
        { name: 'workplace', label: 'Tempat kerja / studi', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'quote', label: 'Kutipan', type: 'textarea', required: true },
    { name: 'photo', label: 'Foto', type: 'upload', relationTo: 'media' },
    {
      name: 'approved',
      label: 'Disetujui untuk tampil',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      access: { update: fieldAllow('kontenLain', 'terbitkan'), create: fieldAllow('kontenLain', 'terbitkan') },
      admin: { position: 'sidebar' },
    },
    sortOrderField,
  ],
  hooks: hooksFor('testimonials'),
}

export const CareerPaths: CollectionConfig = {
  slug: 'career-paths',
  labels: { singular: 'Prospek karier', plural: 'Prospek karier' },
  admin: { group, useAsTitle: 'role', defaultColumns: ['role', 'isActive', 'sortOrder'] },
  access: { read: staffOr(() => ({ isActive: { equals: true } })), ...writes },
  versions: { maxPerDoc: 20 },
  fields: [
    { name: 'role', label: 'Peran', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'slug', useAsSlug: 'role' },
    { name: 'summary', label: 'Apa yang dikerjakan', type: 'textarea' },
    {
      name: 'relatedCourses',
      label: 'Mata kuliah terkait',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
    },
    { name: 'skills', label: 'Skill kunci', type: 'text', hasMany: true },
    { name: 'employers', label: 'Contoh tempat kerja', type: 'textarea', admin: { description: 'Biarkan [ISI] bila belum ada data.' } },
    { name: 'salaryNote', label: 'Kisaran gaji (indikatif)', type: 'text', admin: { description: 'Sertakan sumber data. Biarkan [ISI] bila belum ada.' } },
    iconField(),
    activeField(),
    sortOrderField,
  ],
  hooks: hooksFor('career-paths'),
}

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Mitra industri', plural: 'Mitra industri' },
  admin: { group, useAsTitle: 'name', defaultColumns: ['name', 'kind', 'isActive', 'sortOrder'] },
  access: { read: staffOr(() => ({ isActive: { equals: true } })), ...writes },
  fields: [
    { name: 'name', label: 'Nama', type: 'text', required: true },
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
    { name: 'url', label: 'Situs web', type: 'text' },
    {
      name: 'kind',
      label: 'Jenis',
      type: 'select',
      defaultValue: 'mitra',
      options: [
        { label: 'Mitra industri', value: 'mitra' },
        { label: 'Akreditasi / sertifikasi', value: 'akreditasi' },
      ],
      admin: { position: 'sidebar' },
    },
    activeField(),
    sortOrderField,
  ],
  hooks: hooksFor('partners'),
}

export const Programs: CollectionConfig = {
  slug: 'programs',
  labels: { singular: 'Program unggulan', plural: 'Program unggulan' },
  admin: { group, useAsTitle: 'title', defaultColumns: ['title', 'isActive', 'sortOrder'] },
  access: { read: staffOr(() => ({ isActive: { equals: true } })), ...writes },
  versions: { maxPerDoc: 20 },
  fields: [
    { name: 'title', label: 'Judul', type: 'text', required: true },
    { name: 'summary', label: 'Ringkasan', type: 'textarea' },
    { name: 'image', label: 'Gambar', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'tag', label: 'Tag mono', type: 'text', admin: { width: '34%' } },
        { name: 'linkHref', label: 'Tautan', type: 'text', admin: { width: '33%' } },
        mascotPoseField('mascotPose', 'Siasat di kartu'),
      ],
    },
    iconField(),
    activeField(),
    sortOrderField,
  ],
  hooks: hooksFor('programs'),
}

const startOfTodayJakarta = () => {
  const now = new Date(Date.now() + 7 * 3600 * 1000)
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - 7 * 3600 * 1000).toISOString()
}

export const JobPosts: CollectionConfig = {
  slug: 'job-posts',
  labels: { singular: 'Lowongan / magang', plural: 'Lowongan dan magang' },
  admin: {
    group,
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'type', 'deadline', 'isActive'],
    description: 'Lowongan yang melewati tenggat tersembunyi otomatis dari situs.',
  },
  access: {
    read: staffOr(() => ({
      and: [
        { isActive: { equals: true } },
        { or: [{ deadline: { greater_than_equal: startOfTodayJakarta() } }, { deadline: { exists: false } }] },
      ],
    })),
    ...writes,
  },
  fields: [
    { name: 'title', label: 'Posisi', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'company', label: 'Perusahaan', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'location', label: 'Lokasi', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          label: 'Jenis',
          type: 'select',
          defaultValue: 'magang',
          admin: { width: '50%' },
          options: [
            { label: 'Magang', value: 'magang' },
            { label: 'Penuh waktu', value: 'penuh-waktu' },
            { label: 'Paruh waktu', value: 'paruh-waktu' },
            { label: 'Kontrak', value: 'kontrak' },
            { label: 'Lepas (freelance)', value: 'freelance' },
          ],
        },
        { name: 'deadline', label: 'Tenggat', type: 'date', index: true, admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
      ],
    },
    { name: 'applyUrl', label: 'Tautan melamar', type: 'text', required: true },
    { name: 'description', label: 'Deskripsi singkat', type: 'textarea' },
    activeField('Aktif'),
  ],
  hooks: hooksFor('job-posts'),
}

export const FAQ_SCOPES = [
  { label: 'Umum', value: 'umum' },
  { label: 'PMB', value: 'pmb' },
  { label: 'Kontak', value: 'kontak' },
  { label: 'Kurikulum', value: 'kurikulum' },
  { label: 'Kuis', value: 'kuis' },
]

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQ' },
  admin: { group, useAsTitle: 'question', defaultColumns: ['question', 'scope', 'isActive', 'sortOrder'] },
  access: { read: staffOr(() => ({ isActive: { equals: true } })), ...writes },
  fields: [
    { name: 'question', label: 'Pertanyaan', type: 'text', required: true },
    { name: 'answer', label: 'Jawaban', type: 'textarea', required: true },
    { name: 'scope', label: 'Kelompok', type: 'select', hasMany: true, options: FAQ_SCOPES, defaultValue: ['umum'], index: true, admin: { position: 'sidebar' } },
    activeField(),
    sortOrderField,
  ],
  hooks: hooksFor('faqs'),
}
