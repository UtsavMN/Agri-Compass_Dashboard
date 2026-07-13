import { Suspense, lazy, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SmoothScrollProvider } from "../providers/SmoothScrollProvider";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { CinematicIntro } from "../components/sections/CinematicIntro";
import { HeroSection } from "../components/sections/HeroSection";
import { DashboardShowcaseSection } from "../components/sections/DashboardShowcaseSection";
import { GoldDivider } from "../components/ui/GoldDivider";
import { CustomCursor } from "../components/ui/CustomCursor";
import { AmbientAudio } from "../components/ui/AmbientAudio";
import { GlobalCanvas } from "../components/3d/GlobalCanvas";

// Lazy loaded components for performance
const ProblemSection = lazy(() => import("../components/sections/ProblemSection").then(m => ({ default: m.ProblemSection })));
const StatsSection = lazy(() => import("../components/sections/StatsSection").then(m => ({ default: m.StatsSection })));
const FeaturesSection = lazy(() => import("../components/sections/FeaturesSection").then(m => ({ default: m.FeaturesSection })));
const SmartFarmSection = lazy(() => import("../components/sections/SmartFarmSection").then(m => ({ default: m.SmartFarmSection })));
const EngineeringLabSection = lazy(() => import("../components/sections/EngineeringLabSection").then(m => ({ default: m.EngineeringLabSection })));
const VoiceSection = lazy(() => import("../components/sections/VoiceSection").then(m => ({ default: m.VoiceSection })));
const TechSection = lazy(() => import("../components/sections/TechSection").then(m => ({ default: m.TechSection })));
const TeamSection = lazy(() => import("../components/sections/TeamSection").then(m => ({ default: m.TeamSection })));
const VisionSection = lazy(() => import("../components/sections/VisionSection").then(m => ({ default: m.VisionSection })));
const UserJourneySection = lazy(() => import("../components/sections/UserJourneySection").then(m => ({ default: m.UserJourneySection })));
const KnowledgeGraphSection = lazy(() => import("../components/sections/KnowledgeGraphSection").then(m => ({ default: m.KnowledgeGraphSection })));
const FinalExperienceSection = lazy(() => import("../components/sections/FinalExperienceSection").then(m => ({ default: m.FinalExperienceSection })));

import { useReducedMotion } from "../hooks/useReducedMotion";

const SectionLoader = () => (
  <div className="h-32 flex items-center justify-center">
    <div className="w-6 h-6 border border-[#E5D08F]/30 rounded-full animate-spin border-t-[#E5D08F]" />
  </div>
);

export const Home = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const prefersReduced = useReducedMotion();

  // We enforce scroll lock while intro is playing
  useEffect(() => {
    if (!introComplete && !prefersReduced) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      // We automatically scroll to the top so the scroll-based sequence begins properly
      window.scrollTo(0, 0);
    }
  }, [introComplete, prefersReduced]);

  return (
    <>
      <CustomCursor />
      <AmbientAudio />

      {/* Global 3D Canvas always present unless reduced motion is preferred */}
      {!prefersReduced && <GlobalCanvas introComplete={introComplete} />}

      <AnimatePresence>
        {!introComplete && (
          <CinematicIntro onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      <SmoothScrollProvider>
        <AnimatePresence>
          {introComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              <Navbar />
              <main className="relative z-10 mix-blend-screen bg-transparent">
                {/* Spacer to push content down for scroll sequence (Earth -> Tree) */}
                <div style={{ height: "40vh" }} />

                <HeroSection />
                <DashboardShowcaseSection />
                <GoldDivider />

                <Suspense fallback={<SectionLoader />}><ProblemSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<SectionLoader />}><KnowledgeGraphSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<SectionLoader />}><UserJourneySection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<SectionLoader />}><SmartFarmSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<SectionLoader />}><VoiceSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<SectionLoader />}><FeaturesSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<SectionLoader />}><EngineeringLabSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<SectionLoader />}><TechSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<SectionLoader />}><StatsSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<SectionLoader />}><VisionSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<SectionLoader />}><TeamSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<SectionLoader />}><FinalExperienceSection /></Suspense>
              </main>
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </SmoothScrollProvider>
    </>
  );
};
