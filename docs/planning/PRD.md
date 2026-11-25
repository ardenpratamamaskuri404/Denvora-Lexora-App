# Product Requirements Document (PRD) — Denvora Lexora

**Project Name:** Denvora Lexora  
**Project Type:** Digital Library Management System (Perpustakaan Sekolah Digital)  
**Slogan:** *Where Knowledge Finds Its Way.*  
**Acuan Resmi:** Soal Praktik Kejuruan (SPK) UKK RPL Paket 4 `KM25.4.1.1` (2025/2026) & Lembar Penilaian `PPsp`  
**Status Dokumen:** Single Source of Truth — Tahap Perencanaan  

---

## 1. Project Overview

**Denvora Lexora** adalah aplikasi web Perpustakaan Sekolah Digital berbasis arsitektur terpisah (*Frontend* Next.js, *Backend* Express.js REST API, dan *Database* MySQL) yang dirancang untuk mendigitalisasi pengelolaan data buku, keanggotaan, serta transaksi peminjaman dan pengembalian buku di lingkungan sekolah.

Aplikasi dijalankan secara lokal pada `localhost` tanpa ketergantungan internet saat beroperasi, mematuhi seluruh alur *flowmap* dan matriks hak akses resmi UKK RPL Paket 4, serta menambahkan peran operasional **Petugas** dan fitur pendukung terukur (`RECOMMENDATION`) untuk memperkuat nilai portofolio dan pembuktian kompetensi PPsp.

---

## 2. Project Objectives

1. **Memenuhi Standar Kelulusan UKK RPL Paket 4:** Mengimplementasikan seluruh alur pada *flowmap* resmi SPK-3/4, tabel hak akses SPK-4/4, serta seluruh 23 elemen kompetensi utama dan 4 elemen pendukung pada PPsp.
2. **Digitalisasi Transaksi Perpustakaan:** Menggantikan pencatatan manual peminjaman dan pengembalian buku dengan sistem basis data relasional yang menjaga konsistensi stok buku secara otomatis.
3. **Pemisahan Tanggung Jawab (RBAC) yang Aman:** Menempatkan **Admin** sebagai pemegang kendali penuh (setara *super admin* perpustakaan), **Petugas** (`RECOMMENDATION`) sebagai operator harian, dan **Siswa/User** sebagai anggota peminjam.
4. **Siap Berjalan Offline di Localhost:** Seluruh aset, font, ikon, API, dan basis data berjalan lokal tanpa memanggil layanan atau CDN eksternal.

---

## 3. Target Users

Seluruh warga sekolah dan siswa/i serta pengelola perpustakaan sekolah:
- **Kepala/Pengelola Perpustakaan (Admin):** Bertanggung jawab penuh atas data master buku, data anggota, akun petugas, dan seluruh transaksi.
- **Staf/Pustakawan Piket (Petugas — `RECOMMENDATION`):** Membantu pelayanan peminjaman/pengembalian harian dan pembaruan katalog buku.
- **Siswa / Warga Sekolah (User/Siswa):** Mendaftar sebagai anggota, mencari ketersediaan buku, meminjam buku, dan mengembalikan buku.

---

## 4. User Roles & Access Matrix

> [!IMPORTANT]
> Penambahan peran `Petugas` **tidak mengurangi satu pun** hak akses wajib `Admin` maupun `Siswa` pada dokumen SPK. Penguji UKK yang masuk sebagai `Admin` tetap mendapatkan 100% fitur wajib.

| Kode Fitur | Fitur / Kemampuan | Siswa (Mandatory) | Petugas (`RECOMMENDATION`) | Admin (Mandatory) |
|---|---|---|---|---|
| F-01 | Daftar Anggota (Registrasi Mandiri) | ✔ (role dikunci `siswa`) | ✘ | ✘ (masuk lewat akun seed) |
| F-02 | Login & Validasi Sesi | ✔ | ✔ | ✔ |
| F-03 | Pemilihan Menu di Dashboard | ✔ | ✔ | ✔ |
| F-04 | Lihat & Cari Buku (Kondisi Tertentu) | ✔ | ✔ | ✔ |
| F-05 | Peminjaman Buku (Diri Sendiri) | ✔ | ✘ | ✘ (kelola via CRUD Transaksi) |
| F-06 | Pengembalian Buku (Diri Sendiri) | ✔ | ✘ | ✘ (kelola via CRUD Transaksi) |
| F-07 | Lihat Riwayat Transaksi Pribadi | ✔ | ✘ | ✘ |
| F-08 | CRUD Transaksi (Semua Anggota) | ✘ | ✔ | ✔ |
| F-09 | CRUD Data Buku & Kategori | ✘ | ✔ (CRU; Delete khusus Admin) | ✔ |
| F-10 | Lihat Data Anggota (Read-only) | ✘ | ✔ | ✔ |
| F-11 | CRUD Kelola Anggota (Siswa) | ✘ | ✘ | ✔ |
| F-12 | CRUD Kelola Akun Petugas (`RECOMMENDATION`) | ✘ | ✘ | ✔ |
| F-13 | Ekspor Laporan Transaksi/Buku CSV (`RECOMMENDATION` / PPsp 1.12) | ✘ | ✔ (lihat/ekspor laporan) | ✔ |

