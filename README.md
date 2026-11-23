# ALUMINDO SEJAHTERA — Company Profile & CMS

Website company profile untuk perusahaan manufaktur aluminium **ALUMINDO SEJAHTERA**, lengkap dengan dashboard admin (CMS) untuk mengelola produk, kategori, layanan, media, konten, pesan kontak, dan pengaturan website.

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Database: MySQL/MariaDB, nama database `alumindo_sejahtera`

---

## 1. Fitur Utama

### Halaman publik
| Halaman | URL | Isi |
|---|---|---|
| Beranda | `/` | Hero, profil singkat, produk unggulan, layanan, keunggulan, statistik, CTA |
| Tentang Kami | `/tentang` | Profil, sejarah, visi, misi, nilai perusahaan, statistik |
| Produk | `/produk` | Pencarian, filter kategori, sorting, pagination |
| Detail Produk | `/produk/:slug` | Gambar, deskripsi, tabel spesifikasi, produk terkait, tombol WhatsApp |
| Kategori Produk | `/produk/kategori/:slug` | Daftar produk per kategori dengan pagination |
| Layanan | `/layanan` | Daftar layanan dari database |
| Kontak | `/kontak` | Informasi kontak, formulir pesan, Google Maps |

Tidak ada fitur portofolio, sesuai kebutuhan.

### Dashboard admin (`/admin`)
- Login/logout dengan cookie HttpOnly.
- Dashboard statistik: jumlah produk, kategori, layanan, media, pesan, pesan belum dibaca, distribusi produk per kategori, pesan terbaru, log aktivitas.
- CRUD produk: publikasi/draft, unggulan, urutan, gambar dari media library, spesifikasi per baris.
- CRUD kategori: status aktif, urutan, gambar, proteksi hapus jika masih dipakai produk.
- CRUD layanan: publikasi, urutan, gambar.
- Media library: upload (klik atau drag & drop), edit judul/alt text, hapus dengan proteksi referensi.
- Konten website: hero, tentang, visi/misi, nilai, keunggulan, statistik, CTA, kontak, social media, footer.
- Pesan masuk: cari, filter status, detail, tandai dibaca/dibalas, hapus.
- Pengaturan website: nama perusahaan, tagline, SEO, logo, favicon.
- Akun: ubah nama, username, email, dan password.

---

## 2. Teknologi

**Frontend**
- React 19 + Vite 7
- React Router 7
- Axios
- Lucide React (ikon)
- CSS global dengan design token (tanpa framework UI)

**Backend**
- Node.js + Express 5 (ES Modules)
- MySQL2 (connection pool, prepared statement)
- JWT + cookie-parser (cookie HttpOnly)
- bcrypt (cost 12)
- Multer (upload gambar)
- express-validator
- Helmet, CORS, express-rate-limit
- dotenv

---

## 3. Struktur Proyek

```
alumindo-sejahtera/
├── backend/
│   ├── config/db.js              # pool MySQL, query(), withTransaction()
│   ├── controllers/              # auth, product, category, service, media, settings, contact, dashboard
│   ├── database/create-admin.js  # CLI tambah admin
│   ├── middleware/               # auth, upload, validate, error
│   ├── routes/                   # definisi endpoint REST
│   ├── uploads/                  # file upload + seed/ (gambar contoh SVG)
│   ├── utils/                    # helper, activity log
│   ├── .env.example
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── admin/                # halaman dashboard admin
│   │   ├── components/           # komponen publik + admin
│   │   ├── context/              # AuthContext, SettingsContext
│   │   ├── hooks/useFetch.js
│   │   ├── pages/                # halaman publik
│   │   ├── services/api.js
│   │   ├── styles/               # global.css, admin.css
│   │   └── utils/format.js
│   ├── index.html
│   └── vite.config.js
├── database/
│   ├── schema.sql                # 8 tabel + relasi + index
│   └── seed.sql                  # data contoh + akun admin
├── scripts/generate-seed-images.mjs
└── README.md
```

---

## 4. Kebutuhan Sistem

- Node.js 20+ (diuji pada Node 24)
- npm 10+
- MySQL 8+ atau MariaDB 10.4+ (XAMPP/Laragon juga bisa)
- Browser modern

---

## 5. Instalasi

### 5.1 Install dependency

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 5.2 Konfigurasi environment backend

Salin `backend/.env.example` menjadi `backend/.env`, lalu sesuaikan:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=alumindo_sejahtera
JWT_SECRET=ganti_dengan_string_acak_minimal_32_karakter
JWT_EXPIRES_IN=8h
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> `JWT_SECRET` wajib diganti dengan string acak minimal 32 karakter. Jangan commit file `.env`.

### 5.3 Membuat database

