import type { CollectionConfig } from 'payload'
import { fieldAllow, serverOwned, staffRead, write } from '@/access'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'
import { maskPhone, normalizeEmail, normalizePhone } from '@/lib/domain/phone'
import { LEAD_SOURCES, LEAD_STATUSES } from '@/lib/domain/templates'
import { CONTACT_TOPICS, TIME_SLOTS } from '@/lib/schemas'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Lead', plural: 'Leads' },
  admin: {
    group: 'Penerimaan',
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'phoneMasked',
      'firstSource',
      'status',
      'assignedTo',
      'followUpAt',
      'updatedAt',
    ],
    listSearchableFields: ['name', 'email', 'phone', 'school'],
    description:
      'Semua prospek dari brosur, kuis, kontak, WhatsApp, dan PMB. Lead dengan nomor atau email sama digabung otomatis.',
    components: { beforeListTable: ['/components/admin/LeadsBoard#LeadsBoard'] },
  },
  access: {
    read: staffRead('leads'),
    create: write('leads', 'buat'),
    update: write('leads', 'ubah'),
    delete: write('leads', 'hapus'),
  },
  trash: true,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nama', type: 'text', required: true, admin: { width: '40%' } },
        {
          name: 'phone',
          label: 'WhatsApp',
          type: 'text',
          access: { read: fieldAllow('leads', 'ekspor') },
          admin: { width: '30%' },
        },
        {
          name: 'phoneMasked',
          label: 'WhatsApp (tersamar)',
          type: 'text',
          admin: { width: '30%', readOnly: true },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', label: 'Email', type: 'email', index: true, admin: { width: '50%' } },
        { name: 'school', label: 'Sekolah', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'whatsappAction',
      type: 'ui',
      admin: { components: { Field: '/components/admin/LeadWhatsAppButton#LeadWhatsAppButton' } },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          defaultValue: 'baru',
          index: true,
          options: [...LEAD_STATUSES],
          admin: { width: '34%' },
        },
        {
          name: 'assignedTo',
          label: 'Ditangani oleh',
          type: 'relationship',
          relationTo: 'admins',
          index: true,
          admin: { width: '33%' },
        },
        {
          name: 'followUpAt',
          label: 'Tindak lanjut',
          type: 'date',
          index: true,
          admin: { width: '33%', date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'firstSource',
          label: 'Sumber pertama',
          type: 'select',
          index: true,
          options: [...LEAD_SOURCES],
          admin: { width: '50%' },
        },
        {
          name: 'sources',
          label: 'Semua sumber',
          type: 'select',
          hasMany: true,
          options: [...LEAD_SOURCES],
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'tags', label: 'Tag', type: 'text', hasMany: true },
    {
      type: 'collapsible',
      label: 'Kuis, PMB, dan UTM',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'quizArchetype',
              label: 'Arketipe kuis',
              type: 'text',
              admin: { width: '34%' },
            },
            {
              name: 'quizAttempt',
              label: 'Percobaan kuis',
              type: 'relationship',
              relationTo: 'quiz-attempts',
              admin: { width: '33%' },
            },
            {
              name: 'application',
              label: 'Pendaftaran PMB',
              type: 'relationship',
              relationTo: 'pmb-applications',
              admin: { width: '33%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'utmSource', label: 'UTM source', type: 'text', admin: { width: '34%' } },
            { name: 'utmMedium', label: 'UTM medium', type: 'text', admin: { width: '33%' } },
            { name: 'utmCampaign', label: 'UTM campaign', type: 'text', admin: { width: '33%' } },
          ],
        },
      ],
    },
    {
      name: 'notes',
      label: 'Catatan',
      type: 'array',
      fields: [
        { name: 'note', label: 'Catatan', type: 'textarea', required: true },
        {
          type: 'row',
          fields: [
            {
              name: 'author',
              label: 'Oleh',
              type: 'relationship',
              relationTo: 'admins',
              admin: { readOnly: true, width: '50%' },
            },
            {
              name: 'createdAt',
              label: 'Waktu',
              type: 'date',
              admin: { readOnly: true, width: '50%', date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
      ],
    },
    {
      name: 'consentAt',
      label: 'Persetujuan data (UU PDP)',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'deletionRequested',
      label: 'Ada permintaan hapus data',
      type: 'checkbox',
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Setelah diproses, hapus lead ini lalu kosongkan tempat sampah.',
      },
    },
    {
      name: 'lastActivityAt',
      label: 'Aktivitas terakhir',
      type: 'date',
      index: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'phoneNormalized',
      type: 'text',
      index: true,
      access: { read: fieldAllow('leads', 'ekspor'), create: serverOwned, update: serverOwned },
      admin: { hidden: true },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        const now = new Date().toISOString()
        if (data.phone) {
          data.phoneNormalized = normalizePhone(data.phone) ?? data.phoneNormalized
          data.phoneMasked = maskPhone(data.phone)
        }
        if (data.email) data.email = normalizeEmail(data.email) ?? data.email
        if (Array.isArray(data.notes)) {
          data.notes = data.notes.map((note: Record<string, unknown>) => ({
            ...note,
            author: note.author ?? (req.user?.collection === 'admins' ? req.user.id : null),
            createdAt: note.createdAt ?? now,
          }))
        }
        data.lastActivityAt = now
        return data
      },
    ],
    afterChange: [auditAfterChange],
    afterDelete: [auditAfterDelete],
  },
}

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Pesan masuk', plural: 'Inbox pesan' },
  admin: {
    group: 'Penerimaan',
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'topic', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email', 'message'],
    description:
      'Pesan dari formulir kontak dan permintaan konsultasi. Ubah status menjadi Dibaca atau Dibalas.',
  },
  access: {
    read: staffRead('leads'),
    create: () => false,
    update: write('leads', 'ubah'),
    delete: write('leads', 'hapus'),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          label: 'Jenis',
          type: 'select',
          defaultValue: 'pesan',
          admin: { width: '33%' },
          options: [
            { label: 'Pesan', value: 'pesan' },
            { label: 'Konsultasi', value: 'konsultasi' },
          ],
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          defaultValue: 'baru',
          index: true,
          admin: { width: '33%' },
          options: [
            { label: 'Baru (belum dibaca)', value: 'baru' },
            { label: 'Dibaca', value: 'dibaca' },
            { label: 'Dibalas', value: 'dibalas' },
            { label: 'Arsip', value: 'arsip' },
          ],
        },
        {
          name: 'topic',
          label: 'Topik',
          type: 'select',
          options: [...CONTACT_TOPICS],
          admin: { width: '34%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nama', type: 'text', required: true, admin: { width: '34%' } },
        { name: 'email', label: 'Email', type: 'email', admin: { width: '33%' } },
        { name: 'phone', label: 'WhatsApp', type: 'text', admin: { width: '33%' } },
      ],
    },
    { name: 'message', label: 'Pesan', type: 'textarea' },
    {
      type: 'row',
      fields: [
        {
          name: 'preferredDate',
          label: 'Tanggal konsultasi',
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayOnly' },
            condition: (data) => data?.kind === 'konsultasi',
          },
        },
        {
          name: 'timeSlot',
          label: 'Slot waktu',
          type: 'select',
          options: [...TIME_SLOTS],
          admin: { width: '50%', condition: (data) => data?.kind === 'konsultasi' },
        },
      ],
    },
    {
      name: 'replyAction',
      type: 'ui',
      admin: { components: { Field: '/components/admin/ReplyByEmailButton#ReplyByEmailButton' } },
    },
    { name: 'internalNote', label: 'Catatan internal', type: 'textarea' },
    {
      name: 'lead',
      label: 'Lead',
      type: 'relationship',
      relationTo: 'leads',
      admin: { position: 'sidebar' },
    },
    { name: 'repliedAt', label: 'Dibalas pada', type: 'date', admin: { position: 'sidebar' } },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data.status === 'dibalas' && originalDoc?.status !== 'dibalas' && !data.repliedAt)
          data.repliedAt = new Date().toISOString()
        return data
      },
    ],
    afterChange: [auditAfterChange],
    afterDelete: [auditAfterDelete],
  },
}
