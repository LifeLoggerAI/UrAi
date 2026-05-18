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
  gradient.addColorStop(0, "rgba(255,255,255,0.72)");
  gradient.addColorStop(0.18, "rgba(180,244,255,0.28)");
  gradient.addColorStop(0.5, "rgba(120,180,255,0.08)");
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
    return Array.from({ length: 1200 }, (_, index) => {
      const arm = index % 5;
      const t = index / 1200;
      const radius = 0.8 + Math.pow(t, 0.68) * 8.2;
      const angle = arm * ((Math.PI * 2) / 5) + index * 0.165 + radius * 0.54;
      const scatter = (((index * 37) % 100) / 100 - 0.5) * (0.32 + radius * 0.16);
      return {
        position: new THREE.Vector3(
          Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * scatter,
          (((index * 29) % 100) / 100 - 0.5) * (0.5 + t * 1.15) + Math.sin(angle * 0.65) * 0.18,
          Math.sin(angle) * radius * 0.74 - 2.2 - t * 4.4,
        ),
        size: 0.024 + ((index * 11) % 22) * 0.0024,
        color: ["#dff8ff", "#9be7ff", "#c4b5fd", "#86efac", "#fde68a"][index % 5],
      };
    });
  }, []);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.035) * 0.04;
      groupRef.current.rotation.y = Math.sin(t * 0.018) * 0.07;
    }
    if (planeRef.current) {
      planeRef.current.rotation.z = -t * 0.006;
      planeRef.current.rotation.x = 0.82 + Math.sin(t * 0.02) * 0.025;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.28, -0.24, -0.12]} position={[0, 0, 1.1]}>
      <group ref={planeRef}>
        <mesh position={[0, -0.1, -4.2]} rotation={[0.9, 0, -0.18]} scale={[9.2, 1.85, 1]}>
          <planeGeometry args={[1, 1, 1, 1]} />
          <meshBasicMaterial map={texture ?? undefined} color="#7dd3fc" transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-1.7, 0.22, -5.1]} rotation={[0.95, 0.24, 0.26]} scale={[6.4, 1.24, 1]}>
          <planeGeometry args={[1, 1, 1, 1]} />
          <meshBasicMaterial map={texture ?? undefined} color="#c4b5fd" transparent opacity={0.095} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[2.4, 0.32, -6.1]} rotation={[0.78, -0.18, -0.48]} scale={[5.6, 1.06, 1]}>
          <planeGeometry args={[1, 1, 1, 1]} />
          <meshBasicMaterial map={texture ?? undefined} color="#ffe58a" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <mesh position={[0, -0.22, -3.7]} rotation={[0.95, 0, -0.12]}>
        <torusGeometry args={[3.4, 0.01, 12, 220]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0.4, -0.1, -4.5]} rotation={[0.9, 0.16, 0.32]}>
        <torusGeometry args={[5.1, 0.007, 10, 260]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[-0.3, 0.08, -5.8]} rotation={[0.78, -0.12, -0.42]}>
        <torusGeometry args={[7.2, 0.0055, 10, 300]} />
        <meshBasicMaterial color="#bfe9ff" transparent opacity={0.055} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position} scale={[1.15, 0.82, 1]}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial color={particle.color} transparent opacity={0.48} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
