import type { Access, CollectionConfig } from 'payload'
import { getPermissions } from '@/access'
import { MCP_CONTENT_ACCOUNTS } from '@/lib/domain/mcp-content'

const manageAccounts: Access = async ({ req }) =>
  (await getPermissions(req))?.isSuperAdmin === true

export const McpContentAccounts: CollectionConfig = {
  slug: MCP_CONTENT_ACCOUNTS,
  labels: { singular: 'Akun MCP Konten', plural: 'Akun MCP Konten' },
  admin: {
    group: 'Sistem',
    useAsTitle: 'name',
    defaultColumns: ['name', 'mode', 'active', 'updatedAt'],
    description: 'Buat satu akun dan API key terpisah untuk setiap konektor konten.',
  },
  versions: false,
  auth: {
    disableLocalStrategy: true,
    useAPIKey: { reveal: true },
    useSessions: false,
  },
  access: {
    admin: () => false,
    create: manageAccounts,
    read: manageAccounts,
    update: manageAccounts,
    delete: manageAccounts,
  },
  fields: [
    { name: 'name', label: 'Nama konektor', type: 'text', required: true },
    {
      name: 'mode',
      label: 'Izin',
      type: 'select',
      defaultValue: 'reader',
      required: true,
      options: [
        { label: 'Pembaca', value: 'reader' },
        { label: 'Editor konten', value: 'editor' },
      ],
    },
    { name: 'active', label: 'Aktif', type: 'checkbox', defaultValue: true },
  ],
}
