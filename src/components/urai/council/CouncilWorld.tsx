"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useMemo, useState } from "react";
import * as THREE from "three";
import { RealHumanPresence } from "@/components/urai/humans/RealHumanPresence";
import { URAI_COUNCIL_ROLES } from "@/lib/council/uraiCouncilRoles";
import styles from "./CouncilWorld.module.css";

const COUNCIL_PEOPLE = [
  {
    roleId: "guide",
    position: [-2.8, 0, -1.0] as [number, number, number],
    rotation: [0, 0.72, 0] as [number, number, number],
    skinTone: "#c58b70",
    hairColor: "#2a1d18",
    hairStyle: "short" as const,
    shirtColor: "#506071",
    trouserColor: "#2d3339",
    accentColor: "#d4b980",
  },
  {
    roleId: "mirror",
    position: [-1.55, 0, -2.7] as [number, number, number],
    rotation: [0, 0.35, 0] as [number, number, number],
    skinTone: "#8d5f49",
    hairColor: "#151211",
    hairStyle: "shoulder" as const,
    shirtColor: "#59636a",
    trouserColor: "#2b2f33",
    accentColor: "#cfd9df",
  },
  {
    roleId: "guardian",
    position: [0.0, 0, -3.25] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    skinTone: "#6f4937",
    hairColor: "#24211f",
    hairStyle: "crop" as const,
    shirtColor: "#263b4f",
    trouserColor: "#22282e",
    accentColor: "#7aa5ca",
  },
  {
    roleId: "archivist",
    position: [1.55, 0, -2.7] as [number, number, number],
    rotation: [0, -0.35, 0] as [number, number, number],
    skinTone: "#d0a183",
    hairColor: "#4a413a",
    hairStyle: "bun" as const,
    shirtColor: "#635d56",
    trouserColor: "#37332f",
    accentColor: "#c9a36f",
  },
  {
    roleId: "builder",
    position: [2.8, 0, -1.0] as [number, number, number],
    rotation: [0, -0.72, 0] as [number, number, number],
    skinTone: "#b57458",
    hairColor: "#39251c",
    hairStyle: "short" as const,
    shirtColor: "#6a594d",
    trouserColor: "#322e2b",
    accentColor: "#d28b58",
  },
  {
    roleId: "trickster",
    position: [3.45, 0, 1.0] as [number, number, number],
    rotation: [0, -1.2, 0] as [number, number, number],
    skinTone: "#9d6a51",
    hairColor: "#171514",
    hairStyle: "crop" as const,
    shirtColor: "#4a454e",
    trouserColor: "#28272b",
    accentColor: "#9a8db8",
  },
] as const;

