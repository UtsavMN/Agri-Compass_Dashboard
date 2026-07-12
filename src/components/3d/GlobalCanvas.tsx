import { useEffect, useState, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useScroll, useSpring } from "framer-motion";
import * as THREE from "three";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";
import { PerformanceMonitor } from "@react-three/drei";

// Importing the elements we'll build
import { CinematicEarth } from "./CinematicEarth";
import { ProceduralTree } from "./ProceduralTree";
import { BackgroundLayers } from "./BackgroundLayers";
import { FallingLeaves } from "./effects/FallingLeaves";
import { Butterflies } from "./effects/Butterflies";
import { Universe } from "./Universe";

const cameraPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 1.5, 6),       // 0: Universe view
  new THREE.Vector3(0.1, 1.0, 3),     // 1: Moving closer to Earth
  new THREE.Vector3(0.6, 0.65, -2.4), // 2: Diving into Karnataka
  new THREE.Vector3(0.3, -20, -40),   // 3: Falling through the sky
  new THREE.Vector3(0, -47, -75)      // 4: Arriving at Farm (Tree + 25 Z)
]);

const lookAtPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0),         // 0: Look at Earth center
  new THREE.Vector3(0.6, 0.65, -2.4), // 1: Look at Karnataka
  new THREE.Vector3(0, -25, -50),     // 2: Look down during fall
  new THREE.Vector3(0, -50, -100)     // 3: Look at Tree center
]);

const FogRig = ({ isIntro }: { isIntro: boolean }) => {
  const { scene } = useThree();
  const introTime = useRef(0);

  useFrame((_, delta) => {
    const fog = scene.fog as THREE.Fog;
    if (fog) {
      if (isIntro) {
        // Intro cloud break (at approx 20s mark of 24s intro)
        introTime.current += delta;
        const p = introTime.current / 24.0;
        const cloudFactor = Math.max(0, 1.0 - Math.abs(p - 0.8) * 10.0);
        const baseColor = new THREE.Color("#0A0900");
        const cloudColor = new THREE.Color("#dce6ff");
        fog.color.lerpColors(baseColor, cloudColor, Math.pow(cloudFactor, 2.0));
        fog.near = THREE.MathUtils.lerp(15, 0, cloudFactor);
        fog.far = THREE.MathUtils.lerp(60, 2, cloudFactor);
      } else {
        // Normal farm fog
        const baseColor = new THREE.Color("#0A0900");
        fog.color.copy(baseColor);
        fog.near = 15;
        fog.far = 60;
      }
    }
  });

  return null;
};

const LightRig = ({ isIntro }: { isIntro: boolean }) => {
  const { scene } = useThree();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30, stiffness: 70, mass: 1.5, restDelta: 0.001
  });

  useFrame(() => {
    const sunLight = scene.getObjectByName('sunLight') as THREE.DirectionalLight;
    const ambientLight = scene.getObjectByName('ambientLight') as THREE.AmbientLight;
    
    if (sunLight && ambientLight) {
      if (isIntro) {
        sunLight.intensity = 1.5;
        sunLight.color.setHex(0xFFF5D0);
        ambientLight.intensity = 0.2;
      } else {
        // Farm phase -> mapped to scroll (season 0.0 to 1.0)
        const season = smoothProgress.get();
        
        const springColor = new THREE.Color(0xFFF5D0);
        const summerColor = new THREE.Color(0xFFEAA7);
        const autumnColor = new THREE.Color(0xFFB142);
        const winterColor = new THREE.Color(0xD1D8E0);
        
        let targetColor = springColor;
        let intensity = 2.0;
        
        if (season < 0.33) {
          targetColor = springColor.clone().lerp(summerColor, season / 0.33);
          intensity = THREE.MathUtils.lerp(2.0, 2.5, season / 0.33);
        } else if (season < 0.66) {
          targetColor = summerColor.clone().lerp(autumnColor, (season - 0.33) / 0.33);
          intensity = THREE.MathUtils.lerp(2.5, 1.5, (season - 0.33) / 0.33);
        } else {
          targetColor = autumnColor.clone().lerp(winterColor, (season - 0.66) / 0.34);
          intensity = THREE.MathUtils.lerp(1.5, 1.0, (season - 0.66) / 0.34);
        }
        
        sunLight.color.copy(targetColor);
        sunLight.intensity = intensity;
        ambientLight.intensity = intensity * 0.15;

        // Move sun lower based on season
        sunLight.position.set(10, THREE.MathUtils.lerp(20, 2, season), 10);
      }
    }
  });

  return null;
};

