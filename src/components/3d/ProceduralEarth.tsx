import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll, useSpring, useTransform } from "framer-motion";

const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simple noise function for continents if no texture is provided
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Generate continents via FBM noise
    float n = fbm(vUv * 10.0);
    
    vec3 oceanColor = vec3(0.02, 0.05, 0.15); // Deep premium blue
    vec3 landColor = vec3(0.15, 0.25, 0.1);   // Subtle green/gold landmass
    
    // Smoothstep for continent borders
    float landMask = smoothstep(0.45, 0.55, n);
    
    vec3 color = mix(oceanColor, landColor, landMask);

    // Fresnel effect for atmosphere glow
    vec3 viewDir = normalize(-vPosition);
    float fresnel = dot(viewDir, vNormal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 3.0);
    
    // Add golden atmospheric scattering at the edges
    vec3 atmosphere = vec3(0.9, 0.8, 0.5) * fresnel * 1.5;

    // Simulate basic directional light (fake light from top-right)
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Night lights (only visible on land, and on the dark side)
    float nightMask = (1.0 - diff) * landMask;
    vec3 cityLights = vec3(1.0, 0.9, 0.6) * pow(fbm(vUv * 30.0), 3.0) * nightMask * 2.0;

    color = color * (diff * 0.8 + 0.2) + atmosphere + cityLights;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const cloudVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cloudFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float time;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Dynamic clouds
    float cloudNoise = fbm(vUv * 15.0 + vec2(time * 0.02, 0.0));
    float cloudMask = smoothstep(0.4, 0.8, cloudNoise);
    
    // Soften edges based on fresnel to avoid hard cutoff at sphere edge
    float fresnel = dot(vec3(0.0, 0.0, 1.0), vNormal);
    fresnel = clamp(fresnel, 0.0, 1.0);
    
    vec3 cloudColor = vec3(0.9, 0.95, 1.0);
    gl_FragColor = vec4(cloudColor, cloudMask * fresnel * 0.8);
  }
`;

export const ProceduralEarth = ({ position }: { position: [number, number, number] }) => {
  const earthRef = useRef<THREE.Group>(null);
  const cloudMatRef = useRef<THREE.ShaderMaterial>(null);
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 70 });
  
  const earthScale = useTransform(smoothProgress, [0, 0.15], [1, 2]);

  useFrame((state, delta) => {
    if (earthRef.current) {
      // Very slow majestic rotation
      earthRef.current.rotation.y += delta * 0.02;
      earthRef.current.rotation.x = 0.2; // slight axial tilt
      
      const scale = earthScale.get();
      earthRef.current.scale.set(scale, scale, scale);
      
      // We can't directly animate opacity of a custom shader easily without adding a uniform,
      // but since it flies past the camera, scale handles the transition.
      // We'll let it fly past and then unmount it logically if we wanted, but the prompt asked "never unmount".
      // It just goes behind the camera.
    }
    if (cloudMatRef.current) {
      cloudMatRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <group ref={earthRef} position={position}>
      {/* Base Earth */}
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        <shaderMaterial
          vertexShader={earthVertexShader}
          fragmentShader={earthFragmentShader}
        />
      </mesh>
      
      {/* Cloud Layer (Slightly larger) */}
      <mesh>
        <sphereGeometry args={[2.53, 64, 64]} />
        <shaderMaterial
          ref={cloudMatRef}
          vertexShader={cloudVertexShader}
          fragmentShader={cloudFragmentShader}
          uniforms={{ time: { value: 0 } }}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* India / Karnataka Highlight Pin (simplified abstract glow) */}
      <mesh position={[1.4, 0.8, 1.9]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#E5D08F" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};
