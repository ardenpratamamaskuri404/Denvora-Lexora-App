/**
 * @module controllers/report.controller
 * @description Handler HTTP untuk ringkasan statistik dan ekspor laporan CSV.
 */

import type { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import * as reportService from '../services/report.service';
import type { StaffTransactionQuery } from '../services/transaction.service';

export async function getSummary(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const summary = await reportService.getLibrarySummary();
    sendSuccess(res, 200, 'Ringkasan laporan perpustakaan berhasil diambil', summary);
  } catch (err) {
    next(err);
  }
}

export async function exportTransactionsCsv(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as unknown as Omit<StaffTransactionQuery, 'page' | 'limit'>;
    const { filename, content } = await reportService.exportTransactionsCsv(query);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(content);
  } catch (err) {
    next(err);
  }
}
