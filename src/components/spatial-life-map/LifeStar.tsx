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
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const color = new THREE.Color(star.auraColor);
  const isLockedOrPrivate = star.privacyLevel === "private" || star.privacyLevel === "localOnly";

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * star.twinkleSpeed + star.position3D.x) * 0.08;
    const focus = selected ? 1.72 : hovered ? 1.36 : 1;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(star.size * pulse * focus);
      groupRef.current.rotation.z = t * 0.04 + star.position3D.z * 0.02;
    }

    if (haloRef.current) {
      const material = haloRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (selected ? 0.34 : hovered ? 0.23 : 0.105) * (dimmed ? 0.28 : 1);
      haloRef.current.scale.setScalar((selected ? 3.15 : 2.55) + Math.sin(t * 0.9) * 0.12);
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.18;
      const material = innerRingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (selected ? 0.64 : hovered ? 0.36 : 0.18) * (dimmed ? 0.32 : 1);
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.11;
      const material = outerRingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (selected ? 0.44 : hovered ? 0.25 : isLockedOrPrivate ? 0.16 : 0.1) * (dimmed ? 0.3 : 1);
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
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={outerRingRef} renderOrder={2} rotation={[Math.PI / 2.55, 0.15, 0]}>
        <torusGeometry args={[0.19, isLockedOrPrivate ? 0.0045 : 0.003, 8, 96]} />
        <meshBasicMaterial color={isLockedOrPrivate ? "#f8fbff" : color} transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={innerRingRef} renderOrder={3} rotation={[Math.PI / 2.15, -0.2, 0]}>
        <torusGeometry args={[0.13, 0.0035, 8, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh renderOrder={4}>
        <sphereGeometry args={[0.075, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? 3.1 : hovered ? 2 : 1.25} roughness={0.26} metalness={0.16} transparent opacity={dimmed ? 0.38 : 1} />
      </mesh>

      <mesh renderOrder={5} position={[0.045, 0.035, 0.035]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={dimmed ? 0.35 : 0.92} />
      </mesh>
    </group>
  );
}
