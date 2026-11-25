/**
 * @module services/report.service
 * @description Agregasi ringkasan statistik menggunakan array dan ekspor laporan CSV ke file lokal.
 */

import type { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { appendLog, writeCsvExport } from '../utils/fileHelper';
import { listAllTransactions, StaffTransactionQuery } from './transaction.service';

interface CategoryBookStat extends RowDataPacket {
  category_name: string;
  titles_count: number;
  copies_total: number;
  copies_available: number;
}

/**
 * Mengambil ringkasan statistik perpustakaan secara riil dari database.
 */
export async function getLibrarySummary(): Promise<{
  total_titles: number;
  total_copies: number;
  available_copies: number;
  active_borrows: number;
  overdue_borrows: number;
  total_members: number;
  total_staff: number;
  categories_breakdown: Array<{
    category_name: string;
    titles_count: number;
    copies_total: number;
    copies_available: number;
  }>;
}> {
  const [categoryStats] = await pool.execute<CategoryBookStat[]>(
    `SELECT c.name AS category_name,
            COUNT(b.id) AS titles_count,
            COALESCE(SUM(b.stock_total), 0) AS copies_total,
            COALESCE(SUM(b.stock_available), 0) AS copies_available
     FROM categories c
     LEFT JOIN books b ON b.category_id = c.id
     GROUP BY c.id, c.name
     ORDER BY c.name ASC`
  );

  // Agregasi array untuk menghitung total judul, total eksemplar, dan tersedia (PPsp 1.11)
  const bookTotals = categoryStats.reduce(
    (acc, item) => ({
      total_titles: acc.total_titles + Number(item.titles_count),
      total_copies: acc.total_copies + Number(item.copies_total),
      available_copies: acc.available_copies + Number(item.copies_available),
    }),
    { total_titles: 0, total_copies: 0, available_copies: 0 }
  );

  const [trxStats] = await pool.execute<RowDataPacket[]>(
    `SELECT
       SUM(CASE WHEN status = 'borrowed' THEN 1 ELSE 0 END) AS active_borrows,
       SUM(CASE WHEN status = 'borrowed' AND due_date < CURDATE() THEN 1 ELSE 0 END) AS overdue_borrows
     FROM transactions`
  );

  const [userStats] = await pool.execute<RowDataPacket[]>(
    `SELECT
       SUM(CASE WHEN role = 'siswa' AND is_active = 1 THEN 1 ELSE 0 END) AS total_members,
       SUM(CASE WHEN role = 'petugas' AND is_active = 1 THEN 1 ELSE 0 END) AS total_staff
     FROM users`
  );

  return {
    ...bookTotals,
    active_borrows: Number(trxStats[0].active_borrows || 0),
    overdue_borrows: Number(trxStats[0].overdue_borrows || 0),
    total_members: Number(userStats[0].total_members || 0),
    total_staff: Number(userStats[0].total_staff || 0),
    categories_breakdown: categoryStats.map((c) => ({
      category_name: c.category_name,
      titles_count: Number(c.titles_count),
      copies_total: Number(c.copies_total),
      copies_available: Number(c.copies_available),
    })),
  };
}

/**
 * Menghasilkan file CSV transaksi sesuai filter dan menyimpannya ke backend/exports/.
 */
export async function exportTransactionsCsv(
  query: Omit<StaffTransactionQuery, 'page' | 'limit'>
): Promise<{ filename: string; content: string; totalRows: number }> {
  const result = await listAllTransactions({
    ...query,
    page: 1,
    limit: 5000,
  });

  const rowsForCsv = result.items.map((trx) => ({
    transaction_code: trx.transaction_code,
    member_code: trx.member_code || '-',
    member_name: trx.member_name,
    class_name: trx.class_name || '-',
    book_code: trx.book_code,
    book_title: trx.book_title,
    borrow_date: trx.borrow_date,
    due_date: trx.due_date,
    return_date: trx.return_date || '-',
    status: trx.status === 'borrowed' ? 'Dipinjam' : 'Dikembalikan',
    overdue_info: trx.overdue_days > 0 ? `Terlambat ${trx.overdue_days} hari` : 'Tepat Waktu',
    processed_by: trx.processed_by_name || 'Mandiri (Siswa)',
    notes: trx.notes || '',
  }));

  const columns = [
    { key: 'transaction_code', label: 'Kode Transaksi' },
    { key: 'member_code', label: 'NIS / Kode Anggota' },
    { key: 'member_name', label: 'Nama Anggota' },
    { key: 'class_name', label: 'Kelas' },
    { key: 'book_code', label: 'Kode Buku' },
    { key: 'book_title', label: 'Judul Buku' },
    { key: 'borrow_date', label: 'Tanggal Pinjam' },
    { key: 'due_date', label: 'Jatuh Tempo' },
    { key: 'return_date', label: 'Tanggal Kembali' },
    { key: 'status', label: 'Status' },
    { key: 'overdue_info', label: 'Keterangan Keterlambatan' },
    { key: 'processed_by', label: 'Diproses Oleh' },
    { key: 'notes', label: 'Catatan' },
  ];

  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const filename = `laporan-transaksi-denvora-${stamp}.csv`;
  const { content } = await writeCsvExport(filename, columns, rowsForCsv);

  await appendLog('INFO', 'report.exportCsv', `Ekspor CSV (${rowsForCsv.length} baris): ${filename}`);

  return { filename, content, totalRows: rowsForCsv.length };
}
