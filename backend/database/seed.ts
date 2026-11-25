/**
 * @module database/seed
 * @description Menjalankan ulang skema database/perpustakaan.sql atau memverifikasi seed awal ke MySQL.
 */

import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';
import { env } from '../src/config/env';

async function runSeed(): Promise<void> {
  const sqlPath = path.resolve(__dirname, '../../database/schema.sql');
  const sql = await fs.readFile(sqlPath, 'utf8');

  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true,
  });

  try {
    await connection.query(sql);
    console.log('Seed database denvora_lexora berhasil dijalankan.');
  } finally {
    await connection.end();
  }
}

runSeed().catch((err) => {
  console.error('Gagal menjalankan seed database:', err instanceof Error ? err.message : err);
  process.exit(1);
});
