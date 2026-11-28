# Panduan admin dan editor MBD

Buka `/admin` pada domain target, lalu masuk dengan akun CMS yang diberikan pengelola. Menu dan tombol mengikuti peran akun. Gunakan database staging untuk belajar, mencoba impor, atau mengisi data uji. [Instalasi dan admin pertama](deployment-preparation.md#instalasi-baru-dan-konten-awal)

## Terbitkan atau perbarui halaman

1. Buka **Konten → Halaman**, cari dokumen menurut judul atau slug, lalu ubah judul dan blok pada tab **Konten**. Seret blok untuk mengatur urutan, atau matikan opsi tampil pada blok yang ingin disembunyikan.
2. Gunakan **Simpan draf** untuk pekerjaan yang belum selesai. Pilih **Menunggu review** pada **Alur kerja** bila editor lain perlu memeriksanya. Gunakan **Pratinjau** untuk membuka halaman pada desktop dan ponsel. Tautan pratinjau bertanda tangan untuk draf hanya dibagikan kepada peninjau yang berwenang.
3. Setelah teks dan gambar diperiksa, akun dengan izin terbit dapat memilih **Terbitkan** atau menjadwalkan publikasi bila diperlukan. Buka halaman publik di tab privat untuk mengecek hasil. Saat perlu keluar dari mode draf, buka `/pratinjau/keluar?path=/`.
4. Di **Tampilan → Menu dan CTA**, hubungkan item header, footer, tombol pendaftaran, WhatsApp, dan brosur. Pilih dokumen halaman untuk tautan internal jika tersedia. Gunakan path Indonesia yang baku, misalnya `/program`, karena situs menambahkan awalan bahasa pada tautan publik Inggris.

**Beranda** menggunakan slug `beranda` dan alamat publik `/`. Halaman bawaan lainnya memakai slug seperti `kurikulum`, `dosen`, `program`, `karier`, `blog`, `pmb`, `kuis`, dan `kontak`. Tambahkan halaman kebijakan privasi dan syarat ketentuan, lalu tautkan keduanya dari **Pengaturan situs → Legal**. Gunakan pelacak `[ISI]` di dashboard untuk menemukan fakta yang harus dilengkapi sebelum rilis.

## Kurikulum, silabus, dan dosen

| Lokasi | Field yang diisi | Pemeriksaan publik |
| --- | --- | --- |
| **Akademik → Versi kurikulum** | Nama, tahun, tema dan deskripsi untuk semester 1–8, dan PDF resmi bila ada. Centang **Versi aktif** setelah seluruh mata kuliah beres. | Periksa `/kurikulum` dan `/kurikulum/cetak`. Aktivasi mengarsipkan versi yang sebelumnya aktif. |
| **Akademik → Mata kuliah dan silabus** | Isi identitas, versi, kode resmi, nama, semester, SKS, jenis, tag, deskripsi, dan prasyarat. Pada tab berikutnya lengkapi CPMK, rencana pertemuan, komponen penilaian, referensi, alat, dosen pengampu, dan PDF RPS dari Media. Centang **Tampil di situs** setelah diperiksa. | Uji filter dan pencarian, buka drawer mata kuliah dan halaman `/kurikulum/<slug>`. Cocokkan kode dan SKS dengan referensi, serta jumlahkan bobot penilaian ke 100% saat mengisi komponennya. |
| **Akademik → Dosen** | Isi nama dan gelar, jabatan, bidang, bio, foto, pendidikan, publikasi, dan relasi mata kuliah. Gunakan opsi **Tampilkan email di situs** dan **Tampilkan di beranda** sesuai keputusan program studi. | Setelah terbit, periksa `/dosen`, `/dosen/<slug>`, dan sorotan dosen di beranda. |

Kurikulum 2024 memiliki 38 mata kuliah. Cocokkan daftar dengan data resmi sebelum membuat koreksi. Opsi total SKS berada di **Pengaturan situs → Fitur**. [Data kurikulum](../../seed/curriculum-2024.json)

## Penerimaan mahasiswa baru

1. Di **Penerimaan → Jalur PMB**, isi nama, deskripsi, poin utama, urutan, dan status **Aktif**. Di **Gelombang PMB**, isi nama, tanggal buka dan tutup, kuota, biaya, status, serta catatan pengumuman. Gunakan tanggal resmi yang telah dikonfirmasi.
2. Di **Penerimaan → Pengaturan PMB**, isi tahun akademik, daftar persyaratan, setiap baris biaya dan catatannya, langkah pendaftaran, serta opsi sumber informasi. Periksa juga judul dan isi layar sukses serta pengantar cek status. Kebijakan unggah dokumen dan batas ukuran dikelola di lokasi ini. Koordinasikan perubahan batas dengan operator VPS.
3. Buka dokumen `pmb` pada **Konten → Halaman** untuk mengubah narasi, kartu beasiswa, dan bagian halaman lain. Bila tanggal atau angka juga muncul di blok teks, cocokkan dengan pengaturan PMB. Gunakan **Menu dan CTA** untuk brosur publik. Pilih PDF dari **Media** untuk brosur dan dokumen yang boleh diakses publik.
4. Gunakan **Penerimaan → Pendaftar** dan **Dokumen pendaftar** untuk pekerjaan staf yang berizin. Proses dokumen pendaftar melalui alur privat ini. Pada staging, uji pendaftaran, cek status dengan nomor dan akhiran WhatsApp, lalu cek tampilan jadwal, biaya, dan beasiswa di `/pmb` serta `/en/pmb`.

Rujukan data awal memuat catatan tanggal yang masih memerlukan tinjauan program studi. [Referensi PMB](../../seed/README.md#pmb-dan-blog-mbd)

## Blog, kategori, dan tag

1. Siapkan **Kategori blog** dan **Tag blog** dari grup **Konten**. Buka entri yang sudah ada sebelum menambah tag baru. Gunakan tag **Event** atau **Prestasi** untuk artikel yang sesuai. Kategori dan tag dipilih lewat relasi pada editor artikel.
2. Buka **Konten → Blog → Buat baru**. Isi judul, slug, ringkasan maksimal 240 karakter, sampul dari **Media**, kategori, tag, dan isi artikel. Tetapkan nama penulis yang tampil dan artikel terkait bila diperlukan.
3. Di **Isi artikel**, gunakan toolbar Lexical untuk heading, daftar, kutipan, dan tautan. Pilih teks untuk mengatur font, ukuran, atau warna. Sisipkan gambar melalui menu tambah dan pilih file **Media**. Blok Callout, video YouTube/Vimeo, dan kode tersedia dari menu editor. Periksa kontras warna dan teks alternatif gambar.
4. Simpan draf dan pratinjau sebelum terbit, lalu periksa kartu artikel di `/blog`, filter kategori dan tag, serta `/blog/<slug>`. Di `/en/blog/<slug>`, periksa judul, ringkasan, isi, gambar, dan tautan setelah padanan Inggris disimpan.

## Media dan branding

- Unggah gambar dan PDF publik melalui **Konten → Media**. Isi **Teks alternatif** saat mengunggah dan gunakan keterangan bila dibutuhkan. Kelompokkan aset dengan **Folder media** dan **Tag media**. Untuk foto profil, siapkan rasio 4:5 dan atur crop serta titik fokus.
- Pasang logo terang dan gelap, favicon, serta gambar Open Graph melalui **Tampilan → Branding**. Pada tab **Maskot**, sambungkan aset pose yang diotorisasi dan isi teks alternatif. Tinjau header, footer, dan menu ponsel setelah mengganti logo. Ilustrasi statis yang berada di kode dikelola melalui perubahan repositori. [Peta kode pengembang](panduan-pengembang.md#peta-kode)
- Saat mengganti aset, unggah file baru dan arahkan field terkait ke Media tersebut. Periksa **Dipakai di** sebelum menghapus aset lama. Buka halaman kedua bahasa dari sesi baru dan pastikan gambar serta unduhan bekerja.

## Terjemahan Indonesia dan Inggris

Bahasa Indonesia memakai URL yang sudah ada. Alamat Inggris menambahkan `/en` dengan path dan slug yang sama. Contoh untuk artikel `pameran-proyek` adalah `/blog/pameran-proyek` dan `/en/blog/pameran-proyek`. Halaman, posting, dosen, mata kuliah, dan aset yang sama menjadi sumber kedua tampilan.

1. Salin potongan teks Indonesia dari field sumber. Untuk artikel yang memakai gaya berbeda dalam satu paragraf, editor dapat menyimpan kalimat sebagai beberapa potongan teks. Isi padanan per potongan yang tersimpan dan periksa hasilnya pada halaman Inggris.
2. Buka **Konten → Terjemahan konten**, cari **Teks Indonesia** yang sama, lalu buka entri tersebut atau buat baru. Salin teks persis dengan kapitalisasi, tanda baca, dan spasi yang sama. Isi **Terjemahan Inggris** setelah diperiksa. Padanan digunakan di lokasi yang memakai teks sumber persis itu.
3. Simpan perubahan. Buka `/en` atau route Inggris yang sesuai di jendela privat. Coba tombol bahasa di desktop dan menu ponsel, lalu periksa halaman Indonesia untuk memastikan edit padanan diterapkan pada bahasa yang dimaksud. Jika teks sumber berubah, siapkan padanan untuk nilai baru.

Teks tanpa padanan akan tetap memakai sumber Indonesia. Tinjau halaman Inggris sebagai satu kesatuan untuk menemukan label atau paragraf yang masih memakai bahasa sumber. Untuk otomasi via MCP, ikuti prosedur penulisan dan pemeriksaan di [panduan MCP](mcp-konten.md#perbarui-terjemahan-inggris).

## Pemeriksaan sebelum rilis konten

- Ganti setiap penanda `[ISI]` dengan informasi yang telah disetujui dan periksa judul, teks tautan, tanggal, gambar, serta hubungan dokumen.
- Periksa status draf dan publik di sesi terpisah. Konten master dan pengaturan yang tidak memakai draf langsung berlaku sesuai aturan koleksi.
- Buka halaman, detail, navigasi, dan alur yang terpengaruh pada kedua bahasa serta pada desktop dan ponsel.
