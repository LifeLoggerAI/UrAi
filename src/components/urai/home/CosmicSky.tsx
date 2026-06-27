"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function makeStarPositions(count: number, radius: number, depth: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new THREE.Color("#e9fbff"),
    new THREE.Color("#9be7ff"),
    new THREE.Color("#c4b5fd"),
    new THREE.Color("#fde68a"),
  ];

  for (let index = 0; index < count; index += 1) {
    const angle = index * 2.39996323;
    const spread = Math.sqrt(index / count) * radius;
    const lift = (((index * 41) % 100) / 100 - 0.5) * radius * 0.72;

    positions[index * 3] = Math.cos(angle) * spread;
    positions[index * 3 + 1] = lift;
    positions[index * 3 + 2] = Math.sin(angle) * spread - depth - ((index * 17) % 120) / 14;

    const color = palette[index % palette.length];
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  return { positions, colors };
}

export function CosmicSky() {
  const skyRef = useRef<THREE.Group>(null);
  const farStars = useMemo(() => makeStarPositions(1400, 42, 18), []);
  const nearStars = useMemo(() => makeStarPositions(520, 24, 8), []);

  useFrame(({ clock }) => {
    if (!skyRef.current) return;

    const elapsed = clock.getElapsedTime();
    skyRef.current.rotation.y = Math.sin(elapsed * 0.018) * 0.035;
    skyRef.current.rotation.z = Math.cos(elapsed * 0.014) * 0.018;
  });

  return (
    <group ref={skyRef} name="urai-cosmic-sky">
      <color attach="background" args={["#030712"]} />
      <mesh scale={[90, 90, 90]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color="#07111f" side={THREE.BackSide} />
      </mesh>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[farStars.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[farStars.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} vertexColors transparent opacity={0.72} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nearStars.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[nearStars.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.085} vertexColors transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}
