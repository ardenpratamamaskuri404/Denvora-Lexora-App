/**
 * @module docs/openapi
 * @description Spesifikasi OpenAPI 3.0 lokal (100% offline) untuk Swagger UI (/api-docs).
 */

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Denvora Lexora API',
    version: '1.0.0',
    description:
      'REST API Perpustakaan Sekolah Digital Denvora Lexora (UKK RPL Paket 4). Endpoint dipisah per namespace peran: /api/auth, /api/siswa, /api/petugas, dan /api/admin.',
  },
  servers: [{ url: 'http://localhost:5000/api', description: 'Localhost Development' }],
  components: {
    securitySchemes: {
      cookieAuth: { type: 'apiKey', in: 'cookie', name: 'denvora_session' },
      bearerAuth: { type: 'http', scheme: 'bearer' },
    },
  },
  security: [{ cookieAuth: [] }, { bearerAuth: [] }],
  tags: [
    { name: 'Health', description: 'Status server dan database' },
    { name: 'Auth', description: 'Registrasi siswa, login, logout, dan profil sesi' },
    { name: 'Siswa', description: 'Endpoint khusus role siswa (/api/siswa/*)' },
    { name: 'Petugas', description: 'Endpoint operasional petugas (/api/petugas/*)' },
    { name: 'Admin', description: 'Endpoint kendali penuh admin (/api/admin/*)' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Cek kesehatan server & koneksi MySQL',
        responses: { 200: { description: 'Server dan DB sehat' } },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Daftar anggota baru (role dikunci siswa)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'username', 'password', 'member_code'],
                properties: {
                  name: { type: 'string', example: 'Budi Santoso' },
                  username: { type: 'string', example: 'budi_rpl' },
                  password: { type: 'string', example: 'Rahasia123!' },
                  member_code: { type: 'string', example: '2025010' },
                  class_name: { type: 'string', example: 'XII RPL 1' },
                  phone: { type: 'string', example: '081234567890' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Anggota berhasil didaftarkan' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login semua peran (admin, petugas, siswa)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string', example: 'admin' },
                  password: { type: 'string', example: 'Admin123!' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Login berhasil, cookie sesi diset' } },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout dan hapus cookie sesi',
        responses: { 200: { description: 'Logout berhasil' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Ambil profil pengguna aktif',
        responses: { 200: { description: 'Profil pengguna' } },
      },
    },
    '/siswa/categories': {
      get: { tags: ['Siswa'], summary: 'Daftar kategori buku', responses: { 200: { description: 'OK' } } },
    },
    '/siswa/books': {
      get: {
        tags: ['Siswa'],
        summary: 'Cari buku dengan filter kondisi tertentu',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'category_id', in: 'query', schema: { type: 'integer' } },
          { name: 'availability', in: 'query', schema: { type: 'string', enum: ['all', 'available', 'empty'] } },
        ],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/siswa/transactions': {
      get: { tags: ['Siswa'], summary: 'Riwayat transaksi milik siswa login', responses: { 200: { description: 'OK' } } },
    },
    '/siswa/transactions/borrow': {
      post: {
        tags: ['Siswa'],
        summary: 'Pinjam buku (stok tersedia -1 secara atomik)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['book_id'],
                properties: { book_id: { type: 'integer', example: 1 }, notes: { type: 'string' } },
              },
            },
          },
        },
        responses: { 201: { description: 'Peminjaman berhasil' } },
      },
    },
    '/siswa/transactions/{id}/return': {
      patch: {
        tags: ['Siswa'],
        summary: 'Kembalikan buku milik siswa login',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Pengembalian berhasil' } },
      },
    },
    '/petugas/books': {
      get: { tags: ['Petugas'], summary: 'Daftar & pencarian buku', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Petugas'], summary: 'Tambah buku baru', responses: { 201: { description: 'Created' } } },
    },
    '/petugas/books/{id}': {
      put: {
        tags: ['Petugas'],
        summary: 'Perbarui data buku (Delete hanya di /api/admin/books/:id)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/petugas/members': {
      get: { tags: ['Petugas'], summary: 'Lihat daftar anggota siswa (read-only)', responses: { 200: { description: 'OK' } } },
    },
    '/petugas/transactions': {
      get: { tags: ['Petugas'], summary: 'Daftar & filter seluruh transaksi', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Petugas'], summary: 'Buat transaksi pinjam untuk siswa', responses: { 201: { description: 'Created' } } },
    },
    '/petugas/reports/transactions/export': {
      get: { tags: ['Petugas'], summary: 'Unduh laporan transaksi CSV (PPsp 1.12)', responses: { 200: { description: 'File CSV' } } },
    },
    '/admin/books': {
      get: { tags: ['Admin'], summary: 'Daftar & pencarian buku', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Admin'], summary: 'Tambah buku baru', responses: { 201: { description: 'Created' } } },
    },
    '/admin/books/{id}': {
      put: {
        tags: ['Admin'],
        summary: 'Edit data buku',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        tags: ['Admin'],
        summary: 'Hapus buku (ditolak 409 jika sedang dipinjam)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
    '/admin/members': {
      get: { tags: ['Admin'], summary: 'Daftar & cari anggota siswa', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Admin'], summary: 'Tambah anggota siswa', responses: { 201: { description: 'Created' } } },
    },
    '/admin/staff': {
      get: { tags: ['Admin'], summary: 'Daftar akun petugas', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Admin'], summary: 'Tambah akun petugas', responses: { 201: { description: 'Created' } } },
    },
    '/admin/transactions': {
      get: { tags: ['Admin'], summary: 'Daftar & filter seluruh transaksi', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Admin'], summary: 'Buat transaksi pinjam untuk siswa', responses: { 201: { description: 'Created' } } },
    },
    '/admin/reports/summary': {
      get: { tags: ['Admin'], summary: 'Ringkasan statistik perpustakaan', responses: { 200: { description: 'OK' } } },
    },
    '/admin/reports/transactions/export': {
      get: { tags: ['Admin'], summary: 'Unduh laporan transaksi CSV (PPsp 1.12)', responses: { 200: { description: 'File CSV' } } },
    },
  },
};

module.exports = openApiSpec;
