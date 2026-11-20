# Next.js dan Payload di VPS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menjalankan website responsif Arus Digital beserta CMS dan alur PMB pada VPS mandiri, mempertahankan desain serta data sumber.

**Architecture:** Satu aplikasi Next.js dan Payload, database PostgreSQL setelah kompatibilitas terbukti, storage persisten dan reverse proxy HTTPS. Target mandiri terpisah dari sumber Make. Migrasi berlangsung melalui staging, rekonsiliasi data, kemudian cutover yang dapat dipulihkan.

**Tech Stack:** Next.js App Router, React, TypeScript, Payload, Tailwind CSS, Vitest; Docker Compose dan reverse proxy; Playwright untuk pembuktian browser di target. Versi dipin setelah Task 1; manifest sumber tidak otomatis menjadi versi produksi yang terverifikasi.

**Spec:** [Rancangan yang disetujui](../specs/2026-11-20-nextjs-vps-design.md). [34 paket dan pemilik](2026-11-20-nextjs-vps-work-packages.md) menjadi daftar cakupan.

## Global Constraints

- Website responsif terlebih dahulu; tidak menambahkan aplikasi Android/iOS, PWA, akun publik, pembayaran, atau portal mahasiswa.
- Next.js dan Payload dalam satu aplikasi di server/VPS sendiri.
- Sumber Make tetap utuh: `F:\laragon\www\WEB-MBD-FIX`.
- Target implementasi yang diusulkan: `F:\laragon\www\WEB-MBD-VPS`. Jika sudah ada, periksa pemilik/isinya dan pilih direktori baru; jangan menimpa.
- Semua path kode di bawah relatif terhadap target VPS, bukan izin mengubah file platform di sumber Make.
- Pertahankan 32 collections, empat globals, 27 block CMS, URL yang ada, relasi dan tipe ID. Tidak membuat data persisten pengganti berupa array statis.
- Semua input publik divalidasi dan di-allowlist server-side; mutasi pengguna memakai `overrideAccess: false` dan user context bila tersedia.
- Dokumen PMB privat; data pribadi dan rahasia tidak masuk Git, screenshot, log umum, atau bundle browser.
- Pengisian dan transfer konten menggunakan tooling resmi yang telah terbukti tersedia. Ketiadaan export menahan transfer, bukan membenarkan akses alternatif ke backend Figma.
- Login admin memakai fasilitas resmi Payload, tanpa signup publik dan tanpa menyalin sesi/rahasia Figma.
- Dua maskot lokal greeting/tablet diizinkan; CMS tetap prioritas. WhatsApp manual dahulu; tanggal/kuota tidak menjadi penolakan otomatis baru.
- Jangan mengubah schema destruktif atau mengalihkan DNS sebelum tinjauan dampak dan instruksi yang sesuai.
- Jangan mengubah paket platform secara internal. Jangan memasang toolchain global secara manual; pin versi target yang kompatibel.

## Review Focus

1. Pendaftaran sudah tersimpan tetapi file/email gagal: nomor tetap tersedia, kegagalan terlihat, tidak mengarahkan submit duplikat — Task 6 dan 7.
2. Admin dinonaktifkan tetapi masih memiliki cookie: endpoint/dashboard/file tetap menolak — Task 3 dan 5.
3. Penulisan baru terjadi dekat cutover atau rollback: tidak ada kehilangan transaksi atau dua sumber penulisan aktif — Task 11 dan 14.
4. Query lambat, token CAPTCHA kedaluwarsa, atau filter berubah saat request masih berjalan: hasil lama tidak mengganti state baru — Task 8 dan 9.
5. Slug atau media berubah setelah publish: cache list/detail/metadata mengikuti perubahan dan draft tidak bocor — Task 10 dan 13.

## Struktur file dan kontrak lintas tugas

Pertahankan organisasi source. Jangan merestrukturisasi seluruh collection/service untuk mengikuti rencana ini. File baru hanya memisahkan kontrak yang dipakai lintas UI/server atau kebutuhan deployment.

| File / direktori target | Tanggung jawab |
| --- | --- |
| `src/payload.config.ts`, `next.config.ts`, `package.json`, `.mise.toml` | Konfigurasi mandiri, plugin/versi kompatibel, image/runtime dan build |
| `src/collections/*`, `src/globals/index.ts`, `src/access/index.ts` | Schema, admin dan batas akses |
| `src/lib/upload-policy.ts`, `src/lib/__tests__/upload-policy.test.ts` | Kontrak batas upload yang sama bagi UI dan server |
| `src/server/services/forms.ts`, `messages.ts`, `result.ts` | Service bisnis dan hasil terstruktur |
| `src/server/services/public-context.ts` | Konteks request publik terverifikasi, tidak berasal dari input browser |
| `src/lib/queries.ts`, `data.ts`, `hooks/revalidate.ts` | Query berhalaman, cache, invalidasi |
| `src/components/forms/*`, `quiz/QuizApp.tsx`, `blog/BlogIndex.tsx` | Interaksi formulir, CAPTCHA dan blog |
| `Dockerfile`, `compose.yaml`, `ops/nginx.conf`, `.env.example` | Deployment target; `.env.example` berisi nama/deskripsi tanpa nilai rahasia |
| `src/app/(frontend)/health/route.ts` | Liveness/readiness tanpa detail koneksi atau data pribadi |
| `playwright.config.ts`, `e2e/*.spec.ts` | Uji browser dan integrasi alur di staging |
| `docs/operations/*`, `docs/migration/*`, `docs/content/*` | Bukti kompatibilitas, migrasi, backup, konten dan runbook |

