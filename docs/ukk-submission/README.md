# Paket Pengumpulan & Dokumentasi UKK — Denvora Lexora

**Kompetensi Keahlian:** Rekayasa Perangkat Lunak (RPL) — Paket 4 (`KM25.4.1.1`)  
**Nama Aplikasi:** Denvora Lexora — Sistem Informasi Perpustakaan Sekolah Digital (*Offline Localhost*)  
**Basis Data:** MySQL `db_denvora_lexora` (`127.0.0.1:3306`)

---

## 1. Daftar Berkas Dokumentasi Pengumpulan (`docs/ukk-submission/`)

| No | Dokumen | Isi & Kegunaan | Kaitan Kriteria UKK |
| :-: | :--- | :--- | :--- |
| 1 | [01-DESKRIPSI-PROGRAM-DAN-MANUAL.md](./01-DESKRIPSI-PROGRAM-DAN-MANUAL.md) | Deskripsi program, arsitektur, rincian ERD & basis data, matriks hak akses, endpoint REST API, serta **Buku Manual Singkat Pengguna** (siap disalin/cetak ke pengolah kata). | `SPK-4/4` 3a, 3b, Langkah 6; `PPsp 1.1–1.12` |
| 2 | [02-DOKUMENTASI-FUNGSI-PROSEDUR.md](./02-DOKUMENTASI-FUNGSI-PROSEDUR.md) | Katalog lengkap **99 modul** dan fungsi/komponen/tipe terekspor hasil generate otomatis dari JSDoc Backend & Frontend. | `SPK-4/4` 3c; `PPsp 1.13–1.15` |
| 3 | [`generated-code-docs/index.html`](./generated-code-docs/index.html) | Dokumentasi kode **HTML interaktif offline** (dapat dibuka langsung di browser tanpa internet dan dilengkapi pencarian instan). | `PPsp 1.15` (Generate Dokumentasi) |
| 4 | [03-LOG-DEBUGGING-DAN-PERBAIKAN.md](./03-LOG-DEBUGGING-DAN-PERBAIKAN.md) | Catatan teknis kasus bug yang ditemukan selama pengembangan, akar masalah, langkah debugging, perbaikan kode, dan hash commit verifikasi. | `SPK-4/4` 3d; `PPsp 1.17–1.18` |
| 5 | [04-LAPORAN-UJI-COBA-DAN-EVALUASI.md](./04-LAPORAN-UJI-COBA-DAN-EVALUASI.md) | Rencana kebutuhan uji, data uji standar, skenario uji Black-Box, hasil verifikasi otomatis/manual, dan **Laporan Evaluasi Singkat**. | `SPK-4/4` 4; `PPsp 1.19–1.23` |

---

## 2. Daftar Periksa Kelengkapan Deliverable (`SPK-4/4`)

| Syarat Deliverable `SPK-4/4` | Lokasi Berkas Nyata di Repositori | Status |
| :--- | :--- | :---: |
| **1. Folder proyek aplikasi (kode program lengkap)** | [`frontend/`](../../frontend) & [`backend/`](../../backend) | Lengkap |
| **2. Database dengan ekstensi `.sql`** | [`database/schema.sql`](../../database/schema.sql) | Lengkap |
| **3a. Dokumentasi: ERD** | [`docs/architecture/erd-database.md`](../architecture/erd-database.md) & [`docs/denvora-lexora-diagrams.drawio`](../denvora-lexora-diagrams.drawio) | Lengkap |
| **3b. Dokumentasi: Deskripsi program** | [`01-DESKRIPSI-PROGRAM-DAN-MANUAL.md`](./01-DESKRIPSI-PROGRAM-DAN-MANUAL.md) | Lengkap |
| **3c. Dokumentasi fungsi / prosedur (+ Generate)** | [`02-DOKUMENTASI-FUNGSI-PROSEDUR.md`](./02-DOKUMENTASI-FUNGSI-PROSEDUR.md) & [`backend/scripts/generate-code-docs.ts`](../../backend/scripts/generate-code-docs.ts) | Lengkap |
| **3d. Dokumentasi: Debugging** | [`03-LOG-DEBUGGING-DAN-PERBAIKAN.md`](./03-LOG-DEBUGGING-DAN-PERBAIKAN.md) | Lengkap |
| **4. Laporan evaluasi singkat** | [`04-LAPORAN-UJI-COBA-DAN-EVALUASI.md`](./04-LAPORAN-UJI-COBA-DAN-EVALUASI.md) | Lengkap |
| **Langkah 6. Manual singkat (pengolah kata)** | Bagian II pada [`01-DESKRIPSI-PROGRAM-DAN-MANUAL.md`](./01-DESKRIPSI-PROGRAM-DAN-MANUAL.md) (siap ekspor `.docx` / `.pdf`) | Lengkap |

