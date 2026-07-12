import { useRef, useMemo, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "framer-motion";

// ─── L-SYSTEM GENERATOR ────────────────────────────────────────────────────────
const generateInstancedTree = (iterations = 7, initialLength = 4.0, initialRadius = 0.8) => {
  const mainBranchMatrices: THREE.Matrix4[] = [];
  const twigMatrices: THREE.Matrix4[] = [];
  const leafMatrices: THREE.Matrix4[] = [];
  const blossomMatrices: THREE.Matrix4[] = [];

  const buildBranch = (
    start: THREE.Vector3,
    dir: THREE.Vector3,
    len: number,
    rad: number,
    depth: number,
    isTrunk: boolean
  ) => {
    const end = start.clone().add(dir.clone().multiplyScalar(len));

    const matrix = new THREE.Matrix4();
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dir);

    // Position at midpoint since cylinder origin is center
    const midPoint = start.clone().add(dir.clone().multiplyScalar(len / 2));

    matrix.compose(
      midPoint,
      quaternion,
      new THREE.Vector3(rad, len, rad)
    );

    if (depth > 2) {
      mainBranchMatrices.push(matrix);
    } else {
      twigMatrices.push(matrix);
    }

    // Add Leaves at the ends
    if (depth <= 2) {
      const numLeaves = depth === 0 ? 9 : 5;
      for (let i = 0; i < numLeaves; i++) {
        const leafMat = new THREE.Matrix4();
        // Random spherical direction, slightly more organic clustering
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const leafDir = new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.sin(phi) * Math.sin(theta),
          Math.cos(phi)
        );
        // Slightly bias upwards and outwards
        leafDir.y = Math.abs(leafDir.y) + 0.3;
        leafDir.normalize();

        const leafQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), leafDir);
        const randomYRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2);
        const randomZRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), (Math.random() - 0.5) * 0.5);
        leafQ.multiply(randomYRot).multiply(randomZRot);

        // Clustered positioning
        const offset = new THREE.Vector3((Math.random() - 0.5) * rad * 6, (Math.random() - 0.2) * rad * 6, (Math.random() - 0.5) * rad * 6);
        const leafPos = end.clone().add(offset);
        const leafScale = 1.0 + Math.random() * 1.2;

        leafMat.compose(leafPos, leafQ, new THREE.Vector3(leafScale, leafScale, leafScale));
        leafMatrices.push(leafMat);
      }
      
      // Add Blossoms
      const numBlossoms = depth === 0 ? 3 : 1;
      for (let i = 0; i < numBlossoms; i++) {
        if (Math.random() > 0.5) continue;
        const blossomMat = new THREE.Matrix4();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const bDir = new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.sin(phi) * Math.sin(theta),
          Math.cos(phi)
        ).normalize();

        const bQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), bDir);
        const bPos = end.clone().add(bDir.multiplyScalar(rad * 1.2));
        const bScale = 0.3 + Math.random() * 0.25;

        blossomMat.compose(bPos, bQ, new THREE.Vector3(bScale, bScale, bScale));
        blossomMatrices.push(blossomMat);
      }
    }

    if (depth === 0) return;

    // More organic branching: trunks split less often but thicker, branches split more
    const numBranches = isTrunk ? (Math.random() > 0.2 ? 3 : 2) : (Math.random() > 0.3 ? 2 : 3);

    for (let i = 0; i < numBranches; i++) {
      const spreadAngle = (Math.PI / 4) * (0.5 + Math.random() * 0.8);
      const rotAngle = (Math.PI * 2 * i) / numBranches + (Math.random() * 1.0 - 0.5);

      const newDir = dir.clone();
      const tangent = new THREE.Vector3(1, 0, 0);
      if (Math.abs(newDir.dot(tangent)) > 0.9) tangent.set(0, 0, 1);
      tangent.cross(newDir).normalize();

      newDir.applyAxisAngle(tangent, spreadAngle);
      newDir.applyAxisAngle(dir, rotAngle);

      // Phototropism
      const upwardPull = depth < 3 ? 0.4 : 0.15;
      newDir.lerp(new THREE.Vector3(0, 1, 0), upwardPull).normalize();

      // Gravity droop on heavier lower branches
      if (!isTrunk && depth > 2 && newDir.y < 0.6) {
        newDir.lerp(new THREE.Vector3(0, -1, 0), 0.25).normalize();
      }

      const nextLen = len * (0.65 + Math.random() * 0.2);
      const nextRad = rad * (0.55 + Math.random() * 0.15);

      buildBranch(end, newDir, nextLen, nextRad, depth - 1, false);
    }
  };

  buildBranch(new THREE.Vector3(0, -2, 0), new THREE.Vector3(0, 1, 0), initialLength, initialRadius, iterations, true);

  return { mainBranchMatrices, twigMatrices, leafMatrices, blossomMatrices };
};

