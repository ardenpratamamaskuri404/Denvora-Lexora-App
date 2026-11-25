import Link from "next/link";
import { ArrowRight, BookMarked, Clock, ShieldCheck } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StoryRevealSection } from "@/components/landing/StoryRevealSection";
import { SiteFooter } from "@/components/landing/SiteFooter";

const LIBRARY_PILLARS = [
  {
    href: "/fitur",
    title: "Katalog & Ketersediaan",
    desc: "Cari ribuan koleksi bacaan berdasarkan judul, pengarang, dan status rak terkini.",
    linkLabel: "Lihat Layanan",
    icon: BookMarked,
  },
  {
    href: "/alur",
    title: "Sirkulasi Tertib",
    desc: "Proses peminjaman dan pengembalian yang ringkas dengan masa pinjam terukur 7 hari.",
    linkLabel: "Lihat Panduan",
    icon: Clock,
  },
  {
    href: "/tentang",
    title: "Ruang Literasi Sekolah",
    desc: "Pelajari tata tertib keanggotaan, jam layanan perpustakaan, serta jawaban umum.",
    linkLabel: "Tentang Perpustakaan",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <StoryRevealSection />

        <section className="py-16 md:py-24 bg-[var(--bg-primary)] transition-colors">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
                  Pengalaman Membaca Lebih Nyaman
                </p>
                <h2 className="font-editorial mt-2 text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                  Semua Kebutuhan Literasi dalam Satu Tempat
                </h2>
              </div>
              <p className="text-sm text-[var(--text-muted)] max-w-md leading-relaxed">
                Dirancang untuk mendukung kebiasaan membaca siswa dan menjaga koleksi
                perpustakaan tetap rapi dan terawat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {LIBRARY_PILLARS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] p-7 shadow-xs hover:shadow-md hover:border-[var(--accent-primary)]/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-11 h-11 rounded-2xl bg-[var(--bg-surface)] text-[var(--accent-primary)] flex items-center justify-center mb-5 group-hover:bg-[var(--accent-primary)] group-hover:text-[#F6EFE6] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform">
                      {item.linkLabel} <ArrowRight className="w-4 h-4" />
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
