/**
 * @module routes/siswa.routes
 * @description Routing khusus peran Siswa (/api/siswa/*) sesuai flowmap dan hak akses UKK.
 */

import { Router } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { idParamSchema } from '../validators/common.validator';
import { bookQuerySchema } from '../validators/catalog.validator';
import {
  siswaBorrowSchema,
  siswaTransactionQuerySchema,
} from '../validators/transaction.validator';
import * as catalogController from '../controllers/catalog.controller';
import * as transactionController from '../controllers/transaction.controller';

export const siswaRouter = Router();

siswaRouter.use(authMiddleware, requireRole('siswa'));

siswaRouter.get('/categories', catalogController.listCategories);
siswaRouter.get('/books', validate(bookQuerySchema, 'query'), catalogController.listBooks);
siswaRouter.get('/books/:id', validate(idParamSchema, 'params'), catalogController.getBook);

siswaRouter.get(
  '/transactions',
  validate(siswaTransactionQuerySchema, 'query'),
  transactionController.listMyTransactions
);
siswaRouter.post(
  '/transactions/borrow',
  validate(siswaBorrowSchema),
  transactionController.borrowBySiswa
);
siswaRouter.patch(
  '/transactions/:id/return',
  validate(idParamSchema, 'params'),
  transactionController.returnBySiswa
);
