/**
 * @module config/db
 * @description Konfigurasi connection pool MySQL menggunakan mysql2/promise.
 */

import mysql from 'mysql2/promise';
import { env } from './env';

export const pool = mysql.createPool({
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
 * @returns True jika koneksi aktif.
 */
export async function checkConnection(): Promise<boolean> {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    return true;
  } finally {
    connection.release();
  }
}