function ChamberArchitecture() {
  const stone = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#62615d", roughness: 0.92, metalness: 0.015 }),
    [],
  );
  const warmStone = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#7a7268", roughness: 0.88, metalness: 0.01 }),
    [],
  );
  const wood = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#4f3a2c", roughness: 0.82, metalness: 0.01 }),
    [],
  );

  return (
    <group name="council-real-world-architecture">
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[8.2, 96]} />
        <meshStandardMaterial color="#696964" roughness={0.96} metalness={0.01} />
      </mesh>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, -0.55]}>
        <ringGeometry args={[1.55, 5.1, 96]} />
        <meshStandardMaterial color="#77736e" roughness={0.9} metalness={0.015} />
      </mesh>

      <mesh position={[0, 2.75, -4.9]} receiveShadow>
        <boxGeometry args={[10.8, 5.5, 0.32]} />
        <primitive object={warmStone} attach="material" />
      </mesh>

      <mesh position={[-5.25, 2.6, -0.7]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[8.6, 5.2, 0.28]} />
        <primitive object={stone} attach="material" />
      </mesh>
      <mesh position={[5.25, 2.6, -0.7]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[8.6, 5.2, 0.28]} />
        <primitive object={stone} attach="material" />
      </mesh>

      {/* daylight opening */}
      <mesh position={[0, 3.0, -4.72]}>
        <boxGeometry args={[3.8, 2.2, 0.08]} />
        <meshPhysicalMaterial
          color="#a9c0ca"
          transmission={0.76}
          transparent
          opacity={0.42}
          roughness={0.12}
          thickness={0.08}
          ior={1.44}
        />
      </mesh>

      {/* restrained human-scale circular table */}
      <mesh position={[0, 0.74, -0.55]} receiveShadow castShadow>
        <cylinderGeometry args={[1.38, 1.42, 0.09, 72]} />
        <primitive object={wood} attach="material" />
      </mesh>
      <mesh position={[0, 0.38, -0.55]} castShadow>
        <cylinderGeometry args={[0.42, 0.54, 0.68, 48]} />
        <meshStandardMaterial color="#504942" roughness={0.9} />
      </mesh>

      {/* seating forms: quiet upholstered chairs, not thrones */}
      {COUNCIL_PEOPLE.map((person) => {
        const x = person.position[0];
        const z = person.position[2];
        const towardCenter = Math.atan2(-x, -0.55 - z);
        return (
          <group key={`chair-${person.roleId}`} position={[x, 0, z + 0.18]} rotation={[0, towardCenter, 0]}>
            <mesh position={[0, 0.42, 0.09]} castShadow receiveShadow>
              <boxGeometry args={[0.64, 0.16, 0.62]} />
              <meshStandardMaterial color="#34363a" roughness={0.93} />
            </mesh>
            <mesh position={[0, 0.9, 0.34]} castShadow>
              <boxGeometry args={[0.62, 0.86, 0.16]} />
              <meshStandardMaterial color="#3c3e41" roughness={0.94} />
            </mesh>
            <mesh position={[-0.27, 0.35, 0.08]}><cylinderGeometry args={[0.045,0.05,0.7,10]} /><meshStandardMaterial color="#2f3032" roughness={0.88} /></mesh>
            <mesh position={[0.27, 0.35, 0.08]}><cylinderGeometry args={[0.045,0.05,0.7,10]} /><meshStandardMaterial color="#2f3032" roughness={0.88} /></mesh>
          </group>
        );
      })}

      {/* low architectural lamps; warm practical light, not fantasy glow */}
      {[-3.8, 3.8].map((x) => (
        <group key={x} position={[x, 0, -3.85]}>
          <mesh position={[0, 0.72, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.09, 1.4, 18]} />
            <meshStandardMaterial color="#383735" roughness={0.58} metalness={0.38} />
          </mesh>
          <mesh position={[0, 1.48, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.30, 0.34, 28]} />
            <meshStandardMaterial color="#ded4c1" roughness={0.7} />
          </mesh>
          <pointLight position={[0, 1.45, 0.12]} color="#ffd7a2" intensity={12} distance={4.2} decay={2} />
        </group>
      ))}
    </group>
  );
}

function CouncilScene({ selected, onSelect }: { selected: string; onSelect: (roleId: string) => void }) {
  return (
    <>
      <color attach="background" args={["#8a989d"]} />
      <fog attach="fog" args={["#8f9999", 13, 32]} />
      <PerspectiveCamera makeDefault position={[0, 1.66, 7.35]} fov={42} />
      <ambientLight intensity={0.5} color="#e7ecea" />
      <hemisphereLight intensity={0.7} color="#d9edf4" groundColor="#6b665e" />
      <directionalLight
        position={[-4.5, 8, 3.8]}
        intensity={2.7}
        color="#f2f6f2"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[4, 4.5, -3]} intensity={0.8} color="#ffd9b0" />

      <ChamberArchitecture />

      {COUNCIL_PEOPLE.map((person) => (
        <RealHumanPresence
          key={person.roleId}
          name={`council-human-${person.roleId}`}
          position={person.position}
          rotation={person.rotation}
          scale={1}
          skinTone={person.skinTone}
          hairColor={person.hairColor}
          hairStyle={person.hairStyle}
          shirtColor={person.shirtColor}
          trouserColor={person.trouserColor}
          accentColor={person.accentColor}
          active={selected === person.roleId}
          onSelect={() => onSelect(person.roleId)}
        />
      ))}

      <ContactShadows position={[0, 0.012, -0.6]} opacity={0.4} scale={12} blur={2.8} far={7} />
      <Environment preset="apartment" environmentIntensity={0.32} />
    </>
  );
}

export default function CouncilWorld() {
  const [selected, setSelected] = useState("guide");
  const role = URAI_COUNCIL_ROLES.find((entry) => entry.id === selected) ?? URAI_COUNCIL_ROLES[0];

  return (
    <main className={styles.root}>
      <div className={styles.canvasWrap}>
        <Canvas shadows dpr={[1, 1.8]} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
          <Suspense fallback={null}>
            <CouncilScene selected={selected} onSelect={setSelected} />
          </Suspense>
        </Canvas>
      </div>

      <section className={styles.identity} aria-live="polite">
        <div className={styles.eyebrow}>Council</div>
        <h1>{role.name}</h1>
        <p className={styles.title}>{role.title}</p>
        <p>{role.purpose}</p>
      </section>

      <div className={styles.hint}>Select a person</div>
    </main>
  );
}
