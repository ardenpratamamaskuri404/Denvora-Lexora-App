/**
 * @module types/express
 * @description Tipe global pengguna terautentikasi pada Express Request.
 */

export type UserRole = 'admin' | 'petugas' | 'siswa';

export interface AuthUser {
  id: number;
  name: string;
  email: string | null;
  username: string;
  role: UserRole;
  member_code: string | null;
  class_name: string | null;
  phone: string | null;
  is_active: number;
  is_verified: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
