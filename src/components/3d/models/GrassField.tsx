import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const GrassField = ({ count = 2000 }: { count: number }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!mesh.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 40,
        0.2 + Math.random() * 0.3,
        (Math.random() - 0.5) * 40
      );
      dummy.scale.set(
        0.04 + Math.random() * 0.04,
        0.4 + Math.random() * 0.5,
        0.04
      );
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < Math.min(count, 400); i++) {
      mesh.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(
        dummy.position,
        dummy.quaternion,
        dummy.scale
      );
      dummy.rotation.z =
        Math.sin(state.clock.elapsedTime * 1.2 + i * 0.12) * 0.07;
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2D5A1B" roughness={0.95} />
    </instancedMesh>
  );
};
