import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "../../../hooks/useReducedMotion";

const STATE_WANDERING = 0;
const STATE_SEEKING = 1;
const STATE_RESTING = 2;
const STATE_FLEEING = 3;

export const Butterflies = ({ count = 3 }: { count?: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const reducedMotion = useReducedMotion();
  
  const customUniforms = useRef({ uTime: { value: 0 } });

  const { pos, vel, target, state, timer, wingPhase, wingSpeed } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const v = new Float32Array(count * 3);
    const tar = new Float32Array(count * 3);
    const s = new Uint8Array(count);
    const tm = new Float32Array(count);
    const wp = new Float32Array(count);
    const ws = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      p[i3] = (Math.random() - 0.5) * 12;
      p[i3 + 1] = Math.random() * 8;
      p[i3 + 2] = -5.0 - Math.random() * 10; // Keep behind UI (z < -5)

      v[i3] = (Math.random() - 0.5);
      v[i3 + 1] = (Math.random() - 0.5);
      v[i3 + 2] = (Math.random() - 0.5);
      
      s[i] = STATE_WANDERING;
      tm[i] = Math.random() * 5.0; 
      wp[i] = Math.random() * Math.PI * 2;
      ws[i] = 15.0 + Math.random() * 10.0;
    }
    return { pos: p, vel: v, target: tar, state: s, timer: tm, wingPhase: wp, wingSpeed: ws };
  }, [count]);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      dummy.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      color.setHSL(0.15, 0.5, 0.9 + Math.random() * 0.1); 
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    
    meshRef.current.geometry.setAttribute('wingPhase', new THREE.InstancedBufferAttribute(wingPhase, 1));
  }, [count, pos, wingPhase]);

  const butterflyGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.4, 0.4, 2, 1);
    geo.rotateX(-Math.PI / 2);
    const position = geo.attributes.position;
    for(let i=0; i<position.count; i++) {
       const x = position.getX(i);
       const z = position.getZ(i);
       if (z > 0) {
          position.setX(i, x * 0.6);
       }
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const butterflyMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.current.uTime;
      shader.vertexShader = `
        attribute float wingPhase;
        uniform float uTime;
        ${shader.vertexShader}
      `.replace(
        `#include <begin_vertex>`,
        `
        vec3 pos = position;
        
        float flapAngle = sin(wingPhase) * 1.2; 
        
        float distFromCenter = abs(pos.x);
        pos.y += sin(flapAngle) * distFromCenter;
        pos.x = sign(pos.x) * cos(flapAngle) * distFromCenter;
        
        vec3 transformed = pos;
        `
      );
    };
    return mat;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const tempTarget = useMemo(() => new THREE.Vector3(), []);
  const tempDir = useMemo(() => new THREE.Vector3(), []);
  
  const currentQuat = useMemo(() => new THREE.Quaternion(), []);
  const targetQuat = useMemo(() => new THREE.Quaternion(), []);
  const tempMat = useMemo(() => new THREE.Matrix4(), []);

  useEffect(() => {
    return () => {
      butterflyGeo.dispose();
      butterflyMat.dispose();
    };
  }, [butterflyGeo, butterflyMat]);

  useFrame((sceneState, delta) => {
    if (!meshRef.current) return;
    
    const t = sceneState.clock.getElapsedTime();
    customUniforms.current.uTime.value = t;
    const dt = Math.min(delta, 0.05) * (reducedMotion ? 0.05 : 1.0);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      timer[i] -= dt;

      if (timer[i] <= 0) {
        if (state[i] === STATE_WANDERING) {
          if (Math.random() > 0.3) {
            state[i] = STATE_SEEKING;
            timer[i] = 5.0 + Math.random() * 5.0; 
            target[i3] = (Math.random() - 0.5) * 10; 
            target[i3 + 1] = 2 + Math.random() * 6;  
            target[i3 + 2] = -5.0 - Math.random() * 5; // Behind UI
          } else {
            state[i] = STATE_FLEEING;
            timer[i] = 10.0;
            target[i3] = (Math.random() - 0.5) * 15; 
            target[i3 + 1] = 10 + Math.random() * 5;
            target[i3 + 2] = -15; // Fly deep into background
          }
        } else if (state[i] === STATE_SEEKING) {
          state[i] = STATE_WANDERING;
          timer[i] = 3.0 + Math.random() * 5.0;
        } else if (state[i] === STATE_RESTING) {
          state[i] = STATE_WANDERING;
          timer[i] = 5.0 + Math.random() * 5.0;
        } else if (state[i] === STATE_FLEEING) {
          state[i] = STATE_WANDERING;
          timer[i] = 5.0 + Math.random() * 5.0;
          pos[i3] = (Math.random() - 0.5) * 15;
          pos[i3 + 1] = 10 + Math.random() * 10;
          pos[i3 + 2] = -15 - Math.random() * 5; // Stay behind
        }
      }

      tempVec.set(pos[i3], pos[i3 + 1], pos[i3 + 2]);
      
      let speed = 2.0;

      if (state[i] === STATE_WANDERING) {
        wingSpeed[i] = THREE.MathUtils.lerp(wingSpeed[i], 25.0, 0.05); 
        
        const cx = Math.sin(tempVec.y * 0.5 + t) + Math.cos(tempVec.z * 0.3 + t);
        const cy = Math.sin(tempVec.z * 0.4 + t) + Math.cos(tempVec.x * 0.6 + t);
        const cz = Math.sin(tempVec.x * 0.5 + t) + Math.cos(tempVec.y * 0.4 + t);
        
        tempDir.set(cx, cy, cz).normalize();
        
        if (tempVec.y < 0) tempDir.y += 1.0;
        if (tempVec.y > 10) tempDir.y -= 1.0;
        if (tempVec.x < -8) tempDir.x += 1.0;
        if (tempVec.x > 8) tempDir.x -= 1.0;
        if (tempVec.z > -2) tempDir.z -= 2.0; // Pushed firmly behind UI
        if (tempVec.z < -15) tempDir.z += 1.0;
        
        tempDir.normalize();

      } else if (state[i] === STATE_SEEKING) {
        wingSpeed[i] = THREE.MathUtils.lerp(wingSpeed[i], 20.0, 0.05);
        tempTarget.set(target[i3], target[i3 + 1], target[i3 + 2]);
        tempDir.subVectors(tempTarget, tempVec);
        const dist = tempDir.length();
        
        if (dist < 0.5) {
          state[i] = STATE_RESTING;
          timer[i] = 5.0 + Math.random() * 15.0; 
          vel[i3] = 0; vel[i3 + 1] = 0; vel[i3 + 2] = 0;
        } else {
          tempDir.normalize();
          tempDir.x += Math.sin(t * 2.0 + i) * 0.5;
          tempDir.y += Math.cos(t * 2.5 + i) * 0.5;
          tempDir.z += Math.sin(t * 1.5 + i) * 0.5;
          tempDir.normalize();
        }

      } else if (state[i] === STATE_RESTING) {
        if (Math.random() < 0.01) {
           wingSpeed[i] = 5.0; 
        } else {
           wingSpeed[i] = THREE.MathUtils.lerp(wingSpeed[i], 0.5, 0.05); 
        }
        
        speed = 0;
        tempDir.set(0, 0, 0);

      } else if (state[i] === STATE_FLEEING) {
        wingSpeed[i] = THREE.MathUtils.lerp(wingSpeed[i], 35.0, 0.05); 
        speed = 5.0; 
        tempTarget.set(target[i3], target[i3 + 1], target[i3 + 2]);
        tempDir.subVectors(tempTarget, tempVec).normalize();
        
        tempDir.y += Math.sin(t * 3.0 + i) * 0.5;
        tempDir.normalize();
      }

      if (speed > 0) {
        vel[i3] = THREE.MathUtils.lerp(vel[i3], tempDir.x * speed, 0.05);
        vel[i3 + 1] = THREE.MathUtils.lerp(vel[i3 + 1], tempDir.y * speed, 0.05);
        vel[i3 + 2] = THREE.MathUtils.lerp(vel[i3 + 2], tempDir.z * speed, 0.05);
        
        pos[i3] += vel[i3] * dt;
        pos[i3 + 1] += vel[i3 + 1] * dt;
        pos[i3 + 2] += vel[i3 + 2] * dt;

        tempDir.set(vel[i3], vel[i3 + 1], vel[i3 + 2]).normalize();
        
        const up = new THREE.Vector3(0, 1, 0);
        up.x = -tempDir.x * 0.5; 
        up.normalize();
        
        const m = tempMat.lookAt(new THREE.Vector3(0,0,0), tempDir, up);
        targetQuat.setFromRotationMatrix(m);
      }
      
      meshRef.current.getMatrixAt(i, tempMat);
      
      dummy.position.set(pos[i3], pos[i3 + 1], pos[i3 + 2]);
      
      if (speed > 0) {
         currentQuat.setFromRotationMatrix(tempMat);
         currentQuat.slerp(targetQuat, 0.1);
         dummy.quaternion.copy(currentQuat);
      } else {
         dummy.quaternion.setFromRotationMatrix(tempMat);
      }

      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      wingPhase[i] += wingSpeed[i] * dt;
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.geometry.attributes.wingPhase) {
      meshRef.current.geometry.attributes.wingPhase.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[butterflyGeo, butterflyMat, count]} castShadow={false} receiveShadow />
  );
};
