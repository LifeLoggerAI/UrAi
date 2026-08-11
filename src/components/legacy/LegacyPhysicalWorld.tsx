"use client";

import { ContactShadows, Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { RuntimeGLB, URAI_SPATIAL_AUTHORITY } from "@/components/urai/real3d/RuntimeGLB";

function LegacyScene() {
  return (
    <>
      <color attach="background" args={["#2f2a25"]} />
      <fog attach="fog" args={["#4e473e", 12, 34]} />
      <ambientLight intensity={0.18} color="#cfc4b2" />
      <hemisphereLight intensity={0.32} color="#d6d0c1" groundColor="#41382f" />
      <directionalLight position={[-4.5, 7.5, 4]} intensity={1.5} color="#eadfc9" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight position={[-4.7, 1.1, -4.8]} intensity={9} distance={5} decay={2} color="#f0c688" />
      <pointLight position={[4.7, 1.1, -4.8]} intensity={9} distance={5} decay={2} color="#f0c688" />
      <pointLight position={[0, 3.2, -9.5]} intensity={5} distance={5} decay={2} color="#e8cfac" />
      <RuntimeGLB src={URAI_SPATIAL_AUTHORITY.legacy} name="legacy-archive-real-v1-glb" />
      <ContactShadows position={[0, 0.01, -3.8]} scale={14} far={10} blur={3.2} opacity={0.34} />
      <Environment preset="warehouse" environmentIntensity={0.2} />
    </>
  );
}

export function LegacyPhysicalWorld() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas shadows dpr={[1, 1.6]} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1.68, 7.5]} fov={42} />
          <LegacyScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
