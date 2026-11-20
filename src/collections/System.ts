import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { anyone, isLoggedIn, serverOwned, staffRead, write } from '@/access'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'
import { revalidate } from '@/hooks/revalidate'
import { normalizeMatrix } from '@/lib/domain/permissions'
import { normalizePath } from '@/lib/links'
import { TRACKED_EVENTS } from '@/lib/schemas'

export const Roles: CollectionConfig = {
  slug: 'roles',
  labels: { singular: 'Peran', plural: 'Peran' },
  admin: {
    group: 'Sistem',
    useAsTitle: 'name',
    defaultColumns: ['name', 'key', 'isSystem', 'updatedAt'],
    description:
      'Atur izin per modul: Lihat, Buat, Ubah, Hapus, Terbitkan, Ekspor. Super Admin selalu memiliki akses penuh.',
  },
  access: {
    read: isLoggedIn,
    create: write('pengguna', 'buat'),
    update: write('pengguna', 'ubah'),
    delete: write('pengguna', 'hapus'),
  },
  fields: [
    { name: 'name', label: 'Nama peran', type: 'text', required: true },
    {
      name: 'key',
      label: 'Kunci',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      access: { update: ({ doc }) => !doc?.isSystem },
      admin: { description: 'Huruf kecil dan tanda hubung, mis. staf-humas.' },
    },
    { name: 'description', label: 'Deskripsi', type: 'textarea' },
    {
      name: 'isSystem',
      label: 'Peran bawaan (terkunci)',
      type: 'checkbox',
      defaultValue: false,
      access: { create: serverOwned, update: serverOwned },
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'permissions',
      label: 'Matriks izin',
      type: 'json',
      admin: {
        components: { Field: '/components/admin/PermissionMatrixField#PermissionMatrixField' },
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data) {
          if (typeof data.key === 'string')
            data.key = data.key
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9-]+/g, '-')
          if ('permissions' in data) data.permissions = normalizeMatrix(data.permissions)
        }
        return data
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const role = await req.payload.findByID({
          collection: 'roles',
          id,
          depth: 0,
          overrideAccess: true,
          req,
        })
        if (role?.isSystem) throw new APIError('Peran bawaan tidak dapat dihapus.', 400)
        const inUse = await req.payload.count({
          collection: 'admins',
          where: { role: { equals: id } },
          overrideAccess: true,
          req,
        })
        if (inUse.totalDocs > 0)
          throw new APIError(
            'Peran ini masih dipakai pengguna. Pindahkan pengguna ke peran lain dulu.',
            400,
          )
      },
    ],
    afterChange: [auditAfterChange],
    afterDelete: [auditAfterDelete],
  },
}

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: { singular: 'Redirect', plural: 'Redirect' },
  admin: {
    group: 'Sistem',
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'statusCode', 'updatedAt'],
    description: 'Arahkan URL lama ke URL baru. 301 untuk permanen, 302 untuk sementara.',
  },
  access: {
    read: anyone,
    create: write('pengaturan', 'buat'),
    update: write('pengaturan', 'ubah'),
    delete: write('pengaturan', 'hapus'),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'from',
          label: 'Dari',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { width: '40%', description: 'Contoh: /prodi-lama' },
        },
        {
          name: 'to',
          label: 'Ke',
          type: 'text',
          required: true,
          admin: { width: '40%', description: 'Rute (/pmb) atau URL lengkap' },
        },
        {
          name: 'statusCode',
          label: 'Kode',
          type: 'select',
          defaultValue: '301',
          admin: { width: '20%' },
          options: [
            { label: '301 permanen', value: '301' },
            { label: '302 sementara', value: '302' },
          ],
        },
      ],
    },
    { name: 'note', label: 'Catatan', type: 'text' },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (typeof data?.from === 'string') data.from = normalizePath(data.from)
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        await revalidate(req, ['redirects'], [doc.from, previousDoc?.from])
        return doc
      },
      auditAfterChange,
    ],
    afterDelete: [
      async ({ doc, req }) => {
        await revalidate(req, ['redirects'], [doc?.from])
        return doc
      },
      auditAfterDelete,
    ],
  },
}

