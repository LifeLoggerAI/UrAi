"use client";

import { ContactShadows, Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { RuntimeGLB, URAI_SPATIAL_AUTHORITY } from "@/components/urai/real3d/RuntimeGLB";

function MirrorScene() {
  return (
    <>
      <color attach="background" args={["#75838b"]} />
      <fog attach="fog" args={["#9ba3a5", 10, 30]} />
      <ambientLight intensity={0.24} color="#e6eceb" />
      <hemisphereLight intensity={0.5} color="#dce9ee" groundColor="#645f58" />
      <directionalLight position={[-5, 8, 4]} intensity={2.1} color="#f5f1e8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[5, 3.5, -4]} intensity={0.55} color="#b9d2dd" />
      <pointLight position={[0, 2.6, -7.6]} intensity={7} distance={6} decay={2} color="#e7d8b9" />
      <RuntimeGLB src={URAI_SPATIAL_AUTHORITY.mirror} name="mirror-chamber-real-v1-glb" />
      <ContactShadows position={[0, 0.01, -3.5]} scale={13} far={9} blur={3} opacity={0.32} />
      <Environment preset="apartment" environmentIntensity={0.28} />
    </>
  );
}

export function MirrorPhysicalWorld() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas shadows dpr={[1, 1.6]} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1.68, 7.5]} fov={42} />
          <MirrorScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
