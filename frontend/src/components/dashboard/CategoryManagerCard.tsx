/**
 * @module components/dashboard/CategoryManagerCard
 * @description Panel ringkas pengelolaan kategori buku untuk Petugas dan Admin.
 */

"use client";

import { useState } from "react";
import { FolderPlus, Pencil, Check, Trash2, X } from "lucide-react";
import { ApiRequestError } from "@/lib/api";
import {
  createCategoryApi,
  deleteCategoryApi,
  updateCategoryApi,
} from "@/lib/portalApi";
import type { CategoryItem, StaffRolePrefix } from "@/types/library";

interface CategoryManagerCardProps {
  prefix: StaffRolePrefix;
  categories: CategoryItem[];
  allowDelete: boolean;
  onChanged: (message: string) => void;
}

export function CategoryManagerCard({
  prefix,
  categories,
  allowDelete,
  onChanged,
}: CategoryManagerCardProps) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (newName.trim().length < 2) {
      setErrorMsg("Nama kategori minimal 2 karakter.");
      return;
    }
    setBusy(true);
    setErrorMsg("");
    try {
      const res = await createCategoryApi(prefix, newName.trim());
      setNewName("");
      onChanged(res.message);
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : "Gagal menambah kategori.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveEdit(id: number) {
    if (editingName.trim().length < 2) {
      setErrorMsg("Nama kategori minimal 2 karakter.");
      return;
    }
    setBusy(true);
    setErrorMsg("");
    try {
      const res = await updateCategoryApi(prefix, id, editingName.trim());
      setEditingId(null);
      onChanged(res.message);
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : "Gagal mengubah kategori.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(cat: CategoryItem) {
    setBusy(true);
    setErrorMsg("");
    try {
      const res = await deleteCategoryApi(cat.id);
      onChanged(res.message);
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : "Gagal menghapus kategori.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated) p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-editorial text-base font-bold text-(--text-primary)">
            Kategori Koleksi Buku
          </h3>
          <p className="text-xs text-(--text-muted)">
            Kelompokkan buku berdasarkan bidang bacaan sekolah.
          </p>
        </div>

        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Kategori baru..."
            className="h-9 rounded-full border border-(--border-subtle) bg-(--bg-primary) px-3.5 text-xs text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy}
            className="h-9 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-3.5 text-xs font-semibold text-[#F6EFE6] inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <FolderPlus size={14} /> Tambah
          </button>
        </form>
      </div>

      {errorMsg && (
        <p className="mt-2.5 text-xs text-[#9E3B33] dark:text-[#F39B8F]">{errorMsg}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-(--border-subtle) bg-(--bg-primary) px-3 py-1.5 text-xs text-(--text-primary)"
          >
            {editingId === cat.id ? (
              <>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-32 bg-transparent border-b border-(--accent-primary) text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSaveEdit(cat.id)}
                  aria-label="Simpan kategori"
                  className="text-[#2F6B48] dark:text-[#9FE0B7] cursor-pointer"
                >
                  <Check size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  aria-label="Batal ubah kategori"
                  className="text-(--text-muted) cursor-pointer"
                >
                  <X size={13} />
                </button>
              </>
            ) : (
              <>
                <span className="font-medium">{cat.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(cat.id);
                    setEditingName(cat.name);
                  }}
                  aria-label={`Ubah ${cat.name}`}
                  className="text-(--text-muted) hover:text-(--accent-primary) cursor-pointer"
                >
                  <Pencil size={12} />
                </button>
                {allowDelete && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDelete(cat)}
                    aria-label={`Hapus ${cat.name}`}
                    className="text-(--text-muted) hover:text-[#9E3B33] cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
