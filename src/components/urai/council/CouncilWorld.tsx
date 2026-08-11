"use client";

import { ContactShadows, Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { RuntimeGLB, URAI_SPATIAL_AUTHORITY } from "@/components/urai/real3d/RuntimeGLB";
import { URAI_COUNCIL_ROLES } from "@/lib/council/uraiCouncilRoles";
import styles from "./CouncilWorld.module.css";

const COUNCIL_PEOPLE = [
  { roleId: "guide", src: URAI_SPATIAL_AUTHORITY.councilGuide, position: [-2.8, 0.05, -1.0] as [number, number, number], rotation: [0, 0.72, 0] as [number, number, number], accentColor: "#d4b980" },
  { roleId: "mirror", src: URAI_SPATIAL_AUTHORITY.councilMirror, position: [-1.55, 0.05, -2.7] as [number, number, number], rotation: [0, 0.35, 0] as [number, number, number], accentColor: "#cfd9df" },
  { roleId: "guardian", src: URAI_SPATIAL_AUTHORITY.councilGuardian, position: [0.0, 0.05, -3.25] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], accentColor: "#7aa5ca" },
  { roleId: "archivist", src: URAI_SPATIAL_AUTHORITY.councilArchivist, position: [1.55, 0.05, -2.7] as [number, number, number], rotation: [0, -0.35, 0] as [number, number, number], accentColor: "#c9a36f" },
  { roleId: "builder", src: URAI_SPATIAL_AUTHORITY.councilBuilder, position: [2.8, 0.05, -1.0] as [number, number, number], rotation: [0, -0.72, 0] as [number, number, number], accentColor: "#d28b58" },
  { roleId: "trickster", src: URAI_SPATIAL_AUTHORITY.councilTrickster, position: [3.35, 0.05, 1.0] as [number, number, number], rotation: [0, -1.2, 0] as [number, number, number], accentColor: "#9a8db8" },
] as const;

function CouncilPerson({
  person,
  active,
  onSelect,
}: {
  person: (typeof COUNCIL_PEOPLE)[number];
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <group name={`council-presence-${person.roleId}`}>
      <RuntimeGLB
        src={person.src}
        name={`council-human-${person.roleId}-glb`}
        position={person.position}
        rotation={person.rotation}
        scale={active ? 1.015 : 1}
        onClick={onSelect}
      />
      <mesh
        position={[person.position[0], 0.026, person.position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={active}
      >
        <ringGeometry args={[0.28, 0.34, 64]} />
        <meshBasicMaterial color={person.accentColor} transparent opacity={0.26} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CouncilScene({ selected, onSelect }: { selected: string; onSelect: (roleId: string) => void }) {
  return (
    <>
      <color attach="background" args={["#8a989d"]} />
      <fog attach="fog" args={["#8f9999", 13, 32]} />
      <PerspectiveCamera makeDefault position={[0, 1.68, 7.5]} fov={42} />
      <ambientLight intensity={0.5} color="#e7ecea" />
      <hemisphereLight intensity={0.7} color="#d9edf4" groundColor="#6b665e" />
      <directionalLight position={[-4.5, 8, 3.8]} intensity={2.7} color="#f2f6f2" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[4, 4.5, -3]} intensity={0.8} color="#ffd9b0" />
      <pointLight position={[-3.8, 1.45, -3.7]} intensity={9} distance={4.2} decay={2} color="#ffd7a2" />
      <pointLight position={[3.8, 1.45, -3.7]} intensity={9} distance={4.2} decay={2} color="#ffd7a2" />

      <RuntimeGLB src={URAI_SPATIAL_AUTHORITY.councilChamber} name="council-chamber-real-v1-glb" />

      {COUNCIL_PEOPLE.map((person) => (
        <CouncilPerson
          key={person.roleId}
          person={person}
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
