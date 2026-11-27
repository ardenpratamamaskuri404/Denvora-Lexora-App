/**
 * @module validators/transaction
 * @description Skema validasi Zod untuk transaksi peminjaman, pengembalian, dan filter kondisi tertentu.
 */

import { z } from 'zod';

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const siswaBorrowSchema = z.object({
  book_id: z.coerce.number().int().positive('Buku wajib dipilih'),
  notes: z.string().trim().max(255).optional().nullable(),
});

export const staffCreateTransactionSchema = z
  .object({
    user_id: z.coerce.number().int().positive('Anggota peminjam wajib dipilih'),
    book_id: z.coerce.number().int().positive('Buku wajib dipilih'),
    borrow_date: z.string().regex(isoDateRegex, 'Format tanggal YYYY-MM-DD').optional(),
    due_date: z.string().regex(isoDateRegex, 'Format tanggal YYYY-MM-DD').optional(),
    notes: z.string().trim().max(255).optional().nullable(),
  })
  .refine(
    (data) => !data.borrow_date || !data.due_date || data.due_date >= data.borrow_date,
    {
      message: 'Tanggal jatuh tempo tidak boleh lebih awal dari tanggal pinjam',
      path: ['due_date'],
    }
  );

export const staffUpdateTransactionSchema = z.object({
  status: z.enum(['borrowed', 'returned']).optional(),
  due_date: z.string().regex(isoDateRegex, 'Format tanggal YYYY-MM-DD').optional(),
  return_date: z
    .string()
    .regex(isoDateRegex, 'Format tanggal YYYY-MM-DD')
    .optional()
    .nullable()
    .or(z.literal('')),
  notes: z.string().trim().max(255).optional().nullable(),
});

export const siswaTransactionQuerySchema = z.object({
  status: z.enum(['all', 'borrowed', 'returned']).optional().default('all'),
});

export const staffTransactionQuerySchema = z.object({
  search: z.string().trim().optional().default(''),
  status: z.enum(['all', 'borrowed', 'returned']).optional().default('all'),
  date_from: z.string().regex(isoDateRegex).optional().or(z.literal('')),
  date_to: z.string().regex(isoDateRegex).optional().or(z.literal('')),
  overdue_only: z.enum(['true', 'false']).optional().default('false'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
