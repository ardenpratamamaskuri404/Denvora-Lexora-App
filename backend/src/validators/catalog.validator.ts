/**
 * @module validators/catalog
 * @description Skema validasi Zod untuk kategori dan data buku beserta pencarian kondisi tertentu.
 */

import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Nama kategori minimal 2 karakter').max(60),
});

export const bookBodySchema = z.object({
  book_code: z.string().trim().min(2, 'Kode buku minimal 2 karakter').max(30),
  title: z.string().trim().min(1, 'Judul buku wajib diisi').max(150),
  author: z.string().trim().min(2, 'Nama pengarang wajib diisi').max(100),
  publisher: z.string().trim().min(2, 'Nama penerbit wajib diisi').max(100),
  publication_year: z.coerce
    .number()
    .int()
    .min(1900, 'Tahun terbit minimal 1900')
    .max(2100, 'Tahun terbit tidak valid'),
  category_id: z.coerce.number().int().positive('Kategori wajib dipilih'),
  stock_total: z.coerce.number().int().min(0, 'Stok total tidak boleh negatif').max(10000),
  shelf_location: z.string().trim().max(30).optional().nullable(),
  description: z.string().trim().max(2000).optional().nullable(),
  cover_url: z.string().trim().max(255).optional().nullable().or(z.literal('')),
});

export const coverUploadSchema = z.object({
  filename: z.string().trim().min(1, 'Nama file wajib diisi').max(120),
  data_url: z.string().min(20, 'Data gambar tidak valid'),
});

export const bookQuerySchema = z.object({
  search: z.string().trim().optional().default(''),
  category_id: z.coerce.number().int().positive().optional(),
  availability: z.enum(['all', 'available', 'empty']).optional().default('all'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
