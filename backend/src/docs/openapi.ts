/**
 * @module docs/openapi
 * @description Spesifikasi OpenAPI 3.0 lokal (100% offline) untuk Swagger UI (/api-docs).
 */

import { staffAndAdminPaths } from './openapi.paths';

export const openApiSpec = {
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
    { name: 'Catalog', description: 'Katalog bacaan publik read-only (/api/catalog/*)' },
    { name: 'Auth', description: 'Registrasi siswa, login, OTP Mailpit, logout, dan profil sesi' },
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
    '/catalog/categories': {
      get: {
        tags: ['Catalog'],
        summary: 'Daftar kategori publik',
        responses: { 200: { description: 'OK' } },
      },
    },
    '/catalog/books': {
      get: {
        tags: ['Catalog'],
        summary: 'Pencarian katalog buku publik (live search footer)',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Kata kunci judul, penulis, kode, atau rak' },
          { name: 'category_id', in: 'query', schema: { type: 'integer' } },
          { name: 'availability', in: 'query', schema: { type: 'string', enum: ['all', 'available', 'empty'], default: 'all' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Daftar anggota baru (role dikunci siswa, kirim OTP Mailpit)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'username', 'password', 'member_code'],
                properties: {
                  name: { type: 'string', example: 'Budi Santoso' },
                  email: { type: 'string', example: 'budi@denvora.sch.id' },
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
        responses: { 201: { description: 'Anggota berhasil didaftarkan & OTP dikirim ke Mailpit' } },
      },
    },
    '/auth/otp/send': {
      post: {
        tags: ['Auth'],
        summary: 'Kirim kode OTP 6 digit ke Mailpit lokal (register atau login)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'purpose'],
                properties: {
                  email: { type: 'string', example: 'siswa1@denvora.sch.id' },
                  purpose: { type: 'string', enum: ['register', 'login'] },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'OTP berhasil dikirim ke Mailpit' } },
      },
    },
    '/auth/otp/verify': {
      post: {
        tags: ['Auth'],
        summary: 'Verifikasi kode OTP 6 digit dari Mailpit',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'otp', 'purpose'],
                properties: {
                  email: { type: 'string', example: 'siswa1@denvora.sch.id' },
                  otp: { type: 'string', example: '123456' },
                  purpose: { type: 'string', enum: ['register', 'login'] },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'OTP terverifikasi' } },
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
          { name: 'availability', in: 'query', schema: { type: 'string', enum: ['all', 'available', 'empty'], default: 'all' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/siswa/books/{id}': {
      get: {
        tags: ['Siswa'],
        summary: 'Detail buku',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/siswa/transactions': {
      get: {
        tags: ['Siswa'],
        summary: 'Riwayat transaksi milik siswa login',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['all', 'borrowed', 'returned'], default: 'all' } },
        ],
        responses: { 200: { description: 'OK' } },
      },
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
    ...staffAndAdminPaths,
  },
};
