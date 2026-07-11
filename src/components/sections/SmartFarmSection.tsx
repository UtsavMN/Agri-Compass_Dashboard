import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, PresentationControls } from "@react-three/drei";
import { motion, useInView } from "framer-motion";
import * as THREE from "three";

// A stylized 3D representation of a Smart Farm
const MiniatureFarm = () => {
  const farmRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (farmRef.current) {
      farmRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={farmRef} position={[0, -1, 0]}>
      {/* Land base */}
      <mesh receiveShadow position={[0, -0.2, 0]}>
        <cylinderGeometry args={[4, 3.8, 0.4, 32]} />
        <meshStandardMaterial color="#162008" roughness={0.9} />
      </mesh>
      
      {/* Crop rows */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={i} position={[0, 0, (i - 2.5) * 0.6]}>
          {Array.from({ length: 8 }).map((_, j) => (
            <mesh key={j} position={[(j - 3.5) * 0.5, 0.1, 0]} castShadow>
              <boxGeometry args={[0.2, 0.4 + Math.random() * 0.3, 0.2]} />
              <meshStandardMaterial color={Math.random() > 0.5 ? "#7EC47E" : "#C9A84C"} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Sensor Node */}
      <mesh position={[-1.5, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} />
      </mesh>
      <mesh position={[-1.5, 1, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.5} />
      </mesh>

      {/* Floating UI Elements (represented by planes) */}
      <mesh position={[-1.5, 1.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshStandardMaterial color="#111008" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

import { useDeviceCapability } from "../../hooks/useDeviceCapability";

export const SmartFarmSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { isMobile, shouldRender3D, shadowMapSize } = useDeviceCapability();

  return (
    <section id="smart-farm" ref={ref} className="py-32 bg-[#0A0900] relative overflow-hidden border-y border-[#2A2720]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-mono mb-4">
            Interactive Intelligence
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#F5F0E8] mb-6">
            The modern <br />
            <span className="text-[#C9A84C]">Smart Farm.</span>
          </h2>
          <p className="text-[#F5F0E8]/40 text-lg leading-relaxed mb-8 max-w-lg">
            AgriCompass transforms raw data into a digital twin of your farm. 
            Monitor soil health, track hyper-local weather events, and predict crop yields with pinpoint accuracy, all from a unified dashboard.
          </p>
          
          <div className="flex flex-col gap-4">
            {[
              { label: "Real-time Soil NPK Tracking", value: "92% Accuracy" },
              { label: "Predictive Yield Modeling", value: "AI-Powered" },
              { label: "Automated Weather Alerts", value: "5-Day Forecast" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="flex items-center justify-between border-b border-[#2A2720] pb-3 max-w-md"
              >
                <span className="text-[#F5F0E8]/70 text-sm font-mono">{feature.label}</span>
                <span className="text-[#C9A84C] text-xs font-mono">{feature.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 3D Interactive Farm */}
        {shouldRender3D && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-[400px] lg:h-[500px] w-full rounded-2xl border border-[#2A2720] bg-[#111008] relative overflow-hidden"
            style={{ boxShadow: "0 0 40px rgba(201,168,76,0.05)" }}
          >
            <Canvas 
              camera={{ position: [5, 4, 6], fov: 45 }} 
              shadows={!isMobile}
              dpr={isMobile ? [1, 1.5] : [1, 2]}
            >
              <ambientLight intensity={0.4} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1.5} 
                castShadow={!isMobile} 
                shadow-mapSize={[shadowMapSize, shadowMapSize]}
              />
              <pointLight position={[-5, 5, -5]} color="#C9A84C" intensity={1} />
              <PresentationControls 
                global 
                rotation={[0, 0.3, 0]} 
                polar={[-Math.PI / 4, Math.PI / 4]} 
                azimuth={[-Math.PI / 4, Math.PI / 4]}
              >
                <MiniatureFarm />
              </PresentationControls>
              <Environment preset="city" />
            </Canvas>

            {/* Interactive Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#0A0900]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#2A2720]">
              <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
              <span className="text-[#F5F0E8]/40 text-[10px] sm:text-xs font-mono uppercase tracking-widest whitespace-nowrap">Drag to rotate</span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