API Payload mengikuti versi yang dibuktikan pada Task 1. Tipe dokumen diimpor dari `src/payload-types.ts`; jangan mengganti dengan asumsi ID angka. Target memakai mekanisme resmi untuk regenerasi tipe/import map yang sesuai versi terpilih, sementara file terkelola Make tidak disentuh.

## Cara menjalankan pemeriksaan

Perintah dijalankan dari root target setelah dependency terpasang:

```text
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/vitest/vitest.mjs run <file-test>
pnpm exec playwright test <file-spec>
pnpm build
```

Task 1 menetapkan script build target lintas lingkungan dan versi kompatibel. Jangan menganggap script shell POSIX dari ekspor Make dapat berjalan langsung pada PowerShell. Setiap tes regresi harus terlihat gagal karena perilaku yang dituju sebelum perbaikan, lalu lulus sesudahnya. Pemeriksaan visual sederhana menggunakan browser, bukan tes yang sekadar menyalin implementasi.

Setiap task ditutup dengan commit pada repository target setelah pemeriksaan relevan lulus. Jangan commit kredensial, database, export privat, atau build output. Source saat ini tidak mempunyai `.git`; Task 1 membentuk version control target setelah snapshot sumber.

## Task 1 — Baseline target dan kompatibilitas

**Pemilik:** Platform/Migrasi; **paket:** PL-01–04. **Dependensi:** desain telah disetujui.

**Files:** Create target `AGENTS.md`, `.gitignore`, `docs/migration/source-inventory.md`, `docs/migration/compatibility.md`; copy source aplikasi/aset yang diinventarisasi; Modify target `.mise.toml`, `package.json`, `pnpm-lock.yaml` hanya setelah versi dibuktikan.

**Interfaces:** Produces target terpisah dengan versi eksak yang dapat dipasang, daftar komponen Figma yang perlu diganti, serta matriks akses data/server. Tidak mengekspor nilai environment.

- [ ] Verifikasi direktori target belum digunakan. Buat snapshot sumber dan manifest checksum source/aset tanpa memasukkan secrets, `node_modules`, `.next`, atau export privat.
- [ ] Catat semua route, schema, globals, loader, auth, preview, jobs dan script Make yang ditemukan. Simpan jumlah awal 32/4/27 serta URL audit sebagai baseline.
- [ ] Periksa package registry resmi untuk versi sumber: Next 16.4.2, React 19.3.1, Payload 4.0.0-beta.7, dan plugin terkait. Catat mana yang tersedia dan kompatibel; jangan memasang versi alternatif tanpa mencatat perbedaan dan dampaknya.
- [ ] Bila versi sumber tidak dapat direproduksi, buat matriks API yang berubah dan keputusan versi target. Minta keputusan tambahan hanya jika dampak mengubah fitur atau membutuhkan perubahan data berisiko.
- [ ] Bentuk target terpisah dengan instruksi self-hosted; jangan membawa larangan platform sebagai alasan memakai internals Figma di target. Salin hanya aplikasi/aset yang diperlukan. Bentuk repository target dan ignore file privat.
- [ ] Pastikan tooling data dan skill yang diwajibkan dapat diakses. Catat transfer/auth/schema sebagai tertahan jika skill/tool yang relevan tidak tersedia; tugas independen tetap berjalan.
- [ ] Pasang dependency dengan pnpm target yang dipin; buktikan instalasi bersih dan typecheck baseline. Pisahkan error baseline dari error perubahan. Commit baseline dengan manifest kompatibilitas.

**Gate:** target dapat direproduksi; tidak ada klaim database/migrasi selesai hanya karena instalasi lulus.

## Task 2 — Runtime Payload, database dan build mandiri

**Pemilik:** Platform/Migrasi; **paket:** MG-01, sebagian OP-01. **Dependensi:** Task 1.

**Files:** Modify `src/payload.config.ts`, `next.config.ts`, `src/lib/payload.ts`, `package.json`; Create `Dockerfile`, `compose.yaml`, `.env.example`, `src/app/(frontend)/health/route.ts`, `e2e/platform.spec.ts`.

**Interfaces:** `GET /health` mengembalikan `{ status: 'ok' }` untuk liveness; `GET /health?ready=1` mengembalikan 200 jika database siap dan 503 tanpa detail rahasia bila tidak. Mempertahankan export `getPayloadClient()` dan shared slug lookup agar pemanggil tetap kompatibel.

