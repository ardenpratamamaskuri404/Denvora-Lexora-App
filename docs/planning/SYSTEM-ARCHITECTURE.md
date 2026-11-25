# System Architecture — Denvora Lexora

**Project Name:** Denvora Lexora  
**Arsitektur:** Client–Server Terpisah (Decoupled Frontend, REST API Backend, Relational Database)  
**Lingkungan Target:** Localhost Offline (Windows/Laragon atau Node.js + MySQL lokal)  

---

## 1. Gambaran Umum Arsitektur

Denvora Lexora memisahkan presentation layer, business logic layer, dan data storage layer secara tegas ke dalam proyek dan direktori yang berbeda:

```text
+---------------------------------------+
|          Frontend (Next.js)           |
| React · Tailwind · shadcn/ui · Motion |
| Lucide · Port: http://localhost:3000  |
+-------------------+-------------------+
                  |
                  | HTTP REST API (JSON) + Cookie / Bearer Token
                  v
+-----------------------------------+
|        Backend (Express.js)       |
|  Node.js · Zod · bcryptjs · CORS  |
|  fs/promises (File Logging & CSV) |
|  Port: http://localhost:5000      |
+-----------------+-----------------+
                  |
                  | mysql2/promise (TCP Localhost)
                  v
+-----------------------------------+
|          Database (MySQL)         |
|  Schema: denvora_lexora           |
|  Port: 127.0.0.1:3306             |
+-----------------------------------+
```

### Aturan Kepatuhan Arsitektur
1. Frontend **hanya** menangani tampilan UI, state lokal antarmuka, dan pengiriman permintaan HTTP ke Backend.
2. Frontend **dilarang** mengimpor driver database, mengakses MySQL langsung, atau menggunakan Next.js API Routes / Route Handlers sebagai pengganti Express.js.
3. Backend bertanggung jawab penuh atas autentikasi, otorisasi (RBAC), validasi input (`Zod`), transaksi atomik stok buku, pemrosesan array/laporan, dan akses file lokal.
4. Konfigurasi environment dipisah antara `frontend/.env.local` dan `backend/.env`.

---

## 2. Technology Stack & Rasionalitas

| Layer | Teknologi | Peran & Alasan Pemilihan |
|---|---|---|
| **Frontend** | Next.js (App Router / React) | Routing terstruktur per peran (`/login`, `/register`, `/admin/*`, `/petugas/*`, `/siswa/*`), komponen modular. |
| | Tailwind CSS | Styling konsisten menggunakan palet Cream Mocha (`#F6EFE6`, `#E9DCCB`, `#2B1D14`, `#A8643A`, `#8C7B6B`) tanpa CSS eksternal. |
| | `shadcn/ui` (Radix UI primitives) | Komponen aksesibel yang disalin lokal (`Button`, `Input`, `Dialog`, `Select`, `Table`, `Badge`, `Sheet`, dll.) dan dikustomisasi penuh ke tema Cream Mocha (`RECOMMENDATION`). |
| | `motion` | 1 library animasi ringan untuk transisi modal, tab indicator, dan *scroll reveal* (`whileInView`) secara tenang tanpa `lenis`/`gsap` (`RECOMMENDATION`). |
| | `lucide-react` | Paket ikon SVG lokal (ter-bundle di `node_modules` sekaligus ikon default `shadcn/ui`), tampil sempurna tanpa internet. |
| **Backend** | Node.js + Express.js (TypeScript) | Runtime ringan dan *type-safe* untuk REST API lokal (`tsx` saat dev/start, validasi tipe via `tsc --noEmit`). |
| | `mysql2/promise` | Koneksi pool async/await, mendukung *prepared statements* dan transaksi SQL. |
| | `bcryptjs` | Hashing password aman secara lokal tanpa dependensi native compiler C++. |
| | `zod` | Validasi skema request body, query, dan params yang tegas dan terstruktur. |
| | `cors` | Mengatur izin origin `http://localhost:3000` dengan dukungan kredensial. |
| | `swagger-ui-express` | Dokumentasi REST API interaktif lokal di `/api-docs` menggunakan file OpenAPI lokal tanpa internet (`RECOMMENDATION`). |
| | `nodemailer` + Mailpit lokal | Pengiriman email OTP 6 digit ke SMTP Mailpit Laragon (`127.0.0.1:1025` & Web UI `http://127.0.0.1:8025`) secara 100% offline. |
| | Node `crypto` & `fs/promises` (built-in) | Penandatanganan token sesi HMAC-SHA256, hashing OTP, dan akses file lokal (CSV export & log) **tanpa ketergantungan cloud**. |
| **Database** | MySQL + MySQL Workbench | RDBMS lokal yang stabil, mudah diekspor ke `.sql` untuk deliverable UKK. |

---

## 3. Tanggung Jawab Setiap Layer

