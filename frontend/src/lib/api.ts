import type { ApiFieldError, ApiResponse, AuthUser, OtpPurpose } from "@/types/auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiRequestError extends Error {
  status: number;
  errors: ApiFieldError[];

  constructor(status: number, message: string, errors: ApiFieldError[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

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
      "Tidak dapat terhubung ke server backend (pastikan API berjalan di port 5000)."
    );
  }

  const payload = (await response.json().catch(() => ({
    success: false,
    message: "Respons server tidak valid.",
  }))) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new ApiRequestError(
      response.status,
      payload.message || "Terjadi kesalahan saat memproses permintaan.",
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

export async function registerApi(payload: RegisterPayload) {
  return apiRequest<{ user: AuthUser; mailpit_url?: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginApi(username: string, password: string) {
  return apiRequest<{ user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function sendOtpApi(email: string, purpose: OtpPurpose) {
  return apiRequest<{ email: string; purpose: OtpPurpose; mailpit_url?: string }>(
    "/auth/otp/send",
    {
      method: "POST",
      body: JSON.stringify({ email, purpose }),
    }
  );
}

export async function verifyOtpApi(email: string, otp: string, purpose: OtpPurpose) {
  return apiRequest<{ user: AuthUser }>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ email, otp, purpose }),
  });
}

export async function meApi() {
  return apiRequest<{ user: AuthUser }>("/auth/me", { method: "GET" });
}

export async function logoutApi() {
  return apiRequest<null>("/auth/logout", { method: "POST" });
}
