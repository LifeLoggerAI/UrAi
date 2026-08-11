"use client";

import { ContactShadows, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { RuntimeGLB, URAI_REAL_3D } from "@/components/urai/real3d/RuntimeGLB";

function AtmosphericMist() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.position.x = Math.sin(clock.elapsedTime * 0.05) * 0.35;
  });

  return (
    <group ref={group} position={[0, 0.35, -8]}>
      {[-5.5, -1.8, 2.4, 5.9].map((x, index) => (
        <mesh key={x} position={[x, index % 2 ? 0.25 : 0.05, -index * 1.4]} rotation={[0, index * 0.42, 0]}>
          <planeGeometry args={[7.5, 1.7]} />
          <meshBasicMaterial color="#d5dcd8" transparent opacity={0.035} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export function CinematicWorld() {
  const skyShader = useMemo(
    () => ({
      uniforms: {
        topColor: { value: new THREE.Color("#617d91") },
        horizonColor: { value: new THREE.Color("#c5c7bb") },
        groundColor: { value: new THREE.Color("#8b8b7d") },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 horizonColor;
        uniform vec3 groundColor;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          float skyMix = smoothstep(0.0, 0.72, max(h, 0.0));
          float groundMix = smoothstep(-0.3, 0.0, h);
          vec3 below = mix(groundColor, horizonColor, groundMix);
          vec3 color = h >= 0.0 ? mix(horizonColor, topColor, skyMix) : below;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    }),
    [],
  );

  return (
    <>
      <fog attach="fog" args={["#a1aaa5", 14, 42]} />
      <hemisphereLight intensity={0.68} color="#d9e5e7" groundColor="#626253" />
      <ambientLight intensity={0.24} color="#dce1dc" />
      <directionalLight
        position={[-6, 10, 5]}
        intensity={2.2}
        color="#f3eee1"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <directionalLight position={[7, 4, -8]} intensity={0.45} color="#a9c6d4" />

      <mesh scale={[100, 100, 100]}>
        <sphereGeometry args={[1, 48, 32]} />
        <shaderMaterial uniforms={skyShader.uniforms} vertexShader={skyShader.vertexShader} fragmentShader={skyShader.fragmentShader} side={THREE.BackSide} />
      </mesh>

      <RuntimeGLB src={URAI_REAL_3D.home} name="home-world-glb" />
      <AtmosphericMist />
      <ContactShadows position={[0, 0.01, -1.5]} scale={18} far={9} blur={3.4} opacity={0.34} />
      <Environment preset="forest" environmentIntensity={0.32} />
    </>
  );
}
