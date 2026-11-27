# Deskripsi Program & Buku Manual Singkat Pengguna — Denvora Lexora

**Proyek:** Denvora Lexora (Sistem Perpustakaan Sekolah Digital — *Offline Localhost*)  
**Paket Soal:** UKK RPL Paket 4 (`KM25.4.1.1`)  
**Teknologi Utama:** Next.js 16 + React 19 + Tailwind CSS v4 (Frontend), Express + TypeScript (Backend), MySQL `db_denvora_lexora` (Database), Mailpit SMTP Lokal (OTP Email).

---

## Bagian I — Deskripsi Program

### 1. Tujuan & Lingkup Aplikasi
**Denvora Lexora** adalah aplikasi web perpustakaan sekolah digital untuk mengelola katalog buku, keanggotaan siswa, akun petugas layanan, serta sirkulasi peminjaman dan pengembalian buku secara terstruktur dan **100% berjalan di localhost tanpa ketergantungan internet**.

Alur kerja utama mengikuti Gambar Kerja `SPK-3/4`:
1. **Gerbang Masuk (`/`, `/login`, `/register`, `/otp`)**: Pengguna membuka beranda, melihat animasi *Splash Screen*, lalu memilih Masuk atau Daftar Anggota. Siswa baru mendaftar lewat `/register`, memverifikasi kode OTP 6 digit melalui Mailpit lokal, dan masuk ke portal.
2. **Portal Siswa (`/siswa`)**: Menampilkan KPI ringkas & grafik peminjaman 7 hari, katalog buku dengan pencarian/filter stok, tombol peminjaman buku, serta daftar pinjaman untuk pengembalian buku.
3. **Portal Petugas (`/petugas`)**: Mengelola data buku & kategori (tambah/ubah/cari), memproses sirkulasi pinjam-kembali, melihat daftar anggota (read-only), serta mengunduh laporan transaksi CSV.
4. **Portal Admin (`/admin`)**: Memiliki seluruh kendali Petugas ditambah penghapusan kategori/buku, serta CRUD penuh **Keanggotaan Siswa** dan **Akun Petugas Layanan**.

---

### 2. Arsitektur Sistem & Integrasi Data

Rujukan diagram visual lengkap tersedia pada:
* Diagram Topologi: [`docs/architecture/system-topology.svg`](../architecture/system-topology.svg)
* Diagram ERD: [`docs/architecture/erd-database.md`](../architecture/erd-database.md)
* Berkas Diagram Sumber: [`docs/denvora-lexora-diagrams.drawio`](../denvora-lexora-diagrams.drawio)

**Skema Basis Data (`db_denvora_lexora` — [`database/schema.sql`](../../database/schema.sql)):**

| Tabel | Fungsi Utama | Relasi Kunci |
| :--- | :--- | :--- |
| `users` | Menyimpan akun `admin`, `petugas`, dan `siswa` beserta `member_code` (NIS), `class_name`, status aktif, dan status verifikasi OTP. | Induk bagi `transactions` & `otp_verifications` |
| `categories` | Menyimpan kategori klasifikasi koleksi buku (unik berdasarkan `name`). | `1 : N` ke `books` (`ON DELETE RESTRICT`) |
| `books` | Menyimpan data koleksi (`book_code`, `title`, `author`, `publisher`, `publication_year`, `stock_total`, `stock_available`, `shelf_location`, `description`, `cover_url`). | Terhubung ke `categories` & `transactions` |
| `transactions` | Mencatat sirkulasi (`transaction_code`, `user_id`, `book_id`, `processed_by`, `borrow_date`, `due_date`, `return_date`, `status`, `notes`). | Terhubung ke `users` & `books` |
| `otp_verifications` | Menyimpan hash SHA-256 kode OTP 6 digit (`otp_hash`), tujuan (`register`/`login`), masa berlaku 10 menit, dan penanda sekali pakai (`consumed_at`). | `N : 1` ke `users` (`ON DELETE CASCADE`) |

