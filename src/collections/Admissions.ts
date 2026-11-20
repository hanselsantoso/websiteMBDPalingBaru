import type { CollectionConfig, PayloadRequest } from 'payload'
import { publicOr, serverOwned, staffRead, write } from '@/access'
import { sortOrderField } from '@/fields'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'
import { revalidateHooks } from '@/hooks/revalidate'
import { normalizeEmail, normalizePhone } from '@/lib/domain/phone'
import { jakartaYear, nextRegNumber } from '@/lib/domain/reg-number'
import { APPLICATION_STATUSES, TEMPLATE_VARIABLES } from '@/lib/domain/templates'
import { sendStatusMessage } from '@/server/services/messages'

const pmbPublicHooks = (tag: string) => {
  const revalidation = revalidateHooks(() => [tag, 'pmb'])
  return {
    afterChange: [...revalidation.afterChange, auditAfterChange],
    afterDelete: [...revalidation.afterDelete, auditAfterDelete],
  }
}

const pmbWrites = {
  create: write('pmb', 'buat'),
  update: write('pmb', 'ubah'),
  delete: write('pmb', 'hapus'),
}

export const PmbWaves: CollectionConfig = {
  slug: 'pmb-waves',
  labels: { singular: 'Gelombang PMB', plural: 'Gelombang PMB' },
  admin: {
    group: 'Penerimaan',
    useAsTitle: 'name',
    defaultColumns: ['name', 'openDate', 'closeDate', 'status', 'quota'],
    description: 'Gelombang berstatus "Dibuka" dengan tanggal tutup terdekat tampil sebagai chip tenggat di situs.',
  },
  access: { read: publicOr('pmb', { publicWhere: true }), ...pmbWrites },
  fields: [
    { name: 'name', label: 'Nama gelombang', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'openDate', label: 'Tanggal buka', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
        { name: 'closeDate', label: 'Tanggal tutup', type: 'date', index: true, admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'quota', label: 'Kuota', type: 'number', min: 0, admin: { width: '33%' } },
        { name: 'fee', label: 'Biaya pendaftaran', type: 'text', admin: { width: '33%', description: 'Mis. Rp300.000 atau [ISI]' } },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          defaultValue: 'akan-datang',
          index: true,
          admin: { width: '34%' },
          options: [
            { label: 'Akan datang', value: 'akan-datang' },
            { label: 'Dibuka', value: 'dibuka' },
            { label: 'Ditutup', value: 'ditutup' },
          ],
        },
      ],
    },
    { name: 'note', label: 'Catatan', type: 'textarea' },
    sortOrderField,
  ],
  hooks: pmbPublicHooks('pmb-waves'),
}

export const PmbTracks: CollectionConfig = {
  slug: 'pmb-tracks',
  labels: { singular: 'Jalur PMB', plural: 'Jalur PMB' },
  admin: { group: 'Penerimaan', useAsTitle: 'name', defaultColumns: ['name', 'isActive', 'sortOrder'] },
  access: { read: publicOr('pmb', { publicWhere: { isActive: { equals: true } } }), ...pmbWrites },
  fields: [
    { name: 'name', label: 'Nama jalur', type: 'text', required: true },
    { name: 'description', label: 'Deskripsi', type: 'textarea' },
    { name: 'highlights', label: 'Poin utama', type: 'array', fields: [{ name: 'text', label: 'Poin', type: 'text', required: true }] },
    { name: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true, index: true, admin: { position: 'sidebar' } },
    sortOrderField,
  ],
  hooks: pmbPublicHooks('pmb-tracks'),
}

async function generateRegNumber(req: PayloadRequest): Promise<string> {
  const year = jakartaYear()
  const latest = await req.payload.find({
    collection: 'pmb-applications',
    where: { regNumber: { like: `MBD-${year}-` } },
    sort: '-regNumber',
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })
  return nextRegNumber(
    year,
    latest.docs.map((doc) => String((doc as { regNumber?: string }).regNumber ?? '')),
  )
}

const statusOptions = APPLICATION_STATUSES.map((s) => ({ label: s.label, value: s.value }))

