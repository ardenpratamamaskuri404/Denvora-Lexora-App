/**
 * @module app/register/page
 * @description Halaman pendaftaran anggota siswa baru sesuai alur SPK-3/4 dengan verifikasi OTP.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { ApiRequestError, registerApi } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [className, setClassName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  function validateForm(): boolean {
    const errs: Record<string, string> = {};
    if (name.trim().length < 3) errs.name = "Nama lengkap minimal 3 karakter";
    if (!/^[a-zA-Z0-9_]{4,50}$/.test(username.trim())) {
      errs.username = "Minimal 4 karakter (huruf, angka, atau garis bawah _)";
    }
    if (memberCode.trim().length < 3) errs.member_code = "NIS / Kode anggota minimal 3 karakter";
    if (className.trim().length < 2) errs.class_name = "Kelas wajib diisi (mis. XII RPL 1)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "Format email tidak valid";
    if (phone.trim() && !/^[0-9+\-\s]{8,20}$/.test(phone.trim())) {
      errs.phone = "Nomor telepon harus terdiri dari 8–20 digit";
    }
    if (password.length < 6) errs.password = "Password minimal 6 karakter";
    if (confirmPassword !== password) errs.confirmPassword = "Konfirmasi password tidak cocok";

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      await registerApi({
        name: name.trim(),
        member_code: memberCode.trim(),
        class_name: className.trim(),
        phone: phone.trim() || undefined,
        email: email.trim().toLowerCase(),
        username: username.trim(),
        password,
      });
      router.push(`/otp?email=${encodeURIComponent(email.trim().toLowerCase())}&purpose=register`);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        const mapped: Record<string, string> = {};
        for (const item of err.errors) {
          if (item.field) mapped[item.field] = item.message;
        }
        setFieldErrors(mapped);
        setGeneralError(err.message);
      } else {
        setGeneralError("Pendaftaran belum dapat diproses. Silakan coba kembali.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      wideForm
      illustrationSrc="/images/denvora-register-web.svg"
      illustrationAlt="Ilustrasi 3D Pendaftaran Anggota Denvora Lexora"
    >
      <div className="mb-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C87E4F]">
          Pendaftaran Anggota Siswa
        </p>
        <h1 className="font-editorial mt-1 text-2xl sm:text-[1.75rem] font-bold text-[#F6EFE6]">
          Daftar Anggota
        </h1>
        <p className="mt-1 text-xs text-[#C2B09E] leading-relaxed">
          Lengkapi identitas siswa di bawah ini untuk mengaktifkan keanggotaan perpustakaan.
        </p>
      </div>

      {generalError && (
        <div className="mb-3 rounded-2xl border border-[#9E3B33] bg-[#9E3B33]/25 px-3.5 py-2 text-xs text-[#FAD5D1]">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-7">
            <AuthField
              compact
              id="reg-name"
              label="Nama Lengkap"
              value={name}
              onChange={setName}
              placeholder="Nama lengkap sesuai data sekolah"
              error={fieldErrors.name}
            />
          </div>
          <div className="sm:col-span-5">
            <AuthField
              compact
              id="reg-username"
              label="Username"
              value={username}
              onChange={setUsername}
              placeholder="Minimal 4 karakter"
              autoComplete="username"
              error={fieldErrors.username}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-7">
            <AuthField
              compact
              id="reg-nis"
              label="NIS / Kode Anggota"
              value={memberCode}
              onChange={setMemberCode}
              placeholder="Nomor Induk Siswa"
              error={fieldErrors.member_code}
            />
          </div>
          <div className="sm:col-span-5">
            <AuthField
              compact
              id="reg-class"
              label="Kelas"
              value={className}
              onChange={setClassName}
              placeholder="Contoh: XII RPL 1"
              error={fieldErrors.class_name}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-7">
            <AuthField
              compact
              id="reg-email"
              label="Alamat Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="nama@gmail.com / @denvora.sch.id"
              autoComplete="email"
              error={fieldErrors.email}
            />
          </div>
          <div className="sm:col-span-5">
            <AuthField
              compact
              id="reg-phone"
              label="Nomor Telepon (Opsional)"
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder="Nomor ponsel aktif"
              required={false}
              error={fieldErrors.phone}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AuthField
            compact
            id="reg-password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Minimal 6 karakter"
            autoComplete="new-password"
            error={fieldErrors.password}
          />
          <AuthField
            compact
            id="reg-confirm-password"
            label="Konfirmasi Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Ulangi password"
            autoComplete="new-password"
            error={fieldErrors.confirmPassword}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-1.5 h-10 w-full rounded-full bg-gradient-to-r from-[#C87E4F] to-[#A8643A] hover:from-[#D08A5C] hover:to-[#B56E42] text-sm font-bold text-[#FBF7F1] shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Memproses Pendaftaran...
            </>
          ) : (
            <>
              Daftar & Kirim Kode Verifikasi <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="mt-3.5 border-t border-[#8C7B6B]/25 pt-3 text-center text-xs text-[#C2B09E]">
        Sudah terdaftar sebagai anggota?{" "}
        <Link href="/login" className="font-semibold text-[#E9DCCB] hover:text-[#C87E4F] underline">
          Masuk ke Sistem
        </Link>
      </p>
    </AuthShell>
  );
}
