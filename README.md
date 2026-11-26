<p align="center">
  <img src="docs/assets/denvora-lexora-logo.png" alt="Logo Denvora Lexora" width="180" />
</p>

<h1 align="center">Denvora Lexora</h1>

<p align="center">
  <em>"Where Knowledge Finds Its Way."</em><br/>
  <strong>Sistem Informasi Peminjaman Buku &amp; Manajemen Perpustakaan Sekolah Digital (100% Localhost Offline)</strong>
</p>

---

## Tentang Denvora Lexora

**Denvora Lexora** adalah sistem informasi perpustakaan digital sekolah berbasis *client–server* terpisah (Frontend **Next.js** + Backend **Express TypeScript REST API** + Database **MySQL**) yang dirancang untuk mengelola katalog buku, pendaftaran anggota, verifikasi OTP email lokal (**Mailpit**), serta sirkulasi peminjaman dan pengembalian buku dengan tiga hak akses (*RBAC*: **Admin**, **Petugas**, dan **Siswa**).

---

## Filosofi Nama: Dari Mana "Denvora Lexora" Berasal?

Nama **Denvora Lexora** (*Built with Vision, Driven by Innovation, Where Knowledge Finds Its Way*) lahir dari perpaduan identitas penggagasnya dengan semangat literasi modern:

### 1. `denvora.` — Identitas Penggagas & Nilai Karya
- **`Den`** diambil langsung dari nama penggagas/pengembangnya, **Arden Pratama Maskuri**.
- **`VORA`** merupakan akronim dari empat pilar prinsip pengembangan karya digital:

| Huruf | Prinsip | Makna |
| :---: | :--- | :--- |
| **V** | **Vision** | Membangun dengan tujuan dan arah yang jelas. |
| **O** | **Originality** | Berpikir kreatif, autentik, dan berbeda. |
| **R** | **Reliability** | Menjaga ketertiban, keamanan data, dan kepercayaan pengguna. |
| **A** | **Advancement** | Terus bertumbuh, belajar, dan berinovasi. |

### 2. `Lexora` — Ruang Literasi & Pengetahuan
- **`Lex`** berasal dari akar kata *Lexis* dan *Lexicon* yang berarti himpunan kata, buku, serta khazanah pengetahuan manusia.
- **`Ora`** melambangkan *aura* dan cakrawala terbuka.
- **`Lexora`** bermakna ruang bercahaya tempat setiap pembaca menemukan buku yang tepat.

---

## Branch & Alur Pengembangan Git

Repositori ini menggunakan dua branch utama agar pengembangan tetap rapi dan aman:

| Branch | Peran | Keterangan |
| :--- | :--- | :--- |
| `main` | **Stabil / Rilis** | Berisi versi stabil yang siap untuk demonstrasi dan submisi akhir. |
| `develop` *(Aktif)* | **Pengembangan** | Branch kerja harian berbasis sprint (Landing Multi-Page, Auth Kurva Split + OTP Mailpit, Live Search Katalog, Dashboard Peran, hingga dokumentasi teknis) sebelum di-*merge* ke `main`. |

```bash
# Beralih ke branch pengembangan aktif
git checkout develop
```

---

## Arsitektur & Dokumentasi

Dokumentasi arsitektur, relasi basis data, dan perencanaan sprint tersedia lengkap di repositori ini:

- [Ringkasan Arsitektur & Matriks RBAC](docs/architecture/README.md)
- [Diagram Topologi Sistem (SVG)](docs/architecture/system-topology.svg)
- [Entity Relationship Diagram (ERD 5 Tabel MySQL)](docs/architecture/erd-database.md)
- [Dokumen Perencanaan & Spesifikasi API](docs/planning/API-SPECIFICATION.md)

| Lapisan | Teknologi | Port / Lokasi |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16, React 19, Tailwind CSS v4, Motion, Lucide | `http://localhost:3000` (`frontend/`) |
| **Backend API** | Express.js, TypeScript, Zod, bcryptjs, Nodemailer, Swagger UI | `http://localhost:5000` (`backend/`, `/api-docs`) |
| **Database** | MySQL 8.0+ / MariaDB (`mysql2/promise`) | `127.0.0.1:3306` (`database/schema.sql`) |
| **Email Lokal** | Mailpit SMTP (OTP Verifikasi & Lupa Password Offline) | SMTP `:1025` · Web Inbox `http://127.0.0.1:8025` |

---

## Menjalankan Secara Lokal (Offline)

1. **Siapkan Database MySQL:**
   Impor [database/schema.sql](database/schema.sql) ke server MySQL lokal (misal via Laragon / MySQL Workbench).

2. **Jalankan Backend (`http://localhost:5000`):**
   ```bash
   cd backend
   npm install
   # Salin .env.example menjadi .env lalu sesuaikan DB & SESSION_SECRET
   npm run dev
   ```
   Perintah verifikasi: `npm run typecheck`, `npm run seed`, dan `npm run test:smoke`.

3. **Jalankan Frontend (`http://localhost:3000`):**
   ```bash
   cd frontend
   npm install
   # Salin .env.local.example menjadi .env.local (NEXT_PUBLIC_API_URL=http://localhost:5000/api)
   npm run dev
   ```
   Perintah verifikasi: `npx tsc --noEmit` dan `npm run lint`.

### Akun Uji Standar (Seed `schema.sql`)

| Peran | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `Admin123!` |
| **Petugas** | `petugas1` | `Petugas123!` |
| **Siswa** | `siswa1` | `Siswa123!` |

---

## License

All Rights Reserved. See [LICENSE](LICENSE).
