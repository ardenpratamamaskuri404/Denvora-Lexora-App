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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  function validateForm(): boolean {
    const errs: Record<string, string> = {};
    if (name.trim().length < 3) errs.name = "Nama minimal 3 karakter";
    if (memberCode.trim().length < 3) errs.member_code = "NIS / Kode anggota minimal 3 karakter";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "Format email tidak valid";
    if (!/^[a-zA-Z0-9_]{4,50}$/.test(username.trim())) {
      errs.username = "Minimal 4 karakter (huruf, angka, atau _)";
    }
    if (password.length < 6) errs.password = "Password minimal 6 karakter";

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
        class_name: className.trim() || undefined,
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
        setGeneralError("Pendaftaran gagal diproses. Silakan coba kembali.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      illustrationSrc="/images/denvora-register-web.svg"
      illustrationAlt="Ilustrasi 3D Pendaftaran Anggota Denvora Lexora"
    >
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C87E4F]">
          Pendaftaran Anggota Perpustakaan
        </p>
        <h1 className="font-editorial mt-1.5 text-3xl sm:text-4xl font-bold text-[#F6EFE6]">
          Daftar Anggota
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#C2B09E] leading-relaxed">
          Lengkapi data berikut untuk mengaktifkan kartu keanggotaan perpustakaan Anda.
        </p>
      </div>

      {generalError && (
        <div className="mb-4 rounded-2xl border border-[#9E3B33] bg-[#9E3B33]/25 px-4 py-2.5 text-xs text-[#FAD5D1]">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <AuthField
          id="reg-name"
          label="Nama Lengkap"
          value={name}
          onChange={setName}
          placeholder="Nama sesuai kartu pelajar"
          error={fieldErrors.name}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <AuthField
            id="reg-nis"
            label="NIS / Kode Anggota"
            value={memberCode}
            onChange={setMemberCode}
            placeholder="Nomor induk siswa"
            error={fieldErrors.member_code}
          />
          <AuthField
            id="reg-class"
            label="Kelas"
            value={className}
            onChange={setClassName}
            placeholder="Contoh: XII RPL 1"
            required={false}
            error={fieldErrors.class_name}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <AuthField
            id="reg-email"
            label="Alamat Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="nama@sekolah.sch.id"
            autoComplete="email"
            error={fieldErrors.email}
          />
          <AuthField
            id="reg-phone"
            label="Nomor Telepon"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="Nomor ponsel aktif"
            required={false}
            error={fieldErrors.phone}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <AuthField
            id="reg-username"
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="Minimal 4 karakter"
            autoComplete="username"
            error={fieldErrors.username}
          />
          <AuthField
            id="reg-password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Minimal 6 karakter"
            autoComplete="new-password"
            error={fieldErrors.password}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-11 w-full rounded-full bg-gradient-to-r from-[#C87E4F] to-[#A8643A] hover:from-[#D08A5C] hover:to-[#B56E42] text-sm font-bold text-[#FBF7F1] shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Memproses Pendaftaran...
            </>
          ) : (
            <>
              Daftar & Verifikasi Email <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-[#C2B09E]">
        Sudah memiliki akun?{" "}
        <Link href="/login" className="font-semibold text-[#E9DCCB] hover:text-[#C87E4F] underline">
          Masuk Sekarang
        </Link>
      </p>
    </AuthShell>
  );
}
