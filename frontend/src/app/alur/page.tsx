import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { FlowView } from "@/components/landing/FlowView";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const metadata: Metadata = {
  title: "Panduan Peminjaman | Denvora Lexora",
  description: "Tiga langkah mudah mendaftar, meminjam, dan mengembalikan buku di Denvora Lexora.",
};

export default function AlurPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <FlowView />
      </main>
      <SiteFooter />
    </div>
  );
}
