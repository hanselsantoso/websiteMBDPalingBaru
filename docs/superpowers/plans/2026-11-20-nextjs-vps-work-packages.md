# Pembagian pekerjaan website Next.js dan Payload di VPS

Tanggal: 20 November 2026. Status: pembagian kerja berdasarkan rancangan yang disetujui pengguna. Pelaksanaan paket belum dimulai. Langkah teknis berada dalam [rencana implementasi](2026-11-20-nextjs-vps-implementation.md).

Dasar: [rancangan target](../specs/2026-11-20-nextjs-vps-design.md) dan [audit](../../audit/2026-11-20-audit-figma-nextjs.md). Pengguna memilih website responsif, VPS sendiri, dan satu aplikasi Next.js + Payload.

## Pemilik pekerjaan

| Pemilik | Tanggung jawab | Batas perubahan |
| --- | --- | --- |
| Koordinator | Arsitektur, kontrak, urutan kerja, integrasi dan laporan bukti | Memutuskan konflik file dan melacak keputusan pengguna |
| Platform/Migrasi | Baseline, kompatibilitas, runtime target, database, storage, transfer data | Hanya target self-hosted; sumber Make dipertahankan |
| Backend | Access, validasi, PMB, kuis, endpoint, email, pekerjaan sistem | Collection, service, schema dan API sesuai kontrak yang disepakati |
| Frontend | Route, formulir, pencarian, blog, cetak, responsif | Tidak mengubah kontrak backend sepihak |
| Konten/Visual | Inventaris konten resmi, media dan maskot | Tidak mengarang fakta atau memutasi CMS tanpa tooling yang sesuai |
| QA/Operasional | Integrasi, akses, build, browser, backup, cutover | Tidak menyatakan lulus tanpa bukti aktual |
| Pengguna/institusi | Data resmi, kebijakan PMB, domain, akses dan waktu rilis | Rahasia disediakan melalui mekanisme aman, bukan chat |

Penugasan ini adalah kepemilikan paket. Agen pelaksana diaktifkan bertahap setelah rancangan disetujui; semua paket tidak otomatis sedang berjalan. Koordinator mengambil alih paket bila agen tidak tersedia.

Prioritas P0 membuka jalan atau melindungi data/akses; P1 melengkapi alur utama; P2 menyempurnakan pengalaman. Semua paket dalam cakupan rilis tetap perlu selesai atau dikeluarkan secara eksplisit oleh pengguna.

## Tahap 0 menetapkan baseline

| ID | Prioritas / pemilik | Pekerjaan | Dependensi | Bukti selesai |
| --- | --- | --- | --- | --- |
| PL-01 | P0 Koordinator | Finalisasi desain, keputusan terbuka dan batas target VPS | Persetujuan pengguna | Desain disetujui, daftar pengecualian jelas, rencana implementasi tersedia |
| PL-02 | P0 Platform/Migrasi | Snapshot sumber, inventaris route/schema/media, ruang target terpisah dan version control | PL-01 | Sumber dapat dipulihkan; perubahan target dapat dibandingkan tanpa mengubah Make |
| PL-03 | P0 Platform/Migrasi | Matriks kompatibilitas Next/React/Payload/plugins/Node/pnpm; identifikasi API khusus Figma | PL-02 | Paket target bisa dipasang dan build minimum; ketidakcocokan tercatat sebelum migrasi fitur |
| PL-04 | P0 Koordinator | Pastikan akses tooling Payload, export resmi, skill data/auth, domain dan lingkungan uji | PL-01 | Matriks tersedia/tertahan dengan pemilik; tidak ada janji export atau seed tanpa akses |

## Tahap 1 fondasi mandiri

| ID | Prioritas / pemilik | Pekerjaan | Dependensi | Bukti selesai |
| --- | --- | --- | --- | --- |
| MG-01 | P0 Platform/Migrasi | Konfigurasi Payload mandiri, database, config runtime dan schema pada target | PL-03, PL-04 untuk tooling data | Seluruh 32 collections dan empat globals terdaftar; koneksi sehat; tipe ID dan relasi terjaga |
| MG-02 | P0 Backend | Admin auth mandiri, bootstrap terbatas, reset akses, enam peran dan akun nonaktif | MG-01, skill/auth contract | Login/logout/reset teruji; tanpa signup admin publik atau akses melalui sesi Figma |
| MG-03 | P0 Platform/Migrasi | Storage persisten, media publik, dokumen PMB privat, adapter gambar target | MG-01 | File bertahan setelah restart; dokumen privat ditolak tanpa izin; gambar berdimensi nonzero |
| MG-04 | P0 Platform/Migrasi | Export/import resmi, manifest, pemetaan relasi, transfer file dan rekonsiliasi staging | PL-04, MG-01–03 | Jumlah record, relasi, slug/status dan checksum cocok; retry import tidak menggandakan data |
| MG-05 | P0 Platform/Migrasi | Backup database/file, pemulihan staging dan pencatatan delta untuk rollback | MG-03–04 | Pemulihan benar-benar dijalankan; hasil dibandingkan; transaksi baru tidak hilang saat rollback |
| OP-01 | P0 QA/Operasional | Container, reverse proxy, HTTPS staging, secret handling, healthcheck dan log | MG-01–03 | Deployment ulang bersih, restart aman, DB tidak publik, secret tidak masuk bundle/log |
| OP-02 | P1 Backend + Operasional | Jadwal jobs, rate limit dan IP proxy tepercaya, email provider | OP-01, MG-02 | Jobs tidak ganda; rate limit bekerja sesuai topology; email uji hanya ke penerima yang ditetapkan |

