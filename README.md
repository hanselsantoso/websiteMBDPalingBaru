# S1 Manajemen Bisnis Digital ISTTS

Website program studi responsif dalam bahasa Indonesia dan Inggris dengan Next.js App Router, Payload CMS, dan PostgreSQL. Repositori ini berisi aplikasi target untuk dipasang di VPS secara mandiri.

## Akses lokal

Saat aplikasi berjalan pada port bawaan, buka [beranda Indonesia](http://localhost:3000/), [beranda English](http://localhost:3000/en), atau [CMS Admin](http://localhost:3000/admin). Pilih ID atau EN dari navbar desktop atau menu ponsel.

Gunakan Node.js 24.22.3 dan pnpm 10.34.3 sesuai [.mise.toml](.mise.toml). Siapkan PostgreSQL, konfigurasi lokal, dan migrasi baseline sesuai [panduan deployment](docs/operations/deployment-preparation.md#persiapan-lingkungan-lokal). Setelah database siap, jalankan perintah berikut dari root proyek.

```sh
mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm dev
```

Halaman publik membaca dokumen yang sudah terbit di Payload. Database baru perlu diisi dengan halaman, navigasi, kurikulum, dan media yang telah disetujui. Kode aplikasi, aset desain, dan referensi Kurikulum 2024 tersedia di Git.

## Dokumentasi

- [Screenshot setiap halaman publik dalam dua bahasa](docs/operations/handoff-bilingual.md)
- [Panduan pengembang](docs/operations/panduan-pengembang.md)
- [Panduan admin dan pengisian konten](docs/operations/panduan-admin.md)
- [Persiapan lingkungan lokal dan deployment VPS](docs/operations/deployment-preparation.md)
- [Pengujian CMS dan website](docs/operations/cms-verification.md)
- [Konektor MCP untuk Cowork dan klien lain](docs/operations/mcp-konten.md)
- [Data referensi dan langkah pengisian awal](seed/README.md)
- [Matriks kelengkapan konten program studi](docs/content/completion-matrix.md)