---

### 3. Matriks Hak Akses & Fitur (`SPK-4/4`)

| Fitur / Modul | Publik | Siswa | Petugas | Admin |
| :--- | :---: | :---: | :---: | :---: |
| Beranda, Katalog Baca-Saja & Pencarian Live | ✓ | ✓ | ✓ | ✓ |
| Daftar Anggota Baru (`/register`) + Verifikasi OTP | ✓ | — | — | — |
| Login & Logout Multi-Role (`/login`) | ✓ | ✓ | ✓ | ✓ |
| Lihat Cover Sampul, Sinopsis & Pinjam/Kembali Buku | ✗ | ✓ (milik sendiri) | ✓ | ✓ |
| Pencarian Kondisi Tertentu (judul/rak/penerbit/stok/tenggat/kelas) | ✓ (buku) | ✓ | ✓ | ✓ |
| CRUD Kategori & Buku + Unggah Cover Gambar Lokal | ✗ | ✗ | ✓ (tambah/ubah) | ✓ (penuh) |
| Lihat Daftar Anggota Siswa | ✗ | ✗ | ✓ (read-only) | ✓ |
| CRUD Penuh Anggota Siswa & Akun Petugas | ✗ | ✗ | ✗ | ✓ |
| Sinkronisasi Real-Time, Notifikasi Live & Pengaturan Akun | ✗ | ✓ | ✓ | ✓ |
| Ekspor Laporan Transaksi CSV & Log File Lokal | ✗ | ✗ | ✓ | ✓ |

---

### 4. Ringkasan Endpoint Backend REST API (`http://localhost:5000`)

Dokumentasi interaktif lokal tersedia saat backend berjalan di `http://localhost:5000/api-docs`.

* **Umum, Autentikasi, Profil & Notifikasi:**
  * `GET /api/health` — Cek kesehatan server Express & koneksi MySQL.
  * `GET /api/catalog/categories`, `GET /api/catalog/books` — Katalog baca-saja publik.
  * `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/otp/send`, `POST /api/auth/otp/verify`, `POST /api/auth/logout`, `GET /api/auth/me`.
  * `PUT /api/auth/profile`, `PUT /api/auth/password`, `GET /api/auth/notifications` — Pengaturan akun mandiri & notifikasi real-time lintas peran.
* **Namespace Siswa (`/api/siswa/*`):**
  * `GET /categories`, `GET /books`, `GET /books/:id`
  * `GET /transactions`, `POST /transactions/borrow`, `PATCH /transactions/:id/return`
* **Namespace Petugas & Admin (`/api/petugas/*` dan `/api/admin/*`):**
  * Kategori & Buku: `GET/POST/PUT /categories`, `GET/POST/PUT /books`, `POST /books/cover` (unggah gambar sampul offline ke `backend/uploads/covers/`), dan `DELETE` khusus `/api/admin/*`.
  * Transaksi: `GET/POST/PUT/DELETE /transactions`.
  * Laporan: `GET /reports/summary`, `GET /reports/transactions/export` (mengunduh CSV sekaligus menyimpan salinan di `backend/exports/`).
  * Pengguna: `GET /members` (Petugas & Admin); `POST/PUT/DELETE /members` dan `GET/POST/PUT/DELETE /staff` (khusus `/api/admin/*`).

---

## Bagian II — Buku Manual Singkat Pengguna

### 1. Persiapan & Menjalankan Sistem Lokal (Laragon / Offline)
1. Nyalakan **MySQL** (port `3306`) dan **Mailpit** (`SMTP 1025`, Web UI `http://127.0.0.1:8025`) di Laragon / lokal.
2. Impor berkas [`database/schema.sql`](../../database/schema.sql) ke MySQL untuk membentuk database `db_denvora_lexora` beserta data awal (dan opsional [`database/seed_books_scraped.sql`](../../database/seed_books_scraped.sql) untuk menambahkan 24 koleksi buku nyata hasil scraping beserta cover lokal).
3. Jalankan Backend API:
   ```bash
   cd backend && npm run dev
   ```
