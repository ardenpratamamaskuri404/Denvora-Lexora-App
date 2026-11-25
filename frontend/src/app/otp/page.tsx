"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ExternalLink, Loader2, MailCheck, RefreshCw } from "lucide-react";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { ApiRequestError, sendOtpApi, verifyOtpApi } from "@/lib/api";
import { getDashboardPath, type OtpPurpose } from "@/types/auth";

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const purpose: OtpPurpose = searchParams.get("purpose") === "register" ? "register" : "login";

  const [email, setEmail] = useState(initialEmail);
  const [step, setStep] = useState<"email" | "code">(initialEmail ? "code" : "email");
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(initialEmail ? 45 : 0);
  const [infoMsg, setInfoMsg] = useState(
    initialEmail ? `Kode OTP 6 digit telah dikirim ke ${initialEmail}.` : ""
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleSendOtp(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setErrorMsg("Masukkan alamat email yang valid.");
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtpApi(clean, purpose);
      setStep("code");
      setCooldown(45);
      setInfoMsg(res.message);
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : "Gagal mengirim OTP.");
    } finally {
      setLoading(false);
    }
  }

  function handleDigitChange(index: number, raw: string) {
    const clean = raw.replace(/\D/g, "");
    if (!clean) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }
    const next = [...digits];
    if (clean.length > 1) {
      clean.slice(0, 6).split("").forEach((ch, idx) => {
        if (index + idx < 6) next[index + idx] = ch;
      });
      setDigits(next);
      inputRefs.current[Math.min(index + clean.length, 5)]?.focus();
      return;
    }
    next[index] = clean;
    setDigits(next);
    if (index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    const code = digits.join("");
    if (code.length !== 6) {
      setErrorMsg("Masukkan 6 digit kode OTP dari Mailpit.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtpApi(email.trim().toLowerCase(), code, purpose);
      const user = res.data?.user;
      if (purpose === "register") {
        router.push("/login?verified=1");
        return;
      }
      router.push(user ? getDashboardPath(user.role) : "/siswa");
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : "Kode OTP tidak valid.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      illustrationSrc="/images/denvora-otp-web.svg"
      illustrationAlt="Ilustrasi 3D Verifikasi OTP Mailpit Denvora Lexora"
    >
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C87E4F]">
          Verifikasi Mailpit Lokal
        </p>
        <h1 className="font-editorial mt-1.5 text-2xl sm:text-3xl font-bold text-[#F6EFE6]">
          {purpose === "register" ? "Verifikasi Akun Baru" : "Masuk dengan Kode OTP"}
        </h1>
        <p className="mt-1.5 text-xs text-[#C2B09E] leading-relaxed">
          Periksa pesan masuk pada kotak surat lokal Mailpit Anda untuk melihat kode 6 digit.
        </p>
      </div>

      {infoMsg && (
        <div className="mb-4 flex items-start gap-2 rounded-2xl border border-[#A8643A]/60 bg-[#A8643A]/20 px-4 py-2.5 text-xs text-[#F6EFE6]">
          <MailCheck size={15} className="shrink-0 mt-0.5 text-[#C87E4F]" />
          <span>{infoMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 rounded-2xl border border-[#9E3B33] bg-[#9E3B33]/25 px-4 py-2.5 text-xs text-[#FAD5D1]">
          {errorMsg}
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <AuthField
            id="otp-email"
            label="Email Terdaftar"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="siswa1@denvora.local"
            autoComplete="email"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-full bg-gradient-to-r from-[#C87E4F] to-[#A8643A] text-sm font-bold text-[#FBF7F1] shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Kirim Kode OTP ke Mailpit"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs text-[#C2B09E] mb-2">
              <span>Kode OTP untuk <strong className="text-[#F6EFE6]">{email}</strong></span>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-[#C87E4F] hover:underline cursor-pointer"
              >
                Ganti Email
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  aria-label={`Digit OTP ${idx + 1}`}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="h-12 sm:h-14 w-full rounded-2xl border border-[#8C7B6B]/50 bg-[#1B110B]/75 text-center font-mono text-xl font-bold text-[#F6EFE6] focus:border-[#C87E4F] focus:outline-none focus:ring-2 focus:ring-[#C87E4F]/30"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-full bg-gradient-to-r from-[#C87E4F] to-[#A8643A] text-sm font-bold text-[#FBF7F1] shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Memverifikasi...
              </>
            ) : (
              <>
                Verifikasi OTP <ArrowRight size={16} />
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#C2B09E]">
            <button
              type="button"
              disabled={cooldown > 0 || loading}
              onClick={() => handleSendOtp()}
              className="inline-flex items-center gap-1.5 text-[#E9DCCB] hover:text-[#C87E4F] disabled:opacity-45 cursor-pointer"
            >
              <RefreshCw size={12} />
              {cooldown > 0 ? `Kirim ulang (${cooldown}d)` : "Kirim Ulang Kode"}
            </button>

            <a
              href="http://127.0.0.1:8025"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#C87E4F] hover:underline"
            >
              Buka Mailpit Web <ExternalLink size={12} />
            </a>
          </div>
        </form>
      )}

      <p className="mt-6 border-t border-[#8C7B6B]/25 pt-5 text-center text-xs text-[#C2B09E]">
        Kembali ke halaman{" "}
        <Link href="/login" className="font-semibold text-[#E9DCCB] hover:text-[#C87E4F] underline">
          Masuk dengan Password
        </Link>
      </p>
    </AuthShell>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={null}>
      <OtpContent />
    </Suspense>
  );
}
