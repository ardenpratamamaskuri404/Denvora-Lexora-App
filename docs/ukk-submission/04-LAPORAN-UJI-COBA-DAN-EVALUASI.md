# Laporan Uji Coba & Evaluasi Singkat — Denvora Lexora

**Memenuhi Kriteria UKK:** `SPK-4/4` poin 4 (*Laporan evaluasi singkat*) & `PPsp 1.19–1.23` (*Kebutuhan uji coba, dokumentasi uji coba, data uji, eksekusi pengujian, dan evaluasi hasil uji coba*).

---

## 1. Kebutuhan & Lingkungan Uji Coba (Offline Localhost)

* **Sistem Operasi / Runtime:** Windows, Node.js + npm, Laragon MySQL `127.0.0.1:3306` (`db_denvora_lexora`), Mailpit SMTP `127.0.0.1:1025` / Web `http://127.0.0.1:8025`.
* **Data Uji Awal & Koleksi:** 5 pengguna seed (`admin`, `petugas1`, `siswa1`, `siswa2`, `siswa_nonaktif`), 4 kategori buku, **30 judul buku aktif** (6 koleksi seed inti + 24 buku hasil scraping lokal dengan 29 cover tersimpan lokal & 30 deskripsi lengkap, termasuk `BK-005` bersaldo stok `0`), dan 3 transaksi contoh (aktif tepat waktu, terlambat, serta dikembalikan).

---

## 2. Daftar Skenario & Data Uji (Black-Box & Integrasi)

| Kode Uji | Skenario Pengujian | Data / Kondisi Masukan | Hasil yang Diharapkan | Status |
| :---: | :--- | :--- | :--- | :---: |
| **UAT-01** | Kesehatan API & Pencarian Katalog Publik | `GET /api/health` & `GET /api/catalog/books?search=Laskar` | HTTP `200`, koneksi MySQL terkonfirmasi, buku *Laskar Pelangi* ditemukan. | Lulus |
| **UAT-02** | Daftar Anggota Siswa & Penguncian Role | `POST /api/auth/register` dengan field `role: "admin"` disisipkan | HTTP `201`, role tetap terkunci `"siswa"`, OTP 6 digit masuk ke Mailpit lokal. | Lulus |
| **UAT-03** | Verifikasi OTP & Login Email Sekolah / Umum | `POST /api/auth/otp/verify` + `POST /api/auth/login` via email `@denvora.sch.id` & `@gmail.com` | Akun terverifikasi (`is_verified = 1`) dan sesi login HTTP-Only cookie diterbitkan. | Lulus |
| **UAT-04** | Penolakan Akun Nonaktif | Login memakai `siswa_nonaktif` (`is_active = 0`) | HTTP `403`, akun ditolak masuk. | Lulus |
| **UAT-05** | Penegakan Hak Akses (RBAC) | Siswa akses `/api/admin/members`; Petugas coba `DELETE /api/admin/books/1` | HTTP `403` pada keduanya; Petugas tetap diizinkan membaca `/api/petugas/members` (`200`). | Lulus |
| **UAT-06** | Validasi Stok Habis & Pinjam-Kembali Atomik | Siswa pinjam buku `id=5` (stok `0`), lalu pinjam `id=1` (stok `> 0`), kembalikan, dan coba kembalikan ganda | Stok `0` ditolak `409`; pinjam sukses `201` (stok berkurang); kembali sukses `200` (stok pulih); kembali ulang ditolak `409`. | Lulus |
| **UAT-07** | Laporan Ringkasan, Ekspor CSV & Pencatatan Log | `GET /api/admin/reports/summary`, `GET /api/petugas/reports/transactions/export`, cek `app.log` | HTTP `200`, file CSV berisi header `Kode Transaksi` tersimpan di `backend/exports/`, dan aktivitas tercatat di `backend/logs/app.log`. | Lulus |
| **UAT-08** | CRUD Anggota Admin dengan Email Umum | Admin tambah dan hapus anggota dengan email `@gmail.com` | Tambah sukses `201`, hapus bersih `200`. | Lulus |
| **UAT-09** | Unggah Cover Buku, Detail Sinopsis, Notifikasi & Profil | Unggah cover ke `/api/petugas/books/cover`, cek `/api/auth/notifications`, `/api/auth/profile` | Gambar tersimpan di `backend/uploads/covers/` (`200`), notifikasi peran & pengaturan akun berfungsi. | Lulus |
| **UAT-10** | Verifikasi Kualitas Statis & Batas Baris Kode | `tsc --noEmit` (backend & frontend), `eslint` (`--max-warnings=0`), dan pemeriksaan `<= 300` baris/file | Seluruh file kode sumber `<= 300` baris dan kompilasi/lint bersih tanpa error maupun warning. | Lulus |

