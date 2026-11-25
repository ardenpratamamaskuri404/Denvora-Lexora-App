"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { ApiRequestError, loginApi } from "@/lib/api";
import { getDashboardPath } from "@/types/auth";

type LoginTrack = "siswa" | "staff";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTrack = searchParams.get("role") === "staff" ? "staff" : "siswa";
  const verifiedNotice = searchParams.get("verified") === "1";

  const [track, setTrack] = useState<LoginTrack>(initialTrack);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password) {
      setErrorMsg("Username/email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi(username.trim(), password);
      const user = res.data?.user;
      if (!user) {
        setErrorMsg("Data pengguna tidak ditemukan.");
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
        setErrorMsg("Gagal memproses login. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      illustrationSrc="/images/denvora-login-web.svg"
      illustrationAlt="Ilustrasi 3D Login Denvora Lexora"
    >
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C87E4F]">
          Portal Masuk Perpustakaan
        </p>
        <h1 className="font-editorial mt-1.5 text-3xl font-bold text-[#F6EFE6]">
          Masuk ke Akun
        </h1>
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-full bg-[#1B110B]/70 p-1 border border-[#8C7B6B]/30">
        {(
          [
            { id: "siswa", label: "Siswa" },
            { id: "staff", label: "Admin / Petugas" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTrack(tab.id)}
            className={`rounded-full py-2 text-xs font-semibold transition-all cursor-pointer ${
              track === tab.id
                ? "bg-[#A8643A] text-[#FBF7F1] shadow-xs"
                : "text-[#C2B09E] hover:text-[#F6EFE6]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {verifiedNotice && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-[#2F6B48] bg-[#2F6B48]/25 px-4 py-2.5 text-xs text-[#D5F2DF]">
          <CheckCircle2 size={15} className="shrink-0" />
          <span>Akun Anda sudah terverifikasi OTP. Silakan masuk sekarang.</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 rounded-2xl border border-[#9E3B33] bg-[#9E3B33]/25 px-4 py-2.5 text-xs text-[#FAD5D1]">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          id="login-username"
          label="Username atau Email"
          value={username}
          onChange={setUsername}
          placeholder={track === "siswa" ? "siswa1 atau email" : "admin atau petugas1"}
          autoComplete="username"
        />

        <AuthField
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Masukkan password Anda"
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link
            href="/otp?purpose=login"
            className="inline-flex items-center gap-1.5 text-xs text-[#E9DCCB]/85 hover:text-[#C87E4F] underline-offset-4 hover:underline"
          >
            <KeyRound size={12} />
            Masuk dengan Kode OTP Email?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-full bg-gradient-to-r from-[#C87E4F] to-[#A8643A] hover:from-[#D08A5C] hover:to-[#B56E42] text-sm font-bold text-[#FBF7F1] shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Memeriksa...
            </>
          ) : (
            <>
              Masuk Sekarang <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-[#8C7B6B]/25 pt-5 text-center text-xs text-[#C2B09E]">
        {track === "siswa" ? (
          <p>
            Belum menjadi anggota perpustakaan?{" "}
            <Link href="/register" className="font-semibold text-[#E9DCCB] hover:text-[#C87E4F] underline">
              Daftar Anggota
            </Link>
          </p>
        ) : (
          <p>Masuk menggunakan akun Admin atau Petugas yang terdaftar di perpustakaan.</p>
        )}
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
