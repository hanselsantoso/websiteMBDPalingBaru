import type { Block, Field } from 'payload'
import { blockSettings, iconField, mascotPoseField, placeholderNote } from '@/fields'
import { sectionEditor } from '@/fields/richText'

const eyebrow = (defaultValue?: string): Field => ({
  name: 'eyebrow',
  label: 'Eyebrow (label mono kecil)',
  type: 'text',
  defaultValue,
})

const heading = (required = false): Field => ({ name: 'heading', label: 'Judul bagian', type: 'text', required })
const intro: Field = { name: 'intro', label: 'Pengantar', type: 'textarea' }

const block = (slug: string, interfaceName: string, label: string, fields: Field[]): Block => ({
  slug,
  interfaceName,
  labels: { singular: label, plural: label },
  fields: [...blockSettings(), ...fields],
})

export const HeroBlock = block('hero', 'HeroBlock', 'Hero dengan kata berputar', [
  eyebrow('S1 MANAJEMEN BISNIS DIGITAL · ISTTS SURABAYA'),
  { name: 'headlinePrefix', label: 'Awal judul', type: 'text', required: true, defaultValue: 'Jadi strategis bisnis di era' },
  {
    name: 'rotatingWords',
    label: 'Kata berputar',
    type: 'array',
    minRows: 1,
    maxRows: 8,
    labels: { singular: 'Kata', plural: 'Kata' },
    fields: [{ name: 'word', label: 'Kata', type: 'text', required: true }],
    admin: { description: 'Urutan kata dapat diatur dengan seret dan lepas. Bawaan: AI, Data, E-Commerce, Fintech.' },
  },
  { name: 'subheadline', label: 'Subjudul', type: 'textarea' },
  {
    type: 'row',
    fields: [
      { name: 'primaryLabel', label: 'Label tombol utama', type: 'text', admin: { width: '50%', description: 'Kosongkan untuk memakai label dari Menu dan CTA.' } },
      mascotPoseField('mascotPose', 'Pose Pivot', { defaultValue: 'greeting' }),
    ],
  },
  {
    type: 'row',
    fields: [
      { name: 'quizLabel', label: 'Label tautan kuis', type: 'text', defaultValue: 'Cari jurusan yang cocok', admin: { width: '33%' } },
      { name: 'whatsappLabel', label: 'Label tautan WhatsApp', type: 'text', defaultValue: 'Chat via WhatsApp', admin: { width: '33%' } },
      { name: 'brochureLabel', label: 'Label tautan brosur', type: 'text', defaultValue: 'Unduh brosur', admin: { width: '33%' } },
    ],
  },
  {
    name: 'orbitChips',
    label: 'Chip yang mengorbit',
    type: 'array',
    maxRows: 6,
    fields: [{ name: 'label', label: 'Label', type: 'text', required: true }],
  },
  {
    type: 'row',
    fields: [
      { name: 'showPartnerStrip', label: 'Tampilkan strip akreditasi dan mitra', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      { name: 'partnerStripLabel', label: 'Label strip', type: 'text', defaultValue: 'Akreditasi dan mitra', admin: { width: '50%' } },
    ],
  },
])

export const PageHeaderBlock = block('pageHeader', 'PageHeaderBlock', 'Kepala halaman', [
  eyebrow(),
  { name: 'title', label: 'Judul', type: 'text', required: true },
  { name: 'highlight', label: 'Kata yang disorot', type: 'text', admin: { description: 'Bagian dari judul yang diberi stiker lime.' } },
  intro,
  {
    type: 'row',
    fields: [
      { name: 'chip', label: 'Chip', type: 'text', admin: { width: '50%', description: 'Contoh: Kurikulum 2024' } },
      mascotPoseField(),
    ],
  },
  {
    name: 'actions',
    label: 'Tombol',
    type: 'array',
    maxRows: 3,
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'label', label: 'Label', type: 'text', required: true, admin: { width: '40%' } },
          {
            name: 'kind',
            label: 'Aksi',
            type: 'select',
            defaultValue: 'link',
            admin: { width: '30%' },
            options: [
              { label: 'Tautan', value: 'link' },
              { label: 'Daftar Sekarang', value: 'primaryCta' },
              { label: 'WhatsApp', value: 'whatsapp' },
              { label: 'Kuis jurusan', value: 'quiz' },
              { label: 'Unduh brosur', value: 'brochure' },
              { label: 'Unduh kurikulum (PDF)', value: 'curriculumPdf' },
            ],
          },
          { name: 'href', label: 'Tautan', type: 'text', admin: { width: '30%', condition: (_, s) => s?.kind === 'link' } },
        ],
      },
    ],
  },
])

