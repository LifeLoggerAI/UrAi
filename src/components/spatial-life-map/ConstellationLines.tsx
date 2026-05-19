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

  const lines = useMemo(() => {
    return constellations.flatMap((constellation) => {
      const points = constellation.stars.map((id) => starMap.get(id)).filter(Boolean) as LifeMapStar[];
      return points.slice(1).map((star, index) => {
        const previous = points[index];
        return { id: `${constellation.id}-${previous.id}-${star.id}`, constellation, from: previous.position3D, to: star.position3D };
      });
    });
  }, [constellations, starMap]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, index) => {
      const material = (child as THREE.Line).material as THREE.LineBasicMaterial;
      material.opacity = 0.18 + Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.04;
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((line) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(line.from.x, line.from.y, line.from.z),
          new THREE.Vector3(line.to.x, line.to.y, line.to.z),
        ]);
        const active = selectedConstellationId === line.constellation.id;
        return (
          <primitive key={line.id} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: line.constellation.color,
            transparent: true,
            opacity: active ? 0.52 : 0.22,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }))} />
        );
      })}
    </group>
  );
}