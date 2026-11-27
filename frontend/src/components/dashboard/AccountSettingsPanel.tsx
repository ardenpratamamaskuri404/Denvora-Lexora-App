/**
 * @module components/dashboard/AccountSettingsPanel
 * @description Panel pengaturan profil pribadi dan keamanan password untuk semua peran (Admin, Petugas, Siswa).
 */

"use client";

import { useState } from "react";
import { CheckCircle2, KeyRound, Loader2, Shield, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { changePasswordApi, formatApiError, updateProfileApi } from "@/lib/api";
import type { AuthUser } from "@/types/auth";

interface AccountSettingsPanelProps {
  user: AuthUser;
  onUserUpdated: (user: AuthUser) => void;
}

export function AccountSettingsPanel({
  user,
  onUserUpdated,
}: AccountSettingsPanelProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || "");
  const [className, setClassName] = useState(user.class_name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileNotice, setProfileNotice] = useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPass, setSavingPass] = useState(false);
  const [passNotice, setPassNotice] = useState("");
  const [passError, setPassError] = useState("");

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileNotice("");
    setProfileError("");
    setSavingProfile(true);
    try {
      const res = await updateProfileApi({
        name: name.trim(),
        email: email.trim() || null,
        class_name: className.trim() || null,
        phone: phone.trim() || null,
      });
      if (res.data?.user) {
        onUserUpdated(res.data.user);
      }
      setProfileNotice(res.message);
    } catch (err) {
      setProfileError(formatApiError(err, "Gagal memperbarui profil akun."));
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassNotice("");
    setPassError("");
    if (newPassword.length < 6) {
      setPassError("Password baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setSavingPass(true);
    try {
      const res = await changePasswordApi({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPassNotice(res.message);
    } catch (err) {
      setPassError(formatApiError(err, "Gagal mengubah password."));
    } finally {
      setSavingPass(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <Card className="lg:col-span-7">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck size={18} className="text-(--accent-primary)" />
            <span>Identitas &amp; Profil Akun</span>
          </CardTitle>
          <CardDescription>
            Perbarui informasi kontak, kelas/unit, dan email aktif Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-(--border-subtle) bg-(--bg-primary) px-3.5 py-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-(--accent-primary)">
              <Shield size={13} /> Peran: {user.role.toUpperCase()}
            </span>
            <span className="text-(--text-muted)">·</span>
            <span className="text-(--text-primary)">Username: @{user.username}</span>
            {user.member_code && (
              <>
                <span className="text-(--text-muted)">·</span>
                <span className="text-(--text-primary)">NIS: {user.member_code}</span>
              </>
            )}
          </div>

          {profileNotice && (
            <div className="mb-3 flex items-center gap-2 rounded-2xl border border-[#2F6B48] bg-[#2F6B48]/15 px-3.5 py-2 text-xs text-[#2F6B48] dark:text-[#9FE0B7]">
              <CheckCircle2 size={15} /> {profileNotice}
            </div>
          )}
          {profileError && (
            <div className="mb-3 rounded-2xl border border-[#9E3B33] bg-[#9E3B33]/15 px-3.5 py-2 text-xs text-[#9E3B33] dark:text-[#FAD5D1]">
              {profileError}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block text-xs font-medium text-(--text-primary)">
                Nama Lengkap
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
                />
              </label>
              <label className="block text-xs font-medium text-(--text-primary)">
                Alamat Email
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
                {user.role === "siswa" ? "Kelas" : "Unit / Jabatan"}
                <input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
                />
              </label>
              <label className="block text-xs font-medium text-(--text-primary)">
                Nomor Telepon
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="h-10 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-5 text-xs font-bold text-[#F6EFE6] inline-flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
              >
                {savingProfile && <Loader2 size={14} className="animate-spin" />}
                Simpan Profil
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound size={18} className="text-(--accent-primary)" />
            <span>Ubah Password</span>
          </CardTitle>
          <CardDescription>
            Perbarui kata sandi secara berkala untuk menjaga keamanan akun.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {passNotice && (
            <div className="mb-3 flex items-center gap-2 rounded-2xl border border-[#2F6B48] bg-[#2F6B48]/15 px-3.5 py-2 text-xs text-[#2F6B48] dark:text-[#9FE0B7]">
              <CheckCircle2 size={15} /> {passNotice}
            </div>
          )}
          {passError && (
            <div className="mb-3 rounded-2xl border border-[#9E3B33] bg-[#9E3B33]/15 px-3.5 py-2 text-xs text-[#9E3B33] dark:text-[#FAD5D1]">
              {passError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <label className="block text-xs font-medium text-(--text-primary)">
              Password Saat Ini
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
            <label className="block text-xs font-medium text-(--text-primary)">
              Password Baru
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
            <label className="block text-xs font-medium text-(--text-primary)">
              Konfirmasi Password Baru
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingPass}
                className="h-10 rounded-full border border-(--accent-primary) text-(--accent-primary) hover:bg-(--accent-primary) hover:text-[#F6EFE6] px-5 text-xs font-bold inline-flex items-center gap-1.5 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {savingPass && <Loader2 size={14} className="animate-spin" />}
                Perbarui Password
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
