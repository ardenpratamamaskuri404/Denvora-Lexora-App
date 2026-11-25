/**
 * @module middlewares/validate
 * @description Middleware validasi request body/query/params menggunakan Zod.
 */

import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../utils/response';

/**
 * Membuat middleware Express untuk memvalidasi bagian request tertentu terhadap skema Zod.
 */
export function validate<T>(
  schema: ZodSchema<T>,
  source: 'body' | 'query' | 'params' = 'body'
): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }));
      next(new AppError(400, 'Validasi input gagal', details));
      return;
    }
    (req as unknown as Record<string, unknown>)[source] = parsed.data;
    next();
  };
}