---

## 3. Hasil Eksekusi Uji Terukur

1. **Uji Integrasi Backend (`backend`: `npm run test:smoke` — [`tests/smoke.ts`](../../backend/tests/smoke.ts)):**
   * Seluruh 7 blok asersi pada skenario `UAT-01` s.d. `UAT-08` dijalankan otomatis terhadap `db_denvora_lexora` dan Mailpit lokal → **`ALL_BACKEND_SMOKE_TESTS_PASSED`**.
2. **Pemeriksaan Tipe, Kualitas Kode & Generate Dokumentasi:**
   * Backend `npm run typecheck` (`tsc --noEmit`): **0 error**.
   * Frontend `npx tsc --noEmit` & `npm run lint` (`eslint`): **0 error, 0 warning**.
   * Batas ukuran file `<= 300` baris/file: **`LINE_LIMIT_300_OK`**.
   * Generator Dokumentasi `npm run docs:generate`: **`GENERATED_DOCS_OK modules=99 symbols=262`**.
3. **Verifikasi Katalog & Scraper (`npm run seed:scrape -- --all --limit=5 --apply`):**
   * Menghasilkan `24` buku tambahan dari Open Library API ke [`seed_books_scraped.sql`](../../database/seed_books_scraped.sql) → total **`30` buku**, **`29` cover lokal**, **`30` deskripsi** aktif di `db_denvora_lexora`.
4. **Verifikasi Rute & Antarmuka Browser (`http://localhost:3000`):**
   * Rute `/`, `/login`, `/register`, `/otp`, `/siswa`, `/petugas`, `/admin`, `/splash/logo-mark.png`, dan API Docs `http://localhost:5000/api-docs/` merespons **HTTP `200`**, dengan verifikasi UI browser untuk login Petugas & Siswa, sidebar lipat, notifikasi live, grafik Recharts animasi, modal detail cover & sinopsis, serta halaman Pengaturan Akun.

---

## 4. Laporan Evaluasi Singkat (`SPK-4/4` poin 4)

### A. Pencapaian & Kelebihan Sistem
* **Kesesuaian Alur & Penilaian:** Seluruh alur Gambar Kerja (`SPK-3/4`) serta matriks fitur (`Daftar`, `Login`, `Pemilihan Menu`, `CRUD Transaksi`, `CRUD Buku`, `CRUD Anggota`, dan `Pencarian Kondisi Tertentu`) berjalan lengkap dan aman.
* **Standar Industri & Pengalaman Pengguna:** Dilengkapi sinkronisasi real-time lintas tab & peran, grafik animasi `Recharts` + `Motion`, notifikasi langsung per role, sidebar yang dapat dilipat, pengunggahan cover lokal offline, detail sinopsis buku, serta pengaturan profil & password mandiri.
* **Keamanan & Integritas Data:** Password di-hash menggunakan `bcryptjs`, sesi memakai cookie bertanda tangan HMAC SHA-256 (*HttpOnly*), OTP disimpan dalam bentuk hash SHA-256 sekali pakai, dan pembaruan stok buku menggunakan penguncian transaksi SQL (`SELECT ... FOR UPDATE`).

### B. Keterbatasan Saat Ini
* Pengiriman OTP masih menggunakan Mailpit lokal (sesuai syarat aplikasi *offline localhost* UKK; untuk produksi internet cukup mengganti kredensial SMTP pada `backend/.env`).
* Pengelolaan denda keterlambatan saat ini ditampilkan melalui indikator keterlambatan hari dan catatan transaksi tanpa modul pembayaran kasir/tunai terpisah.

### C. Saran Pengembangan Lanjutan
1. Perhitungan denda otomatis berbasis tarif harian terkonfigurasi beserta riwayat pelunasan denda.
2. Pencetakan kartu anggota perpustakaan & struk bukti peminjaman siap cetak (`window.print()` / PDF).
