/**
 * @module middlewares/validate
 * @description Middleware validasi request body/query/params menggunakan Zod.
 */

const { AppError } = require('../utils/response');

/**
 * Membuat middleware Express untuk memvalidasi bagian request tertentu terhadap skema Zod.
 * @param {import('zod').ZodSchema} schema Skema Zod target
 * @param {'body'|'query'|'params'} [source='body'] Bagian request yang divalidasi
 * @returns {import('express').RequestHandler}
 */
function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }));
      return next(new AppError(400, 'Validasi input gagal', details));
    }
    req[source] = parsed.data;
    return next();
  };
}

module.exports = { validate };