---

## 5. Functional Requirements

### A. Mandatory Requirements (Wajib sesuai SPK & Flowmap Resmi)

1. **Autentikasi & Registrasi (`FR-M01`)**
   - Halaman Login menyediakan akses masuk menggunakan `username` dan `password` dengan validasi terhadap hash password (`bcryptjs`) di backend.
   - Jika kredensial salah, sistem menampilkan pesan kesalahan dan mengarahkan pengguna kembali untuk menginput ulang sesuai loop *Validasi Login* pada flowmap.
   - Siswa yang belum terdaftar sebagai anggota dapat membuka alur **Daftar Anggota** terlebih dahulu sebelum login.
2. **Dashboard & Pemilihan Menu (`FR-M02`)**
   - Setelah login berhasil, `Admin` masuk ke **Dashboard Admin** dengan pilihan menu: *Kelola Data Buku*, *Transaksi*, dan *Kelola Anggota* (ditambah menu *Kelola Petugas* & *Laporan* sebagai fitur tambahan).
   - `Siswa` masuk ke **Dashboard Siswa** dengan pilihan menu: *Peminjaman Buku* dan *Pengembalian Buku* (beserta katalog pencarian dan riwayat pinjamannya).
3. **CRUD Data Buku — Admin (`FR-M03`)**
   - Admin dapat melihat daftar buku, menambah buku baru, mengubah data buku, dan menghapus buku (dengan proteksi agar buku yang sedang dipinjam aktif tidak merusak integritas transaksi).
4. **CRUD Kelola Anggota — Admin (`FR-M04`)**
   - Admin dapat melihat daftar anggota, menambah anggota baru, mengedit data/status anggota, dan menghapus/menonaktifkan anggota.
5. **CRUD Transaksi — Admin (`FR-M05`)**
   - Admin dapat melihat seluruh transaksi peminjaman & pengembalian, membuat transaksi untuk anggota, memperbarui status pengembalian/catatan, dan menghapus data transaksi yang tidak valid (dengan sinkronisasi stok buku secara atomik).
6. **Peminjaman & Pengembalian Buku — Siswa (`FR-M06`)**
   - Siswa dapat memilih buku dengan `stock_available > 0` dan melakukan peminjaman; stok tersedia otomatis berkurang 1.
   - Siswa dapat melihat daftar buku yang sedang dipinjamnya dan melakukan pengembalian; status berubah menjadi `returned`, `return_date` tercatat, dan stok tersedia otomatis bertambah 1.
7. **Pencarian untuk Kondisi Tertentu (`FR-M07`)**
   - **Buku:** Pencarian berdasarkan kata kunci (`judul`, `penulis`, `kode buku`), filter `kategori`, dan filter kondisi ketersediaan (`tersedia` / `habis`).
   - **Transaksi (Admin/Petugas):** Filter berdasarkan status (`borrowed` / `returned`), rentang tanggal pinjam, atau kata kunci nama/kode anggota/judul buku.
   - **Anggota (Admin/Petugas):** Pencarian berdasarkan nama, username, atau kode anggota (`NIS`), serta filter status aktif.

### B. Recommended Requirements (`RECOMMENDATION`)

1. **Peran Operasional `Petugas` (`FR-R01`)**
   - Akun `Petugas` memiliki akses harian untuk mengelola katalog buku (`CRUD Data Buku`), melihat daftar anggota, dan memproses `CRUD Transaksi` semua anggota, namun tidak memiliki akses mengubah/menghapus data akun `Admin`, `Petugas` lain, atau `CRUD Kelola Anggota`.
