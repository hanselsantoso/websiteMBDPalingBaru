# Pengujian CMS Payload

Jalankan aplikasi Next.js terlebih dahulu, lalu jalankan pemeriksaan HTTP berikut.

```sh
node scripts/smoke-cms.mjs http://127.0.0.1:3000
```

Gunakan `--require-content` saat halaman sudah diimpor dan diterbitkan. Opsi ini mengharuskan halaman program, kurikulum, dosen, karier, blog, kontak, kuis, dan PMB merespons dengan HTTP 200. Opsi `--require-media` mewajibkan wordmark unggahan dari Media pada origin yang diuji dan memeriksa file mentah serta hasil optimasi Next.js.

## Hasil lokal 26 November 2026

| Pemeriksaan | Hasil |
| --- | --- |
| Konfigurasi Payload | 32 koleksi dan empat global aplikasi, di luar obyek internal Payload |
| PostgreSQL dan migrasi awal | Readiness HTTP 200. Migrasi awal berstatus `Yes` |
| Admin dan API publik | Setup admin terbuka. API branding, kurikulum, pencarian, PMB, dan kuis merespons |
| Akses anonim | Koleksi admin, pendaftar, dokumen, lead, pesan, percobaan kuis, histori audit, dan draf menolak akses |
| Validasi | Lima endpoint formulir menolak input kosong dengan HTTP 422. Unduhan brosur tanpa tanda tangan ditolak |
| Aset situs | Logo MBD dan sampel WebP dari ketiga animasi dapat dibuka |

58 pemeriksaan HTTP lulus. Delapan halaman yang bergantung pada konten masih merespons HTTP 404 pada database lokal kosong. Dalam mode `--require-content`, respons tersebut dianggap gagal.

## Pengujian dengan data fiktif

Pengujian mutasi dijalankan pada PostgreSQL lokal terpisah dengan penyimpanan Media dan dokumen privat tersendiri. Fixture dibuat dengan Payload CLI dan tindakan admin diperiksa lewat browser. Konten dan kredensial uji berada di luar Git.

| Alur | Hasil |
| --- | --- |
| Auth dan peran | Admin dibuat dan login. Logout mengakhiri sesi. Penulis ditolak akses ke pendaftar dan dokumen PMB. Akun nonaktif ditolak akses ke dashboard dan dokumen PMB |
| Draf dan terbit | Draf tidak terlihat di API atau halaman publik. Publikasi awal dan revisi berikutnya langsung terlihat pada build produksi lokal |
| Media | Upload WebP dan PDF berhasil, dan perubahan teks alternatif tersimpan. Setelah wordmark pengganti dipilih di Branding, build produksi memuat gambar baru di header dan footer |
| Kuis dan kontak | Jawaban fiktif menghasilkan arketipe yang diharapkan. Percobaan kuis dan pesan kontak tersedia di CMS |
| Brosur | Permintaan brosur menghasilkan lead dan tautan yang dapat mengunduh PDF unggahan |
| PMB | Wizard menyimpan pendaftar dan dokumen. Nomor registrasi bisa dicek dengan akhiran WhatsApp yang sesuai. Berkas privat dapat dibaca admin dan ditolak bagi pengunjung anonim |

Dengan konten dan Media uji, **60 pemeriksaan HTTP** lulus pada build produksi lokal, termasuk mode `--require-content --require-media`. Build standalone menyertakan entry point Node untuk pembacaan tipe file oleh Payload. URL Media pada origin yang sama diproses lewat pengoptimal gambar internal Next.js. Saat berpindah database untuk build lokal, pisahkan cache build agar hasil prerender tidak mengambil konten dari database sebelumnya.

115 tes otomatis lulus. Pemeriksaan ini memakai konten fixture. Isi resmi, SMTP, dan Turnstile dengan penyedia nyata masih memerlukan verifikasi tersendiri.
