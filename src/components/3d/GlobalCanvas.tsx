import { useEffect, useRef, Suspense, lazy } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useScroll, useSpring } from "framer-motion";
import * as THREE from "three";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";
import { PerformanceMonitor } from "@react-three/drei";

// Importing the elements we'll build
const CinematicEarth = lazy(() => import("./CinematicEarth").then(m => ({ default: m.CinematicEarth })));
const ProceduralTree = lazy(() => import("./ProceduralTree").then(m => ({ default: m.ProceduralTree })));
const BackgroundLayers = lazy(() => import("./BackgroundLayers").then(m => ({ default: m.BackgroundLayers })));
const FallingLeaves = lazy(() => import("./effects/FallingLeaves").then(m => ({ default: m.FallingLeaves })));
const Butterflies = lazy(() => import("./effects/Butterflies").then(m => ({ default: m.Butterflies })));
const Fireflies = lazy(() => import("./effects/Fireflies").then(m => ({ default: m.Fireflies })));
const VolumetricShafts = lazy(() => import("./effects/VolumetricShafts").then(m => ({ default: m.VolumetricShafts })));
const Universe = lazy(() => import("./Universe").then(m => ({ default: m.Universe })));
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useQualityStore } from "../../store/useQualityStore";

const SPRING_COLOR = new THREE.Color(0xD0E5FF);
const SUMMER_COLOR = new THREE.Color(0xFFF0D0);
const AUTUMN_COLOR = new THREE.Color(0xFFB040);
const WINTER_COLOR = new THREE.Color(0xA0B0C0);
const _targetColor = new THREE.Color();
const FARM_POSITION = new THREE.Vector3(0, -47, -75);

const _targetCamPos = new THREE.Vector3();
const _targetLookPos = new THREE.Vector3();
const _currentLookTarget = new THREE.Vector3();

const sharedEuler = new THREE.Euler(0, 0, 0, 'XYZ');
const getEarthSurfacePoint = (latDeg: number, lonDeg: number, radius: number, time: number, target: THREE.Vector3) => {
  const phi = (90 - latDeg) * (Math.PI / 180);
  const theta = (lonDeg + 90) * (Math.PI / 180);
  
  target.setFromSphericalCoords(radius, phi, theta);
  
  // Rotate Earth so India (78.9E -> theta=168.9 deg) faces +Z (theta=0)
  // Offset = -168.9 deg = -2.947 rad
  sharedEuler.set(0.1, -2.947 + (time * 0.02), 0, 'XYZ');
  target.applyEuler(sharedEuler);
  return target;
};

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
        // Normal farm fog (Cinematic Deep Forest Shadow)
        const baseColor = new THREE.Color("#050806"); // Very dark, slight green/cyan tint for contrast
        fog.color.lerp(baseColor, 0.05);
        fog.near = 10;
        fog.far = 70;
      }
    }
  });

  return null;
};

