/**
 * @module components/dashboard/PaginationBar
 * @description Kontrol navigasi halaman bersama untuk tabel katalog, transaksi, dan pengguna.
 */

interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-2 border-t border-(--border-subtle) text-xs text-(--text-muted)">
      <span>
        Halaman {page} dari {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="rounded-full border border-(--border-subtle) px-3 py-1 disabled:opacity-40 cursor-pointer"
        >
          Sebelumnya
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="rounded-full border border-(--border-subtle) px-3 py-1 disabled:opacity-40 cursor-pointer"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
