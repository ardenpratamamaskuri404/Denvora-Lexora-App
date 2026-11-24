# User Flow — Denvora Lexora

**Acuan Utama:** Flowmap Sistem Usulan pada Dokumen Soal Praktik Kejuruan (SPK-3/4)  
**Peran Sistem:** `Admin` (Mandatory), `Siswa` (Mandatory), `Petugas` (`RECOMMENDATION`)  

---

## 1. Alur Utama Sistem (Mengikuti Flowmap Resmi SPK-3/4)

Diagram berikut memetakan alur resmi dari *Start → Login → Pemilihan Peran → Dashboard & Pilih Menu → Eksekusi Fitur → End*, dengan tambahan cabang operasional `Petugas` (`RECOMMENDATION`) tanpa mengubah alur inti `Admin` dan `Siswa`.

```mermaid
flowchart TD
    Start(["Start"]) --> LoginPage["Halaman Login"]
    LoginPage --> RoleChoice{"Pilih Jalur Login"}

    %% Jalur Admin & Petugas (Staff)
    RoleChoice -->|"Login sebagai Admin"| AdminInput[/"Input Username & Password"/]
    AdminInput --> AdminValid{"Validasi Login Admin"}
    AdminValid -->|"False"| AdminInput
    AdminValid -->|"True"| AdminDash["Dashboard Admin"]

    AdminDash --> AdminMenu["Pilih Menu Admin"]
    AdminMenu --> CheckBook{"Kelola Data Buku?"}
    CheckBook -->|"True"| MenuBook["Halaman Kelola Data Buku"]
    MenuBook --> CrudBook["Melakukan CRUD Data Buku"]
    CheckBook -->|"False"| CheckTrx{"Transaksi?"}
    CheckTrx -->|"True"| MenuTrx["Halaman Transaksi"]
    MenuTrx --> CrudTrx["Melakukan CRUD Transaksi & Ekspor CSV"]
    CheckTrx -->|"False"| CheckMember{"Kelola Anggota?"}
    CheckMember -->|"True"| MenuMember["Halaman Kelola Anggota"]
    MenuMember --> CrudMember["Melakukan CRUD Kelola Anggota & Petugas"]
    CheckMember -->|"False"| AdminDash

    %% Jalur Siswa (User)
    RoleChoice -->|"Login sebagai Siswa"| IsMember{"Sudah Anggota?"}
    IsMember -->|"False"| RegisterMember["Daftar Anggota (Siswa)"]
    RegisterMember --> SiswaInput
    IsMember -->|"True"| SiswaInput[/"Input Username & Password"/]
    SiswaInput --> SiswaValid{"Validasi Login Siswa"}
    SiswaValid -->|"False"| SiswaInput
    SiswaValid -->|"True"| SiswaDash["Dashboard Siswa"]

    SiswaDash --> SiswaMenu["Pilih Menu Siswa"]
    SiswaMenu --> CheckBorrow{"Peminjaman Buku?"}
    CheckBorrow -->|"True"| MenuBorrow["Halaman Peminjaman Buku"]
    MenuBorrow --> DoBorrow["Cari Buku & Melakukan Peminjaman Buku"]
    CheckBorrow -->|"False"| CheckReturn{"Pengembalian Buku?"}
    CheckReturn -->|"True"| MenuReturn["Halaman Pengembalian Buku"]
    MenuReturn --> DoReturn["Melakukan Pengembalian Buku"]
    CheckReturn -->|"False"| SiswaDash

    %% Jalur Petugas (RECOMMENDATION)
    RoleChoice -->|"Login sebagai Petugas (RECOMMENDATION)"| StaffInput[/"Input Username & Password"/]
    StaffInput --> StaffValid{"Validasi Login Petugas"}
    StaffValid -->|"False"| StaffInput
    StaffValid -->|"True"| StaffDash["Dashboard Petugas"]
    StaffDash --> StaffOps["Pilih Menu: CRUD Buku / CRUD Transaksi / Lihat Anggota"]

    CrudBook --> EndNode(["End / Logout"])
    CrudTrx --> EndNode
    CrudMember --> EndNode
    DoBorrow --> EndNode
    DoReturn --> EndNode
    StaffOps --> EndNode
```

> [!NOTE]
> Pada implementasi UI halaman `/login`, form input tetap satu kesatuan (*Username & Password*) agar praktis, namun tersedia panduan/tab pilihan jalur (`Siswa` / `Admin & Petugas`) serta tautan **"Belum jadi anggota? Daftar Anggota"** sehingga secara visual maupun alur tetap sejalan 100% dengan flowmap SPK-3/4.

---

## 2. Flow Pendaftaran Anggota (Khusus Siswa)

```mermaid
flowchart TD
    A["Klik Daftar Anggota di Halaman Login"] --> B["Isi Form: Nama, NIS/Kode Anggota, Kelas, No HP, Username, Password"]
    B --> C["Submit ke POST /api/auth/register"]
    C --> D{"Validasi Zod & Cek Unik Username/NIS"}
    D -->|"Gagal"| E["Tampilkan Pesan Error di Field Terkait"]
    E --> B
    D -->|"Berhasil"| F["Backend Hash Password & Simpan role='siswa'"]
    F --> G["Redirect ke Halaman Login + Notifikasi Berhasil"]
```

