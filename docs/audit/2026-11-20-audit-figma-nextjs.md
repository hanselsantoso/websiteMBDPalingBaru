# Audit Arus Digital: tampilan, Next.js, dan backend

Tanggal penyelesaian audit: 20 November 2026 (Asia/Jakarta).
Situs yang diperiksa: https://true-flaky-11142606.figma.site/
Workspace: `F:\laragon\www\WEB-MBD-FIX`.

## Kesimpulan

Proyek sudah menggunakan Next.js App Router, React, Tailwind CSS, dan Payload. Tidak diperlukan konversi awal dari prototipe ke Next.js. Fondasi UI dan backend sudah nyata, tetapi aplikasi belum dapat dinyatakan lengkap atau siap digunakan untuk penerimaan mahasiswa produksi.

Pengguna menetapkan target **website responsif dahulu**, untuk browser HP, tablet, dan desktop. PWA dan aplikasi native bukan pekerjaan tahap ini.

Hambatan utama adalah konten penting yang masih berupa placeholder, beberapa cacat alur formulir dan administrasi, serta belum adanya bukti pengujian transaksi dan deployment produksi menyeluruh. Laporan ini merupakan audit, bukan implementasi perbaikan.

## Bukti dan batas pemeriksaan

- Membuka 57 URL publik yang ditemukan melalui tautan situs: 9 halaman utama, 38 detail mata kuliah, 4 profil dosen, 3 artikel, 2 halaman kebijakan, dan 1 halaman cetak.
- Memeriksa sembilan halaman utama pada viewport 390 × 844, 768 × 1024, dan 1440 × 900: 27 pemeriksaan. Tidak ditemukan overflow horizontal pada dokumen di ukuran tersebut.
- Memeriksa empat contoh halaman detail/cetak tambahan pada lebar 390 px; tidak ditemukan overflow horizontal dokumen.
- Meninjau screenshot halaman utama desktop dan contoh tampilan mobile/tablet. Membuka menu mobile dan modal brosur. Mengirim formulir kontak kosong untuk menguji validasi client; pesan kesalahan dan fokus field muncul.
- Pemeriksaan dimensi dokumen bukan sertifikasi seluruh elemen bebas clipping, seluruh browser kompatibel, atau aksesibilitas memenuhi WCAG.
- Semua 57 URL menampilkan judul/konten halaman yang sesuai. Ini bukan pengukuran HTTP status atau bukti tabel route build.
- Tidak mengirim pendaftaran, lead, kontak valid, email, WhatsApp, atau unggahan produksi. Tidak mengubah dokumen CMS. Kuis tidak diselesaikan sampai penyimpanan hasil.
- Dashboard/admin ditinjau melalui source, bukan melalui sesi admin terautentikasi.
- Tidak ditemukan gambar konten `<img>` pada halaman utama saat inspeksi DOM; ilustrasi dan foto memakai placeholder. Penggantian upload dan dimensi gambar CMS nyata belum terbukti.
- Source lokal dan situs published sesuai dalam pola halaman dan konten, tetapi tidak ada commit/deployment identifier untuk membuktikan keduanya identik.

## Inventaris tampilan

| Route | Tampilan dan alur | Hasil audit |
| --- | --- | --- |
| `/` | Hero, maskot Siasat, statistik, keunggulan, semester, dosen, blog, CTA | Terbuka; statistik, mitra, dosen, dan kontak belum lengkap |
| `/kurikulum` | Pencarian/filter, 38 mata kuliah, 8 semester, akses silabus | Terbuka; struktur akademik tersedia |
| `/kurikulum/[kode]` | Deskripsi, CPMK, rencana mingguan, penilaian, referensi, dosen | 38 detail terbuka; isi silabus masih placeholder |
| `/kurikulum/cetak` | Ringkasan kurikulum dan tombol cetak/PDF | Terbuka; header situs putih di atas latar putih |
| `/dosen` | Direktori, pencarian, filter keahlian dan pengajaran | Terbuka; empat profil masih nama/foto sementara |
| `/dosen/[slug]` | Biodata, pendidikan, publikasi, pengajaran | Empat detail terbuka; data belum lengkap |
| `/program` | Profil, visi/misi, profil lulusan, program unggulan | Terbuka; profil dan visi/misi masih placeholder |
| `/karier` | Peran, skill, mata kuliah, tempat kerja, kisaran gaji | Terbuka; contoh perusahaan dan sumber gaji belum diisi |
| `/blog` | Artikel unggulan, kategori, tag, pencarian, muat lebih banyak | Tiga artikel tampil; source membatasi dataset menjadi 60 artikel |
| `/blog/[slug]` | Artikel, metadata, sharing, artikel terkait | Tiga artikel terbuka |
| `/pmb` | Jalur, gelombang, biaya, persyaratan, formulir bertahap, cek status | Terbuka; informasi operasional belum lengkap |
| `/kuis` | Intro, pertanyaan, scoring, hasil, share card, lead | Intro terbuka; cacat CAPTCHA ditemukan pada source lead |
| `/kontak` | Kontak/peta, pesan, konsultasi, FAQ | Terbuka; validasi field kosong bekerja; detail kontak belum diisi |
| `/kebijakan-privasi` | Informasi penggunaan data | Terbuka; masih memiliki placeholder |
| `/syarat-ketentuan` | Ketentuan penggunaan | Terbuka; masih memiliki placeholder |

