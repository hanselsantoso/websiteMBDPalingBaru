# Identitas S1 Manajemen Bisnis Digital ISTTS

Situs menggunakan nama **S1 Manajemen Bisnis Digital**, sesuai dengan [halaman program studi ISTTS](https://istts.ac.id/jurusan/digital-business-management/). ISTTS tampil sebagai nama institusi pendamping.

Logo **Jejak Siasat** memakai huruf MBD dan ekor rubah sebagai lengkung huruf D. Siasat melambangkan rasa ingin tahu dan kebiasaan menguji ide. Ekor yang melengkung mengisyaratkan hubungan antara strategi bisnis dan pemanfaatan teknologi. Visi keilmuan prodi berfokus pada kecerdasan buatan, analitika data, dan pengembangan platform. [Visi keilmuan prodi](https://istts.ac.id/jurusan/digital-business-management/).

Identitas ini mendampingi pembelajaran, kolaborasi riset, dan pengembangan solusi bisnis digital dalam konteks misi fakultas. [Misi Fakultas Sains dan Teknologi ISTTS](https://istts.ac.id/akademik/fakultas-sains-dan-teknologi/).

Logo memadukan navy dan oranye Siasat. Bidang krem menjaga kontras saat logo tampil pada header dan footer gelap. Ikon wajah Siasat dipakai sebagai favicon agar ekspresinya tetap terbaca pada ukuran kecil. Logo resmi institusi dan mitra menggunakan berkas yang disediakan institusi.

Nama diterapkan pada navigasi, footer, metadata, API publik, admin, pengirim email, dan kartu hasil kuis. Pengaturan lama yang masih menyimpan nama kampanye dipetakan ke nama prodi saat dibaca oleh situs, tanpa menulis ulang dokumen CMS. Jika editor mengunggah wordmark atau favicon melalui Media, slot tersebut tetap memakai gambar CMS.

Aset bawaan mencakup [logo Jejak Siasat](../../public/images/brand/mbd-jejak-siasat.webp), [favicon](../../public/images/brand/mbd-siasat-icon.png), dan [25 ekspresi Siasat](../../public/images/mascot/toon/). Situs memakai ekspresi sesuai konteks saat slot pose CMS belum memiliki gambar unggahan. Seluruh ekspresi dapat diperiksa di panel uji animasi Siasat.

## Prompt ImageGen

Aset dibuat dengan ImageGen bawaan. [Prompt Jejak Siasat](./prompt-logo-jejak-siasat.json) · [Prompt ilustrasi kartun](./prompt-logo-dan-ekspresi-siasat.json).

## Animasi Siasat

Galeri publik `/siasat` menampilkan 25 pose dan tiga animasi yang bisa diputar ulang. Tautannya tersedia di footer. Lambaian dipakai pada hero dengan pose sapaan, gerakan mata saat kuis memproses jawaban, dan jempol pada konfirmasi formulir serta brosur.

Tiap animasi memakai [sprite WebP transparan 2 × 2 dan poster](../../public/images/mascot/animation/). Urutan frame dibaca dari kiri ke kanan, atas ke bawah. Satu pemutaran berlangsung 1,8 detik dan berakhir pada frame pertama. Mode Kurangi Gerak memakai gambar diam. Slot dengan unggahan pose dari CMS tetap menampilkan unggahan tersebut.

Frame digambar dengan ImageGen bawaan. [Lihat kumpulan prompt animasi](./prompt-animasi-siasat.json).