**Via phpMyAdmin (XAMPP)**
1. Jalankan Apache dan MySQL.
2. Buka `http://localhost/phpmyadmin`.
3. Tab **Import** → pilih `database/schema.sql` → **Go**.
4. Import `database/seed.sql` pada database `alumindo_sejahtera`.

**Via terminal (Windows, XAMPP)**

```bash
C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS alumindo_sejahtera CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
cmd /c "C:\xampp\mysql\bin\mysql.exe -u root alumindo_sejahtera < database\schema.sql"
cmd /c "C:\xampp\mysql\bin\mysql.exe -u root alumindo_sejahtera < database\seed.sql"
```

PowerShell tidak mendukung operator `<`; gunakan `cmd /c` seperti contoh di atas.

### 5.4 Menjalankan aplikasi

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Buka `http://localhost:5173`. Vite mem-proxy `/api` dan `/uploads` ke `http://localhost:5000`.

### 5.5 Build produksi frontend

```bash
cd frontend
npm run build
npm run preview
```

Untuk produksi, sajikan isi `frontend/dist` melalui web server dan arahkan `/api` serta `/uploads` ke backend.

---

## 6. Akun Admin Default

Dari `database/seed.sql`:

| Field | Nilai |
|---|---|
| URL login | `http://localhost:5173/admin/login` |
| Username | |
| Password | |
| Email | |

**Ganti password setelah login pertama** melalui menu **Akun Saya**.

Menambah admin baru:

```bash
cd backend
npm run seed:admin -- <username> <email> <password> [nama]
```

Contoh:

```bash
npm run seed:admin -- manager manager@alumindosejahtera.co.id "Manager#12345" "Site Manager"
```

---

## 7. Skema Database

Database `alumindo_sejahtera` memiliki 8 tabel:

| Tabel | Fungsi |
|---|---|
| `admins` | Akun administrator (hash bcrypt, last login) |
| `media` | Metadata file upload (path, mime, ukuran, alt text) |
| `categories` | Kategori produk (slug unik, status aktif, urutan) |
| `products` | Produk (slug unik, kategori FK, spesifikasi, publikasi, unggulan) |
| `services` | Layanan (judul, deskripsi, detail, gambar, publikasi) |
| `website_settings` | Konten website key-value (text, json, image) |
| `contact_messages` | Pesan formulir kontak + status |
| `activity_logs` | Riwayat aktivitas admin |

Karakteristik:
- Foreign key: `products.category_id → categories.id`, `*.image_id → media.id`, `activity_logs.admin_id → admins.id`.
- Tabel konten (`admins`, `media`, `categories`, `products`, `services`, `contact_messages`) memakai `created_at` dan `updated_at`.
- `website_settings` memakai `updated_at`; `activity_logs` memakai `created_at`.
- Index pada kolom pencarian/filter: slug, status publikasi, kategori, status pesan, dan tanggal.
- Penghapusan kategori dengan produk terkait ditolak (HTTP 409).
- Penghapusan media yang masih direferensikan produk/kategori/layanan/pengaturan ditolak (HTTP 409).

---

## 8. API

Base URL: `http://localhost:5000/api`

Format sukses:

```json
{ "success": true, "data": {}, "meta": { "total": 8, "page": 1, "limit": 9, "totalPages": 1 } }
```

Format error:

```json
{ "success": false, "message": "Pesan error", "errors": [{ "field": "name", "message": "..." }] }
```

### 8.1 Health

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/api/health` | Publik |

### 8.2 Auth

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| POST | `/api/auth/login` | Publik | Body: `identifier`, `password`. Rate limit login. |
| POST | `/api/auth/logout` | Admin | Hapus cookie sesi |
| GET | `/api/auth/me` | Publik | `data: null` jika belum login |
| PUT | `/api/auth/profile` | Admin | Ubah profil/password |

### 8.3 Produk

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/api/products` | Publik |
| GET | `/api/products/:slug` | Publik |
| GET | `/api/products/id/:id` | Admin |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

Query `GET /api/products`:
- `page`, `limit`
- `search` — cari nama/deskripsi singkat
- `category` — slug kategori
- `featured=1` — hanya produk unggulan
- `sort` — `order` (default), `newest`, `oldest`, `name`
- `status=all` — hanya admin, menampilkan draft

### 8.4 Kategori

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/api/categories` | Publik |
| GET | `/api/categories/:slug` | Publik |
| POST | `/api/categories` | Admin |
| PUT | `/api/categories/:id` | Admin |
| DELETE | `/api/categories/:id` | Admin |

Query: `search`, `limit`, `status=all` (admin).

### 8.5 Layanan

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/api/services` | Publik |
| GET | `/api/services/:id` | Publik |
| POST | `/api/services` | Admin |
| PUT | `/api/services/:id` | Admin |
| DELETE | `/api/services/:id` | Admin |