- [ ] Tulis smoke test target: public route, health, API Payload dan halaman admin harus dapat dilayani tanpa variabel/layanan Figma. Rekam kegagalan sebelum mengganti boundary platform.
- [ ] Konfigurasikan Payload publik mandiri dengan adapter PostgreSQL yang kompatibel, secret instalasi baru, editor/plugin yang dibutuhkan source dan schema yang sama. Lakukan hanya pada target; jangan membuat dummy platform secret.
- [ ] Muat schema pada database staging kosong menggunakan workflow resmi versi terpilih. Buktikan ID/relasi, locale, draft/version dan hooks kompatibel sebelum memasukkan data sumber.
- [ ] Sesuaikan route admin/API target melalui generator resmi bila diperlukan. Pertahankan frontend di `(frontend)`; sumber `(payload)` Make tetap utuh.
- [ ] Buat container aplikasi dan database ber-volume, dependency readiness, serta health endpoint. Hapus `ignoreBuildErrors: true` pada target setelah baseline TypeScript diperbaiki.
- [ ] Jalankan typecheck, `pnpm build`, lalu smoke test produksi container. Expected: tidak membutuhkan Figma runtime, 503 saat DB mati, 200 kembali setelah DB sehat. Commit hasil dan bukti.

## Task 3 — Admin mandiri dengan peran yang tetap berlaku

**Pemilik:** Backend; **paket:** MG-02. **Dependensi:** Task 2 dan skill auth yang sesuai.

**Files:** Modify `src/collections/Admins.ts`, `src/access/index.ts`, `src/payload.config.ts`; Test `src/access/__tests__/access.test.ts`, `e2e/admin-auth.spec.ts`; Create `docs/operations/admin-access.md`.

**Interfaces:** Collection `admins` tetap satu-satunya akun CMS. Enam role memakai key dan permission yang sudah ada. Tidak membuat collection `users` atau endpoint registrasi publik.

- [ ] Tulis tes integrasi login/logout/reset dan cookie admin yang sudah dinonaktifkan. Assert tidak ada akses dashboard/file privat setelah status berubah; user tidak dapat menaikkan perannya sendiri.
- [ ] Tetapkan bootstrap admin pertama memakai fasilitas resmi versi Payload, hanya dalam deployment terkontrol. Dokumentasikan penutupan jalur bootstrap sebelum public ingress dibuka.
- [ ] Ganti dependensi login Figma di target dengan auth Payload resmi. Pertahankan role/status dan pemetaan identitas; jangan menyalin password/token/SSO sumber.
- [ ] Uji admin aktif, nonaktif, tanpa role, role terbatas, dan super-admin. Reset diuji pada mail sink staging. Akun publik tidak memperoleh akses Admin.
- [ ] Jalankan tes akses terarah dan `e2e/admin-auth.spec.ts`; expected seluruh batas izin terpenuhi. Commit dan tulis prosedur pemulihan akses admin.

## Task 4 — Media persisten, dokumen privat dan proxy

**Pemilik:** Platform/Migrasi; **paket:** MG-03, OP-01. **Dependensi:** Task 2–3.

**Files:** Modify `src/collections/Media.ts`, `src/collections/Admissions.ts`, `next.config.ts`, target loader gambar bila masih digunakan, `compose.yaml`; Create `ops/nginx.conf`, `e2e/storage.spec.ts`.

**Interfaces:** `media.url` tetap input gambar. Dokumen `pmb-documents` hanya dibaca dengan otorisasi Payload; reverse proxy tidak menyajikan directory dokumen privat secara statis. Public cache dan private `no-store` dipisahkan.

- [ ] Tulis integrasi: media publik dapat dibuka; dokumen PMB dengan URL diketahui ditolak anonim; restart container tidak menghilangkan file.
- [ ] Pasang volume persisten terpisah atau storage resmi yang tersedia, dengan konfigurasi minimal untuk topologi satu VPS. Jangan memberi seluruh upload akses publik demi optimasi gambar.
- [ ] Ganti hanya loader/runtime target yang bergantung Figma. Gunakan fasilitas gambar Next yang kompatibel dan `media.url`; jika storage eksternal dipilih, allowlist origin eksak target. Jangan menambahkan proxy media ID.
- [ ] Terapkan HTTPS/reverse proxy dan forwarded headers yang dipercaya; app/DB tidak dibuka langsung ke internet. Staging dibatasi akses dan tidak diindeks.
- [ ] Jalankan `e2e/storage.spec.ts` dengan upload, replacement, restart serta request privat anonim/role berbeda. Expected gambar nonzero, file tetap ada, akses privat konsisten. Commit.

## Task 5 — Access publik, invariant collection dan dashboard

**Pemilik:** Backend; **paket:** BE-01–02, sebagian BE-08. **Dependensi:** Task 3–4.

