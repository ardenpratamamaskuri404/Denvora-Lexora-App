/**
 * @module services/transaction.service
 * @description Mutasi transaksi peminjaman dan pengembalian buku secara atomik (FOR UPDATE).
 */

import crypto from 'crypto';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { AppError } from '../utils/response';
import { appendLog } from '../utils/fileHelper';
import type { UserRole } from '../types/express';
import {
  addDays,
  formatDateLocal,
  getTransactionById,
  listAllTransactions,
  listMyTransactions,
  type StaffTransactionQuery,
  type TransactionDto,
} from './transactionQuery.service';

export { getTransactionById, listAllTransactions, listMyTransactions };
export type { StaffTransactionQuery, TransactionDto };

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
      "SELECT id, is_active FROM users WHERE id = ? AND role = 'siswa' LIMIT 1",
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
    const compactDate = borrowDate.replace(/-/g, '');
    const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
    const transactionCode = `TRX-${compactDate}-${suffix}`;

    const [insertRes] = await connection.execute<ResultSetHeader>(
      `INSERT INTO transactions
       (transaction_code, user_id, book_id, processed_by, borrow_date, due_date, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, 'borrowed', ?)`,
      [
        transactionCode,
        input.userId,
        input.bookId,
        input.processedBy,
        borrowDate,
        dueDate,
        input.notes || null,
      ]
    );

    await connection.commit();
    await appendLog(
      'INFO',
      'transaction.borrow',
      `${transactionCode} (user=${input.userId}, book=${input.bookId})`
    );
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
    await appendLog(
      'INFO',
      'transaction.return',
      `${trx.transaction_code} dikembalikan oleh ${actor.role}#${actor.id}`
    );
    return getTransactionById(trxId);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

/**
 * Memperbarui data transaksi oleh Admin/Petugas beserta sinkronisasi stok jika status berubah.
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
      'SELECT id, book_id, status, borrow_date, due_date, return_date, notes FROM transactions WHERE id = ? FOR UPDATE',
      [trxId]
    );
    if (trxRows.length === 0) {
      throw new AppError(404, 'Transaksi tidak ditemukan');
    }

    const current = trxRows[0];
    const nextDueDate = input.due_date ?? current.due_date;
    if (nextDueDate < current.borrow_date) {
      throw new AppError(400, 'Tanggal jatuh tempo tidak boleh lebih awal dari tanggal pinjam');
    }
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
        nextDueDate,
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
