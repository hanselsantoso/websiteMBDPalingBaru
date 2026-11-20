import type { CollectionConfig } from 'payload'
import { isLoggedIn, write } from '@/access'

export const Folders: CollectionConfig = {
  slug: 'folders',
  labels: { singular: 'Folder media', plural: 'Folder media' },
  admin: {
    group: 'Konten',
    useAsTitle: 'name',
  },
  access: {
    read: isLoggedIn,
    create: write('media', 'buat'),
    update: write('media', 'ubah'),
    delete: write('media', 'hapus'),
  },
  folders: true,
  fields: [
    {
      name: 'name',
      label: 'Nama',
      type: 'text',
      required: true,
    },
  ],
}
