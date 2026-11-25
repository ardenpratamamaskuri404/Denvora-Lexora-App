/**
 * @module routes/auth.routes
 * @description Routing autentikasi (/api/auth/*).
 */

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { loginSchema, registerSchema } from '../validators/auth.validator';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/logout', authMiddleware, authController.logout);
authRouter.get('/me', authMiddleware, authController.me);
