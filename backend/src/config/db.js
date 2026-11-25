/**
 * @module config/db
 * @description Konfigurasi connection pool MySQL menggunakan mysql2/promise.
 */

const mysql = require('mysql2/promise');
const env = require('./env');

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

/**
 * Menguji koneksi ke database MySQL.
 * @returns {Promise<boolean>} True jika koneksi aktif.
 */
async function checkConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    return true;
  } finally {
    connection.release();
  }
}

module.exports = { pool, checkConnection };
