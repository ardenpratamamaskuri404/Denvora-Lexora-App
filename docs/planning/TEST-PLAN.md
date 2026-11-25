# Test Plan — Denvora Lexora

**Tujuan:** Memverifikasi seluruh fitur wajib UKK (SPK), peran tambahan `Petugas` (`RECOMMENDATION`), integritas database, keamanan RBAC, dan pemenuhan elemen kompetensi pengujian pada Lembar Penilaian `PPsp 1.19–1.23`.  

---

## 1. Strategi & Cakupan Pengujian

1. **Authentication Testing:** Daftar anggota siswa, login valid (`admin`, `petugas`, `siswa`), penolakan kredensial salah, akun nonaktif, dan logout.
2. **Authorization (RBAC) Testing:** Pemisahan hak akses 3 role di level API backend dan proteksi rute di frontend.
3. **CRUD Testing:** Buku, Kategori, Anggota (`siswa`), Akun `Petugas`, dan Transaksi.
4. **Borrowing & Returning Testing:** Transaksi atomik pengurangan/penambahan stok, pencegahan pinjam saat stok `0`, pencegahan pengembalian ganda, dan pencatatan `due_date` / `return_date`.
5. **Search & Filter Testing:** Pencarian multi-kriteria (judul, penulis, kategori, ketersediaan, status transaksi, rentang tanggal).
6. **Database & API Testing:** Validasi `Zod`, HTTP status codes, integritas Foreign Key, dan ekspor `.sql`.
7. **File Access Testing (PPsp 1.12):** Verifikasi penulisan `backend/logs/app.log` dan hasil unduhan ekspor `.csv`.
8. **Offline Localhost Testing:** Seluruh skenario diuji dengan koneksi internet dimatikan.

---

## 2. Test Data (Data Uji Standar)

Data berikut disiapkan dalam `database/perpustakaan.sql` dan `backend/database/seed.js`:

| Entitas | Data Uji | Keterangan |
|---|---|---|
| **Admin** | `username: admin`, `password: Admin123!` | Role `admin` (kendali penuh) |
| **Petugas** | `username: petugas1`, `password: Petugas123!` | Role `petugas` (operasional) |
| **Siswa 1** | `username: siswa1`, `password: Siswa123!`, `member_code: 2025001` | Role `siswa` (aktif) |
| **Siswa Nonaktif** | `username: siswa_nonaktif`, `is_active: 0` | Untuk uji penolakan akun nonaktif |
| **Buku 1** | `BK-001` — *Pemrograman Web Modern*, `stock_total: 3`, `stock_available: 3` | Uji pinjam normal |
| **Buku 2** | `BK-002` — *Basis Data Relasional*, `stock_total: 1`, `stock_available: 0` | Uji stok habis (ditolak pinjam) |
| **Buku 3** | `BK-003` — *Desain UI/UX Praktis*, `stock_total: 2`, `stock_available: 1` | Punya 1 transaksi `borrowed` aktif milik `siswa1` |

---

## 3. Daftar Test Cases

### A. Autentikasi & Registrasi
| ID | Skenario | Langkah Uji | Expected Result |
|---|---|---|---|
| `TC-AUTH-01` | Daftar anggota baru (Siswa) | Buka `/register`, isi data lengkap, submit ke `POST /api/auth/register`. | Status `201 Created`, user tersimpan dengan `role = 'siswa'` meskipun payload disusupi `role: 'admin'`. |
| `TC-AUTH-02` | Daftar dengan username/NIS duplikat | Submit username yang sudah ada. | Status `409 Conflict`, pesan duplikasi tampil, tidak ada baris ganda di DB. |
| `TC-AUTH-03` | Login valid tiap role | Login sebagai `admin`, `petugas1`, dan `siswa1`. | Status `200 OK`, cookie `HttpOnly` terset, redirect ke dashboard masing-masing. |
| `TC-AUTH-04` | Login password salah / akun nonaktif | Login dengan password salah atau akun `siswa_nonaktif`. | Status `401` / `403`, tetap di halaman login dengan pesan error sesuai flowmap. |

### B. Otorisasi (RBAC 3 Role)
| ID | Skenario | Langkah Uji | Expected Result |
|---|---|---|---|
| `TC-RBAC-01` | Siswa mencoba endpoint Admin/Petugas | Pakai sesi `siswa1`, panggil `POST /api/admin/books` dan `GET /api/petugas/members`. | Status `403 Forbidden`, data DB tidak berubah. |
| `TC-RBAC-02` | Petugas mencoba akses khusus Admin atau Siswa | Pakai sesi `petugas1`, panggil `POST /api/admin/members`, `DELETE /api/admin/books/1`, `GET /api/admin/staff`, dan `POST /api/siswa/transactions/borrow`. | Status `403 Forbidden`; hanya namespace `/api/petugas/*` (`GET /api/petugas/members`, CRU buku, CRUD transaksi) yang diizinkan (`200 OK`). |
| `TC-RBAC-03` | Siswa mengembalikan transaksi milik siswa lain | Pakai sesi `siswa1`, panggil `PATCH /api/siswa/transactions/:idLain/return`. | Status `403 Forbidden`. |
| `TC-RBAC-04` | Akses tanpa login | Panggil `GET /api/siswa/transactions` tanpa cookie sesi. | Status `401 Unauthorized`. |

