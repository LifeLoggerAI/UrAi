"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function StarField({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const stars = useMemo(() => {
    return Array.from({ length: 900 }, (_, index) => {
      const angle = index * 2.39996323;
      const radius = 5 + Math.sqrt(index) * 0.72;
      const layer = (index % 9) - 4;
      return {
        position: new THREE.Vector3(
          Math.cos(angle) * radius + Math.sin(index) * 0.7,
          Math.sin(angle * 0.57) * 5.6 + layer * 0.18,
          Math.sin(angle) * radius - 8 - (index % 31) * 0.18,
        ),
        size: 0.006 + ((index * 17) % 23) * 0.0009,
        opacity: 0.22 + ((index * 29) % 64) / 100,
      };
    });
  }, []);

  useFrame((state) => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.035) * 0.035;
    groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.025) * 0.014;
  });

  return (
    <group ref={groupRef}>
      {stars.map((star, index) => (
        <mesh key={index} position={star.position}>
          <sphereGeometry args={[star.size, 6, 6]} />
          <meshBasicMaterial color="#e8fbff" transparent opacity={star.opacity} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
