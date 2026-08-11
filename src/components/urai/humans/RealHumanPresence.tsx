"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type HairStyle = "short" | "crop" | "shoulder" | "bun";

type RealHumanPresenceProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  skinTone?: string;
  hairColor?: string;
  hairStyle?: HairStyle;
  shirtColor?: string;
  trouserColor?: string;
  shoeColor?: string;
  accentColor?: string;
  active?: boolean;
  breathing?: boolean;
  onSelect?: () => void;
  name?: string;
};

const SKIN_ROUGHNESS = 0.56;
const CLOTH_ROUGHNESS = 0.88;

function Limb({
  position,
  rotation = [0, 0, 0],
  length,
  radius,
  color,
  skin = false,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  length: number;
  radius: number;
  color: string;
  skin?: boolean;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <capsuleGeometry args={[radius, length, 7, 14]} />
      <meshStandardMaterial
        color={color}
        roughness={skin ? SKIN_ROUGHNESS : CLOTH_ROUGHNESS}
        metalness={0.01}
      />
    </mesh>
  );
}

function Hair({ color, style }: { color: string; style: HairStyle }) {
  if (style === "bun") {
    return (
      <group>
        <mesh position={[0, 1.765, -0.02]} scale={[0.112, 0.105, 0.105]} castShadow>
          <sphereGeometry args={[1, 18, 14]} />
          <meshStandardMaterial color={color} roughness={0.96} />
        </mesh>
        <mesh position={[0, 1.695, -0.052]} scale={[0.108, 0.095, 0.102]} castShadow>
          <sphereGeometry args={[1, 20, 16]} />
          <meshStandardMaterial color={color} roughness={0.96} />
        </mesh>
      </group>
    );
  }

  if (style === "shoulder") {
    return (
      <group>
        <mesh position={[0, 1.7, -0.055]} scale={[0.112, 0.115, 0.105]} castShadow>
          <sphereGeometry args={[1, 20, 16]} />
          <meshStandardMaterial color={color} roughness={0.96} />
        </mesh>
        <mesh position={[-0.105, 1.57, -0.035]} scale={[0.035, 0.16, 0.045]} castShadow>
          <capsuleGeometry args={[1, 1.3, 5, 10]} />
          <meshStandardMaterial color={color} roughness={0.96} />
        </mesh>
        <mesh position={[0.105, 1.57, -0.035]} scale={[0.035, 0.16, 0.045]} castShadow>
          <capsuleGeometry args={[1, 1.3, 5, 10]} />
          <meshStandardMaterial color={color} roughness={0.96} />
        </mesh>
      </group>
    );
  }

  return (
    <mesh
      position={[0, style === "crop" ? 1.715 : 1.725, -0.045]}
      scale={style === "crop" ? [0.101, 0.073, 0.094] : [0.108, 0.088, 0.101]}
      castShadow
    >
      <sphereGeometry args={[1, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.64]} />
      <meshStandardMaterial color={color} roughness={0.96} />
    </mesh>
  );
}

/**
 * Runtime human representation for URAI's spatial worlds.
 *
 * This intentionally uses real-world scale and anatomical proportions instead of
 * icon/silhouette primitives. It is still renderer-authored geometry so it can be
 * replaced one-for-one by a scanned or rigged GLB without changing scene contracts.
 */
