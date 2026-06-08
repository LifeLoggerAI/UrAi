"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// A component for the drifting micro-particles around the orb
function OrbParticleField() {
  const particleRef = useRef<THREE.Points>(null);
  const count = 500;

  const [positions] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.8 + Math.random() * 0.4;
      positions.set(
        [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ],
        i * 3
      );
    }
    return [positions];
  }, []);

  useFrame(({ clock }) => {
    if (particleRef.current) {
      particleRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      particleRef.current.rotation.x = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={particleRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        size={0.005}
        color="#c0c0ff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function LivingUraiPresence() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const breathing = Math.sin(elapsedTime * 0.5);

    if (groupRef.current) {
      // Subtle vertical bobbing
      groupRef.current.position.y = 0.5 + breathing * 0.05;
    }

    // Organic scaling for the core and shells
    const scaleFactor = 1 + breathing * 0.05;
    if (coreRef.current) {
      coreRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
    if (shellRef.current) {
      const shellScale = 1 + breathing * 0.03;
      shellRef.current.scale.set(shellScale, shellScale, shellScale);
      (shellRef.current.material as THREE.ShaderMaterial).opacity =
        0.3 + breathing * 0.1;
    }
    if (haloRef.current) {
      const haloScale = 1 + breathing * 0.02;
      haloRef.current.scale.set(haloScale, haloScale, haloScale);
       (haloRef.current.material as THREE.ShaderMaterial).opacity =
        0.1 + breathing * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Vertical Light Column */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 4, 32]} />
        <meshBasicMaterial
          color="#c0c0ff"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Inner Glowing Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Primary Translucent Shell */}
      <mesh ref={shellRef}>
        <sphereGeometry args={[0.6, 64, 64]} />
        <meshStandardMaterial
          color="#a0a0ff"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.2}
          premultipliedAlpha
        />
      </mesh>

      {/* Outer Volumetric Halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial
          color="#a0a0ff"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <OrbParticleField />

      {/* Grounded Reflection/Glow */}
      <mesh position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial
          color="#a0a0ff"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
       {/* Soft Contact Shadow */}
      <mesh position={[0, -0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

