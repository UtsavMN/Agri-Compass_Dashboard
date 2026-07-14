import { useRef, useMemo, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import * as THREE from "three";

export const FallingLeaves = ({ count = 200, petalCount = 100 }: { count?: number, petalCount?: number }) => {
  const { scrollYProgress } = useScroll();
  const leafMeshRef = useRef<THREE.InstancedMesh>(null);
  const petalMeshRef = useRef<THREE.InstancedMesh>(null);
  
  const customUniforms = useRef({ uSeason: { value: 0 }, uTime: { value: 0 } });
  
  // Load texture
  const leafTexture = useLoader(THREE.TextureLoader, '/textures/realistic_leaf.webp');
  leafTexture.colorSpace = THREE.SRGBColorSpace;
  
  const generatePhysicsState = (total: number, isPetal: boolean) => {
    const pos = new Float32Array(total * 3);
    const vel = new Float32Array(total * 3);
    const rot = new Float32Array(total * 3);
    const angVel = new Float32Array(total * 3);
    const ph = new Float32Array(total);
    const sc = new Float32Array(total);
    const drg = new Float32Array(total);
    const ms = new Float32Array(total);
    const cols = new Float32Array(total * 3);
    
    const colorAutumn1 = new THREE.Color("#D97A26"); 
    const colorAutumn2 = new THREE.Color("#C44510"); 
    const colorAutumn3 = new THREE.Color("#E2C341"); 
    const colorGreen = new THREE.Color("#6B8E23");   
    const colorPetal = new THREE.Color("#ffe6ee"); // Pinkish white
    
    for (let i = 0; i < total; i++) {
      const i3 = i * 3;
      
      // Start high up, but initially random so it's populated
      pos[i3] = (Math.random() - 0.5) * 40;     
      pos[i3 + 1] = -12 + Math.random() * 32; // Spread vertically initially
      pos[i3 + 2] = (Math.random() - 0.5) * 30; 
      
      vel[i3] = 0; vel[i3 + 1] = 0; vel[i3 + 2] = 0;
      
      rot[i3] = Math.random() * Math.PI * 2;
      rot[i3 + 1] = Math.random() * Math.PI * 2;
      rot[i3 + 2] = Math.random() * Math.PI * 2;
      
      angVel[i3] = (Math.random() - 0.5) * 5.0;
      angVel[i3 + 1] = (Math.random() - 0.5) * 5.0;
      angVel[i3 + 2] = (Math.random() - 0.5) * 5.0;
      
      ph[i] = Math.random() * Math.PI * 2;
      
      if (isPetal) {
        drg[i] = 1.5 + Math.random() * 2.0; 
        ms[i] = 0.2 + Math.random() * 0.5;  
        sc[i] = 0.2 + Math.random() * 0.25; 
        
        let c = colorPetal.clone().lerp(new THREE.Color(0xffffff), Math.random() * 0.5);
        cols[i3] = c.r; cols[i3 + 1] = c.g; cols[i3 + 2] = c.b;
      } else {
        drg[i] = 0.8 + Math.random() * 1.5; 
        ms[i] = 0.5 + Math.random() * 1.5;  
        sc[i] = 0.4 + Math.random() * 0.8; 
        
        const r = Math.random();
        let c = colorAutumn1;
        if (r < 0.25) c = colorAutumn2;
        else if (r < 0.5) c = colorAutumn3;
        else if (r < 0.75) c = colorGreen;
        
        c = c.clone().lerp(new THREE.Color(0xffffff), Math.random() * 0.1);
        cols[i3] = c.r; cols[i3 + 1] = c.g; cols[i3 + 2] = c.b;
      }
    }
    
    return { pos, vel, rot, angVel, ph, sc, drg, ms, cols };
  };

  const leafState = useMemo(() => generatePhysicsState(count, false), [count]);
  const petalState = useMemo(() => generatePhysicsState(petalCount, true), [petalCount]);

  useEffect(() => {
    const applyState = (mesh: THREE.InstancedMesh, state: any, total: number) => {
      const dummy = new THREE.Object3D();
      const color = new THREE.Color();
      for (let i = 0; i < total; i++) {
        const i3 = i * 3;
        dummy.position.set(state.pos[i3], state.pos[i3 + 1], state.pos[i3 + 2]);
        dummy.rotation.set(state.rot[i3], state.rot[i3 + 1], state.rot[i3 + 2]);
        dummy.scale.setScalar(state.sc[i]);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        color.setRGB(state.cols[i3], state.cols[i3 + 1], state.cols[i3 + 2]);
        mesh.setColorAt(i, color);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.geometry.setAttribute('velocity', new THREE.InstancedBufferAttribute(state.vel, 3));
    };

    if (leafMeshRef.current) applyState(leafMeshRef.current, leafState, count);
    if (petalMeshRef.current) applyState(petalMeshRef.current, petalState, petalCount);
  }, [leafState, petalState, count, petalCount]);

  // Leaf Material (Seasonal Tint)
  const leafMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      roughness: 0.6,
      metalness: 0.05,
      color: 0xffffff // Base color, overridden by instances
    });
    
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uSeason = customUniforms.current.uSeason;
      
      shader.vertexShader = `
        attribute vec3 velocity;
        ${shader.vertexShader}
      `.replace(
        `#include <project_vertex>`,
        `
        vec4 mvPosition = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
        #endif
        mvPosition = modelViewMatrix * mvPosition;
        
        vec3 viewVel = (viewMatrix * vec4(velocity, 0.0)).xyz;
        float speed = length(viewVel);
        if (speed > 1.0) {
           float dotDir = dot(normalize(transformed + vec3(0.001)), normalize((inverse(modelMatrix) * vec4(velocity, 0.0)).xyz + vec3(0.001)));
           if (dotDir < 0.0) {
              mvPosition.xyz -= viewVel * 0.05; 
           }
        }
        gl_Position = projectionMatrix * mvPosition;
        `
      );

      shader.fragmentShader = `
        uniform float uSeason;
        ${shader.fragmentShader}
      `.replace(
        `#include <color_fragment>`,
        `
        #include <color_fragment>
        // Seasonal tint over instances
        vec3 springColor = vec3(0.5, 0.9, 0.3); 
        vec3 summerColor = vec3(0.2, 0.6, 0.1); 
        vec3 autumnColor = diffuseColor.rgb; // Base instance color is autumnal 
        
        vec3 seasonColor;
        if (uSeason < 0.25) {
           seasonColor = mix(springColor, summerColor, uSeason * 4.0);
           diffuseColor.rgb = mix(diffuseColor.rgb, seasonColor, 0.7);
        } else if (uSeason < 0.5) {
           seasonColor = mix(summerColor, autumnColor, (uSeason - 0.25) * 4.0);
           diffuseColor.rgb = mix(diffuseColor.rgb, seasonColor, 0.7);
        }
        // Autumn & Winter just use the natural leaf colors
        `
      );
    };
    return mat;
  }, []);

  // Petal Material (Simpler, no seasonal tinting, always pinkish)
  const petalMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffe6ee,
      roughness: 0.7,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.2,
      opacity: 0.95
    });
    
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = `
        attribute vec3 velocity;
        ${shader.vertexShader}
      `.replace(
        `#include <project_vertex>`,
        `
        vec4 mvPosition = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
        #endif
        mvPosition = modelViewMatrix * mvPosition;
        
        vec3 viewVel = (viewMatrix * vec4(velocity, 0.0)).xyz;
        if (length(viewVel) > 1.0) {
           float dotDir = dot(normalize(transformed + vec3(0.001)), normalize((inverse(modelMatrix) * vec4(velocity, 0.0)).xyz + vec3(0.001)));
           if (dotDir < 0.0) mvPosition.xyz -= viewVel * 0.05; 
        }
        gl_Position = projectionMatrix * mvPosition;
        `
      );
    };
    return mat;
  }, []);

  const leafGeometry = useMemo(() => {
    // True 3D curved shape geometry instead of a flat plane to fix the "square confetti" bug
    const shape = new THREE.Shape();
    shape.moveTo(0, 0); // Stem
    const width = 0.35;
    const height = 0.7;
    shape.bezierCurveTo(width, height * 0.2, width, height * 0.8, 0, height);
    shape.bezierCurveTo(-width, height * 0.8, -width, height * 0.2, 0, 0);

    const geo = new THREE.ShapeGeometry(shape, 12); // Increased from 3 to 12 for perfectly smooth leaf outlines
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      z += Math.abs(x) * 0.25 - y * 0.15; // Cup and droop the leaf
      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    geo.translate(0, -height * 0.5, 0); // Center pivot
    return geo;
  }, []);

  const petalGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.6, 0.6);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      pos.setZ(i, (Math.abs(x) + Math.abs(y)) * 0.2);
    }
    geo.computeVertexNormals();
    geo.translate(0, 0.3, 0);
    return geo;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    return () => {
      leafMaterial.dispose();
      petalMaterial.dispose();
      leafGeometry.dispose();
      petalGeometry.dispose();
      leafTexture.dispose();
    };
  }, [leafMaterial, petalMaterial, leafGeometry, petalGeometry, leafTexture]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.1);
    customUniforms.current.uTime.value = t;
    
    // Map scroll progress (0 to 1) directly to season
    const uSeason = scrollYProgress.get();
    customUniforms.current.uSeason.value = uSeason;
    
    // Logic for deciding what spawns
    const isSpring = uSeason < 0.25 || uSeason > 0.85;
    const isAutumn = uSeason > 0.4 && uSeason < 0.75;
    
    const windGustX = Math.sin(t * 0.5) * 6.0 + Math.sin(t * 1.3) * 4.0;
    const windGustZ = Math.cos(t * 0.8) * 3.0 + Math.cos(t * 2.1) * 2.0;

    const runPhysics = (mesh: THREE.InstancedMesh, stateData: any, total: number, isPetal: boolean) => {
      for (let i = 0; i < total; i++) {
        const i3 = i * 3;
        if (stateData.pos[i3 + 1] < -12.0) {
          stateData.vel[i3] = 0;
          stateData.vel[i3 + 1] = 0;
          stateData.vel[i3 + 2] = 0;
          
          stateData.angVel[i3] *= 0.8;
          stateData.angVel[i3 + 1] *= 0.8;
          stateData.angVel[i3 + 2] *= 0.8;
          
          const canSpawn = isPetal ? isSpring : isAutumn;
          if (canSpawn && Math.random() < 0.005) {
            stateData.pos[i3 + 1] = 10 + Math.random() * 15;
            stateData.pos[i3] = (Math.random() - 0.5) * 40;
            stateData.pos[i3 + 2] = (Math.random() - 0.5) * 30;
          }
        } else {
          stateData.vel[i3 + 1] -= 9.8 * dt * stateData.ms[i];
          
          const localWindX = windGustX + Math.sin(stateData.pos[i3 + 1] * 0.2 + stateData.ph[i]) * 4.0;
          const localWindZ = windGustZ + Math.cos(stateData.pos[i3 + 1] * 0.2 + stateData.ph[i]) * 4.0;
          
          stateData.vel[i3] += localWindX * dt * (1.0 / stateData.ms[i]);
          stateData.vel[i3 + 2] += localWindZ * dt * (1.0 / stateData.ms[i]);
          
          const speed = Math.sqrt(stateData.vel[i3]*stateData.vel[i3] + stateData.vel[i3+1]*stateData.vel[i3+1] + stateData.vel[i3+2]*stateData.vel[i3+2]);
          if (speed > 0) {
             const lift = Math.sin(t * 5.0 + stateData.ph[i]) * speed * 0.5;
             stateData.vel[i3] += Math.cos(stateData.rot[i3 + 1]) * lift * dt;
             stateData.vel[i3 + 2] += Math.sin(stateData.rot[i3 + 1]) * lift * dt;
          }
          
          stateData.vel[i3] -= stateData.vel[i3] * stateData.drg[i] * dt;
          stateData.vel[i3 + 1] -= stateData.vel[i3 + 1] * stateData.drg[i] * 0.5 * dt; 
          stateData.vel[i3 + 2] -= stateData.vel[i3 + 2] * stateData.drg[i] * dt;
          
          stateData.angVel[i3] += stateData.vel[i3 + 2] * dt;
          stateData.angVel[i3 + 2] -= stateData.vel[i3] * dt;
          stateData.angVel[i3] *= 0.98;
          stateData.angVel[i3 + 1] *= 0.98;
          stateData.angVel[i3 + 2] *= 0.98;
        }
        
        stateData.pos[i3] += stateData.vel[i3] * dt;
        stateData.pos[i3 + 1] += stateData.vel[i3 + 1] * dt;
        stateData.pos[i3 + 2] += stateData.vel[i3 + 2] * dt;
        
        stateData.rot[i3] += stateData.angVel[i3] * dt;
        stateData.rot[i3 + 1] += stateData.angVel[i3 + 1] * dt;
        stateData.rot[i3 + 2] += stateData.angVel[i3 + 2] * dt;
        
        dummy.position.set(stateData.pos[i3], stateData.pos[i3 + 1], stateData.pos[i3 + 2]);
        dummy.rotation.set(stateData.rot[i3], stateData.rot[i3 + 1], stateData.rot[i3 + 2]);
        dummy.scale.setScalar(stateData.sc[i]);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.geometry.attributes.velocity) {
        mesh.geometry.attributes.velocity.needsUpdate = true;
      }
    };

    if (leafMeshRef.current) runPhysics(leafMeshRef.current, leafState, count, false);
    if (petalMeshRef.current) runPhysics(petalMeshRef.current, petalState, petalCount, true);
  });

  return (
    <>
      <instancedMesh ref={leafMeshRef} args={[leafGeometry, leafMaterial, count]} castShadow receiveShadow />
      <instancedMesh ref={petalMeshRef} args={[petalGeometry, petalMaterial, petalCount]} castShadow={false} receiveShadow />
    </>
  );
};
