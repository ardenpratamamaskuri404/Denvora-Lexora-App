export type UserRole = "admin" | "petugas" | "siswa";

export type OtpPurpose = "register" | "login";

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

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiFieldError[];
}

export const ROLE_DASHBOARD_PATH: Record<UserRole, string> = {
  admin: "/admin",
  petugas: "/petugas",
  siswa: "/siswa",
};

export function getDashboardPath(role: UserRole): string {
  return ROLE_DASHBOARD_PATH[role] || "/siswa";
}
