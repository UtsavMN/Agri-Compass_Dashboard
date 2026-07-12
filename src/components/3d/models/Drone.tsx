import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Drone = () => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.x = Math.sin(t * 0.2) * 4;
    group.current.position.z = Math.cos(t * 0.2) * 2 - 2;
    group.current.position.y = 2.8 + Math.sin(t * 0.7) * 0.4;
    group.current.rotation.y = t * 0.2 + Math.PI;
  });

  const armPositions: [number, number, number][] = [
    [-0.35, 0, -0.35],
    [0.35, 0, -0.35],
    [-0.35, 0, 0.35],
    [0.35, 0, 0.35],
  ];

  return (
    <group ref={group}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.12, 0.5]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Arms + rotors */}
      {armPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.18, 0.025, 8]} />
            <meshStandardMaterial
              color="#E5D08F"
              metalness={0.95}
              roughness={0.05}
              emissive="#E5D08F"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      ))}
      {/* Scan beam */}
      <pointLight
        position={[0, -0.6, 0]}
        color="#E5D08F"
        intensity={2.5}
        distance={6}
      />
    </group>
  );
};