Query: `status=all` (admin).

### 8.6 Media

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/api/media` | Publik (metadata gambar) |
| POST | `/api/media` | Admin, `multipart/form-data` field `image` |
| PUT | `/api/media/:id` | Admin |
| DELETE | `/api/media/:id` | Admin |

Query: `page`, `limit`, `search`, `type=image`.

### 8.7 Pengaturan Website

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/api/settings` | Publik — `{ settings, media }` |
| GET | `/api/settings/all` | Admin — termasuk metadata grup |
| PUT | `/api/settings` | Admin — body `{ settings: { key: value } }` |

Tipe setting:
- `text` — string
- `json` — array/objek (`why_items`, `stats`, `values`, `social`)
- `image` — ID media (disimpan sebagai string)

### 8.8 Kontak

| Method | Endpoint | Akses |
|---|---|---|
| POST | `/api/contact` | Publik (rate limit 5/jam) |
| GET | `/api/contact` | Admin |
| GET | `/api/contact/:id` | Admin — otomatis menandai dibaca |
| PUT | `/api/contact/:id` | Admin — ubah status |
| DELETE | `/api/contact/:id` | Admin |

Query: `page`, `limit`, `search`, `status` (`unread`, `read`, `replied`).

### 8.9 Dashboard

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/api/dashboard/stats` | Admin |
| GET | `/api/dashboard/activity` | Admin |

---

## 9. Upload Gambar

- Field name: `image`
- Format: JPG, JPEG, PNG, WebP
- Ukuran maksimum: 5 MB
- Nama file dibuat otomatis: `<timestamp>-<random>.<ext>`
- Lokasi: `backend/uploads/`
- URL publik: `/uploads/<filename>`
- Validasi dilakukan pada MIME, ekstensi, dan magic byte file.
- Hapus gambar ditolak selama masih dipakai produk, kategori, layanan, atau pengaturan.

Gambar contoh bawaan berada di `backend/uploads/seed/` (SVG). File SVG tidak dapat diunggah melalui media library; file tersebut hanya aset seed.

Regenerasi aset seed:

```bash
node scripts/generate-seed-images.mjs
```

---

## 10. Keamanan

- Password disimpan dengan bcrypt cost 12.
- Semua query database memakai placeholder (parameterized query).
- Validasi dan sanitasi input dengan express-validator.
- Autentikasi JWT di cookie `alumindo_token`: `HttpOnly`, `SameSite=Lax`, `Secure` saat production.
- CSRF guard: request mutasi admin wajib menyertakan header `X-Requested-With: XMLHttpRequest`.
- Helmet untuk header keamanan.
- CORS dibatasi ke `CLIENT_URL`.
- Rate limit untuk login dan formulir kontak.
- Error produksi tidak membocorkan stack trace.
- Rahasia disimpan di `.env`, bukan di source code.
- Upload divalidasi MIME, ekstensi, ukuran, dan isi file.
- Hapus data dilindungi foreign key dan pengecekan referensi.

---

## 11. Testing Manual yang Sudah Dilakukan

- `GET /api/health`, daftar produk, pengaturan publik.
- Login admin, `GET /api/auth/me`, akses dashboard.
- CRUD produk melalui dashboard (tambah, edit, hapus).
- CRUD kategori dan layanan melalui dashboard.
- Upload media via API, edit metadata, hapus media, proteksi media terpakai.
- Kirim pesan kontak, lihat detail, ubah status menjadi `replied`.
- Simpan konten website dan pengaturan; perubahan tampil di halaman publik.
- Pencarian/filter/sorting/pagination produk.
- Halaman detail produk dan produk terkait.
- `npm run build` frontend berhasil.

---

## 12. Troubleshooting

### Backend gagal konek database
- Pastikan MySQL berjalan.
- Periksa `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` di `backend/.env`.
- Pastikan database sudah diimpor.

### Port 5000 atau 5173 dipakai
Ubah `PORT` di `backend/.env`, lalu sesuaikan proxy di `frontend/vite.config.js`. Untuk frontend: `npm run dev -- --port 5174`.

### Login berhasil tetapi dashboard meminta login lagi
- Pastikan frontend diakses melalui `http://localhost:5173`, bukan IP berbeda.
- Pastikan cookie tidak diblokir browser.
- Cek `CLIENT_URL` di `.env` sama dengan origin frontend.

### Error 403 "Origin tidak diizinkan oleh CORS"
Frontend dibuka dari alamat yang tidak ada di `CLIENT_URL`. Di mode development, `localhost`, `127.0.0.1`, dan alamat LAN privat (`192.168.x.x`, `10.x.x.x`, `172.16-31.x.x`) sudah diizinkan otomatis. Jika memakai domain/alamat lain, tambahkan ke `CLIENT_URL`, pisahkan dengan koma:

