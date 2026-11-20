import type { CollectionConfig, Where } from 'payload'
import { APIError } from 'payload'
import { fieldAllow, isAdminUser, publicOr, write } from '@/access'
import { sortOrderField } from '@/fields'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'
import { revalidateHooks } from '@/hooks/revalidate'
import {
  assessmentTotal,
  COURSE_TAGS,
  courseSlug,
  syllabusCompleteness,
} from '@/lib/domain/curriculum'
import { buildPreviewUrl, pathForDoc } from '@/lib/preview'

const curriculumRevalidation = revalidateHooks((doc, prev) => [
  'curriculum',
  doc?.slug && `course:${doc.slug}`,
  prev?.slug && `course:${prev.slug}`,
])

export const CurriculumVersions: CollectionConfig = {
  slug: 'curriculum-versions',
  labels: { singular: 'Versi kurikulum', plural: 'Versi kurikulum' },
  admin: {
    group: 'Akademik',
    useAsTitle: 'name',
    defaultColumns: ['name', 'year', 'isActive', 'status', 'updatedAt'],
    description: 'Hanya satu versi yang aktif. Versi lama dapat diarsipkan tanpa dihapus.',
  },
  access: {
    read: publicOr('kurikulum', { publicWhere: true }),
    create: write('kurikulum', 'buat'),
    update: write('kurikulum', 'ubah'),
    delete: write('kurikulum', 'hapus'),
  },
  versions: { maxPerDoc: 20 },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          label: 'Nama versi',
          type: 'text',
          required: true,
          admin: { width: '60%' },
        },
        { name: 'year', label: 'Tahun', type: 'number', admin: { width: '40%' } },
      ],
    },
    {
      name: 'isActive',
      label: 'Versi aktif',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      access: { update: fieldAllow('kurikulum', 'terbitkan') },
      admin: {
        position: 'sidebar',
        description: 'Mengaktifkan versi ini menonaktifkan versi lain.',
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Aktif', value: 'aktif' },
        { label: 'Arsip', value: 'arsip' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'pdf',
      label: 'PDF kurikulum resmi (opsional)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Bila kosong, tombol unduh membuka versi cetak yang dibuat dari data.',
      },
    },
    {
      name: 'semesters',
      label: 'Tema semester',
      type: 'array',
      maxRows: 8,
      labels: { singular: 'Semester', plural: 'Semester' },
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'number',
              label: 'Semester',
              type: 'number',
              required: true,
              min: 1,
              max: 8,
              admin: { width: '20%' },
            },
            { name: 'title', label: 'Tema', type: 'text', required: true, admin: { width: '80%' } },
          ],
        },
        { name: 'description', label: 'Deskripsi singkat', type: 'textarea' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        const numbers = (data.semesters ?? []).map((s: { number?: number }) => s.number)
        if (new Set(numbers).size !== numbers.length)
          throw new APIError('Setiap nomor semester hanya boleh muncul sekali.', 400)
        if (data.isActive) data.status = 'aktif'
        return data
      },
    ],
    afterChange: [
      async ({ doc, req, context }) => {
        if (doc.isActive && !context.skipActivation) {
          await req.payload.update({
            collection: 'curriculum-versions',
            where: { and: [{ id: { not_equals: doc.id } }, { isActive: { equals: true } }] },
            data: { isActive: false, status: 'arsip' },
            overrideAccess: true,
            context: { skipActivation: true },
            req,
          })
        }
        return doc
      },
      ...revalidateHooks(() => ['curriculum']).afterChange,
      auditAfterChange,
    ],
    afterDelete: [...revalidateHooks(() => ['curriculum']).afterDelete, auditAfterDelete],
  },
}

