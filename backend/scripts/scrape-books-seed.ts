/**
 * @module scripts/scrape-books-seed
 * @description Scraper CLI gratis (Google Books API dengan fallback Open Library) untuk mengambil
 * banyak koleksi buku nyata lintas kategori, mengunduh cover ke `backend/uploads/covers/`,
 * serta menghasilkan `database/seed_books_scraped.sql` (dan opsional `--apply` ke MySQL).
 *
 * Penggunaan:
 *   npm run seed:scrape -- --all --limit=6 --apply
 *   npm run seed:scrape -- --query="laskar pelangi" --limit=10 --category=2 --apply
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { pool } from '../src/config/db';

interface GoogleVolumeItem {
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  };
}

interface ScrapedBook {
  book_code: string;
  title: string;
  author: string;
  publisher: string;
  publication_year: number;
  category_id: number;
  stock_total: number;
  shelf_location: string;
  description: string;
  cover_url: string | null;
}

const DEFAULT_BATCHES: Array<{ query: string; categoryId: number }> = [
  { query: 'javascript programming', categoryId: 1 },
  { query: 'software architecture', categoryId: 1 },
  { query: 'andrea hirata', categoryId: 2 },
  { query: 'indonesia novel', categoryId: 2 },
  { query: 'physics fundamentals', categoryId: 3 },
  { query: 'mathematics calculus', categoryId: 3 },
  { query: 'sejarah indonesia', categoryId: 4 },
  { query: 'world history', categoryId: 4 },
];

const ROOT_DIR = path.resolve(__dirname, '../..');
const COVERS_DIR = path.join(ROOT_DIR, 'backend/uploads/covers');
const SQL_OUTPUT = path.join(ROOT_DIR, 'database/seed_books_scraped.sql');

function getArg(name: string, fallback: string): string {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function sqlEscape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function extractYear(rawDate?: string | number): number {
  const match = String(rawDate || '').match(/\d{4}/);
  const year = match ? Number(match[0]) : 2020;
  return Math.min(2100, Math.max(1901, year));
}

async function fetchWithTimeout(url: string, ms = 9000): Promise<Response> {
  return fetch(url, { signal: AbortSignal.timeout(ms) });
}

async function downloadCoverImage(url: string | undefined, code: string): Promise<string | null> {
  if (!url) return null;
  try {
    const cleanUrl = url.replace(/^http:/, 'https:').replace('&edge=curl', '');
    const res = await fetchWithTimeout(cleanUrl, 8000);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 512) return null;
    await fs.mkdir(COVERS_DIR, { recursive: true });
    const filename = `${code.toLowerCase()}.jpg`;
    await fs.writeFile(path.join(COVERS_DIR, filename), buf);
    return `/uploads/covers/${filename}`;
  } catch {
    return null;
  }
}

async function fetchGoogleBooksBatch(
  query: string,
  limit: number,
  categoryId: number,
  startIndex: number
) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${limit}&printType=books`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Google Books HTTP ${res.status}`);

  const json = (await res.json()) as { items?: GoogleVolumeItem[] };
  return (json.items || [])
    .filter((item) => Boolean(item.volumeInfo?.title))
    .slice(0, limit)
    .map((item, idx) => {
      const info = item.volumeInfo!;
      return {
        title: (info.title || 'Judul Koleksi').slice(0, 140),
        author: (info.authors?.[0] || 'Penulis Nasional').slice(0, 95),
        publisher: (info.publisher || 'Penerbit Umum').slice(0, 95),
        publication_year: extractYear(info.publishedDate),
        category_id: categoryId,
        stock_total: ((startIndex + idx) % 5) + 2,
        shelf_location: `Rak G${categoryId}`,
        description: (info.description || `Koleksi referensi "${info.title}" untuk literasi sekolah.`).slice(0, 900),
        rawCover: info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail,
      };
    });
}

async function fetchOpenLibraryBatch(
  query: string,
  limit: number,
  categoryId: number,
  startIndex: number
) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit * 2}`;
  const res = await fetchWithTimeout(url, 12000);
  if (!res.ok) throw new Error(`Open Library HTTP ${res.status}`);

  const json = (await res.json()) as {
    docs?: Array<{
      title?: string;
      author_name?: string[];
      publisher?: string[];
      first_publish_year?: number;
      cover_i?: number;
      first_sentence?: string[];
    }>;
  };

  return (json.docs || [])
    .filter((doc) => Boolean(doc.title))
    .sort((a, b) => Number(Boolean(b.cover_i)) - Number(Boolean(a.cover_i)))
    .slice(0, limit)
    .map((doc, idx) => ({
      title: (doc.title || 'Judul Koleksi').slice(0, 140),
      author: (doc.author_name?.[0] || 'Penulis Umum').slice(0, 95),
      publisher: (doc.publisher?.[0] || 'Penerbit Nasional').slice(0, 95),
      publication_year: extractYear(doc.first_publish_year),
      category_id: categoryId,
      stock_total: ((startIndex + idx) % 5) + 2,
      shelf_location: `Rak O${categoryId}`,
      description: (
        doc.first_sentence?.[0] ||
        `Buku "${doc.title}" karya ${doc.author_name?.[0] || 'penulis'} dalam kategori koleksi perpustakaan sekolah.`
      ).slice(0, 900),
      rawCover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined,
    }));
}

async function scrapeBooks(): Promise<void> {
  const runAll = process.argv.includes('--all');
  const applyDb = process.argv.includes('--apply');
  const limitPerBatch = Math.min(15, Math.max(1, Number(getArg('limit', runAll ? '4' : '12'))));
  const batches = runAll
    ? DEFAULT_BATCHES
    : [{ query: getArg('query', 'pemrograman indonesia'), categoryId: Math.max(1, Number(getArg('category', '1'))) }];

  const records: ScrapedBook[] = [];
  const seenTitles = new Set<string>();
  const usedSources = new Set<string>();
  let seq = 1;

  for (const batch of batches) {
    let items: Array<{
      title: string;
      author: string;
      publisher: string;
      publication_year: number;
      category_id: number;
      stock_total: number;
      shelf_location: string;
      description: string;
      rawCover?: string;
    }> = [];

    try {
      items = await fetchGoogleBooksBatch(batch.query, limitPerBatch, batch.categoryId, seq);
      if (items.length > 0) usedSources.add('Google Books API');
      else throw new Error('Hasil kosong');
    } catch {
      try {
        items = await fetchOpenLibraryBatch(batch.query, limitPerBatch, batch.categoryId, seq);
        if (items.length > 0) usedSources.add('Open Library API');
      } catch (err) {
        console.warn(`Batch "${batch.query}" dilewati:`, err instanceof Error ? err.message : err);
        continue;
      }
    }

    for (const item of items) {
      const normTitle = item.title.trim().toLowerCase();
      if (seenTitles.has(normTitle)) continue;
      seenTitles.add(normTitle);

      const code = `BK-SCR-${String(seq).padStart(3, '0')}`;
      seq += 1;
      const coverUrl = await downloadCoverImage(item.rawCover, code);

      records.push({
        book_code: code,
        title: item.title,
        author: item.author,
        publisher: item.publisher,
        publication_year: item.publication_year,
        category_id: item.category_id,
        stock_total: item.stock_total,
        shelf_location: item.shelf_location,
        description: item.description,
        cover_url: coverUrl,
      });
    }
  }

  const valuesSql = records
    .map(
      (b) =>
        `  ('${sqlEscape(b.book_code)}', '${sqlEscape(b.title)}', '${sqlEscape(b.author)}', '${sqlEscape(b.publisher)}', ${b.publication_year}, ${b.category_id}, ${b.stock_total}, ${b.stock_total}, '${sqlEscape(b.shelf_location)}', '${sqlEscape(b.description)}', ${b.cover_url ? `'${sqlEscape(b.cover_url)}'` : 'NULL'})`
    )
    .join(',\n');

  const sourceLabel = [...usedSources].join(' + ') || 'Public Book API';
  const sqlContent = `-- Hasil scraping buku nyata (${sourceLabel}) — ${new Date().toISOString()}\nUSE \`db_denvora_lexora\`;\n\nINSERT INTO \`books\` (\`book_code\`, \`title\`, \`author\`, \`publisher\`, \`publication_year\`, \`category_id\`, \`stock_total\`, \`stock_available\`, \`shelf_location\`, \`description\`, \`cover_url\`) VALUES\n${valuesSql}\nON DUPLICATE KEY UPDATE\n  \`title\` = VALUES(\`title\`),\n  \`author\` = VALUES(\`author\`),\n  \`publisher\` = VALUES(\`publisher\`),\n  \`description\` = VALUES(\`description\`),\n  \`cover_url\` = COALESCE(VALUES(\`cover_url\`), \`cover_url\`);\n`;

  await fs.writeFile(SQL_OUTPUT, sqlContent, 'utf8');
  console.log(`SCRAPE_SEED_SQL_WRITTEN source="${sourceLabel}" count=${records.length}`);

  if (applyDb && records.length > 0) {
    for (const b of records) {
      await pool.execute(
        `INSERT INTO books (book_code, title, author, publisher, publication_year, category_id, stock_total, stock_available, shelf_location, description, cover_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), author = VALUES(author), publisher = VALUES(publisher), description = VALUES(description), cover_url = COALESCE(VALUES(cover_url), cover_url)`,
        [
          b.book_code, b.title, b.author, b.publisher, b.publication_year,
          b.category_id, b.stock_total, b.stock_total, b.shelf_location,
          b.description, b.cover_url,
        ]
      );
    }
    console.log(`SCRAPE_SEED_DB_APPLIED inserted=${records.length}`);
  }
}

scrapeBooks()
  .catch((err) => {
    console.error('SCRAPE_SEED_FAILED:', err instanceof Error ? err.message : err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end().catch(() => {});
  });
