import { useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';

interface GeoBoundariesProps {
  radius: number;
}

// Helper to convert [lon, lat] to 3D spherical Cartesian coordinates
const lonLatToVector3 = (lon: number, lat: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 90) * (Math.PI / 180);

  const x = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);

  return new THREE.Vector3(x, y, z);
};

export const GeoBoundaries = ({ radius }: GeoBoundariesProps) => {
  const [indiaGeometry, setIndiaGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [karnatakaGeometry, setKarnatakaGeometry] = useState<THREE.BufferGeometry | null>(null);

  // We raise the lines slightly off the surface to prevent Z-fighting with the Earth mesh
  const borderRadius = radius + 0.005;

  useEffect(() => {
    const parseGeoJSON = (data: any, r: number) => {
      if (!data || !data.features || data.features.length === 0) return null;
      
      const feature = data.features[0];
      const geometry = feature.geometry;
      const coords = geometry.coordinates;
      
      const points: THREE.Vector3[] = [];
      const indices: number[] = [];
      let currentIndex = 0;

      // Helper to process a single linear ring (Polygon boundary)
      const processRing = (ring: number[][]) => {
        for (let i = 0; i < ring.length; i++) {
          const [lon, lat] = ring[i];
          points.push(lonLatToVector3(lon, lat, r));
          
          if (i > 0) {
            indices.push(currentIndex - 1, currentIndex);
          }
          currentIndex++;
        }
        // Connect last point to first point if not explicitly closed
        // But GeoJSON rings are usually explicitly closed (first == last)
      };

      if (geometry.type === "Polygon") {
        coords.forEach((ring: number[][]) => processRing(ring));
      } else if (geometry.type === "MultiPolygon") {
        coords.forEach((polygon: number[][][]) => {
          polygon.forEach((ring: number[][]) => processRing(ring));
        });
      }

      const bufferGeom = new THREE.BufferGeometry().setFromPoints(points);
      bufferGeom.setIndex(indices);
      return bufferGeom;
    };

    const loadData = async () => {
      try {
        const [indiaRes, karRes] = await Promise.all([
          fetch('/models/india_nom.geojson'),
          fetch('/models/karnataka_nom.geojson')
        ]);
        
        const indiaData = await indiaRes.json();
        const karData = await karRes.json();

        setIndiaGeometry(parseGeoJSON(indiaData, borderRadius));
        setKarnatakaGeometry(parseGeoJSON(karData, borderRadius + 0.002)); // Karnataka slightly higher to render on top
      } catch (error) {
        console.error("Failed to load or parse GeoJSON boundaries:", error);
      }
    };

    loadData();
  }, [borderRadius]);

  const indiaMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: "#6b8cce", // Soft steel blue for national border
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  const karnatakaMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: "#FFD700", // Bright gold for the focal state
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  return (
    <group>
      {indiaGeometry && (
        <lineSegments geometry={indiaGeometry} material={indiaMaterial} />
      )}
      {karnatakaGeometry && (
        <lineSegments geometry={karnatakaGeometry} material={karnatakaMaterial} />
      )}
    </group>
  );
};