Source memiliki 14 pola `page.tsx`; catch-all CMS hanya menerima satu segmen tambahan. Route pendukung mencakup brosur bertanda tangan, preview, revalidation internal, sitemap, dan robots. Error boundary, maintenance, dan halaman 404 tersedia dalam source tetapi tidak seluruh state tersebut diaktifkan pada audit browser.

Sembilan halaman utama menggunakan `CmsPage` dan susunan `pages.layout`, bukan susunan data bisnis statis di frontend. Ada 27 jenis block CMS yang terdaftar di renderer: hero, pageHeader, stats, whyMbd, curriculumTrack, curriculumExplorer, facultyHighlight, facultyDirectory, testimonials, latestPosts, blogIndex, ctaBand, richText, imageText, faq, timeline, cardGrid, video, marquee, formEmbed, programs, careerPaths, jobBoard, pmbInfo, quiz, contactInfo, dan notFoundHero.

Referensi: `src/components/pages/CmsPage.tsx:38`, `src/blocks/pageBlocks.ts:573`, `src/components/blocks/RenderBlocks.tsx:36`.

## Penilaian desain responsif

Identitas visual konsisten: navy, lime, cyan, maskot Siasat, aksen gelombang/bintang, heading besar, border tebal, dan tombol dengan bayangan. Tipografi memakai Bricolage Grotesque, Plus Jakarta Sans, dan JetBrains Mono. Struktur ini layak dipertahankan.

Adaptasi mobile sudah tersedia: menu drawer, layout satu kolom, CTA adaptif, tabel/kartu kurikulum, dan ruang safe area. Menu mobile berhasil dibuka dan modal brosur muat pada viewport pengujian. Form kontak menampilkan error field dengan jelas.

Perbaikan visual paling mendesak adalah data kosong yang tampil ke publik dan header pada halaman cetak. Jangan mengganti seluruh desain untuk menyelesaikan masalah ini. Audit lanjutan perlu menguji keyboard, pembesaran teks, orientasi landscape, Safari/iOS, Android, dan browser desktop lain.

## Backend yang sudah tersedia

`src/payload.config.ts:33` menggunakan `buildFigmaConfig`. Terdapat 32 collections dan empat globals yang terdaftar.

| Domain | Collections / globals |
| --- | --- |
| Konten | pages, posts, post-categories, post-tags, media, folders, tags, testimonials, career-paths, partners, programs, job-posts, faqs |
| Akademik | curriculum-versions, courses, faculty |
| Penerimaan dan relasi calon mahasiswa | pmb-applications, pmb-documents, pmb-waves, pmb-tracks, leads, contact-messages, message-templates |
| Kuis | quiz-questions, quiz-results, quiz-attempts |
| Sistem | admins, roles, redirects, not-found-logs, audit-logs, analytics-events |
| Globals | site-settings, branding, navigation, pmb-settings |

Alur yang sudah memiliki implementasi server meliputi kontak, konsultasi, unduh brosur bertanda tangan, pendaftaran PMB, cek status, penilaian kuis, lead kuis, pencarian, dan analytics. Tersedia API v1, enam peran admin, audit log, dokumen PMB privat, dan email status melalui template.

Plugin SEO resmi sudah dikonfigurasi dengan upload collection `media`. Pembacaan konten publik memakai cache bertag; hook perubahan/penghapusan mencakup daftar, route detail, slug sebelumnya, dan media. Ini bukti arsitektur source, bukan bukti freshness deployment.

## Perbaikan prioritas

### P1: menghambat kesiapan penggunaan

