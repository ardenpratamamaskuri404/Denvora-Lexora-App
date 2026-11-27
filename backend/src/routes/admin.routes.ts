/**
 * @module routes/admin.routes
 * @description Routing kendali penuh Admin (/api/admin/*) sesuai SPK UKK + kelola Petugas.
 */

import { Router } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { idParamSchema } from '../validators/common.validator';
import {
  memberCreateSchema,
  memberUpdateSchema,
  staffCreateSchema,
  staffUpdateSchema,
  userQuerySchema,
} from '../validators/user.validator';
import { createUserController } from '../controllers/user.controller';
import { mountSharedStaffRoutes } from './sharedStaff.routes';

export const adminRouter = Router();
const memberController = createUserController('siswa');
const staffController = createUserController('petugas');

adminRouter.use(authMiddleware, requireRole('admin'));

mountSharedStaffRoutes(adminRouter, { allowDeleteCatalog: true });

// CRUD Kelola Anggota (Siswa)
adminRouter.get('/members', validate(userQuerySchema, 'query'), memberController.list);
adminRouter.get('/members/:id', validate(idParamSchema, 'params'), memberController.detail);
adminRouter.post('/members', validate(memberCreateSchema), memberController.create);
adminRouter.put(
  '/members/:id',
  validate(idParamSchema, 'params'),
  validate(memberUpdateSchema),
  memberController.update
);
adminRouter.delete('/members/:id', validate(idParamSchema, 'params'), memberController.remove);

// CRUD Kelola Petugas (RECOMMENDATION)
adminRouter.get('/staff', validate(userQuerySchema, 'query'), staffController.list);
adminRouter.get('/staff/:id', validate(idParamSchema, 'params'), staffController.detail);
adminRouter.post('/staff', validate(staffCreateSchema), staffController.create);
adminRouter.put(
  '/staff/:id',
  validate(idParamSchema, 'params'),
  validate(staffUpdateSchema),
  staffController.update
);
adminRouter.delete('/staff/:id', validate(idParamSchema, 'params'), staffController.remove);
