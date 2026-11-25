import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Denvora Lexora — Perpustakaan Digital Sekolah",
  description:
    "Where Knowledge Finds Its Way. Temukan koleksi buku, pantau ketersediaan rak, dan nikmati layanan peminjaman perpustakaan yang tertib.",
};

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('denvora-theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen antialiased bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
