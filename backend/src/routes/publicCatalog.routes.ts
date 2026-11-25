/**
 * @module routes/publicCatalog.routes
 * @description Endpoint katalog baca-saja publik (/api/catalog/*) untuk pencarian live dari landing page.
 */

import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { bookQuerySchema } from '../validators/catalog.validator';
import * as catalogController from '../controllers/catalog.controller';

export const publicCatalogRouter = Router();

publicCatalogRouter.get('/categories', catalogController.listCategories);
publicCatalogRouter.get('/books', validate(bookQuerySchema, 'query'), catalogController.listBooks);
