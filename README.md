# Alumindo Jaya — Company Profile

## Struktur

- `frontend/` — React (Vite) + Tailwind CSS
- `backend/` — Node.js + Express + MySQL

---

## Menjalankan Secara Lokal

### 1. Backend

```
cd backend
npm install
copy .env.example .env (Windows)/cp .env.example .env (Mac/Linux)
```

Isi `.env` dengan kredensial database, SMTP, dan JWT.

Import skema database:

```
mysql -u root -p < models/schema.sql
```

Buat akun admin pertama (WAJIB agar bisa login ke dashboard):

```
node scripts/create-admin.js admin PasswordKuatMinimal8Karakter
```

Jalankan server:

```
npm run dev
```

### 2. Frontend

```
cd frontend
npm install
copy .env.example .env      (Windows)   /   cp .env.example .env   (Mac/Linux)
```

Isi `.env`:

```
VITE_API_URL=http://localhost:4000
VITE_WHATSAPP_NUMBER=62812xxxxxxx   <-- ganti dengan nomor WhatsApp bisnis kamu
```

Jalankan:

```
npm run dev
```

Buka `http://localhost:5173`.

---

### 1. CTA WhatsApp

- Tombol mengambang muncul di semua halaman publik (pojok kanan bawah)
- Muncul juga di halaman Kontak, dan di setiap detail produk/proyek portofolio dengan pesan yang otomatis menyebut nama produk/proyek terkait
- Nomor diatur lewat `VITE_WHATSAPP_NUMBER` di `.env` frontend — ganti sekali, berlaku di semua tempat

### 2. Menambahkan Gambar

**Gambar statis** (hero beranda, foto tim, thumbnail kategori layanan/portofolio):

- Lihat `frontend/public/images/README.md` untuk daftar lengkap nama file yang harus dipakai
- Cukup taruh/ganti file dengan nama yang sama, tidak perlu edit kode
- Jika file belum ada, otomatis tampil placeholder rapi (bukan gambar rusak)

**Gambar produk & portofolio** (dinamis, tersimpan di database):

- Dikelola sepenuhnya lewat Dashboard Admin, tidak perlu URL eksternal
- Upload langsung dari komputer lewat form, maksimal 5MB per gambar (JPG/PNG/WEBP/GIF)

### 3. Dashboard Admin

- Akses: `http://localhost:5173/admin/login`
- Login dengan akun yang dibuat lewat `scripts/create-admin.js`
- Menu yang tersedia:
  - **Ringkasan** — jumlah produk, proyek, dan pesan masuk
  - **Pesan Masuk** — daftar pesan dari form Kontak
  - **Produk** — tambah/edit/hapus produk per kategori (Konstruksi, Otomotif, Industri, Retail), lengkap dengan upload gambar
  - **Portofolio** — tambah/edit/hapus proyek per kategori (Konstruksi, Otomotif, Industri), lengkap dengan upload gambar
  - **Konten Halaman** — fondasi CMS untuk teks/gambar bagian lain (belum otomatis tersambung ke halaman publik, lihat catatan di dalam halaman tersebut)

---

## Keamanan yang Diterapkan

- Helmet (HTTP security headers)
- CORS dibatasi ke domain frontend (`CLIENT_URL`)
- express-validator untuk validasi & sanitasi input
- express-rate-limit (5 request/15 menit untuk form kontak, 100/15 menit untuk API umum)
- Prepared statements (mysql2) — aman dari SQL Injection
- JWT untuk sesi admin, password di-hash dengan bcrypt
- Upload gambar: validasi tipe file, batas ukuran 5MB, nama file diacak, hanya admin ter-otentikasi yang bisa upload
