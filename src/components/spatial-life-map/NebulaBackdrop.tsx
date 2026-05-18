"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function makeNebulaTexture() {
  const size = 128;
  const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
  if (!canvas) return null;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,0.78)");
  gradient.addColorStop(0.22, "rgba(180,244,255,0.34)");
  gradient.addColorStop(0.52, "rgba(120,180,255,0.12)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function NebulaBackdrop({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const planeRef = useRef<THREE.Group>(null);
  const texture = useMemo(() => makeNebulaTexture(), []);
  const particles = useMemo(() => {
    return Array.from({ length: 520 }, (_, index) => {
      const arm = index % 4;
      const angle = arm * Math.PI * 0.5 + index * 0.18;
      const radius = 2.4 + Math.pow(index / 520, 0.6) * 10.4;
      return {
        position: new THREE.Vector3(
          Math.cos(angle + radius * 0.16) * radius,
          (((index * 29) % 100) / 100 - 0.5) * 1.7 + Math.sin(angle * 0.65) * 0.4,
          Math.sin(angle + radius * 0.16) * radius * 0.72 - 7.2,
        ),
        size: 0.036 + ((index * 11) % 25) * 0.0032,
        color: ["#bfe9ff", "#c4b5fd", "#86efac", "#fde68a", "#7dd3fc"][index % 5],
      };
    });
  }, []);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.035) * 0.055;
      groupRef.current.rotation.y = Math.sin(t * 0.018) * 0.08;
    }
    if (planeRef.current) {
      planeRef.current.rotation.z = -t * 0.006;
      planeRef.current.rotation.x = 0.72 + Math.sin(t * 0.02) * 0.03;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.22, -0.18, -0.1]}>
      <group ref={planeRef}>
        <mesh position={[0, -0.18, -8.8]} rotation={[0.72, 0, -0.16]} scale={[15.5, 4.6, 1]}>
          <planeGeometry args={[1, 1, 1, 1]} />
          <meshBasicMaterial map={texture ?? undefined} color="#7dd3fc" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-2.4, 0.25, -7.4]} rotation={[0.8, 0.24, 0.28]} scale={[10.8, 2.6, 1]}>
          <planeGeometry args={[1, 1, 1, 1]} />
          <meshBasicMaterial map={texture ?? undefined} color="#c4b5fd" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[3.5, 0.38, -9.2]} rotation={[0.66, -0.18, -0.44]} scale={[9.4, 2.2, 1]}>
          <planeGeometry args={[1, 1, 1, 1]} />
          <meshBasicMaterial map={texture ?? undefined} color="#ffe58a" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <mesh position={[0, -0.25, -7.4]} rotation={[0.82, 0, -0.12]}>
        <torusGeometry args={[6.9, 0.018, 16, 280]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0.4, -0.12, -8.2]} rotation={[0.78, 0.16, 0.32]}>
        <torusGeometry args={[4.8, 0.014, 16, 260]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[-0.6, 0.1, -9.5]} rotation={[0.68, -0.12, -0.42]}>
        <torusGeometry args={[9.2, 0.009, 12, 300]} />
        <meshBasicMaterial color="#bfe9ff" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position} scale={[1.8, 0.72, 1]}>
          <sphereGeometry args={[particle.size, 10, 10]} />
          <meshBasicMaterial color={particle.color} transparent opacity={0.34} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
      <mesh position={[-3.5, -0.2, -8.1]} scale={[7.8, 2.2, 1]}>
        <sphereGeometry args={[1, 40, 40]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[4.4, 0.35, -10.2]} scale={[6.2, 1.6, 1]}>
        <sphereGeometry args={[1, 40, 40]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.052} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
