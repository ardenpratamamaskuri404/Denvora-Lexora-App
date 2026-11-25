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
  const conditions: string[] = ['u.role = ?'];
  const params: Array<string | number> = [role];

  if (query.search) {
    conditions.push('(u.name LIKE ? OR u.username LIKE ? OR COALESCE(u.member_code, "") LIKE ?)');
    const kw = `%${query.search}%`;
    params.push(kw, kw, kw);
  }

  if (query.is_active === '1' || query.is_active === '0') {
    conditions.push('u.is_active = ?');
    params.push(Number(query.is_active));
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;
  const offset = (query.page - 1) * query.limit;

  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM users u ${whereClause}`,
    params
  );
  const total = Number(countRows[0].total);

  const [rows] = await pool.query<UserListRow[]>(
    `SELECT u.id, u.name, u.username, u.role, u.member_code, u.class_name, u.phone,
            u.is_active, u.created_at, u.updated_at,
            SUM(CASE WHEN t.status = 'borrowed' THEN 1 ELSE 0 END) AS active_borrows
     FROM users u
     LEFT JOIN transactions t ON t.user_id = u.id
     ${whereClause}
     GROUP BY u.id
     ORDER BY u.id DESC
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
    `SELECT u.id, u.name, u.username, u.role, u.member_code, u.class_name, u.phone,
            u.is_active, u.created_at, u.updated_at,
            SUM(CASE WHEN t.status = 'borrowed' THEN 1 ELSE 0 END) AS active_borrows
     FROM users u
     LEFT JOIN transactions t ON t.user_id = u.id
     WHERE u.id = ? AND u.role = ?
     GROUP BY u.id
     LIMIT 1`,
    [id, role]
  );
  if (rows.length === 0) {
    throw new AppError(404, role === 'siswa' ? 'Anggota tidak ditemukan' : 'Petugas tidak ditemukan');
  }
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

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO users (name, username, password_hash, role, member_code, class_name, phone, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name,
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

  if (input.password && input.password.length >= 6) {
    const passwordHash = await bcrypt.hash(input.password, 10);
    await pool.execute<ResultSetHeader>(
      `UPDATE users
       SET name = ?, username = ?, password_hash = ?, member_code = ?, class_name = ?, phone = ?, is_active = ?
       WHERE id = ? AND role = ?`,
      [
        input.name,
        input.username,
        passwordHash,
        memberCode,
        input.class_name || null,
        input.phone || null,
        input.is_active ?? 1,
        id,
        role,
      ]
    );
  } else {
    await pool.execute<ResultSetHeader>(
      `UPDATE users
       SET name = ?, username = ?, member_code = ?, class_name = ?, phone = ?, is_active = ?
       WHERE id = ? AND role = ?`,
      [
        input.name,
        input.username,
        memberCode,
        input.class_name || null,
        input.phone || null,
        input.is_active ?? 1,
        id,
        role,
      ]
    );
  }

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
