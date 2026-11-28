/**
 * @module lib/api
 * @description Klien HTTP terpusat untuk komunikasi dengan REST API backend Denvora Lexora.
 */

import type {
  ApiFieldError,
  ApiResponse,
  AuthUser,
  CatalogBookItem,
  NotificationFeed,
  OtpPurpose,
} from "@/types/auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

/** Mengubah path asset (/uploads/... atau /covers/...) menjadi URL siap tampil. */
export function resolveBookCoverUrl(coverUrl?: string | null): string | null {
  if (!coverUrl) return null;
  if (coverUrl.startsWith("/uploads/")) return `${ASSET_BASE_URL}${coverUrl}`;
  return coverUrl;
}

/** Representasi error terstruktur yang dikembalikan oleh REST API. */
export class ApiRequestError extends Error {
  status: number;
  errors: ApiFieldError[];

  constructor(status: number, message: string, errors: ApiFieldError[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

/** Mengubah error API/validasi menjadi pesan ringkas yang mudah dipahami pengguna. */
export function formatApiError(err: unknown, fallback: string): string {
  if (!(err instanceof ApiRequestError)) return fallback;
  if (err.errors.length > 0) {
    const details = err.errors.map((item) => item.message).filter(Boolean).join(" · ");
    if (details && (err.message === "Validasi input gagal" || !err.message)) {
      return details;
    }
    return details ? `${err.message}: ${details}` : err.message;
  }
  return err.message || fallback;
}

/**
 * Mengirim permintaan HTTP terautentikasi cookie HttpOnly ke server backend lokal.
 * @param path Path endpoint relatif terhadap API_BASE_URL
 * @param options Konfigurasi fetch standar
 */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    throw new ApiRequestError(
      0,
      "Layanan server tidak dapat dijangkau. Pastikan server aplikasi aktif pada localhost."
    );
  }

  const payload = (await response.json().catch(() => ({
    success: false,
    message: "Format respons server tidak sesuai.",
  }))) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new ApiRequestError(
      response.status,
      payload.message || "Permintaan tidak dapat diproses.",
      payload.errors || []
    );
  }

  return payload;
}

export interface RegisterPayload {
  name: string;
  email: string;
  username: string;
  password: string;
  member_code: string;
  class_name?: string;
  phone?: string;
}

/** Mendaftarkan anggota siswa baru dan memicu pengiriman OTP verifikasi. */
export async function registerApi(payload: RegisterPayload) {
  return apiRequest<{ user: AuthUser; mailpit_url?: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Memvalidasi kredensial pengguna (username atau email beserta password). */
export async function loginApi(username: string, password: string) {
  return apiRequest<{ user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

/** Mengirim kode OTP 6 digit ke alamat email terdaftar melalui layanan surat lokal. */
export async function sendOtpApi(email: string, purpose: OtpPurpose) {
  return apiRequest<{ email: string; purpose: OtpPurpose; mailpit_url?: string }>(
    "/auth/otp/send",
    {
      method: "POST",
      body: JSON.stringify({ email, purpose }),
    }
  );
}

/** Memverifikasi kode OTP 6 digit untuk aktivasi akun atau pemulihan akses masuk. */
export async function verifyOtpApi(email: string, otp: string, purpose: OtpPurpose) {
  return apiRequest<{ user: AuthUser }>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ email, otp, purpose }),
  });
}

/** Mengambil profil sesi pengguna yang sedang aktif. */
export async function meApi() {
  return apiRequest<{ user: AuthUser }>("/auth/me", { method: "GET" });
}

/** Menghapus sesi aktif pengguna saat keluar dari sistem. */
export async function logoutApi() {
  return apiRequest<null>("/auth/logout", { method: "POST" });
}

/** Mencari buku katalog publik secara live berdasarkan kata kunci. */
export async function searchPublicBooksApi(search: string, limit = 5) {
  const qs = new URLSearchParams();
  if (search.trim()) qs.set("search", search.trim());
  qs.set("limit", String(limit));
  return apiRequest<CatalogBookItem[]>(`/catalog/books?${qs.toString()}`, {
    method: "GET",
  });
}

/** Memperbarui data profil akun milik pengguna yang sedang aktif. */
export async function updateProfileApi(payload: {
  name: string;
  email?: string | null;
  class_name?: string | null;
  phone?: string | null;
}) {
  return apiRequest<{ user: AuthUser }>("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** Mengubah password pengguna setelah memverifikasi password saat ini. */
export async function changePasswordApi(payload: {
  current_password: string;
  new_password: string;
}) {
  return apiRequest<null>("/auth/password", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** Mengambil umpan notifikasi real-time sesuai peran akun aktif. */
export async function fetchNotificationsApi() {
  return apiRequest<NotificationFeed>("/auth/notifications", { method: "GET" });
}

/** Menandai satu notifikasi sudah dibaca untuk akun aktif. */
export async function markNotificationReadApi(key: string) {
  return apiRequest<null>(`/auth/notifications/${encodeURIComponent(key)}/read`, {
    method: "PATCH",
  });
}

/** Menandai semua notifikasi aktif sudah dibaca. */
export async function markAllNotificationsReadApi() {
  return apiRequest<null>("/auth/notifications/read-all", { method: "PATCH" });
}

/** Menghapus / menyembunyikan satu notifikasi dari daftar akun aktif. */
export async function deleteNotificationApi(key: string) {
  return apiRequest<null>(`/auth/notifications/${encodeURIComponent(key)}`, {
    method: "DELETE",
  });
}

/** Membersihkan notifikasi yang sudah dibaca atau seluruh notifikasi aktif. */
export async function clearNotificationsApi(mode: "read" | "all") {
  return apiRequest<null>(`/auth/notifications?mode=${mode}`, {
    method: "DELETE",
  });
}
