"use client";

import { ContactShadows, Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { RuntimeGLB, URAI_SPATIAL_AUTHORITY } from "@/components/urai/real3d/RuntimeGLB";

function ShadowScene() {
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
      {[-4.7, 4.7].flatMap((x) => [-2.5, -6.5].map((z) => [x, z] as const)).map(([x, z]) => (
        <pointLight key={`${x}-${z}`} position={[x, 0.42, z]} intensity={2.8} distance={2.8} decay={2} color="#8b839d" />
      ))}

      <RuntimeGLB src={URAI_SPATIAL_AUTHORITY.shadow} name="shadow-hall-real-v1-glb" />

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
          <PerspectiveCamera makeDefault position={[0, 1.68, 7.5]} fov={42} />
          <ShadowScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