## Tahap 2 integritas backend

Paket berikut menggunakan temuan audit. PL-03 menetapkan versi/API target lebih dahulu. MG-01 menyediakan lingkungan integrasi; penulisan tes perilaku dapat disiapkan setelah kontrak disepakati.

| ID | Prioritas / pemilik | Pekerjaan | Dependensi | Bukti selesai |
| --- | --- | --- | --- | --- |
| BE-01 | P0 Backend | Access mutasi publik, allowlist field, workflow server-owned, eligibility wave/track pada collection | MG-01, PL-04, keputusan kebijakan | Submit sah berhasil; field workflow palsu, relasi tak layak dan baca data privat ditolak di semua jalur |
| BE-02 | P0 Backend | Izin eksplisit dashboard/summary dan proteksi admin nonaktif | MG-02 | Matriks enam peran teruji; metrik tanpa izin tidak muncul; endpoint langsung juga menolak |
| BE-03 | P1 Backend | Kontrak CAPTCHA lead kuis dan validasi token pada schema/guard | MG-01 | Token sah diterima; kosong/invalid ditolak saat aktif; mode nonaktif tetap bekerja |
| BE-04 | P1 Backend + Operasional | Batas per file, jumlah, agregat multipart dan batas proxy/action | MG-03, OP-01 | Uji batas tepat/lebih batas, MIME tak layak dan beberapa file; error terstruktur tanpa crash |
| BE-05 | P1 Backend | Respons dokumen PMB parsial dan tindak lanjut aman | BE-01, BE-04 | Nomor pendaftaran tetap ada; file gagal disebutkan; tidak memicu pendaftaran ganda; tindak lanjut terotorisasi |
| BE-06 | P1 Backend | Respons rate limit analytics tanpa JSON body pada status 204 | PL-03 | Jalur batas tidak melempar exception; status/body sesuai kontrak |
| BE-07 | P1 Backend | Email test sesuai ID template dan propagasi hasil pengiriman | MG-02, OP-02 | Dua template berstatus sama dapat diuji dengan benar; kegagalan provider tampil tanpa false success |
| BE-08 | P1 Backend | Alur lead, kontak, konsultasi, brosur dan status; konsistensi workflow staf/WhatsApp | BE-01, MG-03, keputusan workflow | Data tersimpan sekali sesuai aturan; link brosur/status dibatasi; janji UI sesuai tindakan staf |
| BE-09 | P1 Backend | Query blog berhalaman dan invalidasi list/detail/slug/media serta draft preview | MG-01, MG-03 | Artikel ke-61 dapat ditemukan; edit published segera terlihat; slug lama/new dan media berubah benar |

## Tahap 3 frontend dan visual

| ID | Prioritas / pemilik | Pekerjaan | Dependensi | Bukti selesai |
| --- | --- | --- | --- | --- |
| FE-01 | P1 Frontend | CAPTCHA kuis dan lifecycle widget stabil pada semua formulir | BE-03 | Widget tidak reset saat mengetik; expiry/reset ditangani; submit ulang dan error fokus bekerja |
| FE-02 | P1 Frontend | Opsi gelombang, batas file, state pending/error/sukses parsial PMB | BE-01, BE-04–05 | UI hanya menawarkan wave layak; nomor dan status dokumen jelas; tidak mengajak submit duplikat |
| FE-03 | P1 Frontend | Pagination/filter blog di server dan penolakan respons pencarian usang | BE-09 | Lebih dari 60 artikel dapat ditelusuri; respons query lama tidak menimpa query terbaru |
| FE-04 | P2 Frontend | Kontras header cetak, stylesheet print dan konsistensi newTab navigasi | PL-03 | Cetak terbaca; menu desktop/mobile/dropdown memiliki perilaku tautan konsisten |
| FE-05 | P1 Frontend | Adaptasi origin, preview, metadata, sitemap, canonical dan gambar ke target | MG-03, BE-09, domain target | Tidak ada ketergantungan runtime Figma yang belum disengaja; share/preview/draft dan image replacement teruji |
| FE-06 | P1 Frontend | Semua block/route, state kosong, 404/error, keyboard, modal dan responsif | FE-01–05, CT-01–03 | Inventaris route terpenuhi; tidak ada overflow/clipping kritis; fokus dan validasi dapat dipakai |
| CT-01 | P1 Konten + pengguna | Lengkapi informasi resmi akademik, dosen, program, PMB, kontak, kebijakan dan CTA | PL-04, MG-04, sumber resmi | Placeholder kritis hilang; klaim dapat dilacak sumbernya; biaya/jadwal/kontak disahkan pengguna |
| CT-02 | P1 Konten/Visual | Foto, logo mitra, brosur, ilustrasi hasil generate dan hubungan Media | MG-03–04, sumber resmi | Tidak ada file rusak; alt dan relasi benar; brosur/peta/WhatsApp menuju tujuan benar |
| CT-03 | P2 Konten/Visual + Frontend | Pakai dua maskot bercelana; lengkapi empat pose yang masih shape bila ditampilkan | MG-03, pilihan visual pengguna | Pose konsisten dan tidak terpotong; CMS tetap prioritas; preview dan produksi menampilkan aset yang dipilih |

