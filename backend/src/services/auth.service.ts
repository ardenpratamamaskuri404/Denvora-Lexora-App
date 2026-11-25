/**
 * @module services/auth.service
 * @description Logika bisnis pendaftaran anggota siswa dan autentikasi pengguna.
 */

import bcrypt from 'bcryptjs';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { AppError } from '../utils/response';
import { signSessionToken } from '../utils/token';
import { appendLog } from '../utils/fileHelper';
import type { AuthUser, UserRole } from '../types/express';

interface UserAuthRow extends RowDataPacket, AuthUser {
  password_hash: string;
}

export interface PublicUserDto {
  id: number;
  name: string;
  username: string;
  role: UserRole;
  member_code: string | null;
  class_name: string | null;
  phone: string | null;
  is_active: number;
}

function toPublicUser(row: AuthUser): PublicUserDto {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    role: row.role,
    member_code: row.member_code,
    class_name: row.class_name,
    phone: row.phone,
    is_active: row.is_active,
  };
}

/**
 * Mendaftarkan anggota baru dengan role dikunci sebagai 'siswa'.
 */
export async function registerSiswa(input: {
  name: string;
  username: string;
  password: string;
  member_code: string;
  class_name?: string | null;
  phone?: string | null;
}): Promise<PublicUserDto> {
  const [existing] = await pool.execute<RowDataPacket[]>(
    'SELECT id, username, member_code FROM users WHERE username = ? OR member_code = ? LIMIT 1',
    [input.username, input.member_code]
  );

  if (existing.length > 0) {
    const dup = existing[0];
    const msg =
      dup.username === input.username
        ? 'Username sudah digunakan'
        : 'NIS / Kode anggota sudah terdaftar';
    throw new AppError(409, msg);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO users (name, username, password_hash, role, member_code, class_name, phone, is_active)
     VALUES (?, ?, ?, 'siswa', ?, ?, ?, 1)`,
    [
      input.name,
      input.username,
      passwordHash,
      input.member_code,
      input.class_name || null,
      input.phone || null,
    ]
  );

  await appendLog('INFO', 'auth.register', `Siswa baru terdaftar: ${input.username}`);

  return {
    id: result.insertId,
    name: input.name,
    username: input.username,
    role: 'siswa',
    member_code: input.member_code,
    class_name: input.class_name || null,
    phone: input.phone || null,
    is_active: 1,
  };
}

/**
 * Memvalidasi kredensial login dan membuat token sesi HMAC.
 */
export async function loginUser(input: {
  username: string;
  password: string;
}): Promise<{ user: PublicUserDto; token: string }> {
  const [rows] = await pool.execute<UserAuthRow[]>(
    `SELECT id, name, username, password_hash, role, member_code, class_name, phone, is_active
     FROM users WHERE username = ? LIMIT 1`,
    [input.username]
  );

  if (rows.length === 0) {
    throw new AppError(401, 'Username atau password salah');
  }

  const user = rows[0];
  const validPassword = await bcrypt.compare(input.password, user.password_hash);
  if (!validPassword) {
    throw new AppError(401, 'Username atau password salah');
  }

  if (!user.is_active) {
    throw new AppError(403, 'Akun Anda sedang dinonaktifkan. Hubungi Admin perpustakaan.');
  }

  const token = signSessionToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  await appendLog('INFO', 'auth.login', `Login sukses: ${user.username} (${user.role})`);

  return { user: toPublicUser(user), token };
}
