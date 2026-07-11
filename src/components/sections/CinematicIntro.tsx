import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import gsap from "gsap";
import { GoldParticles } from "../3d/effects/GoldParticles";

// Earth sphere
const EarthGlobe = () => {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 0.07;
  });
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[2.2, 64, 64]} />
      <meshStandardMaterial
        color="#1a3a2a"
        roughness={0.8}
        metalness={0.1}
        emissive="#091a0f"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

// India highlight dot
const IndiaPin = () => (
  <mesh position={[0.45, 0.18, 2.1]}>
    <sphereGeometry args={[0.06, 16, 16]} />
    <meshStandardMaterial
      color="#C9A84C"
      emissive="#C9A84C"
      emissiveIntensity={3}
    />
  </mesh>
);

// Karnataka pulse ring
const KarnatakaPulse = () => {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ring.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      ring.current.scale.set(s, s, s);
      (ring.current.material as THREE.MeshStandardMaterial).opacity =
        0.6 - Math.sin(state.clock.elapsedTime * 2) * 0.4;
    }
  });
  return (
    <mesh ref={ring} position={[0.45, 0.18, 2.1]}>
      <ringGeometry args={[0.1, 0.18, 32]} />
      <meshStandardMaterial
        color="#C9A84C"
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Animated camera
const CinematicCamera = ({ phase }: { phase: number }) => {
  const { camera } = useThree();

  useEffect(() => {
    const positions = [
      { x: 0, y: 1, z: 11 },   // Earth from space
      { x: 0.6, y: 0.3, z: 6 }, // Zoom to India
      { x: 0, y: 5, z: 4 },    // Karnataka farmland
      { x: 3, y: 7, z: 5 },    // Drone scanning
      { x: 0, y: 3.5, z: 7 },  // Data overlays
    ];
    const p = positions[Math.min(phase, positions.length - 1)];
    gsap.to(camera.position, {
      x: p.x, y: p.y, z: p.z,
      duration: 2.8,
      ease: "power2.inOut",
    });
  }, [phase, camera]);

  return null;
};

// Compass loading animation
const CompassLoader = ({ progress }: { progress: number }) => (
  <motion.div
    className="fixed inset-0 z-50 bg-[#0A0900] flex flex-col items-center justify-center"
    exit={{ opacity: 0, transition: { duration: 1.2 } }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
      className="text-7xl mb-8 select-none"
    >
      🧭
    </motion.div>
    <div className="w-52 h-0.5 bg-[#2A2720] rounded-full overflow-hidden mb-5">
      <motion.div
        className="h-full bg-[#C9A84C] rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
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
    transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="bg-[#111008]/90 backdrop-blur-xl border border-[#2A2720]
               rounded-xl px-5 py-3.5"
    style={{ boxShadow: `0 0 24px ${color}25` }}
  >
    <p className="text-[9px] font-mono text-[#F5F0E8]/30 uppercase tracking-wider mb-1">
      {label}
    </p>
    <p className="font-semibold text-xl leading-none" style={{ color }}>
      {value}
    </p>
  </motion.div>
);

const phases = [
  { text: "India · 170 million hectares of farmland", sub: "The world's second-largest agricultural economy" },
  { text: "Karnataka · 12 million farmers", sub: "Decisions made daily without data" },
  { text: "Every acre deserves intelligent decisions", sub: "Traditional knowledge is disappearing" },
  { text: "AI scanning soil, weather, markets", sub: "Real-time intelligence for every farm" },
  { text: "AgriCompass — empowering farmers through data", sub: "Built by engineers who believe farming can be smarter" },
];

import { useDeviceCapability } from "../../hooks/useDeviceCapability";

export const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const { isMobile, shouldRender3D, particleCount } = useDeviceCapability();

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

  return (
    <>
      <AnimatePresence>
        {!loaded && <CompassLoader progress={loadProgress} />}
      </AnimatePresence>

      {/* 3D Scene */}
      {shouldRender3D && (
        <div className="fixed inset-0 z-10">
          <Canvas
            camera={{ position: [0, 1, 11], fov: 48 }}
            gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
          >
            <ambientLight intensity={0.12} />
            <directionalLight position={[10, 12, 8]} color="#FFF5E0" intensity={1.8} />
            <pointLight position={[-6, 4, 6]} color="#C9A84C" intensity={0.9} />

            <Stars radius={200} depth={60} count={isMobile ? 1500 : 4000} factor={5} fade speed={0.15} />
            <CinematicCamera phase={phase} />

            {phase <= 1 && (
              <Float speed={0.4} rotationIntensity={0.08}>
                <EarthGlobe />
                {phase === 1 && <IndiaPin />}
                {phase === 1 && <KarnatakaPulse />}
              </Float>
            )}

            {phase >= 2 && <GoldParticles count={particleCount} />}
            {phase >= 2 && <fog attach="fog" args={["#080704", 22, 65]} />}
          </Canvas>
        </div>
      )}

      {/* Phase text overlay */}
      <div className="fixed inset-0 z-20 pointer-events-none flex flex-col items-center justify-end pb-28 px-6">
        <AnimatePresence mode="wait">
          {loaded && phases[phase] && (
            <motion.div key={phase} className="text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.9 }}>
              <p className="text-[#F5F0E8]/80 text-lg md:text-xl font-serif mb-2">
                {phases[phase].text}
              </p>
              <p className="text-[#F5F0E8]/30 text-sm font-mono">
                {phases[phase].sub}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data overlays in phase 4 */}
        {phase === 4 && (
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <DataCard label="Soil Health" value="92 Index" color="#7EC47E" delay={0} />
            <DataCard label="Temperature" value="28°C" color="#C9A84C" delay={0.15} />
            <DataCard label="Mandi Price" value="₹6,620/Q" color="#C9A84C" delay={0.3} />
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
            className="fixed top-6 right-6 z-50 text-[#F5F0E8]/30 text-xs font-mono
                       border border-[#2A2720] px-4 py-2.5 rounded-lg
                       hover:text-[#F5F0E8]/60 hover:border-[#C9A84C]/30
                       transition-all backdrop-blur-sm bg-[#0A0900]/50 pointer-events-auto"
          >
            Skip intro →
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
