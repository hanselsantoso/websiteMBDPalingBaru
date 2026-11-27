# S1 Manajemen Bisnis Digital ISTTS

Website program studi responsif dengan Next.js App Router, Payload CMS, dan PostgreSQL. Repositori ini berisi aplikasi target untuk dipasang di VPS secara mandiri.

## Akses lokal

Saat aplikasi berjalan pada port bawaan, buka [beranda](http://localhost:3000/), [Kurikulum](http://localhost:3000/kurikulum), [Dosen](http://localhost:3000/dosen), [galeri Siasat](http://localhost:3000/siasat), atau [CMS Admin](http://localhost:3000/admin).

Gunakan Node.js 24.22.3 dan pnpm 10.34.3 sesuai [.mise.toml](.mise.toml). Siapkan PostgreSQL, konfigurasi lokal, dan migrasi baseline sesuai [panduan deployment](docs/operations/deployment-preparation.md#persiapan-lingkungan-lokal). Setelah database siap, jalankan perintah berikut dari root proyek.

```sh
mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm dev
```

Halaman publik membaca dokumen yang sudah terbit di Payload. Database baru perlu diisi dengan halaman, navigasi, kurikulum, dan media yang telah disetujui. Kode aplikasi, aset desain, dan referensi Kurikulum 2024 tersedia di Git.

## Dokumentasi

- [Serah terima, screenshot, dan panduan CMS](docs/operations/handoff-2026-11-27.md)
- [Persiapan lingkungan lokal dan deployment VPS](docs/operations/deployment-preparation.md)
- [Pengujian CMS dan website](docs/operations/cms-verification.md)
- [Data referensi dan langkah pengisian awal](seed/README.md)
- [Matriks kelengkapan konten program studi](docs/content/completion-matrix.md)