1. **Lengkapi konten dan tujuan CTA.** Published masih menampilkan `[ISI]` untuk kontak, biaya, jadwal, akreditasi, profil dosen, silabus, dan informasi program. Tombol WhatsApp mengarah ke `/kontak` karena nomor belum diatur. Isi hanya data resmi melalui tooling Payload; jangan mengarang nilai untuk menghilangkan placeholder.
2. **Perbaiki CAPTCHA lead kuis.** `quizLeadSchema` tidak menerima `turnstileToken`; UI lead juga tidak memasang widget. Action tetap memanggil guard yang menolak token kosong jika Turnstile aktif. Menambahkan widget saja tidak cukup karena schema membuang token. Bukti: `src/lib/schemas.ts:172`, `src/components/quiz/QuizApp.tsx:32`, `src/app/(frontend)/actions.ts:105`, `src/server/guard.ts:43`.
3. **Selaraskan batas unggahan PMB.** UI/default CMS menerima 2 MB per file dan sampai empat file, sedangkan konfigurasi Server Actions tidak mengatur batas body. Next.js memiliki batas bawaan 1 MB; file yang diterima UI dapat ditolak sebelum handler. Batas agregat, overhead multipart, pemeriksaan awal, dan pesan error perlu konsisten. Bukti: `src/globals/index.ts:558`, `src/components/forms/PmbForms.tsx:113`, `src/app/(frontend)/actions.ts:75`, `next.config.ts:58`. [Dokumentasi Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions).
4. **Laporkan penyimpanan dokumen parsial.** Setelah pendaftaran tersimpan, kegagalan menyimpan dokumen hanya dicatat di log dan respons tetap sukses. Pertahankan nomor pendaftaran agar tidak memicu duplikasi, tetapi tampilkan dokumen yang gagal serta mekanisme tindak lanjut. Bukti: `src/server/services/forms.ts:211`, `:243`, `:263`.

### P2: integritas, akses, dan konsistensi alur

5. **Terapkan kontrak access pada mutasi publik.** Sejumlah layanan menggunakan `overrideAccess: true`. Validasi Zod/allowlist sudah ada, tetapi kontrak proyek meminta access anonim yang sempit, `overrideAccess: false`, user context bila ada, dan proteksi field workflow. Eligibility wave/track harus berada pada collection boundary juga. Ini temuan arsitektur; audit tidak membuktikan terjadi kebocoran data. Bukti: `src/server/services/forms.ts:134`, `:183`, `src/collections/Admissions.ts:116`, `:280`.
6. **Samakan gelombang yang dapat dipilih.** UI memasukkan semua gelombang selain `ditutup`, termasuk `akan-datang`; server hanya menerima `dibuka`. Bukti: `src/components/blocks/InteractiveBlocks.tsx:176`, `src/server/services/forms.ts:147`.
7. **Periksa izin dashboard secara eksplisit.** Endpoint summary hanya menguji keberadaan objek permissions; `NO_PERMISSIONS` tetap truthy. Sebagian metrik di dashboard dibaca dengan override access. Bukti: `src/endpoints/v1.ts:360`, `src/access/index.ts:29`, `src/server/dashboard.ts:44`.
8. **Perbaiki respons rate limit analytics.** `respond(204, null)` memanggil `Response.json`, padahal status 204 tidak menerima body. Runtime mikro menghasilkan `TypeError: Response constructor: Invalid response status code 204`. Bukti: `src/endpoints/v1.ts:37`, `:296`.
9. **Uji email memakai template yang dipilih.** Endpoint tes mengambil template ID, lalu hanya meneruskan status kepada pencari template aktif. Template yang dikirim dapat berbeda; kegagalan pengiriman juga tidak diteruskan ke UI. Bukti: `src/endpoints/v1.ts:385`, `src/server/services/messages.ts:30`.
10. **Jelaskan tindak lanjut WhatsApp.** UI kuis menjanjikan pengiriman hasil/brosur, tetapi service hanya menyimpan lead. Implementasi WhatsApp yang ditemukan berupa tautan manual untuk staf, bukan pengiriman otomatis. Tetapkan workflow manual yang jelas atau rancang integrasi terpisah. Bukti: `src/components/quiz/QuizApp.tsx:49`, `src/server/services/forms.ts:408`, `src/components/admin/LeadWhatsAppButton.tsx:11`.
11. **Tambahkan pagination blog nyata.** Query awal dibatasi 60 dokumen; tombol muat lebih banyak hanya memperluas slice array lokal. Bukti: `src/lib/queries.ts:153`, `src/components/blog/BlogIndex.tsx:64`, `:165`.
12. **Perbaiki lifecycle CAPTCHA dan pencarian.** Callback inline membuat effect widget Turnstile dipasang ulang saat parent rerender. Pencarian tidak mengabaikan respons query lama. Bukti: `src/components/forms/fields.tsx:235`, `src/components/forms/ContactForms.tsx:140`, `src/components/search/SiteSearch.tsx:35`.
13. **Beri kontras header halaman cetak.** Screenshot `/kurikulum/cetak` memperlihatkan nama brand dan menu putih di atas putih pada posisi awal. Header memakai background transparan sebelum scroll. Bukti: `src/components/layout/Header.tsx:116`.

### Hal yang perlu keputusan atau pembuktian

