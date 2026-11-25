/**
 * @module services/otp.service
 * @description Penerbitan, hashing, pengiriman via Mailpit, dan verifikasi kode OTP 6 digit.
 */

import crypto from 'node:crypto';
import type { RowDataPacket } from 'mysql2';
import { env } from '../config/env';
import { pool } from '../config/db';
import { sendOtpEmail } from '../utils/mailer';
import { AppError } from '../utils/response';
import { signSessionToken } from '../utils/token';
import { appendLog } from '../utils/fileHelper';
import type { AuthUser } from '../types/express';

export type OtpPurpose = 'register' | 'login';

interface OtpRow extends RowDataPacket {
  id: number;
  user_id: number;
  otp_hash: string;
  expires_at: Date;
}

interface UserOtpRow extends RowDataPacket, AuthUser {}

function hashOtpCode(email: string, purpose: OtpPurpose, otp: string): string {
  return crypto
    .createHmac('sha256', env.sessionSecret)
    .update(`${email.toLowerCase()}:${purpose}:${otp}`)
    .digest('hex');
}

function generateSixDigitOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Membuat kode OTP baru, menyimpan hash di MySQL, dan mengirimkannya ke Mailpit.
 */
export async function issueAndSendOtp(params: {
  userId: number;
  email: string;
  name: string;
  purpose: OtpPurpose;
}): Promise<void> {
  const email = params.email.trim().toLowerCase();
  const otp = generateSixDigitOtp();
  const otpHash = hashOtpCode(email, params.purpose, otp);

  await pool.execute(
    `UPDATE otp_verifications SET consumed_at = NOW()
     WHERE email = ? AND purpose = ? AND consumed_at IS NULL`,
    [email, params.purpose]
  );

  await pool.execute(
    `INSERT INTO otp_verifications (user_id, email, purpose, otp_hash, expires_at)
     VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
    [params.userId, email, params.purpose, otpHash]
  );

  await sendOtpEmail({
    to: email,
    name: params.name,
    otp,
    purpose: params.purpose,
  });

  await appendLog('INFO', `auth.otp.${params.purpose}`, `OTP dikirim ke ${email}`);
}

/**
 * Meminta kirim ulang atau pengiriman OTP baru berdasarkan alamat email terdaftar.
 */
export async function requestOtpByEmail(email: string, purpose: OtpPurpose): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  const [rows] = await pool.execute<UserOtpRow[]>(
    `SELECT id, name, email, username, role, member_code, class_name, phone, is_active, is_verified
     FROM users WHERE email = ? LIMIT 1`,
    [cleanEmail]
  );

  if (rows.length === 0) {
    throw new AppError(404, 'Email belum terdaftar di sistem Denvora Lexora.');
  }

  const user = rows[0];
  if (!user.is_active) {
    throw new AppError(403, 'Akun Anda sedang dinonaktifkan. Hubungi Admin perpustakaan.');
  }

  if (purpose === 'register' && user.is_verified) {
    throw new AppError(400, 'Email ini sudah terverifikasi. Silakan langsung masuk.');
  }

  await issueAndSendOtp({
    userId: user.id,
    email: cleanEmail,
    name: user.name,
    purpose,
  });
}

/**
 * Memvalidasi OTP 6 digit dari Mailpit dan mengaktifkan verifikasi / sesi pengguna.
 */
export async function verifyOtpCode(input: {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}): Promise<{ user: AuthUser; token?: string }> {
  const cleanEmail = input.email.trim().toLowerCase();
  const [otpRows] = await pool.execute<OtpRow[]>(
    `SELECT id, user_id, otp_hash, expires_at
     FROM otp_verifications
     WHERE email = ? AND purpose = ? AND consumed_at IS NULL AND expires_at >= NOW()
     ORDER BY id DESC LIMIT 1`,
    [cleanEmail, input.purpose]
  );

  if (otpRows.length === 0) {
    throw new AppError(400, 'Kode OTP tidak ditemukan atau sudah kedaluwarsa. Minta kode baru.');
  }

  const record = otpRows[0];
  const expectedHash = hashOtpCode(cleanEmail, input.purpose, input.otp.trim());
  if (record.otp_hash !== expectedHash) {
    throw new AppError(400, 'Kode OTP tidak sesuai. Periksa kembali kotak masuk Mailpit.');
  }

  await pool.execute('UPDATE otp_verifications SET consumed_at = NOW() WHERE id = ?', [record.id]);
  await pool.execute('UPDATE users SET is_verified = 1 WHERE id = ?', [record.user_id]);

  const [users] = await pool.execute<UserOtpRow[]>(
    `SELECT id, name, email, username, role, member_code, class_name, phone, is_active, is_verified
     FROM users WHERE id = ? LIMIT 1`,
    [record.user_id]
  );

  if (users.length === 0) {
    throw new AppError(404, 'Akun pengguna tidak ditemukan');
  }

  const user = users[0];
  await appendLog('INFO', `auth.otp.verified`, `Verifikasi OTP sukses: ${user.username}`);

  if (input.purpose === 'login') {
    const token = signSessionToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    return { user, token };
  }

  return { user };
}
