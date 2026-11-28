import type { CollectionConfig } from 'payload'
import { allow, isLoggedIn, write } from '@/access'

export const Folders: CollectionConfig = {
  slug: 'folders',
  labels: { singular: 'Folder media', plural: 'Folder media' },
  admin: {
    group: 'Konten',
    useAsTitle: 'name',
  },
  access: {
    read: (args) => isLoggedIn(args) || allow('media', 'lihat')(args),
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
