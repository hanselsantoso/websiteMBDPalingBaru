# Identitas S1 Manajemen Bisnis Digital ISTTS

Situs menggunakan nama **S1 Manajemen Bisnis Digital**, sesuai dengan [halaman program studi ISTTS](https://istts.ac.id/jurusan/digital-business-management/). ISTTS tampil sebagai nama institusi pendamping.

Logo **MBD** memakai huruf MBD dan ekor rubah sebagai lengkung huruf D. Pivot melambangkan rasa ingin tahu dan kebiasaan menguji ide. Ekor yang melengkung mengisyaratkan hubungan antara strategi bisnis dan pemanfaatan teknologi. Visi keilmuan prodi berfokus pada kecerdasan buatan, analitika data, dan pengembangan platform. [Visi keilmuan prodi](https://istts.ac.id/jurusan/digital-business-management/).

Identitas ini mendampingi pembelajaran, kolaborasi riset, dan pengembangan solusi bisnis digital dalam konteks misi fakultas. [Misi Fakultas Sains dan Teknologi ISTTS](https://istts.ac.id/akademik/fakultas-sains-dan-teknologi/).

Logo memadukan navy dan oranye Pivot. Bidang krem menjaga kontras saat logo tampil pada header dan footer gelap. Ikon wajah Pivot dipakai sebagai favicon agar ekspresinya tetap terbaca pada ukuran kecil. Logo resmi institusi dan mitra menggunakan berkas yang disediakan institusi.

Nama diterapkan pada navigasi, footer, metadata, API publik, admin, pengirim email, dan kartu hasil kuis. Pengaturan lama yang masih menyimpan nama kampanye dipetakan ke nama prodi saat dibaca oleh situs, tanpa menulis ulang dokumen CMS. Jika editor mengunggah wordmark atau favicon melalui Media, slot tersebut tetap memakai gambar CMS.

Aset bawaan mencakup [logo MBD](../../public/images/brand/mbd-jejak-siasat.webp), [favicon](../../public/images/brand/mbd-siasat-icon.png), dan [25 ekspresi Pivot](../../public/images/mascot/toon/). Situs memakai ekspresi sesuai konteks saat slot pose CMS belum memiliki gambar unggahan. Seluruh ekspresi dapat diperiksa di panel uji animasi Pivot.

## Prompt ImageGen

Aset dibuat dengan ImageGen bawaan. [Prompt Jejak Siasat](./prompt-logo-jejak-siasat.json) · [Prompt ilustrasi kartun](./prompt-logo-dan-ekspresi-siasat.json).

## MBD Crew

Galeri publik `/mbd-crew` dan `/en/mbd-crew` menampilkan enam karakter serta 25 pose dan tiga animasi Pivot. Tautan galeri lama diarahkan ke galeri ini. Tautannya tersedia di footer. Lambaian dipakai pada hero dengan pose sapaan, gerakan mata saat kuis memproses jawaban, dan jempol pada konfirmasi formulir serta brosur.

Tiap animasi memakai [sprite WebP transparan 2 × 2 dan poster](../../public/images/mascot/animation/). Browser memilih satu dari empat ukuran WebP yang sudah dikompresi sesuai ruang tampil dan kepadatan layar. Sprite diunduh ketika animasi tampil di layar. Galeri juga menunggu pengunjung menekan tombol putar. Satu pemutaran berlangsung 1,8 detik dan berakhir pada frame pertama. Mode Kurangi Gerak hanya memuat poster. Slot dengan unggahan pose dari CMS tetap menampilkan unggahan tersebut.

| Karakter | Kemampuan yang diwakili |
| --- | --- |
| Pivot | Strategi bisnis dan pengujian asumsi |
| Proto | Prototipe dan desain produk |
| Metric | Pengukuran dan analisis data |
| Flow | Operasi dan rantai pasok |
| Sage | Pemanfaatan AI dan pemeriksaan hasil |
| Reach | Pemasaran dan jangkauan audiens |

Pratinjau galeri tersedia dalam bahasa [Indonesia desktop](../../output/mbd-crew/id-desktop.jpg) dan [Indonesia HP](../../output/mbd-crew/id-mobile.jpg), serta [Inggris desktop](../../output/mbd-crew/en-desktop.jpg) dan [Inggris HP](../../output/mbd-crew/en-mobile.jpg).

Frame digambar dengan ImageGen bawaan. [Lihat kumpulan prompt animasi](./prompt-animasi-siasat.json).