**Files:** Modify `src/access/index.ts`, `src/collections/Admissions.ts`, `Leads.ts`, `Quiz.ts`, `src/server/services/forms.ts`, `leads.ts`, `src/server/dashboard.ts`, `src/endpoints/v1.ts`; Create `src/server/services/public-context.ts`; Test `src/access/__tests__/access.test.ts`, `src/server/__tests__/services.test.ts`, `src/endpoints/__tests__/v1.test.ts`, `e2e/public-access.spec.ts`.

**Interfaces:** `authorizePublicSubmission(payload: Payload, headers: Headers, options: { form: string; honeypot?: string; turnstileToken?: string }): Promise<{ status: 'ok'; req: PayloadRequest } | { status: 'bot' } | { status: 'blocked'; message: string }>` menggabungkan autentikasi resmi, `guardForm` dan penerbitan capability request server-only. `isVerifiedPublicRequest(req: PayloadRequest, collection: string): boolean` memeriksa capability sempit per form/collection, bukan flag dari body/query. Capability tidak dapat diserialisasi atau diterbitkan browser. Service publik menerima `req?: PayloadRequest` sebagai argumen terakhir; request anonim tanpa capability ditolak. User/context diteruskan dengan `overrideAccess: false`. Tidak mengizinkan caller memilih status, nomor registrasi, owner atau audit metadata.

- [ ] Tambah tes matrix anonim/aktif/nonaktif/role terbatas: submit melalui guard yang sah lolos; list/read private, spoof workflow dan create anonim langsung ke collection REST/GraphQL tanpa capability gagal. Wave tertutup atau track nonaktif ditolak pada collection meskipun request sudah terverifikasi.
- [ ] Tempatkan validasi relasi pada collection hook dan field access. Hook mengisi workflow server-owned; pisahkan efek internal tepercaya dari input publik. Hindari memperluas akses update lead privat agar upsert anonim bekerja.
- [ ] Perbarui service/action/endpoint memakai konteks dan access yang sama. Konsumsi CAPTCHA hanya sekali sebelum menerbitkan capability; jangan memvalidasi token single-use dua kali. Jangan mempercayai `context` dari body REST. Uji pemalsuan flag/context tidak membuka akses collection.
- [ ] Pada dashboard/summary, cek permission per modul secara eksplisit dan blokir akun nonaktif. Jangan menganggap objek `NO_PERMISSIONS` truthy berarti diizinkan. Jangan membuka metrik modul lain melalui aggregate.
- [ ] Jalankan tes file di atas, lalu integrasi `e2e/public-access.spec.ts`. Expected penolakan dilakukan collection/API, tidak hanya UI. Commit setelah matriks lulus.

## Task 6 — Upload PMB dengan hasil parsial yang jujur

**Pemilik:** Backend lalu Frontend; **paket:** BE-04–05, FE-02. **Dependensi:** Task 4–5.

**Files:** Create `src/lib/upload-policy.ts`, `src/lib/__tests__/upload-policy.test.ts`; Modify `src/server/services/forms.ts`, `src/app/(frontend)/actions.ts`, `src/components/forms/PmbForms.tsx`, `src/components/blocks/InteractiveBlocks.tsx`, `next.config.ts`, `ops/nginx.conf`; Test `src/server/__tests__/services.test.ts`, `e2e/pmb-upload.spec.ts`.

**Interfaces:**

```ts
type UploadPolicy = { maxFiles: 4; maxFileBytes: number; maxTotalFileBytes: number; maxRequestBytes: number }
function buildUploadPolicy(maxDocumentMb: number): UploadPolicy
type PmbSubmissionData = {
  regNumber: string; name: string; waveName: string
  documents: { name: string; status: 'saved' | 'failed'; message?: string }[]
}
```

`submitPmbApplication(payload, input, documents?, req?)` menghasilkan `Promise<ServiceResult<PmbSubmissionData>>`. `ActionResult<T>` tetap serializable. `maxFileBytes = maxDocumentMb * 1024 * 1024`, total empat file; request envelope menambah 1 MiB untuk metadata/multipart yang dibatasi. Nilai default CMS 2 MB menghasilkan 8 MiB total file dan 9 MiB envelope. Konfigurasi deployment harus mendukung nilai CMS yang sudah ada; jangan diam-diam mengecilkannya.

