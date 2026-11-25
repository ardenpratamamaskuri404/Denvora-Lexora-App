# Implementation Plan — Denvora Lexora

**Mode Pengerjaan:** Perorangan  
**Simulasi / Target Ujian UKK:** 9 Jam  
**Prinsip Utama:** *Mandatory UKK Core berjalan 100% terlebih dahulu, baru lengkapi fitur `RECOMMENDATION` (`Petugas`, jatuh tempo, ekspor CSV) dan dokumentasi submission.*  

---

## 1. Prioritas Pengerjaan

### Prioritas 1 — Fondasi & Mandatory UKK (Harus Selesai Pertama)
1. Setup struktur folder `frontend/`, `backend/`, `database/`, dan environment `.env`.
2. Implementasi skema MySQL (`users`, `categories`, `books`, `transactions`) + seed akun `admin` & `siswa`.
3. Backend: Autentikasi (`/register`, `/login`, `/logout`, `/me`), RBAC middleware, CRUD Buku, CRUD Anggota, CRUD Transaksi, Peminjaman & Pengembalian atomik, Pencarian buku/transaksi.
4. Frontend: Halaman `/login`, `/register`, Dashboard Admin (3 menu flowmap), Dashboard Siswa (2 menu flowmap), integrasi end-to-end.

### Prioritas 2 — Extended Scope (`RECOMMENDATION` & Bukti Kompetensi PPsp)
1. Penambahan peran `petugas` pada RBAC backend, seeder akun `petugas1`, halaman `/petugas/*`, dan menu Kelola Petugas di Admin.
2. Indikator `due_date` (+7 hari) & status keterlambatan pada tampilan transaksi.
3. Modul `fileHelper.ts` untuk `app.log` dan endpoint ekspor laporan transaksi `.csv` (bukti PPsp 1.12).
4. Penambahan JSDoc konsisten & generate dokumentasi fungsi/prosedur (bukti PPsp 1.13–1.15).

### Prioritas 3 — Debugging, Pengujian & Paket Pengumpulan UKK
1. Pengujian menyeluruh mengacu `TEST-PLAN.md` (dalam kondisi offline localhost).
2. Ekspor final `database/schema.sql` dari MySQL / MySQL Workbench.
3. Penyusunan paket dokumen di `docs/ukk-submission/` (ERD, deskripsi program, dokumentasi fungsi, log debugging, laporan evaluasi singkat).

---

## 2. Urutan Teknis Pengembangan

1. **Database:** Buat database `denvora_lexora` → jalankan DDL tabel & indeks → isi data awal kategori, buku, user (`admin`, `petugas`, `siswa`) → verifikasi relasi di MySQL Workbench.
2. **Backend:**
   - Init Express.js (TypeScript) + `mysql2/promise` pool + `cors` + `errorHandler`.
   - Implementasi `utils/token.ts`, `utils/response.ts`, `utils/fileHelper.ts`.
   - Implementasi `auth` & middleware `authMiddleware` + `requireRole`.
   - Implementasi `categories` & `books` (termasuk query filter kondisi tertentu).
   - Implementasi `members` & `staff`.
   - Implementasi `transactions` (SQL transaction `FOR UPDATE` untuk borrow/return/delete) & `reports` (agregasi array + ekspor CSV).
   - Verifikasi seluruh endpoint via script/REST client sebelum menyentuh UI kompleks.
3. **Frontend:**
   - Setup Tailwind CSS dengan palet Denvora Lexora (`#F6EFE6`, `#E9DCCB`, `#2B1D14`, `#A8643A`, `#8C7B6B`) & font sistem lokal.
   - Buat API client terpusat (`src/lib/api.ts`) dan komponen UI dasar (`Sidebar`, `Modal`, `StatusBadge`, `SearchBar`).
   - Bangun halaman Auth (`/login`, `/register`).
   - Bangun halaman `Siswa` (`/siswa`, `/siswa/borrow`, `/siswa/return`).
   - Bangun halaman `Admin` (`/admin`, `/admin/books`, `/admin/transactions`, `/admin/members`, `/admin/staff`).
   - Bangun halaman `Petugas` (`/petugas`, `/petugas/books`, `/petugas/transactions`, `/petugas/members`).