---

## 3. Memperbarui Hasil Generate Dokumentasi Kode

Setiap kali ada perubahan komentar `@module` atau JSDoc fungsi pada kode sumber, jalankan perintah offline berikut dari direktori `backend/`:

```bash
npm run docs:generate
```

Perintah tersebut mengeksekusi [`backend/scripts/generate-code-docs.ts`](../../backend/scripts/generate-code-docs.ts) dan memperbarui `02-DOKUMENTASI-FUNGSI-PROSEDUR.md` beserta `generated-code-docs/index.html` secara otomatis.

---

## 4. Kesesuaian Terhadap Seluruh 4 Dokumen Resmi PDF (`docs/`)

| Dokumen PDF | Fokus Standar / Aturan | Pemenuhan di Proyek Denvora Lexora |
| :--- | :--- | :--- |
| [`P4-SPK Rekayasa Perangkat Lunak.pdf`](../P4-SPK%20Rekayasa%20Perangkat%20Lunak.pdf) | Aplikasi Perpustakaan Sekolah Digital **offline Localhost**, alur Gambar Kerja (`Admin` & `Siswa`), CRUD Buku/Anggota/Transaksi, Pencarian kondisi tertentu, serta pengumpulan kode, `.sql`, ERD, deskripsi, fungsi/prosedur, debugging, manual pengolah kata, dan evaluasi. | Terpenuhi penuh. Seluruh fitur & aset aplikasi berjalan 100% lokal (`localhost:3000` & `localhost:5000`); cover buku & grafik dibundel lokal tanpa CDN internet. |
| [`P4-PPsp Rekayasa Perangkat Lunak.pdf`](../P4-PPsp%20Rekayasa%20Perangkat%20Lunak.pdf) | Kriteria utama `1.1–1.23` (struktur data, pemodelan, best practice, array, **akses file**, **generate dokumentasi**, debugging, uji coba & evaluasi) + pendukung `2.1–2.4` untuk nilai **Sangat Kompeten (91–100)**. | Terpenuhi penuh (`backend/logs/app.log`, `backend/exports/*.csv`, `backend/uploads/covers/*`, generator `npm run docs:generate`, `tests/smoke.ts`, dan berkas `docs/ukk-submission/`). |
| [`P4-KAP_Rekayasa_Perangkat_Lunak.pdf`](../P4-KAP_Rekayasa_Perangkat_Lunak.pdf) | Kisi soal aspek pengetahuan (`2.1–2.4`): struktur data terurut, alur eksekusi kode, identifikasi hasil program, dan pembacaan kode terstruktur. | Mendukung persiapan peserta melalui modularisasi kode (`<= 300` baris/file) dan dokumentasi modul/fungsi yang mudah ditelusuri. |
| [`P4-InV_Rekayasa_Perangkat_Lunak.pdf`](../P4-InV_Rekayasa_Perangkat_Lunak.pdf) | Standar verifikasi TUK, peralatan (PC, Database, Text Editor, Debugging Tools, Pengolah Kata), ruang uji, dan penguji. | Kompatibel dengan lingkungan Laragon/MySQL lokal, browser, VS Code/Debugging Tools, serta dokumen siap ekspor ke pengolah kata. |