- [ ] Tulis tes policy dengan `expect(buildUploadPolicy(2)).toEqual({ maxFiles: 4, maxFileBytes: 2097152, maxTotalFileBytes: 8388608, maxRequestBytes: 9437184 })`; uji nilai tak valid, file kelima, MIME/magic mismatch dan batas tepat/lebih satu byte.
- [ ] Uji kegagalan upload kedua setelah application tersimpan: `result.ok === true`, nomor tetap sama, status file kedua `failed`, file pertama `saved`, application create hanya sekali. Uji email gagal tidak mengganti hasil menjadi kegagalan pendaftaran.
- [ ] Terapkan pemeriksaan metadata/jumlah/ukuran sebelum `arrayBuffer()`, validasi magic sesudahnya, dan jangan memotong file kelima secara diam-diam. Selaraskan batas proxy/action pada envelope deployment. Jika CMS dinaikkan melebihi envelope, tampilkan kesalahan konfigurasi kepada staf dan jangan menjanjikan batas UI yang tidak didukung.
- [ ] Return status tiap file; pertahankan nomor pendaftaran. UI menyebut file gagal dan tindak lanjut staf, tanpa formulir submit pendaftaran ulang. Gunakan identitas terverifikasi sebelum staf memasang dokumen pengganti.
- [ ] Samakan daftar wave dengan `status === 'dibuka'`. Jangan menerapkan kuota/tanggal baru. Tambahkan state upload nonaktif dan tanpa dokumen.
- [ ] Jalankan tes policy/service dan `e2e/pmb-upload.spec.ts` melalui reverse proxy produksi staging, termasuk empat file batas maksimum. Expected tidak ada request yang diterima UI tetapi selalu ditolak proxy/action. Commit.

## Task 7 — Endpoint analytics, email dan pekerjaan latar

**Pemilik:** Backend + Operasional; **paket:** BE-06–08, OP-02. **Dependensi:** Task 5–6.

**Files:** Modify `src/endpoints/v1.ts`, `src/server/services/messages.ts`, `events.ts`, `src/server/guard.ts`, `src/payload.config.ts`, `src/components/admin/TemplateTestButton.tsx`; Test `src/endpoints/__tests__/v1.test.ts`, `src/server/__tests__/admin-services.test.ts`, `guard.test.ts`; Create `docs/operations/jobs-email.md`.

**Interfaces:** Tambahkan `sendTemplateTest(req: PayloadRequest, templateId: MessageTemplate['id']): Promise<ServiceResult<{ sentTo: string }>>`; `MessageTemplate` memakai nama tipe generated yang sesuai slug `message-templates`. Penerima adalah admin terautentikasi yang berizin, bukan email bebas dari body. Pertahankan `sendApplicationEmail(...)` sebagai follow-up nonfatal untuk pendaftaran dengan hasil pengiriman tercatat.

- [ ] Tes endpoint rate limit: `expect(response.status).toBe(204)` dan `expect(await response.text()).toBe('')`; tidak menggunakan `Response.json` untuk 204.
- [ ] Tes dua template berstatus sama: endpoint ID B mengirim isi B; provider throw menghasilkan error terstruktur, bukan `sentTo` sukses. Template non-email dan akun tanpa izin ditolak.
- [ ] Terapkan jalur tes template by-ID yang berbeda dari pemilihan template aktif untuk status pendaftaran. UI admin menampilkan hasil nyata; tidak menelan error test.
- [ ] Konfigurasikan mail sink untuk staging. Pengiriman keluar hanya setelah provider dan penerima uji ditetapkan. UI kuis/brosur menggunakan janji tindak lanjut manual staf, bukan otomatis WhatsApp.
- [ ] Tentukan satu runner jobs; uji schedule publish/unpublish, retry, restart dan eksekusi tumpang tindih agar tidak menggandakan efek. Uji rate limit dengan forwarded IP palsu serta instance topology yang dipakai.
- [ ] Jalankan tes terarah; catat hasil provider/job staging dan commit. Jika provider belum tersedia, tandai integrasi email tertahan tanpa memblokir perbaikan endpoint.

## Task 8 — CAPTCHA konsisten di seluruh formulir

**Pemilik:** Backend lalu Frontend; **paket:** BE-03, FE-01. **Dependensi:** Task 5.

**Files:** Modify `src/lib/schemas.ts`, `src/components/forms/fields.tsx`, `src/components/forms/ContactForms.tsx`, `src/components/forms/PmbForms.tsx`, `src/components/quiz/QuizApp.tsx`, `src/components/cta/BrochureModal.tsx`; Test `src/lib/__tests__/schemas.test.ts`, `src/server/__tests__/guard.test.ts`, `e2e/captcha.spec.ts`.

**Interfaces:** `QuizLeadInput` menambah `turnstileToken?: string`; props `Turnstile({ siteKey, onToken })` tetap sama. `onToken('')` berarti expired/error/reset; referensi callback terbaru disimpan tanpa membuat widget ulang setiap render.

- [ ] Tambah tes schema: token masukan tetap ada pada hasil `quizLeadSchema.parse`; guard aktif menolak token kosong/invalid dan menerima token sah; mode nonaktif berjalan.
- [ ] Tulis browser test widget harness: mengetik/rerender tidak menaikkan jumlah render widget; expiry mengosongkan token; unmount membersihkan widget; retry memperoleh token baru.
- [ ] Tambahkan widget pada lead kuis, teruskan token lewat schema/action, dan rapikan lifecycle seluruh pemakai komponen. Honeypot tetap dipertahankan.
- [ ] Jalankan tes schema/guard dan `e2e/captcha.spec.ts`. Lakukan satu verifikasi nyata provider pada staging jika konfigurasi tersedia, tanpa menggunakan respons mock sebagai bukti provider. Commit.

