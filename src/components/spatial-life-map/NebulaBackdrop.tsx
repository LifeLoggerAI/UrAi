"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function NebulaBackdrop({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    return Array.from({ length: 260 }, (_, index) => {
      const angle = index * 2.399963;
      const radius = 3 + (index % 37) * 0.22;
      return {
        position: new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle * 0.73) * 2.6, Math.sin(angle) * radius - 3.8),
        size: 0.012 + ((index * 11) % 19) * 0.0018,
        color: ["#bfe9ff", "#c4b5fd", "#86efac", "#fde68a"][index % 4],
      };
    });
  }, []);

  useFrame((state) => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.025;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.012;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, -6]} rotation={[0.4, 0, -0.12]}>
        <torusGeometry args={[4.7, 0.015, 12, 220]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0.9, -0.4, -3.8]} rotation={[0.65, 0.1, 0.28]}>
        <torusGeometry args={[3.8, 0.012, 12, 220]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.11} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial color={particle.color} transparent opacity={0.42} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
      <mesh position={[-1.3, 0.15, -4.4]} scale={[5.4, 1.6, 1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.055} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[2.1, 0.65, -5.2]} scale={[4.2, 1.2, 1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.045} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
