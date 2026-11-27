/**
 * @module docs/openapi.paths
 * @description Definisi path, parameter query/path, dan requestBody OpenAPI untuk Petugas dan Admin.
 */

const idParam = [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }];

const bookQueryParams = [
  { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Cari kode buku, judul, penulis, atau rak' },
  { name: 'category_id', in: 'query', schema: { type: 'integer' } },
  { name: 'availability', in: 'query', schema: { type: 'string', enum: ['all', 'available', 'empty'], default: 'all' } },
  { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
  { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
];

const trxFilterParams = [
  { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Cari kode TRX, nama/NIS anggota, atau judul buku' },
  { name: 'status', in: 'query', schema: { type: 'string', enum: ['all', 'borrowed', 'returned'], default: 'all' } },
  { name: 'date_from', in: 'query', schema: { type: 'string', format: 'date' }, description: 'YYYY-MM-DD' },
  { name: 'date_to', in: 'query', schema: { type: 'string', format: 'date' }, description: 'YYYY-MM-DD' },
  { name: 'overdue_only', in: 'query', schema: { type: 'string', enum: ['false', 'true'], default: 'false' } },
];

const trxQueryParams = [
  ...trxFilterParams,
  { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
  { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
];

const userQueryParams = [
  { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Cari nama, username, NIS, atau kelas/jabatan' },
  { name: 'is_active', in: 'query', schema: { type: 'string', enum: ['all', '1', '0'], default: 'all' } },
  { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
  { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
];

function jsonBody(properties: Record<string, unknown>, required: string[] = []) {
  return {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          ...(required.length ? { required } : {}),
          properties,
        },
      },
    },
  };
}

const categoryBody = jsonBody({ name: { type: 'string', example: 'Informatika & AI' } }, ['name']);

const bookBody = jsonBody(
  {
    book_code: { type: 'string', example: 'BK-010' },
    title: { type: 'string', example: 'Arsitektur Web Modern' },
    author: { type: 'string', example: 'Arden Pratama' },
    publisher: { type: 'string', example: 'Pustaka Denvora' },
    publication_year: { type: 'integer', example: 2025 },
    category_id: { type: 'integer', example: 1 },
    stock_total: { type: 'integer', example: 5 },
    shelf_location: { type: 'string', example: 'Rak A3' },
  },
  ['book_code', 'title', 'author', 'publisher', 'publication_year', 'category_id', 'stock_total']
);

const createTrxBody = jsonBody(
  {
    user_id: { type: 'integer', example: 3 },
    book_id: { type: 'integer', example: 1 },
    borrow_date: { type: 'string', example: '2026-11-26' },
    due_date: { type: 'string', example: '2026-12-03' },
    notes: { type: 'string', example: 'Kondisi sampul baik' },
  },
  ['user_id', 'book_id']
);

const updateTrxBody = jsonBody({
  status: { type: 'string', enum: ['borrowed', 'returned'] },
  due_date: { type: 'string', example: '2026-12-05' },
  return_date: { type: 'string', example: '2026-11-30' },
  notes: { type: 'string', example: 'Sudah dikembalikan' },
});

const baseUserProps = {
  name: { type: 'string', example: 'Nadia Permata' },
  email: { type: 'string', example: 'nadia@denvora.sch.id' },
  username: { type: 'string', example: 'nadia_rpl' },
  password: { type: 'string', example: 'Rahasia123!' },
  class_name: { type: 'string', example: 'XII RPL 1' },
  phone: { type: 'string', example: '081234567890' },
  is_active: { type: 'integer', enum: [0, 1], default: 1 },
};

const memberCreateBody = jsonBody(
  { ...baseUserProps, member_code: { type: 'string', example: '2025099' } },
  ['name', 'username', 'password', 'member_code']
);

const memberUpdateBody = jsonBody(
  { ...baseUserProps, member_code: { type: 'string', example: '2025099' } },
  ['name', 'username', 'member_code']
);

const staffCreateBody = jsonBody(baseUserProps, ['name', 'username', 'password']);
const staffUpdateBody = jsonBody(baseUserProps, ['name', 'username']);

function buildSharedPaths(roleTag: 'Petugas' | 'Admin', prefix: '/petugas' | '/admin', allowDelete: boolean) {
  return {
    [`${prefix}/categories`]: {
      get: { tags: [roleTag], summary: 'Daftar kategori buku', responses: { 200: { description: 'OK' } } },
      post: { tags: [roleTag], summary: 'Tambah kategori buku', requestBody: categoryBody, responses: { 201: { description: 'Created' } } },
    },
    [`${prefix}/categories/{id}`]: {
      put: { tags: [roleTag], summary: 'Ubah kategori buku', parameters: idParam, requestBody: categoryBody, responses: { 200: { description: 'OK' } } },
      ...(allowDelete
        ? { delete: { tags: [roleTag], summary: 'Hapus kategori buku', parameters: idParam, responses: { 200: { description: 'Deleted' } } } }
        : {}),
    },
    [`${prefix}/books`]: {
      get: { tags: [roleTag], summary: 'Daftar & pencarian buku kondisi tertentu', parameters: bookQueryParams, responses: { 200: { description: 'OK' } } },
      post: { tags: [roleTag], summary: 'Tambah buku baru', requestBody: bookBody, responses: { 201: { description: 'Created' } } },
    },
    [`${prefix}/books/{id}`]: {
      get: { tags: [roleTag], summary: 'Detail buku', parameters: idParam, responses: { 200: { description: 'OK' } } },
      put: { tags: [roleTag], summary: 'Perbarui data & stok buku', parameters: idParam, requestBody: bookBody, responses: { 200: { description: 'OK' } } },
      ...(allowDelete
        ? { delete: { tags: [roleTag], summary: 'Hapus buku (tolak 409 jika aktif)', parameters: idParam, responses: { 200: { description: 'Deleted' } } } }
        : {}),
    },
    [`${prefix}/transactions`]: {
      get: { tags: [roleTag], summary: 'Daftar & filter seluruh transaksi', parameters: trxQueryParams, responses: { 200: { description: 'OK' } } },
      post: { tags: [roleTag], summary: 'Buat transaksi peminjaman baru', requestBody: createTrxBody, responses: { 201: { description: 'Created' } } },
    },
    [`${prefix}/transactions/{id}`]: {
      get: { tags: [roleTag], summary: 'Detail transaksi', parameters: idParam, responses: { 200: { description: 'OK' } } },
      put: { tags: [roleTag], summary: 'Update status/jatuh tempo transaksi', parameters: idParam, requestBody: updateTrxBody, responses: { 200: { description: 'OK' } } },
      delete: { tags: [roleTag], summary: 'Hapus transaksi (stok pulih jika borrowed)', parameters: idParam, responses: { 200: { description: 'Deleted' } } },
    },
    [`${prefix}/reports/summary`]: {
      get: { tags: [roleTag], summary: 'Ringkasan statistik perpustakaan', responses: { 200: { description: 'OK' } } },
    },
    [`${prefix}/reports/transactions/export`]: {
      get: { tags: [roleTag], summary: 'Unduh laporan transaksi CSV (PPsp 1.12)', parameters: trxFilterParams, responses: { 200: { description: 'File CSV' } } },
    },
  };
}

export const staffAndAdminPaths = {
  ...buildSharedPaths('Petugas', '/petugas', false),
  '/petugas/members': {
    get: { tags: ['Petugas'], summary: 'Lihat daftar anggota siswa (read-only)', parameters: userQueryParams, responses: { 200: { description: 'OK' } } },
  },
  '/petugas/members/{id}': {
    get: { tags: ['Petugas'], summary: 'Detail anggota siswa (read-only)', parameters: idParam, responses: { 200: { description: 'OK' } } },
  },
  ...buildSharedPaths('Admin', '/admin', true),
  '/admin/members': {
    get: { tags: ['Admin'], summary: 'Daftar & cari anggota siswa', parameters: userQueryParams, responses: { 200: { description: 'OK' } } },
    post: { tags: ['Admin'], summary: 'Tambah anggota siswa baru', requestBody: memberCreateBody, responses: { 201: { description: 'Created' } } },
  },
  '/admin/members/{id}': {
    get: { tags: ['Admin'], summary: 'Detail anggota siswa', parameters: idParam, responses: { 200: { description: 'OK' } } },
    put: { tags: ['Admin'], summary: 'Perbarui data / status anggota', parameters: idParam, requestBody: memberUpdateBody, responses: { 200: { description: 'OK' } } },
    delete: { tags: ['Admin'], summary: 'Hapus anggota (tolak 409 jika aktif)', parameters: idParam, responses: { 200: { description: 'Deleted' } } },
  },
  '/admin/staff': {
    get: { tags: ['Admin'], summary: 'Daftar akun petugas', parameters: userQueryParams, responses: { 200: { description: 'OK' } } },
    post: { tags: ['Admin'], summary: 'Tambah akun petugas baru', requestBody: staffCreateBody, responses: { 201: { description: 'Created' } } },
  },
  '/admin/staff/{id}': {
    get: { tags: ['Admin'], summary: 'Detail akun petugas', parameters: idParam, responses: { 200: { description: 'OK' } } },
    put: { tags: ['Admin'], summary: 'Perbarui data / status petugas', parameters: idParam, requestBody: staffUpdateBody, responses: { 200: { description: 'OK' } } },
    delete: { tags: ['Admin'], summary: 'Hapus akun petugas', parameters: idParam, responses: { 200: { description: 'Deleted' } } },
  },
};
