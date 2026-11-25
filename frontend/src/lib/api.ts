/**
 * @module lib/api
 * @description Klien HTTP terpusat untuk komunikasi dengan REST API backend Denvora Lexora.
 */

import type {
  ApiFieldError,
  ApiResponse,
  AuthUser,
  CatalogBookItem,
  OtpPurpose,
} from "@/types/auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
