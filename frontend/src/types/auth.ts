/**
 * @module types/auth
 * @description Definisi tipe pengguna terautentikasi, katalog ringkas, dan pembantu rute peran.
 */

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

export interface CatalogBookItem {
  id: number;
  book_code: string;
  title: string;
  author: string;
  publisher: string;
  publication_year: number;
  category_id: number;
  category_name: string;
  stock_total: number;
  stock_available: number;
  shelf_location: string | null;
  description?: string | null;
  cover_url?: string | null;
}

export interface PortalNotificationItem {
  id: string;
  level: "danger" | "warning" | "info";
  title: string;
  message: string;
  targetTab: string;
}

export interface NotificationFeed {
  unreadCount: number;
  items: PortalNotificationItem[];
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: ApiFieldError[];
}

export const ROLE_DASHBOARD_PATH: Record<UserRole, string> = {
  admin: "/admin",
  petugas: "/petugas",
  siswa: "/siswa",
};

/** Mengembalikan path halaman dashboard sesuai peran pengguna. */
export function getDashboardPath(role: UserRole): string {
  return ROLE_DASHBOARD_PATH[role] || "/siswa";
}
