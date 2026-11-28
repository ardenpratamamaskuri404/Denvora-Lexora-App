# Log Debugging & Perbaikan Program — Denvora Lexora

**Memenuhi Kriteria UKK:** `SPK-4/4` poin 3d (*Dokumentasi Debugging*) & `PPsp 1.17–1.18` (*Melakukan debugging dan memperbaiki program*).

Setiap entri di bawah ini mendokumentasikan kendala teknis nyata yang terdeteksi selama tahap integrasi, *code quality check*, dan uji antarmuka, beserta akar masalah dan penyelesaiannya di repositori.

---

## Ringkasan Kasus Debugging Terverifikasi

### 1. Pemutusan Efek Sticky Section (`CERITA`) Akibat `overflow-x: hidden`
* **Gejala:** Bagian *Story Reveal* pada halaman beranda tidak menempel (*sticky*) saat digulir ke bawah dan animasi pengungkapan teks tidak berjalan mulus.
* **Akar Masalah:** Pemakaian `overflow-x: hidden` pada kontainer halaman membuat browser memperlakukan kontainer tersebut sebagai *scroll container* terpisah sehingga `position: sticky` kehilangan konteks *viewport*.
* **Perbaikan:** Mengganti properti CSS menjadi `overflow-x: clip` agar tidak terjadi luberan horizontal tanpa memutus perilaku *sticky* dan pengulangan efek *scroll reveal*.
* **Referensi Commit:** `1d4038c`

---

### 2. Mobile Navbar Berubah Bentuk Oval & Duplikasi Toggle Tema
* **Gejala:** Pada lebar layar mobile (`< 768px`), bilah navigasi mengambang berubah membulat seperti kapsul/oval dan menampilkan dua tombol pengubah tema sekaligus.
* **Akar Masalah:** Kelas radius berlebih aktif di semua *breakpoint* serta tombol toggle tema terpasang baik di baris header maupun di dalam menu lipat mobile.
* **Perbaikan:** Menyelaraskan kelas radius responsif navbar dan memusatkan satu tombol toggle tema per *breakpoint*.
* **Referensi Commit:** `729c345`

---

### 3. Inkonsistensi Dark/Light Mode antara Beranda, Halaman Auth, dan Splash Screen
* **Gejala:** Saat pengguna berpindah ke Mode Gelap lalu memuat ulang portal atau berpindah ke `/login` dan `/register`, Splash Screen dan panel otentikasi masih tampil dalam nuansa warna tunggal dan sempat berkedip (*flash of wrong theme*).
* **Akar Masalah:** Key `localStorage` (`denvora-theme`) belum disuntikkan sebelum *hydration* React, serta stylesheet `Splash.module.css` belum memiliki aturan `:global(.dark)` untuk tema *Espresso Mocha*.
* **Perbaikan:**
  1. Menambahkan inline script inisialisasi tema sebelum render di [`frontend/src/app/layout.tsx`](../../frontend/src/app/layout.tsx).
  2. Menambahkan dukungan `:global(.dark)` di [`Splash.module.css`](../../frontend/src/components/Splash/Splash.module.css) dan sinkronisasi state tema di [`AuthShell.tsx`](../../frontend/src/components/auth/AuthShell.tsx).
* **Referensi Commit:** `6ef7c1e`, `415e7fa`

---

### 4. Peringatan Aturan ESLint React 19 (`react-hooks/set-state-in-effect`) pada Splash Screen
* **Gejala:** Saat menjalankan pemeriksaan kualitas kode (`eslint src --max-warnings=0`), komponen [`Splash.tsx`](../../frontend/src/components/Splash/Splash.tsx) memicu error karena pemanggilan `setState` secara sinkron di dalam `useEffect`.
* **Akar Masalah:** React 19 ESLint Plugin melarang pemanggilan `setPhase('done')` secara sinkron di badan efek ketika parameter `once` mendeteksi splash sudah pernah diputar.
* **Perbaikan:** Memindahkan pembaruan state ke dalam `window.setTimeout(..., 0)` beserta fungsi pembersih (`clearTimeout`) dan memanggil callback `onDoneRef` melalui efek aman.
* **Referensi Commit:** `ab0a57f`, `415e7fa`

---

### 5. Fleksibilitas Domain Email Pendaftar & Kenyamanan Lebar Input Form
* **Gejala:** Pendaftaran anggota baru sebelumnya mengasumsikan email sekolah tertentu dan kolom input di grid 2 kolom (`/register`) terasa sempit untuk mengetikkan alamat email atau NIS panjang.
* **Akar Masalah:** Placeholder dan aturan input belum mencerminkan penerimaan email umum (`@gmail.com`) bersama domain sekolah (`@denvora.sch.id`), sementara kontainer kartu form dan pembagian grid masih terlalu rapat.
* **Perbaikan:** Memastikan validator & service backend menerima email valid umum maupun `.sch.id` ([`user.validator.ts`](../../backend/src/validators/user.validator.ts), [`user.service.ts`](../../backend/src/services/user.service.ts)), serta memperlebar kontainer form dan proporsi grid pada halaman autentikasi.
* **Referensi Commit:** `a9be2fb`, `e9feca3`

---

