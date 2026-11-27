-- Hasil scraping buku nyata (Open Library API) — 2026-11-27T15:49:34.943Z
USE `db_denvora_lexora`;

INSERT INTO `books` (`book_code`, `title`, `author`, `publisher`, `publication_year`, `category_id`, `stock_total`, `stock_available`, `shelf_location`, `description`, `cover_url`) VALUES
  ('BK-SCR-001', 'JavaScript', 'David Flanagan', 'Penerbit Nasional', 1996, 1, 3, 3, 'Rak O1', 'Buku "JavaScript" karya David Flanagan dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-001.jpg'),
  ('BK-SCR-002', 'Eloquent Javascript', 'Marijn Haverbeke', 'Penerbit Nasional', 2009, 1, 4, 4, 'Rak O1', 'Buku "Eloquent Javascript" karya Marijn Haverbeke dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-002.jpg'),
  ('BK-SCR-003', 'JavaScript Basics for Beginners', 'Andy Vickler', 'Penerbit Nasional', 2021, 1, 6, 6, 'Rak O1', 'Buku "JavaScript Basics for Beginners" karya Andy Vickler dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-003.jpg'),
  ('BK-SCR-004', 'Practical JavaScript programming', 'Reaz Hoque', 'Penerbit Nasional', 1997, 1, 2, 2, 'Rak O1', 'Buku "Practical JavaScript programming" karya Reaz Hoque dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-004.jpg'),
  ('BK-SCR-005', 'Anak Semua Bangsa', 'Pramoedya Ananta Toer', 'Penerbit Nasional', 1973, 2, 2, 2, 'Rak O2', 'Buku "Anak Semua Bangsa" karya Pramoedya Ananta Toer dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-005.jpg'),
  ('BK-SCR-006', 'Bumi Manusia', 'Pramoedya Ananta Toer', 'Penerbit Nasional', 1972, 2, 3, 3, 'Rak O2', 'Buku "Bumi Manusia" karya Pramoedya Ananta Toer dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-006.jpg'),
  ('BK-SCR-007', 'Novel-novel Indonesia tradisi Balai Pustaka, 1920-1942', 'Faruk', 'Penerbit Nasional', 2002, 2, 4, 4, 'Rak O2', 'Buku "Novel-novel Indonesia tradisi Balai Pustaka, 1920-1942" karya Faruk dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-007.jpg'),
  ('BK-SCR-008', 'Pengantar novel Indonesia', 'Yakob Sumarjo', 'Penerbit Nasional', 1983, 2, 5, 5, 'Rak O2', 'Buku "Pengantar novel Indonesia" karya Yakob Sumarjo dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-008.jpg'),
  ('BK-SCR-009', 'Ringkasan dan ulasan novel Indonesia modern', 'Maman S. Mahayana', 'Penerbit Nasional', 1992, 2, 6, 6, 'Rak O2', 'Buku "Ringkasan dan ulasan novel Indonesia modern" karya Maman S. Mahayana dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-009.jpg'),
  ('BK-SCR-010', 'Fundamentals of physics', 'David Halliday', 'Penerbit Nasional', 1970, 3, 2, 2, 'Rak O3', 'Buku "Fundamentals of physics" karya David Halliday dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-010.jpg'),
  ('BK-SCR-011', 'Conceptual Physics Fundamentals', 'Paul G. Hewitt', 'Penerbit Nasional', 2007, 3, 3, 3, 'Rak O3', 'Buku "Conceptual Physics Fundamentals" karya Paul G. Hewitt dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-011.jpg'),
  ('BK-SCR-012', 'Engineering physics', 'P. Khare', 'Penerbit Nasional', 2007, 3, 4, 4, 'Rak O3', 'Buku "Engineering physics" karya P. Khare dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-012.jpg'),
  ('BK-SCR-013', 'Understanding Ultrasound Physics', 'Sidney K. Edelman', 'Penerbit Nasional', 1990, 3, 5, 5, 'Rak O3', 'Buku "Understanding Ultrasound Physics" karya Sidney K. Edelman dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-013.jpg'),
  ('BK-SCR-014', 'Fundamentals of plasma physics', 'J. A. Bittencourt', 'Penerbit Nasional', 1986, 3, 6, 6, 'Rak O3', 'Buku "Fundamentals of plasma physics" karya J. A. Bittencourt dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-014.jpg'),
  ('BK-SCR-015', 'Calculus', 'James Stewart', 'Penerbit Nasional', 1986, 3, 2, 2, 'Rak O3', 'Buku "Calculus" karya James Stewart dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-015.jpg'),
  ('BK-SCR-016', 'Calculus, Early Transcendentals', 'James Stewart', 'Penerbit Nasional', 1991, 3, 3, 3, 'Rak O3', 'Buku "Calculus, Early Transcendentals" karya James Stewart dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-016.jpg'),
  ('BK-SCR-017', 'Calculus with analytic geometry', 'Howard Anton', 'Penerbit Nasional', 1980, 3, 4, 4, 'Rak O3', 'Buku "Calculus with analytic geometry" karya Howard Anton dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-017.jpg'),
  ('BK-SCR-018', 'Precalculus', 'James Stewart', 'Penerbit Nasional', 2016, 3, 5, 5, 'Rak O3', 'Buku "Precalculus" karya James Stewart dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-018.jpg'),
  ('BK-SCR-019', 'Basic technical mathematics with calculus', 'Allyn J. Washington', 'Penerbit Nasional', 1964, 3, 6, 6, 'Rak O3', 'Buku "Basic technical mathematics with calculus" karya Allyn J. Washington dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-019.jpg'),
  ('BK-SCR-020', 'Pelurusan sejarah Indonesia', 'Asvi Warman Adam', 'Penerbit Nasional', 2004, 4, 2, 2, 'Rak O4', 'Buku "Pelurusan sejarah Indonesia" karya Asvi Warman Adam dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-020.jpg'),
  ('BK-SCR-021', 'Atlas sejarah Indonesia', 'Isman Pratama Nasution', 'Penerbit Nasional', 2019, 4, 3, 3, 'Rak O4', 'Buku "Atlas sejarah Indonesia" karya Isman Pratama Nasution dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-021.jpg'),
  ('BK-SCR-022', 'Nusantara', 'Vlekke, Bernard H. M.', 'Penerbit Nasional', 2018, 4, 4, 4, 'Rak O4', 'Buku "Nusantara" karya Vlekke, Bernard H. M. dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-022.jpg'),
  ('BK-SCR-023', 'Atlas sejarah Indonesia dan dunia', 'Chalid Latif', 'Penerbit Nasional', 1992, 4, 5, 5, 'Rak O4', 'Buku "Atlas sejarah Indonesia dan dunia" karya Chalid Latif dalam kategori koleksi perpustakaan sekolah.', '/uploads/covers/bk-scr-023.jpg'),
  ('BK-SCR-024', 'Pengantar ilmu sejarah Indonesia', 'R. Moh Ali', 'Penerbit Nasional', 2005, 4, 6, 6, 'Rak O4', 'Buku "Pengantar ilmu sejarah Indonesia" karya R. Moh Ali dalam kategori koleksi perpustakaan sekolah.', NULL)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `author` = VALUES(`author`),
  `publisher` = VALUES(`publisher`),
  `description` = VALUES(`description`),
  `cover_url` = COALESCE(VALUES(`cover_url`), `cover_url`);
