import type { GlobalConfig } from 'payload'
import { APIError } from 'payload'
import { anyone, superAdminField, write } from '@/access'
import { linkFields, MASCOT_POSES } from '@/fields'
import { auditGlobalChange } from '@/hooks/audit'
import { revalidateGlobal } from '@/hooks/revalidate'
import { evaluateBrandContrast, HEX_PATTERN, resolveBrandColors } from '@/lib/brand/tokens'

const hexField = (name: string, label: string, defaultValue: string) => ({
  name,
  label,
  type: 'text' as const,
  defaultValue,
  validate: (value: unknown) =>
    typeof value === 'string' && HEX_PATTERN.test(value.trim()) ? true : 'Gunakan format HEX 6 digit, mis. #1A6BFF.',
  admin: { width: '25%' },
})

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Pengaturan situs',
  admin: { group: 'Sistem' },
  access: { read: anyone, update: write('pengaturan', 'ubah') },
  versions: { max: 20 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Umum',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'siteName', label: 'Nama situs', type: 'text', defaultValue: 'Arus Digital', admin: { width: '50%' } },
                { name: 'programName', label: 'Nama program', type: 'text', defaultValue: 'S1 Manajemen Bisnis Digital', admin: { width: '50%' } },
              ],
            },
            { name: 'institutionName', label: 'Nama institusi', type: 'text', defaultValue: 'Institut Sains dan Teknologi Terpadu Surabaya (ISTTS)' },
            { name: 'tagline', label: 'Tagline', type: 'text' },
            { name: 'shortDescription', label: 'Deskripsi singkat (footer)', type: 'textarea' },
          ],
        },
        {
          label: 'Kontak',
          fields: [
            { name: 'address', label: 'Alamat', type: 'textarea' },
            {
              type: 'row',
              fields: [
                { name: 'phone', label: 'Telepon', type: 'text', admin: { width: '33%' } },
                { name: 'email', label: 'Email', type: 'text', admin: { width: '33%' } },
                { name: 'serviceHours', label: 'Jam layanan', type: 'text', admin: { width: '34%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'mapLat', label: 'Lintang (latitude)', type: 'number', admin: { width: '50%', step: 0.000001 } },
                { name: 'mapLng', label: 'Bujur (longitude)', type: 'number', admin: { width: '50%', step: 0.000001 } },
              ],
            },
            {
              name: 'socials',
              label: 'Media sosial',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      label: 'Platform',
                      type: 'select',
                      required: true,
                      admin: { width: '35%' },
                      options: [
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'TikTok', value: 'tiktok' },
                        { label: 'YouTube', value: 'youtube' },
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'X (Twitter)', value: 'x' },
                        { label: 'Facebook', value: 'facebook' },
                      ],
                    },
                    { name: 'url', label: 'URL', type: 'text', required: true, admin: { width: '65%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Akreditasi',
          fields: [
            { name: 'accreditationText', label: 'Status akreditasi', type: 'text', defaultValue: '[ISI: status akreditasi]' },
            { name: 'accreditationBadge', label: 'Logo / badge akreditasi', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Fitur',
          fields: [
            {
              name: 'features',
              label: 'Fitur dan sakelar',
              type: 'group',
              fields: [
                { name: 'showTotalSks', label: 'Tampilkan total SKS program di situs', type: 'checkbox', defaultValue: false, admin: { description: 'Biarkan mati sampai total SKS dikonfirmasi program studi.' } },
                { name: 'externalRegistrationUrl', label: 'URL pendaftaran eksternal', type: 'text', admin: { description: 'Bila diisi, "Daftar Sekarang" mengarah ke sini. Formulir /pmb tetap menjadi pra-pendaftaran.' } },
                { name: 'showPlaceholders', label: 'Tampilkan penanda [ISI] di situs publik', type: 'checkbox', defaultValue: true, admin: { description: 'Nyalakan selama persiapan agar tim melihat data yang belum diisi. Matikan sebelum peluncuran.' } },
                { name: 'defaultReducedMotion', label: 'Kurangi animasi secara bawaan', type: 'checkbox', defaultValue: false },
                { name: 'maintenanceMode', label: 'Mode perawatan', type: 'checkbox', defaultValue: false, admin: { description: 'Situs publik menampilkan pesan perawatan. Admin tetap dapat masuk.' } },
              ],
            },
          ],
        },
        {
          label: 'Integrasi',
          fields: [
            {
              name: 'integrations',
              label: 'Integrasi (khusus Super Admin)',
              type: 'group',
              access: { update: superAdminField },
              admin: {
                description:
                  'ID publik saja. Kunci rahasia (SMTP, rahasia Turnstile, token WhatsApp API) disimpan sebagai environment variable, bukan di sini.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'ga4Id', label: 'Google Analytics 4 ID', type: 'text', admin: { width: '50%', placeholder: 'G-XXXXXXX' } },
                    { name: 'metaPixelId', label: 'Meta Pixel ID', type: 'text', admin: { width: '50%' } },
                  ],
                },
                { name: 'turnstileSiteKey', label: 'Cloudflare Turnstile site key', type: 'text' },
                { name: 'customHeadScripts', label: 'Skrip kustom di <head>', type: 'code', admin: { language: 'html' } },
                { name: 'customBodyScripts', label: 'Skrip kustom di akhir <body>', type: 'code', admin: { language: 'html' } },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'titleTemplate', label: 'Templat judul', type: 'text', defaultValue: '%s · MBD ISTTS', admin: { description: '%s diganti judul halaman.' } },
            { name: 'defaultDescription', label: 'Deskripsi bawaan', type: 'textarea' },
            { name: 'defaultOgImage', label: 'Gambar Open Graph bawaan', type: 'upload', relationTo: 'media' },
            { name: 'robotsTxt', label: 'robots.txt', type: 'code', admin: { language: 'plaintext', description: 'Kosongkan untuk memakai aturan bawaan. Baris Sitemap ditambahkan otomatis.' } },
          ],
        },
        {
          label: 'Legal',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'privacyPage', label: 'Halaman kebijakan privasi', type: 'relationship', relationTo: 'pages', admin: { width: '50%' } },
                { name: 'termsPage', label: 'Halaman syarat dan ketentuan', type: 'relationship', relationTo: 'pages', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Unggahan',
          fields: [
            {
              name: 'uploadLimits',
              label: 'Batas ukuran unggahan (MB)',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'image', label: 'Gambar', type: 'number', defaultValue: 8, admin: { width: '25%' } },
                    { name: 'pdf', label: 'PDF', type: 'number', defaultValue: 20, admin: { width: '25%' } },
                    { name: 'video', label: 'Video', type: 'number', defaultValue: 60, admin: { width: '25%' } },
                    { name: 'model', label: 'Model 3D (GLB)', type: 'number', defaultValue: 3, admin: { width: '25%' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: { afterChange: [revalidateGlobal('global:site-settings'), auditGlobalChange] },
}

const poseGroup = (pose: { label: string; value: string }) => ({
  name: pose.value,
  label: pose.label,
  type: 'group' as const,
  fields: [
    {
      type: 'row' as const,
      fields: [
        { name: 'image', label: 'Gambar 1x (1024 px, latar transparan)', type: 'upload' as const, relationTo: 'media' as const, admin: { width: '50%' } },
        { name: 'image2x', label: 'Gambar 2x (2048 px)', type: 'upload' as const, relationTo: 'media' as const, admin: { width: '50%' } },
      ],
    },
    { name: 'alt', label: 'Teks alternatif', type: 'text' as const },
  ],
})

export const Branding: GlobalConfig = {
  slug: 'branding',
  label: 'Branding',
  admin: { group: 'Tampilan' },
  access: { read: anyone, update: write('branding', 'ubah') },
  versions: { max: 20 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Logo',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'wordmarkLight', label: 'Wordmark untuk latar terang', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
                { name: 'wordmarkDark', label: 'Wordmark untuk latar gelap', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'symbol', label: 'Simbol', type: 'upload', relationTo: 'media', admin: { width: '33%' } },
                { name: 'favicon', label: 'Favicon', type: 'upload', relationTo: 'media', admin: { width: '33%' } },
                { name: 'ogDefault', label: 'Gambar Open Graph bawaan', type: 'upload', relationTo: 'media', admin: { width: '34%' } },
              ],
            },
          ],
        },
        {
          label: 'Warna',
          fields: [
            {
              name: 'colors',
              label: 'Token warna',
              type: 'group',
              admin: { description: 'Lime hanya untuk latar gelap (navy atau biru). Neutral (ink) diturunkan otomatis dari navy.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    hexField('blue', 'Blue (aksi utama)', '#1A6BFF'),
                    hexField('navy', 'Navy (latar gelap, teks)', '#071A3D'),
                    hexField('lime', 'Lime (sorotan di latar gelap)', '#C6F432'),
                    hexField('cyan', 'Cyan (aksen, gelombang)', '#2EE6F6'),
                  ],
                },
              ],
            },
            {
              name: 'contrastChecker',
              type: 'ui',
              admin: { components: { Field: '/components/admin/ContrastChecker#ContrastChecker' } },
            },
          ],
        },
        {
          label: 'Maskot',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'mascotName', label: 'Nama maskot', type: 'text', defaultValue: 'Siasat', admin: { width: '33%' } },
                { name: 'mascotNickname', label: 'Panggilan', type: 'text', defaultValue: 'Sia', admin: { width: '33%' } },
                { name: 'mascotTagline', label: 'Tagline', type: 'text', defaultValue: 'Si Strategis', admin: { width: '34%' } },
              ],
            },
            { name: 'mascotBio', label: 'Bio singkat', type: 'textarea' },
            {
              name: 'mascotPreview',
              type: 'ui',
              admin: { components: { Field: '/components/admin/MascotPreview#MascotPreview' } },
            },
            {
              name: 'mascotSettings',
              label: 'Perilaku',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'eyeFollow', label: 'Mata mengikuti kursor (desktop)', type: 'checkbox', defaultValue: true },
                    { name: 'tapToTalk', label: 'Ketuk untuk bicara', type: 'checkbox', defaultValue: true },
                    { name: 'idleAnimation', label: 'Animasi diam (idle)', type: 'checkbox', defaultValue: true },
                  ],
                },
              ],
            },
            {
              name: 'poses',
              label: 'Pose (kosong = fox placeholder SVG)',
              type: 'group',
              admin: { description: 'Unggah PNG/WebP transparan. Pose yang kosong otomatis memakai placeholder vektor dengan animasi berlapis.' },
              fields: MASCOT_POSES.map((pose) => poseGroup(pose)),
            },
            { name: 'glbModel', label: 'Model 3D GLB (opsional, hanya hero desktop)', type: 'upload', relationTo: 'media' },
            {
              name: 'lines',
              label: 'Kalimat Siasat',
              type: 'array',
              labels: { singular: 'Kalimat', plural: 'Kalimat' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'pose', label: 'Pose', type: 'select', required: true, options: [...MASCOT_POSES], admin: { width: '30%' } },
                    { name: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true, admin: { width: '20%' } },
                  ],
                },
                { name: 'text', label: 'Kalimat', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Pola',
          fields: [
            {
              name: 'patterns',
              label: 'Pola dekoratif',
              type: 'group',
              fields: (['wave', 'fin', 'star'] as const).map((key) => ({
                type: 'row' as const,
                fields: [
                  {
                    name: `${key}Enabled`,
                    label: { wave: 'Gelombang', fin: 'Sirip hiu', star: 'Bintang empat sudut' }[key],
                    type: 'checkbox' as const,
                    defaultValue: true,
                    admin: { width: '40%' },
                  },
                  {
                    name: `${key}Intensity`,
                    label: 'Intensitas (0–100)',
                    type: 'number' as const,
                    defaultValue: 70,
                    min: 0,
                    max: 100,
                    admin: { width: '60%' },
                  },
                ],
              })),
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        const failures = evaluateBrandContrast(resolveBrandColors(data?.colors)).filter((r) => !r.pass)
        if (failures.length) {
          throw new APIError(
            `Warna belum memenuhi kontras WCAG AA: ${failures
              .map((f) => `${f.usage} (${f.ratio}:1, minimal ${f.min}:1)`)
              .join('; ')}. Sesuaikan warna atau pilih “Pulihkan warna bawaan”.`,
            400,
          )
        }
        return data
      },
    ],
    afterChange: [revalidateGlobal('global:branding'), auditGlobalChange],
  },
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menu dan CTA',
  admin: { group: 'Tampilan' },
  access: { read: anyone, update: write('menu', 'ubah') },
  versions: { max: 20 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Menu header',
          fields: [
            {
              name: 'header',
              label: 'Item menu',
              type: 'array',
              maxRows: 12,
              labels: { singular: 'Item', plural: 'Item' },
              admin: { description: 'Seret untuk mengurutkan. Maksimal dua tingkat (item dan sub-item).' },
              fields: [
                ...linkFields(),
                {
                  name: 'children',
                  label: 'Sub-item',
                  type: 'array',
                  maxRows: 8,
                  admin: { initCollapsed: true },
                  fields: linkFields(),
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerColumns',
              label: 'Kolom footer',
              type: 'array',
              maxRows: 4,
              fields: [
                { name: 'title', label: 'Judul kolom', type: 'text', required: true },
                { name: 'links', label: 'Tautan', type: 'array', fields: linkFields() },
              ],
            },
          ],
        },
        {
          label: 'CTA',
          fields: [
            {
              name: 'cta',
              label: 'Ajakan bertindak',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'primaryLabel', label: 'Label tombol utama', type: 'text', defaultValue: 'Daftar Sekarang', admin: { width: '50%' } },
                    { name: 'primaryPath', label: 'Tujuan tombol utama', type: 'text', defaultValue: '/pmb', admin: { width: '50%', description: 'Diabaikan bila URL pendaftaran eksternal diisi di Pengaturan.' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'whatsappNumber', label: 'Nomor WhatsApp', type: 'text', defaultValue: '[ISI]', admin: { width: '40%', description: 'Format 62812xxxx atau 0812xxxx.' } },
                    { name: 'whatsappLabel', label: 'Label WhatsApp', type: 'text', defaultValue: 'Chat via WhatsApp', admin: { width: '60%' } },
                  ],
                },
                { name: 'whatsappMessage', label: 'Pesan WhatsApp otomatis', type: 'textarea' },
                {
                  type: 'row',
                  fields: [
                    { name: 'quizLabel', label: 'Label tombol kuis', type: 'text', defaultValue: 'Cari Jurusan yang Cocok', admin: { width: '50%' } },
                    { name: 'brochureLabel', label: 'Label tombol brosur', type: 'text', defaultValue: 'Unduh Brosur', admin: { width: '50%' } },
                  ],
                },
                { name: 'brochureFile', label: 'File brosur (PDF dari Media)', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Bar seluler',
          fields: [
            {
              name: 'mobileBar',
              label: 'Bar lengket seluler',
              type: 'group',
              admin: { description: 'Tampil di bawah layar ponsel setelah pengunjung menggulir melewati 40% hero.' },
              fields: [
                { name: 'enabled', label: 'Aktifkan', type: 'checkbox', defaultValue: true },
                {
                  name: 'items',
                  label: 'Tombol (urutan sesuai daftar)',
                  type: 'array',
                  maxRows: 4,
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'kind',
                          label: 'Tombol',
                          type: 'select',
                          required: true,
                          admin: { width: '35%' },
                          options: [
                            { label: 'Daftar Sekarang (lebar)', value: 'daftar' },
                            { label: 'WhatsApp (ikon)', value: 'whatsapp' },
                            { label: 'Kuis (ikon)', value: 'kuis' },
                            { label: 'Brosur (ikon)', value: 'brosur' },
                          ],
                        },
                        { name: 'label', label: 'Label', type: 'text', admin: { width: '45%' } },
                        { name: 'isVisible', label: 'Tampil', type: 'checkbox', defaultValue: true, admin: { width: '20%' } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: { afterChange: [revalidateGlobal('global:navigation'), auditGlobalChange] },
}

export const PmbSettings: GlobalConfig = {
  slug: 'pmb-settings',
  label: 'Pengaturan PMB',
  admin: { group: 'Penerimaan' },
  access: { read: anyone, update: write('pmb', 'ubah') },
  versions: { max: 20 },
  fields: [
    { name: 'academicYear', label: 'Tahun akademik', type: 'text', defaultValue: '[ISI: tahun akademik]' },
    {
      name: 'requirements',
      label: 'Persyaratan',
      type: 'array',
      fields: [{ name: 'text', label: 'Persyaratan', type: 'text', required: true }],
    },
    {
      name: 'fees',
      label: 'Tabel biaya',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'item', label: 'Komponen', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'amount', label: 'Nominal', type: 'text', admin: { width: '25%' } },
            { name: 'note', label: 'Keterangan', type: 'text', admin: { width: '35%' } },
          ],
        },
      ],
    },
    { name: 'feesNote', label: 'Catatan biaya', type: 'textarea' },
    {
      name: 'steps',
      label: 'Langkah pendaftaran',
      type: 'array',
      maxRows: 8,
      fields: [
        { name: 'title', label: 'Judul', type: 'text', required: true },
        { name: 'description', label: 'Penjelasan', type: 'textarea' },
      ],
    },
    {
      name: 'sourceOptions',
      label: 'Pilihan "tahu MBD dari"',
      type: 'array',
      fields: [{ name: 'label', label: 'Pilihan', type: 'text', required: true }],
    },
    {
      type: 'row',
      fields: [
        { name: 'documentUploadEnabled', label: 'Izinkan unggah dokumen di formulir', type: 'checkbox', defaultValue: false, admin: { width: '50%' } },
        { name: 'maxDocumentMb', label: 'Ukuran maksimal per dokumen (MB)', type: 'number', defaultValue: 2, admin: { width: '50%' } },
      ],
    },
    { name: 'successTitle', label: 'Judul layar sukses', type: 'text', defaultValue: 'Yeay! Langkah pertamamu sudah tercatat.' },
    { name: 'successBody', label: 'Isi layar sukses', type: 'textarea' },
    { name: 'statusIntro', label: 'Pengantar cek status', type: 'textarea' },
  ],
  hooks: { afterChange: [revalidateGlobal('global:pmb-settings', 'pmb'), auditGlobalChange] },
}