// ─── GENERATE TREE BASE (ROOTS & ROCKS) ─────────────────────────────────────────
const generateTreeBase = () => {
  const rootMatrices: THREE.Matrix4[] = [];
  const rockMatrices: THREE.Matrix4[] = [];
  const grassMatrices: THREE.Matrix4[] = [];

  // Generate Roots
  const numRoots = 7;
  for (let i = 0; i < numRoots; i++) {
    const angle = (Math.PI * 2 * i) / numRoots + (Math.random() * 0.5);
    const dir = new THREE.Vector3(Math.cos(angle), -0.5, Math.sin(angle)).normalize();
    
    let currentPos = new THREE.Vector3(0, -1.8, 0); // Start slightly below trunk base
    let currentDir = dir.clone();
    let rad = 0.9;
    let len = 1.5;

    for (let j = 0; j < 4; j++) {
      const nextPos = currentPos.clone().add(currentDir.clone().multiplyScalar(len));
      const midPoint = currentPos.clone().add(currentDir.clone().multiplyScalar(len / 2));
      
      const matrix = new THREE.Matrix4();
      const up = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, currentDir);
      
      matrix.compose(midPoint, quaternion, new THREE.Vector3(rad, len, rad));
      rootMatrices.push(matrix);

      currentPos = nextPos;
      // Roots go deeper and spread out
      currentDir.lerp(new THREE.Vector3(currentDir.x, -1, currentDir.z), 0.4).normalize();
      currentDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * 0.5);
      rad *= 0.6;
      len *= 0.9;
      
      if (currentPos.y < -4) break;
    }
  }

  // Generate Rocks
  for (let i = 0; i < 15; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 1.5 + Math.random() * 4.0;
    const pos = new THREE.Vector3(Math.cos(angle) * dist, -2.5 + Math.random() * 0.5, Math.sin(angle) * dist);
    
    const scale = 0.2 + Math.random() * 0.6;
    const matrix = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), Math.random() * Math.PI);
    matrix.compose(pos, q, new THREE.Vector3(scale, scale * 0.7, scale));
    rockMatrices.push(matrix);
  }

  return { rootMatrices, rockMatrices, grassMatrices };
};

// ─── SHADER INJECTIONS ────────────────────────────────────────────────────────

