import { useRef, useMemo, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

// Utility to generate a beautiful, sparse fractal tree
function generateTreeTransforms(depth: number) {
  const branches: THREE.Matrix4[] = [];
  const canopy: THREE.Matrix4[] = [];
  const dummy = new THREE.Object3D();

  function grow(
    position: THREE.Vector3,
    direction: THREE.Vector3,
    length: number,
    radius: number,
    currentDepth: number
  ) {
    // Add leaf at the end of the branch if it's the last few depths
    if (currentDepth <= 1) {
      dummy.position.copy(position).add(direction.clone().multiplyScalar(length));
      dummy.scale.setScalar(length * 1.5);
      // Give leaves random rotations for a natural canopy look
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dummy.updateMatrix();
      canopy.push(dummy.matrix.clone());
    }

    if (currentDepth === 0) return;

    // Build the branch cylinder
    dummy.position.copy(position).add(direction.clone().multiplyScalar(length / 2));
    dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    dummy.scale.set(radius, length, radius);
    dummy.updateMatrix();
    branches.push(dummy.matrix.clone());

    const endPosition = position.clone().add(direction.clone().multiplyScalar(length));
    
    // Create an elegant, organic spread
    const numBranches = currentDepth > 3 ? 3 : 2; 
    const spread = 0.5 + (Math.random() * 0.2);

    for (let i = 0; i < numBranches; i++) {
      const angle = (i / numBranches) * Math.PI * 2 + (Math.random() * 0.5);
      const x = Math.sin(angle) * spread;
      const z = Math.cos(angle) * spread;
      const y = 1 - (spread * 0.5);
      
      const newDirection = new THREE.Vector3(x, y, z).normalize().applyQuaternion(dummy.quaternion);
      
      // Add natural curving
      newDirection.x += (Math.random() - 0.5) * 0.2;
      newDirection.z += (Math.random() - 0.5) * 0.2;
      newDirection.normalize();

      grow(
        endPosition,
        newDirection,
        length * 0.8,
        radius * 0.7,
        currentDepth - 1
      );
    }
  }

  grow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 5, 0.8, depth);
  return { branchMatrices: branches, canopyMatrices: canopy };
}

export const DataTree = ({ isMobile = false }: { isMobile?: boolean }) => {
  const branchesRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);
  const treeRef = useRef<THREE.Group>(null);

  // Load the highly realistic golden leaf texture
  const leafTexture = useLoader(THREE.TextureLoader, "/textures/golden_leaf.webp");
  leafTexture.colorSpace = THREE.SRGBColorSpace;
  leafTexture.magFilter = THREE.LinearFilter;
  leafTexture.minFilter = THREE.LinearMipmapLinearFilter;

  // Depth 6 is perfect for a realistic fractal without becoming a solid blob
  const depth = isMobile ? 5 : 6; 
  const { branchMatrices, canopyMatrices } = useMemo(() => generateTreeTransforms(depth), [depth]);

  // Apply matrices to instanced meshes
  useEffect(() => {
    if (branchesRef.current) {
      branchMatrices.forEach((matrix, i) => {
        branchesRef.current!.setMatrixAt(i, matrix);
      });
      branchesRef.current.instanceMatrix.needsUpdate = true;
    }
    if (canopyRef.current) {
      canopyMatrices.forEach((matrix, i) => {
        canopyRef.current!.setMatrixAt(i, matrix);
      });
      canopyRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [branchMatrices, canopyMatrices]);

  // Gentle organic sway
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (treeRef.current) {
      treeRef.current.rotation.y = Math.sin(time * 0.1) * 0.05;
      treeRef.current.rotation.z = Math.cos(time * 0.15) * 0.02;
    }
  });

  return (
    <group ref={treeRef} position={[0, -10, -15]}>
      {/* Elegant Golden Trunk and Branches */}
      <instancedMesh ref={branchesRef} args={[undefined, undefined, branchMatrices.length]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 1, 12]} />
        <meshStandardMaterial 
          color="#3A2818" // Rich dark wood
          emissive="#1A0F05"
          roughness={0.9} 
          metalness={0.1}
        />
      </instancedMesh>

      {/* Realistic Golden Leaves (Static, not falling) */}
      <instancedMesh ref={canopyRef} args={[undefined, undefined, canopyMatrices.length]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 2.5]} />
        <meshStandardMaterial 
          map={leafTexture} 
          alphaMap={leafTexture}
          alphaTest={0.4} // Sharp edges for realism
          transparent
          side={THREE.DoubleSide}
          roughness={0.5}
          metalness={0.2}
          emissive="#D4AF37"
          emissiveIntensity={0.15} // Subtle magical glow
        />
      </instancedMesh>

      {/* Cinematic rim lighting for the tree */}
      <pointLight position={[0, 10, -5]} color="#FFD700" intensity={5} distance={50} decay={2} />
      <pointLight position={[-10, 5, 5]} color="#D4AF37" intensity={2} distance={30} decay={2} />
      <pointLight position={[10, 5, 5]} color="#D4AF37" intensity={2} distance={30} decay={2} />
    </group>
  );
};
