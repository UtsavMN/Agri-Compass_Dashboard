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
import { GlassPanel } from "../components/primitives/GlassPanel";

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

const CinematicSkeleton = () => (
  <div className="min-h-[40vh] w-full flex items-center justify-center p-6">
    <GlassPanel 
      as={motion.div}
      className="w-full max-w-5xl h-[40vh] flex flex-col items-center justify-center border-none shadow-none bg-[#E5D08F]/5"
      animate={{ opacity: [0.1, 0.4, 0.1] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      interaction="none"
    >
      <div className="flex gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-knowledge-gold)] animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-knowledge-gold)] animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-knowledge-gold)] animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </GlassPanel>
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
                <HeroSection />
                <DashboardShowcaseSection />
                <GoldDivider />

                <Suspense fallback={<CinematicSkeleton />}><ProblemSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<CinematicSkeleton />}><KnowledgeGraphSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<CinematicSkeleton />}><UserJourneySection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<CinematicSkeleton />}><SmartFarmSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<CinematicSkeleton />}><VoiceSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<CinematicSkeleton />}><FeaturesSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<CinematicSkeleton />}><EngineeringLabSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<CinematicSkeleton />}><TechSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<CinematicSkeleton />}><StatsSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<CinematicSkeleton />}><VisionSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<CinematicSkeleton />}><TeamSection /></Suspense>
                <GoldDivider />

                <Suspense fallback={<CinematicSkeleton />}><FinalExperienceSection /></Suspense>
              </main>
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </SmoothScrollProvider>
    </>
  );
};
