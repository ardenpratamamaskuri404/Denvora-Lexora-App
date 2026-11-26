/**
 * @module components/dashboard/UsersManagementPanel
 * @description Panel terpadu untuk membaca/mengelola Anggota Siswa dan Petugas Perpustakaan.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, Pencil, Search, Trash2, UserPlus } from "lucide-react";
import { ApiRequestError } from "@/lib/api";
import { deleteUserApi, fetchUsersApi } from "@/lib/portalApi";
import { PaginationBar } from "@/components/dashboard/PaginationBar";
import { UserFormModal } from "@/components/dashboard/UserFormModal";
import type { PaginationMeta } from "@/types/auth";
import type {
  PortalMemberItem,
  StaffRolePrefix,
  UserResourceKind,
} from "@/types/library";

interface UsersManagementPanelProps {
  prefix: StaffRolePrefix;
  kind: UserResourceKind;
  readOnly: boolean;
  onChanged?: () => void;
}

export function UsersManagementPanel({
  prefix,
  kind,
  readOnly,
  onChanged,
}: UsersManagementPanelProps) {
  const isMember = kind === "members";
  const titleLabel = isMember ? "Anggota Siswa" : "Petugas Layanan";

  const [items, setItems] = useState<PortalMemberItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 8, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "1" | "0">("all");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PortalMemberItem | null>(null);
  const [notice, setNotice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetchUsersApi(prefix, kind, {
        search: search.trim(),
        is_active: activeFilter,
        page,
        limit: 8,
      });
      setItems(res.items);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : `Gagal memuat ${titleLabel}.`);
    } finally {
      setLoading(false);
    }
  }, [prefix, kind, search, activeFilter, page, titleLabel]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadUsers();
    }, 180);
    return () => clearTimeout(timer);
  }, [loadUsers]);

  async function handleDelete(item: PortalMemberItem) {
    if (!window.confirm(`Hapus akun ${item.name} (@${item.username})?`)) return;
    setBusyId(item.id);
    setErrorMsg("");
    setNotice("");
    try {
      const res = await deleteUserApi(kind, item.id);
      setNotice(res.message);
      await loadUsers();
      onChanged?.();
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : `Gagal menghapus ${titleLabel}.`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated) p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-editorial text-lg font-bold text-(--text-primary)">
            {readOnly ? `Daftar ${titleLabel}` : `Kelola Data ${titleLabel}`}
          </h2>
          <p className="text-xs text-(--text-muted)">
            {meta.total} akun terdaftar · {readOnly ? "mode baca untuk petugas" : "kontrol penuh admin"}.
          </p>
        </div>

        {!readOnly && (
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setModalOpen(true);
            }}
            className="h-9.5 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-4 text-xs font-bold text-[#F6EFE6] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus size={15} /> Tambah {isMember ? "Anggota" : "Petugas"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted)"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={
              isMember
                ? "Cari nama siswa, username, NIS, atau kelas..."
                : "Cari nama petugas, username, atau unit..."
            }
            className="h-10 w-full rounded-full border border-(--border-subtle) bg-(--bg-primary) pl-9 pr-4 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
          />
        </div>

        <select
          aria-label="Filter status aktif akun"
          value={activeFilter}
          onChange={(e) => {
            setActiveFilter(e.target.value as "all" | "1" | "0");
            setPage(1);
          }}
          className="sm:col-span-4 h-10 rounded-full border border-(--border-subtle) bg-(--bg-primary) px-3.5 text-sm text-(--text-primary) focus:outline-none"
        >
          <option value="all">Semua Status Akun</option>
          <option value="1">Aktif</option>
          <option value="0">Nonaktif</option>
        </select>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-2xl border border-[#2F6B48] bg-[#2F6B48]/15 px-4 py-2.5 text-xs text-[#2F6B48] dark:text-[#9FE0B7]">
          <CheckCircle2 size={15} className="shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-2xl border border-[#9E3B33] bg-[#9E3B33]/15 px-4 py-2.5 text-xs text-[#9E3B33] dark:text-[#FAD5D1]">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="py-10 flex items-center justify-center gap-2 text-xs text-(--text-muted)">
          <Loader2 size={16} className="animate-spin text-(--accent-primary)" />
          Memuat data {titleLabel.toLowerCase()}...
        </div>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-(--text-muted)">
          Tidak ada data yang cocok dengan filter pencarian.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-(--border-subtle) text-[11px] uppercase tracking-wider text-(--text-muted)">
                <th className="py-3 pr-3">Nama &amp; Akun</th>
                {isMember && <th className="py-3 pr-3">NIS</th>}
                <th className="py-3 pr-3">{isMember ? "Kelas" : "Jabatan"}</th>
                <th className="py-3 pr-3">Telepon</th>
                <th className="py-3 pr-3">Status</th>
                {!readOnly && <th className="py-3 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle)/60">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-(--bg-primary)/50">
                  <td className="py-3 pr-3">
                    <p className="font-semibold text-(--text-primary)">{item.name}</p>
                    <p className="text-xs text-(--text-muted)">
                      @{item.username} {item.email ? `· ${item.email}` : ""}
                    </p>
                  </td>
                  {isMember && (
                    <td className="py-3 pr-3 font-mono text-xs text-(--accent-primary)">
                      {item.member_code || "—"}
                    </td>
                  )}
                  <td className="py-3 pr-3 text-xs text-(--text-primary)">
                    {item.class_name || "—"}
                  </td>
                  <td className="py-3 pr-3 text-xs text-(--text-muted)">
                    {item.phone || "—"}
                  </td>
                  <td className="py-3 pr-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        item.is_active
                          ? "bg-[#2F6B48]/15 text-[#2F6B48] dark:text-[#9FE0B7]"
                          : "bg-[#9E3B33]/15 text-[#9E3B33] dark:text-[#F5ACA6]"
                      }`}
                    >
                      {item.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  {!readOnly && (
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUser(item);
                            setModalOpen(true);
                          }}
                          aria-label={`Ubah ${item.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--border-subtle) text-(--text-primary) hover:border-(--accent-primary) cursor-pointer"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => handleDelete(item)}
                          aria-label={`Hapus ${item.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--border-subtle) text-[#9E3B33] hover:bg-[#9E3B33]/15 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PaginationBar page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />

      {modalOpen && !readOnly && (
        <UserFormModal
          kind={kind}
          editingUser={editingUser}
          onClose={() => setModalOpen(false)}
          onSaved={(msg) => {
            setModalOpen(false);
            setNotice(msg);
            void loadUsers();
            onChanged?.();
          }}
        />
      )}
    </div>
  );
}
