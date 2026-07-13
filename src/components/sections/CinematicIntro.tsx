import { useState, useEffect } from"react";
import { motion, AnimatePresence } from"framer-motion";
import { LAYOUT_SPRING } from"../../constants/springs";
import { useReducedMotion } from"../../hooks/useReducedMotion";

// Compass loading animation
const CompassLoader = ({ progress }: { progress: number }) => (
  <motion.div
    className="fixed inset-0 z-50 bg-[#080a05] flex flex-col items-center justify-center"
    exit={{ opacity: 0, transition: { duration: 1.2 } }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 2.5, ease:"linear" }}
      className="text-7xl mb-8 select-none"
    >
      🧭
    </motion.div>
    <div className="w-52 h-0.5 bg-[#2A2720] rounded-full overflow-hidden mb-6">
      <motion.div
        className="h-full bg-[#E5D08F] rounded-full"
        initial={{ width:"0%" }}
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
  <motion.div
    initial={{ opacity: 0, scale: 0.85, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ ...LAYOUT_SPRING, delay }}
    className="rounded-xl px-5 py-3.5 premium-card"
    style={{ boxShadow: `0 0 24px ${color}25` }}
  >
    <p className="text-[9px] font-mono text-[#F5F0E8]/30 uppercase tracking-[0.3em] mb-1">
      {label}
    </p>
    <p className="font-semibold text-xl leading-none" style={{ color }}>
      {value}
    </p>
  </motion.div>
);

const phases = [
  { text:"India · 170 million hectares of farmland", sub:"The world's second-largest agricultural economy" },
  { text:"Karnataka · 12 million farmers", sub:"Decisions made daily without data" },
  { text:"Every acre deserves intelligent decisions", sub:"Traditional knowledge is disappearing" },
  { text:"AI scanning soil, weather, markets", sub:"Real-time intelligence for every farm" },
  { text:"AgriCompass — empowering farmers through data", sub:"Built by engineers who believe farming can be smarter" },
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
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onComplete}
            className="fixed top-6 right-6 z-50 text-xs font-mono pointer-events-auto btn-ghost"
          >
            Skip intro →
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