export const StatsBlock = block('stats', 'StatsBlock', 'Statistik', [
  eyebrow(),
  heading(),
  {
    name: 'items',
    label: 'Angka',
    type: 'array',
    maxRows: 6,
    admin: { description: `Isi angka asli saja. Entri bernilai [ISI] tidak ditampilkan saat penanda disembunyikan. ${placeholderNote}` },
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'value', label: 'Angka', type: 'text', required: true, admin: { width: '25%' } },
          { name: 'suffix', label: 'Akhiran', type: 'text', admin: { width: '20%', description: 'Mis. +, %, semester' } },
          { name: 'label', label: 'Label', type: 'text', required: true, admin: { width: '55%' } },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'source',
            label: 'Sumber angka',
            type: 'select',
            defaultValue: 'manual',
            admin: { width: '40%' },
            options: [
              { label: 'Diisi manual', value: 'manual' },
              { label: 'Hitung: jumlah mata kuliah', value: 'totalCourses' },
              { label: 'Hitung: total SKS (ikut pengaturan)', value: 'totalCredits' },
            ],
          },
          { name: 'note', label: 'Catatan sumber data', type: 'text', admin: { width: '60%' } },
        ],
      },
    ],
  },
])

export const WhyMbdBlock = block('whyMbd', 'WhyMbdBlock', 'Kenapa MBD (bento)', [
  eyebrow(),
  heading(true),
  intro,
  {
    name: 'cards',
    label: 'Kartu',
    type: 'array',
    maxRows: 8,
    fields: [
      { name: 'title', label: 'Judul', type: 'text', required: true },
      { name: 'body', label: 'Isi (dua baris)', type: 'textarea' },
      {
        type: 'row',
        fields: [
          iconField(),
          { name: 'courseCodes', label: 'Kode mata kuliah terkait', type: 'text', admin: { width: '40%', description: 'Pisahkan dengan koma, mis. BD103, BD204' } },
          {
            name: 'size',
            label: 'Ukuran',
            type: 'select',
            defaultValue: 'normal',
            options: [
              { label: 'Normal', value: 'normal' },
              { label: 'Besar (dengan sirip)', value: 'large' },
            ],
          },
        ],
      },
    ],
  },
])

export const CurriculumTrackBlock = block('curriculumTrack', 'CurriculumTrackBlock', 'Jalur kurikulum horizontal', [
  eyebrow('KURIKULUM 8 SEMESTER'),
  heading(true),
  intro,
  {
    type: 'row',
    fields: [
      { name: 'finalCardTitle', label: 'Judul kartu terakhir', type: 'text', defaultValue: 'Lihat kurikulum lengkap', admin: { width: '50%' } },
      { name: 'finalCardBody', label: 'Isi kartu terakhir', type: 'text', admin: { width: '50%' } },
    ],
  },
])

