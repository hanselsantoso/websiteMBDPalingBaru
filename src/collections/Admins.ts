import type { CollectionConfig, PayloadRequest } from 'payload'
import { APIError } from 'payload'
import { getPermissions, isLoggedIn } from '@/access'
import { auditAfterChange, auditAfterDelete, auditEvent } from '@/hooks/audit'
import { can } from '@/lib/domain/permissions'

async function roleKey(req: PayloadRequest, id: unknown): Promise<string | null> {
  if (!id) return null
  const roleId = typeof id === 'object' ? (id as { id: string }).id : id
  try {
    const role = await req.payload.findByID({ collection: 'roles', id: roleId as string, depth: 0, overrideAccess: true, req })
    return (role as { key?: string }).key ?? null
  } catch {
    return null
  }
}

export const Admins: CollectionConfig = {
  slug: 'admins',
  labels: { singular: 'Pengguna', plural: 'Pengguna' },
  access: {
    create: () => false,
    read: isLoggedIn,
    update: async ({ req }) => {
      if (!req.user || req.user.collection !== 'admins') return false
      if (can(await getPermissions(req), 'pengguna', 'ubah')) return true
      return { id: { equals: req.user.id } }
    },
    delete: async ({ req }) => can(await getPermissions(req), 'pengguna', 'hapus'),
  },
  admin: {
    group: 'Sistem',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'status', 'updatedAt'],
    description: 'Akun admin masuk melalui Figma. Atur peran dan status di sini.',
  },
  auth: true,
  fields: [
    // Email added by default
    { name: 'name', label: 'Nama', type: 'text' },
    { name: 'role', label: 'Peran', type: 'relationship', relationTo: 'roles', index: true, admin: { position: 'sidebar' } },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'aktif',
      options: [
        { label: 'Aktif', value: 'aktif' },
        { label: 'Nonaktif (tanpa akses)', value: 'nonaktif' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        if (operation === 'create' && !data.role) {
          const roles = await req.payload.find({
            collection: 'roles',
            where: { key: { in: ['super-admin', 'editor'] } },
            depth: 0,
            limit: 2,
            overrideAccess: true,
            req,
          })
          const superRole = roles.docs.find((r) => (r as { key?: string }).key === 'super-admin')
          const editorRole = roles.docs.find((r) => (r as { key?: string }).key === 'editor')
          if (superRole) {
            const supers = await req.payload.count({ collection: 'admins', where: { role: { equals: superRole.id } }, overrideAccess: true, req })
            data.role = supers.totalDocs === 0 ? superRole.id : editorRole?.id
          }
          return data
        }

        if (operation === 'update' && req.user?.collection === 'admins') {
          const permissions = await getPermissions(req)
          if (permissions?.isSuperAdmin) return data
          const roleChanged = 'role' in data && JSON.stringify(data.role) !== JSON.stringify(originalDoc?.role)
          const statusChanged = 'status' in data && data.status !== originalDoc?.status
          if (!roleChanged && !statusChanged) return data
          if (String(originalDoc?.id) === String(req.user.id)) {
            throw new APIError('Kamu tidak dapat mengubah peran atau status akunmu sendiri.', 403)
          }
          if (!can(permissions, 'pengguna', 'ubah')) throw new APIError('Kamu tidak memiliki izin mengubah peran.', 403)
          const [currentKey, nextKey] = await Promise.all([roleKey(req, originalDoc?.role), roleKey(req, data.role)])
          if (currentKey === 'super-admin' || nextKey === 'super-admin') {
            throw new APIError('Hanya Super Admin yang dapat mengubah atau memberikan peran Super Admin.', 403)
          }
        }
        return data
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const permissions = await getPermissions(req)
        if (permissions?.isSuperAdmin) return
        const target = await req.payload.findByID({ collection: 'admins', id, depth: 0, overrideAccess: true, req })
        if ((await roleKey(req, (target as { role?: unknown }).role)) === 'super-admin') {
          throw new APIError('Hanya Super Admin yang dapat menghapus akun Super Admin.', 403)
        }
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        await auditEvent(req, 'login', 'admins', (user as { email?: string }).email)
      },
    ],
    afterChange: [auditAfterChange],
    afterDelete: [auditAfterDelete],
  },
  versions: false,
}
