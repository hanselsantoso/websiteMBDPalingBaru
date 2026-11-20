# Status implementasi target VPS

Tanggal: 20 November 2026. Pengguna memilih Native + reviewer akhir, lalu menjelaskan bahwa VPS/domain belum tersedia dan meminta proyek serta konfigurasi deployment disiapkan dahulu.

Target: `F:/laragon/www/WEB-MBD-VPS`. Sumber Make: `F:/laragon/www/WEB-MBD-FIX`, tidak diubah oleh tahap implementasi ini. Repository target dan snapshot baseline tersedia.

| Task | Hasil tahap ini | Pekerjaan yang masih terbuka |
| --- | --- | --- |
| 1 Baseline | Target terpisah, versi tersedia, mise dan pnpm bekerja, baseline 90 tes lulus | Bukti kompatibilitas runtime produksi setelah database tersedia |
| 2 Runtime | Konfigurasi Payload/Postgres mandiri, env validation, health dan Dockerfile; kompilasi awal serta TypeScript lulus | Database, schema dan build penuh |
| 3 Admin | Auth collection asli tetap dipertahankan; import map native dibuat CLI resmi | Bootstrap/login/reset/peran nyata; skill auth diperlukan sebelum perubahan auth |
| 4 Storage/proxy | Volume media/dokumen terpisah dan konfigurasi HTTPS disiapkan | Uji restart, private-file access, permission volume dan TLS di Docker |
| 5 Access/invariant | Temuan audit dipertahankan dalam backlog | Perubahan collection access, capability request, dashboard dan invariant memerlukan workflow modeling yang belum tersedia |
| 6 Upload PMB | Policy ukuran/jumlah, pemeriksaan sebelum buffer, nomor dan status dokumen parsial, opsi wave sesuai server | Uji proxy/action/DB/storage nyata; alur tindak lanjut staf |
| 7 Endpoint/email | Respons 204 kosong dan tes template by-ID; error provider diteruskan | SMTP nyata, jobs, rate limit lintas restart/instance dan operasional lead |
| 8 CAPTCHA | Token schema/UI kuis, lifecycle stabil, expiry/reset dan teks WhatsApp manual | Uji provider nyata pada staging |
| 9 Blog/search | Pagination server, taxonomy tag penuh, cache berparameter, UI muat lanjut; respons search usang diabaikan | E2E dengan data CMS nyata dan filter lintas taxonomy |
| 10 Cache/route | Cache lama dipertahankan; query pagination bertag ditambahkan; origin target disiapkan | Tabel route produksi static/ISR, draft/freshness/slug/media setelah publish |
| 11 Data/restore | Gate transfer dan prosedur preservasi dirinci | Tooling export/import, pemetaan ID, transfer, backup dan restore nyata |
| 12 Konten/visual | Dua maskot disalin, header cetak dan newTab diperbaiki, matrix konten tersedia | Konten resmi, pose tambahan, preview seluruh route dan gambar CMS |
| 13 QA | Unit/regresi dan komponen DOM ditambahkan; typecheck dijalankan | Browser lengkap, backend nyata, produksi dan seluruh matriks akses |
| 14 Cutover | Konfigurasi dan urutan deployment dipersiapkan | VPS/domain, tinjauan rilis, cutover/rollback/handover |

Build awal Next 16.4.2: kompilasi berhasil dalam 18,3 detik dan TypeScript selesai; pengumpulan data route gagal karena `ECONNREFUSED 127.0.0.1:55432`. Database target memang belum berjalan. Patch target diperbarui ke Next 16.4.5 dan Node 24.22.3 sesuai panduan kompatibilitas resmi; hasil verifikasi patch dicatat pada akhir tahap.

**Verify production delivery tetap terbuka.** Tidak ada deploy, perubahan DNS, pengiriman email nyata, mutasi CMS sumber atau pemindahan data. Kode yang siap diuji lokal tidak sama dengan backend siap produksi.