- Tanggal dan kuota gelombang disimpan, tetapi submission memeriksa status. Tentukan apakah tanggal/kuota bersifat informatif atau batas operasional sebelum menambahkan enforcement.
- Rate limiter masih in-memory per instance. Validasi kebutuhan proteksi lintas instance terhadap runtime deployment yang digunakan.
- `draftMode()` dibaca dari layout/data. Cache query tidak cukup untuk menyimpulkan route static/ISR; tabel produksi tetap wajib diperiksa. [Dokumentasi Dynamic APIs](https://nextjs.org/docs/messages/sync-dynamic-apis).
- API REST belum setara dengan seluruh Server Actions: unggahan dokumen PMB, konsultasi, dan lead kuis tidak memiliki jalur REST setara. Ini bukan penghambat target website responsif, tetapi relevan jika kelak ada klien native.

## Hasil verifikasi teknis

| Pemeriksaan | Hasil yang diamati |
| --- | --- |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false` | Lulus, exit 0 |
| `node node_modules/vitest/vitest.mjs run` | 18 file tes, 90 tes lulus, exit 0 |
| `pnpm exec tsc` / `pnpm test` melalui pnpm lokal | Terhambat auto-install dan `ERR_PNPM_IGNORED_BUILDS` untuk esbuild; eksekusi langsung di atas berhasil |
| `figma make verify-deploy` | Tidak berjalan: command `figma` tidak tersedia |
| Preview lokal | Koneksi localhost:3000 ditolak pada saat pemeriksaan |
| Toolchain shell | Node 22.13.1 dan pnpm 11.25.0; `.mise.toml` menetapkan Node 24.22.1 dan pnpm 10.34.3 |
| Git | Folder tidak memiliki repository `.git` |

PnPM otomatis mengunduh/materialisasi dependency saat pemeriksaan. Tidak ada perubahan kode aplikasi atau schema oleh audit ini. Laporan ini adalah berkas baru. Tidak ada commit atau deployment dilakukan.

`next.config.ts` menggunakan `ignoreBuildErrors: true`; karena itu build berhasil saja tidak akan menggantikan pemeriksaan TypeScript. Tes saat ini banyak memakai mock, sehingga lulus tes tidak membuktikan penyimpanan database, pengiriman email, akses file privat, atau transaksi produksi.

Skill `payload-framework` tersedia sebagai salinan di `.tmp/skill-payload-framework.txt` dan sudah dibaca. Skill `nextjs-docs` tidak ditemukan; detail Next.js yang relevan diperiksa terhadap dokumentasi resmi. Tooling data Payload tidak tersedia dalam sesi ini, sehingga audit tidak mengubah atau mengekspor data CMS.

## Arah pengerjaan yang disarankan

Pertahankan desain dan arsitektur Next.js + Payload yang ada. Selesaikan perbaikan perilaku formulir dan akses terlebih dahulu, kemudian lengkapi konten resmi, lalu jalankan pengujian integrasi pada lingkungan Figma Make yang terhubung. Penulisan ulang frontend atau penggantian backend akan memperbesar pekerjaan tanpa menyelesaikan celah yang sudah ditemukan.

Urutan kerja yang dapat dijadikan backlog:

1. Perbaiki CAPTCHA lead kuis, batas/hasil upload, izin dashboard, respons analytics, dan tes email dengan pengujian regresi terarah.
2. Rapikan access collection dan invariant PMB; periksa data yang sudah ada sebelum perubahan constraint. Jangan mengubah schema destruktif tanpa prosedur konfirmasi proyek.
3. Perbaiki opsi gelombang, pagination blog, lifecycle widget, pencarian, dan header halaman cetak.
4. Lengkapi dokumen CMS dan aset resmi; verifikasi CTA WhatsApp, brosur, peta, dan semua hubungan konten.
5. Uji alur nyata pada lingkungan uji terhubung: submit, baca kembali, status, dokumen privat, email, retry, dan hak tiap peran.
6. Jalankan verifikasi produksi dan audit responsif ulang setelah perbaikan.

## Checklist penyelesaian yang masih terbuka

- [x] Inventaris source halaman dan backend.
- [x] Buka 57 URL publik yang ditemukan dari navigasi situs.
- [x] Pemeriksaan dasar sembilan halaman utama pada HP/tablet/desktop.
- [x] Typecheck dan unit test.
- [ ] Perbaikan temuan prioritas.
- [ ] Data dan gambar resmi lengkap melalui tooling Payload.
- [ ] Pengujian backend nyata serta peran admin.
- [ ] Uji gambar CMS dengan dimensi nonzero, termasuk sesudah upload diganti.
- [ ] **Verify production delivery**: `figma make verify-deploy`, tabel route produksi, setiap route generated, dan bukti perubahan konten published terlihat pada request baru.

Checklist produksi tetap terbuka. Pemeriksaan situs yang sudah published tidak menggantikan build/verifikasi perubahan lokal, dan audit ini tidak menyatakan semua route static/ISR sudah memenuhi kontrak proyek.
