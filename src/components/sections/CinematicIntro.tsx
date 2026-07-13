import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassPanel } from "../primitives/GlassPanel";
import { Button } from "../primitives/Button";
import { LAYOUT_SPRING } from "../../constants/springs";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Compass loading animation
const CompassLoader = ({ progress }: { progress: number }) => (
  <motion.div
    className="fixed inset-0 z-50 bg-[#080a05] flex flex-col items-center justify-center"
    exit={{ opacity: 0, transition: { duration: 1.2 } }}
  >
    <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-8 drop-shadow-[0_0_15px_rgba(229,208,143,0.2)]">
      {/* Compass Body */}
      <circle cx="24" cy="24" r="22" stroke="#E5D08F" strokeWidth="2" fill="transparent" />
      <circle cx="24" cy="24" r="18" stroke="#E5D08F" strokeWidth="0.5" strokeDasharray="2 4" fill="transparent" opacity="0.5" />
      {/* Compass Tick Marks */}
      <path d="M24 2 V 6 M24 42 V 46 M2 24 H 6 M42 24 H 46" stroke="#E5D08F" strokeWidth="2" strokeLinecap="round" />
      
      {/* Rotating Needle */}
      <motion.g 
        animate={{ rotate: [0, 45, -20, 180, 160, 320, 360] }} 
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} 
        style={{ transformOrigin: "24px 24px" }}
      >
        {/* Shadow */}
        <path d="M24 8 L 29 24 L 24 40 L 19 24 Z" fill="#000" opacity="0.3" transform="translate(1, 2)" />
        {/* South Pointer */}
        <path d="M24 8 L 29 24 L 24 40 L 19 24 Z" fill="#E5D08F" opacity="0.3" />
        {/* North Pointer */}
        <path d="M24 8 L 29 24 L 19 24 Z" fill="#EF4444" /> 
      </motion.g>

      {/* Center Pin */}
      <circle cx="24" cy="24" r="3" fill="#E5D08F" />
      <circle cx="24" cy="24" r="1" fill="#080a05" />
    </svg>
    <div className="w-52 h-0.5 bg-[#2A2720] rounded-full overflow-hidden mb-6">
      <motion.div 
        className="h-full bg-[#E5D08F] rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={LAYOUT_SPRING}
      />
    </div>
    <p className="text-[#F5F0E8]/20 text-xs font-mono tracking-[0.3em] uppercase">
      Initialising AgriCompass
    </p>
  </motion.div>
);

// Floating data overlay cards
const DataCard = ({
  label, value, color, delay,
}: { label: string; value: string; color: string; delay: number }) => (
  <GlassPanel
    as={motion.div}
    initial={{ opacity: 0, scale: 0.85, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ ...LAYOUT_SPRING, delay }}
    className="rounded-xl px-5 py-3.5"
    style={{ boxShadow: `0 0 24px ${color}25` }}
  >
    <p className="text-[9px] font-mono text-[#F5F0E8]/30 uppercase tracking-[0.3em] mb-1">
      {label}
    </p>
    <p className="font-semibold text-xl leading-none" style={{ color }}>
      {value}
    </p>
  </GlassPanel>
);

const phases = [
  { text: "India · 170 million hectares of farmland", sub: "The world's second-largest agricultural economy" },
  { text: "Karnataka · 12 million farmers", sub: "Decisions made daily without data" },
  { text: "Every acre deserves intelligent decisions", sub: "Traditional knowledge is disappearing" },
  { text: "AI scanning soil, weather, markets", sub: "Real-time intelligence for every farm" },
  { text: "AgriCompass — empowering farmers through data", sub: "Built by engineers who believe farming can be smarter" },
];

export const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const prefersReduced = useReducedMotion();


  // Skip intro entirely if reduced motion is requested
  useEffect(() => {
    if (prefersReduced) {
      setTimeout(() => onComplete(), 500);
    }
  }, [prefersReduced, onComplete]);

  // Fake progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => { setLoaded(true); setShowSkip(true); }, 400);
          return 100;
        }
        return p + Math.random() * 7 + 2;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Phase timeline: 0→4s→8s→13s→18s→24s
  useEffect(() => {
    if (!loaded) return;
    const timings = [0, 4000, 8500, 13500, 18500, 25000];
    const timers = timings.map((t, i) =>
      setTimeout(() => {
        if (i < 5) setPhase(i);
        else onComplete();
      }, t)
    );
    return () => timers.forEach(clearTimeout);
  }, [loaded, onComplete]);

  if (prefersReduced) return null;

  return (
    <>
      <AnimatePresence>
        {!loaded && <CompassLoader progress={loadProgress} />}
      </AnimatePresence>

      {/* Phase text overlay */}
      <div className="fixed inset-0 z-20 pointer-events-none flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {loaded && phases[phase] && (
            <motion.div key={phase} className="text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={LAYOUT_SPRING}>
              <p className="text-[#F5F0E8] text-2xl md:text-3xl font-serif mb-2 tracking-tight">
                {phases[phase].text}
              </p>
              <p className="text-[#F5F0E8]/40 text-sm font-mono tracking-wide">
                {phases[phase].sub}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data overlays in phase 4 */}
        {phase === 4 && (
          <div className="flex flex-wrap gap-4 justify-center mt-12">
            <DataCard label="Soil Health" value="92 Index" color="#7EC47E" delay={0} />
            <DataCard label="Temperature" value="28°C" color="#E5D08F" delay={0.15} />
            <DataCard label="Mandi Price" value="₹6,620/Q" color="#E5D08F" delay={0.3} />
            <DataCard label="AI Score" value="95% Ragi" color="#7EC47E" delay={0.45} />
          </div>
        )}
      </div>

      {/* Skip button */}
      <AnimatePresence>
        {showSkip && (
          <Button
            variant="ghost"
            className="fixed top-6 right-6 z-50 text-xs font-mono pointer-events-auto"
            onClick={onComplete}
          >
            [ SKIP INTRO ]
          </Button>
        )}
      </AnimatePresence>
    </>
  );
};
