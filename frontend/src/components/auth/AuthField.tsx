"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
  compact?: boolean;
}

export function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  required = true,
  maxLength,
  compact = false,
}: AuthFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <div>
      <label
        htmlFor={id}
        className={`block font-medium tracking-wide text-[#E9DCCB] pl-1 ${
          compact ? "text-[11px] mb-1" : "text-xs mb-1.5"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={resolvedType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          maxLength={maxLength}
          className={`w-full rounded-full border border-[#8C7B6B]/45 bg-[#1B110B]/70 px-4 text-[#F6EFE6] placeholder:text-[#C2B09E]/55 focus:border-[#C87E4F] focus:outline-none focus:ring-2 focus:ring-[#C87E4F]/30 transition-all ${
            isPassword ? "pr-10" : "pr-4"
          } ${compact ? "h-9.5 text-[13px]" : "h-10.5 text-sm"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C2B09E] hover:text-[#F6EFE6] cursor-pointer"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p className="mt-0.5 pl-2 text-[11px] text-[#F39B8F]">{error}</p>}
    </div>
  );
}
