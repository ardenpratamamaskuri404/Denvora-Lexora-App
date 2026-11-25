import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StoryRevealSection } from "@/components/landing/StoryRevealSection";
import { FeaturesAndFlowSection } from "@/components/landing/FeaturesAndFlowSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F6EFE6] text-[#2B1D14]">
      <LandingNavbar />
      <main>
        <HeroSection />
        <StoryRevealSection />
        <FeaturesAndFlowSection />
      </main>
    </div>
  );
}