### A. Frontend (`frontend/`)
- Menyajikan halaman Auth (`Login`, `Daftar Anggota`) dan Dashboard berbasis peran.
- Menyimpan state pengguna yang sedang login melalui endpoint `/api/auth/me`.
- Mengirim permintaan REST melalui satu helper terpusat (`lib/api.ts`) yang menangani base URL backend, header JSON, serta penanganan error HTTP (`401` redirect ke login, `403` tampilan akses ditolak).

### B. Backend (`backend/`)
Dibagi ke dalam pola **Routes → Middlewares → Controllers → Services → Database/Utils**:
- **Routes (`src/routes/`):** Pemetaan URL endpoint dan pemasangan middleware autentikasi serta otorisasi peran.
- **Middlewares (`src/middlewares/`):**
  - `authMiddleware`: Memverifikasi token sesi dari `httpOnly` cookie atau header `Authorization: Bearer`.
  - `requireRole(...roles)`: Menolak akses dengan `403 Forbidden` jika `req.user.role` tidak sesuai.
  - `validate(schema)`: Memvalidasi payload menggunakan `Zod`.
  - `errorHandler`: Penanganan error terpusat dengan format JSON seragam.
- **Controllers (`src/controllers/`):** Menerima `req`, memanggil service, memformat response HTTP (`200`, `201`, dll.).
- **Services (`src/services/`):** Berisi seluruh *business logic* (hashing password, pengecekan stok dalam transaksi DB, pengolahan array untuk rekap statistik & CSV).
- **Utils (`src/utils/`):** Helper token HMAC (`token.ts`), helper file log & ekspor CSV (`fileHelper.ts`), serta konfigurasi pool MySQL (`src/config/db.ts`).

### C. Database (`database/`)
- Menyimpan data persisten dalam 4 tabel ternormalisasi (`users`, `categories`, `books`, `transactions`).
- Menegakkan integritas referensial melalui Foreign Key dan constraint unik (`username`, `member_code`, `book_code`, `transaction_code`).

---

## 4. Mekanisme Komunikasi REST API & Autentikasi

### Alur Autentikasi & Sesi
1. Pengguna mengirim `POST /api/auth/login` berisi `{ username, password }`.
2. Backend mencari pengguna di tabel `users` berdasarkan `username`, memverifikasi `is_active = 1`, lalu mencocokkan password dengan `bcryptjs.compare()`.
3. Jika valid, backend membuat token bertanda tangan HMAC-SHA256 (memuat `id`, `username`, `role`, `exp`) menggunakan `SESSION_SECRET` dari `backend/.env` dan mengirimkannya melalui cookie `HttpOnly; SameSite=Lax` (sekaligus mengembalikan profil user non-sensitif di JSON).
4. Setiap request selanjutnya dari frontend menyertakan `credentials: 'include'` sehingga cookie terkirim otomatis ke Express.js.
5. Saat `POST /api/auth/logout`, backend membersihkan cookie sesi.

### Alur Otorisasi (RBAC 3 Role — Namespace Per Peran)
Setiap peran memiliki namespace endpoint masing-masing agar pemisahan hak akses jelas di API maupun log, sambil tetap berbagi controller/service yang sama di backend (tanpa duplikasi logika):
- **`admin` (`/api/admin/*`):** Kendali penuh atas `/api/admin/books` (CRUD + Delete), `/api/admin/categories` (CRUD + Delete), `/api/admin/members` (CRUD), `/api/admin/staff` (CRUD `petugas`), `/api/admin/transactions` (CRUD), dan `/api/admin/reports/*`.
- **`petugas` (`/api/petugas/*` — `RECOMMENDATION`):** Akses operasional harian ke `/api/petugas/books` (CRU tanpa Delete), `/api/petugas/categories` (CRU tanpa Delete), `/api/petugas/transactions` (CRUD), `/api/petugas/reports/*`, dan `GET /api/petugas/members` (read-only). Ditolak (`403`) jika mengakses `/api/admin/*` atau `/api/siswa/*`.
- **`siswa` (`/api/siswa/*`):** Akses ke `GET /api/siswa/books`, `GET /api/siswa/categories`, serta transaksi miliknya sendiri (`GET /api/siswa/transactions`, `POST /api/siswa/transactions/borrow`, `PATCH /api/siswa/transactions/:id/return`). Ditolak (`403`) jika mengakses `/api/admin/*` atau `/api/petugas/*`.

---

## 5. Struktur Folder Proyek

