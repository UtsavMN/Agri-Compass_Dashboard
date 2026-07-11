import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const BirdFlock = ({ count = 14 }: { count: number }) => {
  const birds = useRef<THREE.Mesh[]>([]);
  const offsets = useRef(
    Array.from({ length: count }, () => Math.random() * Math.PI * 2)
  );

  useFrame((state) => {
    birds.current.forEach((bird, i) => {
      if (!bird) return;
      const t = state.clock.elapsedTime * 0.35 + offsets.current[i];
      bird.position.x = Math.sin(t) * (11 + i * 0.4);
      bird.position.y = 8 + Math.sin(t * 2.2) * 0.5 + i * 0.15;
      bird.position.z = Math.cos(t) * (9 + i * 0.3);
      bird.rotation.y = -t;
      bird.rotation.z = Math.sin(t * 4) * 0.25;
    });
  });

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) birds.current[i] = el;
          }}
        >
          <coneGeometry args={[0.06, 0.3, 4]} />
          <meshStandardMaterial color="#1a1814" />
        </mesh>
      ))}
    </>
  );
};
