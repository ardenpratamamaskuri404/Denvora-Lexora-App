# Dokumentasi Modul, Fungsi & Prosedur (Hasil Generate)

> **Sumber:** Dihasilkan otomatis secara offline oleh [`backend/scripts/generate-code-docs.ts`](../../backend/scripts/generate-code-docs.ts) (`npm run docs:generate`)
> **Waktu Generate:** 2026-11-28 02:31:27 | **Total Modul:** 103 | **Total Simbol Terekspor:** 281
> **Versi HTML Interaktif Offline:** [`generated-code-docs/index.html`](./generated-code-docs/index.html)

---

## Backend (Express + TypeScript) (38 Modul)

### `app` — [`backend/src/app.ts`](../../backend/src/app.ts) (59 baris)

Konfigurasi aplikasi Express (TypeScript), CORS, Swagger UI offline, dan mounting routes.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 21 | `const` | `app` | Ekspor const app. |

### `config/db` — [`backend/src/config/db.ts`](../../backend/src/config/db.ts) (84 baris)

Konfigurasi connection pool MySQL menggunakan mysql2/promise.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 9 | `const` | `pool` | Ekspor const pool. |
| 33 | `function` | `ensureBooksMetadataColumns` | Memastikan kolom tambahan buku (`description`, `cover_url`) tersedia pada skema DB aktif. |
| 75 | `function` | `checkConnection` | Menguji koneksi ke database MySQL. @returns True jika koneksi aktif. |

### `config/env` — [`backend/src/config/env.ts`](../../backend/src/config/env.ts) (30 baris)

Konfigurasi terpusat environment backend dari file .env.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 10 | `const` | `env` | Ekspor const env. |

### `controllers/auth.controller` — [`backend/src/controllers/auth.controller.ts`](../../backend/src/controllers/auth.controller.ts) (198 baris)

Handler HTTP untuk registrasi siswa, login, OTP Mailpit, logout, dan profil sesi.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 13 | `function` | `register` | Ekspor function register. |
| 31 | `function` | `login` | Ekspor function login. |
| 50 | `function` | `sendOtp` | Ekspor function sendOtp. |
| 68 | `function` | `verifyOtp` | Ekspor function verifyOtp. |
| 94 | `function` | `logout` | Ekspor function logout. |
| 103 | `function` | `me` | Ekspor function me. |
| 107 | `function` | `updateProfile` | Ekspor function updateProfile. |
| 120 | `function` | `changePassword` | Ekspor function changePassword. |
| 133 | `function` | `listNotifications` | Ekspor function listNotifications. |
| 146 | `function` | `markNotificationRead` | Ekspor function markNotificationRead. |
| 159 | `function` | `markAllNotificationsRead` | Ekspor function markAllNotificationsRead. |
| 172 | `function` | `deleteNotification` | Ekspor function deleteNotification. |
| 185 | `function` | `clearNotifications` | Ekspor function clearNotifications. |

### `controllers/catalog.controller` — [`backend/src/controllers/catalog.controller.ts`](../../backend/src/controllers/catalog.controller.ts) (143 baris)

Handler HTTP bersama untuk kategori dan katalog buku.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 12 | `function` | `listCategories` | Ekspor function listCategories. |
| 25 | `function` | `createCategory` | Ekspor function createCategory. |
| 38 | `function` | `updateCategory` | Ekspor function updateCategory. |
| 51 | `function` | `deleteCategory` | Ekspor function deleteCategory. |
| 64 | `function` | `listBooks` | Ekspor function listBooks. |
| 78 | `function` | `getBook` | Ekspor function getBook. |
| 91 | `function` | `createBook` | Ekspor function createBook. |
| 104 | `function` | `updateBook` | Ekspor function updateBook. |
| 117 | `function` | `deleteBook` | Ekspor function deleteBook. |
| 130 | `function` | `uploadBookCover` | Ekspor function uploadBookCover. |

### `controllers/report.controller` — [`backend/src/controllers/report.controller.ts`](../../backend/src/controllers/report.controller.ts) (39 baris)

Handler HTTP untuk ringkasan statistik dan ekspor laporan CSV.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 11 | `function` | `getSummary` | Ekspor function getSummary. |
| 24 | `function` | `exportTransactionsCsv` | Ekspor function exportTransactionsCsv. |

### `controllers/transaction.controller` — [`backend/src/controllers/transaction.controller.ts`](../../backend/src/controllers/transaction.controller.ts) (134 baris)

Handler HTTP untuk peminjaman/pengembalian Siswa dan CRUD Transaksi Admin/Petugas.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 10 | `function` | `listMyTransactions` | Ekspor function listMyTransactions. |
| 24 | `function` | `borrowBySiswa` | Ekspor function borrowBySiswa. |
| 42 | `function` | `returnBySiswa` | Ekspor function returnBySiswa. |
| 58 | `function` | `listAllTransactions` | Ekspor function listAllTransactions. |
| 72 | `function` | `getTransaction` | Ekspor function getTransaction. |
| 85 | `function` | `createTransactionByStaff` | Ekspor function createTransactionByStaff. |
| 105 | `function` | `updateTransactionByStaff` | Ekspor function updateTransactionByStaff. |
| 122 | `function` | `deleteTransactionByStaff` | Ekspor function deleteTransactionByStaff. |

### `controllers/user.controller` — [`backend/src/controllers/user.controller.ts`](../../backend/src/controllers/user.controller.ts) (64 baris)

Factory handler HTTP bersama untuk pengelolaan Anggota (siswa) dan Petugas.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 13 | `function` | `createUserController` | Membuat kumpulan handler controller terparameterisasi untuk role 'siswa' atau 'petugas'. |

### `docs/openapi.paths` — [`backend/src/docs/openapi.paths.ts`](../../backend/src/docs/openapi.paths.ts) (178 baris)

Definisi path, parameter query/path, dan requestBody OpenAPI untuk Petugas dan Admin.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 150 | `const` | `staffAndAdminPaths` | Ekspor const staffAndAdminPaths. |

### `docs/openapi` — [`backend/src/docs/openapi.ts`](../../backend/src/docs/openapi.ts) (286 baris)

Spesifikasi OpenAPI 3.0 lokal (100% offline) untuk Swagger UI (/api-docs).

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 8 | `const` | `openApiSpec` | Ekspor const openApiSpec. |

### `middlewares/auth` — [`backend/src/middlewares/auth.ts`](../../backend/src/middlewares/auth.ts) (83 baris)

Middleware autentikasi sesi dan otorisasi berbasis peran (RBAC 3 role).

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 31 | `function` | `authMiddleware` | Memverifikasi sesi login dan menyisipkan data pengguna aktif ke req.user. |
| 70 | `function` | `requireRole` | Membatasi akses endpoint hanya untuk peran tertentu. |