## Task 9 — Blog berhalaman dan pencarian tanpa hasil usang

**Pemilik:** Backend lalu Frontend; **paket:** bagian BE-09, FE-03. **Dependensi:** Task 2, Task 5.

**Files:** Modify `src/lib/queries.ts`, `data.ts`, `src/components/blog/BlogIndex.tsx`, `src/components/blocks/RenderBlocks.tsx`, `src/components/search/SiteSearch.tsx`; Create `src/lib/blog-pagination.ts`, `src/lib/__tests__/blog-pagination.test.ts`, `src/app/(frontend)/blog/data/route.ts`, `e2e/blog-search.spec.ts`.

**Interfaces:**

```ts
type BlogPageInput = { page: number; limit: number; category?: string; tag?: string; query?: string }
type BlogPage = { docs: Post[]; page: number; totalPages: number; totalDocs: number; hasNextPage: boolean }
function fetchPostsPage(payload: Payload, input: BlogPageInput): Promise<BlogPage>
```

`Post` adalah tipe generated. `GET /blog/data?page=...&limit=...&kategori=...&tag=...&q=...` mengembalikan `BlogPage`; validasi page positif, limit 1–30 (default 9), query maksimal 80 karakter. Route ini hanya membaca Payload; tidak membuat penyimpanan baru. Query public memakai access published. Taxonomy filter membaca collection taxonomy penuh, bukan hanya tag dari halaman pertama.

- [ ] Buat fixture 61 artikel melalui tooling staging yang sesuai. Test item ke-61 dapat dijangkau, filter lintas halaman benar, artikel draft tidak muncul, tidak ada ID ganda ketika featured ditampilkan.
- [ ] Tambahkan parser query dan `fetchPostsPage`, bungkus cache per parameter. Pertahankan query latest posts untuk block lain; jangan mengubah semua pemanggil `fetchPosts` tanpa kebutuhan.
- [ ] Ubah BlogIndex memakai initial page server lalu request halaman tambahan. Dedup featured by-ID, reset list ketika filter berubah, pertahankan parameter URL.
- [ ] Tambahkan request sequence/ignore stale result pada SiteSearch dan filter blog. Tes query A yang lambat selesai setelah B tidak mengganti hasil B; unmount tidak mengubah state.
- [ ] Jalankan tes parser serta `e2e/blog-search.spec.ts`; expected semua hasil/filter benar melampaui batas 60. Commit.

## Task 10 — Cache, route, preview dan metadata produksi

**Pemilik:** Backend + Frontend; **paket:** bagian BE-09, FE-05. **Dependensi:** Task 4, Task 9.

**Files:** Modify `src/lib/data.ts`, `queries.ts`, `preview.ts`, `src/hooks/revalidate.ts`, frontend `layout.tsx`, `components/pages/CmsPage.tsx`, route `pratinjau`, sitemap/robots dan route detail yang membutuhkan perubahan; Test `src/hooks/__tests__/revalidate.test.ts`, `src/lib/__tests__/links-seo.test.ts`, `e2e/content-freshness.spec.ts`.

**Interfaces:** Shared `findBySlug` tetap satu jalur detail dan missing document memakai `notFound()`. Cache tagged menginvalidasi list, slug lama/baru dan media terkait. UI action mengembalikan hasil serializable; `router.refresh()` dipakai client setelah sukses, bukan `revalidatePath` dalam action yang dipanggil transition.

- [ ] Tambah tes hook untuk slug berubah, delete dan media replacement; assert semua tag/list/detail terkait diinvalidasi.
- [ ] Pisahkan pembacaan draft/cookie dari jalur halaman publik statis bila build mengklasifikasikannya dinamis. Preview bertanda tangan tetap protected dan no-store; tidak bocor melalui cache publik.
- [ ] Pindahkan site origin ke konfigurasi target yang sengaja publik. Terapkan domain konsisten untuk canonical, OG/SEO plugin image, sitemap, share, email dan download.
- [ ] Build produksi dan inspeksi tabel route. Fixed pages static; detail sesuai ISR; admin/API/preview boleh dinamis. Perbaiki lalu ulangi bila public fixed route masih `ƒ`.
- [ ] Pada staging, ubah penanda unik published, slug dan media melalui tooling resmi. Uji request baru melihat perubahan, route lama mengikuti perilaku yang ditetapkan, serta preview draft tidak terlihat anonim. Jalankan `e2e/content-freshness.spec.ts`; commit beserta bukti.

## Task 11 — Transfer data dan pemulihan staging

**Pemilik:** Platform/Migrasi; **paket:** MG-04–05. **Dependensi:** Task 2–5, akses export resmi.

**Files:** Create `docs/migration/data-map.md`, `docs/migration/reconciliation.md`, `docs/operations/backup-restore.md`. Manifest berisi data pribadi disimpan di lokasi aman di luar Git.

**Interfaces:** Manifest menyimpan collection/ID sumber, ID tujuan jika berbeda, jumlah record, relasi, status, slug, file hash dan hasil validasi. Tidak ada endpoint migrasi publik atau helper REST alternatif.

