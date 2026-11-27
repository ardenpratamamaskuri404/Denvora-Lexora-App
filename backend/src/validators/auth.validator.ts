/**
 * @module validators/auth
 * @description Skema validasi Zod untuk pendaftaran anggota, login, dan verifikasi OTP.
 */

import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(3, 'Nama lengkap minimal 3 karakter').max(100),
  email: z.string().trim().email('Format email tidak valid').max(120),
  username: z
    .string()
    .trim()
    .min(4, 'Username minimal 4 karakter')
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore'),
  password: z.string().min(6, 'Password minimal 6 karakter').max(100),
  member_code: z.string().trim().min(3, 'NIS / Kode anggota minimal 3 karakter').max(30),
  class_name: z.string().trim().max(50).optional().nullable(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{0,20}$/, 'Format nomor HP tidak valid')
    .max(20)
    .optional()
    .nullable(),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username atau email wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const sendOtpSchema = z.object({
  email: z.string().trim().email('Format email tidak valid').max(120),
  purpose: z.enum(['register', 'login']),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email('Format email tidak valid').max(120),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Kode OTP wajib 6 digit angka'),
  purpose: z.enum(['register', 'login']),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(3, 'Nama lengkap minimal 3 karakter').max(100),
  email: z
    .string()
    .trim()
    .email('Format email tidak valid')
    .max(120)
    .optional()
    .nullable()
    .or(z.literal('')),
  class_name: z.string().trim().max(50).optional().nullable(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{0,20}$/, 'Format nomor HP tidak valid')
    .max(20)
    .optional()
    .nullable(),
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Password saat ini wajib diisi'),
  new_password: z.string().min(6, 'Password baru minimal 6 karakter').max(100),
});
