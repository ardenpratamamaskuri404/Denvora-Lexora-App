/**
 * @module controllers/catalog.controller
 * @description Handler HTTP bersama untuk kategori dan katalog buku.
 */

import type { NextFunction, Request, Response } from 'express';
import { AppError, sendSuccess } from '../utils/response';
import { saveBookCoverFile } from '../utils/fileHelper';
import * as categoryService from '../services/category.service';
import * as bookService from '../services/book.service';

export async function listCategories(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categories = await categoryService.listCategories();
    sendSuccess(res, 200, 'Daftar kategori berhasil diambil', categories);
  } catch (err) {
    next(err);
  }
}

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const category = await categoryService.createCategory(req.body.name);
    sendSuccess(res, 201, 'Kategori berhasil ditambahkan', category);
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const category = await categoryService.updateCategory(Number(req.params.id), req.body.name);
    sendSuccess(res, 200, 'Kategori berhasil diperbarui', category);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await categoryService.deleteCategory(Number(req.params.id));
    sendSuccess(res, 200, 'Kategori berhasil dihapus');
  } catch (err) {
    next(err);
  }
}

export async function listBooks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as unknown as bookService.BookQuery;
    const { items, meta } = await bookService.listBooks(query);
    sendSuccess(res, 200, 'Data buku berhasil diambil', items, meta);
  } catch (err) {
    next(err);
  }
}

export async function getBook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const book = await bookService.getBookById(Number(req.params.id));
    sendSuccess(res, 200, 'Detail buku berhasil diambil', book);
  } catch (err) {
    next(err);
  }
}

export async function createBook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const book = await bookService.createBook(req.body);
    sendSuccess(res, 201, 'Buku berhasil ditambahkan', book);
  } catch (err) {
    next(err);
  }
}

export async function updateBook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const book = await bookService.updateBook(Number(req.params.id), req.body);
    sendSuccess(res, 200, 'Data buku berhasil diperbarui', book);
  } catch (err) {
    next(err);
  }
}

export async function deleteBook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await bookService.deleteBook(Number(req.params.id));
    sendSuccess(res, 200, 'Buku berhasil dihapus');
  } catch (err) {
    next(err);
  }
}

export async function uploadBookCover(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { filename, data_url } = req.body as { filename: string; data_url: string };
    const coverUrl = await saveBookCoverFile(filename, data_url);
    sendSuccess(res, 201, 'Gambar sampul berhasil diunggah', { cover_url: coverUrl });
  } catch (err) {
    next(err instanceof Error ? new AppError(400, err.message) : err);
  }
}
