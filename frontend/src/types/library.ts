/**
 * @module types/library
 * @description Definisi tipe katalog, transaksi peminjaman, keanggotaan, dan laporan perpustakaan.
 */

import type { AuthUser, CatalogBookItem } from "@/types/auth";

export type StaffRolePrefix = "/admin" | "/petugas";
export type PortalRolePrefix = StaffRolePrefix | "/siswa";
export type UserResourceKind = "members" | "staff";

export interface CategoryItem {
  id: number;
  name: string;
  created_at?: string;
}

export interface TransactionItem {
  id: number;
  transaction_code: string;
  user_id: number;
  member_name: string;
  member_code: string | null;
  class_name: string | null;
  book_id: number;
  book_code: string;
  book_title: string;
  processed_by: number | null;
  processed_by_name: string | null;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: "borrowed" | "returned";
  notes: string | null;
  is_overdue: boolean;
  overdue_days: number;
}

export interface CategoryStatItem {
  category_name: string;
  titles_count: number;
  copies_total: number;
  copies_available: number;
}

export interface LibrarySummary {
  total_titles: number;
  total_copies: number;
  available_copies: number;
  active_borrows: number;
  overdue_borrows: number;
  total_members: number;
  total_staff: number;
  categories_breakdown: CategoryStatItem[];
}

export interface BookPayload {
  book_code: string;
  title: string;
  author: string;
  publisher: string;
  publication_year: number;
  category_id: number;
  stock_total: number;
  shelf_location?: string | null;
}

export interface BookListQuery {
  search?: string;
  category_id?: number;
  availability?: "all" | "available" | "empty";
  page?: number;
  limit?: number;
}

export interface TransactionListQuery {
  search?: string;
  status?: "all" | "borrowed" | "returned";
  date_from?: string;
  date_to?: string;
  overdue_only?: "true" | "false";
  page?: number;
  limit?: number;
}

export interface StaffCreateTransactionPayload {
  user_id: number;
  book_id: number;
  borrow_date?: string;
  due_date?: string;
  notes?: string | null;
}

export interface StaffUpdateTransactionPayload {
  status?: "borrowed" | "returned";
  due_date?: string;
  return_date?: string | null;
  notes?: string | null;
}

export interface UserManagePayload {
  name: string;
  email?: string | null;
  username: string;
  password?: string;
  member_code?: string;
  class_name?: string | null;
  phone?: string | null;
  is_active: number;
}

export type PortalMemberItem = AuthUser;
export type PortalBookItem = CatalogBookItem;
