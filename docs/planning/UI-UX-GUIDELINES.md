# UI/UX Guidelines — Denvora Lexora

**Project Name:** Denvora Lexora  
**Slogan:** *Where Knowledge Finds Its Way.*  
**Logo Resmi:** `docs/assets/denvora-lexora-logo.png` (disalin ke `frontend/public/images/denvora-lexora-logo.png` saat implementasi)  

---

## 1. Design Direction — Luxury Editorial Library & Anti-Slop UI

Antarmuka Denvora Lexora memadukan identitas **luxury editorial library** dengan prinsip **Anti-Slop UI** — bersih, tenang, disengaja (*intentional*), dan terasa seperti perangkat lunak perpustakaan kuratorial yang dibuat khusus, bukan template dashboard generik hasil generator.

Permukaan bernuansa kertas hangat (*warm parchment*) dipadukan dengan teks cokelat gelap ber-kontras tinggi, tipografi serif editorial pada judul, garis tepi tipis (*hairline border*), proporsi ruang yang lega, serta aksen terakota/tembaga (`#A8643A`).

### Prinsip Anti-Slop (Wajib Dipatuhi Saat Implementasi)
- **Tolak Klise Template AI ("AI Slop"):**
  - **Dilarang** memakai gradasi neon/ungu/biru, *glassmorphism blur blobs*, atau latar putih-abu generik ala template SaaS standar.
  - **Dilarang** memasang kotak ikon warna-warni pelangi pada setiap kartu atau *badge* dekoratif palsu (mis. persentase tren dummy `"+12.5% dari bulan lalu"`) yang tidak dihitung dari database nyata.
  - **Dilarang** memakai sudut terlalu membulat (`rounded-3xl` di mana-mana) atau animasi memantul (`hover:scale-105`, *confetti*) yang terasa murah.
- **Standar Desain yang Disengaja (Intentional Craft):**
  - **Warm Depth & Hairline Framing:** Gunakan hirarki permukaan `#F6EFE6` (kanvas), `#E9DCCB` (sidebar/header), dan `#FBF7F1` (kartu elevated/modal) dengan border `1px solid #D7C7B4` dan bayangan sangat halus (`rgba(43, 29, 20, 0.05)`).
  - **Editorial Split & Asimetri Terukur:** Halaman Auth menggunakan *split layout* editorial (panel identitas/kutipan katalog di kiri + form autentikasi bersih di kanan), bukan sekadar kartu kecil melayang di tengah layar kosong.
  - **Presisi Data (`tabular-nums`):** Seluruh angka stok, tanggal pinjam/jatuh tempo, kode buku, dan kode transaksi memakai `tabular-nums` agar kolom angka sejajar rapi secara vertikal.
  - **Tactile Book Catalog:** Siswa dapat beralih antara **Grid Kartu Katalog** (bergaya kartu indeks perpustakaan modern dengan garis aksen kode buku & kategori) dan **Tabel Rapi**.
  - **Micro-Interactions Halus:** Transisi warna/border `150ms ease`, fokus ring `#A8643A`, status *pill badge* bernuansa *earth tone*, *skeleton loader* `#E9DCCB`, serta modal resi transaksi bergaya cetak arsip setelah peminjaman/pengembalian.

---

## 2. Brand Identity & Color Palette — Cream Mocha (60 / 30 / 10)

Tema warna **Denvora Lexora** terkunci pada palet **Cream Mocha (Krem & Cokelat Hangat)** dan **wajib dijaga konsisten** di seluruh halaman agar terasa tenang, alami, dan berkelas:

### Warna Utama (Mandatory — Tidak Boleh Diubah)

| Token | Hex | Peran | Proporsi Visual |
|---|---|---|---|
| `--bg-primary` | `#F6EFE6` | Latar belakang utama seluruh kanvas halaman | **60%** (Dominan) |
| `--bg-surface` | `#E9DCCB` | Permukaan kartu (*card*), sidebar, header tabel, panel sekunder | **30%** (Sekunder) |
| `--accent-primary` | `#A8643A` | Tombol aksi utama (*Primary CTA*), *eyebrow label*, menu aktif | **10%** (Aksen) |
| `--text-primary` | `#2B1D14` | Judul serif, teks isi, ikon utama (lebih lembut di mata daripada hitam murni) | Teks utama |
| `--text-muted` | `#8C7B6B` | Subjudul, metadata, placeholder, label redup | Teks sekunder |

