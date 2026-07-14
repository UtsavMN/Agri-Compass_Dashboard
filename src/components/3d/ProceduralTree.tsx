import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useQualityStore } from "../../store/useQualityStore";
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

interface PathNode {
  pos: THREE.Vector3;
  dir: THREE.Vector3;
  radius: number;
}

class TaperedTubeGeometry extends THREE.TubeGeometry {
  constructor(path: THREE.Curve<THREE.Vector3>, tubularSegments: number, radiusArray: number[], radialSegments: number) {
    super(path, tubularSegments, 1, radialSegments, false);
    const pos = this.attributes.position;
    
    for (let i = 0; i <= tubularSegments; i++) {
      const u = i / tubularSegments;
      const idx = u * (radiusArray.length - 1);
      const iIdx = Math.floor(idx);
      const f = idx - iIdx;
      const rad = iIdx < radiusArray.length - 1 
         ? radiusArray[iIdx] * (1 - f) + radiusArray[iIdx + 1] * f
         : radiusArray[radiusArray.length - 1];
         
      const pt = path.getPointAt(u);
      
      for (let j = 0; j <= radialSegments; j++) {
         const vIdx = i * (radialSegments + 1) + j;
         let x = pos.getX(vIdx);
         let y = pos.getY(vIdx);
         let z = pos.getZ(vIdx);
         
         const dir = new THREE.Vector3(x - pt.x, y - pt.y, z - pt.z).normalize();
         const newPos = pt.clone().add(dir.multiplyScalar(rad));
         
         pos.setXYZ(vIdx, newPos.x, newPos.y, newPos.z);
      }
    }
    this.computeVertexNormals();
  }
}

