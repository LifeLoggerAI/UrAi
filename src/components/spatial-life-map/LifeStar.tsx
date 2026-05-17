"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { LifeMapStar } from "@/lib/spatial-life-map/lifeMap.types";

interface LifeStarProps {
  star: LifeMapStar;
  selected: boolean;
  hovered: boolean;
  dimmed?: boolean;
  onHover: (starId: string | null) => void;
  onSelect: (star: LifeMapStar) => void;
  onOpen: (star: LifeMapStar) => void;
}

export default function LifeStar({ star, selected, hovered, dimmed = false, onHover, onSelect, onOpen }: LifeStarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const color = new THREE.Color(star.auraColor);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * star.twinkleSpeed + star.position3D.x) * 0.08;
    const focus = selected ? 1.55 : hovered ? 1.32 : 1;
    if (groupRef.current) {
      groupRef.current.scale.setScalar(star.size * pulse * focus);
      groupRef.current.rotation.z = t * 0.04 + star.position3D.z * 0.02;
    }
    if (haloRef.current) {
      const material = haloRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (selected ? 0.28 : hovered ? 0.22 : 0.11) * (dimmed ? 0.35 : 1);
      haloRef.current.scale.setScalar(2.7 + Math.sin(t * 0.9) * 0.12);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[star.position3D.x, star.position3D.y, star.position3D.z]}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover(star.id);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        onHover(null);
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(star);
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        onOpen(star);
      }}
    >
      <mesh ref={haloRef} renderOrder={1}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh renderOrder={2}>
        <sphereGeometry args={[0.075, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? 2.4 : hovered ? 1.8 : 1.2} roughness={0.32} metalness={0.08} transparent opacity={dimmed ? 0.38 : 1} />
      </mesh>
      <mesh renderOrder={3} position={[0.045, 0.035, 0.035]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={dimmed ? 0.35 : 0.92} />
      </mesh>
    </group>
  );
}
