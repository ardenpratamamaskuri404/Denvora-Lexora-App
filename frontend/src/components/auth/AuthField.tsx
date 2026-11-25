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
}: AuthFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium tracking-wide text-[#E9DCCB] mb-1.5 pl-1"
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
          className="h-11 w-full rounded-full border border-[#8C7B6B]/45 bg-[#1B110B]/70 px-4 text-sm text-[#F6EFE6] placeholder:text-[#C2B09E]/55 focus:border-[#C87E4F] focus:outline-none focus:ring-2 focus:ring-[#C87E4F]/30 transition-all pr-11"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C2B09E] hover:text-[#F6EFE6] cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 pl-2 text-xs text-[#F39B8F]">{error}</p>}
    </div>
  );
}
