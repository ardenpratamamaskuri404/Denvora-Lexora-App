import Link from "next/link";
import { ArrowRight, BookOpenCheck, HelpCircle, Sparkles } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StoryRevealSection } from "@/components/landing/StoryRevealSection";
import { SiteFooter } from "@/components/landing/SiteFooter";

const NAV_CARDS = [
  {
    href: "/fitur",
    title: "Fitur Utama",
    desc: "Jelajahi katalog real-time, portal anggota, dan layanan peminjaman digital.",
    icon: Sparkles,
  },
  {
    href: "/alur",
    title: "Alur Peminjaman",
    desc: "Ikuti 3 langkah mudah dari mencari buku hingga pengembalian tepat waktu.",
    icon: BookOpenCheck,
  },
  {
    href: "/tentang",
    title: "Tentang & FAQ",
    desc: "Pelajari tata tertib perpustakaan, kuota pinjam, serta jawaban pertanyaan umum.",
    icon: HelpCircle,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F6EFE6] text-[#2B1D14] flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <StoryRevealSection />

        <section className="py-16 md:py-20 bg-[#F6EFE6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#A8643A]">
                  Eksplorasi Menu
                </p>
                <h2 className="font-editorial mt-2 text-3xl md:text-4xl font-bold text-[#2B1D14]">
                  Setiap Halaman, Satu Fokus Utama
                </h2>
              </div>
              <p className="text-sm text-[#8C7B6B] max-w-md">
                Pilih halaman di bawah ini untuk melihat fitur, alur peminjaman, maupun informasi lengkap perpustakaan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {NAV_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="group rounded-3xl bg-[#FBF7F1] border border-[#D7C7B4] p-7 shadow-sm hover:shadow-md hover:border-[#A8643A]/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-11 h-11 rounded-2xl bg-[#E9DCCB] text-[#A8643A] flex items-center justify-center mb-5 group-hover:bg-[#A8643A] group-hover:text-[#F6EFE6] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-editorial text-xl font-bold text-[#2B1D14] mb-2">
                        {card.title}
                      </h3>
                      <p className="text-sm text-[#8C7B6B] leading-relaxed">{card.desc}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#A8643A] group-hover:translate-x-1 transition-transform">
                      Buka Halaman <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