### 6. Peringatan Tailwind CSS v4 & Penyesuaian Statistik Harian Zona Waktu Lokal
* **Gejala:** Editor menampilkan peringatan *Tailwind CSS v4 canonical syntax* pada variabel kustom (`bg-[var(--...)]`), dan penambahan data tren grafik 7 hari membutuhkan kunci tanggal lokal `YYYY-MM-DD` agar selaras dengan `CURDATE()` MySQL.
* **Akar Masalah:** Sintaks Tailwind v3 masih terbawa pada beberapa komponen, sedangkan konversi tanggal JS `.toISOString()` menghasilkan tanggal UTC (selisih jam dengan WIB).
* **Perbaikan:** Mengonversi sintaks variabel ke bentuk kanonik Tailwind v4 `(--var)` dan membangun `recent_borrows_7d` di [`report.service.ts`](../../backend/src/services/report.service.ts) serta `SiswaDashboardView.tsx` menggunakan komponen tanggal lokal (`getFullYear`, `getMonth`, `getDate`).
* **Referensi Commit:** `1bbf446`, `600d124`

---

### 7. Audit Ketidaksesuaian CRUD, Pencarian Kondisi Tertentu, Tooltip Chart & ESLint React 19
* **Gejala:**
  1. Pencarian buku berdasarkan lokasi rak (`shelf_location`) dan pencarian anggota berdasarkan kelas (`class_name`) tidak mengembalikan hasil meski tertera di placeholder/OpenAPI.
  2. Tabel transaksi Petugas/Admin belum menyediakan tombol edit jatuh tempo/catatan meski endpoint `PUT /transactions/:id` sudah tersedia.
  3. Reassignment variabel lokal di dalam `.map` pada `PortalSidebar.tsx` ditolak aturan `react-hooks/immutability`, dan tooltip `PieChart` Recharts sempat tertutup teks tengah donat (`6 JUDUL`).
* **Akar Masalah:** Klausa SQL `LIKE` di `book.service.ts` dan `user.service.ts` belum menyertakan kolom terkait, UI tabel transaksi hanya mengekspor aksi kembali/hapus, dan stacking context elemen tengah donat menimpa layer tooltip.
* **Perbaikan:** Menambahkan `shelf_location`/`publisher` di `book.service.ts`, menambahkan `class_name` di `user.service.ts`, membangun [`StaffTransactionEditModal.tsx`](../../frontend/src/components/dashboard/StaffTransactionEditModal.tsx), mengganti logika grup sidebar menjadi pure expression index, serta mengatur `z-0`/`z-10` dan `wrapperStyle={{ zIndex: 40 }}` pada [`DashboardCharts.tsx`](../../frontend/src/components/dashboard/DashboardCharts.tsx).

---

### 8. Validasi Mismatch Password Live, Pusat Notifikasi Halaman Penuh & Penyatuan Kartu Sidebar
* **Gejala:**
  1. Pada halaman daftar (`/register`), ketidaksesuaian *Password* dan *Konfirmasi Password* baru terlihat setelah tombol kirim ditekan.
  2. Popover notifikasi di header sebelumnya belum memiliki halaman manajemen khusus, belum dapat ditandai terbaca atau dihapus secara persisten, dan menampilkan badge `• Live`.
  3. Kotak logo putih (`rounded-full`) di sidebar atas terpisah dari kotak label peran (`PANEL ADMINISTRATOR / PETUGAS`).
* **Akar Masalah:** Validasi konfirmasi password hanya dievaluasi saat submit, umpan notifikasi belum menyimpan status baca/hapus ke basis data, dan `PortalSidebar.tsx` memisahkan wadah logo dengan label peran.
* **Perbaikan:**
  1. Menambahkan validasi langsung `liveConfirmError` di [`register/page.tsx`](../../frontend/src/app/register/page.tsx).
  2. Menambahkan tabel `user_notification_states` ([`schema.sql`](../../database/schema.sql), [`db.ts`](../../backend/src/config/db.ts)), endpoint `PATCH/DELETE /api/auth/notifications*` ([`notification.service.ts`](../../backend/src/services/notification.service.ts), [`auth.controller.ts`](../../backend/src/controllers/auth.controller.ts), [`auth.routes.ts`](../../backend/src/routes/auth.routes.ts)), popover terbaru ([`PortalNotifications.tsx`](../../frontend/src/components/dashboard/PortalNotifications.tsx)), dan halaman penuh **Notifikasi** ([`NotificationsPagePanel.tsx`](../../frontend/src/components/dashboard/NotificationsPagePanel.tsx)).
  3. Menyatukan logo Denvora Lexora dan label peran aktif ke dalam satu kartu Cream `#FBF7F1` terpadu di [`PortalSidebar.tsx`](../../frontend/src/components/dashboard/PortalSidebar.tsx).

---

## Catatan Aktivitas Log Server Lokal

Semua aktivitas penting maupun error sistem juga dicatat otomatis ke file lokal [`backend/logs/app.log`](../../backend/logs/app.log) melalui [`appendLog()`](../../backend/src/utils/fileHelper.ts) (contoh: `auth.register`, `auth.otp.verified`, `auth.login`, `transaction.borrow`, `transaction.return`, `transaction.delete`, dan `report.exportCsv`).
