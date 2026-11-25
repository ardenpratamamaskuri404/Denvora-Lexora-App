/**
 * @module utils/token
 * @description Penandatanganan dan verifikasi token sesi berbasis HMAC-SHA256
 * menggunakan modul crypto bawaan Node.js tanpa dependensi eksternal tambahan.
 */

import crypto from 'crypto';
import { env } from '../config/env';
import type { UserRole } from '../types/express';

export interface SessionPayload {
  id: number;
  username: string;
  role: UserRole;
  exp: number;
}

function toBase64Url(obj: SessionPayload): string {
  return Buffer.from(JSON.stringify(obj), 'utf8').toString('base64url');
}

function createSignature(encodedPayload: string): string {
  return crypto
    .createHmac('sha256', env.sessionSecret)
    .update(encodedPayload)
    .digest('base64url');
}

/**
 * Membuat token sesi bertanda tangan untuk pengguna terautentikasi.
 */
export function signSessionToken(userData: {
  id: number;
  username: string;
  role: UserRole;
}): string {
  const payload: SessionPayload = {
    id: userData.id,
    username: userData.username,
    role: userData.role,
    exp: Date.now() + env.sessionTtlMs,
  };
  const encoded = toBase64Url(payload);
  const sig = createSignature(encoded);
  return `${encoded}.${sig}`;
}

/**
 * Memverifikasi keaslian dan masa berlaku token sesi.
 */
export function verifySessionToken(token: string | null): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encoded, providedSig] = parts;
  const expectedSig = createSignature(encoded);

  const a = Buffer.from(providedSig, 'utf8');
  const b = Buffer.from(expectedSig, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8')
    ) as SessionPayload;
    if (!decoded || typeof decoded.exp !== 'number' || decoded.exp < Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Mem-parsing header Cookie HTTP secara ringan tanpa dependensi tambahan.
 */
export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  for (const pair of cookieHeader.split(';')) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    result[key] = decodeURIComponent(val);
  }
  return result;
}
