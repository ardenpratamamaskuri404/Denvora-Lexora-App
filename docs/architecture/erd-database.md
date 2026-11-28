# Entity Relationship Diagram (ERD) — Denvora Lexora

Skema basis data relasional MySQL (`db_denvora_lexora`) mengacu langsung pada [schema.sql](../../database/schema.sql) dengan 6 tabel utama berelasi `InnoDB` (*utf8mb4*).

## Diagram Relasi Entitas

```mermaid
erDiagram
    USERS {
        INT id PK
        VARCHAR name
        VARCHAR email UK
        VARCHAR username UK
        VARCHAR password_hash
        ENUM role "admin | petugas | siswa"
        VARCHAR member_code UK "NIS / Kode Anggota"
        VARCHAR class_name
        VARCHAR phone
        TINYINT is_active
        TINYINT is_verified
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    CATEGORIES {
        INT id PK
        VARCHAR name UK
        TIMESTAMP created_at
    }

    BOOKS {
        INT id PK
        VARCHAR book_code UK
        VARCHAR title
        VARCHAR author
        VARCHAR publisher
        YEAR publication_year
        INT category_id FK
        INT stock_total
        INT stock_available
        VARCHAR shelf_location
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    TRANSACTIONS {
        INT id PK
        VARCHAR transaction_code UK
        INT user_id FK "Peminjam (siswa)"
        INT book_id FK
        INT processed_by FK "Opsional (admin/petugas)"
        DATE borrow_date
        DATE due_date
        DATE return_date
        ENUM status "borrowed | returned"
        VARCHAR notes
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    OTP_VERIFICATIONS {
        INT id PK
        INT user_id FK
        VARCHAR email
        ENUM purpose "register | login"
        VARCHAR otp_hash
        DATETIME expires_at
        DATETIME consumed_at
        TIMESTAMP created_at
    }

    USER_NOTIFICATION_STATES {
        INT user_id PK_FK
        VARCHAR notif_key PK
        TINYINT is_read
        TINYINT is_deleted
        TIMESTAMP updated_at
    }

    CATEGORIES ||--o{ BOOKS : "mengelompokkan (ON DELETE RESTRICT)"
    USERS ||--o{ TRANSACTIONS : "meminjam via user_id (ON DELETE RESTRICT)"
    USERS ||--o{ TRANSACTIONS : "memproses via processed_by (ON DELETE SET NULL)"
    BOOKS ||--o{ TRANSACTIONS : "dipinjam dalam (ON DELETE RESTRICT)"
    USERS ||--o{ OTP_VERIFICATIONS : "memiliki kode OTP (ON DELETE CASCADE)"
    USERS ||--o{ USER_NOTIFICATION_STATES : "menyimpan status notifikasi (ON DELETE CASCADE)"
```

---

## Ringkasan Integritas & Aturan Bisnis

1. **Integritas Stok Atomik:** Peminjaman (`status = 'borrowed'`) mengurangi `books.stock_available` di dalam transaksi SQL (`BEGIN` ... `SELECT ... FOR UPDATE` ... `COMMIT`) agar tidak terjadi *race condition* atau stok minus.
2. **Pengembalian Aman:** Pengembalian (`status = 'returned'`) mengisi `return_date` dan menambah kembali `books.stock_available` secara atomik dengan syarat tidak melebihi `stock_total`.
3. **Verifikasi OTP Aman:** Kode OTP 6 digit tidak pernah disimpan dalam plaintext — hanya hash SHA-256 (`otp_hash`) dengan masa berlaku terbatas (`expires_at`) dan penanda pemakaian tunggal (`consumed_at`).
4. **Persistensi Status Notifikasi Per Akun:** Status `is_read` dan `is_deleted` pada `user_notification_states` berkey komposit `(user_id, notif_key)` sehingga penandaan terbaca dan penghapusan notifikasi bersifat persisten per pengguna.
