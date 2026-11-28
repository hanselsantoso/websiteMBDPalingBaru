# Panduan pengembang website MBD

Target ini adalah Next.js App Router dengan Payload dan PostgreSQL yang dapat dijalankan di Windows untuk pengembangan serta Docker Compose Linux untuk produksi. Jalankan perintah dari root proyek. [Persiapan lokal dan deployment](deployment-preparation.md)

## Mulai mengembangkan

1. Clone repositori dan ikuti persiapan lokal sampai migrasi database lulus. Pakai database dan direktori unggahan QA terpisah untuk menguji perubahan.
2. Jalankan `mise exec -- pnpm dev` dan buka `http://localhost:3000/` serta `http://localhost:3000/admin`. Setelah konten tersedia, periksa halaman yang sama di `/en`.
3. Perubahan komponen terlihat melalui hot reload. Draf dan revisi CMS bisa ditinjau dari **Pratinjau** di admin. Gunakan jendela privat untuk memastikan perilaku pengunjung setelah publikasi. [Alur editor](panduan-admin.md)

## Peta kode

| Bagian | Lokasi dan tanggung jawab |
| --- | --- |
| Situs | [`src/app/(frontend)`](../../src/app/(frontend)) untuk halaman tetap, detail berbasis slug, dan handler publik |
| Admin dan API | [`src/app/(payload)`](../../src/app/(payload)) untuk integrasi Payload. Gunakan konfigurasi koleksi atau komponen admin untuk perubahan fitur CMS |
| Schema | [`src/payload.config.ts`](../../src/payload.config.ts), [`src/collections`](../../src/collections), dan [`src/globals`](../../src/globals/index.ts) |
| Konten dan cache | [`src/lib/data.ts`](../../src/lib/data.ts) untuk query publik dan [`src/hooks/revalidate.ts`](../../src/hooks/revalidate.ts) untuk invalidasi tag |
| Tampilan | [`src/components`](../../src/components), [`src/app/(frontend)/styles.css`](../../src/app/(frontend)/styles.css), dan [`public/images`](../../public/images) |
| Alur server | [`src/server/services`](../../src/server/services), [`src/app/(frontend)/actions.ts`](../../src/app/(frontend)/actions.ts), dan [`src/endpoints`](../../src/endpoints) |
| Verifikasi | [`scripts/smoke-cms.mjs`](../../scripts/smoke-cms.mjs), [`scripts/capture-screenshots.mjs`](../../scripts/capture-screenshots.mjs), tes Vitest, dan [pengujian CMS](cms-verification.md) |

## Ubah halaman, konten, atau tampilan

- Untuk teks, data terstruktur, Media, dan urutan blok yang sudah dikelola CMS, gunakan panel admin atau akun MCP berizin. Hubungkan gambar publik melalui relasi ke **Media**. Ilustrasi identitas statis dan aset fallback ada di `public/images`.
- Untuk mengubah komponen, mulai dari template route, lalu ikuti `CmsPage`, `RenderBlocks`, atau komponen detail yang terkait. Pakai token visual di stylesheet dan komponen bersama. Pertahankan kontrol yang dapat dipakai dengan papan ketik dan opsi gerakan yang dikurangi.
- Untuk perubahan schema, pelajari dampaknya terhadap dokumen yang sudah tersimpan. Buat migrasi Payload pada database pengembangan, tinjau migrasi dan daftar `src/migrations/index.ts`, lalu terapkan dengan `pnpm payload migrate`. Sinkronkan tipe dengan `pnpm generate:types`. Gunakan `pnpm generate:importmap` bila pemetaan komponen admin belum diperbarui atau pemulihan membutuhkannya.
- Pertahankan ID Payload sebagai string. Terapkan validasi dan allowlist di server, gunakan `overrideAccess: false` dan konteks pengguna untuk operasi yang dipicu pengguna, serta pertahankan pembatasan role dan kepemilikan pada schema. Uji perubahan formulir dengan data fiktif.

## Ubah tampilan dua bahasa

Rute Indonesia tetap di `/`, `/blog/<slug>`, dan alamat yang sudah digunakan. Rute Inggris memakai `/en` dan `/en/blog/<slug>`. Gunakan slug, ID, relasi, filter, dan tujuan eksternal yang sama. Tombol bahasa harus berpindah ke halaman yang setara, termasuk pada detail dan menu ponsel.

