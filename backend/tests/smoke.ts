/**
 * @module tests/smoke
 * @description Uji integrasi end-to-end backend REST API terhadap MySQL (mengacu TEST-PLAN.md).
 * Jalankan setelah MySQL aktif dan database sudah di-seed: `npm run test:smoke`
 */

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { app } from '../src/app';
import { pool } from '../src/config/db';

interface ApiResult {
  status: number;
  cookie: string;
  body: Record<string, unknown>;
  raw: string;
}

async function request(
  baseUrl: string,
  method: string,
  urlPath: string,
  options: { body?: unknown; cookie?: string } = {}
): Promise<ApiResult> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (options.cookie) headers['Cookie'] = options.cookie;

  const res = await fetch(`${baseUrl}${urlPath}`, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const setCookie = res.headers.get('set-cookie') || '';
  const cookie = setCookie ? setCookie.split(';')[0] : options.cookie || '';
  const raw = await res.text();
  let body: Record<string, unknown> = {};
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    body = {};
  }
  return { status: res.status, cookie, body, raw };
}

async function loginAs(baseUrl: string, username: string, password: string): Promise<string> {
  const res = await request(baseUrl, 'POST', '/api/auth/login', {
    body: { username, password },
  });
  assert.equal(res.status, 200, `Login ${username} gagal: ${res.raw}`);
  assert.ok(res.cookie, `Cookie sesi ${username} tidak diterima`);
  return res.cookie;
}

async function runSmokeTests(): Promise<void> {
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    // 1. Health & Swagger UI
    const health = await request(baseUrl, 'GET', '/api/health');
    assert.equal(health.status, 200, `Health gagal: ${health.raw}`);

    const docsRes = await fetch(`${baseUrl}/api-docs/`);
    assert.equal(docsRes.status, 200, 'Swagger UI /api-docs harus merespons 200');

    // 2. Register Siswa (role dikunci 'siswa') + Verifikasi OTP Mailpit
    const uniq = Date.now().toString().slice(-6);
    const regEmail = `smoke_${uniq}@denvora.local`;
    const reg = await request(baseUrl, 'POST', '/api/auth/register', {
      body: {
        name: 'Uji Siswa Smoke',
        email: regEmail,
        username: `smoke_${uniq}`,
        password: 'Password123!',
        member_code: `NIS-${uniq}`,
        class_name: 'XII RPL 1',
        role: 'admin',
      },
    });
    assert.equal(reg.status, 201, `Register gagal: ${reg.raw}`);
    const regUser = (reg.body.data as { user: { role: string } }).user;
    assert.equal(regUser.role, 'siswa', 'Registrasi publik wajib terkunci sebagai siswa');

    const mailList = (await (
      await fetch(`http://127.0.0.1:8025/api/v1/messages?query=${encodeURIComponent(regEmail)}`)
    ).json()) as { messages?: Array<{ Snippet?: string; Subject?: string }> };
    const otpMatch = mailList.messages?.[0]?.Subject?.match(/(\d{6})/);
    assert.ok(otpMatch?.[1], 'Email OTP registrasi tidak ditemukan di Mailpit lokal');

    const verifyReg = await request(baseUrl, 'POST', '/api/auth/otp/verify', {
      body: { email: regEmail, otp: otpMatch[1], purpose: 'register' },
    });
    assert.equal(verifyReg.status, 200, `Verifikasi OTP registrasi gagal: ${verifyReg.raw}`);

    const loginReg = await loginAs(baseUrl, `smoke_${uniq}`, 'Password123!');
    assert.ok(loginReg, 'Login setelah verifikasi OTP gagal');

    // 3. Login 3 Role & Penolakan Akun Nonaktif
    const adminCookie = await loginAs(baseUrl, 'admin', 'Admin123!');
    const petugasCookie = await loginAs(baseUrl, 'petugas1', 'Petugas123!');
    const siswaCookie = await loginAs(baseUrl, 'siswa1', 'Siswa123!');

    const nonaktif = await request(baseUrl, 'POST', '/api/auth/login', {
      body: { username: 'siswa_nonaktif', password: 'Siswa123!' },
    });
    assert.equal(nonaktif.status, 403, 'Akun nonaktif harus ditolak 403');

    // 4. RBAC Cross-Namespace Checks
    const siswaToAdmin = await request(baseUrl, 'GET', '/api/admin/members', {
      cookie: siswaCookie,
    });
    assert.equal(siswaToAdmin.status, 403);

    const petugasDeleteBook = await request(baseUrl, 'DELETE', '/api/admin/books/1', {
      cookie: petugasCookie,
    });
    assert.equal(petugasDeleteBook.status, 403);

    const petugasReadMembers = await request(baseUrl, 'GET', '/api/petugas/members', {
      cookie: petugasCookie,
    });
    assert.equal(petugasReadMembers.status, 200);

    // 5. Pencarian Buku & Borrow/Return Atomik Siswa
    const booksRes = await request(
      baseUrl,
      'GET',
      '/api/siswa/books?search=Algoritma&availability=available',
      { cookie: siswaCookie }
    );
    assert.equal(booksRes.status, 200);
    const books = booksRes.body.data as Array<{ id: number; stock_available: number }>;
    assert.ok(books.length > 0, 'Buku tersedia harus ditemukan');

    const outOfStock = await request(baseUrl, 'POST', '/api/siswa/transactions/borrow', {
      cookie: siswaCookie,
      body: { book_id: 5 },
    });
    assert.equal(outOfStock.status, 409, 'Buku stok 0 harus ditolak 409');

    const borrow = await request(baseUrl, 'POST', '/api/siswa/transactions/borrow', {
      cookie: siswaCookie,
      body: { book_id: 1, notes: 'Smoke test pinjam' },
    });
    assert.equal(borrow.status, 201, `Borrow gagal: ${borrow.raw}`);
    const trxId = (borrow.body.data as { id: number }).id;

    const ret = await request(baseUrl, 'PATCH', `/api/siswa/transactions/${trxId}/return`, {
      cookie: siswaCookie,
    });
    assert.equal(ret.status, 200, `Return gagal: ${ret.raw}`);

    const doubleRet = await request(baseUrl, 'PATCH', `/api/siswa/transactions/${trxId}/return`, {
      cookie: siswaCookie,
    });
    assert.equal(doubleRet.status, 409, 'Pengembalian ganda harus ditolak 409');

    // Cleanup transaksi smoke test oleh Admin agar DB uji tetap bersih
    const delTrx = await request(baseUrl, 'DELETE', `/api/admin/transactions/${trxId}`, {
      cookie: adminCookie,
    });
    assert.equal(delTrx.status, 200);

    // 6. Laporan Summary & Ekspor CSV (PPsp 1.12)
    const summary = await request(baseUrl, 'GET', '/api/admin/reports/summary', {
      cookie: adminCookie,
    });
    assert.equal(summary.status, 200);

    const csv = await request(baseUrl, 'GET', '/api/petugas/reports/transactions/export', {
      cookie: petugasCookie,
    });
    assert.equal(csv.status, 200);
    assert.ok(csv.raw.includes('Kode Transaksi'), 'Header CSV harus sesuai');

    const logContent = await fs.readFile(path.resolve(__dirname, '../logs/app.log'), 'utf8');
    assert.ok(logContent.includes('transaction.borrow'), 'app.log harus mencatat aktivitas');

    console.log('ALL_BACKEND_SMOKE_TESTS_PASSED');
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await pool.end();
  }
}

runSmokeTests().catch((err) => {
  console.error('SMOKE_TEST_FAILED:', err);
  process.exit(1);
});
