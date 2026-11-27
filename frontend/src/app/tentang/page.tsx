import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { AboutFaqView } from "@/components/landing/AboutFaqView";
import { AboutMoreSections } from "@/components/landing/AboutMoreSections";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const metadata: Metadata = {
  title: "Tentang Kami | Denvora Lexora",
  description: "Mengenal perpustakaan digital Denvora Lexora dan jawaban atas pertanyaan umum pembaca.",
};

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <AboutFaqView />
        <AboutMoreSections />
      </main>
      <SiteFooter />
    </div>
  );
}
