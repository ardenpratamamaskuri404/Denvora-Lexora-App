/**
 * @module routes/sharedStaff.routes
 * @description Registrasi route bersama untuk namespace /api/petugas/* dan /api/admin/*.
 */

import type { Router } from 'express';
import { validate } from '../middlewares/validate';
import { idParamSchema } from '../validators/common.validator';
import {
  bookBodySchema,
  bookQuerySchema,
  categorySchema,
  coverUploadSchema,
} from '../validators/catalog.validator';
import {
  staffCreateTransactionSchema,
  staffTransactionQuerySchema,
  staffUpdateTransactionSchema,
} from '../validators/transaction.validator';
import * as catalogController from '../controllers/catalog.controller';
import * as transactionController from '../controllers/transaction.controller';
import * as reportController from '../controllers/report.controller';

/**
 * Memasang route katalog, transaksi, dan laporan pada router Admin atau Petugas.
 */
export function mountSharedStaffRoutes(
  router: Router,
  options: { allowDeleteCatalog: boolean }
): void {
  // Categories
  router.get('/categories', catalogController.listCategories);
  router.post('/categories', validate(categorySchema), catalogController.createCategory);
  router.put(
    '/categories/:id',
    validate(idParamSchema, 'params'),
    validate(categorySchema),
    catalogController.updateCategory
  );
  if (options.allowDeleteCatalog) {
    router.delete(
      '/categories/:id',
      validate(idParamSchema, 'params'),
      catalogController.deleteCategory
    );
  }

  // Books
  router.get('/books', validate(bookQuerySchema, 'query'), catalogController.listBooks);
  router.post('/books/cover', validate(coverUploadSchema), catalogController.uploadBookCover);
  router.get('/books/:id', validate(idParamSchema, 'params'), catalogController.getBook);
  router.post('/books', validate(bookBodySchema), catalogController.createBook);
  router.put(
    '/books/:id',
    validate(idParamSchema, 'params'),
    validate(bookBodySchema),
    catalogController.updateBook
  );
  if (options.allowDeleteCatalog) {
    router.delete(
      '/books/:id',
      validate(idParamSchema, 'params'),
      catalogController.deleteBook
    );
  }

  // Transactions CRUD
  router.get(
    '/transactions',
    validate(staffTransactionQuerySchema, 'query'),
    transactionController.listAllTransactions
  );
  router.get(
    '/transactions/:id',
    validate(idParamSchema, 'params'),
    transactionController.getTransaction
  );
  router.post(
    '/transactions',
    validate(staffCreateTransactionSchema),
    transactionController.createTransactionByStaff
  );
  router.put(
    '/transactions/:id',
    validate(idParamSchema, 'params'),
    validate(staffUpdateTransactionSchema),
    transactionController.updateTransactionByStaff
  );
  router.delete(
    '/transactions/:id',
    validate(idParamSchema, 'params'),
    transactionController.deleteTransactionByStaff
  );

  // Reports & CSV Export (PPsp 1.12)
  router.get('/reports/summary', reportController.getSummary);
  router.get(
    '/reports/transactions/export',
    validate(staffTransactionQuerySchema, 'query'),
    reportController.exportTransactionsCsv
  );
}