- [ ] Buktikan tooling resmi dapat membaca schema sumber dan tujuan. Jika belum tersedia, tandai Task 11 tertahan dengan akses yang dibutuhkan, tanpa menulis script alternatif.
- [ ] Uji export/import sampel dengan relasi, media, dokumen privat, draft dan ID string. Catat apakah ID dapat dipertahankan; apabila tidak, gunakan pemetaan menyeluruh sebelum migrasi luas.
- [ ] Transfer staging menggunakan fasilitas resmi; uji menjalankan kembali tidak menggandakan record. Bandingkan jumlah, relasi, checksum dan representasi URL/status setiap domain.
- [ ] Buat backup database dan kedua jenis berkas yang konsisten; simpan salinan terenkripsi di luar VPS. Jangan hanya mengandalkan volume Docker sebagai backup.
- [ ] Pulihkan ke lingkungan terisolasi. Buktikan record, media, izin dan login admin bekerja sesudah restore. Uji pendaftaran uji yang muncul setelah snapshot tercatat sebagai delta yang harus direkonsiliasi.
- [ ] Simpan hasil rekonsiliasi tanpa data sensitif serta runbook restore, lalu commit dokumen. Tetapkan retensi/RPO/RTO bersama operator sebelum rilis; jangan mengklaim angka tanpa ukur.

## Task 12 — Konten resmi, maskot dan tampilan lengkap

**Pemilik:** Konten/Visual + Frontend; **paket:** CT-01–03, FE-04, FE-06. **Dependensi:** Task 4, Task 8–11; inventaris konten dapat dimulai lebih awal.

**Files:** Create `docs/content/completion-matrix.md`; Modify `src/components/layout/Header.tsx`, `MobileDrawer.tsx`, frontend halaman/styles cetak yang ditemukan, `src/components/mascot/Siasat.tsx` dan provider branding sesuai kebutuhan; media/teks di CMS melalui tooling resmi.

**Interfaces:** Matrix mencatat route/block, field kosong, sumber resmi, pemilik konten, status dan bukti preview. Pose greeting/tablet memakai PNG v2 lokal sebagai fallback; CMS tetap mengalahkan fallback.

- [ ] Daftarkan semua `[ISI]` dan CTA tanpa tujuan; kelompokkan akademik, dosen, biaya/jadwal, kontak/kebijakan dan aset. Minta hanya data yang belum ditemukan pada sumber yang diizinkan.
- [ ] Isi dokumen CMS melalui tooling resmi setelah sumber disahkan. Tidak mengganti dengan angka/nama contoh untuk menyelesaikan checklist. Jaga URL dan relasi yang dipakai halaman detail.
- [ ] Tinjau dua maskot bercelana di seluruh pemakai. Untuk empat pose yang masih basic, gunakan imagegen dengan referensi yang ada dan tunjukkan hasil sebelum memasang varian; simpan transparansi dan hubungan Media target.
- [ ] Pasang ilustrasi yang dipilih pada slot gambar sesuai kebutuhan, bukan mengganti ikon/dekorasi sederhana. Verifikasi alt, dimensi, responsive sizing, loading dan crop setiap view.
- [ ] Perbaiki kontras header/cetak dan perilaku newTab pada desktop/dropdown/mobile. Uji keyboard, menu/modal/fokus, error field, zoom dan reduced motion dengan browser.
- [ ] Buka seluruh route publik yang dihasilkan CMS dan cocokkan baseline 57 URL, termasuk detail/404/empty. Catat screenshot 390×844, 768×1024 dan 1440×900 untuk halaman utama; uji cetak tanpa menu putih tak terbaca. Commit kode dan matrix, bukan export data privat.

## Task 13 — Pengujian rilis terpadu

**Pemilik:** QA/Operasional; **paket:** QA-01–04. **Dependensi:** Task 1–12 selesai, kecuali gap yang secara eksplisit dikeluarkan pengguna.

**Files:** Create/Update `playwright.config.ts`, `e2e/journeys.spec.ts`, `e2e/routes.spec.ts`, `docs/operations/release-evidence.md`. Tidak membuat test-only endpoint pada aplikasi produksi.

**Interfaces:** Evidence berisi versi/build ID, waktu, lingkungan, command, hasil dan artefak tanpa PII. Route inventory dihasilkan dari daftar CMS yang sah serta build, bukan hanya URL yang mudah ditemukan di menu.