### `middlewares/errorHandler` — [`backend/src/middlewares/errorHandler.ts`](../../backend/src/middlewares/errorHandler.ts) (55 baris)

Penanganan error terpusat REST API dengan format JSON seragam.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 21 | `function` | `notFoundHandler` | Handler untuk route yang tidak terdaftar (404). |
| 28 | `function` | `errorHandler` | Global error handler middleware Express. |

### `middlewares/validate` — [`backend/src/middlewares/validate.ts`](../../backend/src/middlewares/validate.ts) (31 baris)

Middleware validasi request body/query/params menggunakan Zod.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 13 | `function` | `validate` | Membuat middleware Express untuk memvalidasi bagian request tertentu terhadap skema Zod. |

### `routes/admin.routes` — [`backend/src/routes/admin.routes.ts`](../../backend/src/routes/admin.routes.ts) (51 baris)

Routing kendali penuh Admin (/api/admin/*) sesuai SPK UKK + kelola Petugas.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 20 | `const` | `adminRouter` | Ekspor const adminRouter. |

### `routes/auth.routes` — [`backend/src/routes/auth.routes.ts`](../../backend/src/routes/auth.routes.ts) (34 baris)

Routing autentikasi & OTP Mailpit (/api/auth/*).

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 19 | `const` | `authRouter` | Ekspor const authRouter. |

### `routes/petugas.routes` — [`backend/src/routes/petugas.routes.ts`](../../backend/src/routes/petugas.routes.ts) (24 baris)

Routing operasional Petugas (/api/petugas/* — RECOMMENDATION).

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 14 | `const` | `petugasRouter` | Ekspor const petugasRouter. |

### `routes/publicCatalog.routes` — [`backend/src/routes/publicCatalog.routes.ts`](../../backend/src/routes/publicCatalog.routes.ts) (15 baris)

Endpoint katalog baca-saja publik (/api/catalog/*) untuk pencarian live dari landing page.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 11 | `const` | `publicCatalogRouter` | Ekspor const publicCatalogRouter. |

### `routes/sharedStaff.routes` — [`backend/src/routes/sharedStaff.routes.ts`](../../backend/src/routes/sharedStaff.routes.ts) (103 baris)

Registrasi route bersama untuk namespace /api/petugas/* dan /api/admin/*.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 27 | `function` | `mountSharedStaffRoutes` | Memasang route katalog, transaksi, dan laporan pada router Admin atau Petugas. |

### `routes/siswa.routes` — [`backend/src/routes/siswa.routes.ts`](../../backend/src/routes/siswa.routes.ts) (41 baris)

Routing khusus peran Siswa (/api/siswa/*) sesuai flowmap dan hak akses UKK.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 18 | `const` | `siswaRouter` | Ekspor const siswaRouter. |

### `server` — [`backend/src/server.ts`](../../backend/src/server.ts) (15 baris)

Entrypoint menjalankan HTTP server Express (TypeScript) pada localhost.

_Tidak ada simbol terekspor langsung (konfigurasi/entry-point)._

### `services/auth.service` — [`backend/src/services/auth.service.ts`](../../backend/src/services/auth.service.ts) (226 baris)

Logika bisnis pendaftaran anggota siswa, login, dan verifikasi OTP Mailpit.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 19 | `interface` | `PublicUserDto` | Ekspor interface PublicUserDto. |
| 50 | `function` | `registerSiswa` | Mendaftarkan anggota baru dengan role dikunci sebagai 'siswa' dan mengirim OTP via Mailpit. |
| 125 | `function` | `loginUser` | Memvalidasi kredensial login (username atau email) dan membuat token sesi HMAC. |
| 178 | `function` | `updateOwnProfile` | Memperbarui profil akun milik pengguna yang sedang login. |
| 207 | `function` | `changeOwnPassword` | Mengganti password pengguna setelah memverifikasi password saat ini. |

### `services/book.service` — [`backend/src/services/book.service.ts`](../../backend/src/services/book.service.ts) (234 baris)

Logika bisnis katalog buku, pencarian kondisi tertentu, dan penjagaan stok.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 10 | `interface` | `BookRow` | Ekspor interface BookRow. |
| 28 | `interface` | `BookQuery` | Ekspor interface BookQuery. |
| 36 | `interface` | `BookInput` | Ekspor interface BookInput. |
| 52 | `function` | `listBooks` | Mengambil daftar buku dengan filter kondisi tertentu dan paginasi. |
| 113 | `function` | `getBookById` | Mengambil detail satu buku berdasarkan ID. |
| 142 | `function` | `createBook` | Menambahkan buku baru ke katalog. |
| 169 | `function` | `updateBook` | Memperbarui data buku dengan menjaga selisih buku yang sedang dipinjam aktif. |
| 210 | `function` | `deleteBook` | Menghapus buku (ditolak jika masih memiliki pinjaman aktif atau riwayat transaksi). |

### `services/category.service` — [`backend/src/services/category.service.ts`](../../backend/src/services/category.service.ts) (81 baris)

Logika bisnis CRUD kategori buku.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 10 | `interface` | `CategoryRow` | Ekspor interface CategoryRow. |
| 20 | `function` | `listCategories` | Mengambil seluruh daftar kategori beserta jumlah buku di tiap kategori. |
| 34 | `function` | `createCategory` | Menambahkan kategori buku baru. |
| 49 | `function` | `updateCategory` | Memperbarui nama kategori berdasarkan ID. |
| 67 | `function` | `deleteCategory` | Menghapus kategori jika tidak lagi digunakan oleh buku mana pun. |

### `services/notification.service` — [`backend/src/services/notification.service.ts`](../../backend/src/services/notification.service.ts) (203 baris)

Menghasilkan umpan notifikasi real-time per peran lengkap dengan status dibaca & hapus persisten di MySQL.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 10 | `interface` | `NotificationItem` | Ekspor interface NotificationItem. |
| 137 | `function` | `getNotificationsForUser` | Mengambil daftar notifikasi aktif pengguna beserta status dibaca dan jumlah belum dibaca. |
| 168 | `function` | `markNotificationRead` | Menandai satu notifikasi sebagai sudah dibaca. |
| 178 | `function` | `markAllNotificationsRead` | Menandai seluruh notifikasi aktif milik pengguna sebagai sudah dibaca. |
| 186 | `function` | `deleteNotification` | Menghapus (menyembunyikan) satu notifikasi untuk pengguna aktif. |
| 196 | `function` | `clearNotifications` | Menghapus semua notifikasi yang sudah berstatus dibaca (atau seluruhnya jika mode='all'). |

### `services/otp.service` — [`backend/src/services/otp.service.ts`](../../backend/src/services/otp.service.ts) (159 baris)

Penerbitan, hashing, pengiriman via Mailpit, dan verifikasi kode OTP 6 digit.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 16 | `type` | `OtpPurpose` | Ekspor type OtpPurpose. |
| 41 | `function` | `issueAndSendOtp` | Membuat kode OTP baru, menyimpan hash di MySQL, dan mengirimkannya ke Mailpit. |
| 76 | `function` | `requestOtpByEmail` | Meminta kirim ulang atau pengiriman OTP baru berdasarkan alamat email terdaftar. |
| 108 | `function` | `verifyOtpCode` | Memvalidasi OTP 6 digit dari Mailpit dan mengaktifkan verifikasi / sesi pengguna. |

### `services/report.service` — [`backend/src/services/report.service.ts`](../../backend/src/services/report.service.ts) (166 baris)

Agregasi ringkasan statistik menggunakan array dan ekspor laporan CSV ke file lokal.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 22 | `function` | `getLibrarySummary` | Mengambil ringkasan statistik perpustakaan secara riil dari database. |
| 117 | `function` | `exportTransactionsCsv` | Menghasilkan file CSV transaksi sesuai filter dan menyimpannya ke backend/exports/. |

### `services/transaction.service` — [`backend/src/services/transaction.service.ts`](../../backend/src/services/transaction.service.ts) (278 baris)

Mutasi transaksi peminjaman dan pengembalian buku secara atomik (FOR UPDATE).

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 28 | `function` | `createBorrowTransaction` | Mencatat peminjaman buku baru secara atomik dengan penguncian stok (FOR UPDATE). |
| 106 | `function` | `returnTransaction` | Memproses pengembalian buku secara atomik dan menambah kembali stok tersedia. |
| 167 | `function` | `updateTransactionByStaff` | Memperbarui data transaksi oleh Admin/Petugas beserta sinkronisasi stok jika status berubah. |
| 247 | `function` | `deleteTransactionByStaff` | Menghapus catatan transaksi oleh Admin/Petugas (memulihkan stok jika masih borrowed). |

### `services/transactionQuery.service` — [`backend/src/services/transactionQuery.service.ts`](../../backend/src/services/transactionQuery.service.ts) (191 baris)

Query baca transaksi peminjaman/pengembalian dan kalkulasi keterlambatan.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 10 | `interface` | `TransactionRow` | Ekspor interface TransactionRow. |
| 31 | `interface` | `TransactionDto` | Ekspor interface TransactionDto. |
| 36 | `interface` | `StaffTransactionQuery` | Ekspor interface StaffTransactionQuery. |
| 46 | `function` | `formatDateLocal` | Ekspor function formatDateLocal. |
| 53 | `function` | `addDays` | Ekspor function addDays. |
| 62 | `function` | `computeOverdueInfo` | Menghitung status dan jumlah hari keterlambatan berdasarkan due_date. |
| 92 | `function` | `getTransactionById` | Mengambil detail satu transaksi beserta status keterlambatan. |
| 106 | `function` | `listMyTransactions` | Mengambil daftar riwayat transaksi milik siswa yang sedang login. |
| 129 | `function` | `listAllTransactions` | Mengambil seluruh transaksi untuk Admin/Petugas dengan filter kondisi tertentu. |

### `services/user.service` — [`backend/src/services/user.service.ts`](../../backend/src/services/user.service.ts) (221 baris)

Logika bisnis bersama untuk pengelolaan Anggota (siswa) dan Petugas (staff).

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 12 | `interface` | `UserListRow` | Ekspor interface UserListRow. |
| 18 | `interface` | `UserQuery` | Ekspor interface UserQuery. |
| 25 | `interface` | `ManageUserInput` | Ekspor interface ManageUserInput. |
| 39 | `function` | `listUsersByRole` | Mengambil daftar pengguna berdasarkan peran ('siswa' atau 'petugas') dengan filter pencarian. |
| 95 | `function` | `getUserByIdAndRole` | Mengambil detail satu anggota atau petugas sesuai role. |
| 122 | `function` | `createUserByRole` | Membuat akun anggota atau petugas baru oleh Admin. |
| 152 | `function` | `updateUserByRole` | Memperbarui data anggota atau petugas beserta password opsional. |
| 197 | `function` | `deleteUserByRole` | Menghapus akun anggota atau petugas dengan pengecekan pinjaman aktif dan riwayat. |

### `utils/fileHelper` — [`backend/src/utils/fileHelper.ts`](../../backend/src/utils/fileHelper.ts) (124 baris)

Modul akses file lokal menggunakan fs/promises untuk logging aplikasi dan ekspor laporan CSV (memenuhi kriteria kompetensi UKK PPsp 1.12).

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 16 | `interface` | `CsvColumn` | Ekspor interface CsvColumn. |
| 28 | `function` | `appendLog` | Menambahkan baris log aktivitas/error ke backend/logs/app.log. |
| 61 | `function` | `buildCsvContent` | Mengubah array objek menjadi string CSV menggunakan pemrosesan array. |
| 75 | `function` | `writeCsvExport` | Menyimpan file ekspor CSV ke folder backend/exports/ dan mengembalikan isi serta path-nya. |
| 99 | `function` | `saveBookCoverFile` | Menyimpan file cover buku dari data URL base64 ke folder lokal backend/uploads/covers/. |

### `utils/mailer` — [`backend/src/utils/mailer.ts`](../../backend/src/utils/mailer.ts) (79 baris)

Pengirim email OTP lokal melalui SMTP Mailpit (100% offline localhost).

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 17 | `interface` | `SendOtpEmailParams` | Ekspor interface SendOtpEmailParams. |
| 27 | `function` | `sendOtpEmail` | Mengirim kode OTP 6 digit ke kotak masuk Mailpit lokal. |

### `utils/response` — [`backend/src/utils/response.ts`](../../backend/src/utils/response.ts) (60 baris)

Helper standarisasi response JSON REST API dan error aplikasi.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 8 | `interface` | `ValidationIssue` | Ekspor interface ValidationIssue. |
| 16 | `class` | `AppError` | Custom error dengan kode status HTTP dan detail validasi opsional. |
| 31 | `function` | `sendSuccess` | Mengirim response sukses berformat standar. |
| 48 | `function` | `sendError` | Mengirim response error berformat standar. |

### `utils/token` — [`backend/src/utils/token.ts`](../../backend/src/utils/token.ts) (97 baris)

Penandatanganan dan verifikasi token sesi berbasis HMAC-SHA256 menggunakan modul crypto bawaan Node.js tanpa dependensi eksternal tambahan.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 11 | `interface` | `SessionPayload` | Ekspor interface SessionPayload. |
| 32 | `function` | `signSessionToken` | Membuat token sesi bertanda tangan untuk pengguna terautentikasi. |
| 51 | `function` | `verifySessionToken` | Memverifikasi keaslian dan masa berlaku token sesi. |
| 81 | `function` | `parseCookies` | Mem-parsing header Cookie HTTP secara ringan tanpa dependensi tambahan. |

### `validators/auth` — [`backend/src/validators/auth.validator.ts`](../../backend/src/validators/auth.validator.ts) (72 baris)

Skema validasi Zod untuk pendaftaran anggota, login, dan verifikasi OTP.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 8 | `const` | `registerSchema` | Ekspor const registerSchema. |
| 29 | `const` | `loginSchema` | Ekspor const loginSchema. |
| 34 | `const` | `sendOtpSchema` | Ekspor const sendOtpSchema. |
| 39 | `const` | `verifyOtpSchema` | Ekspor const verifyOtpSchema. |
| 48 | `const` | `updateProfileSchema` | Ekspor const updateProfileSchema. |
| 68 | `const` | `changePasswordSchema` | Ekspor const changePasswordSchema. |

### `validators/catalog` — [`backend/src/validators/catalog.validator.ts`](../../backend/src/validators/catalog.validator.ts) (41 baris)

Skema validasi Zod untuk kategori dan data buku beserta pencarian kondisi tertentu.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 8 | `const` | `categorySchema` | Ekspor const categorySchema. |
| 12 | `const` | `bookBodySchema` | Ekspor const bookBodySchema. |
| 29 | `const` | `coverUploadSchema` | Ekspor const coverUploadSchema. |
| 34 | `const` | `bookQuerySchema` | Ekspor const bookQuerySchema. |

### `validators/common` — [`backend/src/validators/common.validator.ts`](../../backend/src/validators/common.validator.ts) (11 baris)

Skema validasi umum untuk parameter URL.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 8 | `const` | `idParamSchema` | Ekspor const idParamSchema. |

### `validators/transaction` — [`backend/src/validators/transaction.validator.ts`](../../backend/src/validators/transaction.validator.ts) (56 baris)

Skema validasi Zod untuk transaksi peminjaman, pengembalian, dan filter kondisi tertentu.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 10 | `const` | `siswaBorrowSchema` | Ekspor const siswaBorrowSchema. |
| 15 | `const` | `staffCreateTransactionSchema` | Ekspor const staffCreateTransactionSchema. |
| 31 | `const` | `staffUpdateTransactionSchema` | Ekspor const staffUpdateTransactionSchema. |
| 43 | `const` | `siswaTransactionQuerySchema` | Ekspor const siswaTransactionQuerySchema. |
| 47 | `const` | `staffTransactionQuerySchema` | Ekspor const staffTransactionQuerySchema. |

### `validators/user` — [`backend/src/validators/user.validator.ts`](../../backend/src/validators/user.validator.ts) (57 baris)

Skema validasi Zod untuk pengelolaan anggota siswa dan akun petugas.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 29 | `const` | `memberCreateSchema` | Ekspor const memberCreateSchema. |
| 35 | `const` | `memberUpdateSchema` | Ekspor const memberUpdateSchema. |
| 41 | `const` | `staffCreateSchema` | Ekspor const staffCreateSchema. |
| 46 | `const` | `staffUpdateSchema` | Ekspor const staffUpdateSchema. |
| 51 | `const` | `userQuerySchema` | Ekspor const userQuerySchema. |

## Frontend (Next.js + React) (65 Modul)

### `frontend/src/app/admin/page.tsx` — [`frontend/src/app/admin/page.tsx`](../../frontend/src/app/admin/page.tsx) (6 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 3 | `function` | `AdminDashboardPage` | Ekspor function AdminDashboardPage. |

### `frontend/src/app/alur/page.tsx` — [`frontend/src/app/alur/page.tsx`](../../frontend/src/app/alur/page.tsx) (24 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 7 | `const` | `metadata` | Ekspor const metadata. |
| 12 | `function` | `AlurPage` | Ekspor function AlurPage. |

### `frontend/src/app/fitur/page.tsx` — [`frontend/src/app/fitur/page.tsx`](../../frontend/src/app/fitur/page.tsx) (24 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 7 | `const` | `metadata` | Ekspor const metadata. |
| 12 | `function` | `FiturPage` | Ekspor function FiturPage. |

### `frontend/src/app/layout.tsx` — [`frontend/src/app/layout.tsx`](../../frontend/src/app/layout.tsx) (30 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 5 | `const` | `metadata` | Ekspor const metadata. |
| 13 | `function` | `RootLayout` | Ekspor function RootLayout. |

### `app/login/page` — [`frontend/src/app/login/page.tsx`](../../frontend/src/app/login/page.tsx) (158 baris)

Halaman Login terpadu sesuai alur SPK-3/4 dengan dukungan verifikasi dan pemulihan OTP.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 151 | `function` | `LoginPage` | Ekspor function LoginPage. |

### `app/otp/page` — [`frontend/src/app/otp/page.tsx`](../../frontend/src/app/otp/page.tsx) (256 baris)

Halaman verifikasi kode OTP 6 digit untuk aktivasi email dan pemulihan akses akun.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 249 | `function` | `OtpPage` | Ekspor function OtpPage. |

### `frontend/src/app/page.tsx` — [`frontend/src/app/page.tsx`](../../frontend/src/app/page.tsx) (24 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 9 | `function` | `HomePage` | Ekspor function HomePage. |

### `frontend/src/app/petugas/page.tsx` — [`frontend/src/app/petugas/page.tsx`](../../frontend/src/app/petugas/page.tsx) (6 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 3 | `function` | `PetugasDashboardPage` | Ekspor function PetugasDashboardPage. |

### `app/register/page` — [`frontend/src/app/register/page.tsx`](../../frontend/src/app/register/page.tsx) (243 baris)

Halaman pendaftaran anggota siswa baru sesuai alur SPK-3/4 dengan verifikasi OTP.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 16 | `function` | `RegisterPage` | Ekspor function RegisterPage. |

### `frontend/src/app/siswa/page.tsx` — [`frontend/src/app/siswa/page.tsx`](../../frontend/src/app/siswa/page.tsx) (6 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 3 | `function` | `SiswaDashboardPage` | Ekspor function SiswaDashboardPage. |

### `frontend/src/app/tentang/page.tsx` — [`frontend/src/app/tentang/page.tsx`](../../frontend/src/app/tentang/page.tsx) (24 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 7 | `const` | `metadata` | Ekspor const metadata. |
| 12 | `function` | `TentangPage` | Ekspor function TentangPage. |

### `frontend/src/components/auth/AuthField.tsx` — [`frontend/src/components/auth/AuthField.tsx`](../../frontend/src/components/auth/AuthField.tsx) (76 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 20 | `function` | `AuthField` | Ekspor function AuthField. |

### `components/auth/AuthShell` — [`frontend/src/components/auth/AuthShell.tsx`](../../frontend/src/components/auth/AuthShell.tsx) (133 baris)

Layout full-layar terbelah kurva Cream Mocha yang tersinkron dengan tema Light/Dark global.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 20 | `function` | `AuthShell` | Ekspor function AuthShell. |

### `components/dashboard/AccountSettingsPanel` — [`frontend/src/components/dashboard/AccountSettingsPanel.tsx`](../../frontend/src/components/dashboard/AccountSettingsPanel.tsx) (257 baris)

Panel pengaturan profil pribadi dan keamanan password untuk semua peran (Admin, Petugas, Siswa).

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 19 | `function` | `AccountSettingsPanel` | Ekspor function AccountSettingsPanel. |

### `components/dashboard/BookCatalogTable` — [`frontend/src/components/dashboard/BookCatalogTable.tsx`](../../frontend/src/components/dashboard/BookCatalogTable.tsx) (155 baris)

Tabel daftar buku katalog dilengkapi thumbnail sampul, detail deskripsi, dan aksi pinjam/kelola.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 22 | `function` | `BookCatalogTable` | Ekspor function BookCatalogTable. |

### `components/dashboard/BookCoverUploader` — [`frontend/src/components/dashboard/BookCoverUploader.tsx`](../../frontend/src/components/dashboard/BookCoverUploader.tsx) (102 baris)

Komponen pratinjau dan unggah gambar sampul buku lokal untuk Admin dan Petugas.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 23 | `function` | `BookCoverUploader` | Ekspor function BookCoverUploader. |

### `components/dashboard/BookDetailModal` — [`frontend/src/components/dashboard/BookDetailModal.tsx`](../../frontend/src/components/dashboard/BookDetailModal.tsx) (152 baris)

Modal detail lengkap buku menampilkan cover, sinopsis/deskripsi, metadata, dan aksi pinjam langsung.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 21 | `function` | `BookDetailModal` | Ekspor function BookDetailModal. |

### `components/dashboard/BookFormModal` — [`frontend/src/components/dashboard/BookFormModal.tsx`](../../frontend/src/components/dashboard/BookFormModal.tsx) (255 baris)

Modal formulir tambah/ubah buku lengkap dengan unggah sampul gambar lokal dan deskripsi buku.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 24 | `function` | `BookFormModal` | Ekspor function BookFormModal. |

### `components/dashboard/CatalogBooksPanel` — [`frontend/src/components/dashboard/CatalogBooksPanel.tsx`](../../frontend/src/components/dashboard/CatalogBooksPanel.tsx) (294 baris)

Panel katalog buku dengan pencarian kondisi tertentu, detail sampul/deskripsi, aksi pinjam Siswa, dan CRUD Admin/Petugas.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 33 | `function` | `CatalogBooksPanel` | Ekspor function CatalogBooksPanel. |

### `components/dashboard/CategoryManagerCard` — [`frontend/src/components/dashboard/CategoryManagerCard.tsx`](../../frontend/src/components/dashboard/CategoryManagerCard.tsx) (183 baris)

Panel ringkas pengelolaan kategori buku untuk Petugas dan Admin.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 25 | `function` | `CategoryManagerCard` | Ekspor function CategoryManagerCard. |

### `components/dashboard/DashboardCharts` — [`frontend/src/components/dashboard/DashboardCharts.tsx`](../../frontend/src/components/dashboard/DashboardCharts.tsx) (216 baris)

Grafik interaktif Recharts (AreaChart & Donut PieChart) lengkap dengan animasi gerak & tooltip real-time.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 40 | `function` | `DashboardCharts` | Ekspor function DashboardCharts. |

### `components/dashboard/NotificationsPagePanel` — [`frontend/src/components/dashboard/NotificationsPagePanel.tsx`](../../frontend/src/components/dashboard/NotificationsPagePanel.tsx) (261 baris)

Halaman penuh manajemen notifikasi untuk membaca, memfilter, mencari, menghapus item, dan membuka halaman terkait.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 26 | `interface` | `NotificationsPagePanelProps` | Ekspor interface NotificationsPagePanelProps. |
| 70 | `function` | `NotificationsPagePanel` | Ekspor function NotificationsPagePanel. |

### `components/dashboard/PaginationBar` — [`frontend/src/components/dashboard/PaginationBar.tsx`](../../frontend/src/components/dashboard/PaginationBar.tsx) (45 baris)

Kontrol navigasi halaman bersama untuk tabel katalog, transaksi, dan pengguna.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 12 | `function` | `PaginationBar` | Ekspor function PaginationBar. |

### `components/dashboard/PortalGlobalSearch` — [`frontend/src/components/dashboard/PortalGlobalSearch.tsx`](../../frontend/src/components/dashboard/PortalGlobalSearch.tsx) (175 baris)

Searchbar real-time di topbar portal semua peran untuk mencari koleksi buku secara instan.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 21 | `function` | `PortalGlobalSearch` | Ekspor function PortalGlobalSearch. |

### `components/dashboard/PortalNotifications` — [`frontend/src/components/dashboard/PortalNotifications.tsx`](../../frontend/src/components/dashboard/PortalNotifications.tsx) (222 baris)

Popover notifikasi bel interaktif dengan status terbaca, hapus item, dan tautan ke halaman notifikasi.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 39 | `function` | `PortalNotifications` | Ekspor function PortalNotifications. |

### `components/dashboard/PortalShell` — [`frontend/src/components/dashboard/PortalShell.tsx`](../../frontend/src/components/dashboard/PortalShell.tsx) (229 baris)

Kerangka dashboard profesional dengan toggle garis 3, searchbar real-time, notifikasi, dan menu dropdown profil.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 22 | `interface` | `PortalNavItem` | Ekspor interface PortalNavItem. |
| 62 | `function` | `PortalShell` | Ekspor function PortalShell. |

### `components/dashboard/PortalSidebar` — [`frontend/src/components/dashboard/PortalSidebar.tsx`](../../frontend/src/components/dashboard/PortalSidebar.tsx) (185 baris)

Sidebar terkelompok Cream Mocha yang dapat dilipat dengan logo Denvora asli dan kartu peran bersih.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 24 | `function` | `PortalNavList` | Ekspor function PortalNavList. |
| 89 | `function` | `PortalSidebar` | Ekspor function PortalSidebar. |

### `components/dashboard/PortalUserMenu` — [`frontend/src/components/dashboard/PortalUserMenu.tsx`](../../frontend/src/components/dashboard/PortalUserMenu.tsx) (151 baris)

Menu dropdown profil pengguna di topbar kanan yang menampilkan nama, email, dan pintasan akun untuk semua role.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 27 | `function` | `PortalUserMenu` | Ekspor function PortalUserMenu. |

### `components/dashboard/ReportsOverviewPanel` — [`frontend/src/components/dashboard/ReportsOverviewPanel.tsx`](../../frontend/src/components/dashboard/ReportsOverviewPanel.tsx) (158 baris)

Panel dashboard utama Admin/Petugas dengan 4 kartu KPI, grafik tren & kategori, dan ekspor CSV.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 22 | `function` | `ReportsOverviewPanel` | Ekspor function ReportsOverviewPanel. |

### `components/dashboard/SiswaDashboardView` — [`frontend/src/components/dashboard/SiswaDashboardView.tsx`](../../frontend/src/components/dashboard/SiswaDashboardView.tsx) (300 baris)

Portal real-time Siswa dengan grafik animasi Recharts, notifikasi langsung, detail cover/deskripsi, dan pengaturan akun.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 293 | `function` | `SiswaDashboardView` | Ekspor function SiswaDashboardView. |

### `components/dashboard/SiswaLoansPanel` — [`frontend/src/components/dashboard/SiswaLoansPanel.tsx`](../../frontend/src/components/dashboard/SiswaLoansPanel.tsx) (193 baris)

Panel riwayat peminjaman aktif dan pengembalian buku khusus Siswa.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 19 | `function` | `SiswaLoansPanel` | Ekspor function SiswaLoansPanel. |

### `components/dashboard/StaffDashboardView` — [`frontend/src/components/dashboard/StaffDashboardView.tsx`](../../frontend/src/components/dashboard/StaffDashboardView.tsx) (246 baris)

Portal real-time Petugas & Admin dengan sidebar lipat, notifikasi langsung, grafik Recharts, dan pengaturan akun.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 239 | `function` | `StaffDashboardView` | Ekspor function StaffDashboardView. |

### `components/dashboard/StaffTransactionEditModal` — [`frontend/src/components/dashboard/StaffTransactionEditModal.tsx`](../../frontend/src/components/dashboard/StaffTransactionEditModal.tsx) (178 baris)

Modal ubah status, tanggal jatuh tempo, tanggal kembali, dan catatan transaksi oleh Petugas/Admin.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 29 | `function` | `StaffTransactionEditModal` | Ekspor function StaffTransactionEditModal. |

### `components/dashboard/StaffTransactionModal` — [`frontend/src/components/dashboard/StaffTransactionModal.tsx`](../../frontend/src/components/dashboard/StaffTransactionModal.tsx) (214 baris)

Modal catat peminjaman buku baru oleh Petugas atau Admin.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 34 | `function` | `StaffTransactionModal` | Ekspor function StaffTransactionModal. |

### `components/dashboard/StaffTransactionsPanel` — [`frontend/src/components/dashboard/StaffTransactionsPanel.tsx`](../../frontend/src/components/dashboard/StaffTransactionsPanel.tsx) (288 baris)

Panel manajemen transaksi peminjaman/pengembalian lengkap untuk Admin dan Petugas beserta ekspor CSV.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 30 | `function` | `StaffTransactionsPanel` | Ekspor function StaffTransactionsPanel. |

### `components/dashboard/StatCard` — [`frontend/src/components/dashboard/StatCard.tsx`](../../frontend/src/components/dashboard/StatCard.tsx) (115 baris)

Kartu KPI bergaya shadcn/ui dengan animasi Motion lembut dan tombol aksi cepat.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 36 | `function` | `StatCard` | Ekspor function StatCard. |

### `components/dashboard/TransactionTable` — [`frontend/src/components/dashboard/TransactionTable.tsx`](../../frontend/src/components/dashboard/TransactionTable.tsx) (116 baris)

Tabel transaksi sirkulasi perpustakaan untuk panel Petugas dan Admin.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 17 | `function` | `TransactionTable` | Ekspor function TransactionTable. |

### `components/dashboard/UserFormModal` — [`frontend/src/components/dashboard/UserFormModal.tsx`](../../frontend/src/components/dashboard/UserFormModal.tsx) (219 baris)

Modal tambah/ubah akun Anggota (siswa) dan Petugas layanan untuk Admin.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 21 | `function` | `UserFormModal` | Ekspor function UserFormModal. |

### `components/dashboard/UsersManagementPanel` — [`frontend/src/components/dashboard/UsersManagementPanel.tsx`](../../frontend/src/components/dashboard/UsersManagementPanel.tsx) (274 baris)

Panel terpadu untuk membaca/mengelola Anggota Siswa dan Petugas Perpustakaan.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 29 | `function` | `UsersManagementPanel` | Ekspor function UsersManagementPanel. |

### `frontend/src/components/landing/AboutFaqView.tsx` — [`frontend/src/components/landing/AboutFaqView.tsx`](../../frontend/src/components/landing/AboutFaqView.tsx) (117 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 30 | `function` | `AboutFaqView` | Ekspor function AboutFaqView. |

### `frontend/src/components/landing/AboutMoreSections.tsx` — [`frontend/src/components/landing/AboutMoreSections.tsx`](../../frontend/src/components/landing/AboutMoreSections.tsx) (136 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 32 | `function` | `AboutMoreSections` | Ekspor function AboutMoreSections. |

### `frontend/src/components/landing/AmbientSparkles.tsx` — [`frontend/src/components/landing/AmbientSparkles.tsx`](../../frontend/src/components/landing/AmbientSparkles.tsx) (80 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 29 | `function` | `AmbientSparkles` | Ekspor function AmbientSparkles. |

### `frontend/src/components/landing/BrandStorySection.tsx` — [`frontend/src/components/landing/BrandStorySection.tsx`](../../frontend/src/components/landing/BrandStorySection.tsx) (135 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 16 | `function` | `BrandStorySection` | Ekspor function BrandStorySection. |

### `frontend/src/components/landing/ExplorePillarsSection.tsx` — [`frontend/src/components/landing/ExplorePillarsSection.tsx`](../../frontend/src/components/landing/ExplorePillarsSection.tsx) (97 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 34 | `function` | `ExplorePillarsSection` | Ekspor function ExplorePillarsSection. |

### `frontend/src/components/landing/FeaturesMoreSections.tsx` — [`frontend/src/components/landing/FeaturesMoreSections.tsx`](../../frontend/src/components/landing/FeaturesMoreSections.tsx) (163 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 54 | `function` | `FeaturesMoreSections` | Ekspor function FeaturesMoreSections. |

### `frontend/src/components/landing/FeaturesView.tsx` — [`frontend/src/components/landing/FeaturesView.tsx`](../../frontend/src/components/landing/FeaturesView.tsx) (185 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 57 | `function` | `FeaturesView` | Ekspor function FeaturesView. |

### `frontend/src/components/landing/FlowMoreSections.tsx` — [`frontend/src/components/landing/FlowMoreSections.tsx`](../../frontend/src/components/landing/FlowMoreSections.tsx) (155 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 51 | `function` | `FlowMoreSections` | Ekspor function FlowMoreSections. |

### `frontend/src/components/landing/FlowView.tsx` — [`frontend/src/components/landing/FlowView.tsx`](../../frontend/src/components/landing/FlowView.tsx) (174 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 49 | `function` | `FlowView` | Ekspor function FlowView. |

### `frontend/src/components/landing/HeroSection.tsx` — [`frontend/src/components/landing/HeroSection.tsx`](../../frontend/src/components/landing/HeroSection.tsx) (255 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 23 | `function` | `HeroSection` | Ekspor function HeroSection. |

### `frontend/src/components/landing/HomeExtraSections.tsx` — [`frontend/src/components/landing/HomeExtraSections.tsx`](../../frontend/src/components/landing/HomeExtraSections.tsx) (143 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 52 | `function` | `HomeExtraSections` | Ekspor function HomeExtraSections. |

### `components/landing/LandingNavbar` — [`frontend/src/components/landing/LandingNavbar.tsx`](../../frontend/src/components/landing/LandingNavbar.tsx) (227 baris)

Navbar utama mengambang responsif yang beradaptasi untuk tamu maupun pengguna terautentikasi (tombol kembali ke Dashboard).

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 91 | `function` | `LandingNavbar` | Ekspor function LandingNavbar. |

### `components/landing/LandingUserMenu` — [`frontend/src/components/landing/LandingUserMenu.tsx`](../../frontend/src/components/landing/LandingUserMenu.tsx) (187 baris)

Tombol profil pengguna pada navbar publik agar pengguna aktif mudah kembali ke dashboard perannya.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 27 | `function` | `LandingUserMenu` | Ekspor function LandingUserMenu. |

### `components/landing/SiteFooter` — [`frontend/src/components/landing/SiteFooter.tsx`](../../frontend/src/components/landing/SiteFooter.tsx) (252 baris)

Footer 4 kolom Cream Mocha penuh hingga sudut layar dengan live search katalog buku.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 60 | `function` | `SiteFooter` | Ekspor function SiteFooter. |

### `frontend/src/components/landing/StoryRevealSection.tsx` — [`frontend/src/components/landing/StoryRevealSection.tsx`](../../frontend/src/components/landing/StoryRevealSection.tsx) (104 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 10 | `function` | `StoryRevealSection` | Ekspor function StoryRevealSection. |

### `frontend/src/components/Splash/Splash.tsx` — [`frontend/src/components/Splash/Splash.tsx`](../../frontend/src/components/Splash/Splash.tsx) (130 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 22 | `function` | `Splash` | Ekspor function Splash. |

### `frontend/src/components/ui/badge.tsx` — [`frontend/src/components/ui/badge.tsx`](../../frontend/src/components/ui/badge.tsx) (30 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 23 | `interface` | `BadgeProps` | Ekspor interface BadgeProps. |
| 27 | `function` | `Badge` | Ekspor function Badge. |

### `frontend/src/components/ui/button.tsx` — [`frontend/src/components/ui/button.tsx`](../../frontend/src/components/ui/button.tsx) (56 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 37 | `interface` | `ButtonProps` | Ekspor interface ButtonProps. |
| 43 | `const` | `Button` | Ekspor const Button. |

### `components/ui/card` — [`frontend/src/components/ui/card.tsx`](../../frontend/src/components/ui/card.tsx) (60 baris)

Komponen Card bergaya shadcn/ui yang dikustomisasi ke tema Cream Mocha Denvora Lexora.

_Tidak ada simbol terekspor langsung (konfigurasi/entry-point)._

### `lib/api` — [`frontend/src/lib/api.ts`](../../frontend/src/lib/api.ts) (215 baris)

Klien HTTP terpusat untuk komunikasi dengan REST API backend Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 15 | `const` | `API_BASE_URL` | Ekspor const API_BASE_URL. |
| 18 | `const` | `ASSET_BASE_URL` | Ekspor const ASSET_BASE_URL. |
| 21 | `function` | `resolveBookCoverUrl` | Mengubah path asset (/uploads/... atau /covers/...) menjadi URL siap tampil. |
| 28 | `class` | `ApiRequestError` | Representasi error terstruktur yang dikembalikan oleh REST API. |
| 40 | `function` | `formatApiError` | Mengubah error API/validasi menjadi pesan ringkas yang mudah dipahami pengguna. |
| 57 | `function` | `apiRequest` | Mengirim permintaan HTTP terautentikasi cookie HttpOnly ke server backend lokal. @param path Path endpoint relatif terhadap API_BASE_URL @param options Konfigurasi fetch standar |
| 96 | `interface` | `RegisterPayload` | Ekspor interface RegisterPayload. |
| 107 | `function` | `registerApi` | Mendaftarkan anggota siswa baru dan memicu pengiriman OTP verifikasi. |
| 115 | `function` | `loginApi` | Memvalidasi kredensial pengguna (username atau email beserta password). |
| 123 | `function` | `sendOtpApi` | Mengirim kode OTP 6 digit ke alamat email terdaftar melalui layanan surat lokal. |
| 134 | `function` | `verifyOtpApi` | Memverifikasi kode OTP 6 digit untuk aktivasi akun atau pemulihan akses masuk. |
| 142 | `function` | `meApi` | Mengambil profil sesi pengguna yang sedang aktif. |
| 147 | `function` | `logoutApi` | Menghapus sesi aktif pengguna saat keluar dari sistem. |
| 152 | `function` | `searchPublicBooksApi` | Mencari buku katalog publik secara live berdasarkan kata kunci. |
| 162 | `function` | `updateProfileApi` | Memperbarui data profil akun milik pengguna yang sedang aktif. |
| 175 | `function` | `changePasswordApi` | Mengubah password pengguna setelah memverifikasi password saat ini. |
| 186 | `function` | `fetchNotificationsApi` | Mengambil umpan notifikasi real-time sesuai peran akun aktif. |
| 191 | `function` | `markNotificationReadApi` | Menandai satu notifikasi sudah dibaca untuk akun aktif. |
| 198 | `function` | `markAllNotificationsReadApi` | Menandai semua notifikasi aktif sudah dibaca. |
| 203 | `function` | `deleteNotificationApi` | Menghapus / menyembunyikan satu notifikasi dari daftar akun aktif. |
| 210 | `function` | `clearNotificationsApi` | Membersihkan notifikasi yang sudah dibaca atau seluruh notifikasi aktif. |

### `lib/portalApi` — [`frontend/src/lib/portalApi.ts`](../../frontend/src/lib/portalApi.ts) (263 baris)

Klien REST API terparameterisasi untuk operasi Dashboard Siswa, Petugas, dan Admin.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 36 | `function` | `fetchCategoriesApi` | Mengambil daftar kategori buku berdasarkan prefix peran. |
| 42 | `function` | `createCategoryApi` | Menambahkan kategori baru (Admin/Petugas). |
| 50 | `function` | `updateCategoryApi` | Memperbarui nama kategori (Admin/Petugas). |
| 58 | `function` | `deleteCategoryApi` | Menghapus kategori (khusus Admin). |
| 63 | `function` | `uploadBookCoverApi` | Mengunggah gambar cover buku ke penyimpanan lokal backend (offline localhost). |
| 75 | `function` | `fetchBooksApi` | Mengambil daftar buku terpaginasi beserta filter pencarian kondisi tertentu. |
| 91 | `function` | `createBookApi` | Menambahkan buku baru ke katalog (Admin/Petugas). |
| 99 | `function` | `updateBookApi` | Memperbarui data buku yang sudah ada (Admin/Petugas). |
| 107 | `function` | `deleteBookApi` | Menghapus buku dari katalog (khusus Admin). |
| 112 | `function` | `fetchMyTransactionsApi` | Mengambil riwayat peminjaman milik siswa yang sedang masuk. |
| 122 | `function` | `borrowBySiswaApi` | Mengajukan peminjaman buku baru oleh siswa. |
| 130 | `function` | `returnBySiswaApi` | Mengembalikan buku yang dipinjam oleh siswa. |
| 137 | `function` | `fetchAllTransactionsApi` | Mengambil seluruh transaksi perpustakaan terpaginasi dengan filter (Admin/Petugas). |
| 155 | `function` | `createStaffTransactionApi` | Mencatat transaksi peminjaman baru oleh Petugas/Admin. |
| 166 | `function` | `updateStaffTransactionApi` | Memperbarui status pengembalian atau jatuh tempo transaksi (Admin/Petugas). |
| 178 | `function` | `deleteStaffTransactionApi` | Menghapus catatan transaksi (Admin/Petugas). |
| 183 | `function` | `fetchUsersApi` | Mengambil daftar Anggota (`members`) atau Staf (`staff`). |
| 199 | `function` | `createUserApi` | Membuat akun Anggota atau Staf baru (khusus Admin). |
| 207 | `function` | `updateUserApi` | Memperbarui data Anggota atau Staf (khusus Admin). |
| 219 | `function` | `deleteUserApi` | Menghapus akun Anggota atau Staf (khusus Admin). |
| 224 | `function` | `fetchReportSummaryApi` | Mengambil ringkasan statistik perpustakaan untuk dashboard laporan (Admin/Petugas). |
| 233 | `function` | `downloadTransactionsCsvApi` | Mengunduh laporan transaksi dalam format CSV dengan cookie autentikasi aktif. |

### `lib/useRealtimeSync` — [`frontend/src/lib/useRealtimeSync.ts`](../../frontend/src/lib/useRealtimeSync.ts) (140 baris)

Hook sinkronisasi real-time antar peran dan tab browser melalui polling berkala, fokus tab, dan BroadcastChannel.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 22 | `function` | `broadcastPortalSync` | Mengirim sinyal perubahan data ke seluruh tab/portal yang sedang terbuka. |
| 36 | `function` | `useRealtimeSync` | Menjalankan sinkronisasi otomatis berkala, saat jendela kembali aktif, dan saat ada sinyal mutasi dari tab lain. |
| 73 | `interface` | `NotificationActionControls` | Ekspor interface NotificationActionControls. |
| 85 | `function` | `useNotificationActions` | Mengelola aksi baca/hapus notifikasi sekaligus memicu sinkronisasi lintas komponen & tab. |

### `lib/useSplashReveal` — [`frontend/src/lib/useSplashReveal.ts`](../../frontend/src/lib/useSplashReveal.ts) (40 baris)

Hook ringan untuk menyinkronkan animasi masuk Beranda tepat saat tirai Splash Screen terbuka.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 14 | `function` | `useSplashReveal` | Mengembalikan `true` segera setelah Splash selesai/mulai terbuka, atau langsung `true` pada navigasi antarhalaman. |

### `frontend/src/lib/utils.ts` — [`frontend/src/lib/utils.ts`](../../frontend/src/lib/utils.ts) (10 baris)

Modul internal sistem Denvora Lexora.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 7 | `function` | `cn` | Menggabungkan class Tailwind CSS secara aman tanpa konflik utilitas. |

### `types/auth` — [`frontend/src/types/auth.ts`](../../frontend/src/types/auth.ts) (84 baris)

Definisi tipe pengguna terautentikasi, katalog ringkas, dan pembantu rute peran.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 6 | `type` | `UserRole` | Ekspor type UserRole. |
| 8 | `type` | `OtpPurpose` | Ekspor type OtpPurpose. |
| 10 | `interface` | `AuthUser` | Ekspor interface AuthUser. |
| 23 | `interface` | `CatalogBookItem` | Ekspor interface CatalogBookItem. |
| 39 | `interface` | `PortalNotificationItem` | Ekspor interface PortalNotificationItem. |
| 49 | `interface` | `NotificationFeed` | Ekspor interface NotificationFeed. |
| 54 | `interface` | `ApiFieldError` | Ekspor interface ApiFieldError. |
| 59 | `interface` | `PaginationMeta` | Ekspor interface PaginationMeta. |
| 66 | `interface` | `ApiResponse` | Ekspor interface ApiResponse. |
| 74 | `const` | `ROLE_DASHBOARD_PATH` | Ekspor const ROLE_DASHBOARD_PATH. |
| 81 | `function` | `getDashboardPath` | Mengembalikan path halaman dashboard sesuai peran pengguna. |

### `types/library` — [`frontend/src/types/library.ts`](../../frontend/src/types/library.ts) (122 baris)

Definisi tipe katalog, transaksi peminjaman, keanggotaan, dan laporan perpustakaan.

| Baris | Jenis | Simbol | Deskripsi |
| :---: | :---: | :--- | :--- |
| 8 | `type` | `StaffRolePrefix` | Ekspor type StaffRolePrefix. |
| 9 | `type` | `PortalRolePrefix` | Ekspor type PortalRolePrefix. |
| 10 | `type` | `UserResourceKind` | Ekspor type UserResourceKind. |
| 12 | `interface` | `CategoryItem` | Ekspor interface CategoryItem. |
| 18 | `interface` | `TransactionItem` | Ekspor interface TransactionItem. |
| 39 | `interface` | `CategoryStatItem` | Ekspor interface CategoryStatItem. |
| 46 | `interface` | `DailyBorrowPoint` | Ekspor interface DailyBorrowPoint. |
| 51 | `interface` | `LibrarySummary` | Ekspor interface LibrarySummary. |
| 63 | `interface` | `BookPayload` | Ekspor interface BookPayload. |
| 76 | `interface` | `BookListQuery` | Ekspor interface BookListQuery. |
| 84 | `interface` | `TransactionListQuery` | Ekspor interface TransactionListQuery. |
| 94 | `interface` | `StaffCreateTransactionPayload` | Ekspor interface StaffCreateTransactionPayload. |
| 102 | `interface` | `StaffUpdateTransactionPayload` | Ekspor interface StaffUpdateTransactionPayload. |
| 109 | `interface` | `UserManagePayload` | Ekspor interface UserManagePayload. |
| 120 | `type` | `PortalMemberItem` | Ekspor type PortalMemberItem. |
| 121 | `type` | `PortalBookItem` | Ekspor type PortalBookItem. |
