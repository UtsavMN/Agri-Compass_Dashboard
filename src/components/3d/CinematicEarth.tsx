import { useRef, useMemo, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export const CinematicEarth = ({ position }: { position: [number, number, number] }) => {
  const earthGroupRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const pinRef = useRef<THREE.Mesh>(null);
  const customUniforms = useRef({ uTime: { value: 0 } });

  // Load textures
  const [colorMap, specularMap, normalMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth/earth_atmos_2048.jpg',
    '/textures/earth/earth_specular_2048.jpg',
    '/textures/earth/earth_normal_2048.jpg',
    '/textures/earth/earth_clouds_1024.png'
  ]);

  // Configure textures
  colorMap.colorSpace = THREE.SRGBColorSpace;
  // Earth textures are usually mapped correctly, but just in case:
  [colorMap, specularMap, normalMap, cloudsMap].forEach(t => {
    t.wrapS = THREE.RepeatWrapping;
  });

  const earthRadius = 2.5;

  const earthMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map: colorMap,
      normalMap: normalMap,
      roughnessMap: specularMap,
      roughness: 0.8,
      metalness: 0.1,
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.current.uTime;
      shader.uniforms.uSpecularMap = { value: specularMap };

      shader.fragmentShader = `
        uniform float uTime;
        uniform sampler2D uSpecularMap;
        
        // FBM for procedural city lights
        float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        float fbm(vec2 p) {
          float v = 0.0; float a = 0.5;
          for(int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
          return v;
        }

        ${shader.fragmentShader}
      `.replace(
        `#include <dithering_fragment>`,
        `#include <dithering_fragment>
        
        // Specular map is high (1.0) on oceans, low (0.0) on land
        float specValue = texture2D(uSpecularMap, vMapUv).r;
        float landMask = 1.0 - specValue; // 1 on land, 0 on ocean

        // Deepen ocean color slightly for a cinematic look
        if (specValue > 0.5) {
          gl_FragColor.rgb *= vec3(0.6, 0.8, 1.0);
        }

        // Calculate lighting intensity (dot product of normal and light dir)
        vec3 lightDir = normalize(vec3(10.0, 20.0, 10.0));
        float nDotL = dot(vNormal, lightDir);
        
        // Sharp terminator line for night mask
        float nightMask = smoothstep(0.1, -0.1, nDotL);
        float twilightMask = smoothstep(0.2, -0.1, nDotL) - nightMask;
        
        // Generate city lights using high frequency FBM masked by land
        float cityNoise = fbm(vMapUv * 80.0);
        cityNoise = pow(cityNoise, 4.0); // Make them sparse and very bright
        
        // Add a golden/orange glow for cities
        vec3 cityColor = vec3(1.0, 0.7, 0.3) * cityNoise * 6.0;
        
        // Apply city lights only on land and only at night, with a slight bleed into twilight
        vec3 finalLights = cityColor * landMask * (nightMask + twilightMask * 0.5);
        
        // Aurora Borealis at the north pole (vMapUv.y > 0.8)
        float auroraMask = smoothstep(0.75, 0.95, vMapUv.y) * smoothstep(1.0, 0.85, vMapUv.y);
        float auroraNoise = fbm(vec2(vMapUv.x * 15.0 + uTime * 0.05, vMapUv.y * 25.0 - uTime * 0.1));
        vec3 auroraColor = vec3(0.0, 1.0, 0.6) * pow(auroraNoise, 2.0) * 3.0;
        vec3 finalAurora = auroraColor * auroraMask * nightMask;

        // Twilight reddish rim light
        vec3 twilightColor = vec3(0.8, 0.3, 0.1) * twilightMask * 0.2;

        gl_FragColor.rgb += finalLights + finalAurora + twilightColor;
        `
      );
    };
    return mat;
  }, [colorMap, normalMap, specularMap]);

  // Atmosphere shader (Cinematic Edge Glow + Scattering approximation)
  const atmosMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = dot(viewDir, vNormal);
          fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
          
          // Outer edge is more intense, inner edge fades
          float intensity = pow(fresnel, 3.5) * 1.5;
          float coreIntensity = pow(fresnel, 1.5) * 0.3;
          
          vec3 atmosColor = vec3(0.3, 0.6, 1.0); // Light blue
          vec3 coreColor = vec3(0.1, 0.3, 0.8);  // Deep blue
          
          vec3 finalColor = mix(coreColor, atmosColor, fresnel);
          gl_FragColor = vec4(finalColor, intensity + coreIntensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });
  }, []);

  useEffect(() => {
    return () => {
      earthMat.dispose();
      atmosMat.dispose();
    };
  }, [earthMat, atmosMat]);

  useFrame((state, delta) => {
    if (!earthGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    customUniforms.current.uTime.value = t;

    // Slow rotation
    earthGroupRef.current.rotation.y += delta * 0.02;
    earthGroupRef.current.rotation.x = 0.1; // Axial tilt

    // Clouds rotate slightly faster than Earth
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.025;
    }
    
    // Pin pulsing effect
    if (pinRef.current) {
      pinRef.current.scale.setScalar(1.0 + Math.sin(t * 4) * 0.2);
    }
  });

  // Calculate Karnataka position
  // Lat: 15.31 N, Lon: 75.71 E
  const lat = 15.31 * (Math.PI / 180);
  const lon = -75.71 * (Math.PI / 180); // Inverted for standard Threejs sphere
  const r = earthRadius + 0.01;
  const kX = r * Math.cos(lat) * Math.cos(lon);
  const kY = r * Math.sin(lat);
  const kZ = r * Math.cos(lat) * Math.sin(lon);

  return (
    <group ref={earthGroupRef} position={position}>
      {/* Earth Surface */}
      <mesh material={earthMat} castShadow receiveShadow>
        <sphereGeometry args={[earthRadius, 64, 64]} />
      </mesh>
      
      {/* Clouds Layer */}
      <mesh ref={cloudRef} castShadow receiveShadow>
        <sphereGeometry args={[earthRadius + 0.02, 64, 64]} />
        <meshStandardMaterial 
          map={cloudsMap}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Atmosphere Glow */}
      <mesh material={atmosMat}>
        <sphereGeometry args={[earthRadius + 0.3, 64, 64]} />
      </mesh>
      
      {/* Karnataka Pin */}
      <mesh position={[kX, kY, kZ]} ref={pinRef}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.9} />
        {/* Glow Ring */}
        <mesh>
          <ringGeometry args={[0.04, 0.06, 32]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </mesh>
    </group>
  );
};
