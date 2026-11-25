/**
 * @module utils/fileHelper
 * @description Modul akses file lokal menggunakan fs/promises untuk logging aplikasi
 * dan ekspor laporan CSV (memenuhi kriteria kompetensi UKK PPsp 1.12).
 */

import fs from 'fs/promises';
import path from 'path';

const LOGS_DIR = path.resolve(__dirname, '../../logs');
const EXPORTS_DIR = path.resolve(__dirname, '../../exports');
const APP_LOG_PATH = path.join(LOGS_DIR, 'app.log');

export interface CsvColumn {
  key: string;
  label: string;
}

async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Menambahkan baris log aktivitas/error ke backend/logs/app.log.
 */
export async function appendLog(
  level: 'INFO' | 'WARN' | 'ERROR',
  context: string,
  message: string
): Promise<void> {
  try {
    await ensureDir(LOGS_DIR);
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [${level}] [${context}] ${message}\n`;
    await fs.appendFile(APP_LOG_PATH, line, 'utf8');
  } catch {
    // Logging file tidak boleh menghentikan respons utama aplikasi
  }
}

/**
 * Mengamankan nilai sel CSV dari formula injection dan pemisah koma/kutip.
 */
function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  let str = String(value);
  if (/^[=+\-@]/.test(str)) {
    str = `'${str}`;
  }
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Mengubah array objek menjadi string CSV menggunakan pemrosesan array.
 */
export function buildCsvContent(
  columns: CsvColumn[],
  rows: Array<Record<string, unknown>>
): string {
  const headerLine = columns.map((col) => escapeCsvCell(col.label)).join(',');
  const dataLines = rows.map((row) =>
    columns.map((col) => escapeCsvCell(row[col.key])).join(',')
  );
  return `\uFEFF${[headerLine, ...dataLines].join('\r\n')}\r\n`;
}

/**
 * Menyimpan file ekspor CSV ke folder backend/exports/ dan mengembalikan isi serta path-nya.
 */
export async function writeCsvExport(
  filename: string,
  columns: CsvColumn[],
  rows: Array<Record<string, unknown>>
): Promise<{ filePath: string; content: string }> {
  await ensureDir(EXPORTS_DIR);
  const safeName = path.basename(filename);
  const filePath = path.join(EXPORTS_DIR, safeName);
  const content = buildCsvContent(columns, rows);
  await fs.writeFile(filePath, content, 'utf8');
  return { filePath, content };
}
