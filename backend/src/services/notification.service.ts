/**
 * @module services/notification.service
 * @description Menghasilkan umpan notifikasi langsung (real-time dari MySQL) sesuai peran pengguna.
 */

import type { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import type { AuthUser } from '../types/express';

export interface NotificationItem {
  id: string;
  level: 'danger' | 'warning' | 'info';
  title: string;
  message: string;
  targetTab: string;
}

/**
 * Mengambil daftar notifikasi aktif berdasarkan peran (Siswa, Petugas, atau Admin).
 */
export async function getNotificationsForUser(user: AuthUser): Promise<{
  unreadCount: number;
  items: NotificationItem[];
}> {
  const items: NotificationItem[] = [];

  if (user.role === 'siswa') {
    const [loans] = await pool.execute<RowDataPacket[]>(
      `SELECT t.id, t.transaction_code, b.title AS book_title,
              DATEDIFF(t.due_date, CURDATE()) AS days_left
       FROM transactions t
       INNER JOIN books b ON b.id = t.book_id
       WHERE t.user_id = ? AND t.status = 'borrowed'
       ORDER BY t.due_date ASC
       LIMIT 6`,
      [user.id]
    );

    for (const row of loans) {
      const daysLeft = Number(row.days_left);
      if (daysLeft < 0) {
        items.push({
          id: `overdue-${row.id}`,
          level: 'danger',
          title: `Terlambat ${Math.abs(daysLeft)} hari`,
          message: `"${row.book_title}" (${row.transaction_code}) telah melewati jatuh tempo.`,
          targetTab: 'loans',
        });
      } else if (daysLeft <= 2) {
        items.push({
          id: `due-${row.id}`,
          level: 'warning',
          title: daysLeft === 0 ? 'Jatuh tempo hari ini' : `Tenggat ${daysLeft} hari lagi`,
          message: `Segera kembalikan "${row.book_title}" (${row.transaction_code}).`,
          targetTab: 'loans',
        });
      } else {
        items.push({
          id: `active-${row.id}`,
          level: 'info',
          title: 'Pinjaman aktif berjalan',
          message: `"${row.book_title}" tenggat dalam ${daysLeft} hari.`,
          targetTab: 'loans',
        });
      }
    }
    return { unreadCount: items.length, items };
  }

  const [overdueRows] = await pool.execute<RowDataPacket[]>(
    `SELECT t.id, t.transaction_code, u.name AS member_name, b.title AS book_title,
            DATEDIFF(CURDATE(), t.due_date) AS overdue_days
     FROM transactions t
     INNER JOIN users u ON u.id = t.user_id
     INNER JOIN books b ON b.id = t.book_id
     WHERE t.status = 'borrowed' AND t.due_date < CURDATE()
     ORDER BY overdue_days DESC
     LIMIT 4`
  );

  for (const row of overdueRows) {
    items.push({
      id: `staff-overdue-${row.id}`,
      level: 'danger',
      title: `Terlambat ${row.overdue_days} hari · ${row.member_name}`,
      message: `${row.transaction_code} — "${row.book_title}" belum dikembalikan.`,
      targetTab: 'transactions',
    });
  }

  const [emptyBooks] = await pool.execute<RowDataPacket[]>(
    `SELECT id, book_code, title FROM books WHERE stock_available = 0 ORDER BY id DESC LIMIT 3`
  );
  for (const book of emptyBooks) {
    items.push({
      id: `stock-empty-${book.id}`,
      level: 'warning',
      title: `Stok habis · ${book.book_code}`,
      message: `"${book.title}" saat ini stok tersedia 0 eksemplar.`,
      targetTab: 'books',
    });
  }

  if (user.role === 'admin') {
    const [unverified] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM users WHERE role = 'siswa' AND is_verified = 0`
    );
    const pendingCount = Number(unverified[0]?.total || 0);
    if (pendingCount > 0) {
      items.push({
        id: 'pending-otp-members',
        level: 'info',
        title: `${pendingCount} siswa menunggu OTP`,
        message: 'Terdapat pendaftar siswa yang belum menyelesaikan verifikasi OTP.',
        targetTab: 'members',
      });
    }
  }

  return { unreadCount: items.length, items };
}