const CameraRig = ({ isIntro }: { isIntro: boolean }) => {
  const { camera } = useThree();
  const { scrollYProgress } = useScroll();
  
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30, stiffness: 70, mass: 1.5, restDelta: 0.001
  });

  const mouseX = useSpring(0, { damping: 40, stiffness: 100, mass: 1 });
  const mouseY = useSpring(0, { damping: 40, stiffness: 100, mass: 1 });
  const introTime = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useFrame((_, delta) => {
    const mx = mouseX.get();
    const my = mouseY.get();

    if (isIntro) {
      // Phase 1 & 2: Spline dive from Universe to Farm
      introTime.current += delta;
      const t = Math.min(introTime.current / 24.0, 1.0); // 24 seconds to reach farm
      
      // Use Ease In Out for cinematic feel
      const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const camPos = cameraPath.getPointAt(easeT);
      const lookPos = lookAtPath.getPointAt(easeT);
      
      camera.position.set(camPos.x + mx * 0.5, camPos.y + my * 0.5, camPos.z);
      camera.lookAt(lookPos);
    } else {
      // Phase 3: Tree Orbiting based on scroll
      const orbitProgress = smoothProgress.get(); // 0 to 1
      const angle = orbitProgress * Math.PI * 1.5;
      const radius = 25 - (orbitProgress * 5); // Starts at 25, ends at 20
      
      const targetX = Math.sin(angle) * radius + mx * 2;
      const targetZ = -100 + Math.cos(angle) * radius;
      const targetY = -47 + (orbitProgress * 15) + my * 2;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
      
      camera.lookAt(0, -50 + (orbitProgress * 10), -100);
    }
  });

  return null;
};

export const GlobalCanvas = ({ introComplete }: { introComplete: boolean }) => {
  const [dpr, setDpr] = useState(1.5);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 1.5, 6], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
        dpr={dpr}
      >
        <Suspense fallback={null}>
          <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
          <fog attach="fog" args={["#0A0900", 15, 60]} />
          <FogRig isIntro={!introComplete} />
          <LightRig isIntro={!introComplete} />
          
          <ambientLight name="ambientLight" intensity={0.2} color="#ffffff" />
          <directionalLight name="sunLight" position={[10, 20, 10]} intensity={1.5} color="#FFF5D0" castShadow />
          
          <CameraRig isIntro={!introComplete} />
          
          {/* Globe and Universe only exist during intro to save memory later */}
          {!introComplete ? (
            <group>
              <Universe />
              <CinematicEarth position={[0, 0, 0]} />
            </group>
          ) : <></>}
          
          {/* Farm Level Group */}
          <group position={[0, -50, -100]}>
            <BackgroundLayers />
            <ProceduralTree position={[0, 0, 0]} />
            <FallingLeaves count={75} /> {/* Drastically reduced count for perf/quality */}
            <Butterflies count={12} />
          </group>

          {isMobile ? (
            <EffectComposer multisampling={0}>
              <Bloom 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
                intensity={1.2} 
                mipmapBlur 
              />
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
          ) : (
            <EffectComposer multisampling={0}>
              <Bloom 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
                intensity={1.2} 
                mipmapBlur 
              />
              {/* Depth of field only when we are orbiting tree */}
              {introComplete ? (
                <DepthOfField 
                  focusDistance={0.02} 
                  focalLength={0.15} 
                  bokehScale={2} 
                />
              ) : <></>}
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
