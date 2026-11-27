/**
 * @module services/user.service
 * @description Logika bisnis bersama untuk pengelolaan Anggota (siswa) dan Petugas (staff).
 */

import bcrypt from 'bcryptjs';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { AppError } from '../utils/response';
import type { PublicUserDto } from './auth.service';

export interface UserListRow extends RowDataPacket, PublicUserDto {
  created_at: string;
  updated_at: string;
  active_borrows?: number;
}

export interface UserQuery {
  search: string;
  is_active: 'all' | '1' | '0';
  page: number;
  limit: number;
}

export interface ManageUserInput {
  name: string;
  email?: string | null;
  username: string;
  password?: string;
  member_code?: string | null;
  class_name?: string | null;
  phone?: string | null;
  is_active?: number;
}

/**
 * Mengambil daftar pengguna berdasarkan peran ('siswa' atau 'petugas') dengan filter pencarian.
 */
export async function listUsersByRole(
  role: 'siswa' | 'petugas',
  query: UserQuery
): Promise<{
  items: UserListRow[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const conditions: string[] = ['role = ?'];
  const params: Array<string | number> = [role];

  if (query.search) {
    conditions.push(
      '(name LIKE ? OR username LIKE ? OR email LIKE ? OR member_code LIKE ? OR class_name LIKE ?)'
    );
    const kw = `%${query.search}%`;
    params.push(kw, kw, kw, kw, kw);
  }

  if (query.is_active === '1' || query.is_active === '0') {
    conditions.push('is_active = ?');
    params.push(Number(query.is_active));
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;
  const offset = (query.page - 1) * query.limit;

  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM users ${whereClause}`,
    params
  );
  const total = Number(countRows[0].total);

  const [rows] = await pool.query<UserListRow[]>(
    `SELECT id, name, email, username, role, member_code, class_name, phone,
            is_active, is_verified, created_at, updated_at
     FROM users
     ${whereClause}
     ORDER BY id DESC
     LIMIT ? OFFSET ?`,
    [...params, query.limit, offset]
  );

  return {
    items: rows,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
}

/**
 * Mengambil detail satu anggota atau petugas sesuai role.
 */
export async function getUserByIdAndRole(
  id: number,
  role: 'siswa' | 'petugas'
): Promise<UserListRow> {
  const [rows] = await pool.execute<UserListRow[]>(
    `SELECT id, name, email, username, role, member_code, class_name, phone,
            is_active, is_verified, created_at, updated_at
     FROM users
     WHERE id = ? AND role = ?
     LIMIT 1`,
    [id, role]
  );
  if (rows.length === 0) {
    throw new AppError(404, role === 'siswa' ? 'Anggota tidak ditemukan' : 'Petugas tidak ditemukan');
  }

  const [activeRows] = await pool.execute<RowDataPacket[]>(
    "SELECT COUNT(*) AS total FROM transactions WHERE user_id = ? AND status = 'borrowed'",
    [id]
  );
  rows[0].active_borrows = Number(activeRows[0].total || 0);
  return rows[0];
}

/**
 * Membuat akun anggota atau petugas baru oleh Admin.
 */
export async function createUserByRole(
  role: 'siswa' | 'petugas',
  input: ManageUserInput & { password: string }
): Promise<UserListRow> {
  const passwordHash = await bcrypt.hash(input.password, 10);
  const memberCode = role === 'siswa' ? input.member_code || null : null;
  const cleanEmail = input.email?.trim() ? input.email.trim().toLowerCase() : null;

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO users (name, email, username, password_hash, role, member_code, class_name, phone, is_active, is_verified)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [
      input.name,
      cleanEmail,
      input.username,
      passwordHash,
      role,
      memberCode,
      input.class_name || null,
      input.phone || null,
      input.is_active ?? 1,
    ]
  );

  return getUserByIdAndRole(result.insertId, role);
}

/**
 * Memperbarui data anggota atau petugas beserta password opsional.
 */
export async function updateUserByRole(
  id: number,
  role: 'siswa' | 'petugas',
  input: ManageUserInput
): Promise<UserListRow> {
  await getUserByIdAndRole(id, role);
  const memberCode = role === 'siswa' ? input.member_code || null : null;
  const cleanEmail = input.email?.trim() ? input.email.trim().toLowerCase() : null;

  const setClauses = [
    'name = ?',
    'email = ?',
    'username = ?',
    'member_code = ?',
    'class_name = ?',
    'phone = ?',
    'is_active = ?',
  ];
  const params: Array<string | number | null> = [
    input.name,
    cleanEmail,
    input.username,
    memberCode,
    input.class_name || null,
    input.phone || null,
    input.is_active ?? 1,
  ];

  if (input.password && input.password.length >= 6) {
    setClauses.push('password_hash = ?');
    params.push(await bcrypt.hash(input.password, 10));
  }

  params.push(id, role);
  await pool.execute<ResultSetHeader>(
    `UPDATE users SET ${setClauses.join(', ')} WHERE id = ? AND role = ?`,
    params
  );

  return getUserByIdAndRole(id, role);
}

/**
 * Menghapus akun anggota atau petugas dengan pengecekan pinjaman aktif dan riwayat.
 */
export async function deleteUserByRole(id: number, role: 'siswa' | 'petugas'): Promise<void> {
  const existing = await getUserByIdAndRole(id, role);
  if (Number(existing.active_borrows || 0) > 0) {
    throw new AppError(
      409,
      'Anggota masih memiliki pinjaman aktif; nonaktifkan akun sebagai gantinya'
    );
  }

  if (role === 'siswa') {
    const [history] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) AS total FROM transactions WHERE user_id = ?',
      [id]
    );
    if (Number(history[0].total) > 0) {
      throw new AppError(
        409,
        'Anggota memiliki riwayat transaksi; gunakan status nonaktif (is_active = 0)'
      );
    }
  }

  await pool.execute<ResultSetHeader>('DELETE FROM users WHERE id = ? AND role = ?', [id, role]);
}