export const NotFoundLogs: CollectionConfig = {
  slug: 'not-found-logs',
  labels: { singular: 'Log 404', plural: 'Log 404' },
  admin: {
    group: 'Sistem',
    useAsTitle: 'path',
    defaultColumns: ['path', 'hits', 'lastSeenAt', 'resolved'],
    description:
      'URL yang tidak ditemukan pengunjung. Isi "Arahkan ke" lalu simpan untuk langsung membuat redirect 301.',
  },
  access: {
    read: staffRead('pengaturan'),
    create: () => false,
    update: write('pengaturan', 'ubah'),
    delete: write('pengaturan', 'hapus'),
  },
  fields: [
    {
      name: 'path',
      label: 'URL',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'hits',
          label: 'Jumlah kunjungan',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true, width: '33%' },
        },
        {
          name: 'lastSeenAt',
          label: 'Terakhir terlihat',
          type: 'date',
          index: true,
          admin: { readOnly: true, width: '33%', date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'referrer',
          label: 'Perujuk terakhir',
          type: 'text',
          admin: { readOnly: true, width: '34%' },
        },
      ],
    },
    {
      name: 'redirectTo',
      label: 'Arahkan ke',
      type: 'text',
      admin: { description: 'Rute tujuan, mis. /kurikulum.' },
    },
    {
      name: 'resolved',
      label: 'Sudah dibuatkan redirect',
      type: 'checkbox',
      index: true,
      admin: { readOnly: true },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, context }) => {
        if (context.skipNotFoundRedirect || !doc.redirectTo || doc.resolved) return doc
        const existing = await req.payload.find({
          collection: 'redirects',
          where: { from: { equals: doc.path } },
          limit: 1,
          overrideAccess: true,
          req,
        })
        if (!existing.docs.length) {
          await req.payload.create({
            collection: 'redirects',
            data: {
              from: doc.path,
              to: doc.redirectTo,
              statusCode: '301',
              note: 'Dibuat dari log 404',
            },
            overrideAccess: true,
            req,
          })
        }
        await req.payload.update({
          collection: 'not-found-logs',
          id: doc.id,
          data: { resolved: true },
          overrideAccess: true,
          context: { skipNotFoundRedirect: true },
          req,
        })
        return { ...doc, resolved: true }
      },
    ],
  },
}

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  labels: { singular: 'Audit log', plural: 'Audit log' },
  admin: {
    group: 'Sistem',
    useAsTitle: 'entityTitle',
    defaultColumns: ['createdAt', 'user', 'action', 'entityType', 'entityTitle'],
    listSearchableFields: ['entityTitle', 'entityType', 'action'],
    description:
      'Catatan permanen setiap perubahan, penerbitan, penghapusan, dan login. Tidak dapat diubah.',
  },
  access: {
    read: staffRead('audit'),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'user', label: 'Pengguna', type: 'relationship', relationTo: 'admins', index: true },
    {
      name: 'action',
      label: 'Aksi',
      type: 'select',
      index: true,
      options: [
        { label: 'Buat', value: 'create' },
        { label: 'Ubah', value: 'update' },
        { label: 'Hapus', value: 'delete' },
        { label: 'Terbitkan', value: 'publish' },
        { label: 'Batal terbit', value: 'unpublish' },
        { label: 'Login', value: 'login' },
      ],
    },
    { name: 'entityType', label: 'Modul', type: 'text', index: true },
    { name: 'entityId', label: 'ID data', type: 'text', index: true },
    { name: 'entityTitle', label: 'Data', type: 'text' },
    { name: 'changes', label: 'Perubahan (sebelum → sesudah)', type: 'json' },
    { name: 'ip', label: 'IP', type: 'text' },
  ],
}

export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics-events',
  labels: { singular: 'Peristiwa analitik', plural: 'Peristiwa analitik' },
  admin: {
    group: 'Sistem',
    useAsTitle: 'name',
    defaultColumns: ['name', 'path', 'createdAt'],
    description: 'Peristiwa untuk dashboard dan corong pendaftaran. Tidak menyimpan data pribadi.',
  },
  access: {
    read: staffRead('dashboard'),
    create: () => false,
    update: () => false,
    delete: write('pengaturan', 'hapus'),
  },
  fields: [
    {
      name: 'name',
      label: 'Peristiwa',
      type: 'select',
      required: true,
      index: true,
      options: TRACKED_EVENTS.map((e) => ({ label: e, value: e })),
    },
    { name: 'path', label: 'Halaman', type: 'text', index: true },
    { name: 'sessionId', label: 'Sesi', type: 'text', index: true },
    { name: 'referrer', label: 'Perujuk', type: 'text' },
    { name: 'props', label: 'Data', type: 'json' },
    { name: 'lead', label: 'Lead', type: 'relationship', relationTo: 'leads' },
  ],
}
