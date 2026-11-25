# API Specification — Denvora Lexora

**Base URL (Lokal):** `http://localhost:5000/api`  
**Interactive Docs (`RECOMMENDATION`):** `http://localhost:5000/api-docs` (`swagger-ui-express` dengan spesifikasi OpenAPI lokal, 100% offline tanpa CDN)  
**Format Data:** `application/json` (kecuali ekspor CSV: `text/csv`)  
**Validasi Input:** `Zod`  
**Konvensi Endpoint:** Dipisah per namespace peran (`/api/auth/*`, `/api/siswa/*`, `/api/petugas/*`, `/api/admin/*`) agar batas otorisasi RBAC eksplisit dan mudah diaudit, sementara di backend tetap memakai *shared services* agar tidak ada duplikasi logika.

---

## 1. Standar Format Response

### Response Sukses
```json
{
  "success": true,
  "message": "Data buku berhasil diambil",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```
*(Field `meta` bersifat opsional untuk endpoint non-paginasi).*

### Response Error
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    { "field": "title", "message": "Judul buku wajib diisi" }
  ]
}
```

### Kode Status HTTP yang Digunakan
- `200 OK` — Permintaan berhasil (`GET`, `PUT`, `PATCH`, `DELETE`, `POST /auth/login`).
- `201 Created` — Data baru berhasil dibuat.
- `400 Bad Request` — Validasi `Zod` gagal atau aturan bisnis sederhana tidak terpenuhi.
- `401 Unauthorized` — Belum login atau token sesi tidak valid/kedaluwarsa.
- `403 Forbidden` — Role pengguna tidak berhak mengakses namespace/endpoint tersebut.
- `404 Not Found` — Data tidak ditemukan.
- `409 Conflict` — Duplikasi data unik (`username`, `book_code`, `member_code`), stok buku habis, atau transaksi sudah dikembalikan.
- `500 Internal Server Error` — Kesalahan tak terduga server/database.

---

## 2. Health Check & Authentication (`/api/health`, `/api/auth/*`)

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/health` | Publik | Cek status server & koneksi database MySQL. |
| `POST` | `/auth/register` | Publik | Pendaftaran anggota baru (**role dikunci `siswa`**) dan kirim OTP ke Mailpit. |
| `POST` | `/auth/login` | Publik | Validasi `username`/`email` & `password`, set cookie sesi `HttpOnly`. |
| `POST` | `/auth/otp/send` | Publik | Kirim / kirim ulang OTP 6 digit ke Mailpit (`register` atau `login`). |
| `POST` | `/auth/otp/verify` | Publik | Verifikasi kode OTP 6 digit dari Mailpit (aktifkan akun / terbitkan cookie sesi). |
| `POST` | `/auth/logout` | Authenticated | Menghapus cookie sesi. |
| `GET` | `/auth/me` | Authenticated | Mengambil profil pengguna yang sedang login. |

### Detail Request & Validasi Auth
- **`POST /auth/register`**
  - Body: `{ name, email, username, password, member_code, class_name?, phone? }`
  - Validasi `Zod`: `name` min 3 char, `email` valid, `username` min 4 char alfanumerik/underscore, `password` min 6 char, `member_code` min 3 char wajib.
  - Aturan: `role` **diabaikan jika dikirim client**, selalu di-hardcode `'siswa'` (`is_verified = 0`), dan mengirim OTP 6 digit ke Mailpit (`127.0.0.1:1025`).
- **`POST /auth/login`**
  - Body: `{ username, password }` (menerima username atau email).
  - Response `200`: `{ user: { id, name, email, username, role, member_code, is_verified } }` + Set-Cookie `denvora_session`.
- **`POST /auth/otp/send` & `POST /auth/otp/verify`**
  - `send`: `{ email, purpose: 'register' | 'login' }` → mengirim OTP 6 digit ke Mailpit (berlaku 10 menit).
  - `verify`: `{ email, otp: '6 digit', purpose: 'register' | 'login' }` → verifikasi hash OTP; jika `login`, langsung set cookie sesi `HttpOnly`.

---

## 3. Query Pencarian Kondisi Tertentu (Berlaku di Semua Role)

### Pencarian Buku (`GET /siswa/books`, `GET /petugas/books`, `GET /admin/books`)
- `search` — mencocokkan `title`, `author`, atau `book_code` (`LIKE %search%`).
- `category_id` — filter berdasarkan kategori.
- `availability` — `all` | `available` (`stock_available > 0`) | `empty` (`stock_available = 0`).
- `page` & `limit` — paginasi (default `page=1`, `limit=10`).

### Pencarian Transaksi (`GET /petugas/transactions`, `GET /admin/transactions`)
- `search` — mencocokkan `transaction_code`, nama/NIS peminjam, atau judul buku.
- `status` — `all` | `borrowed` | `returned`.
- `date_from` & `date_to` — rentang tanggal `borrow_date`.
- `overdue_only` — `true` untuk menampilkan pinjaman aktif yang melewati `due_date`.

---

## 4. Siswa Endpoints (`/api/siswa/*` — `requireRole('siswa')`)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/siswa/categories` | Daftar seluruh kategori buku untuk filter katalog. |
| `GET` | `/siswa/books` | List & pencarian buku dengan kondisi tertentu. |
| `GET` | `/siswa/books/:id` | Detail satu buku beserta nama kategori. |
| `GET` | `/siswa/transactions` | Riwayat transaksi milik siswa yang login (`status`: `all`, `borrowed`, `returned`). |
| `POST` | `/siswa/transactions/borrow` | Pinjam buku (`{ book_id, notes? }`). `user_id` diambil dari sesi login. |
| `PATCH` | `/siswa/transactions/:id/return` | Kembalikan buku milik siswa itu sendiri (cek `trx.user_id === req.user.id`). |

---

## 5. Petugas Endpoints (`/api/petugas/*` — `requireRole('petugas')`, `RECOMMENDATION`)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/petugas/categories` | Daftar kategori buku. |
| `POST` | `/petugas/categories` | Tambah kategori baru (`{ name }`). |
| `PUT` | `/petugas/categories/:id` | Ubah nama kategori *(Delete kategori khusus Admin)*. |
| `GET` | `/petugas/books` | List & pencarian buku dengan kondisi tertentu. |
| `GET` | `/petugas/books/:id` | Detail buku. |
| `POST` | `/petugas/books` | Tambah buku baru. |
| `PUT` | `/petugas/books/:id` | Ubah data & stok buku *(Delete buku khusus Admin)*. |
| `GET` | `/petugas/members` | Lihat & cari daftar anggota `siswa` (**read-only**). |
| `GET` | `/petugas/members/:id` | Detail anggota & ringkasan pinjaman (**read-only**). |
| `GET` | `/petugas/transactions` | List & filter seluruh transaksi. |
| `GET` | `/petugas/transactions/:id` | Detail transaksi. |
| `POST` | `/petugas/transactions` | Catat peminjaman baru untuk anggota (`{ user_id, book_id, borrow_date?, due_date?, notes? }`). |
| `PUT` | `/petugas/transactions/:id` | Perbarui transaksi (tandai kembali, ubah `due_date`, `notes`). |
| `DELETE` | `/petugas/transactions/:id` | Hapus catatan transaksi (jika masih `borrowed`, stok buku dipulihkan +1 secara atomik). |
| `GET` | `/petugas/reports/summary` | Ringkasan statistik operasional perpustakaan. |
| `GET` | `/petugas/reports/transactions/export` | Generate & unduh file `.csv` transaksi sesuai filter (PPsp 1.12). |

---

## 6. Admin Endpoints (`/api/admin/*` — `requireRole('admin')`)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/admin/categories` | Daftar kategori buku. |
| `POST` | `/admin/categories` | Tambah kategori baru (`{ name }`). |
| `PUT` | `/admin/categories/:id` | Ubah nama kategori. |
| `DELETE` | `/admin/categories/:id` | Hapus kategori (ditolak `409` jika masih dipakai buku). |
| `GET` | `/admin/books` | List & pencarian buku dengan kondisi tertentu. |
| `GET` | `/admin/books/:id` | Detail buku. |
| `POST` | `/admin/books` | Tambah buku baru. |
| `PUT` | `/admin/books/:id` | Ubah data & stok buku. |
| `DELETE` | `/admin/books/:id` | Hapus buku (ditolak `409` jika masih ada transaksi aktif). |
| `GET` | `/admin/members` | List & cari anggota `siswa` (`search`, `is_active`). |
| `GET` | `/admin/members/:id` | Detail anggota & ringkasan pinjaman. |
| `POST` | `/admin/members` | Tambah akun anggota (`role` dikunci `'siswa'`). |
| `PUT` | `/admin/members/:id` | Ubah data siswa, status `is_active`, atau reset password opsional. |
| `DELETE` | `/admin/members/:id` | Hapus siswa (ditolak `409` jika masih punya pinjaman aktif). |
| `GET` | `/admin/staff` | List akun `petugas` (`RECOMMENDATION`). |
| `POST` | `/admin/staff` | Tambah akun `petugas` (`role` dikunci `'petugas'`). |
| `PUT` | `/admin/staff/:id` | Ubah data atau status aktif `petugas`. |
| `DELETE` | `/admin/staff/:id` | Hapus akun `petugas`. |
| `GET` | `/admin/transactions` | List & filter seluruh transaksi. |
| `GET` | `/admin/transactions/:id` | Detail transaksi. |
| `POST` | `/admin/transactions` | Buat transaksi pinjam untuk anggota tertentu. |
| `PUT` | `/admin/transactions/:id` | Perbarui status/catatan transaksi. |
| `DELETE` | `/admin/transactions/:id` | Hapus transaksi (jika masih `borrowed`, stok buku dipulihkan +1 secara atomik). |
| `GET` | `/admin/reports/summary` | Ringkasan statistik menyeluruh perpustakaan. |
| `GET` | `/admin/reports/transactions/export` | Generate & unduh file `.csv` transaksi sesuai filter (PPsp 1.12). |

### Body Contoh `POST /admin/books` & `POST /petugas/books`
```json
{
  "book_code": "BK-001",
  "title": "Rekayasa Perangkat Lunak",
  "author": "Ian Sommerville",
  "publisher": "Erlangga",
  "publication_year": 2022,
  "category_id": 1,
  "stock_total": 5,
  "shelf_location": "RAK-A1"
}
```
*(Saat `POST`, `stock_available` otomatis diset sama dengan `stock_total`. Saat `PUT`, `stock_total` tidak boleh lebih kecil dari jumlah eksemplar yang sedang dipinjam aktif).*