// ─── L-SYSTEM GENERATOR (Banyan-Inspired Organic Growth) ────────────────────────
const generateSeamlessTree = (iterations = 7, initialLength = 4.0, initialRadius = 1.3) => {
  const coreBranchGeometries: THREE.BufferGeometry[] = [];
  const twigGeometries: THREE.BufferGeometry[] = [];
  const rootGeometries: THREE.BufferGeometry[] = [];
  const leafMatrices1: THREE.Matrix4[] = [];
  const leafMatrices2: THREE.Matrix4[] = [];
  const blossomMatrices: THREE.Matrix4[] = [];
  const fruitMatrices: THREE.Matrix4[] = [];
  const flowPaths: PathNode[][] = [];

  const GROUND_Y = -5.0;

  const buildBranch = (
    startPos: THREE.Vector3,
    startDir: THREE.Vector3,
    len: number,
    startRad: number,
    depth: number,
    isTrunk: boolean,
    currentPath: PathNode[]
  ) => {
    const segments = 8; // High segments for ultra-smooth curving
    
    const curvePoints: THREE.Vector3[] = [startPos.clone()];
    const curveRadii: number[] = [startRad];
    
    let currentStart = startPos.clone();
    let currentDir = startDir.clone();
    let currentRad = startRad;

    for(let s = 0; s < segments; s++) {
      const segLen = len / segments;
      const end = currentStart.clone().add(currentDir.clone().multiplyScalar(segLen));
      const nextRad = startRad * (1 - ((s + 1) / segments) * 0.15);
      
      curvePoints.push(end.clone());
      curveRadii.push(nextRad);
      
      currentPath.push({ pos: currentStart.clone(), dir: currentDir.clone(), radius: currentRad });
      
      currentStart = end;
      currentRad = nextRad;

      currentDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * 0.15);
      if (!isTrunk) {
         // Elegant Oak-style reaching: out and up
         const outDir = new THREE.Vector3(currentStart.x, 0, currentStart.z).normalize();
         if (outDir.lengthSq() > 0.01) {
             currentDir.lerp(outDir, 0.04).normalize(); // Spread outwards
         }
         currentDir.lerp(new THREE.Vector3(0, 1, 0), 0.06).normalize(); // Reach for the sky
      }
    }
    
    currentPath.push({ pos: currentStart.clone(), dir: currentDir.clone(), radius: currentRad });

    if (curvePoints.length > 1) {
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeo = new TaperedTubeGeometry(curve, segments * 3, curveRadii, 8); // Reduced from 16 to 8 segments
      
      const targetArray = depth > 3 ? coreBranchGeometries : twigGeometries;
      targetArray.push(tubeGeo);
      
      if (depth === 0) {
        const capSphere = new THREE.SphereGeometry(currentRad * 0.95, 12, 12);
        const capMat = new THREE.Matrix4().setPosition(currentStart);
        capSphere.applyMatrix4(capMat);
        targetArray.push(capSphere);
      }
    }

    const end = currentStart;

    // Leaves - Huge clusters for volumetric canopy
    if (depth <= 2) {
      const numLeaves = depth === 0 ? 120 : 60; // 4x increase in density
      for (let i = 0; i < numLeaves; i++) {
        if (depth === 1 && Math.random() > 0.8) continue;
        const leafMat = new THREE.Matrix4();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const leafDir = new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.sin(phi) * Math.sin(theta),
          Math.cos(phi)
        );
        leafDir.y = Math.abs(leafDir.y) + 0.2;
        leafDir.normalize();

        const leafQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), leafDir);
        leafQ.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2));
        
        const spread = startRad * (8.0 + Math.random() * 6.0); // Wider spread
        const offset = new THREE.Vector3((Math.random() - 0.5) * spread, (Math.random() - 0.2) * spread * 0.8, (Math.random() - 0.5) * spread);
        const leafPos = end.clone().add(offset);
        
        const leafScale = 0.5 + Math.random() * 0.4; // Larger leaves to fill volume
        leafMat.compose(leafPos, leafQ, new THREE.Vector3(leafScale, leafScale, leafScale));
        
        if (Math.random() > 0.5) leafMatrices1.push(leafMat);
        else leafMatrices2.push(leafMat);
        
        // Add Harvest/Fruit Nodes (representing completed application projects)
        if (depth === 1 && i === 0 && Math.random() > 0.3) {
          const fruitMat = new THREE.Matrix4();
          // Hang down slightly from the leaf cluster
          const fruitPos = leafPos.clone().add(new THREE.Vector3(0, -0.3, 0));
          const fScale = 0.8 + Math.random() * 0.4;
          fruitMat.compose(fruitPos, new THREE.Quaternion(), new THREE.Vector3(fScale, fScale, fScale));
          fruitMatrices.push(fruitMat);
        }
      }
      flowPaths.push([...currentPath]);
    }

    if (depth === 0) return;

    // Banyan branching
    const numBranches = isTrunk ? (Math.random() > 0.1 ? 3 : 2) : (Math.random() > 0.3 ? 2 : 3);
    for (let i = 0; i < numBranches; i++) {
      const spreadAngle = isTrunk ? (Math.PI / 4) * (0.8 + Math.random() * 0.4) : (Math.PI / 6) * (0.6 + Math.random() * 0.4);
      const rotAngle = (Math.PI * 2 * i) / numBranches + (Math.random() * 1.0 - 0.5);

      const newDir = currentDir.clone();
      const tangent = new THREE.Vector3(1, 0, 0);
      if (Math.abs(newDir.dot(tangent)) > 0.9) tangent.set(0, 0, 1);
      tangent.cross(newDir).normalize();

      newDir.applyAxisAngle(tangent, spreadAngle);
      newDir.applyAxisAngle(currentDir, rotAngle);

      if (!isTrunk && depth > 2 && newDir.y < 0.7) {
        newDir.lerp(new THREE.Vector3(0, -1, 0), 0.35).normalize();
      } else {
        newDir.lerp(new THREE.Vector3(0, 1, 0), 0.15).normalize();
      }

      const nextLen = isTrunk ? len * 0.7 : len * (0.75 + Math.random() * 0.2);
      const nextRad = currentRad * (0.75 + Math.random() * 0.05); // Less abrupt radius jump at joints

      buildBranch(end, newDir, nextLen, nextRad, depth - 1, false, [...currentPath]);
    }
  };

  // Start building the core tree with massive radius
  buildBranch(new THREE.Vector3(0, -1.2, 0), new THREE.Vector3(0, 1, 0), initialLength, initialRadius, iterations, true, []);

  // Explicitly spawn a balancing branch on the right side (to fix the bare spot in the screenshot)
  buildBranch(
    new THREE.Vector3(0.5, 1.8, 0.2), // Midway up the trunk on the right
    new THREE.Vector3(1.0, 0.4, 0.3).normalize(), // Pointing right and slightly up/forward
    initialLength * 0.7, 
    initialRadius * 0.65, 
    iterations - 1, 
    false, 
    []
  );

  // ─── GENERATE TREE BASE (ROOTS & ROCKS) ─────────────────────────────────────────
  const rockMatrices: THREE.Matrix4[] = [];

  // Generate Organic Tangled Roots (Sprawling like reference image)
  const numRoots = 45; // Massive root system
  for (let i = 0; i < numRoots; i++) {
    const angle = (Math.PI * 2 * i) / numRoots + (Math.random() * 0.5);
    const dir = new THREE.Vector3(Math.cos(angle), -0.2, Math.sin(angle)).normalize();
    
    let currentPos = new THREE.Vector3(Math.cos(angle) * 1.5, -1.2, Math.sin(angle) * 1.5); 
    let currentDir = dir.clone();
    let rad = 0.6 + Math.random() * 0.8;
    let len = 1.5 + Math.random() * 3.0;

    const rootPoints: THREE.Vector3[] = [currentPos.clone()];
    const rootRadii: number[] = [rad];

    for (let j = 0; j < 8; j++) {
      let nextPos = currentPos.clone().add(currentDir.clone().multiplyScalar(len));
      let nextRad = rad * 0.45;
      
      // Ground clamping
      if (nextPos.y <= GROUND_Y) {
         nextPos.y = GROUND_Y - 0.2; // Sink slightly
         currentDir.y = 0;
         currentDir.normalize();
      }

      rootPoints.push(nextPos.clone());
      rootRadii.push(nextRad);

      // Spawn Secondary Rootlets
      if (Math.random() > 0.5 && j > 1 && j < 5) {
         const rootletDir = currentDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() > 0.5 ? 1 : -1) * 0.8).normalize();
         rootletDir.y -= 0.5;
         rootletDir.normalize();
         let rEnd = currentPos.clone().add(rootletDir.clone().multiplyScalar(len * 0.6));
         if (rEnd.y <= GROUND_Y) rEnd.y = GROUND_Y - 0.2;
         
         const rootletPoints = [currentPos.clone(), rEnd];
         const rootletRadii = [rad * 0.5, rad * 0.1];
         const rootletCurve = new THREE.CatmullRomCurve3(rootletPoints);
         const rootletGeo = new TaperedTubeGeometry(rootletCurve, 4, rootletRadii, 5);
         rootGeometries.push(rootletGeo);
      }

      currentPos = nextPos;
      currentDir.lerp(new THREE.Vector3(currentDir.x * 1.5, -2, currentDir.z * 1.5), 0.5).normalize();
      currentDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * 0.8);
      rad = nextRad;
      len *= 0.85;
      
      if (currentPos.y < GROUND_Y - 0.5) break; 
    }
    
    if (rootPoints.length > 1) {
      const rootCurve = new THREE.CatmullRomCurve3(rootPoints);
      const rootGeo = new TaperedTubeGeometry(rootCurve, rootPoints.length * 3, rootRadii, 8);
      rootGeometries.push(rootGeo);
    }
  }

  // Grounded Rocks removed

  const mergedBranches = coreBranchGeometries.length > 0 ? BufferGeometryUtils.mergeGeometries(coreBranchGeometries) : new THREE.BufferGeometry();
  const mergedTwigs = twigGeometries.length > 0 ? BufferGeometryUtils.mergeGeometries(twigGeometries) : new THREE.BufferGeometry();
  const mergedRoots = rootGeometries.length > 0 ? BufferGeometryUtils.mergeGeometries(rootGeometries) : new THREE.BufferGeometry();

  return { mergedBranches, mergedTwigs, mergedRoots, rockMatrices, leafMatrices1, leafMatrices2, blossomMatrices, fruitMatrices, flowPaths };
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

