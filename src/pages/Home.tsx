import { useState, lazy, Suspense } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

// Lazy loaded heavy 3D/animation components
const CinematicIntro = lazy(() => import("../components/sections/CinematicIntro").then(m => ({ default: m.CinematicIntro })));
const HeroSection = lazy(() => import("../components/sections/HeroSection").then(m => ({ default: m.HeroSection })));
const SmartFarmSection = lazy(() => import("../components/sections/SmartFarmSection").then(m => ({ default: m.SmartFarmSection })));

// Standard components (keep fast)
import { ProblemSection } from "../components/sections/ProblemSection";
import { StatsSection } from "../components/sections/StatsSection";
import { FeaturesSection } from "../components/sections/FeaturesSection";
import { EngineeringLabSection } from "../components/sections/EngineeringLabSection";
import { VoiceSection } from "../components/sections/VoiceSection";
import { TechSection } from "../components/sections/TechSection";
import { TeamSection } from "../components/sections/TeamSection";
import { VisionSection } from "../components/sections/VisionSection";
import { ProductShowcaseSection } from "../components/sections/ProductShowcaseSection";
import { FinalExperienceSection } from "../components/sections/FinalExperienceSection";

const LoadingFallback = () => (
  <div className="w-full h-screen flex items-center justify-center bg-[#0A0900]">
    <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-[#C9A84C] animate-spin" />
  </div>
);

const SectionFallback = () => (
  <div className="w-full h-96 flex flex-col items-center justify-center bg-[#0A0900] opacity-50">
    <div className="w-4 h-4 rounded-full border-2 border-[#C9A84C] animate-ping" />
  </div>
);

export const Home = () => {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {!introComplete && (
        <Suspense fallback={<LoadingFallback />}>
          <CinematicIntro onComplete={() => setIntroComplete(true)} />
        </Suspense>
      )}
      
      {introComplete && (
        <main className="bg-[#0A0900] min-h-screen">
          <Navbar />
          
          <Suspense fallback={<SectionFallback />}>
            <HeroSection />
          </Suspense>
          
          <ProblemSection />
          <StatsSection />
          <FeaturesSection />
          
          <Suspense fallback={<SectionFallback />}>
            <SmartFarmSection />
          </Suspense>
          
          <EngineeringLabSection />
          <VoiceSection />
          <TechSection />
          <TeamSection />
          <VisionSection />
          <ProductShowcaseSection />
          <FinalExperienceSection />
          
          <Footer />
        </main>
      )}
    </>
  );
};
