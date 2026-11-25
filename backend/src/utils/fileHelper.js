/**
 * @module utils/fileHelper
 * @description Modul akses file lokal menggunakan fs/promises untuk logging aplikasi
 * dan ekspor laporan CSV (memenuhi kriteria kompetensi UKK PPsp 1.12).
 */

const fs = require('fs/promises');
const path = require('path');

const LOGS_DIR = path.resolve(__dirname, '../../logs');
const EXPORTS_DIR = path.resolve(__dirname, '../../exports');
const APP_LOG_PATH = path.join(LOGS_DIR, 'app.log');

/**
 * Memastikan direktori target tersedia sebelum menulis file.
 * @param {string} dirPath Path direktori
 */
async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Menambahkan baris log aktivitas/error ke backend/logs/app.log.
 * @param {'INFO'|'WARN'|'ERROR'} level Level log
 * @param {string} context Modul/aksi sumber log
 * @param {string} message Pesan log
 */
async function appendLog(level, context, message) {
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
 * Mengamankan nilai sel CSV agar aman dari formula injection dan pemisah koma/kutip.
 * @param {unknown} value Nilai kolom
 * @returns {string} Nilai terformat CSV
 */
function escapeCsvCell(value) {
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
 * @param {Array<{key: string, label: string}>} columns Definisi kolom header
 * @param {Array<Record<string, unknown>>} rows Data baris
 * @returns {string} Konten CSV dengan UTF-8 BOM agar terbaca rapi di Excel
 */
function buildCsvContent(columns, rows) {
  const headerLine = columns.map((col) => escapeCsvCell(col.label)).join(',');
  const dataLines = rows.map((row) =>
    columns.map((col) => escapeCsvCell(row[col.key])).join(',')
  );
  return `\uFEFF${[headerLine, ...dataLines].join('\r\n')}\r\n`;
}

/**
 * Menyimpan file ekspor CSV ke folder backend/exports/ dan mengembalikan isi serta path-nya.
 * @param {string} filename Nama file tujuan (mis. laporan-transaksi-20261125.csv)
 * @param {Array<{key: string, label: string}>} columns Definisi kolom
 * @param {Array<Record<string, unknown>>} rows Baris data
 * @returns {Promise<{filePath: string, content: string}>}
 */
async function writeCsvExport(filename, columns, rows) {
  await ensureDir(EXPORTS_DIR);
  const safeName = path.basename(filename);
  const filePath = path.join(EXPORTS_DIR, safeName);
  const content = buildCsvContent(columns, rows);
  await fs.writeFile(filePath, content, 'utf8');
  return { filePath, content };
}

module.exports = { appendLog, buildCsvContent, writeCsvExport };
