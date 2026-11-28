import type { CollectionConfig } from 'payload'
import { allow, isLoggedIn, write } from '@/access'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Tag media', plural: 'Tag media' },
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
  tags: true,
  fields: [
    {
      name: 'name',
      label: 'Nama',
      type: 'text',
      required: true,
    },
  ],
}
