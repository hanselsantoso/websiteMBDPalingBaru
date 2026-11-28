# Deployment website MBD di VPS

Panduan ini untuk operator yang menjalankan Next.js, Payload CMS, PostgreSQL, dan penyimpanan lokal persisten melalui Docker Compose di Linux. Website publik dan panel admin berada dalam satu aplikasi. Database, Media publik, dan dokumen PMB privat memakai volume tersendiri.

## Persiapan lingkungan lokal

1. Clone repositori, checkout revisi yang akan dikerjakan, dan jalankan `mise install` dari root proyek. Versi Node.js dan pnpm dipin di [.mise.toml](../../.mise.toml).
2. Untuk checkout baru yang belum punya konfigurasi, jalankan `mise exec -- node scripts/prepare-environment.mjs http://localhost:3000`. Perintah ini membuat `.env` dan `.secrets/` sekali per instalasi. Batasi ACL folder itu di Windows atau periksa izin direktori `0700` dan file `0600` di Linux.
3. Jalankan `docker compose config --quiet` lalu `docker compose up -d db`. Port PostgreSQL host yang dikonfigurasi adalah `127.0.0.1:55432`. Jika memakai PostgreSQL native, arahkan konfigurasi lokal ke database pengembangan yang sudah disiapkan operator.
4. Pasang dependensi dengan `mise exec -- pnpm install --frozen-lockfile`. Terapkan migrasi dengan `mise exec -- pnpm payload migrate`, lalu konfirmasi dengan `mise exec -- pnpm payload migrate:status`. Untuk database yang sudah berisi data, tinjau migrasi dan cadangkan lebih dahulu.
5. Jalankan `mise exec -- pnpm dev` lalu buka `/admin`. Ikuti [pengisian awal](#instalasi-baru-dan-konten-awal) saat database kosong. Untuk perubahan kode dan pengujian lokal, baca [panduan pengembang](panduan-pengembang.md).

## Persiapan VPS Linux

- Siapkan Docker Engine dengan Compose dan BuildKit, DNS/HTTPS untuk origin situs, ruang penyimpanan volume, serta tujuan backup terenkripsi di luar VPS. Compose mengikat port aplikasi `3000` dan PostgreSQL `55432` ke loopback. Proxy HTTPS opsional dari repo membuka port `80` dan `443`.
- Checkout revisi rilis di direktori instalasi. Dengan Node.js tersedia dan konfigurasi belum ada, jalankan `node scripts/prepare-environment.mjs https://mbd.example.org` memakai origin yang ditugaskan. Periksa `NEXT_PUBLIC_SITE_URL` dan `SITE_HOST`, serta tambahkan konfigurasi SMTP atau Turnstile melalui mekanisme rahasia server yang disepakati jika dipakai. `NEXT_PUBLIC_SITE_URL` ikut di-embed saat build.
- Siapkan sertifikat `.certs/fullchain.pem` dan kunci `.certs/privkey.pem` untuk proxy bawaan. Pemilik VPS mengurus perpanjangan dan reload Nginx. Jika memakai reverse proxy sendiri, teruskan `Host`, `X-Forwarded-Host`, `X-Forwarded-Proto`, dan header `Authorization` MCP. Sesuaikan batas unggahan di ingress. [Konfigurasi Nginx proyek](../../ops/nginx.conf.template)
- Simpan revisi Git, revisi snapshot konten, hasil tabel route, status migrasi, identitas image, dan waktu backup dalam catatan rilis. Untuk image dari registry, catat digest yang sudah diuji.

## Instalasi baru dan konten awal

Mulai database, build image tooling, dan terapkan migrasi resmi pada database tujuan.

```sh
docker compose config --quiet
docker compose up -d db
docker compose build tooling
docker compose run --rm tooling pnpm payload migrate:status
docker compose run --rm tooling pnpm payload migrate
docker compose run --rm tooling pnpm payload migrate:status
```

1. Siapkan enam peran sesuai [referensi seed](../../seed/README.md#roles) sebelum membuat admin pertama. Untuk menjalankan perintah seed di dalam Compose, gunakan awalan `docker compose run --rm tooling pnpm exec payload`. Path seperti `@seed/01-roles.json` merujuk pada file di image tooling.
2. Siapkan konten awal melalui impor resmi yang telah diotorisasi atau masukkan data yang disetujui lewat Payload. Data sumber Figma Make, akun SSO, dan file yang pernah diunggah ada di lingkungannya sendiri. Inventaris publik, dokumen privat dan pemetaan relasi perlu direkonsiliasi sebelum cutover. [Inventaris sumber](../migration/source-inventory.md) · [Kompatibilitas migrasi](../migration/compatibility.md)
3. Untuk instalasi yang diisi lewat panel, bangun aplikasi dengan schema yang sudah siap, batasi akses publik sementara, lalu buka `/admin` melalui HTTPS. Selesaikan layar pembuatan admin pertama dan verifikasi peran **Super Admin**. Siapkan admin yang bertugas sebelum membuka akses umum. Pada instalasi dengan admin hasil pemulihan, verifikasi login admin tersebut.
4. Terbitkan halaman sumber dan hubungkan navigasi, data akademik, PMB, serta Media. Isi terjemahan yang sudah disetujui. Jalankan build lagi dengan revisi konten baru apabila build awal dilakukan sebelum konten dipopulasi. [Panduan admin](panduan-admin.md) · [Data referensi](../../seed/README.md)

Untuk memuat data awal terjemahan yang disertakan pada revisi rilis, jalankan pratinjau terlebih dahulu lalu terapkan setelah memeriksa jumlah dan tujuan database. Importer membuat entri yang masih kosong dan mempertahankan padanan yang sudah diedit.

```sh
docker compose run --rm tooling node scripts/seed-content-translations.mjs
docker compose run --rm tooling node scripts/seed-content-translations.mjs --apply
```

## Build dan jalankan rilis

Build Linux mengakses database target yang sudah dimigrasikan pada `127.0.0.1:55432` melalui BuildKit secret. Compose memberi runtime URL koneksi internal `db:5432` dan volume yang sama dengan tooling. Lakukan persiapan pada staging yang merepresentasikan deployment final.

```sh
CONTENT_REVISION=rilis-001 docker compose build app
docker compose up -d app
docker compose ps
curl --fail --silent --show-error 'http://127.0.0.1:3000/health?ready=1'
docker compose --profile https up -d proxy
```

Ganti `rilis-001` dengan identitas snapshot yang terverifikasi. Gunakan `CONTENT_REVISION` baru ketika database build, snapshot publik, atau origin berubah agar lapisan build Next.js menggunakan data yang tepat. Jalankan pemeriksaan HTTPS readiness pada origin yang sebenarnya sebelum mengarahkan domain publik.

```sh
curl --fail --silent --show-error 'https://mbd.example.org/health?ready=1'
node scripts/smoke-cms.mjs https://mbd.example.org --require-content --require-media
```

Tinjau tabel build untuk halaman publik Indonesia dan Inggris. Halaman statis dan detail ISR harus masuk tabel sesuai kontraknya. Telusuri route tetap dan item yang dihasilkan dari data CMS di kedua bahasa, gunakan tombol bahasa di desktop dan ponsel, serta periksa Media termuat. Uji satu perubahan publik dengan teks unik dan satu penggantian Media dari browser baru. Periksa perubahan pada asal dan halaman terkait lalu pulihkan nilai uji. [Pengambilan screenshot dan verifikasi](panduan-pengembang.md#verifikasi-produksi)

Jalankan juga login admin, hak akses per peran, privasi dokumen PMB, pengajuan dan status pendaftar uji, unduhan brosur, kuis, dan formulir kontak. Uji integrasi SMTP atau Turnstile di origin yang digunakan. Jika MCP dibutuhkan, lakukan `getConfigInfo` melalui proxy dengan akun integrasi lalu periksa cakupan dan izin. [Panduan MCP](mcp-konten.md)

## Batas unggah

Default PMB adalah 2 MiB per file dengan maksimal empat file dan envelope Server Action 9 MiB. Batas `PMB_MAX_DOCUMENT_MB` mencakup maksimum yang diatur di **Pengaturan PMB**. `MAX_REQUEST_BYTES` pada proxy harus mencakup envelope formulir dan unggahan publik lewat admin. Default proxy adalah 64 MiB. Setelah mengubah batas, rebuild aplikasi, terapkan konfigurasi proxy, dan uji empat berkas pada batas baru. Gunakan berkas sintetis saat menguji dokumen PMB.

## Pembaruan dan migrasi

1. Catat revisi dan image aplikasi yang sedang berjalan. Ambil backup database dan volume dari titik yang konsisten. Latih versi migrasi ini pada salinan terisolasi.
2. Jadwalkan pemeliharaan bila migrasi memerlukan jeda penulisan. Checkout revisi baru, build `tooling`, dan jalankan `pnpm payload migrate:status`, `pnpm payload migrate`, lalu `pnpm payload migrate:status` melalui Compose. Konfigurasi `push: false` mengandalkan migrasi ini untuk perubahan skema.
3. Bangun image baru dengan `CONTENT_REVISION` yang baru, jalankan aplikasi, dan lakukan verifikasi rilis. Untuk migrasi pertama dari Make, bekukan penulisan sumber selama penyelarasan delta terakhir dan cocokkan jumlah, hubungan, slug, izin, serta file unggahan sebelum cutover.

## Backup dan pemulihan

Untuk mengambil snapshot yang konsisten, hentikan penulisan website dan tooling. Contoh berikut menggunakan Bash di VPS. Pilih lokasi kerja yang hanya bisa diakses operator.

```sh
umask 077
snapshot="backups/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$snapshot"
docker compose --profile https stop proxy app
docker compose exec -T db pg_dump -U arus -d arus -Fc > "$snapshot/database.dump"
docker compose run --rm -T --no-deps tooling \
  tar -C /app/.local-data -czf - media pmb-documents > "$snapshot/uploads.tar.gz"
docker compose up -d app
docker compose --profile https up -d proxy
```

Jalankan langkah `proxy` bila memakai proxy bawaan. Periksa exit status setiap backup. Salin artefak dan konfigurasi rilis yang diperlukan ke penyimpanan terenkripsi di luar VPS. Simpan file rahasia dan sertifikat melalui sistem pemulihan rahasia yang terlindungi. Verifikasi bahwa backup dapat dibaca, lalu latih restore ke instalasi terpisah yang memakai volume kosong dan database lain. Di shell pemulihan, set `snapshot` ke direktori tempat backup terpilih disalin.

```sh
docker compose up -d db
docker compose exec -T db pg_restore -U arus -d arus --no-owner --exit-on-error < "$snapshot/database.dump"
docker compose run --rm -T --no-deps tooling \
  tar -C /app/.local-data -xzf - < "$snapshot/uploads.tar.gz"
docker compose run --rm tooling pnpm payload migrate:status
```

Pada target pemulihan, jalankan image yang sesuai dengan schema backup. Verifikasi Media publik dan dokumen PMB privat setelah restore, lalu ukur waktu pemulihan dan umur backup terhadap target operasional.

## Rollback rilis

1. Hentikan penulisan dan amankan snapshot terkini terlebih dahulu, termasuk transaksi atau unggahan sejak cutover.
2. Bila schema rilis sebelumnya kompatibel, jalankan kembali image sebelumnya dengan digest atau tag rilis yang sudah dicatat. Gunakan override Compose untuk menunjuk `services.app.image` ke image sebelumnya, lalu jalankan `docker compose -f compose.yaml -f <override> up -d --no-build app`.
3. Bila schema belum kompatibel, pulihkan snapshot pra-rilis pada database dan volume terisolasi lalu rekonsiliasi transaksi dan file yang lebih baru sebelum mengganti target. Cocokkan relasi, izin, Media, dan dokumen privat. Jalankan kembali pemeriksaan kesiapan, login, dan kedua bahasa sebelum memulihkan akses publik.

Deployment VPS memerlukan verifikasi image Linux, DNS/TLS, backup/restore, dan cutover di lingkungan tujuan. Bukti build lokal tersedia dalam dokumentasi serah terima.
