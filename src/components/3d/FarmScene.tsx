import { useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Cloud } from "@react-three/drei";
import * as THREE from "three";
import { DataTree } from "./effects/DataTree";
import { useScroll, useMotionValue, useSpring } from "framer-motion";
import { useDeviceCapability } from "../../hooks/useDeviceCapability";
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";




const CameraRig = () => {
  const { camera } = useThree();
  const { scrollYProgress } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Apply physics-based smoothing to mouse tracking
  const smoothMouseX = useSpring(mouseX, { stiffness: 70, damping: 20, mass: 0.5 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 70, damping: 20, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useFrame(() => {
    const p = scrollYProgress.get();
    
    // Orbit camera around the central tree instead of flying past it
    // Tree is located at [0, -8, -15]
    const angle = p * Math.PI * 1.5; // Orbit 270 degrees over the full scroll
    const radius = 25 - (p * 5); // Start far, get slightly closer
    
    const targetX = Math.sin(angle) * radius + (smoothMouseX.get() * 3);
    const targetZ = -15 + Math.cos(angle) * radius; 
    const targetY = 2 + (p * 12) + (smoothMouseY.get() * 3);

    // Smooth movement
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    
    // Always keep the tree in perfect focus in the center
    camera.lookAt(0, -3, -15);
  });
  
  return null;
};

export const FarmScene = () => {
  const { isMobile, shouldRender3D, prefersReducedMotion } = useDeviceCapability();

  if (!shouldRender3D) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #0d1208 0%, #0A0900 100%)",
          backgroundImage: "url(/screenshots/dashboard.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
        }}
      />
    );
  }

  return (
    <>
      <Canvas
        camera={{ position: [0, 3, 11], fov: 54 }}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
        shadows
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        <fog attach="fog" args={["#130903", 5, 45]} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[18, 22, 12]}
          color="#FFF5D0"
          intensity={2.8}
          castShadow
        />
        
        <CameraRig />
        
        {/* Replaced Icosahedrons with 4D Data Tree and Leaves */}
        <DataTree isMobile={isMobile} />
        
        {/* Reinstated Original Background Elements */}
        <Stars radius={100} depth={50} count={isMobile ? 1000 : 2500} factor={3} fade speed={0.2} />
        <Cloud position={[-10, 14, -22]} speed={0.15} opacity={0.12} color="#F5F0E8" />
        {!isMobile && (
          <Cloud position={[12, 17, -28]} speed={0.1} opacity={0.08} color="#F5F0E8" />
        )}

        {/* Cinematic Post-Processing */}
        {!prefersReducedMotion && (
          <EffectComposer multisampling={0}>
            <Bloom 
              luminanceThreshold={0.1} 
              luminanceSmoothing={0.9} 
              intensity={2.5} 
              mipmapBlur 
            />
            <DepthOfField 
              focusDistance={0.02} 
              focalLength={0.2} 
              bokehScale={8} 
            />
            <ChromaticAberration 
              blendFunction={BlendFunction.NORMAL} 
              offset={new THREE.Vector2(0.006, 0.006)} 
            />
          </EffectComposer>
        )}
      </Canvas>
    </>
  );
};