const setupBarkMaterial = (material: THREE.MeshStandardMaterial, customUniforms: any, isTwig = false) => {
  material.onBeforeCompile = (shader) => {
    if (isTwig) shader.uniforms.uSeason = customUniforms.current.uSeason;

    shader.vertexShader = `
      varying vec2 vUvScale;
      varying vec3 vWorldPos;
      ${shader.vertexShader}
    `.replace(
      `#include <begin_vertex>`,
      `
      #include <begin_vertex>
      vUvScale = uv; // Fallback
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      `
    );

    const twigDissolve = isTwig ? `
      float wrapSeason = min(uSeason, abs(uSeason - 1.0));
      float fade = 1.0;
      if (wrapSeason > 0.6) {
         fade = 1.0 - smoothstep(0.6, 0.75, wrapSeason);
      }
      float dissolveNoise = snoise(vWorldPos * 10.0);
      if (fade < 0.99 && dissolveNoise > (fade * 2.0 - 1.0)) {
          discard;
      }
    ` : "";

    shader.fragmentShader = `
      uniform float uSeason;
      varying vec2 vUvScale;
      varying vec3 vWorldPos;
      ${snoiseGLSL}
      ${shader.fragmentShader}
    `.replace(
      `#include <color_fragment>`,
      `
      #include <color_fragment>
      
      // Procedural Bark Texture mapped strictly via World Position for seamlessness across merged geometry
      float n = snoise(vec3(vWorldPos.x * 2.5, vWorldPos.y * 1.5, vWorldPos.z * 2.5));
      n += snoise(vec3(vWorldPos.x * 15.0, vWorldPos.y * 10.0, vWorldPos.z * 15.0)) * 0.3;
      n += snoise(vec3(vWorldPos.x * 40.0, vWorldPos.y * 20.0, vWorldPos.z * 40.0)) * 0.22;
      
      vec3 color1 = vec3(0.12, 0.09, 0.06); // Deep rich brown
      vec3 color2 = vec3(0.24, 0.18, 0.12); // Lighter brown
      vec3 mossColor = vec3(0.25, 0.32, 0.15); // Vibrant moss green
      
      vec3 barkColor = mix(color1, color2, (n + 1.0) * 0.5);
      
      // Add moss on the "North" side (based on world position / normal approximation)
      float mossMask = smoothstep(0.2, 0.8, snoise(vWorldPos * 0.5) + vWorldPos.z * 0.05);
      diffuseColor = vec4(mix(barkColor, mossColor, mossMask * 0.4), 1.0);
      ${twigDissolve}
      `
    );
  };
};

