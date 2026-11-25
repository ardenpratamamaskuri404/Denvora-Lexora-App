/**
 * @module controllers/transaction.controller
 * @description Handler HTTP untuk peminjaman/pengembalian Siswa dan CRUD Transaksi Admin/Petugas.
 */

import type { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import * as transactionService from '../services/transaction.service';

export async function listMyTransactions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as unknown as { status: 'all' | 'borrowed' | 'returned' };
    const items = await transactionService.listMyTransactions(req.user!.id, query.status);
    sendSuccess(res, 200, 'Riwayat transaksi berhasil diambil', items);
  } catch (err) {
    next(err);
  }
}

export async function borrowBySiswa(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const trx = await transactionService.createBorrowTransaction({
      userId: req.user!.id,
      bookId: req.body.book_id,
      processedBy: null,
      notes: req.body.notes,
    });
    sendSuccess(res, 201, 'Peminjaman buku berhasil dicatat', trx);
  } catch (err) {
    next(err);
  }
}

export async function returnBySiswa(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const trx = await transactionService.returnTransaction(Number(req.params.id), {
      id: req.user!.id,
      role: req.user!.role,
    });
    sendSuccess(res, 200, 'Pengembalian buku berhasil diproses', trx);
  } catch (err) {
    next(err);
  }
}

export async function listAllTransactions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as unknown as transactionService.StaffTransactionQuery;
    const { items, meta } = await transactionService.listAllTransactions(query);
    sendSuccess(res, 200, 'Daftar transaksi berhasil diambil', items, meta);
  } catch (err) {
    next(err);
  }
}

export async function getTransaction(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const trx = await transactionService.getTransactionById(Number(req.params.id));
    sendSuccess(res, 200, 'Detail transaksi berhasil diambil', trx);
  } catch (err) {
    next(err);
  }
}

export async function createTransactionByStaff(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const trx = await transactionService.createBorrowTransaction({
      userId: req.body.user_id,
      bookId: req.body.book_id,
      processedBy: req.user!.id,
      borrowDate: req.body.borrow_date,
      dueDate: req.body.due_date,
      notes: req.body.notes,
    });
    sendSuccess(res, 201, 'Transaksi peminjaman berhasil dibuat', trx);
  } catch (err) {
    next(err);
  }
}

export async function updateTransactionByStaff(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const trx = await transactionService.updateTransactionByStaff(
      Number(req.params.id),
      req.user!.id,
      req.body
    );
    sendSuccess(res, 200, 'Transaksi berhasil diperbarui', trx);
  } catch (err) {
    next(err);
  }
}

export async function deleteTransactionByStaff(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await transactionService.deleteTransactionByStaff(Number(req.params.id));
    sendSuccess(res, 200, 'Transaksi berhasil dihapus');
  } catch (err) {
    next(err);
  }
}