### C. CRUD Data Master (Buku & Anggota/Petugas)
| ID | Skenario | Langkah Uji | Expected Result |
|---|---|---|---|
| `TC-CRUD-01` | Admin/Petugas tambah & edit buku | Input buku baru valid (`POST /api/admin|petugas/books`), lalu ubah judul & stok total (`PUT`). | Status `201` dan `200`, data terbarui di MySQL. |
| `TC-CRUD-02` | Validasi input kosong/negatif | Kirim `stock_total: -2` atau `title: ""` ke `POST /api/admin/books`. | Status `400 Bad Request` dari validasi `Zod`. |
| `TC-CRUD-03` | Admin hapus buku yang sedang dipinjam | Panggil `DELETE /api/admin/books/:id` untuk `BK-003` yang memiliki transaksi `borrowed`. | Status `409 Conflict`, penghapusan ditolak untuk jaga integritas relasi. |
| `TC-CRUD-04` | Admin kelola Anggota & Petugas | Tambah, edit kelas/status, nonaktifkan anggota (`/api/admin/members`) & tambah akun petugas baru (`/api/admin/staff`). | Tersimpan dengan `role` tepat dan password ter-hash `bcryptjs`. |

### D. Peminjaman, Pengembalian & CRUD Transaksi
| ID | Skenario | Langkah Uji | Expected Result |
|---|---|---|---|
| `TC-TRX-01` | Siswa meminjam buku tersedia (`BK-001`) | Klik Pinjam pada `BK-001` (`POST /api/siswa/transactions/borrow`). | Status `201`, transaksi baru `status='borrowed'`, `due_date = +7 hari`, `BK-001.stock_available` turun dari `3` ke `2`. |
| `TC-TRX-02` | Siswa meminjam buku stok habis (`BK-002`) | Panggil `POST /api/siswa/transactions/borrow` untuk `BK-002`. | Status `409 Conflict`, stok tetap `0`, tidak ada transaksi baru. |
| `TC-TRX-03` | Siswa mengembalikan buku (`BK-003`) | Di menu Pengembalian, klik Kembalikan pada pinjaman `BK-003` (`PATCH /api/siswa/transactions/:id/return`). | Status `200`, transaksi berubah `status='returned'`, `return_date` terisi hari ini, `stock_available` naik dari `1` ke `2`. |
| `TC-TRX-04` | Pengembalian ganda | Ulangi `PATCH /api/siswa/transactions/:id/return` pada transaksi yang sudah `returned`. | Status `409 Conflict`, stok tidak bertambah dua kali. |
| `TC-TRX-05` | Admin/Petugas CRUD transaksi | Buat transaksi manual untuk `siswa1` (`/api/admin|petugas/transactions`), edit catatan, hapus transaksi uji. | Stok sinkron saat create/return/delete. |

### E. Pencarian Kondisi Tertentu & File Access
| ID | Skenario | Langkah Uji | Expected Result |
|---|---|---|---|
| `TC-SRC-01` | Filter buku multi-kondisi | `GET /api/siswa/books?search=Web&availability=available&category_id=1`. | Hanya mengembalikan buku yang cocok semua filter. |
| `TC-SRC-02` | Filter transaksi Admin/Petugas | Panggil `GET /api/admin|petugas/transactions?status=borrowed&date_from=...`. | Menampilkan daftar pinjaman aktif dalam rentang tanggal tersebut. |
| `TC-FILE-01` | Ekspor laporan CSV & File Log | Klik Unduh CSV (`GET /api/admin|petugas/reports/transactions/export`) dan cek `backend/logs/app.log`. | File `.csv` valid terunduh dan dapat dibuka spreadsheet; log aktivitas tertulis di `backend/logs/app.log`. |

---

## 4. Kriteria Evaluasi Pengujian (Alignment PPsp)

1. **Kelulusan Fungsional:** Seluruh test case kategori A–E berstatus **PASS** (100% tanpa error server `500` maupun kebocoran hak akses).
2. **Bukti Uji Coba (`PPsp 1.19–1.23`):** Setiap hasil eksekusi test case dicatat (tanggal uji, input, output aktual, status PASS/FAIL, serta catatan perbaikan jika sempat gagal saat debugging) ke dalam dokumen `docs/ukk-submission/debugging-dan-evaluasi.md`.
3. **Target Nilai Konversi (`PPsp`):** Memenuhi seluruh 23 elemen kompetensi utama dan 4 elemen kompetensi pendukung untuk mencapai kategori **Sangat Kompeten (91–100)**.