export function RealHumanPresence({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  skinTone = "#b8795e",
  hairColor = "#241813",
  hairStyle = "short",
  shirtColor = "#26384a",
  trouserColor = "#20252d",
  shoeColor = "#161719",
  accentColor = "#8ed7ff",
  active = false,
  breathing = true,
  onSelect,
  name = "urai-human-presence",
}: RealHumanPresenceProps) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const accent = useRef<THREE.Mesh>(null);

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: active ? 0.34 : 0.1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [accentColor, active],
  );

  useFrame(({ clock }) => {
    if (!root.current) return;
    const t = clock.getElapsedTime();
    const breath = breathing ? Math.sin(t * 1.45) : 0;
    root.current.position.y = position[1] + breath * 0.0045;
    root.current.rotation.y = rotation[1] + Math.sin(t * 0.31) * 0.006;
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.23) * 0.025;
      head.current.rotation.x = Math.sin(t * 0.17) * 0.008;
    }
    if (accent.current) {
      accent.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.025);
    }
  });

  return (
    <group
      ref={root}
      name={name}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(event) => {
        if (!onSelect) return;
        event.stopPropagation();
        onSelect();
      }}
      userData={{
        representation: "human-proportioned-runtime-presence",
        replaceableByRiggedGlb: true,
        realWorldHeightMeters: 1.78,
      }}
    >
      {/* feet / shoes */}
      <mesh position={[-0.09, 0.075, 0.035]} scale={[0.095, 0.055, 0.18]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={shoeColor} roughness={0.82} />
      </mesh>
      <mesh position={[0.09, 0.075, 0.035]} scale={[0.095, 0.055, 0.18]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={shoeColor} roughness={0.82} />
      </mesh>

      {/* legs */}
      <Limb position={[-0.085, 0.4, 0]} length={0.43} radius={0.067} color={trouserColor} />
      <Limb position={[0.085, 0.4, 0]} length={0.43} radius={0.067} color={trouserColor} />
      <Limb position={[-0.09, 0.79, 0]} length={0.39} radius={0.078} color={trouserColor} />
      <Limb position={[0.09, 0.79, 0]} length={0.39} radius={0.078} color={trouserColor} />

      {/* pelvis and torso */}
      <mesh position={[0, 1.0, 0]} scale={[0.22, 0.16, 0.14]} castShadow>
        <sphereGeometry args={[1, 20, 16]} />
        <meshStandardMaterial color={trouserColor} roughness={CLOTH_ROUGHNESS} />
      </mesh>
      <mesh position={[0, 1.27, 0]} scale={[0.27, 0.34, 0.155]} castShadow receiveShadow>
        <capsuleGeometry args={[0.58, 0.72, 7, 18]} />
        <meshStandardMaterial color={shirtColor} roughness={CLOTH_ROUGHNESS} metalness={0.015} />
      </mesh>

      {/* neck */}
      <mesh position={[0, 1.52, 0]} castShadow>
        <cylinderGeometry args={[0.058, 0.065, 0.13, 16]} />
        <meshStandardMaterial color={skinTone} roughness={SKIN_ROUGHNESS} />
      </mesh>

      {/* arms */}
      <Limb position={[-0.29, 1.28, 0]} rotation={[0, 0, -0.09]} length={0.28} radius={0.055} color={shirtColor} />
      <Limb position={[0.29, 1.28, 0]} rotation={[0, 0, 0.09]} length={0.28} radius={0.055} color={shirtColor} />
      <Limb position={[-0.315, 1.02, 0.015]} rotation={[0.01, 0, 0.025]} length={0.25} radius={0.047} color={skinTone} skin />
      <Limb position={[0.315, 1.02, 0.015]} rotation={[0.01, 0, -0.025]} length={0.25} radius={0.047} color={skinTone} skin />
      <mesh position={[-0.318, 0.82, 0.035]} scale={[0.052, 0.085, 0.04]} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={skinTone} roughness={SKIN_ROUGHNESS} />
      </mesh>
      <mesh position={[0.318, 0.82, 0.035]} scale={[0.052, 0.085, 0.04]} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={skinTone} roughness={SKIN_ROUGHNESS} />
      </mesh>

      {/* head and face */}
      <group ref={head}>
        <mesh position={[0, 1.68, 0]} scale={[0.115, 0.145, 0.113]} castShadow receiveShadow>
          <sphereGeometry args={[1, 26, 20]} />
          <meshStandardMaterial color={skinTone} roughness={SKIN_ROUGHNESS} metalness={0} />
        </mesh>
        <mesh position={[-0.116, 1.68, 0]} scale={[0.018, 0.035, 0.02]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color={skinTone} roughness={SKIN_ROUGHNESS} />
        </mesh>
        <mesh position={[0.116, 1.68, 0]} scale={[0.018, 0.035, 0.02]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color={skinTone} roughness={SKIN_ROUGHNESS} />
        </mesh>
        <mesh position={[0, 1.675, 0.112]} rotation={[Math.PI / 2, 0, 0]} scale={[0.017, 0.034, 0.017]}>
          <coneGeometry args={[1, 1.6, 12]} />
          <meshStandardMaterial color={skinTone} roughness={SKIN_ROUGHNESS} />
        </mesh>
        {[-0.042, 0.042].map((x) => (
          <group key={x} position={[x, 1.704, 0.102]}>
            <mesh scale={[0.019, 0.011, 0.009]}>
              <sphereGeometry args={[1, 12, 8]} />
              <meshStandardMaterial color="#eef2f2" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.009]} scale={[0.0065, 0.0065, 0.004]}>
              <sphereGeometry args={[1, 10, 8]} />
              <meshStandardMaterial color="#303a37" roughness={0.24} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 1.625, 0.105]} scale={[0.035, 0.007, 0.008]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color="#7f493f" roughness={0.7} />
        </mesh>
        <Hair color={hairColor} style={hairStyle} />
      </group>

      {/* selected-person grounding light, kept subtle so the person remains human first */}
      <mesh
        ref={accent}
        position={[0, 0.015, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={accentMaterial}
        renderOrder={1}
      >
        <ringGeometry args={[0.28, 0.34, 64]} />
      </mesh>
    </group>
  );
}