export const Courses: CollectionConfig = {
  slug: 'courses',
  labels: { singular: 'Mata kuliah', plural: 'Mata kuliah dan silabus' },
  admin: {
    group: 'Akademik',
    useAsTitle: 'name',
    defaultColumns: [
      'code',
      'name',
      'semester',
      'credits',
      'tags',
      'syllabusCompleteness',
      'isVisible',
    ],
    listSearchableFields: ['name', 'code', 'nameSource'],
    description: 'Filter "Kelengkapan silabus < 100" untuk melihat silabus yang belum lengkap.',
    livePreview: {
      url: ({ data, req }) => buildPreviewUrl(req.payload.secret, pathForDoc('courses', data)),
    },
    preview: (doc, { req }) =>
      buildPreviewUrl(req.payload.secret, pathForDoc('courses', doc as { slug?: string })),
    components: {
      edit: { beforeDocumentControls: ['/components/admin/PlaceholderBadge#PlaceholderBadge'] },
    },
  },
  access: {
    read: publicOr('matakuliah', { publicWhere: { isVisible: { equals: true } } }),
    create: write('matakuliah', 'buat'),
    update: write('matakuliah', 'ubah'),
    delete: write('matakuliah', 'hapus'),
  },
  versions: { maxPerDoc: 30 },
  trash: true,
  indexes: [{ fields: ['version', 'code'], unique: true }],
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identitas',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'code',
                  label: 'Kode',
                  type: 'text',
                  index: true,
                  admin: { width: '25%', description: 'Kosong = tampil sebagai [ISI].' },
                },
                {
                  name: 'name',
                  label: 'Nama tampil (ID)',
                  type: 'text',
                  required: true,
                  admin: { width: '75%' },
                },
              ],
            },
            { name: 'nameSource', label: 'Nama sumber', type: 'text' },
            {
              type: 'row',
              fields: [
                {
                  name: 'semester',
                  label: 'Semester',
                  type: 'number',
                  required: true,
                  min: 1,
                  max: 8,
                  index: true,
                  admin: { width: '25%' },
                },
                {
                  name: 'credits',
                  label: 'SKS',
                  type: 'number',
                  required: true,
                  min: 1,
                  max: 20,
                  admin: { width: '25%' },
                },
                {
                  name: 'type',
                  label: 'Jenis',
                  type: 'select',
                  defaultValue: 'wajib',
                  admin: { width: '25%' },
                  options: [
                    { label: 'Wajib', value: 'wajib' },
                    { label: 'Pilihan', value: 'pilihan' },
                    { label: 'Umum', value: 'umum' },
                  ],
                },
                {
                  name: 'sortOrder',
                  label: 'Urutan',
                  type: 'number',
                  defaultValue: 0,
                  admin: { width: '25%' },
                },
              ],
            },
            {
              name: 'tags',
              label: 'Tag',
              type: 'select',
              hasMany: true,
              options: COURSE_TAGS.map((tag) => ({ label: tag, value: tag })),
              index: true,
            },
          ],
        },
        {
          label: 'Deskripsi',
          fields: [
            {
              name: 'shortDescription',
              label: 'Deskripsi singkat (satu kalimat)',
              type: 'textarea',
            },
            { name: 'description', label: 'Deskripsi mata kuliah', type: 'textarea' },
            {
              name: 'prerequisites',
              label: 'Prasyarat',
              type: 'relationship',
              relationTo: 'courses',
              hasMany: true,
              filterOptions: ({ id, data }) => {
                const and: Where[] = [
                  ...(id ? [{ id: { not_equals: id } }] : []),
                  ...(data?.version
                    ? [
                        {
                          version: {
                            equals:
                              typeof data.version === 'object' ? data.version.id : data.version,
                          },
                        },
                      ]
                    : []),
                ]
                return { and }
              },
            },
          ],
        },
        {
          label: 'CPMK',
          fields: [
            {
              name: 'cpmk',
              label: 'Capaian pembelajaran (CPMK)',
              type: 'array',
              labels: { singular: 'CPMK', plural: 'CPMK' },
              fields: [{ name: 'text', label: 'Capaian', type: 'textarea', required: true }],
            },
          ],
        },
        {
          label: 'Rencana mingguan',
          fields: [
            {
              name: 'weeklyPlan',
              label: 'Rencana pertemuan (14–16 sesi)',
              type: 'array',
              maxRows: 16,
              labels: { singular: 'Pertemuan', plural: 'Pertemuan' },
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'week',
                      label: 'Minggu',
                      type: 'number',
                      min: 1,
                      max: 16,
                      admin: { width: '15%' },
                    },
                    {
                      name: 'topic',
                      label: 'Topik',
                      type: 'text',
                      required: true,
                      admin: { width: '45%' },
                    },
                    { name: 'method', label: 'Metode', type: 'text', admin: { width: '20%' } },
                    {
                      name: 'outcome',
                      label: 'CPMK terkait',
                      type: 'text',
                      admin: { width: '20%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Penilaian',
          fields: [
            {
              name: 'assessment',
              label: 'Komponen penilaian',
              type: 'array',
              labels: { singular: 'Komponen', plural: 'Komponen' },
              admin: { description: 'Total bobot harus 100%.' },
              validate: (value: unknown) => {
                const rows = (value as { weight?: number }[] | null) ?? []
                if (rows.length === 0) return true
                const total = assessmentTotal(rows)
                return (
                  total === 100 || `Total bobot penilaian ${total}%. Sesuaikan agar tepat 100%.`
                )
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'component',
                      label: 'Komponen',
                      type: 'text',
                      required: true,
                      admin: { width: '70%' },
                    },
                    {
                      name: 'weight',
                      label: 'Bobot (%)',
                      type: 'number',
                      min: 0,
                      max: 100,
                      admin: { width: '30%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Referensi dan alat',
          fields: [
            {
              name: 'references',
              label: 'Buku dan referensi',
              type: 'array',
              fields: [{ name: 'text', label: 'Referensi', type: 'text', required: true }],
            },
            {
              name: 'tools',
              label: 'Tools dan software',
              type: 'array',
              fields: [{ name: 'name', label: 'Nama', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Dosen dan RPS',
          fields: [
            {
              name: 'lecturers',
              label: 'Dosen pengampu',
              type: 'relationship',
              relationTo: 'faculty',
              hasMany: true,
            },
            { name: 'rps', label: 'File RPS / silabus (PDF)', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
    {
      name: 'version',
      label: 'Versi kurikulum',
      type: 'relationship',
      relationTo: 'curriculum-versions',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'slug',
      label: 'Slug URL',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Dibuat dari kode (atau nama bila tanpa kode).',
      },
    },
    {
      name: 'isVisible',
      label: 'Tampil di situs',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      access: { update: fieldAllow('matakuliah', 'terbitkan') },
      admin: { position: 'sidebar' },
    },
    {
      name: 'syllabusCompleteness',
      label: 'Kelengkapan silabus (%)',
      type: 'number',
      defaultValue: 0,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Dihitung otomatis dari 6 bagian silabus.',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        if (typeof data.code === 'string') data.code = data.code.trim().toUpperCase() || null
        if (data.name) data.slug = courseSlug(data.code, data.name)
        return data
      },
    ],
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        const merged = { ...originalDoc, ...data }
        data.syllabusCompleteness = syllabusCompleteness(merged)
        const version = typeof merged.version === 'object' ? merged.version?.id : merged.version
        if (merged.code && version) {
          const duplicate = await req.payload.find({
            collection: 'courses',
            where: {
              and: [
                { code: { equals: merged.code } },
                { version: { equals: version } },
                ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
              ],
            },
            limit: 1,
            depth: 0,
            overrideAccess: true,
            req,
          })
          if (duplicate.docs.length) {
            throw new APIError(
              `Kode ${merged.code} sudah dipakai di versi kurikulum ini. Gunakan kode lain.`,
              400,
            )
          }
        }
        return data
      },
    ],
    afterChange: [...curriculumRevalidation.afterChange, auditAfterChange],
    afterDelete: [...curriculumRevalidation.afterDelete, auditAfterDelete],
  },
}

const facultyRevalidation = revalidateHooks((doc, prev) => [
  'faculty',
  doc?.slug && `faculty:${doc.slug}`,
  prev?.slug && `faculty:${prev.slug}`,
])

export const Faculty: CollectionConfig = {
  slug: 'faculty',
  labels: { singular: 'Dosen', plural: 'Dosen' },
  admin: {
    group: 'Akademik',
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'showOnHome', '_status', 'sortOrder'],
    livePreview: {
      url: ({ data, req }) => buildPreviewUrl(req.payload.secret, pathForDoc('faculty', data)),
    },
    preview: (doc, { req }) =>
      buildPreviewUrl(req.payload.secret, pathForDoc('faculty', doc as { slug?: string })),
    components: {
      edit: { beforeDocumentControls: ['/components/admin/PlaceholderBadge#PlaceholderBadge'] },
    },
  },
  access: {
    read: publicOr('dosen'),
    create: write('dosen', 'buat', { publishGate: true }),
    update: write('dosen', 'ubah', { publishGate: true }),
    delete: write('dosen', 'hapus'),
  },
  versions: { drafts: { autosave: { interval: 30000 } }, maxPerDoc: 30 },
  trash: true,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profil',
          fields: [
            { name: 'name', label: 'Nama lengkap', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                { name: 'titleFront', label: 'Gelar depan', type: 'text', admin: { width: '25%' } },
                {
                  name: 'titleBack',
                  label: 'Gelar belakang',
                  type: 'text',
                  admin: { width: '25%' },
                },
                { name: 'nidn', label: 'NIDN', type: 'text', admin: { width: '25%' } },
                {
                  name: 'position',
                  label: 'Jabatan akademik',
                  type: 'text',
                  admin: { width: '25%' },
                },
              ],
            },
            {
              name: 'photo',
              label: 'Foto (rasio 4:5)',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Foto dipotong dengan masker sirip atau sudut membulat di situs.',
              },
            },
            { name: 'expertise', label: 'Bidang keahlian', type: 'text', hasMany: true },
            { name: 'bio', label: 'Bio singkat', type: 'textarea' },
          ],
        },
        {
          label: 'Riwayat dan publikasi',
          fields: [
            {
              name: 'education',
              label: 'Riwayat pendidikan',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'degree',
                      label: 'Jenjang & bidang',
                      type: 'text',
                      required: true,
                      admin: { width: '45%' },
                    },
                    {
                      name: 'institution',
                      label: 'Institusi',
                      type: 'text',
                      admin: { width: '40%' },
                    },
                    { name: 'year', label: 'Tahun', type: 'text', admin: { width: '15%' } },
                  ],
                },
              ],
            },
            {
              name: 'publications',
              label: 'Publikasi atau proyek pilihan',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'year', label: 'Tahun', type: 'text', admin: { width: '15%' } },
                    {
                      name: 'title',
                      label: 'Judul',
                      type: 'text',
                      required: true,
                      admin: { width: '55%' },
                    },
                    { name: 'url', label: 'Tautan', type: 'text', admin: { width: '30%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Tautan dan kontak',
          fields: [
            {
              name: 'links',
              label: 'Tautan eksternal',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'sinta', label: 'SINTA', type: 'text', admin: { width: '25%' } },
                    {
                      name: 'scholar',
                      label: 'Google Scholar',
                      type: 'text',
                      admin: { width: '25%' },
                    },
                    { name: 'linkedin', label: 'LinkedIn', type: 'text', admin: { width: '25%' } },
                    { name: 'website', label: 'Situs lain', type: 'text', admin: { width: '25%' } },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'email',
                  label: 'Email',
                  type: 'email',
                  // Public reads only include the address when "Tampilkan email di situs" is on.
                  access: {
                    read: ({ req, siblingData, doc }) =>
                      isAdminUser(req.user) || Boolean((siblingData ?? doc)?.showEmail),
                  },
                  admin: { width: '50%' },
                },
                {
                  name: 'showEmail',
                  label: 'Tampilkan email di situs',
                  type: 'checkbox',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Mata kuliah',
          fields: [
            {
              name: 'coursesTaught',
              label: 'Mata kuliah yang diampu',
              type: 'join',
              collection: 'courses',
              on: 'lecturers',
              admin: { description: 'Diatur dari kolom "Dosen pengampu" di setiap mata kuliah.' },
            },
          ],
        },
      ],
    },
    { name: 'slug', label: 'Slug', type: 'slug', useAsSlug: 'name' },
    {
      name: 'showOnHome',
      label: 'Tampilkan di beranda',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar' },
    },
    sortOrderField,
  ],
  hooks: {
    afterChange: [...facultyRevalidation.afterChange, auditAfterChange],
    afterDelete: [...facultyRevalidation.afterDelete, auditAfterDelete],
  },
}
