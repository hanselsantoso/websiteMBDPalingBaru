# Konektor MCP untuk konten MBD

Konektor memakai Payload CMS yang sama dengan panel admin. URL server MCP adalah `https://DOMAIN-ANDA/api/mcp` dengan transport **Streamable HTTP**. Klien lokal dapat memakai `http://localhost:3000/api/mcp`.

## Siapkan akun integrasi

1. Jalankan migrasi Payload pada database target dengan `pnpm payload migrate` menggunakan konfigurasi deployment yang sudah disiapkan.
2. Masuk sebagai **Super Admin** dan buka **Sistem → Akun MCP Konten**. Buat satu akun per klien. Pilih **Pembaca** untuk riset dan inventaris konten, atau **Editor konten** untuk membuat dan memperbarui konten.
3. Simpan akun baru, lalu gunakan kontrol API key Payload untuk membuat kunci. Simpan kuncinya di pengelola rahasia klien. Nonaktifkan akun untuk segera mencabut akses. Rotasi kunci dari panel admin jika diperlukan.

Tambahkan header berikut pada setiap request MCP. Ganti `<API_KEY>` dengan kunci akun integrasi.

```http
Authorization: mcp-content-accounts API-Key <API_KEY>
```

## Hubungkan Cowork atau klien MCP lain

Di Claude Cowork, buka **Customize → Connectors**, lalu tambahkan custom connector jarak jauh. Masukkan URL HTTPS di atas. Pilih **No sign-in** untuk metode masuk dan tambahkan header `Authorization` melalui opsi **Request headers**. Cowork terhubung dari infrastruktur Anthropic, sehingga endpoint perlu dapat dijangkau publik melalui HTTPS di port 443. [Panduan konektor kustom Anthropic](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)

Untuk klien lain, pilih **Streamable HTTP**, isi URL server, dan masukkan header yang sama di penyimpanan rahasia klien. Format file konfigurasi berbeda antar klien. Pastikan proxy HTTPS meneruskan header `Authorization` ke Payload. Endpoint menangani request POST.

## Cakupan konten

| Kebutuhan | Slug |
| --- | --- |
| Mata kuliah, silabus, kurikulum, dan dosen | `courses`, `curriculum-versions`, `faculty` |
| Halaman, tampilan merek, dan navigasi | `pages`, `branding`, `navigation` |
| Padanan teks untuk situs berbahasa Inggris | `content-translations` |
| Artikel, kategori, dan tag Event/Prestasi | `posts`, `post-categories`, `post-tags` |
| Gambar, dokumen publik, folder, dan tag media | `media`, `folders`, `tags` |
| Program, karier, lowongan, mitra, testimoni, dan FAQ | `programs`, `career-paths`, `job-posts`, `partners`, `testimonials`, `faqs` |
| Jalur, gelombang, jadwal, persyaratan, biaya, dan langkah PMB | `pmb-tracks`, `pmb-waves`, `pmb-settings` |
| Beasiswa dan narasi PMB | Dokumen `pages` dengan slug `pmb`, termasuk bagian `beasiswa` |
| Materi kuis jurusan | `quiz-questions`, `quiz-results` |

Akun integrasi hanya mengakses konten di atas. Berkas dan data pendaftar, pesan kontak, akun admin, peran, log operasional, dan pengaturan sistem tersedia sesuai izin di panel CMS.

## Gunakan tool

- **Mulai dengan** `getConfigInfo`, lalu baca konten sesuai slug. Akun Editor memakai `getCollectionSchema` atau `getGlobalSchema` untuk memeriksa field sebelum menulis.
- **Baca dan cari** dengan `findDocuments` atau `countDocuments`. Gunakan `where`, `sort`, `limit`, `page`, dan `depth` sesuai skema tool. Untuk data pengaturan tunggal, gunakan `findGlobal`.
- **Isi koleksi** dengan `createDocuments` atau `updateDocument`. Perbarui satu dokumen dengan ID asli dari hasil pencarian. Pada batch pembuatan, periksa `errors` dan coba ulang hanya entri yang gagal.
- **Isi pengaturan tunggal** dengan `updateGlobal` dan kirim hanya field yang dimaksud. Jika mengubah daftar seperti `fees` atau `requirements`, baca daftar lengkap terlebih dahulu, lalu kirim daftar hasil penggabungan agar baris lainnya tetap tersimpan.
- **Unggah gambar kecil** dengan `createDocuments` pada `media`. Sediakan `data.alt` dan `file` berisi `source: "base64"`, `name`, `mimeType`, dan `data` berupa base64 tanpa awalan data URL. Gunakan ID Media hasil unggahan untuk sampul dan gambar di rich text. Batas body MCP bawaan adalah 4 MiB termasuk encoding dan JSON. Gunakan panel CMS untuk file yang lebih besar.

