/**
 * @module lib/portalApi
 * @description Klien REST API terparameterisasi untuk operasi Dashboard Siswa, Petugas, dan Admin.
 */

import { API_BASE_URL, ApiRequestError, apiRequest } from "@/lib/api";
import type { CatalogBookItem, PaginationMeta } from "@/types/auth";
import type {
  BookListQuery,
  BookPayload,
  CategoryItem,
  LibrarySummary,
  PortalMemberItem,
  PortalRolePrefix,
  StaffCreateTransactionPayload,
  StaffRolePrefix,
  StaffUpdateTransactionPayload,
  TransactionItem,
  TransactionListQuery,
  UserManagePayload,
  UserResourceKind,
} from "@/types/library";

function toQueryString(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== "") {
      sp.set(key, String(val));
    }
  });
  const str = sp.toString();
  return str ? `?${str}` : "";
}

/** Mengambil daftar kategori buku berdasarkan prefix peran. */
export async function fetchCategoriesApi(prefix: PortalRolePrefix): Promise<CategoryItem[]> {
  const res = await apiRequest<CategoryItem[]>(`${prefix}/categories`);
  return res.data || [];
}

/** Menambahkan kategori baru (Admin/Petugas). */
export async function createCategoryApi(prefix: StaffRolePrefix, name: string) {
  return apiRequest<CategoryItem>(`${prefix}/categories`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

/** Memperbarui nama kategori (Admin/Petugas). */
export async function updateCategoryApi(prefix: StaffRolePrefix, id: number, name: string) {
  return apiRequest<CategoryItem>(`${prefix}/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}

/** Menghapus kategori (khusus Admin). */
export async function deleteCategoryApi(id: number) {
  return apiRequest<null>(`/admin/categories/${id}`, { method: "DELETE" });
}

/** Mengunggah gambar cover buku ke penyimpanan lokal backend (offline localhost). */
export async function uploadBookCoverApi(
  prefix: StaffRolePrefix,
  filename: string,
  dataUrl: string
) {
  return apiRequest<{ cover_url: string }>(`${prefix}/books/cover`, {
    method: "POST",
    body: JSON.stringify({ filename, data_url: dataUrl }),
  });
}

/** Mengambil daftar buku terpaginasi beserta filter pencarian kondisi tertentu. */
export async function fetchBooksApi(
  prefix: PortalRolePrefix,
  query: BookListQuery
): Promise<{ items: CatalogBookItem[]; meta?: PaginationMeta }> {
  const qs = toQueryString({
    search: query.search,
    category_id: query.category_id,
    availability: query.availability,
    page: query.page ?? 1,
    limit: query.limit ?? 10,
  });
  const res = await apiRequest<CatalogBookItem[]>(`${prefix}/books${qs}`);
  return { items: res.data || [], meta: res.meta };
}

/** Menambahkan buku baru ke katalog (Admin/Petugas). */
export async function createBookApi(prefix: StaffRolePrefix, payload: BookPayload) {
  return apiRequest<CatalogBookItem>(`${prefix}/books`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Memperbarui data buku yang sudah ada (Admin/Petugas). */
export async function updateBookApi(prefix: StaffRolePrefix, id: number, payload: BookPayload) {
  return apiRequest<CatalogBookItem>(`${prefix}/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** Menghapus buku dari katalog (khusus Admin). */
export async function deleteBookApi(id: number) {
  return apiRequest<null>(`/admin/books/${id}`, { method: "DELETE" });
}

/** Mengambil riwayat peminjaman milik siswa yang sedang masuk. */
export async function fetchMyTransactionsApi(
  status: "all" | "borrowed" | "returned" = "all"
): Promise<TransactionItem[]> {
  const res = await apiRequest<TransactionItem[]>(
    `/siswa/transactions${toQueryString({ status })}`
  );
  return res.data || [];
}

/** Mengajukan peminjaman buku baru oleh siswa. */
export async function borrowBySiswaApi(bookId: number, notes?: string) {
  return apiRequest<TransactionItem>("/siswa/transactions/borrow", {
    method: "POST",
    body: JSON.stringify({ book_id: bookId, notes: notes || undefined }),
  });
}

/** Mengembalikan buku yang dipinjam oleh siswa. */
export async function returnBySiswaApi(transactionId: number) {
  return apiRequest<TransactionItem>(`/siswa/transactions/${transactionId}/return`, {
    method: "PATCH",
  });
}

/** Mengambil seluruh transaksi perpustakaan terpaginasi dengan filter (Admin/Petugas). */
export async function fetchAllTransactionsApi(
  prefix: StaffRolePrefix,
  query: TransactionListQuery
): Promise<{ items: TransactionItem[]; meta?: PaginationMeta }> {
  const qs = toQueryString({
    search: query.search,
    status: query.status,
    date_from: query.date_from,
    date_to: query.date_to,
    overdue_only: query.overdue_only,
    page: query.page ?? 1,
    limit: query.limit ?? 10,
  });
  const res = await apiRequest<TransactionItem[]>(`${prefix}/transactions${qs}`);
  return { items: res.data || [], meta: res.meta };
}

/** Mencatat transaksi peminjaman baru oleh Petugas/Admin. */
export async function createStaffTransactionApi(
  prefix: StaffRolePrefix,
  payload: StaffCreateTransactionPayload
) {
  return apiRequest<TransactionItem>(`${prefix}/transactions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Memperbarui status pengembalian atau jatuh tempo transaksi (Admin/Petugas). */
export async function updateStaffTransactionApi(
  prefix: StaffRolePrefix,
  id: number,
  payload: StaffUpdateTransactionPayload
) {
  return apiRequest<TransactionItem>(`${prefix}/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** Menghapus catatan transaksi (Admin/Petugas). */
export async function deleteStaffTransactionApi(prefix: StaffRolePrefix, id: number) {
  return apiRequest<null>(`${prefix}/transactions/${id}`, { method: "DELETE" });
}

/** Mengambil daftar Anggota (`members`) atau Staf (`staff`). */
export async function fetchUsersApi(
  prefix: StaffRolePrefix,
  kind: UserResourceKind,
  query: { search?: string; is_active?: "all" | "1" | "0"; page?: number; limit?: number }
): Promise<{ items: PortalMemberItem[]; meta?: PaginationMeta }> {
  const qs = toQueryString({
    search: query.search,
    is_active: query.is_active ?? "all",
    page: query.page ?? 1,
    limit: query.limit ?? 10,
  });
  const res = await apiRequest<PortalMemberItem[]>(`${prefix}/${kind}${qs}`);
  return { items: res.data || [], meta: res.meta };
}

/** Membuat akun Anggota atau Staf baru (khusus Admin). */
export async function createUserApi(kind: UserResourceKind, payload: UserManagePayload) {
  return apiRequest<PortalMemberItem>(`/admin/${kind}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Memperbarui data Anggota atau Staf (khusus Admin). */
export async function updateUserApi(
  kind: UserResourceKind,
  id: number,
  payload: UserManagePayload
) {
  return apiRequest<PortalMemberItem>(`/admin/${kind}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** Menghapus akun Anggota atau Staf (khusus Admin). */
export async function deleteUserApi(kind: UserResourceKind, id: number) {
  return apiRequest<null>(`/admin/${kind}/${id}`, { method: "DELETE" });
}

/** Mengambil ringkasan statistik perpustakaan untuk dashboard laporan (Admin/Petugas). */
export async function fetchReportSummaryApi(prefix: StaffRolePrefix): Promise<LibrarySummary> {
  const res = await apiRequest<LibrarySummary>(`${prefix}/reports/summary`);
  if (!res.data) {
    throw new ApiRequestError(500, "Data ringkasan laporan tidak tersedia.");
  }
  return res.data;
}

/** Mengunduh laporan transaksi dalam format CSV dengan cookie autentikasi aktif. */
export async function downloadTransactionsCsvApi(
  prefix: StaffRolePrefix,
  query: Omit<TransactionListQuery, "page" | "limit">
): Promise<void> {
  const qs = toQueryString({
    search: query.search,
    status: query.status,
    date_from: query.date_from,
    date_to: query.date_to,
    overdue_only: query.overdue_only,
  });
  const res = await fetch(`${API_BASE_URL}${prefix}/reports/transactions/export${qs}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new ApiRequestError(res.status, "Gagal mengekspor laporan CSV.");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  const dt = new Date();
  const stamp = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  anchor.download = `laporan-transaksi-${stamp}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
