"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

type SceneBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type SceneBoundaryState = {
  hasError: boolean;
};

class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state: SceneBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SceneBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("URAI home 3D world failed to render", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function HomeCanvasFallback() {
  return (
    <div className="urai-home-world-fallback" aria-hidden>
      <div className="urai-home-world-fallback-orb" />
      <div className="urai-home-world-fallback-ring" />
    </div>
  );
}

function MoonlitStars() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const stars = useMemo(
    () =>
      Array.from({ length: 220 }, (_, index) => {
        const angle = index * 2.399963229728653;
        const radius = 8 + ((index * 37) % 120) / 10;
        const y = 0.6 + ((index * 29) % 92) / 10;
        return {
          position: new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius - 8),
          scale: 0.55 + ((index * 17) % 34) / 100,
        };
      }),
    [],
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    stars.forEach((star, index) => {
      dummy.position.copy(star.position);
      dummy.scale.setScalar(star.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy, stars]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.elapsedTime * 0.005;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, stars.length]} renderOrder={-1}>
      <sphereGeometry args={[0.026, 8, 8]} />
      <meshBasicMaterial color="#e8fbff" transparent opacity={0.72} toneMapped={false} />
    </instancedMesh>
  );
}

function ShrineOrb() {
  const orbRef = useRef<THREE.Mesh>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (orbRef.current) {
      const pulse = 1 + Math.sin(time * 1.4) * 0.025;
      orbRef.current.scale.setScalar(pulse);
      orbRef.current.position.y = 1.32 + Math.sin(time * 0.85) * 0.035;
    }
    if (ringARef.current) ringARef.current.rotation.z = time * 0.18;
    if (ringBRef.current) ringBRef.current.rotation.z = -time * 0.12;
  });

  return (
    <group position={[0, 0.1, -1.1]}>
      <mesh ref={orbRef} position={[0, 1.32, 0]}>
        <sphereGeometry args={[0.48, 64, 64]} />
        <meshStandardMaterial color="#eefcff" emissive="#7dd3fc" emissiveIntensity={1.5} roughness={0.22} metalness={0.08} />
      </mesh>
      <mesh ref={ringARef} position={[0, 1.32, 0]} rotation={[1.35, 0.12, 0]}>
        <torusGeometry args={[0.82, 0.006, 12, 180]} />
        <meshBasicMaterial color="#dffaff" transparent opacity={0.42} toneMapped={false} />
      </mesh>
      <mesh ref={ringBRef} position={[0, 1.32, 0]} rotation={[1.2, 0.8, 0.55]}>
        <torusGeometry args={[1.08, 0.004, 12, 180]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.24} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 1.35, 0.2]} intensity={6.2} color="#9be7ff" distance={9} />
      <pointLight position={[0.1, 1.9, 0.5]} intensity={1.6} color="#fff0b6" distance={7} />
    </group>
  );
}

function MoonAndVault() {
  const vaultRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (vaultRef.current) vaultRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.12) * 0.015;
  });

  return (
    <group ref={vaultRef}>
      <mesh position={[3.3, 4.85, -9.8]}>
        <sphereGeometry args={[0.42, 40, 40]} />
        <meshBasicMaterial color="#f8fbff" transparent opacity={0.78} toneMapped={false} />
      </mesh>
      <mesh position={[3.15, 4.92, -9.72]}>
        <sphereGeometry args={[0.39, 40, 40]} />
        <meshBasicMaterial color="#041022" transparent opacity={0.95} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.42, -7.2]} rotation={[1.18, 0, 0]}>
        <torusGeometry args={[3.2, 0.006, 12, 220]} />
        <meshBasicMaterial color="#bae6fd" transparent opacity={0.14} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.08, -7.8]} rotation={[1.26, 0, 0]}>
        <torusGeometry args={[4.7, 0.005, 12, 260]} />
        <meshBasicMaterial color="#ddd6fe" transparent opacity={0.1} toneMapped={false} />
      </mesh>
    </group>
  );
}

function ReflectiveGround() {
  return (
    <group>
      <mesh position={[0, -0.86, -1.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[8.8, 180]} />
        <meshStandardMaterial color="#020712" roughness={0.24} metalness={0.62} emissive="#04152a" emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[0, -0.84, -1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.43, 220]} />
        <meshBasicMaterial color="#bff3ff" transparent opacity={0.16} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.835, -1.2]} rotation={[-Math.PI / 2, 0, Math.PI / 8]}>
        <ringGeometry args={[2.2, 2.23, 260]} />
        <meshBasicMaterial color="#fef3c7" transparent opacity={0.08} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.83, -1.2]} rotation={[-Math.PI / 2, 0, -Math.PI / 6]}>
        <ringGeometry args={[3.2, 3.23, 300]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.07} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function MoonlitHomeWorld() {
  return (
    <>
      <color attach="background" args={["#00030b"]} />
      <fog attach="fog" args={["#06162c", 5, 18]} />
      <ambientLight intensity={0.42} color="#dffaff" />
      <hemisphereLight args={["#d9f8ff", "#020617", 0.72]} />
      <directionalLight position={[3.6, 6.2, 4.8]} intensity={1.9} color="#f8fbff" castShadow />
      <pointLight position={[-3.6, 1.4, -0.8]} intensity={1.2} color="#c4b5fd" distance={12} />
      <MoonlitStars />
      <MoonAndVault />
      <ReflectiveGround />
      <ShrineOrb />
    </>
  );
}

export function HomeWorldCanvas() {
  return (
    <SceneBoundary fallback={<HomeCanvasFallback />}>
      <div className="urai-home-world-canvas" aria-hidden>
        <Canvas
          dpr={[1, 1.65]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
          camera={{ position: [0, 1.1, 6.2], fov: 46, near: 0.05, far: 80 }}
          shadows
        >
          <Suspense fallback={null}>
            <MoonlitHomeWorld />
          </Suspense>
        </Canvas>
      </div>
    </SceneBoundary>
  );
}
