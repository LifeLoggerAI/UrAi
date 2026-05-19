"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type {
  LifeMapConstellation,
  LifeMapStar,
} from "@/lib/spatial-life-map/lifeMap.types";

interface ConstellationLinesProps {
  stars: LifeMapStar[];
  constellations: LifeMapConstellation[];
  selectedConstellationId?: string | null;
}

function makeLineGeometry(previous: LifeMapStar, star: LifeMapStar) {
  const start = new THREE.Vector3(
    previous.position3D.x,
    previous.position3D.y,
    previous.position3D.z
  );

  const end = new THREE.Vector3(
    star.position3D.x,
    star.position3D.y,
    star.position3D.z
  );

  const middle = start.clone().lerp(end, 0.5);
  middle.y += 0.16 + Math.abs(start.distanceTo(end)) * 0.025;
  middle.z += Math.sin((start.x + end.x) * 0.3) * 0.18;

  const curve = new THREE.CatmullRomCurve3([start, middle, end]);
  return new THREE.BufferGeometry().setFromPoints(curve.getPoints(32));
}

export default function ConstellationLines({
  stars,
  constellations,
  selectedConstellationId,
}: ConstellationLinesProps) {
  const groupRef = useRef<THREE.Group>(null);

  const starMap = useMemo(() => {
    return new Map(stars.map((star) => [star.id, star]));
  }, [stars]);

  const lineObjects = useMemo(() => {
    return constellations.flatMap((constellation) => {
      const points = constellation.stars
        .map((id) => starMap.get(id))
        .filter((star): star is LifeMapStar => Boolean(star));

      return points.slice(1).flatMap((star, index) => {
        const previous = points[index];
        const active = selectedConstellationId === constellation.id;

        const geometry = makeLineGeometry(previous, star);
        const color = new THREE.Color(constellation.color);

        const mainMaterial = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: active ? 0.62 : 0.25,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const glowMaterial = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: active ? 0.16 : 0.055,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const main = new THREE.Line(geometry, mainMaterial);
        main.userData = {
          baseOpacity: active ? 0.62 : 0.25,
          active,
        };

        const glow = new THREE.Line(geometry.clone(), glowMaterial);
        glow.scale.setScalar(active ? 1.012 : 1.006);
        glow.userData = {
          baseOpacity: active ? 0.16 : 0.055,
          active,
        };

        return [
          {
            id: `${constellation.id}-${previous.id}-${star.id}-main`,
            object: main,
          },
          {
            id: `${constellation.id}-${previous.id}-${star.id}-glow`,
            object: glow,
          },
        ];
      });
    });
  }, [constellations, selectedConstellationId, starMap]);

  useFrame((state) => {
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, index) => {
      const line = child as THREE.Line;
      const material = line.material as THREE.LineBasicMaterial;
      const userData = line.userData as {
        baseOpacity?: number;
        active?: boolean;
      };

      const baseOpacity = userData.baseOpacity ?? 0.18;
      const shimmer =
        Math.sin(state.clock.elapsedTime * 0.9 + index * 0.7) *
        (userData.active ? 0.055 : 0.025);

      material.opacity = Math.max(0.02, baseOpacity + shimmer);
    });

    groupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.018) * 0.018;
  });

  return (
    <group ref={groupRef}>
      {lineObjects.map((line) => (
        <primitive key={line.id} object={line.object} />
      ))}
    </group>
  );
}