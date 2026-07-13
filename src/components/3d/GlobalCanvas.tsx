import { useEffect, useRef, Suspense } from "react";
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
import { Fireflies } from "./effects/Fireflies";
import { VolumetricShafts } from "./effects/VolumetricShafts";
import { Universe } from "./Universe";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useQualityStore } from "../../store/useQualityStore";

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
        // Intro cloud break
        introTime.current += delta;
        const p = introTime.current / 24.0;
        const cloudFactor = Math.max(0, 1.0 - Math.abs(p - 0.8) * 10.0);
        const baseColor = new THREE.Color("#050400"); // Deep cinematic dark
        const cloudColor = new THREE.Color("#dce6ff");
        fog.color.lerpColors(baseColor, cloudColor, Math.pow(cloudFactor, 2.0));
        fog.near = THREE.MathUtils.lerp(15, 0, cloudFactor);
        fog.far = THREE.MathUtils.lerp(60, 2, cloudFactor);
      } else {
        // Normal farm fog (Cinematic Gold Hour Atmospheric Fog)
        const baseColor = new THREE.Color("#1a1500"); // Richer atmospheric fog
        fog.color.lerp(baseColor, 0.05);
        fog.near = 10;
        fog.far = 70;
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
    const hemiLight = scene.getObjectByName('hemiLight') as THREE.HemisphereLight;
    
    if (sunLight && ambientLight && hemiLight) {
      if (isIntro) {
        sunLight.intensity = 1.5;
        sunLight.color.setHex(0xFFF5D0);
        ambientLight.intensity = 0.2;
        hemiLight.intensity = 0.1;
      } else {
        // Farm phase -> mapped to scroll (season 0.0 to 1.0)
        const season = smoothProgress.get();
        
        // Golden hour dominant lighting
        const springColor = new THREE.Color(0xFFE5B4); // Peachy gold
        const summerColor = new THREE.Color(0xFFD700); // Pure gold
        const autumnColor = new THREE.Color(0xFF8C00); // Deep orange
        const winterColor = new THREE.Color(0xD1D8E0); // Cool gray
        
        let targetColor = springColor;
        let intensity = 2.5;
        
        if (season < 0.33) {
          targetColor = springColor.clone().lerp(summerColor, season / 0.33);
          intensity = THREE.MathUtils.lerp(2.5, 3.0, season / 0.33);
        } else if (season < 0.66) {
          targetColor = summerColor.clone().lerp(autumnColor, (season - 0.33) / 0.33);
          intensity = THREE.MathUtils.lerp(3.0, 2.0, (season - 0.33) / 0.33);
        } else {
          targetColor = autumnColor.clone().lerp(winterColor, (season - 0.66) / 0.34);
          intensity = THREE.MathUtils.lerp(2.0, 1.2, (season - 0.66) / 0.34);
        }
        
        sunLight.color.copy(targetColor);
        sunLight.intensity = intensity;
        
        // Soft Bounce Lighting & Ambient
        ambientLight.color.copy(targetColor);
        ambientLight.intensity = intensity * 0.05;
        
        hemiLight.color.copy(targetColor);
        hemiLight.intensity = intensity * 0.15;

        // Move sun lower for dramatic golden hour shadows
        sunLight.position.set(15, THREE.MathUtils.lerp(15, 2, season), 10);
      }
    }
  });

  return null;
};


const CameraRig = ({ isIntro }: { isIntro: boolean }) => {
  const { camera } = useThree();
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 50, stiffness: 50, mass: 2.5, restDelta: 0.001
  });

  const mouseX = useSpring(0, { damping: 40, stiffness: 100, mass: 1 });
  const mouseY = useSpring(0, { damping: 40, stiffness: 100, mass: 1 });
  const introTime = useRef(0);

  useEffect(() => {
    if (reducedMotion) return; // Skip mouse parallax for reduced motion
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, reducedMotion]);

  useFrame((state, delta) => {
    const mx = mouseX.get();
    const my = mouseY.get();
    const time = state.clock.getElapsedTime();

    if (isIntro) {
      if (reducedMotion) {
        // Skip spline dive entirely, snap to Farm
        camera.position.set(0, -47, -75);
        camera.lookAt(0, -50, -100);
      } else {
        introTime.current += delta;
        const t = Math.min(introTime.current / 24.0, 1.0);
        const easeT = t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
        const camPos = cameraPath.getPointAt(easeT);
        const lookPos = lookAtPath.getPointAt(easeT);
        camera.position.set(camPos.x + mx * 0.5, camPos.y + my * 0.5, camPos.z);
        camera.lookAt(lookPos);
      }
    } else {
      if (reducedMotion) {
        // Static camera at Farm
        camera.position.lerp(new THREE.Vector3(0, -47, -75), 0.05);
        camera.lookAt(0, -50, -100);
      } else {
        const orbitProgress = smoothProgress.get(); // 0 to 1
        const angle = orbitProgress * Math.PI * 1.5;
        const radius = 25 - (orbitProgress * 5);
        const breathe = Math.sin(time * 0.6) * 0.07;
        const targetX = Math.sin(angle) * radius + mx * 0.8;
        const targetZ = -100 + Math.cos(angle) * radius;
        const targetY = -47 + (orbitProgress * 15) + my * 0.6 + breathe;

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.03);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03);
        
        camera.lookAt(0, -50 + (orbitProgress * 10), -100);
      }
    }
  });

  return null;
};

export const GlobalCanvas = ({ introComplete }: { introComplete: boolean }) => {
  const { settings, stepUp, stepDown } = useQualityStore();
  const reducedMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 1.5, 6], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
        dpr={settings.dpr}
      >
        <Suspense fallback={null}>
          <PerformanceMonitor onDecline={stepDown} onIncline={stepUp} />
          <fog attach="fog" args={["#1a1500", 10, 70]} />
          <FogRig isIntro={!introComplete} />
          <LightRig isIntro={!introComplete} />
          
          <ambientLight name="ambientLight" intensity={0.1} color="#ffffff" />
          <hemisphereLight name="hemiLight" groundColor="#050400" color="#ffffff" intensity={0.1} />
          
          {/* Enhanced Golden Hour Sun */}
          <directionalLight 
            name="sunLight" 
            position={[15, 15, 10]} 
            intensity={2.5} 
            color="#FFD700" 
            castShadow={settings.shadowMapSize > 0} 
            shadow-mapSize={[settings.shadowMapSize || 1024, settings.shadowMapSize || 1024]}
            shadow-camera-near={0.5}
            shadow-camera-far={100}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
            shadow-bias={-0.001}
          />
          
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
            <ProceduralTree position={[0, -2.5, 0]} />
            {settings.volumetricFog && !reducedMotion ? <VolumetricShafts /> : <></>}
            <FallingLeaves count={reducedMotion ? 10 : Math.floor(75 * settings.leafDensity)} /> 
            <Butterflies count={settings.butterflyCount} />
            <Fireflies count={settings.particleCount / 2} />
          </group>

          <EffectComposer multisampling={0}>
            <Bloom 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.9} 
              intensity={settings.bloom} 
              mipmapBlur 
            />
            {/* Depth of field only when we are orbiting tree and high quality */}
            {introComplete && settings.dpr > 1.0 ? (
              <DepthOfField 
                focusDistance={0.015} 
                focalLength={0.1} 
                bokehScale={3} 
              />
            ) : <></>}
            <Vignette eskil={false} offset={0.1} darkness={1.2} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};