export const CurriculumExplorerBlock = block('curriculumExplorer', 'CurriculumExplorerBlock', 'Kurikulum lengkap (tabel dan filter)', [
  heading(),
  intro,
  {
    type: 'row',
    fields: [
      { name: 'showSearch', label: 'Tampilkan pencarian dan filter', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      { name: 'showPathMap', label: 'Tampilkan Peta jalur', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
    ],
  },
])

export const FacultyHighlightBlock = block('facultyHighlight', 'FacultyHighlightBlock', 'Dosen pilihan', [
  eyebrow(),
  heading(true),
  intro,
  {
    type: 'row',
    fields: [
      { name: 'limit', label: 'Jumlah dosen', type: 'number', defaultValue: 4, min: 1, max: 8, admin: { width: '50%' } },
      { name: 'linkLabel', label: 'Label tautan', type: 'text', defaultValue: 'Kenal semua dosen', admin: { width: '50%' } },
    ],
  },
])

export const FacultyDirectoryBlock = block('facultyDirectory', 'FacultyDirectoryBlock', 'Direktori dosen', [
  heading(),
  intro,
])

export const TestimonialsBlock = block('testimonials', 'TestimonialsBlock', 'Testimoni', [
  eyebrow(),
  heading(true),
  { name: 'limit', label: 'Jumlah testimoni', type: 'number', defaultValue: 3, min: 1, max: 9 },
])

export const LatestPostsBlock = block('latestPosts', 'LatestPostsBlock', 'Berita terbaru', [
  eyebrow(),
  heading(true),
  {
    type: 'row',
    fields: [
      { name: 'limit', label: 'Jumlah artikel', type: 'number', defaultValue: 3, min: 1, max: 6, admin: { width: '50%' } },
      { name: 'linkLabel', label: 'Label tautan', type: 'text', defaultValue: 'Semua artikel', admin: { width: '50%' } },
    ],
  },
])

export const BlogIndexBlock = block('blogIndex', 'BlogIndexBlock', 'Indeks blog', [
  heading(),
  { name: 'pageSize', label: 'Artikel per muatan', type: 'number', defaultValue: 9, min: 3, max: 24 },
])

export const CtaBandBlock = block('ctaBand', 'CtaBandBlock', 'CTA band', [
  {
    name: 'variant',
    label: 'Varian',
    type: 'select',
    defaultValue: 'full',
    options: [
      { label: 'Penuh (dengan maskot)', value: 'full' },
      { label: 'Strip ringkas', value: 'strip' },
    ],
  },
  eyebrow(),
  heading(true),
  { name: 'body', label: 'Isi', type: 'textarea' },
  {
    type: 'row',
    fields: [
      mascotPoseField('mascotPose', 'Pose Pivot', { defaultValue: 'pointing' }),
      { name: 'showSecondary', label: 'Tampilkan aksi sekunder', type: 'checkbox', defaultValue: true },
      { name: 'showDeadline', label: 'Tampilkan chip tenggat gelombang', type: 'checkbox', defaultValue: true },
    ],
  },
  { name: 'deadlineLabel', label: 'Label chip tenggat', type: 'text', defaultValue: 'Batas akhir pendaftaran' },
])

export const RichTextBlock = block('richText', 'RichTextBlock', 'Teks kaya', [
  eyebrow(),
  heading(),
  { name: 'content', label: 'Isi', type: 'richText', editor: sectionEditor },
  {
    name: 'width',
    label: 'Lebar',
    type: 'select',
    defaultValue: 'narrow',
    options: [
      { label: 'Sempit (nyaman dibaca)', value: 'narrow' },
      { label: 'Lebar', value: 'wide' },
    ],
  },
])

export const ImageTextBlock = block('imageText', 'ImageTextBlock', 'Gambar dan teks', [
  eyebrow(),
  heading(true),
  { name: 'body', label: 'Isi', type: 'richText', editor: sectionEditor },
  { name: 'image', label: 'Gambar', type: 'upload', relationTo: 'media', admin: { description: 'Kosongkan untuk menampilkan Pivot.' } },
  {
    type: 'row',
    fields: [
      mascotPoseField('mascotPose', 'Pose Pivot (bila tanpa gambar)', { defaultValue: 'tablet' }),
      {
        name: 'imagePosition',
        label: 'Posisi visual',
        type: 'select',
        defaultValue: 'right',
        options: [
          { label: 'Kanan', value: 'right' },
          { label: 'Kiri', value: 'left' },
        ],
      },
    ],
  },
  {
    type: 'row',
    fields: [
      { name: 'linkLabel', label: 'Label tautan', type: 'text', admin: { width: '50%' } },
      { name: 'linkHref', label: 'Tautan', type: 'text', admin: { width: '50%' } },
    ],
  },
])

export const FaqBlock = block('faq', 'FaqBlock', 'FAQ', [
  eyebrow('FAQ'),
  heading(true),
  {
    type: 'row',
    fields: [
      {
        name: 'scope',
        label: 'Kelompok FAQ',
        type: 'select',
        defaultValue: 'umum',
        admin: { width: '50%' },
        options: [
          { label: 'Umum', value: 'umum' },
          { label: 'PMB', value: 'pmb' },
          { label: 'Kontak', value: 'kontak' },
          { label: 'Kurikulum', value: 'kurikulum' },
          { label: 'Kuis', value: 'kuis' },
        ],
      },
      { name: 'limit', label: 'Jumlah maksimal', type: 'number', defaultValue: 8, admin: { width: '50%' } },
    ],
  },
])

export const TimelineBlock = block('timeline', 'TimelineBlock', 'Timeline', [
  eyebrow(),
  heading(true),
  intro,
  {
    name: 'items',
    label: 'Butir',
    type: 'array',
    fields: [
      { name: 'label', label: 'Label waktu', type: 'text' },
      { name: 'title', label: 'Judul', type: 'text', required: true },
      { name: 'body', label: 'Isi', type: 'textarea' },
    ],
  },
])

export const CardGridBlock = block('cardGrid', 'CardGridBlock', 'Grid kartu', [
  eyebrow(),
  heading(true),
  intro,
  {
    type: 'row',
    fields: [
      {
        name: 'columns',
        label: 'Kolom (desktop)',
        type: 'select',
        defaultValue: '3',
        options: [
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
        ],
      },
      {
        name: 'style',
        label: 'Gaya',
        type: 'select',
        defaultValue: 'sticker',
        options: [
          { label: 'Stiker (garis tebal)', value: 'sticker' },
          { label: 'Bernomor (langkah)', value: 'numbered' },
          { label: 'Polos', value: 'plain' },
        ],
      },
      mascotPoseField(),
    ],
  },
  {
    name: 'cards',
    label: 'Kartu',
    type: 'array',
    fields: [
      { name: 'title', label: 'Judul', type: 'text', required: true },
      { name: 'body', label: 'Isi', type: 'textarea' },
      {
        type: 'row',
        fields: [
          iconField(),
          { name: 'tag', label: 'Tag mono', type: 'text' },
          { name: 'linkHref', label: 'Tautan', type: 'text' },
        ],
      },
    ],
  },
])

export const VideoBlock = block('video', 'VideoBlock', 'Video', [
  heading(),
  { name: 'url', label: 'URL YouTube atau Vimeo', type: 'text', required: true },
  { name: 'caption', label: 'Keterangan', type: 'text' },
])

export const MarqueeBlock = block('marquee', 'MarqueeBlock', 'Marquee (kata atau logo mitra)', [
  {
    type: 'row',
    fields: [
      {
        name: 'source',
        label: 'Isi marquee',
        type: 'select',
        defaultValue: 'words',
        options: [
          { label: 'Kata', value: 'words' },
          { label: 'Logo mitra industri', value: 'partners' },
        ],
      },
      {
        name: 'tone',
        label: 'Warna',
        type: 'select',
        defaultValue: 'navy',
        options: [
          { label: 'Navy', value: 'navy' },
          { label: 'Biru', value: 'blue' },
          { label: 'Terang', value: 'light' },
        ],
      },
    ],
  },
  { name: 'label', label: 'Label (opsional)', type: 'text' },
  {
    name: 'words',
    label: 'Kata',
    type: 'array',
    fields: [{ name: 'text', label: 'Kata', type: 'text', required: true }],
    admin: { condition: (_, s) => s?.source !== 'partners' },
  },
])

export const FormEmbedBlock = block('formEmbed', 'FormEmbedBlock', 'Embed formulir', [
  {
    name: 'form',
    label: 'Formulir',
    type: 'select',
    required: true,
    defaultValue: 'kontak',
    options: [
      { label: 'Kontak', value: 'kontak' },
      { label: 'Jadwalkan konsultasi', value: 'konsultasi' },
      { label: 'Unduh brosur', value: 'brosur' },
      { label: 'Pra-pendaftaran PMB', value: 'pmb' },
      { label: 'Cek status pendaftaran', value: 'statusPmb' },
    ],
  },
  eyebrow(),
  heading(),
  intro,
  mascotPoseField(),
])

export const ProgramsBlock = block('programs', 'ProgramsBlock', 'Program unggulan', [eyebrow(), heading(true), intro])

export const CareerPathsBlock = block('careerPaths', 'CareerPathsBlock', 'Prospek karier', [
  eyebrow(),
  heading(true),
  intro,
  { name: 'showRoadmap', label: 'Tampilkan peta jalan semester → skill → peran', type: 'checkbox', defaultValue: true },
])

export const JobBoardBlock = block('jobBoard', 'JobBoardBlock', 'Lowongan dan magang', [
  eyebrow(),
  heading(true),
  intro,
  { name: 'emptyText', label: 'Teks saat kosong', type: 'text', defaultValue: 'Belum ada lowongan aktif. Cek lagi minggu depan, ya.' },
])

export const PmbInfoBlock = block('pmbInfo', 'PmbInfoBlock', 'Info PMB', [
  {
    name: 'section',
    label: 'Bagian',
    type: 'select',
    required: true,
    defaultValue: 'tracks',
    options: [
      { label: 'Jalur pendaftaran', value: 'tracks' },
      { label: 'Gelombang (timeline)', value: 'waves' },
      { label: 'Persyaratan', value: 'requirements' },
      { label: 'Biaya kuliah', value: 'fees' },
      { label: 'Langkah pendaftaran', value: 'stepper' },
    ],
  },
  eyebrow(),
  heading(true),
  intro,
])

export const QuizBlock = block('quiz', 'QuizBlock', 'Kuis kecocokan jurusan', [
  { name: 'introTitle', label: 'Judul pembuka', type: 'text', defaultValue: 'Kamu cocok jadi strategis yang mana?' },
  { name: 'introBody', label: 'Teks pembuka', type: 'textarea' },
  { name: 'disclaimer', label: 'Disclaimer', type: 'textarea', defaultValue: 'Kuis ini panduan, bukan tes seleksi masuk.' },
  {
    name: 'bands',
    label: 'Pita kecocokan',
    type: 'array',
    admin: { description: 'Persentase minimal untuk setiap label kecocokan.' },
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'min', label: 'Minimal (%)', type: 'number', required: true, min: 0, max: 100, admin: { width: '25%' } },
          { name: 'label', label: 'Label', type: 'text', required: true, admin: { width: '75%' } },
        ],
      },
      { name: 'description', label: 'Penjelasan', type: 'textarea' },
    ],
  },
  { name: 'leadCapture', label: 'Tawarkan kirim hasil dan brosur via WhatsApp', type: 'checkbox', defaultValue: true },
  { name: 'leadHeading', label: 'Judul penawaran', type: 'text', defaultValue: 'Mau hasil ini dikirim ke WhatsApp-mu?' },
])

