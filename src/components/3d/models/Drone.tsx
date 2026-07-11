import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Drone = () => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.x = Math.sin(t * 0.25) * 9;
    group.current.position.z = Math.cos(t * 0.25) * 7;
    group.current.position.y = 4.5 + Math.sin(t * 0.7) * 0.3;
    group.current.rotation.y = t * 0.25 + Math.PI;
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
              color="#C9A84C"
              metalness={0.95}
              roughness={0.05}
              emissive="#C9A84C"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      ))}
      {/* Scan beam */}
      <pointLight
        position={[0, -0.6, 0]}
        color="#C9A84C"
        intensity={2.5}
        distance={6}
      />
    </group>
  );
};
