/**
 * @module utils/response
 * @description Helper standarisasi response JSON REST API dan error aplikasi.
 */

/**
 * Custom error dengan kode status HTTP dan detail validasi opsional.
 */
class AppError extends Error {
  /**
   * @param {number} statusCode Kode HTTP (400, 401, 403, 404, 409, dll.)
   * @param {string} message Pesan kesalahan ramah pengguna
   * @param {Array<{field: string, message: string}>} [errors] Daftar detail error per field
   */
  constructor(statusCode, message, errors = undefined) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Mengirim response sukses berformat standar.
 * @param {import('express').Response} res Express response
 * @param {number} statusCode HTTP status code
 * @param {string} message Pesan ringkas
 * @param {unknown} [data=null] Payload data
 * @param {object} [meta] Metadata paginasi opsional
 */
function sendSuccess(res, statusCode, message, data = null, meta = undefined) {
  const payload = { success: true, message, data };
  if (meta !== undefined) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
}

/**
 * Mengirim response error berformat standar.
 * @param {import('express').Response} res Express response
 * @param {number} statusCode HTTP status code
 * @param {string} message Pesan error
 * @param {Array<{field: string, message: string}>} [errors] Detail validasi
 */
function sendError(res, statusCode, message, errors = undefined) {
  const payload = { success: false, message };
  if (errors && errors.length > 0) {
    payload.errors = errors;
  }
  return res.status(statusCode).json(payload);
}

module.exports = { AppError, sendSuccess, sendError };
