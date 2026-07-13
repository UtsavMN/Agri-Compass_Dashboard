import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "../../../hooks/useReducedMotion";

export const Fireflies = ({ count = 50 }: { count?: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const reducedMotion = useReducedMotion();
  const customUniforms = useRef({ uTime: { value: 0 }, uReducedMotion: { value: 0 } });

  const { pos, phase } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const ph = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute them around the farm / tree area
      p[i3] = (Math.random() - 0.5) * 40;
      p[i3 + 1] = -50 + Math.random() * 20; 
      p[i3 + 2] = -110 + Math.random() * 40; 
      
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { pos: p, phase: ph };
  }, [count]);

  const geo = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(0.4, 0.4);
    geometry.setAttribute('phase', new THREE.InstancedBufferAttribute(phase, 1));
    return geometry;
  }, [phase]);

  const mat = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ffdd88"),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.current.uTime;
      shader.uniforms.uReducedMotion = customUniforms.current.uReducedMotion;
      
      shader.vertexShader = `
        attribute float phase;
        uniform float uTime;
        uniform float uReducedMotion;
        varying float vAlpha;
        varying vec2 vUv;
        ${shader.vertexShader}
      `.replace(
        `#include <begin_vertex>`,
        `
        vec3 pos = position;
        vUv = uv;
        
        // If reduced motion is 1.0, they stay completely still.
        // If 0.0, they wander slightly.
        float movement = 1.0 - uReducedMotion;
        vec3 worldPos = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        
        float swayX = sin(uTime * 0.5 + phase) * 2.0 * movement;
        float swayY = cos(uTime * 0.3 + phase) * 1.5 * movement;
        float swayZ = sin(uTime * 0.4 + phase) * 2.0 * movement;
        
        vec3 transformed = pos;
        
        // Billboard effect
        mat4 billboard = modelViewMatrix;
        billboard[0][0] = 1.0; billboard[0][1] = 0.0; billboard[0][2] = 0.0;
        billboard[1][0] = 0.0; billboard[1][1] = 1.0; billboard[1][2] = 0.0;
        billboard[2][0] = 0.0; billboard[2][1] = 0.0; billboard[2][2] = 1.0;
        
        vec4 mvPosition = billboard * vec4(transformed, 1.0);
        mvPosition.xyz += vec3(swayX, swayY, swayZ);
        
        vAlpha = mix(
          (sin(uTime * 2.0 + phase) * 0.5 + 0.5), // Pulsing when animating
          0.3,                                    // Static ambient glow when reduced motion
          uReducedMotion
        );
        `
      ).replace(
        `#include <project_vertex>`,
        `gl_Position = projectionMatrix * mvPosition;`
      );

      shader.fragmentShader = `
        varying float vAlpha;
        varying vec2 vUv;
        ${shader.fragmentShader}
      `.replace(
        `#include <color_fragment>`,
        `
        #include <color_fragment>
        vec2 coord = vUv - vec2(0.5);
        float dist = length(coord);
        float glow = pow(1.0 - (dist * 2.0), 1.5);
        if(dist > 0.5) discard;
        diffuseColor.a *= glow * vAlpha;
        `
      );
    };
    return material;
  }, []);

  useEffect(() => {
    return () => {
      geo.dispose();
      mat.dispose();
    };
  }, [geo, mat]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    customUniforms.current.uTime.value = t;
    customUniforms.current.uReducedMotion.value = reducedMotion ? 1.0 : 0.0;
    
    // Set static positions once
    if (meshRef.current.instanceMatrix.needsUpdate === false) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < count; i++) {
        dummy.position.set(pos[i*3], pos[i*3+1], pos[i*3+2]);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[geo, mat, count]} />
  );
};
