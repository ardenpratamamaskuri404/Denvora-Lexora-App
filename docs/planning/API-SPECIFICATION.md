# API Specification — Denvora Lexora

**Base URL (Lokal):** `http://localhost:5000/api`  
**Format Data:** `application/json` (kecuali ekspor CSV: `text/csv`)  
**Validasi Input:** `Zod`  

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
- `200 OK` — Permintaan berhasil (`GET`, `PUT`, `PATCH`, `DELETE`, `POST /login`).
- `201 Created` — Data baru berhasil dibuat (`POST /register`, `POST /books`, `POST /transactions/borrow`, dll.).
- `400 Bad Request` — Validasi `Zod` gagal atau aturan bisnis sederhana tidak terpenuhi.
- `401 Unauthorized` — Belum login atau token sesi tidak valid/kedaluwarsa.
- `403 Forbidden` — Role pengguna tidak berhak mengakses endpoint.
- `404 Not Found` — Data tidak ditemukan.
- `409 Conflict` — Duplikasi data unik (`username`, `book_code`, `member_code`), stok buku habis, atau transaksi sudah dikembalikan.
- `500 Internal Server Error` — Kesalahan tak terduga server/database.

---

## 2. Authentication & Authorization Endpoints

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `POST` | `/auth/register` | Publik | Pendaftaran anggota baru (**role dikunci `siswa`**). |
| `POST` | `/auth/login` | Publik | Validasi `username` & `password`, set cookie sesi `HttpOnly`. |
| `POST` | `/auth/logout` | Authenticated | Menghapus cookie sesi. |
| `GET` | `/auth/me` | Authenticated | Mengambil profil pengguna yang sedang login. |

### Detail Request & Validasi
- **`POST /auth/register`**
  - Body: `{ name, username, password, member_code, class_name?, phone? }`
  - Validasi `Zod`: `name` min 3 char, `username` min 4 char alfanumerik/underscore, `password` min 6 char, `member_code` wajib.
  - Aturan: `role` **diabaikan jika dikirim client** dan selalu di-hardcode `'siswa'` di backend.
- **`POST /auth/login`**
  - Body: `{ username, password }`
  - Response `200`: `{ user: { id, name, username, role, member_code } }` + Set-Cookie `denvora_session`.

---

## 3. Categories Endpoints

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/categories` | Authenticated (`admin`, `petugas`, `siswa`) | Daftar seluruh kategori buku. |
| `POST` | `/categories` | `admin`, `petugas` | Tambah kategori baru (`{ name }`). |
| `PUT` | `/categories/:id` | `admin`, `petugas` | Ubah nama kategori. |
| `DELETE` | `/categories/:id` | `admin` | Hapus kategori (ditolak `409` jika masih dipakai buku). |

---

## 4. Books Endpoints (CRUD Data Buku & Pencarian)

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/books` | `admin`, `petugas`, `siswa` | List & pencarian buku dengan kondisi tertentu. |
| `GET` | `/books/:id` | `admin`, `petugas`, `siswa` | Detail satu buku beserta nama kategori. |
| `POST` | `/books` | `admin`, `petugas` | Tambah buku baru. |
| `PUT` | `/books/:id` | `admin`, `petugas` | Ubah data buku. |
| `DELETE` | `/books/:id` | `admin`, `petugas` | Hapus buku (ditolak `409` jika masih ada transaksi aktif). |

### Query Pencarian Kondisi Tertentu (`GET /books`)
- `search` — mencocokkan `title`, `author`, atau `book_code` (`LIKE %search%`).
- `category_id` — filter berdasarkan kategori.
- `availability` — `all` | `available` (`stock_available > 0`) | `empty` (`stock_available = 0`).
- `page` & `limit` — paginasi (default `page=1`, `limit=10`).

### Body `POST /books` & `PUT /books/:id`
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

---

## 5. Members & Staff Endpoints (Kelola Anggota & Petugas)

### A. Kelola Anggota (`role = 'siswa'`)

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/members` | `admin`, `petugas` (read-only) | List & cari anggota (`search` nama/username/NIS, `is_active`). |
| `GET` | `/members/:id` | `admin`, `petugas` | Detail anggota & ringkasan pinjaman. |
| `POST` | `/members` | `admin` saja | Tambah akun siswa oleh Admin. |
| `PUT` | `/members/:id` | `admin` saja | Ubah data siswa / status `is_active` / reset password opsional. |
| `DELETE` | `/members/:id` | `admin` saja | Hapus siswa (ditolak `409` jika punya transaksi aktif). |

### B. Kelola Petugas (`role = 'petugas'`) — `RECOMMENDATION`

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/staff` | `admin` saja | List akun petugas. |
| `POST` | `/staff` | `admin` saja | Tambah akun petugas baru (`role` dikunci `'petugas'`). |
| `PUT` | `/staff/:id` | `admin` saja | Ubah data atau status aktif petugas. |
| `DELETE` | `/staff/:id` | `admin` saja | Hapus akun petugas. |

---

## 6. Transactions Endpoints (Peminjaman, Pengembalian, CRUD Transaksi)

### A. Endpoint Siswa (Sesuai Flowmap Siswa)

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/transactions/my` | `siswa` | Riwayat transaksi milik siswa yang login (`status` filter: `all`, `borrowed`, `returned`). |
| `POST` | `/transactions/borrow` | `siswa` | Pinjam buku (`{ book_id, notes? }`). `user_id` diambil dari sesi login. |
| `PATCH` | `/transactions/:id/return` | `siswa` | Kembalikan buku milik siswa itu sendiri (cek kepemilikan `trx.user_id === req.user.id`). |

### B. Endpoint Admin & Petugas (CRUD Transaksi)

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/transactions` | `admin`, `petugas` | Semua transaksi + filter kondisi tertentu (`search`, `status`, `date_from`, `date_to`, `overdue_only`). |
| `GET` | `/transactions/:id` | `admin`, `petugas` | Detail transaksi. |
| `POST` | `/transactions` | `admin`, `petugas` | Buat transaksi pinjam untuk anggota tertentu (`{ user_id, book_id, borrow_date?, due_date?, notes? }`). |
| `PUT` | `/transactions/:id` | `admin`, `petugas` | Perbarui transaksi (mis. ubah status menjadi `returned`, ubah `due_date`, `notes`). |
| `DELETE` | `/transactions/:id` | `admin`, `petugas` | Hapus catatan transaksi (jika masih `borrowed`, stok buku dikembalikan +1 secara atomik). |

---

## 7. Reports & Health Check Endpoints

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/health` | Publik | Cek status server & koneksi database MySQL. |
| `GET` | `/reports/summary` | `admin`, `petugas` | Ringkasan statistik (total judul, stok tersedia, pinjaman aktif, terlambat, total anggota). |
| `GET` | `/reports/transactions/export` | `admin`, `petugas` | Generate & unduh file `.csv` transaksi sesuai filter tanggal/status (PPsp 1.12). |
