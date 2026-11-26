-- =============================================================================
-- Denvora Lexora — Digital Library Management System
-- Database Schema & Initial Seed Data (MySQL 8.0+ / MariaDB Compatible)
-- UKK RPL Paket 4 (KM25.4.1.1)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `db_denvora_lexora`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `db_denvora_lexora`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `otp_verifications`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. Tabel users (admin, petugas, siswa)
-- -----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(120) NULL,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'petugas', 'siswa') NOT NULL DEFAULT 'siswa',
  `member_code` VARCHAR(30) NULL,
  `class_name` VARCHAR(50) NULL,
  `phone` VARCHAR(20) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  UNIQUE KEY `uk_users_username` (`username`),
  UNIQUE KEY `uk_users_member_code` (`member_code`),
  KEY `idx_users_role_active` (`role`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Tabel categories
-- -----------------------------------------------------------------------------
CREATE TABLE `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categories_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Tabel books
-- -----------------------------------------------------------------------------
CREATE TABLE `books` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `book_code` VARCHAR(30) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `author` VARCHAR(100) NOT NULL,
  `publisher` VARCHAR(100) NOT NULL,
  `publication_year` YEAR NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `stock_total` INT UNSIGNED NOT NULL DEFAULT 1,
  `stock_available` INT UNSIGNED NOT NULL DEFAULT 1,
  `shelf_location` VARCHAR(30) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_books_book_code` (`book_code`),
  KEY `idx_books_search` (`title`, `author`),
  KEY `idx_books_stock` (`stock_available`),
  KEY `fk_books_category` (`category_id`),
  CONSTRAINT `fk_books_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Tabel transactions
-- -----------------------------------------------------------------------------
CREATE TABLE `transactions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `transaction_code` VARCHAR(30) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `book_id` INT UNSIGNED NOT NULL,
  `processed_by` INT UNSIGNED NULL,
  `borrow_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `return_date` DATE NULL,
  `status` ENUM('borrowed', 'returned') NOT NULL DEFAULT 'borrowed',
  `notes` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_transactions_code` (`transaction_code`),
  KEY `idx_trx_status_date` (`status`, `borrow_date`),
  KEY `idx_trx_user` (`user_id`, `status`),
  KEY `fk_trx_book` (`book_id`),
  KEY `fk_trx_processed_by` (`processed_by`),
  CONSTRAINT `fk_trx_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_trx_book`
    FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_trx_processed_by`
    FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Tabel otp_verifications (Verifikasi Email & Login OTP via Mailpit)
-- -----------------------------------------------------------------------------
CREATE TABLE `otp_verifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `purpose` ENUM('register', 'login') NOT NULL,
  `otp_hash` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `consumed_at` DATETIME NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_otp_email_purpose` (`email`, `purpose`, `expires_at`),
  CONSTRAINT `fk_otp_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- Seed Data Uji Standar (Password default: Admin123! / Petugas123! / Siswa123!)
-- =============================================================================

INSERT INTO `users` (`id`, `name`, `email`, `username`, `password_hash`, `role`, `member_code`, `class_name`, `phone`, `is_active`, `is_verified`) VALUES
  (1, 'Arden Administrator', 'admin@denvora.sch.id', 'admin', '$2a$10$LdvA.IQjZPDfPAkbegJpCevkADJ5XY.1xPMYmoqRp3rv.WBQL5rAq', 'admin', NULL, 'Kepala Perpustakaan', '081100000001', 1, 1),
  (2, 'Rina Pustakawan', 'petugas1@denvora.sch.id', 'petugas1', '$2a$10$TwRVw5GEst6oNAxAaU5mzuIUelQloZ6/RpPM8.tOdyKLA/j73BOvu', 'petugas', NULL, 'Petugas Layanan', '081100000002', 1, 1),
  (3, 'Nadia Permata', 'siswa1@denvora.sch.id', 'siswa1', '$2a$10$7huA2PSeBnpn7NPV5Iz5Se6ehme9lT7q/DBhgn2DQLbZHl4JyaY7O', 'siswa', '2025001', 'XII RPL 1', '081200000001', 1, 1),
  (4, 'Dimas Pratama', 'siswa_nonaktif@denvora.sch.id', 'siswa_nonaktif', '$2a$10$7huA2PSeBnpn7NPV5Iz5Se6ehme9lT7q/DBhgn2DQLbZHl4JyaY7O', 'siswa', '2025002', 'XI RPL 2', '081200000002', 0, 1),
  (5, 'Salsa Aulia', 'siswa2@denvora.sch.id', 'siswa2', '$2a$10$7huA2PSeBnpn7NPV5Iz5Se6ehme9lT7q/DBhgn2DQLbZHl4JyaY7O', 'siswa', '2025003', 'XII RPL 2', '081200000003', 1, 1);

INSERT INTO `categories` (`id`, `name`) VALUES
  (1, 'Teknologi & Pemrograman'),
  (2, 'Sastra & Fiksi'),
  (3, 'Sains & Matematika'),
  (4, 'Sejarah & Umum');

INSERT INTO `books` (`id`, `book_code`, `title`, `author`, `publisher`, `publication_year`, `category_id`, `stock_total`, `stock_available`, `shelf_location`) VALUES
  (1, 'BK-001', 'Algoritma & Struktur Data Modern', 'Rinaldi Munir', 'Informatika Bandung', 2022, 1, 5, 4, 'Rak A1'),
  (2, 'BK-002', 'Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, 2, 4, 4, 'Rak B2'),
  (3, 'BK-003', 'Clean Code Edisi Bahasa Indonesia', 'Robert C. Martin', 'Pustaka Kode', 2020, 1, 3, 2, 'Rak A2'),
  (4, 'BK-004', 'Bumi Manusia', 'Pramoedya Ananta Toer', 'Lentera Dipantara', 2005, 2, 2, 2, 'Rak B1'),
  (5, 'BK-005', 'Fisika Dasar Universitas', 'Halliday & Resnick', 'Erlangga', 2019, 3, 3, 0, 'Rak C1'),
  (6, 'BK-006', 'Sejarah Nusantara Lengkap', 'M.C. Ricklefs', 'Serambi Ilmu', 2018, 4, 4, 4, 'Rak D1');

INSERT INTO `transactions` (`id`, `transaction_code`, `user_id`, `book_id`, `processed_by`, `borrow_date`, `due_date`, `return_date`, `status`, `notes`) VALUES
  (1, 'TRX-202601', 3, 1, 2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 5 DAY), NULL, 'borrowed', 'Pinjaman aktif tepat waktu'),
  (2, 'TRX-202602', 5, 3, 2, DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 3 DAY), NULL, 'borrowed', 'Pinjaman melewati jatuh tempo'),
  (3, 'TRX-202603', 3, 2, 2, DATE_SUB(CURDATE(), INTERVAL 14 DAY), DATE_SUB(CURDATE(), INTERVAL 7 DAY), DATE_SUB(CURDATE(), INTERVAL 8 DAY), 'returned', 'Sudah dikembalikan kondisi baik');

SELECT 'users_count' AS check_name, COUNT(*) AS total FROM `users`;
SELECT 'categories_count' AS check_name, COUNT(*) AS total FROM `categories`;
SELECT 'books_count' AS check_name, COUNT(*) AS total FROM `books`;
SELECT 'transactions_count' AS check_name, COUNT(*) AS total FROM `transactions`;
SELECT 'otp_verifications_count' AS check_name, COUNT(*) AS total FROM `otp_verifications`;