> [!IMPORTANT]
> Terapkan disiplin **60 / 30 / 10**: jangan membuat tombol/blok `#A8643A` terlalu mendominasi layar sehingga merusak ketenangan `#F6EFE6` dan `#E9DCCB`.

### Warna Turunan & Semantik (`RECOMMENDATION` — selaras dengan palet utama)

| Token | Hex | Kegunaan |
|---|---|---|
| `--surface-elevated` | `#FBF7F1` | Latar modal, input form, dan kartu putih-hangat agar terpisah dari `#E9DCCB` |
| `--accent-hover` | `#8E512D` | State hover tombol `#A8643A` |
| `--border-subtle` | `#D7C7B4` | Garis pemisah tabel, border input, dan divider kartu |
| `--status-success` | `#2F6B48` | Status tersedia / dikembalikan / notifikasi sukses |
| `--status-warning` | `#9A631A` | Status dipinjam / mendekati atau melewati jatuh tempo |
| `--status-danger` | `#9E3B33` | Aksi hapus, stok habis, error validasi |

---

## 3. Typography (100% Offline Localhost-Safe)

> [!IMPORTANT]
> Karena aplikasi wajib berjalan **tanpa koneksi internet** di `localhost`, **dilarang memuat Google Fonts CDN**. Gunakan font sistem lokal yang tersedia di Windows/Linux/macOS.

- **Display / Judul Halaman:** `Georgia, "Times New Roman", serif` (memberikan nuansa literasi/perpustakaan yang hangat tanpa aset eksternal).
- **UI & Teks Isi:** `system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif` (tajam untuk tabel data dan form).
- **Kode Transaksi / Kode Buku / NIS:** `"Cascadia Code", Consolas, "Courier New", monospace`.

### Skala Tipografi
- Page Title (`h1`): `24px–28px`, bold, tracking rapat.
- Section Title (`h2`): `18px–20px`, semibold.
- Body / Table Cell: `14px`, line-height `1.5`.
- Label / Caption: `12px–13px`, warna `#8C7B6B`.

---

## 4. Spacing, Layout & Responsive Design

- **Sistem Spasi:** Kelipatan `4px` (`8px`, `12px`, `16px`, `24px`, `32px`).
- **Radius Sudut:** `8px` untuk input/tombol, `12px` untuk kartu dan modal agar lembut namun tetap rapi.
- **Layout Dashboard:**
  - **Desktop (`>= 1024px`):** Sidebar kiri tetap (`240px`, latar `#E9DCCB`) + Topbar ringkas (nama halaman, badge role, tombol Logout) + Area konten utama (`max-w-7xl`, padding `24px–32px`).
  - **Mobile / Tablet (`< 1024px`):** Sidebar berubah menjadi drawer toggle; tabel panjang dibungkus container `overflow-x-auto` agar tidak merusak lebar layar.

---

## 5. Component Guidelines (`shadcn/ui`, `motion` & `lucide-react`)

1. **Komponen `shadcn/ui` Terpilih:** Gunakan hanya komponen yang benar-benar dibutuhkan (`Button`, `Input`, `Label`, `Dialog`, `Select`, `Table`, `Badge`, `Sheet` untuk mobile sidebar drawer) dan sesuaikan seluruh token CSS-nya ke palet **Cream Mocha** (bukan warna default abu-abu/hitam shadcn).
2. **Ikon (`lucide-react`):** Terpasang lokal di `node_modules` (aman 100% offline dan menjadi ikon bawaan `shadcn/ui`). Gunakan `strokeWidth={1.75}` yang selaras dengan nuansa editorial, pilih ikon yang relevan dengan fungsi nyata perpustakaan, dan **dilarang** memakai emoji dekoratif pada judul/tombol.
3. **Animasi & Scroll Reveal (`motion`):**
   - Gunakan maksimal `150ms–250ms` dengan kurva tenang (`easeOut`), tanpa `bounce`, tanpa `hover:scale-105`, dan tanpa animasi loop/pulse tanpa henti.
   - Efek *scroll reveal* cukup memakai `whileInView={{ opacity: 1, y: 0 }}` (`viewport={{ once: true }}`) milik `motion` pada daftar kartu katalog/section — tanpa menambah `lenis` atau `gsap`.
4. **Buttons:**
   - *Primary:* Latar `#A8643A`, teks `#F6EFE6`, hover `#8E512D`.
   - *Secondary:* Border `#A8643A` atau `#8C7B6B`, teks `#2B1D14`, latar transparan/`#FBF7F1`.
   - *Danger:* Latar/border `#9E3B33`, hanya untuk konfirmasi penghapusan.
