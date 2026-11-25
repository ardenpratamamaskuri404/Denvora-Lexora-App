/**
 * @module validators/auth
 * @description Skema validasi Zod untuk pendaftaran anggota siswa dan login.
 */

import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter').max(100),
  username: z
    .string()
    .trim()
    .min(4, 'Username minimal 4 karakter')
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore'),
  password: z.string().min(6, 'Password minimal 6 karakter').max(100),
  member_code: z.string().trim().min(3, 'NIS / Kode anggota minimal 3 karakter').max(30),
  class_name: z.string().trim().max(50).optional().nullable(),
  phone: z.string().trim().max(20).optional().nullable(),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});
