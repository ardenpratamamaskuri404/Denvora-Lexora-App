<p align="center">
  <img src="docs/assets/denvora-lexora-logo.png" alt="Logo Denvora Lexora" width="160" />
</p>

<h1 align="center">Denvora Lexora</h1>

<p align="center">
  <em>"Where Knowledge Finds Its Way."</em>
</p>

<p align="center">
  Sistem Informasi Peminjaman Buku &amp; Manajemen Perpustakaan Sekolah Digital berbasis arsitektur <em>client–server</em> terpisah.
</p>

---

## Ringkasan Proyek

**Denvora Lexora** dirancang untuk mendigitalisasi tata kelola perpustakaan sekolah secara tertib, terstruktur, dan dapat beroperasi penuh pada lingkungan **localhost offline**. Sistem memisahkan lapisan antarmuka (**Next.js App Router**), layanan REST API (**Express.js TypeScript**), serta basis data relasional (**MySQL**) dengan penerapan kontrol akses berbasis peran (*Role-Based Access Control*): **Administrator**, **Petugas Layanan**, dan **Anggota Siswa**.

### Kapabilitas Utama
- **Katalog &amp; Pencarian Kondisi Tertentu:** Penelusuran judul, penulis, kode buku, rak, filter kategori, serta status ketersediaan stok secara *real-time*.
- **Sirkulasi Transaksi Atomik:** Pencatatan peminjaman dan pengembalian buku menggunakan penguncian baris basis data (`FOR UPDATE`) untuk menjaga akurasi stok.
- **Autentikasi &amp; Verifikasi Email Lokal:** Manajemen sesi berbasis *cookie* `HttpOnly` bertanda tangan HMAC-SHA256 dan verifikasi OTP 6 digit melalui layanan SMTP lokal (**Mailpit**).
- **Manajemen Data &amp; Pelaporan:** Pengelolaan koleksi buku, kategori, data anggota, staf, deteksi keterlambatan pengembalian, serta ekspor laporan transaksi ke format CSV.

---

## Filosofi Identitas

Nama **Denvora Lexora** memadukan identitas pemrakarsa dengan visi literasi digital modern:

- **`Den`** — Diambil dari nama pemrakarsa sistem, **Arden Pratama Maskuri**.
- **`VORA`** — Akronim dari empat prinsip rekayasa perangkat lunak:
  - **V — Vision:** Pengembangan yang terarah dan memiliki tujuan yang jelas.
  - **O — Originality:** Pendekatan desain yang autentik dan terstruktur.
  - **R — Reliability:** Menjaga konsistensi data, keamanan akses, serta keandalan layanan.
  - **A — Advancement:** Berorientasi pada perbaikan dan inovasi berkelanjutan.
- **`Lexora`** — Gabungan kata **Lex** (*Lexis* / *Lexicon*, khazanah kata dan pustaka ilmu) dan **Ora** (*aura* / cakrawala terbuka), yang melambangkan ruang literasi yang memudahkan setiap pembaca menemukan pengetahuan yang tepat.

---

## Strategi Branch &amp; Alur Pengembangan

Repositori menggunakan model dua branch utama untuk menjaga stabilitas kode:

| Branch | Peran | Deskripsi |
| :--- | :--- | :--- |
| `main` | **Rilis Stabil** | Menyimpan kode terverifikasi yang siap untuk demonstrasi dan rilis akhir. |
| `develop` | **Pengembangan Aktif** | Branch utama pengerjaan fitur bertahap sebelum melalui proses tinjauan dan penggabungan ke `main`. |

```bash
git checkout develop
```

---

## Arsitektur &amp; Struktur Repositori

Dokumentasi teknis, rancangan relasional basis data, dan spesifikasi endpoint tersedia pada direktori dokumentasi:

- [Dokumentasi Arsitektur &amp; Matriks RBAC](docs/architecture/README.md)
- [Diagram Topologi Sistem](docs/architecture/system-topology.svg)
- [Entity Relationship Diagram (ERD)](docs/architecture/erd-database.md)
- [Spesifikasi REST API](docs/planning/API-SPECIFICATION.md)

```text
sistem-peminjaman-buku/
├── frontend/          # Antarmuka Next.js 16, React 19, Tailwind CSS v4
├── backend/           # Layanan REST API Express.js TypeScript, Zod, OpenAPI (/api-docs)
├── database/          # Skema relasional MySQL & data awal (schema.sql)
└── docs/              # Artefak arsitektur, ERD, dan dokumentasi perencanaan
```

---

## Panduan Instalasi Lokal

### 1. Basis Data (MySQL)
Impor skema [database/schema.sql](database/schema.sql) ke server MySQL lokal (Laragon / MySQL Workbench). Untuk mengisi atau mengatur ulang data uji melalui skrip, jalankan `npm run seed` pada direktori `backend` dan kelola kredensial secara terpisah sesuai kebutuhan administrator lokal.

### 2. Backend REST API
```bash
cd backend
npm install
cp .env.example .env    # Sesuaikan konfigurasi MySQL, SESSION_SECRET, dan SMTP Mailpit lokal
npm run dev             # Berjalan pada http://localhost:5000 (Swagger UI: /api-docs)
```

### 3. Frontend Aplikasi
```bash
cd frontend
npm install
cp .env.local.example .env.local   # Pastikan NEXT_PUBLIC_API_URL mengarah ke backend lokal
npm run dev                        # Berjalan pada http://localhost:3000
```

### 4. Perintah Verifikasi
- **Frontend:** `npx tsc --noEmit` dan `npm run lint`
- **Backend:** `npm run typecheck` dan `npm run test:smoke`

---

## Lisensi

Seluruh hak cipta dilindungi undang-undang. Lihat berkas [LICENSE](LICENSE).
