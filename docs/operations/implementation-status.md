# Status implementasi target VPS

Pembaruan 25 November 2026. Target tahap ini adalah menyiapkan proyek dan konfigurasi deployment sebelum VPS dan domain tersedia. Pemeriksaan mandiri oleh reviewer terpisah telah dilakukan untuk tahap persiapan ini.

Target: `F:/laragon/www/WEB-MBD-VPS`. Sumber Make: `F:/laragon/www/WEB-MBD-FIX`, tidak diubah oleh tahap implementasi ini. Repository target dan snapshot baseline tersedia.

| Task | Hasil tahap ini | Pekerjaan yang masih terbuka |
| --- | --- | --- |
| 1 Baseline | Target terpisah, versi tersedia, mise dan pnpm bekerja, baseline 90 tes lulus | Bukti kompatibilitas runtime produksi setelah database tersedia |
| 2 Runtime | PostgreSQL 17.12 lokal, migrasi awal Payload dijalankan dan build standalone berhasil | Uji image Linux dan kesiapan pada VPS |
| 3 Admin | Import map dibuat oleh CLI resmi. `/admin` dan `/admin/logout` merespons lewat route Payload bawaan | Bootstrap akun, login/reset dan peran nyata |
| 4 Storage/proxy | Volume terpisah, pembacaan secret saat startup, dan HTTPS disiapkan. Compose config lulus | Uji runtime image, izin volume, restart, akses file privat dan TLS |
| 5 Access/invariant | Temuan audit dipertahankan dalam backlog | Perubahan collection access, capability request, dashboard dan invariant memerlukan workflow modeling yang belum tersedia |
| 6 Upload PMB | Policy ukuran/jumlah, pemeriksaan sebelum buffer, nomor dan status dokumen parsial, opsi wave sesuai server | Uji proxy/action/DB/storage nyata; alur tindak lanjut staf |
| 7 Endpoint/email | Respons 204 kosong dan tes template by-ID; error provider diteruskan | SMTP nyata, jobs, rate limit lintas restart/instance dan operasional lead |
| 8 CAPTCHA | Token schema/UI kuis, lifecycle stabil, expiry/reset dan teks WhatsApp manual | Uji provider nyata pada staging |
| 9 Blog/search | Pagination server dan retry filter teruji. Hasil filter lama disembunyikan saat filter baru gagal. Cache hanya mencakup halaman pertama tanpa filter | E2E dengan konten CMS nyata dan filter lintas taxonomy |
| 10 Cache/route | Build lokal mengklasifikasikan beranda, galeri, dan template halaman utama sebagai static. Pola detail memakai SSG | Draft, freshness, slug, media, dan seluruh URL konten setelah impor |
| 11 Data/restore | Gate transfer dan prosedur preservasi dirinci | Tooling export/import, pemetaan ID, transfer, backup dan restore nyata |
| 12 Konten/visual | Logo Jejak Siasat, 25 pose kartun, dan tiga animasi terintegrasi. Beranda dan galeri diperiksa pada lebar 320, 390, 768, dan 1440 piksel | Konten resmi, pratinjau seluruh URL detail, dan penggantian gambar melalui CMS |
| 13 QA | 115 tes lulus. Build standalone dan 60 pemeriksaan HTTP lulus dengan konten fiktif pada database QA. Alur login, publish, Media, kuis, brosur, kontak, dan PMB diuji | Konten resmi, pengujian provider nyata, dan verifikasi lingkungan publik |
| 14 Cutover | Konfigurasi dan urutan deployment dipersiapkan | VPS/domain, tinjauan rilis, cutover/rollback/handover |

Build Next.js 16.4.5 dan Node 24.22.3 lulus dengan database lokal. `pnpm payload migrate:status` menunjukkan baseline berstatus `Yes`. Server standalone mengembalikan 200 untuk beranda, galeri Siasat, halaman cetak, admin, robots, sitemap, dan pemeriksaan kesiapan database. CMS menolak akses anonim ke koleksi admin. Halaman program, kurikulum, dosen, karier, blog, kontak, kuis, dan PMB masih mengembalikan 404 karena database target belum punya konten terbit. Beranda menampilkan sambutan sementara saat rekaman CMS tidak tersedia.

Review independen menyoroti ownership secret/volume, cache image Docker, filter blog yang gagal, cache query pengguna, serta CAPTCHA saat konfigurasi atau skrip gagal dimuat. Perbaikan diterapkan pada target. Compose config dan sintaks entrypoint lulus pemeriksaan. Container sebenarnya belum dijalankan, sehingga baca secret dan penulisan volume dalam container tetap perlu diuji.

**Verify production delivery tetap terbuka.** Runtime Linux, akses ekspor resmi CMS sumber, VPS dan domain dibutuhkan untuk menyelesaikan tahap rilis. Setelah transfer konten, uji seluruh route publik, publikasi media, admin, transaksi nyata PMB dan kuis, backup/restore, serta rollback sebelum cutover.
