import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Denvora Lexora — Perpustakaan Digital Sekolah",
  description:
    "Where Knowledge Finds Its Way. Temukan koleksi buku, pantau ketersediaan rak, dan nikmati layanan peminjaman perpustakaan yang tertib.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased bg-[#F6EFE6] text-[#2B1D14]">
        {children}
      </body>
    </html>
  );
}
