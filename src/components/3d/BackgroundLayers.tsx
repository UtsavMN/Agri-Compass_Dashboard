import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const BackgroundLayers = () => {
  const starsRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Generate stars (Deep Space)
  const starsGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Create a sphere of stars far away
      const r = 40 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  // Generate dust / pollen particles (Near Tree)
  const dustGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Box around the tree area [0, -10, -15]
      positions[i * 3] = (Math.random() - 0.5) * 30; // x
      positions[i * 3 + 1] = -10 + (Math.random() * 20); // y
      positions[i * 3 + 2] = -15 + (Math.random() - 0.5) * 20; // z
    }
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.005;
    }
    if (dustRef.current) {
      // Gentle swirling motion for dust
      dustRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 1.5;
      dustRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <>
      <points ref={starsRef}>
        <primitive object={starsGeometry} attach="geometry" />
        <pointsMaterial 
          size={0.08} 
          color="#ffffff" 
          transparent 
          opacity={0.4} 
          sizeAttenuation 
        />
      </points>

      <points ref={dustRef}>
        <primitive object={dustGeometry} attach="geometry" />
        <pointsMaterial 
          size={0.15} 
          color="#E5D08F" 
          transparent 
          opacity={0.6} 
          sizeAttenuation 
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};
