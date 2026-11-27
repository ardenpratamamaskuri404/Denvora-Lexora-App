/**
 * @module services/category.service
 * @description Logika bisnis CRUD kategori buku.
 */

import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { AppError } from '../utils/response';

export interface CategoryRow extends RowDataPacket {
  id: number;
  name: string;
  created_at: string;
  book_count?: number;
}

/**
 * Mengambil seluruh daftar kategori beserta jumlah buku di tiap kategori.
 */
export async function listCategories(): Promise<CategoryRow[]> {
  const [rows] = await pool.execute<CategoryRow[]>(
    `SELECT c.id, c.name, c.created_at, COUNT(b.id) AS book_count
     FROM categories c
     LEFT JOIN books b ON b.category_id = c.id
     GROUP BY c.id, c.name, c.created_at
     ORDER BY c.name ASC`
  );
  return rows;
}

/**
 * Menambahkan kategori buku baru.
 */
export async function createCategory(name: string): Promise<CategoryRow> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO categories (name) VALUES (?)',
    [name]
  );
  const [rows] = await pool.execute<CategoryRow[]>(
    'SELECT id, name, created_at FROM categories WHERE id = ? LIMIT 1',
    [result.insertId]
  );
  return rows[0];
}

/**
 * Memperbarui nama kategori berdasarkan ID.
 */
export async function updateCategory(id: number, name: string): Promise<CategoryRow> {
  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE categories SET name = ? WHERE id = ?',
    [name, id]
  );
  if (result.affectedRows === 0) {
    throw new AppError(404, 'Kategori tidak ditemukan');
  }
  const [rows] = await pool.execute<CategoryRow[]>(
    'SELECT id, name, created_at FROM categories WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0];
}

/**
 * Menghapus kategori jika tidak lagi digunakan oleh buku mana pun.
 */
export async function deleteCategory(id: number): Promise<void> {
  const [used] = await pool.execute<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM books WHERE category_id = ?',
    [id]
  );
  if (Number(used[0].total) > 0) {
    throw new AppError(409, 'Kategori tidak dapat dihapus karena masih dipakai oleh data buku');
  }

  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new AppError(404, 'Kategori tidak ditemukan');
  }
}
