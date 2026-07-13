import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const VolumetricShafts = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  const shaderMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#FFD700") } // Golden light
    },
    vertexShader: `
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      
      void main() {
        // Calculate view direction
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        
        // Soft edge blending (fresnel-like effect to hide sharp geometry edges)
        float viewDotNormal = abs(dot(viewDir, vNormal));
        float edgeSoftness = smoothstep(0.0, 0.4, viewDotNormal);
        
        // Vertical gradient fade (fades out at bottom)
        float verticalFade = smoothstep(-20.0, 20.0, vWorldPos.y);
        
        // Wavy noise for dusty light rays
        float noise = sin(vWorldPos.x * 0.5 + uTime) * sin(vWorldPos.z * 0.5 - uTime * 0.8) * 0.5 + 0.5;
        
        // Combine opacities
        float opacity = edgeSoftness * verticalFade * (0.15 + noise * 0.15);
        
        gl_FragColor = vec4(uColor, opacity * 0.4); // Very subtle
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  }), []);

  useEffect(() => {
    return () => {
      shaderMat.dispose();
    };
  }, [shaderMat]);

  useFrame((state) => {
    if (shaderMat) {
      shaderMat.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[15, 0, 10]} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
      {/* Cone geometry radiating from the light source */}
      <coneGeometry args={[40, 80, 32, 1, true]} />
      <primitive object={shaderMat} attach="material" />
    </mesh>
  );
};
