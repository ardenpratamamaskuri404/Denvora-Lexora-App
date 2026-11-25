/**
 * @module app/login/page
 * @description Halaman Login terpadu sesuai alur SPK-3/4 dengan dukungan verifikasi dan pemulihan OTP.
 */

"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { ApiRequestError, loginApi } from "@/lib/api";
import { getDashboardPath } from "@/types/auth";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifiedNotice = searchParams.get("verified") === "1";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password) {
      setErrorMsg("Username atau email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi(username.trim(), password);
      const user = res.data?.user;
      if (!user) {
        setErrorMsg("Data akun tidak ditemukan.");
        return;
      }
      const searchQ = searchParams.get("search");
      const target = getDashboardPath(user.role);
      router.push(
        searchQ && user.role === "siswa"
          ? `${target}?search=${encodeURIComponent(searchQ)}`
          : target
      );
    } catch (err) {
      if (err instanceof ApiRequestError) {
        const emailDetail = err.errors.find((item) => item.field === "email")?.message;
        if (err.status === 403 && emailDetail) {
          router.push(`/otp?email=${encodeURIComponent(emailDetail)}&purpose=register`);
          return;
        }
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Tidak dapat memproses permintaan masuk. Silakan coba kembali.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      illustrationSrc="/images/denvora-login-web.svg"
      illustrationAlt="Ilustrasi 3D Portal Masuk Denvora Lexora"
    >
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C87E4F]">
          Sistem Perpustakaan Sekolah Digital
        </p>
        <h1 className="font-editorial mt-1 text-2xl sm:text-3xl font-bold text-[#F6EFE6]">
          Masuk ke Sistem
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-[#C2B09E] leading-relaxed">
          Masukkan username dan password akun perpustakaan Anda untuk melanjutkan.
        </p>
      </div>

      {verifiedNotice && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-[#2F6B48] bg-[#2F6B48]/25 px-3.5 py-2 text-xs text-[#D5F2DF]">
          <CheckCircle2 size={15} className="shrink-0" />
          <span>Keanggotaan Anda telah aktif. Silakan masuk menggunakan username dan password.</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 rounded-2xl border border-[#9E3B33] bg-[#9E3B33]/25 px-3.5 py-2 text-xs text-[#FAD5D1]">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <AuthField
          id="login-username"
          label="Username"
          value={username}
          onChange={setUsername}
          placeholder="Masukkan username atau alamat email"
          autoComplete="username"
        />

        <AuthField
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Masukkan password akun"
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link
            href="/otp?purpose=login"
            className="text-xs font-medium text-[#E9DCCB]/85 hover:text-[#C87E4F] underline-offset-4 hover:underline"
          >
            Lupa Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-10.5 w-full rounded-full bg-gradient-to-r from-[#C87E4F] to-[#A8643A] hover:from-[#D08A5C] hover:to-[#B56E42] text-sm font-bold text-[#FBF7F1] shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Memeriksa...
            </>
          ) : (
            <>
              Masuk <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 border-t border-[#8C7B6B]/25 pt-4 text-center text-xs text-[#C2B09E]">
        <p>
          Belum terdaftar sebagai anggota?{" "}
          <Link href="/register" className="font-semibold text-[#E9DCCB] hover:text-[#C87E4F] underline">
            Daftar Anggota
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginFormContent />
    </Suspense>
  );
}
