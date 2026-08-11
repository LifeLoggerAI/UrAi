"use client";

import { ContactShadows, Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { HumanGLBPresence, RuntimeGLB, URAI_REAL_3D } from "@/components/urai/real3d/RuntimeGLB";
import { URAI_COUNCIL_ROLES } from "@/lib/council/uraiCouncilRoles";
import styles from "./CouncilWorld.module.css";

const COUNCIL_PEOPLE = [
  { roleId: "guide", position: [-2.8, 0, -1.0] as [number, number, number], rotation: [0, 0.72, 0] as [number, number, number], skinTone: "#c58b70", hairColor: "#2a1d18", shirtColor: "#506071", trouserColor: "#2d3339", accentColor: "#d4b980" },
  { roleId: "mirror", position: [-1.55, 0, -2.7] as [number, number, number], rotation: [0, 0.35, 0] as [number, number, number], skinTone: "#8d5f49", hairColor: "#151211", shirtColor: "#59636a", trouserColor: "#2b2f33", accentColor: "#cfd9df" },
  { roleId: "guardian", position: [0.0, 0, -3.25] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], skinTone: "#6f4937", hairColor: "#24211f", shirtColor: "#263b4f", trouserColor: "#22282e", accentColor: "#7aa5ca" },
  { roleId: "archivist", position: [1.55, 0, -2.7] as [number, number, number], rotation: [0, -0.35, 0] as [number, number, number], skinTone: "#d0a183", hairColor: "#4a413a", shirtColor: "#635d56", trouserColor: "#37332f", accentColor: "#c9a36f" },
  { roleId: "builder", position: [2.8, 0, -1.0] as [number, number, number], rotation: [0, -0.72, 0] as [number, number, number], skinTone: "#b57458", hairColor: "#39251c", shirtColor: "#6a594d", trouserColor: "#322e2b", accentColor: "#d28b58" },
  { roleId: "trickster", position: [3.45, 0, 1.0] as [number, number, number], rotation: [0, -1.2, 0] as [number, number, number], skinTone: "#9d6a51", hairColor: "#171514", shirtColor: "#4a454e", trouserColor: "#28272b", accentColor: "#9a8db8" },
] as const;

function CouncilScene({ selected, onSelect }: { selected: string; onSelect: (roleId: string) => void }) {
  return (
    <>
      <color attach="background" args={["#8a989d"]} />
      <fog attach="fog" args={["#8f9999", 13, 32]} />
      <PerspectiveCamera makeDefault position={[0, 1.66, 7.35]} fov={42} />
      <ambientLight intensity={0.5} color="#e7ecea" />
      <hemisphereLight intensity={0.7} color="#d9edf4" groundColor="#6b665e" />
      <directionalLight position={[-4.5, 8, 3.8]} intensity={2.7} color="#f2f6f2" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[4, 4.5, -3]} intensity={0.8} color="#ffd9b0" />
      <pointLight position={[-3.8, 1.45, -3.7]} intensity={9} distance={4.2} decay={2} color="#ffd7a2" />
      <pointLight position={[3.8, 1.45, -3.7]} intensity={9} distance={4.2} decay={2} color="#ffd7a2" />

      <RuntimeGLB src={URAI_REAL_3D.councilChamber} name="council-chamber-glb" />

      {COUNCIL_PEOPLE.map((person) => (
        <HumanGLBPresence
          key={person.roleId}
          name={`council-human-${person.roleId}`}
          position={person.position}
          rotation={person.rotation}
          skinTone={person.skinTone}
          hairColor={person.hairColor}
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
