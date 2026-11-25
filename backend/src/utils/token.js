/**
 * @module utils/token
 * @description Penandatanganan dan verifikasi token sesi berbasis HMAC-SHA256
 * menggunakan modul crypto bawaan Node.js tanpa dependensi eksternal tambahan.
 */

const crypto = require('crypto');
const env = require('../config/env');

/**
 * Mengkodekan objek menjadi string base64url.
 * @param {object} obj Data payload
 * @returns {string}
 */
function toBase64Url(obj) {
  return Buffer.from(JSON.stringify(obj), 'utf8').toString('base64url');
}

/**
 * Membuat HMAC-SHA256 signature untuk payload token.
 * @param {string} encodedPayload Payload base64url
 * @returns {string} Signature base64url
 */
function createSignature(encodedPayload) {
  return crypto
    .createHmac('sha256', env.sessionSecret)
    .update(encodedPayload)
    .digest('base64url');
}

/**
 * Membuat token sesi bertanda tangan untuk pengguna terautentikasi.
 * @param {{id: number, username: string, role: string}} userData Data user minimal
 * @returns {string} Token format `<payload>.<signature>`
 */
function signSessionToken(userData) {
  const payload = {
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
 * @param {string} token Token dari cookie atau header Bearer
 * @returns {{id: number, username: string, role: string, exp: number}|null} Payload atau null jika tidak valid
 */
function verifySessionToken(token) {
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
    const decoded = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
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
 * @param {string|undefined} cookieHeader Nilai req.headers.cookie
 * @returns {Record<string, string>} Peta nama cookie ke nilainya
 */
function parseCookies(cookieHeader) {
  const result = {};
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

module.exports = { signSessionToken, verifySessionToken, parseCookies };
