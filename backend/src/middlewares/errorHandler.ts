/**
 * @module middlewares/errorHandler
 * @description Penanganan error terpusat REST API dengan format JSON seragam.
 */

import type { NextFunction, Request, Response } from 'express';
import { sendError, ValidationIssue } from '../utils/response';
import { appendLog } from '../utils/fileHelper';

interface HttpError extends Error {
  statusCode?: number;
  status?: number;
  type?: string;
  code?: string;
  errors?: ValidationIssue[];
}

/**
 * Handler untuk route yang tidak terdaftar (404).
 */
export function notFoundHandler(req: Request, res: Response): Response {
  return sendError(res, 404, `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`);
}

/**
 * Global error handler middleware Express.
 */
export function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction
): Response {
  if (err.type === 'entity.parse.failed') {
    return sendError(res, 400, 'Format body JSON tidak valid');
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return sendError(res, 409, 'Data sudah terdaftar (duplikasi nilai unik)');
  }

  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return sendError(res, 409, 'Data tidak dapat dihapus karena masih terkait dengan data lain');
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode >= 500 ? 'Terjadi kesalahan pada server' : err.message;

  if (statusCode >= 500) {
    void appendLog('ERROR', `${req.method} ${req.originalUrl}`, err.message || 'Unknown error');
  }

  return sendError(res, statusCode, message, err.errors);
}
