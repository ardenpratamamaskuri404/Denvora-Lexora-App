import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StoryRevealSection } from "@/components/landing/StoryRevealSection";
import { BrandStorySection } from "@/components/landing/BrandStorySection";
import { ExplorePillarsSection } from "@/components/landing/ExplorePillarsSection";
import { HomeExtraSections } from "@/components/landing/HomeExtraSections";
import { SiteFooter } from "@/components/landing/SiteFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <StoryRevealSection />
        <BrandStorySection />
        <ExplorePillarsSection />
        <HomeExtraSections />
      </main>
      <SiteFooter />
    </div>
  );
}