export const PmbApplications: CollectionConfig = {
  slug: 'pmb-applications',
  labels: { singular: 'Pendaftar', plural: 'Pendaftar' },
  admin: {
    group: 'Penerimaan',
    useAsTitle: 'fullName',
    defaultColumns: ['regNumber', 'fullName', 'wave', 'track', 'status', 'assignedTo', 'createdAt'],
    listSearchableFields: ['fullName', 'email', 'phone', 'regNumber'],
    description: 'Ubah status untuk mencatat riwayat dan mengirim template pesan. Data pendaftar bersifat pribadi.',
  },
  access: {
    read: staffRead('pmb'),
    create: () => false,
    update: write('pmb', 'ubah'),
    delete: write('pmb', 'hapus'),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'regNumber',
          label: 'Nomor pendaftaran',
          type: 'text',
          unique: true,
          index: true,
          access: { create: serverOwned, update: serverOwned },
          admin: { width: '40%', readOnly: true },
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          defaultValue: 'baru',
          index: true,
          options: statusOptions,
          admin: { width: '30%' },
        },
        { name: 'assignedTo', label: 'Ditangani oleh', type: 'relationship', relationTo: 'admins', index: true, admin: { width: '30%' } },
      ],
    },
    {
      name: 'statusNote',
      label: 'Catatan perubahan status',
      type: 'text',
      virtual: true,
      admin: { description: 'Opsional. Tersimpan di riwayat bila status berubah.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Data pendaftar',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'fullName', label: 'Nama lengkap', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'email', label: 'Email', type: 'email', required: true, index: true, admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'phone', label: 'WhatsApp', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'city', label: 'Kota', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'schoolName', label: 'Sekolah asal', type: 'text', admin: { width: '40%' } },
                { name: 'schoolMajor', label: 'Jurusan', type: 'text', admin: { width: '30%' } },
                { name: 'graduationYear', label: 'Tahun lulus', type: 'number', admin: { width: '30%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'wave', label: 'Gelombang', type: 'relationship', relationTo: 'pmb-waves', index: true, admin: { width: '34%' } },
                { name: 'track', label: 'Jalur', type: 'relationship', relationTo: 'pmb-tracks', index: true, admin: { width: '33%' } },
                { name: 'source', label: 'Tahu MBD dari', type: 'text', admin: { width: '33%' } },
              ],
            },
            {
              name: 'documents',
              label: 'Dokumen',
              type: 'join',
              collection: 'pmb-documents',
              on: 'application',
            },
          ],
        },
        {
          label: 'Catatan internal',
          fields: [
            {
              name: 'notes',
              label: 'Catatan',
              type: 'array',
              fields: [
                { name: 'text', label: 'Catatan', type: 'textarea', required: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'author', label: 'Oleh', type: 'relationship', relationTo: 'admins', admin: { readOnly: true, width: '50%' } },
                    { name: 'createdAt', label: 'Waktu', type: 'date', admin: { readOnly: true, width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Riwayat status',
          fields: [
            {
              name: 'statusHistory',
              label: 'Riwayat',
              type: 'array',
              access: { create: serverOwned, update: serverOwned },
              admin: { readOnly: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'fromStatus', label: 'Dari', type: 'select', options: statusOptions, admin: { width: '25%' } },
                    { name: 'toStatus', label: 'Ke', type: 'select', options: statusOptions, admin: { width: '25%' } },
                    { name: 'changedBy', label: 'Oleh', type: 'relationship', relationTo: 'admins', admin: { width: '25%' } },
                    { name: 'changedAt', label: 'Waktu', type: 'date', admin: { width: '25%', date: { pickerAppearance: 'dayAndTime' } } },
                  ],
                },
                { name: 'note', label: 'Catatan', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'lead',
      label: 'Lead terkait',
      type: 'relationship',
      relationTo: 'leads',
      admin: { position: 'sidebar' },
    },
    {
      name: 'possibleDuplicate',
      label: 'Kemungkinan duplikat',
      type: 'checkbox',
      index: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'duplicateOf',
      label: 'Mirip dengan',
      type: 'relationship',
      relationTo: 'pmb-applications',
      admin: { position: 'sidebar', readOnly: true, condition: (data) => Boolean(data?.possibleDuplicate) },
    },
    {
      name: 'phoneNormalized',
      type: 'text',
      index: true,
      admin: { hidden: true },
      access: { create: serverOwned, update: serverOwned },
    },
    {
      name: 'consentAt',
      label: 'Persetujuan data',
      type: 'date',
      access: { create: serverOwned, update: serverOwned },
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'utm', label: 'UTM', type: 'json', admin: { position: 'sidebar', readOnly: true } },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        const now = new Date().toISOString()
        if (data.email) data.email = normalizeEmail(data.email) ?? data.email
        if (data.phone) data.phoneNormalized = normalizePhone(data.phone) ?? data.phoneNormalized

        if (operation === 'create') {
          if (!data.regNumber) data.regNumber = await generateRegNumber(req)
          data.statusHistory = [{ fromStatus: null, toStatus: data.status ?? 'baru', note: 'Pendaftaran diterima', changedAt: now }]
          const duplicate = await req.payload.find({
            collection: 'pmb-applications',
            where: {
              or: [
                ...(data.email ? [{ email: { equals: data.email } }] : []),
                ...(data.phoneNormalized ? [{ phoneNormalized: { equals: data.phoneNormalized } }] : []),
              ],
            },
            limit: 1,
            depth: 0,
            overrideAccess: true,
            req,
          })
          if (duplicate.docs[0]) {
            data.possibleDuplicate = true
            data.duplicateOf = duplicate.docs[0].id
          }
        } else if (originalDoc && data.status && data.status !== originalDoc.status) {
          data.statusHistory = [
            ...((originalDoc.statusHistory as unknown[]) ?? []),
            {
              fromStatus: originalDoc.status,
              toStatus: data.status,
              note: typeof data.statusNote === 'string' ? data.statusNote : '',
              changedBy: req.user?.collection === 'admins' ? req.user.id : null,
              changedAt: now,
            },
          ]
        }

        if (Array.isArray(data.notes)) {
          data.notes = data.notes.map((note: Record<string, unknown>) => ({
            ...note,
            author: note.author ?? (req.user?.collection === 'admins' ? req.user.id : null),
            createdAt: note.createdAt ?? now,
          }))
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (operation === 'update' && previousDoc?.status !== doc.status) {
          await sendStatusMessage(req, doc)
          if (doc.lead && doc.status === 'daftar-ulang') {
            try {
              await req.payload.update({
                collection: 'leads',
                id: typeof doc.lead === 'object' ? doc.lead.id : doc.lead,
                data: { status: 'daftar' },
                overrideAccess: true,
                req,
              })
            } catch {
              // Lead may have been deleted.
            }
          }
        }
        return doc
      },
      auditAfterChange,
    ],
    afterDelete: [auditAfterDelete],
  },
}

export const PmbDocuments: CollectionConfig = {
  slug: 'pmb-documents',
  labels: { singular: 'Dokumen pendaftar', plural: 'Dokumen pendaftar' },
  admin: {
    group: 'Penerimaan',
    useAsTitle: 'label',
    defaultColumns: ['label', 'type', 'application', 'createdAt'],
    description: 'Berkas pribadi pendaftar. Hanya staf PMB yang dapat membuka.',
  },
  access: {
    read: staffRead('pmb'),
    create: write('pmb', 'buat'),
    update: write('pmb', 'ubah'),
    delete: write('pmb', 'hapus'),
  },
  upload: {
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'private, no-store')
      return headers
    },
  },
  fields: [
    { name: 'label', label: 'Nama dokumen', type: 'text' },
    {
      name: 'type',
      label: 'Jenis',
      type: 'select',
      defaultValue: 'lainnya',
      options: [
        { label: 'Rapor', value: 'rapor' },
        { label: 'Ijazah / SKL', value: 'ijazah' },
        { label: 'Kartu identitas', value: 'identitas' },
        { label: 'Pas foto', value: 'foto' },
        { label: 'Sertifikat prestasi', value: 'prestasi' },
        { label: 'Lainnya', value: 'lainnya' },
      ],
    },
    { name: 'application', label: 'Pendaftar', type: 'relationship', relationTo: 'pmb-applications', index: true },
  ],
  hooks: { afterChange: [auditAfterChange], afterDelete: [auditAfterDelete] },
}

export const MessageTemplates: CollectionConfig = {
  slug: 'message-templates',
  labels: { singular: 'Template pesan', plural: 'Template pesan' },
  admin: {
    group: 'Penerimaan',
    useAsTitle: 'name',
    defaultColumns: ['name', 'channel', 'statusKey', 'isActive'],
    description: `Variabel tersedia: ${TEMPLATE_VARIABLES.map((v) => `{{${v}}}`).join(', ')}.`,
  },
  access: { read: staffRead('pmb'), ...pmbWrites },
  fields: [
    { name: 'name', label: 'Nama template', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'channel',
          label: 'Kanal',
          type: 'select',
          defaultValue: 'email',
          admin: { width: '50%' },
          options: [
            { label: 'Email', value: 'email' },
            { label: 'WhatsApp', value: 'whatsapp' },
          ],
        },
        {
          name: 'statusKey',
          label: 'Dikirim saat status',
          type: 'select',
          required: true,
          admin: { width: '50%' },
          options: statusOptions,
        },
      ],
    },
    { name: 'subject', label: 'Subjek email', type: 'text', admin: { condition: (_, s) => s?.channel === 'email' } },
    { name: 'body', label: 'Isi pesan', type: 'textarea', required: true },
    { name: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    {
      name: 'testSend',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '/components/admin/TemplateTestButton#TemplateTestButton' } },
    },
  ],
  hooks: { afterChange: [auditAfterChange], afterDelete: [auditAfterDelete] },
}
