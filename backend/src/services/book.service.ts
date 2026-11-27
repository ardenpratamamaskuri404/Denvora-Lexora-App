/**
 * @module services/book.service
 * @description Logika bisnis katalog buku, pencarian kondisi tertentu, dan penjagaan stok.
 */

import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { AppError } from '../utils/response';

export interface BookRow extends RowDataPacket {
  id: number;
  book_code: string;
  title: string;
  author: string;
  publisher: string;
  publication_year: number;
  category_id: number;
  category_name: string;
  stock_total: number;
  stock_available: number;
  shelf_location: string | null;
  description: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookQuery {
  search: string;
  category_id?: number;
  availability: 'all' | 'available' | 'empty';
  page: number;
  limit: number;
}

export interface BookInput {
  book_code: string;
  title: string;
  author: string;
  publisher: string;
  publication_year: number;
  category_id: number;
  stock_total: number;
  shelf_location?: string | null;
  description?: string | null;
  cover_url?: string | null;
}

/**
 * Mengambil daftar buku dengan filter kondisi tertentu dan paginasi.
 */
export async function listBooks(query: BookQuery): Promise<{
  items: BookRow[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const conditions: string[] = [];
  const params: Array<string | number> = [];

  if (query.search) {
    conditions.push(
      '(b.title LIKE ? OR b.author LIKE ? OR b.book_code LIKE ? OR b.publisher LIKE ? OR b.shelf_location LIKE ?)'
    );
    const kw = `%${query.search}%`;
    params.push(kw, kw, kw, kw, kw);
  }

  if (query.category_id) {
    conditions.push('b.category_id = ?');
    params.push(query.category_id);
  }

  if (query.availability === 'available') {
    conditions.push('b.stock_available > 0');
  } else if (query.availability === 'empty') {
    conditions.push('b.stock_available = 0');
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (query.page - 1) * query.limit;

  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM books b ${whereClause}`,
    params
  );
  const total = Number(countRows[0].total);

  const [rows] = await pool.query<BookRow[]>(
    `SELECT b.id, b.book_code, b.title, b.author, b.publisher, b.publication_year,
            b.category_id, c.name AS category_name, b.stock_total, b.stock_available,
            b.shelf_location, b.description, b.cover_url, b.created_at, b.updated_at
     FROM books b
     INNER JOIN categories c ON c.id = b.category_id
     ${whereClause}
     ORDER BY b.id DESC
     LIMIT ? OFFSET ?`,
    [...params, query.limit, offset]
  );

  return {
    items: rows,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
}

/**
 * Mengambil detail satu buku berdasarkan ID.
 */
export async function getBookById(id: number): Promise<BookRow> {
  const [rows] = await pool.execute<BookRow[]>(
    `SELECT b.id, b.book_code, b.title, b.author, b.publisher, b.publication_year,
            b.category_id, c.name AS category_name, b.stock_total, b.stock_available,
            b.shelf_location, b.description, b.cover_url, b.created_at, b.updated_at
     FROM books b
     INNER JOIN categories c ON c.id = b.category_id
     WHERE b.id = ? LIMIT 1`,
    [id]
  );
  if (rows.length === 0) {
    throw new AppError(404, 'Buku tidak ditemukan');
  }
  return rows[0];
}

async function ensureCategoryExists(categoryId: number): Promise<void> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT id FROM categories WHERE id = ? LIMIT 1',
    [categoryId]
  );
  if (rows.length === 0) {
    throw new AppError(400, 'Kategori yang dipilih tidak ditemukan');
  }
}

/**
 * Menambahkan buku baru ke katalog.
 */
export async function createBook(input: BookInput): Promise<BookRow> {
  await ensureCategoryExists(input.category_id);

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO books (book_code, title, author, publisher, publication_year, category_id, stock_total, stock_available, shelf_location, description, cover_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.book_code,
      input.title,
      input.author,
      input.publisher,
      input.publication_year,
      input.category_id,
      input.stock_total,
      input.stock_total,
      input.shelf_location || null,
      input.description || null,
      input.cover_url || null,
    ]
  );

  return getBookById(result.insertId);
}

/**
 * Memperbarui data buku dengan menjaga selisih buku yang sedang dipinjam aktif.
 */
export async function updateBook(id: number, input: BookInput): Promise<BookRow> {
  const existing = await getBookById(id);
  await ensureCategoryExists(input.category_id);

  const activeBorrowed = existing.stock_total - existing.stock_available;
  if (input.stock_total < activeBorrowed) {
    throw new AppError(
      400,
      `Stok total tidak boleh kurang dari jumlah buku yang sedang dipinjam (${activeBorrowed})`
    );
  }

  const nextAvailable = input.stock_total - activeBorrowed;
  await pool.execute<ResultSetHeader>(
    `UPDATE books
     SET book_code = ?, title = ?, author = ?, publisher = ?, publication_year = ?,
         category_id = ?, stock_total = ?, stock_available = ?, shelf_location = ?,
         description = ?, cover_url = ?
     WHERE id = ?`,
    [
      input.book_code,
      input.title,
      input.author,
      input.publisher,
      input.publication_year,
      input.category_id,
      input.stock_total,
      nextAvailable,
      input.shelf_location || null,
      input.description ?? existing.description ?? null,
      input.cover_url !== undefined ? input.cover_url || null : existing.cover_url,
      id,
    ]
  );

  return getBookById(id);
}

/**
 * Menghapus buku (ditolak jika masih memiliki pinjaman aktif atau riwayat transaksi).
 */
export async function deleteBook(id: number): Promise<void> {
  await getBookById(id);

  const [activeRows] = await pool.execute<RowDataPacket[]>(
    "SELECT COUNT(*) AS total FROM transactions WHERE book_id = ? AND status = 'borrowed'",
    [id]
  );
  if (Number(activeRows[0].total) > 0) {
    throw new AppError(409, 'Buku tidak dapat dihapus karena sedang dipinjam aktif');
  }

  const [historyRows] = await pool.execute<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM transactions WHERE book_id = ?',
    [id]
  );
  if (Number(historyRows[0].total) > 0) {
    throw new AppError(
      409,
      'Buku memiliki riwayat transaksi sehingga tidak dapat dihapus permanen'
    );
  }

  await pool.execute<ResultSetHeader>('DELETE FROM books WHERE id = ?', [id]);
}
