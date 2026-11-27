/**
 * @module config/db
 * @description Konfigurasi connection pool MySQL menggunakan mysql2/promise.
 */

import mysql, { type RowDataPacket } from 'mysql2/promise';
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

const DEFAULT_BOOK_META: Array<[string, string, string]> = [
  ['BK-001', '/covers/bk-001.svg', 'Panduan komprehensif perancangan algoritma, analisis kompleksitas waktu, rekursi, pohon, serta struktur data graf.'],
  ['BK-002', '/covers/bk-002.svg', 'Kisah inspiratif sepuluh anak Belitung yang menyalakan harapan melalui persahabatan, ketekunan, dan kecintaan pada ilmu.'],
  ['BK-003', '/covers/bk-003.svg', 'Kumpulan prinsip praktis menulis kode sumber yang bersih, mudah dibaca, terstruktur, dan aman dipelihara.'],
  ['BK-004', '/covers/bk-004.svg', 'Roman sejarah klasik Nusantara awal abad ke-20 mengenai martabat manusia dan kesadaran kebangsaan.'],
  ['BK-005', '/covers/bk-005.svg', 'Referensi utama mekanika, termodinamika, gelombang, dan elektromagnetisme beserta contoh soal konseptual.'],
  ['BK-006', '/covers/bk-006.svg', 'Ulasan kronologis perkembangan kerajaan maritim Nusantara hingga terbentuknya Indonesia modern.'],
];

/**
 * Memastikan kolom tambahan buku (`description`, `cover_url`) tersedia pada skema DB aktif.
 */
export async function ensureBooksMetadataColumns(): Promise<void> {
  const [cols] = await pool.query<RowDataPacket[]>(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'books'`,
    [env.db.database]
  );
  const names = new Set(cols.map((c) => String(c.COLUMN_NAME)));
  if (!names.has('description')) {
    await pool.query('ALTER TABLE books ADD COLUMN description TEXT NULL AFTER shelf_location');
  }
  if (!names.has('cover_url')) {
    await pool.query('ALTER TABLE books ADD COLUMN cover_url VARCHAR(255) NULL AFTER description');
  }
  for (const [code, cover, desc] of DEFAULT_BOOK_META) {
    await pool.execute(
      `UPDATE books
       SET cover_url = COALESCE(cover_url, ?),
           description = COALESCE(description, ?)
       WHERE book_code = ?`,
      [cover, desc, code]
    );
  }
}

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
