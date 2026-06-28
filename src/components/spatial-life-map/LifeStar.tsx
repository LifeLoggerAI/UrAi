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
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const verticalRingRef = useRef<THREE.Mesh>(null);
  const color = new THREE.Color(star.auraColor);
  const isLockedOrPrivate = star.privacyLevel === "private" || star.privacyLevel === "localOnly";

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * star.twinkleSpeed + star.position3D.x) * 0.055;
    const focus = selected ? 1.42 : hovered ? 1.2 : 1;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(star.size * pulse * focus);
      groupRef.current.rotation.y = Math.sin(t * 0.2 + star.position3D.x) * 0.22;
      groupRef.current.rotation.z = t * 0.05 + star.position3D.z * 0.025;
    }

    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (selected ? 0.34 : hovered ? 0.22 : 0.11) * (dimmed ? 0.22 : 1);
      glowRef.current.scale.setScalar((selected ? 1.12 : hovered ? 0.96 : 0.78) + Math.sin(t * 0.9) * 0.025);
    }

    if (coreRef.current) {
      const material = coreRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = selected ? 5.2 : hovered ? 3.2 : 2.05;
      material.opacity = dimmed ? 0.38 : 1;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.24;
      const material = innerRingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (selected ? 0.76 : hovered ? 0.46 : 0.24) * (dimmed ? 0.3 : 1);
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.16;
      const material = outerRingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (selected ? 0.5 : hovered ? 0.32 : isLockedOrPrivate ? 0.18 : 0.13) * (dimmed ? 0.3 : 1);
    }

    if (verticalRingRef.current) {
      verticalRingRef.current.rotation.x = t * 0.1;
      verticalRingRef.current.rotation.y = Math.PI / 2.1 + Math.sin(t * 0.24) * 0.12;
      const material = verticalRingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (selected ? 0.42 : hovered ? 0.27 : 0.12) * (dimmed ? 0.25 : 1);
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
      <mesh userData={{ lifeMapStarId: star.id }} renderOrder={0}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh ref={glowRef} renderOrder={1}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={outerRingRef} renderOrder={2} rotation={[Math.PI / 2.55, 0.15, 0]}>
        <torusGeometry args={[0.22, isLockedOrPrivate ? 0.0048 : 0.0032, 10, 128]} />
        <meshBasicMaterial color={isLockedOrPrivate ? "#f8fbff" : color} transparent opacity={0.14} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={innerRingRef} renderOrder={3} rotation={[Math.PI / 2.15, -0.2, 0]}>
        <torusGeometry args={[0.14, 0.0038, 10, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.24} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={verticalRingRef} renderOrder={3} rotation={[0.25, Math.PI / 2.1, 0.4]}>
        <torusGeometry args={[0.18, 0.0028, 8, 96]} />
        <meshBasicMaterial color="#e9fbff" transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={coreRef} renderOrder={4}>
        <sphereGeometry args={[0.078, 44, 44]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.05} roughness={0.13} metalness={0.34} transparent opacity={dimmed ? 0.38 : 1} toneMapped={false} />
      </mesh>

      <mesh renderOrder={5} position={[0.048, 0.036, 0.04]}>
        <sphereGeometry args={[0.023, 18, 18]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={dimmed ? 0.35 : 0.95} />
      </mesh>
    </group>
  );
}
