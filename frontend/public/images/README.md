# Panduan Menambahkan Gambar Statis

Folder ini untuk gambar-gambar "tetap" (bukan produk/portofolio dinamis dari database).
Cukup **ganti file dengan nama yang SAMA PERSIS** seperti di bawah ini -- tidak perlu edit kode sama sekali.
Format yang didukung: .jpg, .jpeg, .png, .webp

## /hero
- `hero-pabrik.jpg` -> gambar besar di Beranda (hero section)

## /about
- `sejarah.jpg` -> gambar di bagian Sejarah, halaman Tentang Kami
- `team-1.jpg`, `team-2.jpg`, `team-3.jpg` -> foto tim manajemen (urut sesuai tampilan)

## /services
Gambar thumbnail untuk 4 kartu kategori layanan (halaman Layanan & Produk):
- `konstruksi.jpg`
- `otomotif.jpg`
- `industri.jpg`
- `retail.jpg`

## /portfolio
Gambar thumbnail untuk 3 kartu kategori portofolio:
- `konstruksi.jpg`
- `otomotif.jpg`
- `industri.jpg`

## /logo
- `logo.png` -> logo perusahaan (dipakai di Navbar), disarankan ukuran persegi/landscape, latar transparan

---

## Bagaimana dengan gambar produk & portofolio individual?
Gambar untuk produk (mis. "Profil Sliding Window 7000 Series") dan proyek portofolio
tersimpan di **database**, bukan file statis -- karena datanya dinamis (bisa ditambah/ubah
kapan saja). Cara menambahkannya:

1. Buka Dashboard Admin di `/admin` (lihat backend/frontend README utama untuk cara login).
2. Masuk ke menu Produk atau Portofolio.
3. Klik "Tambah" atau "Edit", lalu unggah gambar langsung dari komputer Anda lewat form --
   tidak perlu URL eksternal, tidak perlu sentuh kode.

Jika gambar belum ditambahkan, website akan otomatis menampilkan kotak placeholder
abu-abu yang rapi (bukan ikon gambar rusak), jadi tampilan tetap aman.