// ─── KNOWLEDGE FLOW SYSTEM ──────────────────────────────────────────────────────
const KnowledgeFlowSystem = ({ paths, maxCount }: { paths: PathNode[][], maxCount: number }) => {
  const particleCount = maxCount;
  const pointsRef = useRef<THREE.Points>(null);
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const particleData = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      pathIndex: Math.floor(Math.random() * paths.length),
      progress: Math.random(),
      speed: 0.08 + Math.random() * 0.15,
      pauseTimer: 0,
      angle: Math.random() * Math.PI * 2, // Surface rotation angle around branch
      id: i
    }));
  }, [paths, particleCount]);

  const geo = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const alphas = new Float32Array(particleCount);
    for(let i=0; i<particleCount; i++) {
      positions[i*3] = 0; positions[i*3+1] = -100; positions[i*3+2] = 0;
      alphas[i] = 0;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    return geometry;
  }, [particleCount]);

  const mat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (12.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if(dist > 0.5) discard;
          float glow = pow(1.0 - (dist * 2.0), 1.5);
          gl_FragColor = vec4(1.0, 0.7, 0.1, glow * vAlpha); // Golden amber sap flow
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false // Renders on top of bark so they look like glowing surface veins
    });
  }, []);

  useEffect(() => {
    return () => {
      geo.dispose();
      mat.dispose();
    };
  }, [geo, mat]);

  useFrame((_, delta) => {
    if (!pointsRef.current || paths.length === 0) return;
    if (isMobile && !reducedMotion) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const alphas = pointsRef.current.geometry.attributes.alpha.array as Float32Array;
    
    // Up vector for tangent calculations
    const globalUp = new THREE.Vector3(0, 1, 0);
    
    particleData.forEach((p, i) => {
      if (reducedMotion) {
        p.pathIndex = i % paths.length;
        p.progress = (i / particleCount) * paths.length;
        p.progress = p.progress % 1.0;
        p.pauseTimer = 1.0; 
      } else {
        if (p.pauseTimer > 0) {
           p.pauseTimer -= delta;
        } else {
           if (Math.random() < 0.005) p.pauseTimer = 0.5 + Math.random();
           else p.progress += p.speed * delta * 0.15;
        }
        
        if (p.progress >= 1.0) {
          p.progress = 0;
          p.pathIndex = Math.floor(Math.random() * paths.length);
          p.angle = Math.random() * Math.PI * 2;
        }
      }
      
      const path = paths[p.pathIndex];
      if (!path || path.length < 2) return;
      
      const fIdx = p.progress * (path.length - 1);
      const iIdx = Math.floor(fIdx);
      const t = fIdx - iIdx;
      
      const p1 = path[iIdx];
      const p2 = path[Math.min(iIdx + 1, path.length - 1)];
      
      // Center position
      const cx = p1.pos.x + (p2.pos.x - p1.pos.x) * t;
      const cy = p1.pos.y + (p2.pos.y - p1.pos.y) * t;
      const cz = p1.pos.z + (p2.pos.z - p1.pos.z) * t;
      
      const radius = p1.radius + (p2.radius - p1.radius) * t;
      
      // Calculate surface tangent
      const dir = p1.dir.clone().lerp(p2.dir, t).normalize();
      const right = new THREE.Vector3().crossVectors(dir, globalUp).normalize();
      if (right.lengthSq() < 0.01) { right.set(1, 0, 0); } // Fallback if pointing straight up
      const up = new THREE.Vector3().crossVectors(right, dir).normalize();
      
      // Spiral slightly around branch over time
      const currentAngle = p.angle + (reducedMotion ? 0 : p.progress * 4.0);
      
      // Offset by radius to sit right on the bark (slightly inside to look like glowing sap veins)
      const offset = right.clone().multiplyScalar(Math.cos(currentAngle))
        .add(up.clone().multiplyScalar(Math.sin(currentAngle)))
        .multiplyScalar(radius * 0.98); // Flush with bark

      positions[i*3] = cx + offset.x;
      positions[i*3+1] = cy + offset.y;
      positions[i*3+2] = cz + offset.z;
      
      alphas[i] = reducedMotion 
        ? 0.5 + Math.sin(i * 13.0) * 0.3
        : Math.sin(p.progress * Math.PI) * (p.pauseTimer > 0 ? 1.0 : 0.8) * 0.9;
    });
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.alpha.needsUpdate = true;
  });

  return <points ref={pointsRef} args={[geo, mat]} />;
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export const ProceduralTree = ({ position = [0, -10, -15] }: { position?: [number, number, number] }) => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 70, mass: 1.5, restDelta: 0.001 });
  const { settings } = useQualityStore();
  const reducedMotion = useReducedMotion();
  const leafMeshRef1 = useRef<THREE.InstancedMesh>(null);
  const leafMeshRef2 = useRef<THREE.InstancedMesh>(null);
  const blossomMeshRef = useRef<THREE.InstancedMesh>(null);
  const fruitMeshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const customUniforms = useRef({ uTime: { value: 0 }, uSeason: { value: 0 } });

  // Massive initial radius and 6 iterations for a full volumetric canopy
  const { mergedBranches, mergedTwigs, mergedRoots, rockMatrices, leafMatrices1, leafMatrices2, blossomMatrices, fruitMatrices, flowPaths } = useMemo(() => generateSeamlessTree(6, 4.5, 4.0), []);


  // Geometry
  // 3D Leaf Geometry Generator using ExtrudeGeometry for perfect smoothness
  const create3DLeaf = (width: number, height: number) => {
    // Optimized 3D Leaf using ShapeGeometry (actual leaf shape, but flat and low-poly)
    const shape = new THREE.Shape();
    shape.moveTo(0, 0); // Stem
    shape.bezierCurveTo(width * 0.5, height * 0.2, width * 0.5, height * 0.8, 0, height);
    shape.bezierCurveTo(-width * 0.5, height * 0.8, -width * 0.5, height * 0.2, 0, 0);

    const geo = new THREE.ShapeGeometry(shape, 3); // Low curveSegments for performance
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      // Cup the leaf along the X axis
      z += Math.abs(x) * 0.3;
      // Bend the leaf along the Y axis (droop)
      z -= Math.sin((y / height) * Math.PI) * 0.25;
      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    geo.center();
    geo.translate(0, height * 0.5, 0); // Move base to origin (pivot point)
    return geo;
  };

  const leafGeo1 = useMemo(() => create3DLeaf(0.8, 1.2), []);
  const leafGeo2 = useMemo(() => create3DLeaf(0.6, 1.4), []);

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

  const fruitGeo = useMemo(() => {
    // Elegant low-poly icosahedron fruit for "Harvest" symbols
    const geo = new THREE.IcosahedronGeometry(0.18, 1);
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Materials
  const mainBarkMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0.05 }); // Slight sheen for elegance
    setupBarkMaterial(mat, customUniforms);
    return mat;
  }, []);

  const twigMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0.05, transparent: true, depthWrite: true }); 
    setupBarkMaterial(mat, customUniforms, true); // true = isTwig (will dissolve in winter)
    return mat;
  }, []);

  const blossomMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffe6ee, roughness: 0.7, side: THREE.DoubleSide, transparent: true, alphaTest: 0.2, opacity: 0.95
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.current.uTime;
      shader.uniforms.uSeason = customUniforms.current.uSeason;
      
      const windCode = settings.windComplexity === "none" ? `` : 
        settings.windComplexity === "simple" ? `
          float flutter = sin(uTime * 3.0 + worldPos.x * 5.0) * 0.05 * scale;
          float s = sin(flutter); float c = cos(flutter);
          mat3 rotX = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
          transformed = rotX * transformed;
        ` : `
          float flutter = sin(uTime * 6.0 + worldPos.x * 12.0) * 0.1 * scale;
          float s = sin(flutter); float c = cos(flutter);
          mat3 rotX = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
          transformed = rotX * transformed;
        `;

      shader.vertexShader = `
        uniform float uTime;
        uniform float uSeason;
        ${shader.vertexShader}
      `.replace(
        `#include <begin_vertex>`,
        `
        #include <begin_vertex>
        vec3 worldPos = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        float wrapSeason = min(uSeason, abs(uSeason - 1.0));
        float scale = smoothstep(0.2, 0.05, wrapSeason);
        transformed *= scale;
        ${windCode}
        `
      );
    };
    return mat;
  }, [settings.windComplexity]);

  const leafMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide, roughness: 0.6, metalness: 0.05, color: 0xffffff
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.current.uTime;
      shader.uniforms.uSeason = customUniforms.current.uSeason;
      
      const windCode = settings.windComplexity === "none" ? `` :
        settings.windComplexity === "simple" ? `
          float sway = sin(uTime * 0.8 + worldPos.z * 0.2) * 0.02 * scale;
          transformed.x += sway * transformed.y;
        ` : `
          float flutter = sin(uTime * 2.5 + worldPos.x * 5.0 + worldPos.y * 3.0) * 0.025 * scale;
          float s = sin(flutter);
          float c = cos(flutter);
          mat3 rotX = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
          transformed = rotX * transformed;
          float sway = sin(uTime * 0.5 + worldPos.z * 0.2 + worldPos.x * 0.1) * 0.03 * scale;
          transformed.x += sway * transformed.y;
        `;

      shader.vertexShader = shader.vertexShader.replace(
        `#include <common>`,
        `
        #include <common>
        uniform float uTime;
        uniform float uSeason;
        varying vec3 vLocalPos;
        varying float vLocalSeason;
        `
      ).replace(
        `#include <begin_vertex>`,
        `
        #include <begin_vertex>
        vLocalPos = position;
        vec3 worldPos = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        float randDelay = fract(sin(worldPos.x * 12.33 + worldPos.z * 4.31) * 43.11) * 0.2;
        float localSeason = max(0.0, uSeason - randDelay);
        vLocalSeason = localSeason;
        
        float scale = 1.0;
        
        
        // Leaves stay on the tree longer and transition beautifully
        // Never scale to 0 to keep the canopy full
        if (localSeason > 0.5 && localSeason < 0.9) {
           scale = 1.0 - smoothstep(0.5, 0.9, localSeason) * 0.2; // Only shrink slightly
        } else if (localSeason >= 0.9) {
           scale = 0.8;
        }
        
        transformed *= scale;
        
        ${windCode}
        `
      );
      
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <common>`,
        `
        #include <common>
        uniform float uSeason;
        varying vec3 vLocalPos;
        varying float vLocalSeason;
        `
      ).replace(
        `#include <color_fragment>`,
        `
        #include <color_fragment>
        vec3 springColor = vec3(0.05, 0.35, 0.1); // Rich emerald green
        vec3 summerColor = vec3(0.1, 0.45, 0.1); // Lush green
        vec3 autumnColor = vec3(0.6, 0.35, 0.05); // Rich gold/brown
        
        // Smoothly blend colors based on the per-leaf local season
        vec3 seasonColor = mix(springColor, summerColor, smoothstep(0.0, 0.3, vLocalSeason));
        seasonColor = mix(seasonColor, autumnColor, smoothstep(0.3, 0.6, vLocalSeason));
        
        // Procedural gradient using local position instead of UVs
        float gradient = clamp(vLocalPos.y * 0.7, 0.0, 1.0);
        vec3 leafColor = mix(seasonColor * 0.4, seasonColor * 1.2, gradient);
        
        diffuseColor.rgb = leafColor;
        `
      );
    };
    return mat;
  }, [settings.windComplexity]);

  const fruitMat = useMemo(() => {
    // Golden glowing fruit to match "Knowledge Gold" semantics
    const mat = new THREE.MeshStandardMaterial({
      color: 0xFFD700, 
      emissive: 0xFF8C00,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.6
    });
    
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uSeason = customUniforms.current.uSeason;
      shader.vertexShader = `
        uniform float uSeason;
        ${shader.vertexShader}
      `.replace(
        `#include <begin_vertex>`,
        `
        #include <begin_vertex>
        // Fruits only appear in late summer / autumn
        float wrapSeason = min(uSeason, abs(uSeason - 1.0));
        float scale = 0.0;
        if (wrapSeason > 0.3 && wrapSeason < 0.6) {
           scale = smoothstep(0.3, 0.45, wrapSeason);
        } else if (wrapSeason >= 0.6) {
           scale = 1.0 - smoothstep(0.6, 0.7, wrapSeason);
        }
        transformed *= scale;
        `
      );
    };
    return mat;
  }, []);

  useEffect(() => {
    if (leafMeshRef1.current) {
      leafMatrices1.forEach((mat, i) => leafMeshRef1.current!.setMatrixAt(i, mat));
      leafMeshRef1.current.instanceMatrix.needsUpdate = true;
    }
    if (leafMeshRef2.current) {
      leafMatrices2.forEach((mat, i) => leafMeshRef2.current!.setMatrixAt(i, mat));
      leafMeshRef2.current.instanceMatrix.needsUpdate = true;
    }
    if (blossomMeshRef.current) {
      blossomMatrices.forEach((mat, i) => blossomMeshRef.current!.setMatrixAt(i, mat));
      blossomMeshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (fruitMeshRef.current) {
      fruitMatrices.forEach((mat, i) => fruitMeshRef.current!.setMatrixAt(i, mat));
      fruitMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [leafMatrices1, leafMatrices2, blossomMatrices, fruitMatrices, rockMatrices]);

  // Memory Cleanup
  useEffect(() => {
    return () => {
      leafGeo1.dispose();
      leafGeo2.dispose();
      blossomGeo.dispose();
      mergedBranches.dispose();
      mergedTwigs.dispose();
      mergedRoots.dispose();
      mainBarkMat.dispose();
      twigMat.dispose();
      blossomMat.dispose();
      leafMat.dispose();
      fruitGeo.dispose();
      fruitMat.dispose();
    };
  }, [leafGeo1, leafGeo2, blossomGeo, fruitGeo, mergedBranches, mergedTwigs, mergedRoots, mainBarkMat, twigMat, blossomMat, leafMat, fruitMat]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    customUniforms.current.uTime.value = reducedMotion ? 0 : t;
    customUniforms.current.uSeason.value = smoothProgress.get();
    
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.008;
      groupRef.current.rotation.x = Math.sin(t * 0.25 + 1.0) * 0.005;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Seamless Roots Mesh */}
      <mesh geometry={mergedRoots} material={mainBarkMat} castShadow receiveShadow />

      {/* Seamless Main Branches Mesh */}
      <mesh geometry={mergedBranches} material={mainBarkMat} castShadow receiveShadow />
      
      {/* Tiny Twigs (Dissolve in Winter) */}
      <mesh geometry={mergedTwigs} material={twigMat} castShadow receiveShadow />
      
      {/* Leaves (Multiple Meshes for Variation) */}
      <instancedMesh ref={leafMeshRef1} args={[leafGeo1, leafMat, leafMatrices1.length]} count={Math.floor(leafMatrices1.length * settings.leafDensity)} castShadow receiveShadow />
      <instancedMesh ref={leafMeshRef2} args={[leafGeo2, leafMat, leafMatrices2.length]} count={Math.floor(leafMatrices2.length * settings.leafDensity)} castShadow receiveShadow />
      
      {/* Blossoms */}
      <instancedMesh ref={blossomMeshRef} args={[blossomGeo, blossomMat, blossomMatrices.length]} count={Math.floor(blossomMatrices.length * settings.leafDensity)} receiveShadow />

      {/* Harvest/Fruit Nodes (Application Projects) */}
      <instancedMesh ref={fruitMeshRef} args={[fruitGeo, fruitMat, fruitMatrices.length]} count={fruitMatrices.length} castShadow />

      {/* Knowledge Flow Particles - Glowing Surface Veins */}
      <KnowledgeFlowSystem paths={flowPaths} maxCount={settings.particleCount} />
    </group>
  );
};
