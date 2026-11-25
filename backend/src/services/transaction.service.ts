/**
 * @module services/transaction.service
 * @description Logika bisnis peminjaman, pengembalian atomik (FOR UPDATE), dan CRUD transaksi.
 */

import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { AppError } from '../utils/response';
import { appendLog } from '../utils/fileHelper';
import type { UserRole } from '../types/express';

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

function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  return formatDateLocal(d);
}

/**
 * Menghitung jumlah hari keterlambatan transaksi berdasarkan due_date.
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

const BASE_TRANSACTION_SELECT = `
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
 * Mengambil detail satu transaksi beserta kalkulasi status keterlambatan.
 */
export async function getTransactionById(id: number): Promise<TransactionDto> {
  const [rows] = await pool.execute<TransactionRow[]>(
    `${BASE_TRANSACTION_SELECT} WHERE t.id = ? LIMIT 1`,
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
    `${BASE_TRANSACTION_SELECT} WHERE ${conditions.join(' AND ')} ORDER BY t.id DESC`,
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
      '(t.transaction_code LIKE ? OR u.name LIKE ? OR COALESCE(u.member_code, "") LIKE ? OR b.title LIKE ? OR b.book_code LIKE ?)'
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
    `${BASE_TRANSACTION_SELECT} ${whereClause} ORDER BY t.id DESC LIMIT ? OFFSET ?`,
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

/**
 * Mencatat peminjaman buku baru secara atomik dengan penguncian stok (FOR UPDATE).
 */
export async function createBorrowTransaction(input: {
  userId: number;
  bookId: number;
  processedBy: number | null;
  borrowDate?: string;
  dueDate?: string;
  notes?: string | null;
}): Promise<TransactionDto> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [userRows] = await connection.execute<RowDataPacket[]>(
      "SELECT id, role, is_active FROM users WHERE id = ? AND role = 'siswa' LIMIT 1",
      [input.userId]
    );
    if (userRows.length === 0) {
      throw new AppError(404, 'Anggota peminjam (siswa) tidak ditemukan');
    }
    if (!userRows[0].is_active) {
      throw new AppError(403, 'Akun anggota sedang nonaktif dan tidak dapat meminjam buku');
    }

    const [bookRows] = await connection.execute<RowDataPacket[]>(
      'SELECT id, stock_available FROM books WHERE id = ? FOR UPDATE',
      [input.bookId]
    );
    if (bookRows.length === 0) {
      throw new AppError(404, 'Buku tidak ditemukan');
    }
    if (Number(bookRows[0].stock_available) <= 0) {
      throw new AppError(409, 'Stok buku sedang habis dan tidak tersedia untuk dipinjam');
    }

    await connection.execute<ResultSetHeader>(
      'UPDATE books SET stock_available = stock_available - 1 WHERE id = ?',
      [input.bookId]
    );

    const borrowDate = input.borrowDate || formatDateLocal(new Date());
    const dueDate = input.dueDate || addDays(borrowDate, 7);
    const tempCode = `TMP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const [insertRes] = await connection.execute<ResultSetHeader>(
      `INSERT INTO transactions
       (transaction_code, user_id, book_id, processed_by, borrow_date, due_date, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, 'borrowed', ?)`,
      [tempCode, input.userId, input.bookId, input.processedBy, borrowDate, dueDate, input.notes || null]
    );

    const compactDate = borrowDate.replace(/-/g, '');
    const finalCode = `TRX-${compactDate}-${String(insertRes.insertId).padStart(4, '0')}`;
    await connection.execute<ResultSetHeader>(
      'UPDATE transactions SET transaction_code = ? WHERE id = ?',
      [finalCode, insertRes.insertId]
    );

    await connection.commit();
    await appendLog('INFO', 'transaction.borrow', `${finalCode} (user=${input.userId}, book=${input.bookId})`);
    return getTransactionById(insertRes.insertId);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

/**
 * Memproses pengembalian buku secara atomik dan menambah kembali stok tersedia.
 */
export async function returnTransaction(
  trxId: number,
  actor: { id: number; role: UserRole }
): Promise<TransactionDto> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [trxRows] = await connection.execute<RowDataPacket[]>(
      'SELECT id, transaction_code, user_id, book_id, status FROM transactions WHERE id = ? FOR UPDATE',
      [trxId]
    );
    if (trxRows.length === 0) {
      throw new AppError(404, 'Transaksi tidak ditemukan');
    }

    const trx = trxRows[0];
    if (actor.role === 'siswa' && Number(trx.user_id) !== actor.id) {
      throw new AppError(403, 'Anda tidak berhak mengembalikan transaksi milik anggota lain');
    }

    if (trx.status === 'returned') {
      throw new AppError(409, 'Buku pada transaksi ini sudah dikembalikan sebelumnya');
    }

    const returnDate = formatDateLocal(new Date());
    if (actor.role === 'siswa') {
      await connection.execute<ResultSetHeader>(
        "UPDATE transactions SET status = 'returned', return_date = ? WHERE id = ?",
        [returnDate, trxId]
      );
    } else {
      await connection.execute<ResultSetHeader>(
        "UPDATE transactions SET status = 'returned', return_date = ?, processed_by = ? WHERE id = ?",
        [returnDate, actor.id, trxId]
      );
    }

    await connection.execute<ResultSetHeader>(
      'UPDATE books SET stock_available = LEAST(stock_total, stock_available + 1) WHERE id = ?',
      [trx.book_id]
    );

    await connection.commit();
    await appendLog('INFO', 'transaction.return', `${trx.transaction_code} dikembalikan oleh ${actor.role}#${actor.id}`);
    return getTransactionById(trxId);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

/**
 * Memperbarui data transaksi oleh Admin/Petugas (termasuk sinkronisasi stok jika status berubah).
 */
export async function updateTransactionByStaff(
  trxId: number,
  staffId: number,
  input: {
    status?: 'borrowed' | 'returned';
    due_date?: string;
    return_date?: string | null;
    notes?: string | null;
  }
): Promise<TransactionDto> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [trxRows] = await connection.execute<RowDataPacket[]>(
      'SELECT id, book_id, status, due_date, return_date, notes FROM transactions WHERE id = ? FOR UPDATE',
      [trxId]
    );
    if (trxRows.length === 0) {
      throw new AppError(404, 'Transaksi tidak ditemukan');
    }

    const current = trxRows[0];
    const nextStatus = input.status ?? current.status;

    if (current.status === 'borrowed' && nextStatus === 'returned') {
      await connection.execute<ResultSetHeader>(
        'UPDATE books SET stock_available = LEAST(stock_total, stock_available + 1) WHERE id = ?',
        [current.book_id]
      );
    } else if (current.status === 'returned' && nextStatus === 'borrowed') {
      const [bookRows] = await connection.execute<RowDataPacket[]>(
        'SELECT stock_available FROM books WHERE id = ? FOR UPDATE',
        [current.book_id]
      );
      if (Number(bookRows[0].stock_available) <= 0) {
        throw new AppError(409, 'Stok buku tidak mencukupi untuk membuka kembali pinjaman');
      }
      await connection.execute<ResultSetHeader>(
        'UPDATE books SET stock_available = stock_available - 1 WHERE id = ?',
        [current.book_id]
      );
    }

    const nextReturnDate =
      nextStatus === 'returned'
        ? input.return_date || current.return_date || formatDateLocal(new Date())
        : null;

    await connection.execute<ResultSetHeader>(
      `UPDATE transactions
       SET status = ?, due_date = ?, return_date = ?, notes = ?, processed_by = ?
       WHERE id = ?`,
      [
        nextStatus,
        input.due_date ?? current.due_date,
        nextReturnDate,
        input.notes !== undefined ? input.notes : current.notes,
        staffId,
        trxId,
      ]
    );

    await connection.commit();
    return getTransactionById(trxId);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

/**
 * Menghapus catatan transaksi oleh Admin/Petugas (memulihkan stok jika masih borrowed).
 */
export async function deleteTransactionByStaff(trxId: number): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [trxRows] = await connection.execute<RowDataPacket[]>(
      'SELECT id, transaction_code, book_id, status FROM transactions WHERE id = ? FOR UPDATE',
      [trxId]
    );
    if (trxRows.length === 0) {
      throw new AppError(404, 'Transaksi tidak ditemukan');
    }

    const trx = trxRows[0];
    if (trx.status === 'borrowed') {
      await connection.execute<ResultSetHeader>(
        'UPDATE books SET stock_available = LEAST(stock_total, stock_available + 1) WHERE id = ?',
        [trx.book_id]
      );
    }

    await connection.execute<ResultSetHeader>('DELETE FROM transactions WHERE id = ?', [trxId]);
    await connection.commit();
    await appendLog('WARN', 'transaction.delete', `Transaksi dihapus: ${trx.transaction_code}`);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}
