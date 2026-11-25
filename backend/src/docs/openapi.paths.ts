/**
 * @module docs/openapi.paths
 * @description Definisi path endpoint OpenAPI untuk Petugas dan Admin (/api/petugas/*, /api/admin/*).
 */

const idParam = [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }];

function buildSharedPaths(roleTag: 'Petugas' | 'Admin', prefix: '/petugas' | '/admin', allowDelete: boolean) {
  const paths: Record<string, unknown> = {
    [`${prefix}/categories`]: {
      get: { tags: [roleTag], summary: 'Daftar kategori buku', responses: { 200: { description: 'OK' } } },
      post: { tags: [roleTag], summary: 'Tambah kategori buku', responses: { 201: { description: 'Created' } } },
    },
    [`${prefix}/categories/{id}`]: {
      put: { tags: [roleTag], summary: 'Ubah kategori buku', parameters: idParam, responses: { 200: { description: 'OK' } } },
      ...(allowDelete
        ? { delete: { tags: [roleTag], summary: 'Hapus kategori buku', parameters: idParam, responses: { 200: { description: 'Deleted' } } } }
        : {}),
    },
    [`${prefix}/books`]: {
      get: { tags: [roleTag], summary: 'Daftar & pencarian buku kondisi tertentu', responses: { 200: { description: 'OK' } } },
      post: { tags: [roleTag], summary: 'Tambah buku baru', responses: { 201: { description: 'Created' } } },
    },
    [`${prefix}/books/{id}`]: {
      get: { tags: [roleTag], summary: 'Detail buku', parameters: idParam, responses: { 200: { description: 'OK' } } },
      put: { tags: [roleTag], summary: 'Perbarui data & stok buku', parameters: idParam, responses: { 200: { description: 'OK' } } },
      ...(allowDelete
        ? { delete: { tags: [roleTag], summary: 'Hapus buku (tolak 409 jika aktif)', parameters: idParam, responses: { 200: { description: 'Deleted' } } } }
        : {}),
    },
    [`${prefix}/transactions`]: {
      get: { tags: [roleTag], summary: 'Daftar & filter seluruh transaksi', responses: { 200: { description: 'OK' } } },
      post: { tags: [roleTag], summary: 'Buat transaksi peminjaman baru', responses: { 201: { description: 'Created' } } },
    },
    [`${prefix}/transactions/{id}`]: {
      get: { tags: [roleTag], summary: 'Detail transaksi', parameters: idParam, responses: { 200: { description: 'OK' } } },
      put: { tags: [roleTag], summary: 'Update status/jatuh tempo transaksi', parameters: idParam, responses: { 200: { description: 'OK' } } },
      delete: { tags: [roleTag], summary: 'Hapus transaksi (stok pulih jika borrowed)', parameters: idParam, responses: { 200: { description: 'Deleted' } } },
    },
    [`${prefix}/reports/summary`]: {
      get: { tags: [roleTag], summary: 'Ringkasan statistik perpustakaan', responses: { 200: { description: 'OK' } } },
    },
    [`${prefix}/reports/transactions/export`]: {
      get: { tags: [roleTag], summary: 'Unduh laporan transaksi CSV (PPsp 1.12)', responses: { 200: { description: 'File CSV' } } },
    },
  };

  return paths;
}

export const staffAndAdminPaths = {
  ...buildSharedPaths('Petugas', '/petugas', false),
  '/petugas/members': {
    get: { tags: ['Petugas'], summary: 'Lihat daftar anggota siswa (read-only)', responses: { 200: { description: 'OK' } } },
  },
  '/petugas/members/{id}': {
    get: { tags: ['Petugas'], summary: 'Detail anggota siswa (read-only)', parameters: idParam, responses: { 200: { description: 'OK' } } },
  },
  ...buildSharedPaths('Admin', '/admin', true),
  '/admin/members': {
    get: { tags: ['Admin'], summary: 'Daftar & cari anggota siswa', responses: { 200: { description: 'OK' } } },
    post: { tags: ['Admin'], summary: 'Tambah anggota siswa baru', responses: { 201: { description: 'Created' } } },
  },
  '/admin/members/{id}': {
    get: { tags: ['Admin'], summary: 'Detail anggota siswa', parameters: idParam, responses: { 200: { description: 'OK' } } },
    put: { tags: ['Admin'], summary: 'Perbarui data / status anggota', parameters: idParam, responses: { 200: { description: 'OK' } } },
    delete: { tags: ['Admin'], summary: 'Hapus anggota (tolak 409 jika aktif)', parameters: idParam, responses: { 200: { description: 'Deleted' } } },
  },
  '/admin/staff': {
    get: { tags: ['Admin'], summary: 'Daftar akun petugas', responses: { 200: { description: 'OK' } } },
    post: { tags: ['Admin'], summary: 'Tambah akun petugas baru', responses: { 201: { description: 'Created' } } },
  },
  '/admin/staff/{id}': {
    get: { tags: ['Admin'], summary: 'Detail akun petugas', parameters: idParam, responses: { 200: { description: 'OK' } } },
    put: { tags: ['Admin'], summary: 'Perbarui data / status petugas', parameters: idParam, responses: { 200: { description: 'OK' } } },
    delete: { tags: ['Admin'], summary: 'Hapus akun petugas', parameters: idParam, responses: { 200: { description: 'Deleted' } } },
  },
};