const snoiseGLSL = `
// Simplex 3D Noise 
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

const setupBarkMaterial = (material: THREE.MeshStandardMaterial) => {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = `
      varying vec2 vInstUv;
      varying vec3 vWorldPos;
      ${shader.vertexShader}
    `.replace(
      `#include <begin_vertex>`,
      `
      #include <begin_vertex>
      vInstUv = uv;
      vWorldPos = (instanceMatrix * vec4(position, 1.0)).xyz;
      `
    );

    shader.fragmentShader = `
      varying vec2 vInstUv;
      varying vec3 vWorldPos;
      ${snoiseGLSL}
      ${shader.fragmentShader}
    `.replace(
      `#include <color_fragment>`,
      `
      #include <color_fragment>
      
      // Procedural Bark Texture
      float n = snoise(vec3(vInstUv.x * 25.0, vInstUv.y * 2.0, vWorldPos.y * 0.1));
      n += snoise(vec3(vInstUv.x * 60.0, vInstUv.y * 10.0, 0.0)) * 0.3;
      n += snoise(vec3(vInstUv.x * 120.0, vInstUv.y * 20.0, 0.0)) * 0.15;
      
      vec3 color1 = vec3(0.12, 0.09, 0.06); // Deep rich brown
      vec3 color2 = vec3(0.24, 0.18, 0.12); // Lighter brown
      vec3 mossColor = vec3(0.25, 0.32, 0.15); // Vibrant moss green
      
      vec3 barkColor = mix(color1, color2, (n + 1.0) * 0.5);
      
      // Add moss on the "North" side (based on world position / normal approximation)
      float mossMask = smoothstep(0.2, 0.8, snoise(vWorldPos * 0.5) + vWorldPos.z * 0.05);
      diffuseColor = vec4(mix(barkColor, mossColor, mossMask * 0.4), 1.0);
      `
    );
  };
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export const ProceduralTree = ({ position = [0, -10, -15] }: { position?: [number, number, number] }) => {
  const { scrollYProgress } = useScroll();
  const mainBranchMeshRef = useRef<THREE.InstancedMesh>(null);
  const twigMeshRef = useRef<THREE.InstancedMesh>(null);
  const leafMeshRef = useRef<THREE.InstancedMesh>(null);
  const blossomMeshRef = useRef<THREE.InstancedMesh>(null);
  const rootMeshRef = useRef<THREE.InstancedMesh>(null);
  const rockMeshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const customUniforms = useRef({ uTime: { value: 0 }, uSeason: { value: 0 } });

  const { mainBranchMatrices, twigMatrices, leafMatrices, blossomMatrices } = useMemo(() => generateInstancedTree(7, 4.0, 0.8), []);
  const { rootMatrices, rockMatrices } = useMemo(() => generateTreeBase(), []);

  const leafTexture = useLoader(THREE.TextureLoader, '/textures/realistic_leaf.png');
  leafTexture.colorSpace = THREE.SRGBColorSpace;

  // Geometry
  const mainBranchGeo = useMemo(() => new THREE.CylinderGeometry(0.65, 1.0, 1, 9, 1), []);
  const twigGeo = useMemo(() => new THREE.CylinderGeometry(0.3, 1.0, 1, 5, 1), []);
  const rootGeo = useMemo(() => new THREE.CylinderGeometry(0.65, 1.0, 1, 7, 1), []);
  const rockGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const soilGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(6, 6.5, 1.5, 32, 4);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      if (v.y > 0) {
        // Create a mound shape
        const dist = Math.sqrt(v.x * v.x + v.z * v.z);
        v.y += Math.cos((dist / 6) * Math.PI * 0.5) * 1.5;
        // Add noise to soil
        v.y += (Math.random() - 0.5) * 0.3;
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);
  
  const leafGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1.5, 1.5);
    geo.translate(0, 0.75, 0); 
    return geo;
  }, []);

  const blossomGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1.0, 1.0);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      pos.setZ(i, (Math.abs(x) + Math.abs(y)) * 0.3);
    }
    geo.computeVertexNormals();
    geo.translate(0, 0.5, 0);
    return geo;
  }, []);

  // Materials
  const mainBarkMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0.0 });
    setupBarkMaterial(mat);
    return mat;
  }, []);

  const rockMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x4a4a4a, roughness: 0.8, metalness: 0.1
  }), []);

  const soilMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x2d1f14, roughness: 1.0, metalness: 0.0
  }), []);

  const blossomMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffe6ee, roughness: 0.7, side: THREE.DoubleSide, transparent: true, alphaTest: 0.2, opacity: 0.95
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.current.uTime;
      shader.uniforms.uSeason = customUniforms.current.uSeason;
      shader.vertexShader = `
        uniform float uTime;
        uniform float uSeason;
        ${shader.vertexShader}
      `.replace(
        `#include <begin_vertex>`,
        `
        vec3 pos = position;
        vec3 worldPos = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        float wrapSeason = min(uSeason, abs(uSeason - 1.0));
        float scale = smoothstep(0.2, 0.05, wrapSeason);
        pos *= scale;
        float flutter = sin(uTime * 6.0 + worldPos.x * 12.0) * 0.1 * scale;
        float s = sin(flutter);
        float c = cos(flutter);
        mat3 rotX = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
        pos = rotX * pos;
        vec3 transformed = pos;
        `
      );
    };
    return mat;
  }, []);

  const leafMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map: leafTexture, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.6, metalness: 0.0, color: 0xffffff
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.current.uTime;
      shader.uniforms.uSeason = customUniforms.current.uSeason;
      
      shader.vertexShader = `
        uniform float uTime;
        uniform float uSeason;
        ${shader.vertexShader}
      `.replace(
        `#include <begin_vertex>`,
        `
        vec3 pos = position;
        vec3 worldPos = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        float randDelay = fract(sin(worldPos.x * 12.33 + worldPos.z * 4.31) * 43.11) * 0.1;
        float sTime = fract(uSeason - randDelay);
        float scale = 1.0;
        if (sTime < 0.1) {
           scale = smoothstep(0.0, 0.1, sTime);
        } else if (sTime > 0.6 && sTime < 0.75) {
           scale = 1.0 - smoothstep(0.6, 0.75, sTime);
        } else if (sTime >= 0.75) {
           scale = 0.0;
        }
        pos *= max(scale, 0.0);
        
        // Wind interaction
        float flutter = sin(uTime * 4.0 + worldPos.x * 5.0 + worldPos.y * 3.0) * 0.15 * scale;
        float s = sin(flutter);
        float c = cos(flutter);
        mat3 rotX = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
        pos = rotX * pos;
        float sway = sin(uTime * 0.8 + worldPos.z * 0.2 + worldPos.x * 0.1) * 0.1 * scale;
        pos.x += sway * pos.y;
        vec3 transformed = pos;
        `
      );
      
      shader.fragmentShader = `
        uniform float uSeason;
        ${shader.fragmentShader}
      `.replace(
        `#include <color_fragment>`,
        `
        #include <color_fragment>
        vec3 springColor = vec3(0.6, 0.9, 0.3);
        vec3 summerColor = vec3(0.2, 0.6, 0.15);
        vec3 autumnColor = vec3(0.9, 0.4, 0.05);
        
        vec3 seasonColor;
        if (uSeason < 0.25) {
           seasonColor = mix(springColor, summerColor, uSeason * 4.0);
        } else if (uSeason < 0.5) {
           seasonColor = mix(summerColor, autumnColor, (uSeason - 0.25) * 4.0);
        } else {
           seasonColor = autumnColor;
        }
        
        float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
        diffuseColor.rgb = mix(diffuseColor.rgb, seasonColor * lum * 2.2, 0.65);
        `
      );
    };
    return mat;
  }, [leafTexture]);

  useEffect(() => {
    if (mainBranchMeshRef.current) {
      mainBranchMatrices.forEach((mat, i) => mainBranchMeshRef.current!.setMatrixAt(i, mat));
      mainBranchMeshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (twigMeshRef.current) {
      twigMatrices.forEach((mat, i) => twigMeshRef.current!.setMatrixAt(i, mat));
      twigMeshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (leafMeshRef.current) {
      leafMatrices.forEach((mat, i) => leafMeshRef.current!.setMatrixAt(i, mat));
      leafMeshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (blossomMeshRef.current) {
      blossomMatrices.forEach((mat, i) => blossomMeshRef.current!.setMatrixAt(i, mat));
      blossomMeshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (rootMeshRef.current) {
      rootMatrices.forEach((mat, i) => rootMeshRef.current!.setMatrixAt(i, mat));
      rootMeshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (rockMeshRef.current) {
      rockMatrices.forEach((mat, i) => rockMeshRef.current!.setMatrixAt(i, mat));
      rockMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [mainBranchMatrices, twigMatrices, leafMatrices, blossomMatrices, rootMatrices, rockMatrices]);

  // Memory Cleanup
  useEffect(() => {
    return () => {
      mainBranchGeo.dispose();
      twigGeo.dispose();
      rootGeo.dispose();
      rockGeo.dispose();
      soilGeo.dispose();
      leafGeo.dispose();
      blossomGeo.dispose();
      
      mainBarkMat.dispose();
      rockMat.dispose();
      soilMat.dispose();
      blossomMat.dispose();
      leafMat.dispose();
    };
  }, [mainBranchGeo, twigGeo, rootGeo, rockGeo, soilGeo, leafGeo, blossomGeo, mainBarkMat, rockMat, soilMat, blossomMat, leafMat]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    customUniforms.current.uTime.value = t;
    customUniforms.current.uSeason.value = scrollYProgress.get();
    
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.015;
      groupRef.current.rotation.x = Math.sin(t * 0.4 + 1.0) * 0.01;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Base / Soil */}
      <mesh geometry={soilGeo} material={soilMat} position={[0, -2.8, 0]} receiveShadow />

      {/* Roots */}
      <instancedMesh ref={rootMeshRef} args={[rootGeo, mainBarkMat, rootMatrices.length]} castShadow receiveShadow />

      {/* Rocks */}
      <instancedMesh ref={rockMeshRef} args={[rockGeo, rockMat, rockMatrices.length]} castShadow receiveShadow />

      {/* Main Branches */}
      <instancedMesh ref={mainBranchMeshRef} args={[mainBranchGeo, mainBarkMat, mainBranchMatrices.length]} castShadow receiveShadow />
      
      {/* Twigs */}
      <instancedMesh ref={twigMeshRef} args={[twigGeo, mainBarkMat, twigMatrices.length]} castShadow receiveShadow />
      
      {/* Leaves */}
      <instancedMesh ref={leafMeshRef} args={[leafGeo, leafMat, leafMatrices.length]} castShadow receiveShadow />
      
      {/* Blossoms */}
      <instancedMesh ref={blossomMeshRef} args={[blossomGeo, blossomMat, blossomMatrices.length]} receiveShadow />
    </group>
  );
};
