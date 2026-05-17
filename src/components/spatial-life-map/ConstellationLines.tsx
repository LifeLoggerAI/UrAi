"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { LifeMapConstellation, LifeMapStar } from "@/lib/spatial-life-map/lifeMap.types";

interface ConstellationLinesProps {
  stars: LifeMapStar[];
  constellations: LifeMapConstellation[];
  selectedConstellationId?: string | null;
}

export default function ConstellationLines({ stars, constellations, selectedConstellationId }: ConstellationLinesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const starMap = useMemo(() => new Map(stars.map((star) => [star.id, star])), [stars]);

  const lineObjects = useMemo(() => {
    return constellations.flatMap((constellation) => {
      const points = constellation.stars.map((id) => starMap.get(id)).filter(Boolean) as LifeMapStar[];
      return points.slice(1).map((star, index) => {
        const previous = points[index];
        const active = selectedConstellationId === constellation.id;
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(previous.position3D.x, previous.position3D.y, previous.position3D.z),
          new THREE.Vector3(star.position3D.x, star.position3D.y, star.position3D.z),
        ]);
        const material = new THREE.LineBasicMaterial({
          color: constellation.color,
          transparent: true,
          opacity: active ? 0.52 : 0.22,
          linewidth: active ? 2 : 1,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        return {
          id: `${constellation.id}-${previous.id}-${star.id}`,
          object: new THREE.Line(geometry, material),
        };
      });
    });
  }, [constellations, selectedConstellationId, starMap]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, index) => {
      const material = (child as THREE.Line).material as THREE.LineBasicMaterial;
      material.opacity = 0.18 + Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.04;
    });
  });

  return (
    <group ref={groupRef}>
      {lineObjects.map((line) => (
        <primitive key={line.id} object={line.object} />
      ))}
    </group>
  );
}
