/**
 * @module components/dashboard/UserFormModal
 * @description Modal tambah/ubah akun Anggota (siswa) dan Petugas layanan untuk Admin.
 */

"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { formatApiError } from "@/lib/api";
import { createUserApi, updateUserApi } from "@/lib/portalApi";
import type { PortalMemberItem, UserManagePayload, UserResourceKind } from "@/types/library";

interface UserFormModalProps {
  kind: UserResourceKind;
  editingUser: PortalMemberItem | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

export function UserFormModal({
  kind,
  editingUser,
  onClose,
  onSaved,
}: UserFormModalProps) {
  const isMember = kind === "members";
  const label = isMember ? "Anggota Siswa" : "Petugas";

  const [name, setName] = useState(editingUser?.name || "");
  const [email, setEmail] = useState(editingUser?.email || "");
  const [username, setUsername] = useState(editingUser?.username || "");
  const [password, setPassword] = useState("");
  const [memberCode, setMemberCode] = useState(editingUser?.member_code || "");
  const [className, setClassName] = useState(editingUser?.class_name || "");
  const [phone, setPhone] = useState(editingUser?.phone || "");
  const [isActive, setIsActive] = useState(editingUser?.is_active ?? 1);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!editingUser && password.length < 6) {
      setErrorMsg("Password minimal 6 karakter untuk akun baru.");
      return;
    }

    const payload: UserManagePayload = {
      name: name.trim(),
      email: email.trim() ? email.trim().toLowerCase() : null,
      username: username.trim(),
      class_name: className.trim() || null,
      phone: phone.trim() || null,
      is_active: isActive,
      ...(password ? { password } : {}),
      ...(isMember ? { member_code: memberCode.trim() } : {}),
    };

    setSubmitting(true);
    try {
      const res = editingUser
        ? await updateUserApi(kind, editingUser.id, payload)
        : await createUserApi(kind, payload);
      onSaved(res.message);
    } catch (err) {
      setErrorMsg(formatApiError(err, `Gagal menyimpan ${label}.`));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl border border-(--border-subtle) bg-(--surface-elevated) p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-(--border-subtle) pb-3.5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--accent-primary)">
              Manajemen Pengguna
            </p>
            <h3 className="font-editorial text-xl font-bold text-(--text-primary)">
              {editingUser ? `Ubah Data ${label}` : `Tambah ${label}`}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal pengguna"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--border-subtle) text-(--text-muted) cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-2xl border border-[#9E3B33] bg-[#9E3B33]/15 px-3.5 py-2 text-xs text-[#9E3B33] dark:text-[#FAD5D1]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-(--text-primary)">
              Nama Lengkap
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
            <label className="block text-xs font-medium text-(--text-primary)">
              Alamat Email (Opsional)
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gmail.com / @denvora.sch.id"
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-(--text-primary)">
              Username
              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Minimal 4 karakter"
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
            <label className="block text-xs font-medium text-(--text-primary)">
              Password {editingUser ? "(Kosongkan jika tetap)" : ""}
              <input
                type="password"
                required={!editingUser}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {isMember && (
              <label className="block text-xs font-medium text-(--text-primary)">
                NIS / Kode Anggota
                <input
                  required
                  value={memberCode}
                  onChange={(e) => setMemberCode(e.target.value)}
                  placeholder="2025xxx"
                  className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
                />
              </label>
            )}
            <label className="block text-xs font-medium text-(--text-primary)">
              {isMember ? "Kelas" : "Jabatan / Unit"}
              <input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder={isMember ? "XII RPL 1" : "Petugas Layanan"}
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-(--text-primary)">
              Nomor Telepon
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
            <label className="block text-xs font-medium text-(--text-primary)">
              Status Akun
              <select
                value={isActive}
                onChange={(e) => setIsActive(Number(e.target.value))}
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              >
                <option value={1}>Aktif</option>
                <option value={0}>Nonaktif</option>
              </select>
            </label>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-(--border-subtle)">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-full border border-(--border-subtle) px-4 text-xs font-semibold text-(--text-primary) cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-10 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-5 text-xs font-bold text-[#F6EFE6] inline-flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {editingUser ? "Simpan Perubahan" : `Tambah ${label}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
