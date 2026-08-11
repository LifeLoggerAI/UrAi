"use client";

import { ContactShadows, Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function ShadowArchitecture() {
  const haze = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!haze.current) return;
    haze.current.position.x = Math.sin(clock.elapsedTime * 0.08) * 0.18;
  });

  return (
    <>
      <color attach="background" args={["#12141a"]} />
      <fog attach="fog" args={["#181a20", 9, 28]} />

      <ambientLight intensity={0.16} color="#aab2c1" />
      <hemisphereLight intensity={0.24} color="#929db3" groundColor="#17171a" />
      <directionalLight position={[-5, 7, 3]} intensity={1.15} color="#b8c2d1" castShadow />
      <pointLight position={[4.5, 2.6, -4.5]} intensity={18} distance={9} decay={2} color="#7f769b" />

      {/* Real stone floor, slightly damp rather than fantasy-black void. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, -2]} receiveShadow>
        <planeGeometry args={[24, 28, 1, 1]} />
        <meshStandardMaterial color="#303136" roughness={0.72} metalness={0.04} envMapIntensity={0.4} />
      </mesh>

      {/* Human-scale side walls and rear threshold. */}
      <mesh position={[-6.2, 2.3, -5.2]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[17, 4.6, 0.35]} />
        <meshStandardMaterial color="#292b31" roughness={0.92} />
      </mesh>
      <mesh position={[6.2, 2.3, -5.2]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[17, 4.6, 0.35]} />
        <meshStandardMaterial color="#292b31" roughness={0.92} />
      </mesh>
      <mesh position={[0, 2.3, -13.5]} receiveShadow>
        <boxGeometry args={[12.7, 4.6, 0.38]} />
        <meshStandardMaterial color="#26282d" roughness={0.94} />
      </mesh>

      {/* Tall imperfect glass panels: reflective truth motif, but physically grounded. */}
      {[-3.7, -1.85, 0, 1.85, 3.7].map((x, index) => (
        <group key={x} position={[x, 1.65, -8.4 - Math.abs(x) * 0.22]} rotation={[0, x * -0.025, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.35, 3.3, 0.08]} />
            <meshPhysicalMaterial
              color={index % 2 ? "#5c6170" : "#666a78"}
              roughness={0.19 + index * 0.025}
              metalness={0.03}
              transmission={0.28}
              transparent
              opacity={0.56}
              thickness={0.07}
              ior={1.47}
              envMapIntensity={0.62}
            />
          </mesh>
          <mesh position={[0, -1.82, 0]} castShadow>
            <boxGeometry args={[1.48, 0.18, 0.22]} />
            <meshStandardMaterial color="#1d1e22" roughness={0.68} metalness={0.16} />
          </mesh>
        </group>
      ))}

      {/* A walkable path into the room, irregular enough to feel constructed by hand. */}
      {Array.from({ length: 13 }).map((_, index) => (
        <mesh
          key={`shadow-step-${index}`}
          position={[Math.sin(index * 0.9) * 0.08, 0.018, 2.0 - index * 0.85]}
          rotation={[-Math.PI / 2, 0, Math.sin(index * 1.7) * 0.035]}
          receiveShadow
        >
          <boxGeometry args={[2.3, 0.9, 0.07]} />
          <meshStandardMaterial color={index % 2 ? "#45464a" : "#3d3e43"} roughness={0.9} />
        </mesh>
      ))}

      {/* Low practical floor lights explain where the illumination comes from. */}
      {[-4.9, 4.9].flatMap((x) => [-2.5, -7.0, -11.0].map((z) => [x, z] as const)).map(([x, z]) => (
        <group key={`${x}-${z}`} position={[x, 0.18, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.13, 0.34, 16]} />
            <meshStandardMaterial color="#25262a" roughness={0.55} metalness={0.35} />
          </mesh>
          <pointLight position={[0, 0.22, 0]} intensity={3.2} distance={2.9} decay={2} color="#8b839d" />
        </group>
      ))}

      <group ref={haze} position={[0, 0.65, -9]}>
        {[-4, -1.2, 2.2, 4.5].map((x, index) => (
          <mesh key={x} position={[x, index % 2 ? 0.3 : 0, -index * 0.7]} rotation={[0, index * 0.35, 0]}>
            <planeGeometry args={[5.2, 1.3]} />
            <meshBasicMaterial color="#9ca0ae" transparent opacity={0.025} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      <ContactShadows position={[0, 0.01, -5]} scale={14} far={10} blur={3} opacity={0.3} />
      <Environment preset="warehouse" environmentIntensity={0.16} />
    </>
  );
}

export function ShadowPhysicalWorld() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1.6, 7.4]} fov={44} />
          <ShadowArchitecture />
        </Suspense>
      </Canvas>
    </div>
  );
}