## Tahap 4 pembuktian dan rilis

| ID | Prioritas / pemilik | Pekerjaan | Dependensi | Bukti selesai |
| --- | --- | --- | --- | --- |
| QA-01 | P0 QA/Operasional | Typecheck, tes regresi relevan, build dan inspeksi route table target | Seluruh perubahan kode tahap 1–3 | Pemeriksaan lulus dengan log aktual; error TS tidak disembunyikan; fixed pages static sesuai kontrak |
| QA-02 | P0 QA/Operasional | Uji backend nyata, akses per peran, dokumen privat, alur gagal dan retry | MG-04, BE-01–09, FE-01–03 | Submit/read/status/file/email terbukti di staging; tidak ada hanya mock sebagai bukti utama |
| QA-03 | P1 QA/Operasional | Browser HP/tablet/desktop, seluruh route generated, gambar, aksesibilitas dan SEO | FE-06, CT-01–03, QA-01 | Daftar route dan screenshot hasil; image dimensions/replacement terbukti; tidak ada masalah kritis terbuka |
| QA-04 | P0 QA/Operasional | Uji freshness produksi, restore, restart, jobs dan simulasi rollback | MG-05, OP-01–02, QA-01–03 | Edit/slug/media terlihat pada request baru; restore dan rollback tidak kehilangan record uji |
| OP-03 | P0 Koordinator + Operasional | Runbook, rekonsiliasi final, freeze penulisan source, cutover domain, smoke test dan handover | Semua gate rilis, akses DNS, jadwal pengguna | Pengguna menerima hasil review sebelum cutover; data cocok; domain baru sehat; pemilik backup/operasional jelas |

## Urutan penugasan dan konflik

1. Koordinator menyelesaikan PL-01; Platform/Migrasi menangani PL-02–03. Koordinator memeriksa PL-04 dan kebutuhan data resmi bersama pengguna.
2. Platform/Migrasi membangun fondasi target. Backend menangani admin auth setelah MG-01, lalu access sebelum alur PMB.
3. Setelah kontrak BE-01/03/04/05 ditetapkan, Frontend menangani formulir. Paket cetak/search yang independen dapat berjalan paralel pada file berbeda.
4. Konten mengerjakan inventaris sumber resmi sambil menunggu tooling. Transfer atau pengisian CMS baru dijalankan setelah akses resmi terbukti.
5. QA menguji hasil yang sudah terintegrasi. Temuan dikembalikan kepada pemilik paket; lulus unit test saja tidak menutup paket integrasi.
6. Koordinator menyerahkan bukti rilis dan prosedur rollback untuk tinjauan sebelum tindakan produksi.

Konfigurasi Payload, tipe, access, schema validasi, actions dan service formulir mempunyai satu penulis pada satu waktu. Perubahan frontend yang menyentuh file bersama menunggu integrasi backend. Tidak membuat beberapa agen mengedit file yang sama secara bersamaan.

## Hal yang tertahan saat ini

- Rancangan sudah disetujui; belum ada implementasi migrasi.
- Tooling data Payload dan skill khusus konten/data/auth belum tersedia pada sesi audit; ketersediaannya diperiksa kembali sebelum tahap terkait.
- Export data, akses VPS/domain, serta provider email belum dikonfirmasi tersedia. Tidak meminta nilai rahasia di chat.
- Source Make belum memenuhi `figma make verify-deploy`. Target VPS akan mempunyai bukti build/deploy sendiri, dengan kedua status dilaporkan terpisah.
- Scope penghapusan schema, perubahan tipe/required/unique, dan pembersihan data belum diizinkan. Jika diperlukan, dampak dan preservasi data ditinjau sebelum mutasi.

## Checklist koordinator

- [x] Target responsive web dan VPS satu aplikasi dipilih pengguna.
- [x] Inventaris dan temuan audit dipetakan ke pemilik serta kriteria selesai.
- [x] Tinjauan rancangan oleh agen terpisah; tidak ada celah penting yang menghalangi perencanaan.
- [x] Persetujuan rancangan oleh pengguna.
- [x] Rencana implementasi terperinci melalui `superpowers:writing-plans`.
- [ ] Implementasi dan bukti per paket.
- [ ] **Verify production delivery** untuk target rilis yang telah disepakati.
- [ ] Cutover, handover, dan pemulihan teruji.

Setiap paket ditutup dengan perubahan yang dihasilkan, pemeriksaan yang dijalankan, hasil aktual, dan keterbatasan. Status dokumen ini tidak diubah menjadi selesai hanya karena kode sudah tersedia.