2. **Pengelolaan Akun `Petugas` oleh `Admin` (`FR-R02`)**
   - `Admin` dapat membuat, mengedit, mengaktifkan/menonaktifkan, dan mereset akun `Petugas`.
3. **Tanggal Jatuh Tempo & Indikator Terlambat (`FR-R03`)**
   - Setiap transaksi peminjaman otomatis menetapkan `due_date` (default +7 hari dari `borrow_date`) untuk menampilkan status informasi *"Tepat Waktu"* / *"Terlambat X Hari"* tanpa perhitungan denda uang, menjaga kesederhanaan sesuai batas 9 jam UKK.
4. **Ekspor Laporan CSV & Audit File Log (`FR-R04` — Bukti PPsp 1.12)**
   - Backend menyediakan modul akses file lokal (`fs/promises`) untuk menulis log aktivitas/error aplikasi dan mengekspor laporan transaksi/buku ke format `.csv` yang dapat diunduh dari dashboard Admin/Petugas.

---

## 6. Non-Functional Requirements

| Kategori | Ketentuan |
|---|---|
| **Ketersediaan Offline** | Aplikasi berjalan 100% di `localhost` tanpa akses internet (tidak ada Google Fonts CDN, ikon eksternal, atau API pihak ketiga). |
| **Arsitektur** | Frontend (`Next.js`) dan Backend (`Express.js`) terpisah folder dan proses; komunikasi hanya via REST API JSON; dilarang mengakses MySQL langsung dari Frontend atau memakai Next.js API Routes sebagai pengganti Express.js. |
| **Keamanan** | Password di-hash dengan `bcryptjs`; validasi input ketat dengan `Zod` di backend; proteksi RBAC berbasis middleware untuk setiap endpoint; role registrasi publik dikunci menjadi `siswa`; query SQL menggunakan *parameterized queries* (`mysql2/promise`) untuk mencegah SQL Injection. |
| **Integritas Data** | Operasi peminjaman dan pengembalian menggunakan *database transaction* (`BEGIN`, `COMMIT`, `ROLLBACK`) serta pengecekan stok (`stock_available > 0`) agar tidak terjadi *race condition* atau stok negatif. |
| **Performansi & Kode** | Kode modular, terdokumentasi dengan JSDoc (mendukung pembuktian PPsp 1.13–1.15), menggunakan struktur data & array processing yang terukur (PPsp 1.7 & 1.11). |
| **Realisme Pengerjaan** | Dirancang agar fitur inti dapat diselesaikan oleh 1 orang dalam alokasi waktu ujian 9 jam. |

---

## 7. Scope dan Batasan Sistem

### Termasuk dalam Scope
- Autentikasi multi-role (`admin`, `petugas`, `siswa`) dan registrasi mandiri khusus `siswa`.
- Manajemen buku, kategori, anggota, akun petugas, transaksi pinjam-kembali, pencarian terkondisi, dan ekspor CSV.
- Dokumentasi lengkap UKK (ERD, deskripsi program, dokumentasi fungsi, log debugging, laporan evaluasi).

### Di Luar Scope (Tidak Dibuat)
- Perhitungan dan pembayaran denda uang / payment gateway.
- Notifikasi email / WhatsApp / layanan cloud eksternal (karena aplikasi wajib offline di `localhost`).
- Pemindaian barcode perangkat keras khusus atau upload foto sampul eksternal berbasis cloud.
- Multi-cabang sekolah.

---

## 8. Acceptance Criteria

1. Aplikasi dapat dijalankan secara lokal (`localhost` frontend + backend + MySQL) saat koneksi internet dimatikan.
2. Seluruh alur pada *flowmap* resmi SPK-3/4 untuk **Admin** dan **Siswa** berjalan lancar tanpa error.
3. Registrasi publik hanya menghasilkan role `siswa`; akses endpoint Admin oleh `siswa` atau `petugas` menghasilkan HTTP `403 Forbidden`.
4. Peminjaman buku mengurangi `stock_available` sebesar 1 dan menolak peminjaman jika stok `0`; pengembalian mengembalikan `stock_available` sebesar 1 dan mencegah pengembalian ganda pada transaksi yang sudah `returned`.
5. Pencarian kondisi tertentu dan ekspor file `.csv` menghasilkan data yang akurat dan cocok dengan isi database MySQL.
6. Seluruh 7 deliverables SPK-4/4 tersedia dan konsisten dengan dokumen perencanaan ini.
