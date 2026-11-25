/**
 * @module controllers/auth.controller
 * @description Handler HTTP untuk registrasi siswa, login, logout, dan profil pengguna sesi.
 */

import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { sendSuccess } from '../utils/response';
import * as authService from '../services/auth.service';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await authService.registerSiswa(req.body);
    sendSuccess(res, 201, 'Pendaftaran anggota berhasil. Silakan login.', { user });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user, token } = await authService.loginUser(req.body);
    res.cookie(env.cookieName, token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: env.sessionTtlMs,
      path: '/',
    });
    sendSuccess(res, 200, 'Login berhasil', { user });
  } catch (err) {
    next(err);
  }
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  sendSuccess(res, 200, 'Logout berhasil');
}

export function me(req: Request, res: Response): void {
  sendSuccess(res, 200, 'Profil pengguna aktif', { user: req.user });
}
