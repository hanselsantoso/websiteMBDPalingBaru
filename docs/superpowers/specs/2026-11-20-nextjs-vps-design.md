# Rancangan penyelesaian website Next.js dan Payload di VPS

Tanggal: 20 November 2026. Status: disetujui pengguna sebagai dasar rencana implementasi.

Pengguna menyetujui rancangan dan meminta kelanjutan rencana implementasi pada 20 November 2026. Persetujuan mencakup target terpisah, PostgreSQL setelah uji kompatibilitas, admin mandiri, preservasi data lama, dan WhatsApp manual dahulu. Deployment produksi serta perubahan destruktif belum dilakukan.

Tinjauan builder oleh agen terpisah selesai pada 20 November 2026. Tidak ditemukan pertanyaan penting tambahan yang menghalangi penyusunan rencana. Akses layanan dan keputusan operasional yang tercantum di bawah tetap menjadi syarat sebelum tahap terkait dijalankan.

## Keputusan pengguna dan tujuan

Pengguna memilih website responsif terlebih dahulu, hosting di server/VPS sendiri, serta Next.js dan Payload dalam satu aplikasi. Tujuannya adalah meneruskan desain Figma Make menjadi website yang dapat dipakai pengunjung dan staf, termasuk penyimpanan data, pengelolaan konten, PMB, serta operasional produksi.

Desain visual yang telah dibuat dipertahankan. Dua maskot bercelana sudah tersedia sebagai aset lokal dengan gambar CMS tetap diprioritaskan, sesuai izin pengguna. Pekerjaan berikutnya menyelesaikan fungsi dan memindahkan ketergantungan layanan Figma, bukan mengganti identitas situs.

## Kondisi awal

Source sudah menggunakan Next.js, React, Tailwind, dan Payload dengan 32 collections serta empat globals. Audit mencakup 57 URL publik dan sembilan halaman utama pada tiga ukuran layar. Typecheck dan 90 tes pada 18 berkas lulus pada audit sebelumnya; hasil tersebut bukan bukti integrasi database atau kesiapan rilis.

Lihat [audit sumber dan situs](../../audit/2026-11-20-audit-figma-nextjs.md) untuk inventaris dan bukti setiap temuan. Perubahan maskot lokal terjadi setelah audit dan belum dipublikasikan.

Workspace masih memakai `@payloadcms/figma`, `buildFigmaConfig`, loader gambar Figma, login admin melalui Figma, serta lifecycle Make. Shell lokal belum terhubung ke backend platform. Tooling konten Payload belum tersedia. Versi dalam manifest mencakup Payload 4.0.0-beta.7; kompatibilitas paket publik untuk target mandiri harus dibuktikan sebelum memilih versi produksi.

## Pendekatan yang dipertimbangkan

1. **Satu aplikasi Next.js dan Payload di VPS — dipilih pengguna.** Memanfaatkan komponen, collection, query server, dan administrasi yang ada. Deployment aplikasi terpusat; database dan berkas tetap mempunyai penyimpanan persisten tersendiri.
2. **Frontend dan Payload sebagai layanan terpisah.** Memungkinkan rilis independen, tetapi memerlukan kontrak API, autentikasi lintas layanan, serta invalidasi cache tambahan. Tidak dipilih untuk tahap website responsif.

