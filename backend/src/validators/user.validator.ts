/**
 * @module validators/user
 * @description Skema validasi Zod untuk pengelolaan anggota siswa dan akun petugas.
 */

import { z } from 'zod';

const baseUserFields = {
  name: z.string().trim().min(3, 'Nama minimal 3 karakter').max(100),
  username: z
    .string()
    .trim()
    .min(4, 'Username minimal 4 karakter')
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore'),
  class_name: z.string().trim().max(50).optional().nullable(),
  phone: z.string().trim().max(20).optional().nullable(),
  is_active: z.coerce.number().int().min(0).max(1).optional().default(1),
};

export const memberCreateSchema = z.object({
  ...baseUserFields,
  password: z.string().min(6, 'Password minimal 6 karakter').max(100),
  member_code: z.string().trim().min(3, 'NIS / Kode anggota wajib diisi').max(30),
});

export const memberUpdateSchema = z.object({
  ...baseUserFields,
  password: z.string().min(6, 'Password minimal 6 karakter').max(100).optional().or(z.literal('')),
  member_code: z.string().trim().min(3, 'NIS / Kode anggota wajib diisi').max(30),
});

export const staffCreateSchema = z.object({
  ...baseUserFields,
  password: z.string().min(6, 'Password minimal 6 karakter').max(100),
});

export const staffUpdateSchema = z.object({
  ...baseUserFields,
  password: z.string().min(6, 'Password minimal 6 karakter').max(100).optional().or(z.literal('')),
});

export const userQuerySchema = z.object({
  search: z.string().trim().optional().default(''),
  is_active: z.enum(['all', '1', '0']).optional().default('all'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