const LightRig = ({ isIntro }: { isIntro: boolean }) => {
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight>(null);
  
  const { scrollYProgress } = useScroll();
  const { settings } = useQualityStore();
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30, stiffness: 70, mass: 1.5, restDelta: 0.001
  });

  useFrame(() => {
    const sunLight = sunLightRef.current;
    const ambientLight = ambientLightRef.current;
    const hemiLight = hemiLightRef.current;
    
    if (sunLight && ambientLight && hemiLight) {
      if (isIntro) {
        sunLight.intensity = 1.5;
        sunLight.color.setHex(0xFFF5D0);
        ambientLight.intensity = 0.2;
        hemiLight.intensity = 0.1;
      } else {
        // Farm phase -> mapped to scroll (season 0.0 to 1.0)
        const season = smoothProgress.get();
        
        // Crisp morning sunlight vs heavy yellow
        let intensity = 2.0; // Reduced blowout
        
        if (season < 0.33) {
          _targetColor.copy(SPRING_COLOR).lerp(SUMMER_COLOR, season / 0.33);
          intensity = THREE.MathUtils.lerp(2.0, 2.5, season / 0.33);
        } else if (season < 0.66) {
          _targetColor.copy(SUMMER_COLOR).lerp(AUTUMN_COLOR, (season - 0.33) / 0.33);
          intensity = THREE.MathUtils.lerp(2.5, 2.0, (season - 0.33) / 0.33);
        } else {
          _targetColor.copy(AUTUMN_COLOR).lerp(WINTER_COLOR, (season - 0.66) / 0.34);
          intensity = THREE.MathUtils.lerp(2.0, 1.2, (season - 0.66) / 0.34);
        }
        
        sunLight.color.copy(_targetColor);
        sunLight.intensity = intensity;
        
        // Soft Bounce Lighting & Ambient - Keep it dark for contrast
        ambientLight.color.setHex(0x0a0c10); // Very dim blue/black ambient
        ambientLight.intensity = 1.0;
        
        hemiLight.color.copy(_targetColor);
        hemiLight.groundColor.setHex(0x050608); // Pitch dark ground bounce
        hemiLight.intensity = intensity * 0.15;

        // Move sun lower for dramatic golden hour shadows
        sunLight.position.set(15, THREE.MathUtils.lerp(15, 2, season), 10);
      }
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.1} color="#ffffff" />
      <hemisphereLight ref={hemiLightRef} groundColor="#050400" color="#ffffff" intensity={0.1} />
      
      {/* Enhanced Golden Hour Sun */}
      <directionalLight 
        ref={sunLightRef} 
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
    </>
  );
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
        // Smooth staged lerping instead of recalculating splines to prevent wobbling
        if (t < 0.2) {
          _targetCamPos.set(0, 1.5, 6);
          _targetLookPos.set(0, 0, 0);
        } else if (t < 0.5) {
          // Dive to India
          const progress = (t - 0.2) / 0.3;
          const ease = progress * progress * (3 - 2 * progress);
          const r = THREE.MathUtils.lerp(6, 3.8, ease);
          
          getEarthSurfacePoint(20.5, 78.9, r, time, _targetCamPos);
          getEarthSurfacePoint(20.5, 78.9, 0, time, _targetLookPos);
        } else if (t < 0.75) {
          // Slide from India to Karnataka while zooming in closer
          const progress = (t - 0.5) / 0.25;
          const ease = progress * progress * (3 - 2 * progress);
          const lat = THREE.MathUtils.lerp(20.5, 15.31, ease);
          const lon = THREE.MathUtils.lerp(78.9, 75.71, ease);
          const r = THREE.MathUtils.lerp(3.8, 2.52, ease);
          
          getEarthSurfacePoint(lat, lon, r, time, _targetCamPos);
          getEarthSurfacePoint(lat, lon, 0, time, _targetLookPos);
        } else if (t < 0.9) {
          // Transition to falling
          const progress = (t - 0.75) / 0.15;
          const ease = progress * progress * (3 - 2 * progress);
          
          const startCam = new THREE.Vector3();
          const startLook = new THREE.Vector3();
          getEarthSurfacePoint(15.31, 75.71, 2.52, time, startCam);
          getEarthSurfacePoint(15.31, 75.71, 0, time, startLook);
          
          const fallPos = new THREE.Vector3(0, -20, -40);
          const fallLook = new THREE.Vector3(0, -25, -50);
          
          _targetCamPos.lerpVectors(startCam, fallPos, ease);
          _targetLookPos.lerpVectors(startLook, fallLook, ease);
        } else {
          _targetCamPos.set(0, -47, -75);
          _targetLookPos.set(0, -50, -100);
        }

        // Extremely smooth interpolation
        camera.position.lerp(_targetCamPos, 0.035);
        _currentLookTarget.lerp(_targetLookPos, 0.04);
        
        camera.lookAt(_currentLookTarget);
      }
    } else {
      if (reducedMotion) {
        // Static camera at Farm
        camera.position.lerp(FARM_POSITION, 0.05);
        camera.lookAt(0, -50, -100);
      } else {
        const orbitProgress = smoothProgress.get(); // 0 to 1
        const angle = orbitProgress * Math.PI * 1.5;
        
        // Start further away (35) to prevent crowding, but zoom in dramatically at the very end (18)
        const radius = 35 - (Math.pow(orbitProgress, 2.5) * 17); 
        
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
  const { settings, profile, stepUp, stepDown } = useQualityStore();
  const reducedMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 1.5, 6], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
        dpr={Math.min(settings.dpr, 2)}
      >
        <Suspense fallback={null}>
          <PerformanceMonitor onDecline={stepDown} onIncline={stepUp} />
          <fog attach="fog" args={["#1a1500", 10, 70]} />
          <FogRig isIntro={!introComplete} />
          <LightRig isIntro={!introComplete} />
          
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
            <FallingLeaves count={reducedMotion ? 10 : Math.floor(250 * settings.leafDensity)} petalCount={30} /> 
            <Butterflies count={settings.butterflyCount} />
            <Fireflies count={settings.particleCount / 2} />
          </group>

          <EffectComposer multisampling={0}>
            {profile !== "mobile" && settings.bloom > 0 ? (
              <Bloom 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
                intensity={settings.bloom} 
                mipmapBlur={settings.dpr > 1.0} 
              />
            ) : <></>}
            {/* Depth of field only when we are orbiting tree and high quality */}
            {introComplete && profile !== "mobile" && settings.dpr > 1.0 ? (
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