```text
sistem-peminjaman-buku/
├── frontend/
│   ├── public/
│   │   ├── images/                       # Logo, hero 3D SVG, wave-divider, fitur-*, login/register SVG
│   │   └── videos/denvora-landing-welcome.mp4
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                  # Beranda (Hero, Cerita Video Reveal, Pilar Literasi)
│   │   │   ├── fitur/page.tsx            # Halaman Layanan Perpustakaan (/fitur)
│   │   │   ├── alur/page.tsx             # Halaman Panduan Peminjaman (/alur)
│   │   │   ├── tentang/page.tsx          # Halaman Tentang Kami & FAQ (/tentang)
│   │   │   ├── login/page.tsx            # Halaman Login kurva split-card (/login)
│   │   │   ├── register/page.tsx         # Daftar Anggota khusus Siswa + kirim OTP (/register)
│   │   │   ├── otp/page.tsx              # Verifikasi OTP 6 digit via Mailpit (/otp)
│   │   │   ├── admin/                    # Dashboard, Buku, Anggota, Petugas, Transaksi, Laporan
│   │   │   ├── petugas/                  # Dashboard Petugas, Buku, Transaksi, Daftar Anggota
│   │   │   └── siswa/                    # Dashboard Siswa, Katalog & Pinjam, Pengembalian
│   │   ├── components/                   # landing/ (Navbar, Hero, Story, Pillars, Views, Footer) & ui/ (Button, Badge)
│   │   ├── lib/                          # API client & helper formatting (`utils.ts`)
│   │   └── types/                        # TypeScript interfaces
│   ├── .env.local.example
│   └── package.json
├── backend/
│   ├── logs/                             # Output file log lokal (PPsp 1.12)
│   ├── exports/                          # Output sementara / arsip CSV ekspor (PPsp 1.12)
│   ├── src/
│   │   ├── config/                       # env.ts & db.ts (MySQL2 pool)
│   │   ├── middlewares/                  # auth.ts, validate.ts, errorHandler.ts
│   │   ├── routes/                       # auth, siswa, petugas, admin
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── validators/                   # Zod schemas
│   │   ├── utils/                        # token.ts, fileHelper.ts, response.ts
│   │   ├── docs/openapi.ts               # Spesifikasi Swagger lokal
│   │   ├── types/express.d.ts
│   │   └── app.ts & server.ts
│   ├── database/seed.ts                  # Seeder akun awal & data contoh
│   ├── tsconfig.json
│   ├── .env.example
│   └── package.json
├── database/
│   └── schema.sql                        # Schema + seed siap import MySQL Workbench
├── docs/
│   ├── assets/denvora-lexora-logo.png
│   ├── architecture/                     # Diagram pendukung arsitektur
│   ├── planning/                         # 8 dokumen perencanaan (Single Source of Truth)
│   └── ukk-submission/                   # Deliverable dokumentasi UKK (ERD, deskripsi, debugging, evaluasi)
├── LICENSE
└── README.md
```

---

## 6. Menjalankan Aplikasi Secara Lokal (Offline Localhost)

### Prasyarat Lokal
- Node.js v18+ & npm
- MySQL Server (mis. bawaan Laragon) berjalan di `127.0.0.1:3306`

### Konfigurasi Environment
**`backend/.env`**
```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=denvora_lexora
SESSION_SECRET=ganti_dengan_secret_acak_lokal
FRONTEND_ORIGIN=http://localhost:3000
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Langkah Menjalankan
1. Import `database/schema.sql` ke MySQL (via MySQL Workbench atau CLI `mysql`).
2. Jalankan backend:
   ```bash
   cd backend && npm install && npm run dev
   ```
3. Jalankan frontend (terminal baru):
   ```bash
   cd frontend && npm install && npm run dev
   ```
4. Buka browser ke `http://localhost:3000` (tanpa koneksi internet).

---

## 7. Pemetaan terhadap Penilaian Kompetensi UKK (PPsp)

| Kode PPsp | Elemen Kompetensi | Wujud Nyata dalam Arsitektur |
|---|---|---|
| 1.1 & 2.1 | Struktur data & aksesnya | Tabel relasional MySQL, objek DTO, dan array hasil query di backend. |
| 1.3 & 1.4 | Diagram, deskripsi & pemodelan | ERD Mermaid, Flowchart USER-FLOW, dan implementasinya di SQL + Express. |
| 1.6 | Coding guidelines & best practices | Pemisahan layer MVC-Service, validasi Zod, parameterized SQL, eslint. |
| 1.7 | Ukuran performansi kode | Connection pooling MySQL, indeks database pada kolom pencarian, query terfilter. |
| 1.10 | Prosedur dan fungsi | Fungsi service, helper token, helper formatting tanggal & validasi stok. |
| 1.11 | Penggunaan array | Pengolahan array buku, filter multi-kondisi, agregasi statistik dashboard & baris CSV. |
| 1.12 | Akses file | Modul `fs/promises` di `fileHelper.js` untuk menulis `backend/logs/app.log` & generate file ekspor `.csv`. |
| 1.13–1.15 | Dokumentasi modul, fungsi & generate | JSDoc di seluruh service/controller + generate dokumentasi statis & Swagger UI `/api-docs` (`swagger-ui-express`). |
