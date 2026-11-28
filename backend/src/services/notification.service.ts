/**
 * @module services/notification.service
 * @description Menghasilkan umpan notifikasi real-time per peran lengkap dengan status dibaca & hapus persisten di MySQL.
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
  timeLabel: string;
  isRead: boolean;
}

interface RawNotification {
  id: string;
  level: 'danger' | 'warning' | 'info';
  title: string;
  message: string;
  targetTab: string;
  timeLabel: string;
}

async function buildRawNotifications(user: AuthUser): Promise<RawNotification[]> {
  const raw: RawNotification[] = [];

  if (user.role === 'siswa') {
    const [loans] = await pool.execute<RowDataPacket[]>(
      `SELECT t.id, t.transaction_code, t.due_date, b.title AS book_title,
              DATEDIFF(t.due_date, CURDATE()) AS days_left
       FROM transactions t
       INNER JOIN books b ON b.id = t.book_id
       WHERE t.user_id = ? AND t.status = 'borrowed'
       ORDER BY t.due_date ASC
       LIMIT 15`,
      [user.id]
    );

    for (const row of loans) {
      const daysLeft = Number(row.days_left);
      if (daysLeft < 0) {
        raw.push({
          id: `overdue-${row.id}`,
          level: 'danger',
          title: `Terlambat ${Math.abs(daysLeft)} hari`,
          message: `"${row.book_title}" (${row.transaction_code}) telah melewati jatuh tempo (${row.due_date}).`,
          targetTab: 'loans',
          timeLabel: `Tempo ${row.due_date}`,
        });
      } else if (daysLeft <= 2) {
        raw.push({
          id: `due-${row.id}`,
          level: 'warning',
          title: daysLeft === 0 ? 'Jatuh tempo hari ini' : `Tenggat ${daysLeft} hari lagi`,
          message: `Segera kembalikan "${row.book_title}" (${row.transaction_code}).`,
          targetTab: 'loans',
          timeLabel: `Tempo ${row.due_date}`,
        });
      } else {
        raw.push({
          id: `active-${row.id}`,
          level: 'info',
          title: 'Pinjaman aktif berjalan',
          message: `"${row.book_title}" jatuh tempo ${daysLeft} hari lagi.`,
          targetTab: 'loans',
          timeLabel: `Tempo ${row.due_date}`,
        });
      }
    }
    return raw;
  }

  const [overdueRows] = await pool.execute<RowDataPacket[]>(
    `SELECT t.id, t.transaction_code, t.due_date, u.name AS member_name, b.title AS book_title,
            DATEDIFF(CURDATE(), t.due_date) AS overdue_days
     FROM transactions t
     INNER JOIN users u ON u.id = t.user_id
     INNER JOIN books b ON b.id = t.book_id
     WHERE t.status = 'borrowed' AND t.due_date < CURDATE()
     ORDER BY overdue_days DESC
     LIMIT 10`
  );

  for (const row of overdueRows) {
    raw.push({
      id: `staff-overdue-${row.id}`,
      level: 'danger',
      title: `Terlambat ${row.overdue_days} hari · ${row.member_name}`,
      message: `${row.transaction_code} — "${row.book_title}" belum dikembalikan.`,
      targetTab: 'transactions',
      timeLabel: `Tempo ${row.due_date}`,
    });
  }

  const [emptyBooks] = await pool.execute<RowDataPacket[]>(
    `SELECT id, book_code, title FROM books WHERE stock_available = 0 ORDER BY id DESC LIMIT 8`
  );
  for (const book of emptyBooks) {
    raw.push({
      id: `stock-empty-${book.id}`,
      level: 'warning',
      title: `Stok habis · ${book.book_code}`,
      message: `"${book.title}" saat ini stok tersedia 0 eksemplar.`,
      targetTab: 'books',
      timeLabel: 'Perlu restok',
    });
  }

  if (user.role === 'admin') {
    const [unverified] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM users WHERE role = 'siswa' AND is_verified = 0`
    );
    const pendingCount = Number(unverified[0]?.total || 0);
    if (pendingCount > 0) {
      raw.push({
        id: 'pending-otp-members',
        level: 'info',
        title: `${pendingCount} siswa menunggu verifikasi OTP`,
        message: 'Terdapat pendaftar siswa yang belum menyelesaikan aktivasi email OTP.',
        targetTab: 'members',
        timeLabel: 'Keanggotaan',
      });
    }
  }

  return raw;
}

/**
 * Mengambil daftar notifikasi aktif pengguna beserta status dibaca dan jumlah belum dibaca.
 */
export async function getNotificationsForUser(user: AuthUser): Promise<{
  unreadCount: number;
  items: NotificationItem[];
}> {
  const raw = await buildRawNotifications(user);
  const [stateRows] = await pool.execute<RowDataPacket[]>(
    'SELECT notif_key, is_read, is_deleted FROM user_notification_states WHERE user_id = ?',
    [user.id]
  );

  const stateMap = new Map(
    stateRows.map((r) => [
      String(r.notif_key),
      { isRead: Boolean(r.is_read), isDeleted: Boolean(r.is_deleted) },
    ])
  );

  const items: NotificationItem[] = raw
    .filter((item) => !stateMap.get(item.id)?.isDeleted)
    .map((item) => ({
      ...item,
      isRead: Boolean(stateMap.get(item.id)?.isRead),
    }));

  return {
    unreadCount: items.filter((item) => !item.isRead).length,
    items,
  };
}

/** Menandai satu notifikasi sebagai sudah dibaca. */
export async function markNotificationRead(userId: number, notifKey: string): Promise<void> {
  await pool.execute(
    `INSERT INTO user_notification_states (user_id, notif_key, is_read, is_deleted)
     VALUES (?, ?, 1, 0)
     ON DUPLICATE KEY UPDATE is_read = 1, is_deleted = 0`,
    [userId, notifKey]
  );
}

/** Menandai seluruh notifikasi aktif milik pengguna sebagai sudah dibaca. */
export async function markAllNotificationsRead(user: AuthUser): Promise<void> {
  const { items } = await getNotificationsForUser(user);
  for (const item of items) {
    await markNotificationRead(user.id, item.id);
  }
}

/** Menghapus (menyembunyikan) satu notifikasi untuk pengguna aktif. */
export async function deleteNotification(userId: number, notifKey: string): Promise<void> {
  await pool.execute(
    `INSERT INTO user_notification_states (user_id, notif_key, is_read, is_deleted)
     VALUES (?, ?, 1, 1)
     ON DUPLICATE KEY UPDATE is_read = 1, is_deleted = 1`,
    [userId, notifKey]
  );
}

/** Menghapus semua notifikasi yang sudah berstatus dibaca (atau seluruhnya jika mode='all'). */
export async function clearNotifications(user: AuthUser, mode: 'read' | 'all'): Promise<void> {
  const { items } = await getNotificationsForUser(user);
  const targets = mode === 'all' ? items : items.filter((item) => item.isRead);
  for (const item of targets) {
    await deleteNotification(user.id, item.id);
  }
}