- [ ] Jalankan typecheck dan suite Vitest target; jelaskan perubahan terhadap baseline 90 tes. Lulus mock bukan pengganti uji berikut.
- [ ] Jalankan build produksi, catat tabel route, deploy image yang sama ke staging. Jangan mengetes dev server lalu mengklaim image produksi lulus.
- [ ] Jalankan journey kontak, konsultasi, brosur bertanda tangan, PMB lengkap/parsial, status benar/salah, kuis/lead, tindakan staf dan template email. Read-back data memakai akun/alat yang berizin.
- [ ] Jalankan matrix peran dan file privat; tes cookie akun nonaktif, input tak sah, CSRF/origin sesuai auth framework, rate limit dan error saat dependensi mati. Pastikan pesan error tidak mengekspos stack/secrets.
- [ ] Ulangi freshness slug/media dan seluruh route generated, SEO/redirect/404 serta browser utama yang tersedia. Catat browser yang belum diuji; jangan mengklaim cakupan Safari/iOS bila hanya Chromium.
- [ ] Ukur payload/gambar serta masalah layout/performa yang menghambat penggunaan. Perbaiki temuan kritis, ulang hanya proof terdampak, simpan release evidence dan commit.

## Task 14 — Cutover, rollback dan handover

**Pemilik:** Koordinator + QA/Operasional; **paket:** OP-03, penutupan Verify production delivery. **Dependensi:** Task 13, domain/VPS/akses operasional serta waktu rilis tersedia.

**Files:** Create `docs/operations/cutover.md`, `docs/operations/rollback.md`, `docs/operations/handover.md`; Update release evidence dan status paket.

**Interfaces:** Source menjadi read-only sebelum snapshot final; target adalah satu-satunya penulis setelah cutover. Rollback merekonsiliasi transaksi target yang lebih baru sebelum membuka penulisan source.

- [ ] Siapkan hasil konkret untuk review: domain tujuan, image digest, database tujuan, daftar route, hasil tes, backup terakhir, pemilik operator dan langkah rollback. Dapatkan instruksi cutover sebelum mutasi DNS atau menutup penulisan sumber.
- [ ] Lakukan rehearsal dengan record uji sebelum/selama jendela perpindahan. Assert setiap record muncul tepat sekali pada sistem akhir; tidak ada dua sistem menerima pendaftaran serentak.
- [ ] Bekukan penulisan source pada jendela yang disetujui, export perubahan terakhir lewat tooling resmi, impor/reconcile, lalu alihkan trafik. Jika freeze/export delta belum dapat dilakukan, jangan alihkan penerimaan PMB.
- [ ] Smoke test pada domain produksi: halaman, gambar, login, private file denial, submit uji yang disetujui, jobs, email dan freshness. Pastikan host/cookie/canonical bukan domain staging.
- [ ] Jika gagal, gunakan runbook rollback: amankan delta target dan rekonsiliasi dulu, lalu alihkan trafik/penulisan. Jangan memulihkan snapshot lama secara buta setelah data baru masuk.
- [ ] Serahkan cara mengelola konten/PMB, akun admin, deployment, backup/restore, monitoring dan kontak operator. Pertahankan snapshot/sumber Make sampai pengguna secara terpisah menyetujui penghentian; jangan menghapus otomatis.
- [ ] Tutup **Verify production delivery** hanya untuk target yang telah dibuktikan. Status Make `verify-deploy` yang belum dijalankan tetap dilaporkan terpisah. Catat hasil dan commit dokumen operasional.

## Penjadwalan agen dan dependensi

Koordinator memegang integrasi dan seluruh perubahan lintas kontrak. Task 1–4 berurutan karena menetapkan runtime, auth dan storage. Setelah Task 5, Task 6 dan 8 dapat dipersiapkan oleh pemilik berbeda tetapi perubahan `forms.ts`, `schemas.ts`, `actions.ts` dan `PmbForms.tsx` tetap diserialkan.

Task 9 dapat paralel dengan pekerjaan formulir setelah kontrak query disepakati; Task 10 menunggu query final. Inventaris konten Task 12 berjalan selama tugas teknis, tetapi mutasi menunggu tooling dan sumber resmi. Task 11 dapat dimulai setelah schema/auth/storage stabil. QA dan cutover menunggu semua dependensinya.

Setiap penugasan agen menyebut task, file yang dimiliki, dependency yang sudah selesai dan perintah verifikasi. Reviewer tidak mengubah file implementer. Kegagalan ketersediaan agen diambil alih koordinator; tidak mengubah status menjadi selesai tanpa hasil.

## Pemetaan dan self-review rencana

- Seluruh 34 paket terpetakan ke Task 1–14; PL pada Task 1, MG pada Task 2–4/11, BE pada Task 5–10, FE/CT pada Task 6/8–10/12, OP/QA pada Task 2/4/7/13–14.
- Kontrak hasil PMB, CAPTCHA, request context, template test, pagination, health, migrasi dan release evidence didefinisikan pada task pemiliknya.
- Lima Review Focus mempunyai langkah uji eksplisit. Rencana mempertahankan batas Make/VPS serta gate data, secret, schema dan cutover.
- Provider/akses tidak direka. Ketika belum tersedia, hanya task yang bergantung langsung ditandai tertahan; perubahan independen tetap dikerjakan.
- Rencana ini telah ditinjau sendiri terhadap rancangan dan audit. Belum ada dependency target dipasang, kode migrasi dijalankan, data dipindah, atau deployment dilakukan dalam tahap perencanaan.