4. **Integrasi & Verifikasi:** Uji alur lengkap sesuai `USER-FLOW.md` dan `TEST-PLAN.md`.

---

## 3. Pembagian Waktu Pengerjaan (Alokasi Ujian 9 Jam)

| Rentang Waktu | Durasi | Fase | Target Selesai |
|---|---|---|---|
| **Jam 00:00 – 00:45** | 45 menit | Pemeriksaan & Setup | Cek Node.js, MySQL/Laragon, buat struktur folder, init Express & Next.js, konfigurasi `.env`. |
| **Jam 00:45 – 01:45** | 60 menit | Database & Pemodelan | Buat database `denvora_lexora`, tabel + FK, seed data uji, cek relasi di MySQL Workbench, ekspor awal `.sql`. |
| **Jam 01:45 – 04:15** | 2,5 jam | Backend REST API | Auth + RBAC (`admin`, `petugas`, `siswa`), validasi Zod, CRUD Buku/Anggota/Petugas, Transaksi pinjam-kembali atomik, pencarian, ekspor CSV + log file. |
| **Jam 04:15 – 07:00** | 2 jam 45 menit | Frontend UI & Integrasi | Terapkan brand identity Denvora Lexora, halaman Login & Daftar, Dashboard & menu Siswa, Dashboard & menu Admin, serta Dashboard Petugas. |
| **Jam 07:00 – 08:00** | 60 menit | Debugging & Testing | Jalankan semua skenario `TEST-PLAN.md` secara offline, perbaiki bug, catat temuan debugging. |
| **Jam 08:00 – 09:00** | 60 menit | Dokumentasi & Finalisasi | Generate dokumentasi JSDoc, ekspor final `schema.sql`, susun laporan evaluasi & dokumen UKK di pengolah kata / `docs/ukk-submission/`, cek kelengkapan folder proyek. |

---

## 4. Pemetaan Nyata Bukti Kompetensi UKK (`PPsp`)

Agar penilai dapat memverifikasi secara langsung tanpa menebak-nebak, berikut pemetaan seluruh kriteria `PPsp`:

### A. Kriteria Elemen Kompetensi Utama (1.1 – 1.23)

