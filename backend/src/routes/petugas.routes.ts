/**
 * @module routes/petugas.routes
 * @description Routing operasional Petugas (/api/petugas/* — RECOMMENDATION).
 */

import { Router } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { idParamSchema } from '../validators/common.validator';
import { userQuerySchema } from '../validators/user.validator';
import { createUserController } from '../controllers/user.controller';
import { mountSharedStaffRoutes } from './sharedStaff.routes';

export const petugasRouter = Router();
const memberController = createUserController('siswa');

petugasRouter.use(authMiddleware, requireRole('petugas'));

mountSharedStaffRoutes(petugasRouter, { allowDeleteCatalog: false });

// Petugas hanya memiliki akses lihat (read-only) daftar anggota
petugasRouter.get('/members', validate(userQuerySchema, 'query'), memberController.list);
petugasRouter.get('/members/:id', validate(idParamSchema, 'params'), memberController.detail);
