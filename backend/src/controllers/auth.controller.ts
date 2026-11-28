/**
 * @module controllers/auth.controller
 * @description Handler HTTP untuk registrasi siswa, login, OTP Mailpit, logout, dan profil sesi.
 */

import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { sendSuccess } from '../utils/response';
import * as authService from '../services/auth.service';
import * as otpService from '../services/otp.service';
import * as notificationService from '../services/notification.service';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await authService.registerSiswa(req.body);
    sendSuccess(
      res,
      201,
      'Pendaftaran berhasil. Silakan cek kotak masuk Mailpit Anda untuk kode OTP 6 digit.',
      { user, mailpit_url: env.mailpitUrl }
    );
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

export async function sendOtp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, purpose } = req.body;
    await otpService.requestOtpByEmail(email, purpose);
    sendSuccess(res, 200, 'Kode OTP 6 digit telah dikirim ke kotak masuk Mailpit Anda.', {
      email,
      purpose,
      mailpit_url: env.mailpitUrl,
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, otp, purpose } = req.body;
    const { user, token } = await otpService.verifyOtpCode({ email, otp, purpose });
    if (token) {
      res.cookie(env.cookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: env.sessionTtlMs,
        path: '/',
      });
    }
    const msg =
      purpose === 'login'
        ? 'Verifikasi OTP berhasil, selamat datang!'
        : 'Akun Anda berhasil diverifikasi. Silakan login.';
    sendSuccess(res, 200, msg, { user });
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

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await authService.updateOwnProfile(req.user!.id, req.body);
    sendSuccess(res, 200, 'Profil akun berhasil diperbarui', { user });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await authService.changeOwnPassword(req.user!.id, req.body);
    sendSuccess(res, 200, 'Password berhasil diperbarui');
  } catch (err) {
    next(err);
  }
}

export async function listNotifications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const feed = await notificationService.getNotificationsForUser(req.user!);
    sendSuccess(res, 200, 'Notifikasi berhasil diambil', feed);
  } catch (err) {
    next(err);
  }
}

export async function markNotificationRead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await notificationService.markNotificationRead(req.user!.id, String(req.params.key));
    sendSuccess(res, 200, 'Notifikasi ditandai sudah dibaca');
  } catch (err) {
    next(err);
  }
}

export async function markAllNotificationsRead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await notificationService.markAllNotificationsRead(req.user!);
    sendSuccess(res, 200, 'Semua notifikasi ditandai sudah dibaca');
  } catch (err) {
    next(err);
  }
}

export async function deleteNotification(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await notificationService.deleteNotification(req.user!.id, String(req.params.key));
    sendSuccess(res, 200, 'Notifikasi berhasil dihapus');
  } catch (err) {
    next(err);
  }
}

export async function clearNotifications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const mode = req.query.mode === 'all' ? 'all' : 'read';
    await notificationService.clearNotifications(req.user!, mode);
    sendSuccess(res, 200, mode === 'all' ? 'Semua notifikasi dibersihkan' : 'Notifikasi terbaca dihapus');
  } catch (err) {
    next(err);
  }
}
