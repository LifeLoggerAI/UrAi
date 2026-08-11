"use client";

import { ContactShadows, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const ROCKS: Array<[number, number, number, number]> = [
  [-4.8, -0.22, -3.6, 0.85],
  [-3.5, -0.24, 1.6, 0.55],
  [4.3, -0.2, -2.8, 0.72],
  [3.8, -0.23, 2.4, 0.48],
  [-1.8, -0.25, -5.2, 0.62],
  [1.9, -0.25, -5.7, 0.78],
];

const TREES: Array<[number, number, number, number]> = [
  [-6.2, -0.34, -5.2, 1.15],
  [-4.7, -0.35, -6.7, 0.95],
  [5.7, -0.34, -5.6, 1.2],
  [7.1, -0.36, -7.1, 1.0],
  [-7.6, -0.4, -9.4, 1.35],
  [7.9, -0.4, -10.2, 1.42],
];

const GRASSES: Array<[number, number, number, number]> = [
  [-2.8, -0.29, -1.8, 0.75], [-2.4, -0.29, -2.1, 0.55], [-3.0, -0.29, -2.4, 0.62],
  [2.7, -0.29, -1.7, 0.7], [3.1, -0.29, -2.2, 0.5], [2.4, -0.29, -2.5, 0.65],
  [-4.4, -0.3, 0.5, 0.6], [4.7, -0.3, 0.8, 0.72], [-5.2, -0.3, -3.0, 0.56],
  [5.1, -0.3, -3.6, 0.64], [-1.2, -0.29, -4.6, 0.62], [1.3, -0.29, -4.8, 0.58],
];

function Terrain() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(42, 42, 72, 72);
    const positions = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const radial = Math.sqrt(x * x + y * y);
      const relief =
        Math.sin(x * 0.42) * 0.16 +
        Math.cos(y * 0.35) * 0.13 +
        Math.sin((x + y) * 0.2) * 0.08 +
        Math.max(0, radial - 5) * 0.015;
      positions.setZ(i, relief);
    }
    positions.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.34, -2]} receiveShadow>
      <meshStandardMaterial color="#53634c" roughness={0.96} metalness={0} envMapIntensity={0.22} />
    </mesh>
  );
}

function Tree({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.17, 0.25, 2.5, 12]} />
        <meshStandardMaterial color="#4e3928" roughness={0.98} />
      </mesh>
      <mesh position={[0, 2.55, 0]} scale={[1.25, 0.78, 1.15]} castShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#314d34" roughness={0.95} />
      </mesh>
      <mesh position={[-0.58, 2.4, 0.12]} scale={[0.72, 0.58, 0.72]} castShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#3c5d3d" roughness={0.95} />
      </mesh>
      <mesh position={[0.62, 2.46, -0.08]} scale={[0.76, 0.6, 0.72]} castShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#355638" roughness={0.95} />
      </mesh>
    </group>
  );
}

function GrassClump({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <group position={position} scale={scale}>
      {[-0.16, -0.08, 0, 0.08, 0.16].map((x, index) => (
        <mesh key={x} position={[x, 0.22 + (index % 2) * 0.05, 0]} rotation={[0, 0, x * -1.4]} castShadow>
          <coneGeometry args={[0.035, 0.5 + (index % 3) * 0.08, 6]} />
          <meshStandardMaterial color={index % 2 === 0 ? "#667953" : "#77865d"} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function NaturalWorld() {
  return (
    <group name="home-natural-world">
      <Terrain />

      {/* A shallow reflective pond grounds the foreground and gives the sky a physical response. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.75, -0.285, -1.2]} receiveShadow>
        <circleGeometry args={[1.55, 72]} />
        <meshPhysicalMaterial
          color="#5b7e84"
          roughness={0.12}
          metalness={0.02}
          transmission={0.18}
          transparent
          opacity={0.82}
          ior={1.33}
          thickness={0.12}
          envMapIntensity={0.8}
        />
      </mesh>

      {ROCKS.map(([x, y, z, scale], index) => (
        <mesh
          key={`rock-${index}`}
          position={[x, y, z]}
          rotation={[0.08 * index, 0.57 * index, 0.04 * (index % 2)]}
          scale={[scale * 1.15, scale * 0.7, scale]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={index % 2 ? "#716d64" : "#66675f"} roughness={0.94} />
        </mesh>
      ))}

      {TREES.map(([x, y, z, scale], index) => (
        <Tree key={`tree-${index}`} position={[x, y, z]} scale={scale} />
      ))}

      {GRASSES.map(([x, y, z, scale], index) => (
        <GrassClump key={`grass-${index}`} position={[x, y, z]} scale={scale} />
      ))}

      {/* Walkable stone path: irregular, human-scale, and visually subordinate to the landscape. */}
      {Array.from({ length: 12 }).map((_, index) => {
        const z = 2.2 - index * 0.72;
        const x = Math.sin(index * 0.72) * 0.18;
        return (
          <mesh
            key={`path-${index}`}
            position={[x, -0.265, z]}
            rotation={[-Math.PI / 2, 0, Math.sin(index) * 0.07]}
            scale={[0.74 + (index % 3) * 0.06, 0.45, 1]}
            receiveShadow
          >
            <circleGeometry args={[0.55, 12]} />
            <meshStandardMaterial color="#858078" roughness={0.98} />
          </mesh>
        );
      })}
    </group>
  );
}

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
        <shaderMaterial
          uniforms={skyShader.uniforms}
          vertexShader={skyShader.vertexShader}
          fragmentShader={skyShader.fragmentShader}
          side={THREE.BackSide}
        />
      </mesh>

      <NaturalWorld />
      <AtmosphericMist />
      <ContactShadows position={[0, -0.285, -1.5]} scale={18} far={9} blur={3.4} opacity={0.34} />
      <Environment preset="forest" environmentIntensity={0.32} />
    </>
  );
}
