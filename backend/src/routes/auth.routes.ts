/**
 * @module routes/auth.routes
 * @description Routing autentikasi & OTP Mailpit (/api/auth/*).
 */

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  sendOtpSchema,
  updateProfileSchema,
  verifyOtpSchema,
} from '../validators/auth.validator';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/otp/send', validate(sendOtpSchema), authController.sendOtp);
authRouter.post('/otp/verify', validate(verifyOtpSchema), authController.verifyOtp);
authRouter.post('/logout', authMiddleware, authController.logout);
authRouter.get('/me', authMiddleware, authController.me);
authRouter.put('/profile', authMiddleware, validate(updateProfileSchema), authController.updateProfile);
authRouter.put('/password', authMiddleware, validate(changePasswordSchema), authController.changePassword);
authRouter.get('/notifications', authMiddleware, authController.listNotifications);
