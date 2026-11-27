/**
 * @module components/dashboard/BookCoverUploader
 * @description Komponen pratinjau dan unggah gambar sampul buku lokal untuk Admin dan Petugas.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { formatApiError, resolveBookCoverUrl } from "@/lib/api";
import { uploadBookCoverApi } from "@/lib/portalApi";
import type { StaffRolePrefix } from "@/types/library";

interface BookCoverUploaderProps {
  prefix: StaffRolePrefix;
  coverUrl: string;
  onChange: (nextUrl: string) => void;
  onError: (msg: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export function BookCoverUploader({
  prefix,
  coverUrl,
  onChange,
  onError,
  onUploadingChange,
}: BookCoverUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const previewSrc = resolveBookCoverUrl(coverUrl);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      onError("Ukuran gambar maksimal 2 MB.");
      return;
    }

    onError("");
    setUploading(true);
    onUploadingChange?.(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
        reader.readAsDataURL(file);
      });
      const res = await uploadBookCoverApi(prefix, file.name, dataUrl);
      if (res.data?.cover_url) {
        onChange(res.data.cover_url);
      }
    } catch (err) {
      onError(formatApiError(err, "Gagal mengunggah gambar sampul."));
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-(--border-subtle) bg-(--bg-primary) p-3">
      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl border border-(--border-subtle) bg-(--bg-surface) flex items-center justify-center">
        {previewSrc ? (
          <Image src={previewSrc} alt="Preview sampul" fill unoptimized className="object-cover" />
        ) : (
          <ImagePlus size={18} className="text-(--text-muted)" />
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="text-xs font-semibold text-(--text-primary)">Gambar Sampul Buku</p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex h-8 items-center gap-1.5 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-3 text-xs font-semibold text-[#F6EFE6] cursor-pointer">
            {uploading ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
            <span>{uploading ? "Mengunggah..." : "Pilih Gambar"}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
          {coverUrl && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-(--border-subtle) px-2.5 text-xs text-[#9E3B33] cursor-pointer"
            >
              <Trash2 size={12} /> Hapus
            </button>
          )}
        </div>
        <p className="text-[11px] text-(--text-muted) truncate">
          {coverUrl || "PNG, JPG, WEBP, atau SVG maks. 2 MB (disimpan lokal offline)."}
        </p>
      </div>
    </div>
  );
}
