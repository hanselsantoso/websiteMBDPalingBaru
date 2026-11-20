# Persiapan deployment VPS

Status: konfigurasi awal, belum layak rilis. Docker, database nyata, export data dan uji produksi belum tersedia pada sesi ini. Jangan mengarahkan trafik pendaftar ke target sebelum gate di bawah selesai.

## Yang sudah disiapkan

Target terpisah menggunakan konfigurasi Payload publik, PostgreSQL dengan ID string UUID, direktori media/dokumen persisten, validasi environment, SMTP opsional yang gagal secara eksplisit ketika belum dikonfigurasi, endpoint health, dan image Next standalone. Tidak ada rahasia Figma yang digunakan.

PostgreSQL UUID adalah kandidat target baru. Pemetaan ID sumber harus dibuktikan sebelum transfer. `push: false` mencegah sinkronisasi schema otomatis. Migration awal, bootstrap admin dan perubahan access belum dijalankan karena skill/data tooling yang diwajibkan belum tersedia.

## Persiapan lingkungan lokal

1. Gunakan `mise install` dari root target, lalu jalankan perintah lewat `mise exec --`.
2. Jalankan `node scripts/prepare-environment.mjs http://localhost:3000`. Ini membuat rahasia baru khusus instalasi target dan menolak menimpa berkas yang sudah ada. Tidak mencetak nilainya. Atur ACL direktori `.secrets` pada Windows.
3. Pasang Docker melalui pengelola mesin bila tersedia. Jalankan `docker compose config --quiet`, lalu `docker compose up -d db` hanya untuk database target yang baru.
4. Sebelum schema dibuat, ikuti gate data-modeling dan ekspor resmi. Tinjau migration resmi Payload; jangan mengaktifkan schema push pada database berisi data. `docker compose run --rm tooling` hanya memeriksa status migration.
5. Setelah database/schema/konten tersedia, jalankan `mise exec -- pnpm dev`. PORT mengikuti environment Next.js.

## Persiapan VPS Linux

1. Sediakan Docker Engine/Compose, origin HTTPS, TLS certificate, backup di luar VPS dan operator server. Pin image digest pada rilis setelah verifikasi image.
2. Atur `.env` dengan origin final sebelum build. Gunakan secret baru pada target; jangan mengirim nilainya melalui chat atau memasukkannya ke repository. SMTP/Turnstile dipasang melalui konfigurasi server yang terlindungi.
3. Pastikan database source sudah direkonsiliasi ke staging, schema migration ditinjau, admin mandiri dapat diakses, serta izin dokumen PMB terbukti. Tidak ada migration atau bootstrap otomatis dalam entrypoint container.
4. Mulai service `db`. Build Linux memakai host network untuk membaca database di loopback port 55432 melalui BuildKit secrets. Schema dan data publik harus tersedia karena build membaca CMS untuk generasi statis.
5. Jalankan `docker compose build app`, kemudian `docker compose up -d app`. Uji readiness melalui loopback. App tidak dibuka ke internet langsung.
6. Tempatkan `fullchain.pem` dan `privkey.pem` di `.certs`, atur permission, lalu jalankan `docker compose --profile https up -d proxy`. Operator mengelola pembaruan sertifikat.
7. Jalankan seluruh gate rilis pada rencana implementasi sebelum cutover. Compose belum pernah dijalankan dalam sesi ini; syntax dan perilaku runtime harus dibuktikan pada mesin Docker.

## Batas upload

Default PMB adalah 2 MiB per file, empat file, envelope Server Action 9 MiB. `PMB_MAX_DOCUMENT_MB` harus mencakup setting CMS; proxy `MAX_REQUEST_BYTES` minimal sebesar envelope tersebut dan kebutuhan media admin (default 64 MiB). Bila batas berubah, rebuild aplikasi dan sesuaikan proxy bersamaan. Pengujian maksimum empat berkas tetap wajib.

## Backup dan rollback

Backup harus mencakup database, volume media dan volume dokumen privat secara konsisten. Simpan salinan terenkripsi di luar VPS; jangan hanya menyalin image aplikasi. Latih restore di lingkungan terisolasi sebelum menetapkan RPO/RTO. Prosedur cutover membekukan penulisan sumber dan memindahkan delta terakhir; rollback wajib menyelamatkan transaksi target yang lebih baru dahulu.

## Gate yang masih terbuka

- Skill data-modeling/content/auth dan export/import resmi yang dapat menjangkau sumber.
- Schema migration target, bootstrap admin tanpa signup publik, audit access/invariant dan ID sumber.
- Database/container/SMTP/CAPTCHA nyata, konten resmi dan media CMS.
- Build produksi, tabel route static/ISR, semua route publik, freshness konten dan dokumen privat.
- Domain, TLS, backup/restore, cutover dan handover operator.

Jangan menyatakan backend atau deployment selesai berdasarkan typecheck/unit tests saja.