Dokumentasi resmi mendukung [self-hosting Payload](https://payloadcms.com/docs/production/deployment) dan [deployment Next.js di server sendiri](https://nextjs.org/docs/app/guides/self-hosting). Ini mendukung arah arsitektur, bukan menjamin semua paket beta dari ekspor Make kompatibel tanpa perubahan.

## Cakupan selesai

- Halaman utama, detail kurikulum, dosen, artikel, kebijakan, pencarian, cetak, dan state kosong/error/404 bekerja pada HP, tablet, dan desktop.
- Kontak, konsultasi, brosur, pendaftaran PMB, dokumen PMB, pemeriksaan status, kuis, dan penyimpanan lead bekerja sampai data tersimpan dan dapat ditangani staf.
- Admin mengelola konten dan data operasional sesuai perannya, tanpa ketergantungan login Figma pada target VPS.
- Data, hubungan antar-record, media, URL publik, dan pengaturan penting dipertahankan selama migrasi.
- Rilis memiliki HTTPS, backup dan uji pemulihan, pencatatan kesalahan, pemeriksaan kesehatan, prosedur deployment, serta prosedur rollback.

Tahap ini tidak menambahkan aplikasi Android/iOS, PWA, akun publik, pembayaran, portal mahasiswa, atau backend lain. Pengiriman WhatsApp otomatis belum disetujui; usulan tahap awal adalah tindak lanjut manual staf dengan informasi UI yang sesuai. Kelengkapan REST untuk aplikasi native bukan syarat rilis website.

## Batas proyek Make dan target VPS

Instruksi proyek sekarang melarang penggantian `buildFigmaConfig`, pemasangan adapter database, modifikasi route Payload terkelola, serta perubahan loader platform di workspace Make. Larangan tersebut tetap berlaku pada sumber Make.

Implementasi migrasi diusulkan berlangsung pada salinan target yang terpisah, dengan instruksi khusus self-hosted dan riwayat versi sendiri. Snapshot sumber serta dokumen inventaris disimpan terlebih dahulu. Tidak ada perubahan terhadap internal `@payloadcms/figma`, penghapusan layanan lama, atau penggunaan nilai rahasia platform di target baru.

Persetujuan rancangan ini menetapkan ruang kerja migrasi terpisah sebagai tujuan implementasi. Perubahan schema destruktif, pemindahan DNS, dan penghentian sistem lama tetap membutuhkan tinjauan dampak tersendiri. Menyetujui rancangan tidak mengizinkan penghapusan data.

## Arsitektur target yang diusulkan

Keputusan berikut adalah usulan teknis asisten, belum merupakan pilihan terpisah dari pengguna:

- Linux VPS dengan Docker Compose; reverse proxy HTTPS di depan aplikasi Node.js. Database tidak dibuka ke internet.
- Satu aplikasi Next.js memuat frontend, server actions/API, dan Payload Admin. Tidak menggunakan static export untuk keseluruhan aplikasi.
- PostgreSQL sebagai kandidat database. Pilihan final bergantung pada kompatibilitas versi Payload, tipe ID yang diekspor, dan percobaan pemulihan data. Jangan mengubah ID string menjadi angka secara otomatis.
- Penyimpanan persisten di luar filesystem container untuk media publik dan dokumen PMB privat. Target awal dapat memakai volume VPS yang dibackup ke luar VPS. Object storage dapat dipilih jika infrastruktur pengguna sudah menyediakannya.
- Email melalui penyedia SMTP/API server-side. Provider, domain pengirim, domain situs, kapasitas VPS, dan metode pengelolaan server masih perlu diketahui sebelum konfigurasi produksi.
- Satu proses aplikasi pada rilis awal. Tidak menjanjikan high availability. Rate limit harus memperhitungkan reverse proxy, IP tepercaya, restart, dan penambahan instance; desain multi-instance memerlukan penyimpanan bersama.
- Jadwal pekerjaan latar memiliki satu pemilik eksekusi. Uji publish terjadwal serta retry tanpa email atau pekerjaan ganda.
- Rahasia baru milik instalasi VPS ditempatkan pada secret store atau berkas environment server yang terlindungi. Nilai rahasia tidak diminta melalui chat, dimasukkan Git, atau diekspos ke browser.

Versi paket dipilih melalui pengujian kompatibilitas. Tidak menurunkan atau menaikkan versi mayor secara diam-diam. Jika ekspor Make tidak dapat dijalankan dengan paket publik yang tersedia, catat perbedaan API dan ajukan perubahan ruang lingkup sebelum meneruskan.

## Data dan migrasi

Prinsip awal adalah mempertahankan semua data yang tersedia. Belum ada bukti bahwa sumber hanya berisi data contoh; jangan menghapus atau menggantinya berdasarkan tampilan placeholder.

1. Inventaris source dan tujuan: 32 collections, empat globals, ID, relasi, locale, draft/published, versi yang tersedia, slug, timestamp penting, upload, dokumen privat, redirect, akun dan peran.
2. Temukan mekanisme export/import resmi yang tersedia dan dapat menjangkau schema saat ini. Jika tooling tidak tersedia, pekerjaan transfer data tertahan secara eksplisit. Jangan membuat endpoint sementara, mengakses database Figma secara langsung, atau mengganti data persisten dengan array statis.
3. Simpan backup sumber dengan akses terbatas; buat manifest jumlah record, relasi, dan checksum file tanpa menaruh data pribadi pada log biasa.
4. Impor ke staging secara dapat diulang. Pertahankan ID jika didukung. Bila perlu pemetaan ID, petakan semua relasi dan referensi dokumen, lalu buktikan tidak ada relasi putus.
5. Transfer media dan dokumen privat secara terpisah. Pertahankan informasi alt/caption dan hubungan upload. Pengunjung tidak boleh memperoleh dokumen PMB hanya dengan mengetahui URL.
6. Jangan menyalin sesi, token SSO, atau rahasia Figma. Pengaitan admin lama ke akun baru berdasarkan identitas yang diverifikasi; login/reset akses dibuat melalui fasilitas resmi Payload.
7. Bandingkan jumlah, relasi, sampel isi, status publish, slug, dan checksum sebelum cutover. Lakukan uji pemulihan backup pada lingkungan terisolasi.
8. Saat cutover, hentikan sementara perubahan di sumber, transfer perubahan terakhir, lakukan rekonsiliasi, baru alihkan trafik. Jangan membiarkan dua sistem menerima pendaftaran secara independen tanpa strategi rekonsiliasi.

Jika rollback diperlukan setelah target menerima pendaftaran, amankan dan rekonsiliasi data baru sebelum membuka penulisan di sumber. Rollback image aplikasi atau DNS saja tidak mengembalikan database maupun menyelamatkan transaksi baru.

## Kontrak backend dan administrasi

- Semua input publik divalidasi dan di-allowlist server-side. Kesalahan dikembalikan terstruktur agar dapat ditampilkan per field atau per dokumen.
- Mutasi pengguna menerapkan access Payload, `overrideAccess: false`, serta konteks user jika ada. Jalur internal tepercaya untuk pekerjaan sistem dibedakan dan diaudit.
- Collection melindungi field workflow serta memeriksa eligibility relasi. Gelombang/jalur tidak hanya divalidasi di UI atau action.
- Usulan awal mempertahankan status `dibuka` sebagai syarat gelombang. Penegakan tanggal/kuota menunggu keputusan operasional; jangan menambah batas yang dapat menolak pendaftar tanpa persetujuan.
- Batas per file, jumlah file, total request, reverse proxy, dan Server Action diselaraskan. Bila sebagian file gagal, nomor pendaftaran tetap ditampilkan bersama status dokumen dan cara tindak lanjut yang aman.
- Usulan tahap awal untuk file yang gagal adalah tindak lanjut staf setelah verifikasi pendaftar. Portal retry mandiri hanya ditambahkan jika disetujui; nomor pendaftaran saja bukan otorisasi upload/read.
- Admin nonaktif dan peran tanpa izin ditolak pada endpoint, dashboard, serta berkas privat. Tidak ada signup admin publik. Bootstrap admin pertama menggunakan mekanisme resmi yang dibatasi dan ditutup setelah selesai.
- Kuis menangani CAPTCHA aktif/nonaktif/kedaluwarsa; UI tidak menjanjikan pengiriman WhatsApp otomatis yang belum tersedia.
- Email test mengirim template yang dipilih dan menyampaikan kegagalan. Uji tidak dikirim ke penerima nyata tanpa instruksi yang jelas.

## Frontend, konten, dan gambar

Pertahankan 27 block CMS, struktur route, token visual, serta desain responsif. Perbaiki CAPTCHA, opsi gelombang, feedback upload, pagination blog, respons pencarian yang terlambat, header cetak, dan perilaku tautan tab baru.

Konten akademik, dosen, biaya/jadwal, akreditasi, kontak, brosur, kebijakan, dan klaim statistik membutuhkan sumber resmi pengguna/institusi. Koordinator mengumpulkan daftar kekurangan; agen tidak mengarang angka atau identitas untuk menghapus `[ISI]`.

Dua maskot bercelana digunakan pada pose greeting/tablet, CMS tetap didahulukan. Empat pose lain dan ilustrasi yang sudah dihasilkan masuk pekerjaan visual tersendiri. Tidak mengganti seluruh SVG; ikon dan dekorasi sederhana dapat tetap vektor. Penambahan aset lokal selain dua maskot memerlukan penetapan jalur aset pada target baru, bukan perluasan diam-diam atas pengecualian sebelumnya.

Di sumber Make, loader Figma tetap utuh. Pada target VPS, pilih jalur gambar yang tidak bergantung runtime Figma setelah versi dan URL media tersedia. Tetap memakai hubungan Media dan `media.url`; jangan membuat proxy media berbasis ID sebagai jalan pintas.

## Konten segar, preview, dan URL

Halaman konten memakai cache dan invalidasi saat perubahan, bukan snapshot yang hanya berubah saat build. Perubahan list, slug lama/baru, penghapusan, serta media terkait menginvalidasi tampilan yang terdampak. Draft preview tetap terbatas dan tidak bocor ke cache publik.

Halaman tetap harus static; halaman detail konten dapat memakai ISR sesuai runtime yang dipilih. Halaman admin, API, dan preview dapat dinamis. Build produksi harus memperlihatkan klasifikasi route yang sesuai; HTTP 200 bukan bukti static/ISR.

Domain final digunakan konsisten pada canonical, sitemap, robots, URL preview, share, email, dan brosur. URL lama dipertahankan atau diberi redirect yang teruji. Staging dibatasi akses dan tidak diindeks.

## Pengujian dan syarat rilis

Setiap paket kerja memiliki bukti pada [daftar penugasan](../plans/2026-11-20-nextjs-vps-work-packages.md). Pengujian regresi berfokus pada perilaku yang rusak; pengujian integrasi memakai database dan storage staging sebenarnya.

Rilis menunggu seluruh kondisi berikut:

- Typecheck terpisah dan tes relevan lulus; build tidak menyembunyikan error TypeScript.
- Semua route publik hasil build dibuka. Inventaris awal 57 URL dibandingkan dengan hasil CMS terbaru, termasuk route baru, 404 dan redirect.
- Tidak ada placeholder kritis, tautan CTA kosong, runtime error, gambar gagal, atau kebocoran data privat.
- Kontak, konsultasi, brosur, PMB, upload parsial, status, kuis, email dan akses setiap peran terbukti pada staging.
- Update unik pada konten published, penggantian slug, serta upload pengganti terlihat pada request produksi baru setelah invalidasi.
- Tampilan utama dan contoh detail diuji pada HP/tablet/desktop, keyboard, fokus/modal, validasi error, serta browser sasaran.
- Backup dapat dipulihkan; data hasil pemulihan diperiksa. Database, media dan dokumen privat tercakup.
- HTTPS, batas upload, rate limit, healthcheck, log tanpa rahasia, serta pekerjaan terjadwal diuji.
- Cutover dan rollback mempunyai langkah, pemilik, dan rekonsiliasi data yang jelas.

Todo **Verify production delivery** tetap terbuka. Untuk sumber Make, kewajiban `figma make verify-deploy` belum terpenuhi. Untuk target VPS yang terpisah, bukti rilis adalah build/runtime produksi, tabel route, tes integrasi, dan pemeriksaan domain target; hasil tersebut tidak boleh dilaporkan sebagai verifikasi Make.

## Urutan dan tanggung jawab

Koordinator memegang keputusan arsitektur, kontrak antarbagian, integrasi, dan persetujuan rilis. Peran pelaksana adalah Platform/Migrasi, Backend, Frontend, Konten/Visual, serta QA/Operasional. Ini pembagian kerja agen di proyek, bukan penugasan kepada staf eksternal.

Urutannya: baseline dan kompatibilitas; target staging beserta auth/storage; perbaikan backend dan frontend; transfer data dan konten; pengujian terpadu; baru cutover. Pekerjaan pada berkas yang sama diserialkan. Contohnya perubahan schema/guard harus menetapkan kontrak sebelum formulir mengonsumsinya.

Pengguna menentukan isi resmi, akses layanan, penerima email uji, domain final, kebijakan PMB, dan waktu cutover. Asisten menangani desain teknis, implementasi yang disetujui, pengujian, serta dokumentasi. Jadwal kalender tidak dijanjikan sebelum akses data dan target hosting diketahui.

## Keputusan yang belum menghambat penyusunan rencana

- Provider, OS dan kapasitas VPS; domain; akses deployment tersedia sebelum pekerjaan operasional.
- Kemampuan export source dan ketersediaan data menentukan mekanisme transfer; tidak diasumsikan tersedia.
- SMTP/pengirim dan penerima uji ditetapkan sebelum email integrasi dijalankan.
- Status gelombang dan WhatsApp manual merupakan usulan perilaku awal, perlu koreksi pengguna jika tidak sesuai.
- Target pemulihan, retensi backup, retensi data pendaftar, dan pihak yang mengoperasikan server ditetapkan sebelum rilis. Tidak mengklaim SLA sebelum ada pengukuran.

Persetujuan desain dilanjutkan dengan rencana implementasi terperinci melalui skill `superpowers:writing-plans`, kemudian pengerjaan per paket. Dokumen ini tidak menyatakan migrasi, perbaikan, atau deployment sudah selesai.