| Kode | Elemen Kompetensi | Bukti Nyata pada Project |
|---|---|---|
| **1.1** | Menerapkan struktur data & akses data | Skema relasional MySQL 4 tabel + objek DTO & array di layer service. |
| **1.2** | Metode pengembangan program | Perencanaan bertahap di `docs/planning/` (*Waterfall/Iterative terstruktur*). |
| **1.3** | Diagram & deskripsi program | Flowchart di `USER-FLOW.md`, ERD di `DATABASE-ERD.md`, deskripsi di `docs/ukk-submission/`. |
| **1.4** | Menerapkan hasil pemodelan ke program | Tabel SQL & relasi FK sesuai persis dengan ERD; alur UI sesuai Flowchart. |
| **1.5** | Mengeksekusi source code | Backend Express TS (`npm run dev` / `npm start`) & Frontend Next.js (`npm run dev/start`) berjalan di localhost. |
| **1.6** | Coding guidelines & best practices | Penamaan konsisten, pemisahan layer, Zod validation, prepared SQL statements, ESLint. |
| **1.7** | Ukuran performansi dalam kode | Pool koneksi MySQL, `LIMIT/OFFSET` paginasi, indeks kolom pencarian, `SELECT` kolom spesifik. |
| **1.8** | Tipe data & control program | Tipe SQL & TypeScript eksplisit (`INT`, `DATE`, `ENUM`, `boolean`), percabangan `if/else` status stok & role. |
| **1.9** | Membuat program sederhana | Modul helper mandiri (mis. penghitung keterlambatan hari, generator kode transaksi). |
| **1.10** | Prosedur & fungsi | Fungsi terisolasi per tanggung jawab di `services/` & `utils/`. |
| **1.11** | Program menggunakan array | `books.map()` / `transactions.filter()` / `reduce()` untuk ringkasan statistik & penyusunan baris CSV. |
| **1.12** | Program untuk akses file | `fs/promises.appendFile` untuk menulis `backend/logs/app.log` & `fs/promises.writeFile` untuk ekspor laporan `.csv`. |
| **1.13** | Dokumentasi modul program | Header komentar modul di setiap file route, controller, service, dan halaman frontend. |
| **1.14** | Dokumentasi fungsi/prosedur/method | Komentar JSDoc (`@param`, `@returns`, `@throws`) pada fungsi backend dan helper frontend. |
| **1.15** | Men-generate dokumentasi | Menjalankan generator dokumentasi (mis. JSDoc CLI lokal / script markdown generator) ke `docs/ukk-submission/api-functions-docs/`. |
| **1.16** | Mempersiapkan kode program | Struktur folder bersih, `.env.example`, script `npm` standar, kode bebas error sintaks. |
| **1.17** | Melakukan debugging | Pemeriksaan log terminal, DevTools Network, SQL error, serta pencatatan kasus bug yang ditemukan. |
| **1.18** | Memperbaiki program | Bukti perbaikan bug yang tercatat pada log debugging hingga lolos pengujian ulang. |
| **1.19–1.23** | Kebutuhan, dokumentasi, data, pelaksanaan & evaluasi uji coba | Tertuang lengkap di `TEST-PLAN.md`, `seed.ts`, serta hasil eksekusi & evaluasi di `docs/ukk-submission/`. |

### B. Kriteria Elemen Kompetensi Pendukung (2.1 – 2.4)

- **2.1 Mengidentifikasi konsep & struktur data:** Penjelasan pilihan tipe data tabel dan relasi pada `DATABASE-ERD.md`.
- **2.2 Mengidentifikasi mekanisme running/eksekusi:** Panduan startup lokal backend, frontend, dan MySQL di `SYSTEM-ARCHITECTURE.md` & `README.md`.
- **2.3 Mengidentifikasi hasil eksekusi:** Verifikasi kesesuaian respons JSON API, perubahan stok MySQL, dan output UI dengan ekspektasi manual.
- **2.4 Melakukan identifikasi kode program:** Struktur direktori dan alur pemanggilan *Route → Middleware → Controller → Service → DB* dijelaskan jelas untuk memudahkan penelusuran kode.

---

## 5. Checklist Deliverables Pengumpulan UKK (SPK-4/4)

- [ ] **1. Folder proyek aplikasi lengkap:** `frontend/` + `backend/` (tanpa `node_modules` saat zip pengumpulan jika dibatasi ukuran, atau lengkap siap jalan lokal).
- [ ] **2. Database `.sql`:** `database/schema.sql` (DDL + seed data uji).
- [ ] **3.a. Dokumentasi ERD:** Diekspor/dirapikan dari `DATABASE-ERD.md` & MySQL Workbench.
- [ ] **3.b. Deskripsi program:** Ringkasan sistem, arsitektur, alur kerja Admin/Petugas/Siswa, dan cara menjalankan.
- [ ] **3.c. Dokumentasi fungsi/prosedur:** Hasil generate JSDoc + tabel fungsi utama.
- [ ] **3.d. Dokumentasi debugging:** Catatan error/bug yang ditemukan selama pengembangan dan cara perbaikannya.
- [ ] **4. Laporan evaluasi singkat:** Ringkasan hasil pengujian `TEST-PLAN.md`, ketercapaian fitur wajib & rekomendasi, serta kesimpulan kelayakan aplikasi.
