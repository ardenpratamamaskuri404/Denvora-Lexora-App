/**
 * @module utils/mailer
 * @description Pengirim email OTP lokal melalui SMTP Mailpit (100% offline localhost).
 */

import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { AppError } from './response';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
  tls: { rejectUnauthorized: false },
});

export interface SendOtpEmailParams {
  to: string;
  name: string;
  otp: string;
  purpose: 'register' | 'login';
}

/**
 * Mengirim kode OTP 6 digit ke kotak masuk Mailpit lokal.
 */
export async function sendOtpEmail({
  to,
  name,
  otp,
  purpose,
}: SendOtpEmailParams): Promise<void> {
  const actionText =
    purpose === 'register'
      ? 'Aktivasi Akun Anggota Baru'
      : 'Konfirmasi Masuk Portal Anggota';

  const html = `
  <div style="font-family:system-ui,-apple-system,sans-serif;background:#F6EFE6;padding:32px 16px;color:#2B1D14;">
    <div style="max-width:520px;margin:0 auto;background:#FBF7F1;border:1px solid #D7C7B4;border-radius:20px;padding:32px;">
      <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#A8643A;font-weight:700;">
        Denvora Lexora · Perpustakaan Digital
      </p>
      <h1 style="margin:10px 0 8px;font-family:Georgia,serif;font-size:24px;color:#2B1D14;">
        ${actionText}
      </h1>
      <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#5D4C3F;">
        Halo <strong>${name}</strong>, gunakan kode verifikasi 6 digit berikut untuk melanjutkan:
      </p>
      <div style="background:#2B1D14;color:#F6EFE6;border-radius:14px;padding:18px;text-align:center;font-size:32px;font-weight:700;letter-spacing:10px;font-family:monospace;">
        ${otp}
      </div>
      <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#8C7B6B;">
        Kode berlaku selama <strong>10 menit</strong>. Abaikan email ini jika Anda tidak meminta verifikasi.
      </p>
      <hr style="border:none;border-top:1px solid #D7C7B4;margin:22px 0;" />
      <p style="margin:0;font-size:12px;color:#8C7B6B;">
        Denvora Lexora — Where Knowledge Finds Its Way.
      </p>
    </div>
  </div>`;

  try {
    await transporter.sendMail({
      from: env.smtp.from,
      to,
      subject: `[Denvora Lexora] Kode OTP Anda: ${otp}`,
      text: `Halo ${name},\n\nKode OTP ${actionText} Anda adalah: ${otp}\nBerlaku selama 10 menit.\n\nDenvora Lexora`,
      html,
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'SMTP error';
    throw new AppError(
      503,
      `Gagal mengirim email OTP ke Mailpit (${env.smtp.host}:${env.smtp.port}): ${detail}`
    );
  }
}
