import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Denvora Lexora — Where Knowledge Finds Its Way",
  description:
    "Perpustakaan Sekolah Digital berbasis web untuk pengelolaan katalog buku, keanggotaan, dan transaksi peminjaman secara lokal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full bg-[#F6EFE6] text-[#2B1D14] flex flex-col">
        {children}
      </body>
    </html>
  );
}