4. Jalankan Frontend Web (terminal terpisah):
   ```bash
   cd frontend && npm run dev
   ```
5. Buka browser ke **`http://localhost:3000`**.

*Utilitas Scraper Data Seed Tambahan (opsional saat online):* Jalankan `cd backend && npm run seed:scrape -- --all --limit=5 --apply` untuk mengambil buku nyata dari Google Books API / Open Library API beserta gambar cover lokal ke `backend/uploads/covers/` dan menghasilkan [`database/seed_books_scraped.sql`](../../database/seed_books_scraped.sql).

---

### 2. Akun Uji Standar Hasil Seed (`schema.sql`)

| Peran | Username | Email | Password | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin@denvora.sch.id` | `Admin123!` | Aktif & Terverifikasi |
| **Petugas** | `petugas1` | `petugas1@denvora.sch.id` | `Petugas123!` | Aktif & Terverifikasi |
| **Siswa 1** | `siswa1` | `siswa1@denvora.sch.id` | `Siswa123!` | Aktif & Terverifikasi |
| **Siswa 2** | `siswa2` | `siswa2@denvora.sch.id` | `Siswa123!` | Aktif & Terverifikasi |
| **Siswa Nonaktif** | `siswa_nonaktif` | `siswa_nonaktif@denvora.sch.id` | `Siswa123!` | Nonaktif (`is_active = 0`) |

---

### 3. Panduan Penggunaan — Siswa (Anggota)
1. **Pendaftaran Siswa Baru (`/register`):**
   * Klik **Daftar Anggota**, lengkapi *Nama Lengkap*, *NIS / Kode Anggota*, *Kelas*, *Alamat Email* (mendukung email sekolah `@*.sch.id` maupun email umum seperti `@gmail.com`), *Nomor Telepon* (opsional), *Username*, dan *Password*.
   * Klik **Daftar & Kirim Kode Verifikasi**, lalu ambil 6 digit kode OTP di inbox Mailpit lokal (`http://127.0.0.1:8025`) dan masukkan pada halaman `/otp`.
2. **Masuk & Meminjam Buku (`/login` → `/siswa`):**
   * Masuk dengan username/email dan password pada `/login`.
   * Buka tab **Katalog & Pinjam Buku**, cari judul/penulis atau filter ketersediaan, lalu klik tombol **Pinjam** pada buku berstok tersedia (`stock_available > 0`). Tenggat standar peminjaman adalah 7 hari.
3. **Mengembalikan Buku (`/siswa`):**
   * Buka tab **Peminjaman & Pengembalian**, temukan transaksi berstatus *Dipinjam* / *Terlambat*, lalu klik **Kembalikan Buku**. Stok buku akan langsung bertambah kembali secara otomatis.

---

### 4. Panduan Penggunaan — Petugas & Admin
1. **Dashboard Utama:** Menampilkan kartu metrik stok/anggota/pinjaman aktif/terlambat serta grafik aktivitas peminjaman 7 hari terakhir dan distribusi kategori.
2. **Kelola Koleksi Buku & Kategori:** Tambah buku baru, ubah stok/lokasi rak, saring stok habis/tersedia; Admin juga dapat menghapus buku atau kategori yang tidak lagi terikat transaksi.
3. **Sirkulasi (Pinjam-Kembali) & Laporan:** Catat peminjaman atas nama siswa, filter transaksi berdasarkan status/tanggal/keterlambatan, proses pengembalian, edit catatan, atau klik **Ekspor CSV** untuk mengunduh laporan.
4. **Kelola Keanggotaan & Akun Petugas (Khusus Admin):** Tambah, perbarui, nonaktifkan, atau hapus akun Siswa dan Petugas Layanan melalui tab **Keanggotaan Siswa** dan **Akun Petugas Layanan**.
