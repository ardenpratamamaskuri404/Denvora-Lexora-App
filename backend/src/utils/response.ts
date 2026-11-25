/**
 * @module utils/response
 * @description Helper standarisasi response JSON REST API dan error aplikasi.
 */

import type { Response } from 'express';

export interface ValidationIssue {
  field: string;
  message: string;
}

/**
 * Custom error dengan kode status HTTP dan detail validasi opsional.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors?: ValidationIssue[];

  constructor(statusCode: number, message: string, errors?: ValidationIssue[]) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Mengirim response sukses berformat standar.
 */
export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null,
  meta?: Record<string, unknown>
): Response {
  const payload: Record<string, unknown> = { success: true, message, data };
  if (meta !== undefined) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
}

/**
 * Mengirim response error berformat standar.
 */
export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: ValidationIssue[]
): Response {
  const payload: Record<string, unknown> = { success: false, message };
  if (errors && errors.length > 0) {
    payload.errors = errors;
  }
  return res.status(statusCode).json(payload);
}
