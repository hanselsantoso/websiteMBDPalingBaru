# Pengujian CMS Payload

Jalankan aplikasi Next.js terlebih dahulu, lalu jalankan pemeriksaan HTTP berikut.

```sh
node scripts/smoke-cms.mjs http://127.0.0.1:3000
```

Gunakan `--require-content` saat halaman sudah diimpor dan diterbitkan. Opsi ini mengharuskan halaman program, kurikulum, dosen, karier, blog, kontak, kuis, dan PMB merespons dengan HTTP 200.

## Hasil lokal 26 November 2026

| Pemeriksaan | Hasil |
| --- | --- |
| Konfigurasi Payload | 32 koleksi dan empat global aplikasi, di luar obyek internal Payload |
| PostgreSQL dan migrasi awal | Readiness HTTP 200. Migrasi awal berstatus `Yes` |
| Admin dan API publik | Setup admin terbuka. API branding, kurikulum, pencarian, PMB, dan kuis merespons |
| Akses anonim | Koleksi admin, pendaftar, dokumen, lead, pesan, percobaan kuis, histori audit, dan draf menolak akses |
| Validasi | Lima endpoint formulir menolak input kosong dengan HTTP 422. Unduhan brosur tanpa tanda tangan ditolak |
| Aset situs | Logo Jejak Siasat dan sampel WebP dari ketiga animasi dapat dibuka |

58 pemeriksaan HTTP lulus. Delapan halaman yang bergantung pada konten masih merespons HTTP 404 pada database lokal kosong. Dalam mode `--require-content`, respons tersebut dianggap gagal.

Pemeriksaan ini mencakup akses anonim, pembacaan publik, dan input yang gagal validasi sebelum menulis data. Untuk verifikasi penuh, gunakan lingkungan uji dengan akun dan peran uji. Cakup login dan logout, buat draf lalu terbitkan halaman, unggah dan ganti media, periksa visibilitas perubahan di website, dan lihat hasil kuis serta kiriman PMB dari admin.
