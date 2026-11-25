/**
 * @module middlewares/auth
 * @description Middleware autentikasi sesi dan otorisasi berbasis peran (RBAC 3 role).
 */

const env = require('../config/env');
const { pool } = require('../config/db');
const { AppError } = require('../utils/response');
const { parseCookies, verifySessionToken } = require('../utils/token');

/**
 * Mengekstrak token sesi dari cookie HttpOnly atau header Authorization Bearer.
 * @param {import('express').Request} req
 * @returns {string|null}
 */
function extractToken(req) {
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
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
async function authMiddleware(req, _res, next) {
  try {
    const token = extractToken(req);
    const decoded = verifySessionToken(token);
    if (!decoded) {
      return next(new AppError(401, 'Sesi tidak valid atau belum login'));
    }

    const [rows] = await pool.execute(
      'SELECT id, name, username, role, member_code, class_name, phone, is_active FROM users WHERE id = ? LIMIT 1',
      [decoded.id]
    );

    if (rows.length === 0) {
      return next(new AppError(401, 'Akun pengguna tidak ditemukan'));
    }

    const user = rows[0];
    if (!user.is_active) {
      return next(new AppError(403, 'Akun pengguna sedang dinonaktifkan'));
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Membatasi akses endpoint hanya untuk peran tertentu.
 * @param {...('admin'|'petugas'|'siswa')} allowedRoles Daftar peran yang diizinkan
 * @returns {import('express').RequestHandler}
 */
function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError(401, 'Autentikasi diperlukan'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(403, 'Anda tidak memiliki hak akses untuk fitur ini'));
    }
    return next();
  };
}

module.exports = { authMiddleware, requireRole };
