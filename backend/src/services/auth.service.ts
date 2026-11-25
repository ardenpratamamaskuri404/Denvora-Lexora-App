/**
 * @module services/auth.service
 * @description Logika bisnis pendaftaran anggota siswa, login, dan verifikasi OTP Mailpit.
 */

import bcrypt from 'bcryptjs';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { AppError } from '../utils/response';
import { signSessionToken } from '../utils/token';
import { appendLog } from '../utils/fileHelper';
import { issueAndSendOtp } from './otp.service';
import type { AuthUser, UserRole } from '../types/express';

interface UserAuthRow extends RowDataPacket, AuthUser {
  password_hash: string;
}

export interface PublicUserDto {
  id: number;
  name: string;
  email: string | null;
  username: string;
  role: UserRole;
  member_code: string | null;
  class_name: string | null;
  phone: string | null;
  is_active: number;
  is_verified: number;
}

function toPublicUser(row: AuthUser): PublicUserDto {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    username: row.username,
    role: row.role,
    member_code: row.member_code,
    class_name: row.class_name,
    phone: row.phone,
    is_active: row.is_active,
    is_verified: row.is_verified,
  };
}

/**
 * Mendaftarkan anggota baru dengan role dikunci sebagai 'siswa' dan mengirim OTP via Mailpit.
 */
export async function registerSiswa(input: {
  name: string;
  email: string;
  username: string;
  password: string;
  member_code: string;
  class_name?: string | null;
  phone?: string | null;
}): Promise<PublicUserDto> {
  const cleanEmail = input.email.trim().toLowerCase();

  const [existing] = await pool.execute<RowDataPacket[]>(
    `SELECT id, username, member_code, email
     FROM users WHERE username = ? OR member_code = ? OR email = ? LIMIT 1`,
    [input.username, input.member_code, cleanEmail]
  );

  if (existing.length > 0) {
    const dup = existing[0];
    let msg = 'Data anggota sudah terdaftar';
    if (dup.email === cleanEmail) msg = 'Email sudah digunakan oleh akun lain';
    else if (dup.username === input.username) msg = 'Username sudah digunakan';
    else if (dup.member_code === input.member_code) msg = 'NIS / Kode anggota sudah terdaftar';
    throw new AppError(409, msg);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO users (name, email, username, password_hash, role, member_code, class_name, phone, is_active, is_verified)
     VALUES (?, ?, ?, ?, 'siswa', ?, ?, ?, 1, 0)`,
    [
      input.name,
      cleanEmail,
      input.username,
      passwordHash,
      input.member_code,
      input.class_name || null,
      input.phone || null,
    ]
  );

  await issueAndSendOtp({
    userId: result.insertId,
    email: cleanEmail,
    name: input.name,
    purpose: 'register',
  });

  await appendLog('INFO', 'auth.register', `Siswa baru terdaftar (menunggu OTP): ${input.username}`);

  return {
    id: result.insertId,
    name: input.name,
    email: cleanEmail,
    username: input.username,
    role: 'siswa',
    member_code: input.member_code,
    class_name: input.class_name || null,
    phone: input.phone || null,
    is_active: 1,
    is_verified: 0,
  };
}

/**
 * Memvalidasi kredensial login (username atau email) dan membuat token sesi HMAC.
 */
export async function loginUser(input: {
  username: string;
  password: string;
}): Promise<{ user: PublicUserDto; token: string }> {
  const identifier = input.username.trim();
  const [rows] = await pool.execute<UserAuthRow[]>(
    `SELECT id, name, email, username, password_hash, role, member_code, class_name, phone, is_active, is_verified
     FROM users WHERE username = ? OR email = ? LIMIT 1`,
    [identifier, identifier.toLowerCase()]
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

  if (!user.is_verified && user.email) {
    await issueAndSendOtp({
      userId: user.id,
      email: user.email,
      name: user.name,
      purpose: 'register',
    });
    throw new AppError(403, 'Akun belum diverifikasi OTP. Kode OTP telah dikirim ulang ke email Anda.', [
      { field: 'email', message: user.email },
    ]);
  }

  const token = signSessionToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  await appendLog('INFO', 'auth.login', `Login sukses: ${user.username} (${user.role})`);

  return { user: toPublicUser(user), token };
}
