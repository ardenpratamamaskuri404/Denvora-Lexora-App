/**
 * @module services/transactionQuery.service
 * @description Query baca transaksi peminjaman/pengembalian dan kalkulasi keterlambatan.
 */

import type { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { AppError } from '../utils/response';

export interface TransactionRow extends RowDataPacket {
  id: number;
  transaction_code: string;
  user_id: number;
  member_name: string;
  member_code: string | null;
  class_name: string | null;
  book_id: number;
  book_code: string;
  book_title: string;
  processed_by: number | null;
  processed_by_name: string | null;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: 'borrowed' | 'returned';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionDto extends TransactionRow {
  is_overdue: boolean;
  overdue_days: number;
}

export interface StaffTransactionQuery {
  search: string;
  status: 'all' | 'borrowed' | 'returned';
  date_from?: string;
  date_to?: string;
  overdue_only: 'true' | 'false';
  page: number;
  limit: number;
}

export function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  return formatDateLocal(d);
}

/**
 * Menghitung status dan jumlah hari keterlambatan berdasarkan due_date.
 */
export function computeOverdueInfo(row: TransactionRow): TransactionDto {
  const compareDate = row.return_date || formatDateLocal(new Date());
  const dueMs = new Date(`${row.due_date}T00:00:00`).getTime();
  const cmpMs = new Date(`${compareDate}T00:00:00`).getTime();
  const diffDays = Math.floor((cmpMs - dueMs) / (1000 * 60 * 60 * 24));
  const overdueDays = diffDays > 0 ? diffDays : 0;

  return {
    ...row,
    is_overdue: row.status === 'borrowed' && overdueDays > 0,
    overdue_days: overdueDays,
  };
}

const BASE_SELECT = `
  SELECT t.id, t.transaction_code, t.user_id,
         u.name AS member_name, u.member_code, u.class_name,
         t.book_id, b.book_code, b.title AS book_title,
         t.processed_by, p.name AS processed_by_name,
         t.borrow_date, t.due_date, t.return_date, t.status, t.notes,
         t.created_at, t.updated_at
  FROM transactions t
  INNER JOIN users u ON u.id = t.user_id
  INNER JOIN books b ON b.id = t.book_id
  LEFT JOIN users p ON p.id = t.processed_by
`;

/**
 * Mengambil detail satu transaksi beserta status keterlambatan.
 */
export async function getTransactionById(id: number): Promise<TransactionDto> {
  const [rows] = await pool.execute<TransactionRow[]>(
    `${BASE_SELECT} WHERE t.id = ? LIMIT 1`,
    [id]
  );
  if (rows.length === 0) {
    throw new AppError(404, 'Transaksi tidak ditemukan');
  }
  return computeOverdueInfo(rows[0]);
}

/**
 * Mengambil daftar riwayat transaksi milik siswa yang sedang login.
 */
export async function listMyTransactions(
  userId: number,
  status: 'all' | 'borrowed' | 'returned'
): Promise<TransactionDto[]> {
  const conditions = ['t.user_id = ?'];
  const params: Array<string | number> = [userId];

  if (status !== 'all') {
    conditions.push('t.status = ?');
    params.push(status);
  }

  const [rows] = await pool.execute<TransactionRow[]>(
    `${BASE_SELECT} WHERE ${conditions.join(' AND ')} ORDER BY t.id DESC`,
    params
  );

  return rows.map(computeOverdueInfo);
}

/**
 * Mengambil seluruh transaksi untuk Admin/Petugas dengan filter kondisi tertentu.
 */
export async function listAllTransactions(query: StaffTransactionQuery): Promise<{
  items: TransactionDto[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const conditions: string[] = [];
  const params: Array<string | number> = [];

  if (query.search) {
    conditions.push(
      '(t.transaction_code LIKE ? OR u.name LIKE ? OR u.member_code LIKE ? OR b.title LIKE ? OR b.book_code LIKE ?)'
    );
    const kw = `%${query.search}%`;
    params.push(kw, kw, kw, kw, kw);
  }

  if (query.status !== 'all') {
    conditions.push('t.status = ?');
    params.push(query.status);
  }

  if (query.date_from) {
    conditions.push('t.borrow_date >= ?');
    params.push(query.date_from);
  }

  if (query.date_to) {
    conditions.push('t.borrow_date <= ?');
    params.push(query.date_to);
  }

  if (query.overdue_only === 'true') {
    conditions.push("t.status = 'borrowed' AND t.due_date < CURDATE()");
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (query.page - 1) * query.limit;

  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total
     FROM transactions t
     INNER JOIN users u ON u.id = t.user_id
     INNER JOIN books b ON b.id = t.book_id
     ${whereClause}`,
    params
  );
  const total = Number(countRows[0].total);

  const [rows] = await pool.query<TransactionRow[]>(
    `${BASE_SELECT} ${whereClause} ORDER BY t.id DESC LIMIT ? OFFSET ?`,
    [...params, query.limit, offset]
  );

  return {
    items: rows.map(computeOverdueInfo),
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
}
