/**
 * @module middlewares/errorHandler
 * @description Penanganan error terpusat REST API dengan format JSON seragam.
 */

const { sendError } = require('../utils/response');
const { appendLog } = require('../utils/fileHelper');

/**
 * Handler untuk route yang tidak terdaftar (404).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function notFoundHandler(req, res) {
  return sendError(res, 404, `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`);
}

/**
 * Global error handler middleware Express.
 * @param {Error & {statusCode?: number, code?: string, errors?: Array}} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
async function errorHandler(err, req, res, _next) {
  if (err.code === 'ER_DUP_ENTRY') {
    return sendError(res, 409, 'Data sudah terdaftar (duplikasi nilai unik)');
  }

  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return sendError(res, 409, 'Data tidak dapat dihapus karena masih terkait dengan data lain');
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode >= 500 ? 'Terjadi kesalahan pada server' : err.message;

  if (statusCode >= 500) {
    await appendLog('ERROR', `${req.method} ${req.originalUrl}`, err.message || 'Unknown error');
  }

  return sendError(res, statusCode, message, err.errors);
}

module.exports = { notFoundHandler, errorHandler };
