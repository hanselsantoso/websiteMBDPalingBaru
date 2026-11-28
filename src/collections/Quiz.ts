import { ValidationError, type CollectionConfig } from 'payload'
import { publicOr, staffRead, write } from '@/access'
import { mascotPoseField, sortOrderField } from '@/fields'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'
import { revalidateHooks } from '@/hooks/revalidate'
import { DIMENSIONS, PAIR_KEYS, QUIZ_ASSESSMENT_MARKER_PREFIX } from '@/lib/domain/quiz'

const quizHooks = () => {
  const revalidation = revalidateHooks(() => ['quiz'])
  return {
    afterChange: [...revalidation.afterChange, auditAfterChange],
    afterDelete: [...revalidation.afterDelete, auditAfterDelete],
  }
}

const weightField = (key: string, label: string) => ({
  name: key,
  label,
  type: 'number' as const,
  defaultValue: 0,
  min: 0,
  max: 5,
  admin: { width: '25%' },
})

export const QuizQuestions: CollectionConfig = {
  slug: 'quiz-questions',
  labels: { singular: 'Pertanyaan kuis', plural: 'Pertanyaan kuis' },
  admin: {
    group: 'Penerimaan',
    useAsTitle: 'text',
    defaultColumns: ['text', 'sortOrder', 'isActive'],
    description: 'Setiap opsi memberi bobot 0–5 ke empat dimensi: Bisnis dan Strategi, Data dan Analitik, Teknologi dan AI, Kreatif dan Produk.',
  },
  access: {
    read: publicOr('kuis', { publicWhere: { isActive: { equals: true } } }),
    create: write('kuis', 'buat'),
    update: write('kuis', 'ubah'),
    delete: write('kuis', 'hapus'),
  },
  fields: [
    { name: 'text', label: 'Pertanyaan', type: 'text', required: true },
    {
      name: 'helpText',
      label: 'Keterangan kecil',
      type: 'text',
      admin: { description: 'Penanda versi asesmen ditetapkan saat soal dibuat.' },
    },
    { name: 'image', label: 'Gambar (opsional)', type: 'upload', relationTo: 'media' },
    {
      name: 'options',
      label: 'Opsi jawaban',
      type: 'array',
      minRows: 3,
      maxRows: 5,
      labels: { singular: 'Opsi', plural: 'Opsi' },
      fields: [
        { name: 'label', label: 'Teks opsi', type: 'text', required: true },
        {
          name: 'weights',
          label: 'Bobot dimensi (0–5)',
          type: 'group',
          fields: [{ type: 'row', fields: DIMENSIONS.map((d) => weightField(d.key, d.short)) }],
        },
      ],
    },
    { name: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true, index: true, admin: { position: 'sidebar' } },
    sortOrderField,
  ],
  hooks: {
    ...quizHooks(),
    beforeChange: [({ data, originalDoc }) => {
      const previous = originalDoc?.helpText
      const markerPrefix = QUIZ_ASSESSMENT_MARKER_PREFIX.toLowerCase()
      const changesMarker = [previous, data.helpText].some(
        (value) => typeof value === 'string' && value.trim().toLowerCase().startsWith(markerPrefix),
      )
      if (originalDoc && changesMarker && data.helpText !== undefined && data.helpText !== previous) {
        throw new ValidationError({
          errors: [{ path: 'helpText', message: 'Gunakan dokumen baru untuk versi asesmen yang berbeda.' }],
        })
      }
      return data
    }],
  },
}

export const QuizResults: CollectionConfig = {
  slug: 'quiz-results',
  labels: { singular: 'Hasil kuis', plural: 'Hasil kuis (arketipe)' },
  admin: {
    group: 'Penerimaan',
    useAsTitle: 'archetype',
    defaultColumns: ['archetype', 'pairKey', 'pose'],
    description: 'Arketipe dipilih dari dua dimensi dengan skor tertinggi.',
  },
  access: {
    read: publicOr('kuis', { publicWhere: true }),
    create: write('kuis', 'buat'),
    update: write('kuis', 'ubah'),
    delete: write('kuis', 'hapus'),
  },
  fields: [
    { name: 'archetype', label: 'Nama arketipe', type: 'text', required: true },
    {
      name: 'pairKey',
      label: 'Dua dimensi teratas',
      type: 'select',
      required: true,
      unique: true,
      options: PAIR_KEYS.map((key) => {
        const [a, b] = key.split('-')
        const label = (k: string) => DIMENSIONS.find((d) => d.key === k)?.short ?? k
        return { label: `${label(a)} + ${label(b)}`, value: key }
      }),
    },
    { name: 'description', label: 'Deskripsi', type: 'textarea', required: true },
    { name: 'traits', label: 'Ciri khas', type: 'text', hasMany: true },
    mascotPoseField('pose', 'Pose Pivot', { allowNone: false, defaultValue: 'celebrating' }),
    {
      name: 'semesters',
      label: 'Semester yang cocok',
      type: 'select',
      hasMany: true,
      options: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ label: `Semester ${n}`, value: String(n) })),
    },
    { name: 'courses', label: 'Mata kuliah yang cocok', type: 'relationship', relationTo: 'courses', hasMany: true },
  ],
  hooks: quizHooks(),
}

export const QuizAttempts: CollectionConfig = {
  slug: 'quiz-attempts',
  labels: { singular: 'Percobaan kuis', plural: 'Percobaan kuis' },
  admin: {
    group: 'Penerimaan',
    useAsTitle: 'id',
    defaultColumns: ['result', 'matchPercent', 'lead', 'isTest', 'createdAt'],
  },
  access: {
    read: staffRead('kuis'),
    create: () => false,
    update: () => false,
    delete: write('kuis', 'hapus'),
  },
  fields: [
    { name: 'result', label: 'Hasil', type: 'relationship', relationTo: 'quiz-results', index: true },
    {
      name: 'matchPercent',
      label: 'Skor (%)',
      type: 'number',
      admin: { description: 'Persentase poin studi kasus. Percobaan dari kuis sebelumnya memuat persentase kecocokan.' },
    },
    { name: 'answers', label: 'Jawaban', type: 'json' },
    { name: 'scores', label: 'Skor', type: 'json' },
    { name: 'lead', label: 'Lead', type: 'relationship', relationTo: 'leads' },
    { name: 'sessionId', label: 'Sesi', type: 'text', index: true },
    { name: 'isTest', label: 'Mode uji', type: 'checkbox', index: true },
  ],
}