---

## 3. Flow Peminjaman Buku (Siswa)

```mermaid
flowchart TD
    A["Dashboard Siswa -> Menu Peminjaman Buku"] --> B["Lihat Katalog Buku"]
    B --> C["Cari / Filter Kondisi Tertentu (Judul, Penulis, Kategori, Stok Tersedia)"]
    C --> D["Pilih Buku dengan stock_available > 0"]
    D --> E["Klik Tombol Pinjam Buku + Konfirmasi"]
    E --> F["POST /api/transactions/borrow"]
    F --> G{"Backend Cek Stok FOR UPDATE"}
    G -->|"Stok = 0"| H["Tampilkan Error: Stok Buku Habis"]
    G -->|"Stok > 0"| I["Kurangi stock_available - 1 & Catat Transaksi (status='borrowed', due_date +7 hari)"]
    I --> J["Tampilkan Kode Transaksi & Update Daftar Buku"]
```

---

## 4. Flow Pengembalian Buku (Siswa)

```mermaid
flowchart TD
    A["Dashboard Siswa -> Menu Pengembalian Buku"] --> B["GET /api/transactions/my?status=borrowed"]
    B --> C{"Ada Buku yang Sedang Dipinjam?"}
    C -->|"Tidak"| D["Tampilkan Empty State: Tidak Ada Pinjaman Aktif"]
    C -->|"Ya"| E["Pilih Transaksi Buku yang Akan Dikembalikan"]
    E --> F["Klik Kembalikan Buku -> PATCH /api/transactions/:id/return"]
    F --> G{"Backend Cek Kepemilikan & Status == 'borrowed'"}
    G -->|"Gagal"| H["Tolak Aksi & Tampilkan Pesan Error"]
    G -->|"Valid"| I["Update status='returned', return_date=hari ini, Tambah stock_available + 1"]
    I --> J["Tampilkan Ringkasan Pengembalian & Perbarui Daftar"]
```

---

## 5. Flow Pengelolaan Data Buku (Admin & Petugas)

```mermaid
flowchart TD
    A["Dashboard Admin/Petugas -> Menu Kelola Data Buku"] --> B["Tampilkan Tabel Buku + Filter Pencarian"]
    B --> C{"Pilih Aksi CRUD"}
    C -->|"Create"| D["Isi Form Tambah Buku -> POST /api/books"]
    C -->|"Update"| E["Ubah Data/Stok Buku -> PUT /api/books/:id"]
    C -->|"Delete (Admin Only)"| F["Konfirmasi Hapus -> DELETE /api/books/:id"]
    F --> G{"Masih Ada Transaksi Aktif?"}
    G -->|"Ya"| H["Tolak (409 Conflict): Buku Sedang Dipinjam"]
    G -->|"Tidak"| I["Hapus Buku dari Database"]
    D --> J["Refresh Tabel Buku"]
    E --> J
    I --> J
```

---

## 6. Flow Pengelolaan Anggota & Petugas (Admin)

```mermaid
flowchart TD
    A["Dashboard Admin -> Menu Kelola Anggota / Kelola Petugas"] --> B["Tampilkan Daftar Anggota (Siswa) atau Daftar Petugas"]
    B --> C{"Pilih Aksi"}
    C -->|"Create"| D["Tambah Akun (role='siswa' atau 'petugas')"]
    C -->|"Update"| E["Edit Data / Nonaktifkan Akun (is_active)"]
    C -->|"Delete"| F{"Cek Pinjaman Aktif (Untuk Siswa)"}
    F -->|"Ada Pinjaman Aktif"| G["Tolak Hapus (409) & Sarankan Nonaktifkan Akun"]
    F -->|"Aman"| H["Hapus Akun dari Database"]
```

*(Catatan: `Petugas` hanya memiliki akses **Read-only** melihat daftar anggota saat memproses peminjaman di meja layanan).*

---

## 7. Flow CRUD Transaksi & Ekspor File CSV (Admin & Petugas)

```mermaid
flowchart TD
    A["Dashboard Admin/Petugas -> Menu Transaksi"] --> B["Filter Kondisi: Status, Tanggal Pinjam, Terlambat, atau Kata Kunci"]
    B --> C{"Pilih Aksi"}
    C -->|"Catat Pinjam Baru"| D["Pilih Anggota & Buku Tersedia -> POST /api/transactions"]
    C -->|"Update / Proses Kembali"| E["Ubah Status jadi 'returned' / Edit Catatan -> PUT /api/transactions/:id"]
    C -->|"Hapus Transaksi"| F["Hapus & Pulihkan Stok jika masih 'borrowed' -> DELETE /api/transactions/:id"]
    C -->|"Ekspor Laporan CSV (PPsp 1.12)"| G["GET /api/reports/transactions/export -> Generate & Unduh File .csv"]
```