5. **Cards & Metric Tiles:** Hanya tampilkan angka riil dari database (tidak ada delta persen dummy); maksimal 3–4 metrik penting sesuai peran.
6. **Search & Filter Bar:** Satu baris bersih berisi input pencarian kata kunci, dropdown kategori, dan dropdown filter kondisi/status, disertai tombol *Reset Filter*.
7. **Tables:** Header berlatar `#E9DCCB`, kolom disusun berdasarkan keputusan nyata pengguna di layar tersebut (bukan kolom template generik), teks rata kiri untuk string dan `tabular-nums` rata kanan/tengah untuk angka stok & badge status.
8. **Modals & Konfirmasi:** Wajib ada dialog konfirmasi sebelum aksi **Hapus** maupun sebelum **Pinjam / Kembalikan Buku** agar pengguna tidak salah klik.

---

## 6. Spesifikasi Halaman Utama

### A. Authentication Pages (`/login` & `/register`)
- Layout split sederhana atau kartu terpusat di atas `#F6EFE6` dengan logo **Denvora Lexora** dan slogan *"Where Knowledge Finds Its Way."*
- **Halaman Login:** Tab/indikator jalur *Siswa* dan *Admin / Petugas* (sesuai flowmap SPK-3/4), input `Username`, input `Password` (dengan toggle tampilkan password dari `lucide-react`), pesan error jelas bila kredensial salah, dan tautan **"Daftar Anggota Baru"** untuk siswa.
- **Halaman Daftar Anggota (`/register`):** Form Nama Lengkap, NIS/Kode Anggota, Kelas, Nomor HP, Username, Password. Tidak ada dropdown role (dikunci `Siswa`).

### B. Admin Dashboard (`/admin/*`)
- **Ringkasan Dashboard:** 4 kartu metrik utama + daftar pinjaman aktif terbaru + akses cepat ke 3 menu utama flowmap (*Kelola Data Buku*, *Transaksi*, *Kelola Anggota*) plus menu *Kelola Petugas* & *Ekspor Laporan*.
- **Kelola Data Buku:** Tabel katalog + modal Tambah/Edit Buku + manajemen Kategori.
- **Transaksi:** Tabel semua transaksi + filter kondisi (status, tanggal, terlambat) + modal Catat Pinjam Baru + tombol Tandai Kembali / Edit / Hapus + tombol **Unduh Laporan CSV**.
- **Kelola Anggota & Kelola Petugas:** Tabel terpisah atau tab yang jelas antara *Anggota (Siswa)* dan *Akun Petugas*, lengkap dengan toggle status aktif/nonaktif.

### C. Petugas Dashboard (`/petugas/*` — `RECOMMENDATION`)
- Tampilan operasional fokus pada layanan sirkulasi harian: Ringkasan stok & pinjaman aktif, menu **Kelola Data Buku**, **Transaksi (Pinjam/Kembali/Filter/Ekspor CSV)**, dan **Daftar Anggota (Read-only)**. Tidak menampilkan menu ubah/hapus anggota atau kelola akun petugas/admin.

### D. User / Siswa Dashboard (`/siswa/*`)
- **Dashboard Siswa:** Sambutan personal + ringkasan jumlah buku sedang dipinjam + 2 tombol menu utama sesuai flowmap: **Peminjaman Buku** dan **Pengembalian Buku**.
- **Halaman Peminjaman Buku (Book Catalog):** Grid/tabel buku dengan badge stok (`Tersedia: X` hijau atau `Habis` merah), kotak pencarian & filter kategori/ketersediaan, dan tombol **Pinjam Buku**.
- **Halaman Pengembalian Buku & Riwayat:** Daftar buku berstatus `Sedang Dipinjam` lengkap dengan tanggal pinjam, tanggal jatuh tempo, indikator keterlambatan, dan tombol **Kembalikan Buku**, disertai tab riwayat yang sudah dikembalikan.

---

## 7. Empty States & Error States

- **Empty State:** Ikon `BookOpen` / `SearchX` beraksen `#8C7B6B`, judul singkat (mis. *"Belum ada buku yang sesuai filter"*), dan tombol aksi cepat (*"Reset Pencarian"* atau *"Jelajahi Katalog"*).
- **Error State:** Banner halus bernuansa `#9E3B33` dengan pesan ramah (bukan stack trace mentah), misalnya ketika server backend belum menyala atau validasi form gagal.
- **Forbidden State (`403`):** Tampilan khusus jika peran mencoba membuka URL dashboard peran lain, disertai tombol kembali ke dashboard miliknya.
