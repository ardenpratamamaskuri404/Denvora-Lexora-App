import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { FeaturesView } from "@/components/landing/FeaturesView";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const metadata: Metadata = {
  title: "Layanan Perpustakaan | Denvora Lexora",
  description: "Berbagai layanan katalog buku, pencarian koleksi, dan pencatatan pinjaman Denvora Lexora.",
};

export default function FiturPage() {
  return (
    <div className="min-h-screen bg-[#F6EFE6] text-[#2B1D14] flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <FeaturesView />
      </main>
      <SiteFooter />
    </div>
  );
}
