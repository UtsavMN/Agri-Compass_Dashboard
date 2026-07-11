import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Cloud } from "@react-three/drei";
import { motion, useMotionValue } from "framer-motion";
import * as THREE from "three";
import { GoldParticles } from "../3d/effects/GoldParticles";
import { Drone } from "../3d/models/Drone";
import { BirdFlock } from "../3d/models/BirdFlock";
import { GrassField } from "../3d/models/GrassField";

const CropRows = () => {
  const meshes = useRef<THREE.Mesh[]>([]);
  const rows = 10;
  const cols = 18;

  useFrame((state) => {
    meshes.current.forEach((m, i) => {
      if (!m) return;
      m.position.y =
        0.35 + Math.sin(state.clock.elapsedTime * 0.8 + i * 0.3) * 0.04;
    });
  });

  return (
    <>
      {Array.from({ length: rows * cols }).map((_, idx) => {
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        return (
          <mesh
            key={idx}
            ref={(el) => { if (el) meshes.current[idx] = el; }}
            position={[(col - cols / 2) * 1.6, 0.35, (row - rows / 2) * 2]}
            castShadow
          >
            <cylinderGeometry args={[0.07, 0.1, 0.8, 6]} />
            <meshStandardMaterial
              color={`hsl(${108 + row * 4}, 45%, ${18 + Math.random() * 12}%)`}
            />
          </mesh>
        );
      })}
    </>
  );
};

const MouseParallaxCamera = ({
  mouseX,
  mouseY,
}: {
  mouseX: any;
  mouseY: any;
}) => {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x +=
      (mouseX.get() * 1.8 - camera.position.x) * 0.025;
    camera.position.y +=
      (-mouseY.get() * 0.9 + 3 - camera.position.y) * 0.025;
  });
  return null;
};

import { useDeviceCapability } from "../../hooks/useDeviceCapability";

const FarmScene = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { isMobile, prefersReducedMotion, shouldRender3D, particleCount, shadowMapSize } = useDeviceCapability();

  useEffect(() => {
    if (isMobile) return; // Disable parallax on mobile
    const handler = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY, isMobile]);

  if (!shouldRender3D) return null; // Fallback for highly restricted devices

  return (
    <Canvas
      camera={{ position: [0, 3, 11], fov: 54 }}
      gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      shadows={!isMobile}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#080a05"]} />
      <fog attach="fog" args={["#080a05", 28, 72]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[18, 22, 12]}
        color="#FFF5D0"
        intensity={2.2}
        castShadow={!isMobile}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
      />
      <pointLight position={[-10, 5, 4]} color="#C9A84C" intensity={0.7} />

      <Stars radius={100} depth={50} count={isMobile ? 1000 : 2500} factor={3} fade speed={0.2} />
      <Cloud position={[-10, 14, -22]} speed={0.15} opacity={0.12} color="#F5F0E8" />
      
      {!isMobile && (
        <Cloud position={[12, 17, -28]} speed={0.1} opacity={0.08} color="#F5F0E8" />
      )}

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow={!isMobile}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#162008" roughness={0.98} />
      </mesh>

      <CropRows />
      <GrassField count={isMobile ? 800 : 1800} />
      {!prefersReducedMotion && <Drone />}
      {!isMobile && <BirdFlock count={12} />}
      <GoldParticles count={particleCount} />
      {!isMobile && <MouseParallaxCamera mouseX={mouseX} mouseY={mouseY} />}
    </Canvas>
  );
};

export const HeroSection = () => (
  <section className="relative h-screen w-full overflow-hidden bg-[#080a05]">
    <FarmScene />

    {/* Gradient overlays */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0A0900]" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0900]/70 via-transparent to-transparent" />

    {/* Content */}
    <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 z-10 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "auto" }}
        transition={{ delay: 0.4, duration: 1.4 }}
        className="flex items-center gap-2.5 mb-6 overflow-hidden"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse flex-shrink-0" />
        <span className="text-[#C9A84C] text-xs font-mono tracking-[0.28em] uppercase whitespace-nowrap">
          Agri Compass · Karnataka, India · AI-Powered Agriculture
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 55 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif text-5xl md:text-7xl lg:text-[84px] text-[#F5F0E8] leading-[1.08] mb-6"
      >
        Empowering farmers<br />
        through{" "}
        <span className="text-[#C9A84C] relative inline-block">
          AI, Data
          <motion.div
            className="absolute -bottom-1 left-0 h-0.5 bg-[#C9A84C]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1.7, duration: 0.9 }}
          />
        </span>
        <br />
        &amp; Community.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="text-[#F5F0E8]/50 text-lg md:text-xl max-w-lg mb-10 leading-relaxed"
      >
        Crop recommendations, soil intelligence, mandi prices, and a
        Kannada-first AI assistant — built for Karnataka's 12 million farmers.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.7 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <motion.a
          href="#features"
          whileHover={{ scale: 1.05, boxShadow: "0 0 36px rgba(201,168,76,0.45)" }}
          whileTap={{ scale: 0.97 }}
          className="px-9 py-4 bg-[#C9A84C] text-[#0A0900] font-semibold text-base rounded-xl text-center"
        >
          Begin Exploration →
        </motion.a>
        <motion.a
          href="https://agri-compass-v3.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ borderColor: "rgba(201,168,76,0.55)" }}
          className="px-9 py-4 border border-[#2A2720] text-[#F5F0E8]/55
                     rounded-xl hover:text-[#F5F0E8] transition-all text-center"
        >
          Open Live App ↗
        </motion.a>
      </motion.div>
    </div>

    {/* Scroll indicator */}
    <motion.div
      animate={{ y: [0, 14, 0] }}
      transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
    >
      <div className="w-px h-14 bg-gradient-to-b from-[#C9A84C]/50 to-transparent" />
      <p className="text-[#F5F0E8]/18 text-xs font-mono tracking-[0.3em] uppercase">Scroll</p>
    </motion.div>
  </section>
);
