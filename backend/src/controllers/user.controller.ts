/**
 * @module controllers/user.controller
 * @description Factory handler HTTP bersama untuk pengelolaan Anggota (siswa) dan Petugas.
 */

import type { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import * as userService from '../services/user.service';

/**
 * Membuat kumpulan handler controller terparameterisasi untuk role 'siswa' atau 'petugas'.
 */
export function createUserController(role: 'siswa' | 'petugas') {
  const label = role === 'siswa' ? 'Anggota' : 'Petugas';

  return {
    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const query = req.query as unknown as userService.UserQuery;
        const { items, meta } = await userService.listUsersByRole(role, query);
        sendSuccess(res, 200, `Daftar ${label.toLowerCase()} berhasil diambil`, items, meta);
      } catch (err) {
        next(err);
      }
    },

    async detail(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const user = await userService.getUserByIdAndRole(Number(req.params.id), role);
        sendSuccess(res, 200, `Detail ${label.toLowerCase()} berhasil diambil`, user);
      } catch (err) {
        next(err);
      }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const user = await userService.createUserByRole(role, req.body);
        sendSuccess(res, 201, `${label} berhasil ditambahkan`, user);
      } catch (err) {
        next(err);
      }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const user = await userService.updateUserByRole(Number(req.params.id), role, req.body);
        sendSuccess(res, 200, `Data ${label.toLowerCase()} berhasil diperbarui`, user);
      } catch (err) {
        next(err);
      }
    },

    async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        await userService.deleteUserByRole(Number(req.params.id), role);
        sendSuccess(res, 200, `${label} berhasil dihapus`);
      } catch (err) {
        next(err);
      }
    },
  };
}