Artikel, halaman, dan profil dosen disimpan dengan `draft: true` dan diterbitkan oleh editor berwenang di CMS. Pengaturan tunggal dan koleksi master tanpa draf diperbarui langsung berdasarkan aturan CMS. Aktivasi versi kurikulum dan kebijakan unggah dokumen pendaftar diatur lewat panel CMS. Minta persetujuan atas nilai final ketika mengubah jadwal, biaya, atau konten master lain yang tampil publik. Untuk artikel dan halaman, editor CMS dapat membuka draf, memeriksa gambar dan isi, kemudian menerbitkannya.

### Perbarui terjemahan Inggris

1. Panggil `getConfigInfo`, lalu `getCollectionSchema` dengan `slug: "content-translations"`. Cari dokumen sumber di koleksi yang sesuai, misalnya `posts`, dan salin teks Indonesia secara persis dari field yang akan ditampilkan.
2. Panggil `findDocuments` pada `content-translations` dengan filter `where: { "source": { "equals": "<TEKS_INDONESIA>" } }`. Simpan satu padanan per teks sumber. Jika entri ada, catat ID-nya.
3. Setelah padanan diperiksa, panggil `createDocuments` dengan `documents: [{ "data": { "source": "<TEKS_INDONESIA>", "english": "<TEKS_INGGRIS>" } }]`, atau panggil `updateDocument` dengan ID entri yang ada. `sourceKey` diisi oleh server. Penulisan terjemahan memerlukan akun **Editor konten** dan penghapusan dilakukan di panel CMS berdasarkan izin peran.
4. Baca ulang entri dan buka halaman `/en` yang terkait untuk memastikan padanannya muncul. Jika sumber berubah atau belum memiliki padanan, pengunjung tetap melihat sumber Indonesia untuk bagian itu. ID, slug, gambar, dan isi sumber tetap dikelola pada koleksi asal. [Panduan admin](panduan-admin.md#terjemahan-indonesia-dan-inggris)

Contoh argumen `updateDocument` untuk padanan yang sudah ditemukan.

```json
{
  "slug": "content-translations",
  "id": "<ID_TERJEMAHAN>",
  "data": { "english": "MBD Student Project Exhibition" }
}
```

### Jika konektor belum terhubung

- Periksa bahwa `/health?ready=1` merespons di origin yang sama dengan `/api/mcp`, migrasi sudah terpasang, dan proxy meneruskan header `Authorization`.
- Untuk `401`, periksa format header dan status **Aktif** akun integrasi dari panel. Jika tool tulis tidak tersedia, periksa izin **Editor konten** dan cakupan koleksi yang dikembalikan `getConfigInfo`.
- Untuk Cowork, pastikan konektor bisa dijangkau dari layanan Anthropic pada 443. Jika memakai satu konektor bersama, anggota mengaksesnya dengan izin API key yang tersimpan pada konektor itu. [Pengaturan jaringan dan konektor Anthropic](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)

### Contoh tugas untuk LLM

> Periksa apakah artikel acara ini sudah ada berdasarkan slug. Jika belum ada, buat draf di koleksi posts. Gunakan tag Event yang sudah tersedia. Simpan isi artikel sebagai rich text Lexical, lalu kembalikan judul, slug, ID, dan status draf. Tanyakan informasi yang kurang sebelum mengisi tanggal, lokasi, atau nama narasumber.

> Baca pmb-settings serta gelombang dan jalur yang relevan. Siapkan perubahan biaya untuk tahun akademik yang saya sebutkan. Tampilkan daftar nilai saat ini dan usulan perubahan untuk diperiksa. Setelah saya setujui, perbarui hanya bagian yang diminta.

Contoh argumen untuk memperbarui judul draf yang sudah ditemukan dengan `findDocuments`.

```json
{
  "slug": "posts",
  "id": "<ID_DOKUMEN>",
  "draft": true,
  "data": {
    "title": "Pameran Proyek Mahasiswa MBD"
  }
}
```
