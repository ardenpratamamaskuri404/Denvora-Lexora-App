import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { AboutFaqView } from "@/components/landing/AboutFaqView";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const metadata: Metadata = {
  title: "Tentang & FAQ | Denvora Lexora",
  description: "Tentang sistem perpustakaan Denvora Lexora dan jawaban atas pertanyaan yang sering diajukan.",
};

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#F6EFE6] text-[#2B1D14] flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <AboutFaqView />
      </main>
      <SiteFooter />
    </div>
  );
}
