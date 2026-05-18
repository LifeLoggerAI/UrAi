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
  const auraRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const verticalRingRef = useRef<THREE.Mesh>(null);
  const color = new THREE.Color(star.auraColor);
  const isLockedOrPrivate = star.privacyLevel === "private" || star.privacyLevel === "localOnly";

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * star.twinkleSpeed + star.position3D.x) * 0.075;
    const focus = selected ? 1.85 : hovered ? 1.42 : 1;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(star.size * pulse * focus);
      groupRef.current.rotation.y = Math.sin(t * 0.18 + star.position3D.x) * 0.18;
      groupRef.current.rotation.z = t * 0.035 + star.position3D.z * 0.02;
    }

    if (auraRef.current) {
      const material = auraRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (selected ? 0.2 : hovered ? 0.13 : 0.065) * (dimmed ? 0.24 : 1);
      auraRef.current.scale.setScalar((selected ? 7.2 : hovered ? 5.8 : 4.8) + Math.sin(t * 0.45) * 0.18);
    }

    if (haloRef.current) {
      const material = haloRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (selected ? 0.44 : hovered ? 0.27 : 0.13) * (dimmed ? 0.28 : 1);
      haloRef.current.scale.setScalar((selected ? 3.45 : hovered ? 2.85 : 2.35) + Math.sin(t * 0.9) * 0.13);
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.2;
      const material = innerRingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (selected ? 0.72 : hovered ? 0.42 : 0.2) * (dimmed ? 0.32 : 1);
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.12;
      const material = outerRingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (selected ? 0.48 : hovered ? 0.3 : isLockedOrPrivate ? 0.18 : 0.115) * (dimmed ? 0.3 : 1);
    }

    if (verticalRingRef.current) {
      verticalRingRef.current.rotation.x = t * 0.08;
      verticalRingRef.current.rotation.y = Math.PI / 2.1 + Math.sin(t * 0.22) * 0.1;
      const material = verticalRingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (selected ? 0.36 : hovered ? 0.22 : 0.08) * (dimmed ? 0.25 : 1);
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
      <mesh ref={auraRef} renderOrder={0}>
        <sphereGeometry args={[0.23, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.07} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={haloRef} renderOrder={1}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={outerRingRef} renderOrder={2} rotation={[Math.PI / 2.55, 0.15, 0]}>
        <torusGeometry args={[0.22, isLockedOrPrivate ? 0.0055 : 0.0036, 10, 128]} />
        <meshBasicMaterial color={isLockedOrPrivate ? "#f8fbff" : color} transparent opacity={0.13} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={innerRingRef} renderOrder={3} rotation={[Math.PI / 2.15, -0.2, 0]}>
        <torusGeometry args={[0.145, 0.0042, 10, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={verticalRingRef} renderOrder={3} rotation={[0.25, Math.PI / 2.1, 0.4]}>
        <torusGeometry args={[0.18, 0.0028, 8, 96]} />
        <meshBasicMaterial color="#e9fbff" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh renderOrder={4}>
        <sphereGeometry args={[0.082, 40, 40]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? 4.2 : hovered ? 2.6 : 1.6} roughness={0.18} metalness={0.28} transparent opacity={dimmed ? 0.36 : 1} toneMapped={false} />
      </mesh>

      <mesh renderOrder={5} position={[0.05, 0.038, 0.04]}>
        <sphereGeometry args={[0.024, 18, 18]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={dimmed ? 0.35 : 0.94} />
      </mesh>

      <mesh renderOrder={6} scale={[1, 1, 0.045]} rotation={[0, 0, Math.PI / 4]}>
        <circleGeometry args={[0.38, 48]} />
        <meshBasicMaterial color={color} transparent opacity={(selected ? 0.08 : hovered ? 0.05 : 0.025) * (dimmed ? 0.2 : 1)} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