export const ContactInfoBlock = block('contactInfo', 'ContactInfoBlock', 'Info kontak dan peta', [
  eyebrow(),
  heading(true),
  intro,
  {
    type: 'row',
    fields: [
      { name: 'showMap', label: 'Tampilkan peta', type: 'checkbox', defaultValue: true },
      { name: 'showHours', label: 'Tampilkan jam layanan', type: 'checkbox', defaultValue: true },
      { name: 'showSocials', label: 'Tampilkan media sosial', type: 'checkbox', defaultValue: true },
    ],
  },
])

export const NotFoundHeroBlock = block('notFoundHero', 'NotFoundHeroBlock', 'Hero 404', [
  { name: 'label', label: 'Label mono', type: 'text', defaultValue: 'RUTE TIDAK DITEMUKAN' },
  { name: 'line', label: 'Kalimat utama', type: 'text', defaultValue: 'Waduh, halaman ini tidak ada di peta strategiku.' },
  { name: 'searchPlaceholder', label: 'Placeholder pencarian', type: 'text', defaultValue: 'Cari mata kuliah, dosen, atau artikel' },
  {
    name: 'quickLinks',
    label: 'Tautan cepat',
    type: 'array',
    maxRows: 6,
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'label', label: 'Label', type: 'text', required: true },
          { name: 'href', label: 'Tautan', type: 'text', required: true },
        ],
      },
    ],
  },
  { name: 'buttonLabel', label: 'Label tombol', type: 'text', defaultValue: 'Kembali ke Beranda' },
])

export const pageBlocks: Block[] = [
  HeroBlock,
  PageHeaderBlock,
  StatsBlock,
  WhyMbdBlock,
  CurriculumTrackBlock,
  CurriculumExplorerBlock,
  FacultyHighlightBlock,
  FacultyDirectoryBlock,
  TestimonialsBlock,
  LatestPostsBlock,
  BlogIndexBlock,
  CtaBandBlock,
  RichTextBlock,
  ImageTextBlock,
  FaqBlock,
  TimelineBlock,
  CardGridBlock,
  VideoBlock,
  MarqueeBlock,
  FormEmbedBlock,
  ProgramsBlock,
  CareerPathsBlock,
  JobBoardBlock,
  PmbInfoBlock,
  QuizBlock,
  ContactInfoBlock,
  NotFoundHeroBlock,
]
