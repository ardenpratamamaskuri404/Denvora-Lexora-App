/**
 * @module middlewares/auth
 * @description Middleware autentikasi sesi dan otorisasi berbasis peran (RBAC 3 role).
 */

import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { RowDataPacket } from 'mysql2';
import { env } from '../config/env';
import { pool } from '../config/db';
import { AppError } from '../utils/response';
import { parseCookies, verifySessionToken } from '../utils/token';
import type { AuthUser, UserRole } from '../types/express';

interface UserRow extends RowDataPacket, AuthUser {}

function extractToken(req: Request): string | null {
  const cookies = parseCookies(req.headers.cookie);
  if (cookies[env.cookieName]) {
    return cookies[env.cookieName];
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return null;
}

/**
 * Memverifikasi sesi login dan menyisipkan data pengguna aktif ke req.user.
 */
export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    const decoded = verifySessionToken(token);
    if (!decoded) {
      next(new AppError(401, 'Sesi tidak valid atau belum login'));
      return;
    }

    const [rows] = await pool.execute<UserRow[]>(
      'SELECT id, name, username, role, member_code, class_name, phone, is_active FROM users WHERE id = ? LIMIT 1',
      [decoded.id]
    );

    if (rows.length === 0) {
      next(new AppError(401, 'Akun pengguna tidak ditemukan'));
      return;
    }

    const user = rows[0];
    if (!user.is_active) {
      next(new AppError(403, 'Akun pengguna sedang dinonaktifkan'));
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Membatasi akses endpoint hanya untuk peran tertentu.
 */
export function requireRole(...allowedRoles: UserRole[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'Autentikasi diperlukan'));
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError(403, 'Anda tidak memiliki hak akses untuk fitur ini'));
      return;
    }
    next();
  };
}