Teks antarmuka program seperti tombol, placeholder, validasi formulir, dan label aksesibilitas mengikuti locale komponen. Gunakan `withLocale()` untuk tautan halaman internal dan `localizedAlternates()` untuk metadata. Isi editorial bersumber dari dokumen Payload dan memiliki padanan Inggris yang dikelola melalui **Terjemahan konten**. Gunakan `getContentTranslator()` di server dan terapkan `translateContent()` pada data yang dikirim ke tampilan. Ketika padanan tidak tersedia, halaman Inggris memakai teks sumber untuk bagian itu. [Utilitas i18n](../../src/lib/i18n.ts) · [Terjemahan Payload](../../src/lib/content-translations.ts)

Gunakan `findBySlug()` untuk detail yang memakai slug Payload. Saat menambah route detail, sertakan parameter statis dari dokumen yang dapat ditampilkan, `notFound()` untuk dokumen hilang, dan jalur cache yang sama untuk kedua bahasa. Setelah mutasi CMS, kedaluwarsakan cache daftar serta detail lama dan baru jika slug berubah. Periksa cache halaman yang memakai Media ketika file diganti.

## Verifikasi produksi

Jalankan tes, pemeriksaan tipe, dan build terhadap database QA yang dipopulasi. Simpan tabel route dari build untuk catatan rilis.

```sh
mise exec -- pnpm test
mise exec -- pnpm exec tsc --noEmit
mise exec -- pnpm build
```

Jalankan image Compose untuk verifikasi Linux. Di Windows, jalankan build produksi standalone dari PowerShell baru di root proyek. Path file rahasia dan unggahan menunjuk ke instalasi QA secara absolut karena proses standalone memakai direktori build sebagai direktori kerja. Perintah berikut memakai layout yang dibuat oleh `prepare-environment.mjs`.

```powershell
Copy-Item -Recurse -Force public .next/standalone
Copy-Item -Recurse -Force .next/static .next/standalone/.next
$qaRoot = (Get-Location).Path
$env:PAYLOAD_SECRET_FILE = Join-Path $qaRoot '.secrets/payload-secret'
$env:DATABASE_URL_FILE = Join-Path $qaRoot '.secrets/database-url'
$env:MEDIA_DIR = Join-Path $qaRoot '.local-data/media'
$env:PMB_DOCUMENTS_DIR = Join-Path $qaRoot '.local-data/pmb-documents'
mise exec -- node --env-file=.env .next/standalone/server.js
```

Struktur standalone dalam Compose mengikuti susunan yang sama. [Dockerfile proyek](../../Dockerfile) · [Referensi Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)

```sh
node scripts/smoke-cms.mjs http://localhost:3000 --require-content --require-media
```

Periksa tabel route dan uji setiap halaman basis. Gunakan lingkungan produksi uji untuk mengubah satu terjemahan dan satu dokumen publik dengan penanda unik, buka halaman dari sesi baru, lalu pulihkan data uji. Periksa halaman daftar, detail lama dan baru ketika slug berubah, status 404 yang diharapkan, serta kedua bahasa saat gambar diganti. Uji formulir, filter, menu ponsel, unduhan brosur, privasi PMB, dan alur MCP yang dipakai.

### Screenshot desktop dan ponsel

Gunakan Chromium yang disediakan Playwright, Chrome, atau Edge. Script mencari paket `playwright` atau `playwright-core` yang tersedia. Untuk memasang alat QA terpisah dari dependensi aplikasi, gunakan `npm install --prefix .local-data/visual-qa playwright-core`. Gunakan `--playwright <path>` atau `--browser <path>` jika perlu menunjuk instalasi tertentu.

```sh
node scripts/capture-screenshots.mjs http://localhost:3000 \
  --manifest .next/prerender-manifest.json \
  --output output/handoff-bilingual
```

Script menggabungkan daftar halaman tetap, sitemap, dan manifest build bila diberikan. Screenshot desktop 1440 × 900 mencakup semua halaman yang ditemukan pada kedua bahasa. Screenshot ponsel 390 × 844 mencakup halaman utama dan satu contoh per jenis detail. Gunakan `--mobile-all` untuk mengambil seluruh halaman di ponsel dan `--full-page` untuk menyertakan bagian bawah halaman. Tinjau `capture-manifest.json` untuk status HTTP, judul, atribut bahasa, dimensi gambar termuat, dan error runtime. Jika ada kegagalan, buka rute terkait, perbaiki, dan ulangi pengambilan gambar.