```env
CLIENT_URL=http://localhost:5173,http://192.168.1.10:5173
```

Lalu restart backend.

### Error 403 saat simpan data admin
Request mutasi harus menyertakan header `X-Requested-With: XMLHttpRequest`. Axios di `frontend/src/services/api.js` sudah mengaturnya; jangan hapus header tersebut.

### Gambar tidak tampil
- Pastikan backend berjalan dan folder `backend/uploads/` ada.
- Cek URL gambar diawali `/uploads/`.
- Saat production, pastikan web server meneruskan `/uploads` ke backend.

### Upload ditolak
- Format harus JPG/PNG/WebP.
- Ukuran maksimal 5 MB.
- Pastikan field form bernama `image`.

### Hapus kategori/media gagal (409)
Kategori masih memiliki produk, atau media masih dipakai. Pindahkan/hapus referensi terlebih dahulu.

### Import SQL gagal di PowerShell
Gunakan `cmd /c "mysql.exe ... < file.sql"` atau phpMyAdmin.

### Build frontend gagal karena esbuild
Jika npm memblokir postinstall esbuild:

```bash
cd frontend
npm rebuild esbuild
npm run build
```

---

## 13. Catatan Produksi

- Set `NODE_ENV=production` dan `JWT_SECRET` acak yang kuat.
- Gunakan HTTPS agar cookie `Secure` aktif.
- Ganti password admin default.
- Ganti data statistik dan konten seed dengan data resmi perusahaan.
- Backup database dan folder `backend/uploads/` secara berkala.
- Batasi akses `backend/` dan file `.env` dari publik.

---

## 14. Deploy ke Vercel (frontend + backend dalam satu project)

Frontend (`frontend/`) dan API Express (`api/index.js` → `backend/app.js`) dideploy bersamaan sebagai **satu project Vercel** di domain yang sama, jadi cookie login dan CORS tidak bermasalah. Development lokal tidak berubah.

### 14.1 Yang perlu disiapkan sebelum deploy

1. **Database MySQL online.** MySQL XAMPP (`localhost`) tidak bisa diakses dari Vercel. Gunakan MySQL cloud (misalnya TiDB Cloud Starter, Railway, atau hosting MySQL lain), lalu import `database/schema.sql` dan `database/seed.sql`. Jika penyedia tidak mengizinkan `CREATE DATABASE`/`USE`, hapus dua baris itu dari kedua file dan pakai nama database bawaan penyedia di `DB_NAME`.
2. **Vercel Blob (tipe Public).** Vercel tidak menyimpan file upload di disk. Di project Vercel: **Storage → Create Storage → Blob → Public**, lalu hubungkan ke project. Tanpa ini, fitur upload di Media Library gagal. Gambar bawaan seed (`/uploads/seed/*.svg`) tetap tampil karena disajikan dari `frontend/public/uploads/seed/`.

### 14.2 Langkah deploy

1. Push repo ke GitHub (file `.env` tidak ikut karena di-ignore).
2. Di Vercel: **Add New → Project → Import** repo ini.
3. Biarkan **Root Directory** di `./` (jangan pilih `frontend`). Jika muncul pilihan framework, pilih **Other**. `vercel.json` sudah mengatur install, build, dan routing.
4. Isi **Environment Variables** (Settings → Environment Variables):

| Variabel | Nilai |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Dari penyedia MySQL cloud |
| `DB_SSL` | `true` (jika penyedia mewajibkan SSL/TLS) |
| `JWT_SECRET` | String acak minimal 32 karakter |
| `JWT_EXPIRES_IN` | `8h` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | URL project, mis. `https://nama-project.vercel.app` (opsional jika frontend dan API satu domain) |

   `BLOB_STORE_ID` dan `VERCEL_OIDC_TOKEN` ditambahkan otomatis saat store Blob dihubungkan ke project.
5. Klik **Deploy**. Setelah selesai, cek `https://nama-project.vercel.app/api/health`, harus menampilkan `database: connected`.
6. **Segera ganti password admin default** lewat menu **Akun Saya**. Repo ini publik, jadi akun bawaan dari `seed.sql` dikenal siapa pun.

### 14.3 Catatan

- Ukuran upload gambar maksimal **4 MB** (Vercel membatasi body request fungsi 4,5 MB).
- Jika `/api/health` menampilkan error koneksi database, cek `DB_*`, `DB_SSL`, dan pastikan penyedia MySQL mengizinkan koneksi dari luar (IP allowlist terbuka).
- Setelah mengubah Environment Variables, lakukan **Redeploy** agar nilainya terbaca.
- Jika menjalankan `node scripts/generate-seed-images.mjs`, salin hasilnya juga ke `frontend/public/uploads/seed/`.
