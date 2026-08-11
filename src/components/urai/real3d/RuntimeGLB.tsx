"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Hash-reviewed / deterministic spatial authority paths vendored from urai-spatial.
 * These are the primary runtime models for the realism pass.
 */
export const URAI_SPATIAL_AUTHORITY = {
  home: "/assets/urai/generated/models/home-entry-chamber-v1.glb",
  orb: "/assets/urai/generated/models/urai-orb-avatar-v1.glb",
  portal: "/assets/urai/generated/models/portal-ring-master-v1.glb",
  fern: "/assets/urai/home-production/cc0/polyhaven-fern-02-geometry-v1.glb",
  councilChamber: "/assets/urai/generated/real-world-v1/council-chamber-real-v1.glb",
  councilGuide: "/assets/urai/generated/real-world-v1/council-guide-human-v1.glb",
  councilMirror: "/assets/urai/generated/real-world-v1/council-mirror-human-v1.glb",
  councilGuardian: "/assets/urai/generated/real-world-v1/council-guardian-human-v1.glb",
  councilArchivist: "/assets/urai/generated/real-world-v1/council-archivist-human-v1.glb",
  councilBuilder: "/assets/urai/generated/real-world-v1/council-builder-human-v1.glb",
  councilTrickster: "/assets/urai/generated/real-world-v1/council-trickster-human-v1.glb",
  shadow: "/assets/urai/generated/real-world-v1/shadow-hall-real-v1.glb",
  mirror: "/assets/urai/generated/real-world-v1/mirror-chamber-real-v1.glb",
  legacy: "/assets/urai/generated/real-world-v1/legacy-archive-real-v1.glb",
} as const;

/** Controlled fallback/gap-fill models. These are not the primary accepted authority. */
export const URAI_REAL_3D = {
  human: "/assets/urai/real-3d/urai-human-base-v1.glb",
  home: "/assets/urai/real-3d/urai-home-world-v1.glb",
  councilChamber: "/assets/urai/real-3d/urai-council-chamber-v1.glb",
  councilScene: "/assets/urai/real-3d/urai-council-scene-v1.glb",
  shadow: "/assets/urai/real-3d/urai-shadow-world-v1.glb",
  mirror: "/assets/urai/real-3d/urai-mirror-world-v1.glb",
  legacy: "/assets/urai/real-3d/urai-legacy-world-v1.glb",
} as const;

type Vec3 = [number, number, number];

type RuntimeGLBProps = {
  src: string;
  name?: string;
  position?: Vec3;
  rotation?: Vec3;
  scale?: number | Vec3;
  castShadow?: boolean;
  receiveShadow?: boolean;
  onClick?: () => void;
};

function cloneScene(source: THREE.Group, castShadow: boolean, receiveShadow: boolean) {
  const clone = source.clone(true);
  clone.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) return;
    node.castShadow = castShadow;
    node.receiveShadow = receiveShadow;
    node.frustumCulled = true;
    if (Array.isArray(node.material)) node.material = node.material.map((m) => m.clone());
    else if (node.material) node.material = node.material.clone();
  });
  return clone;
}

export function RuntimeGLB({
  src,
  name = "urai-runtime-glb",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  castShadow = true,
  receiveShadow = true,
  onClick,
}: RuntimeGLBProps) {
  const { scene } = useGLTF(src);
  const model = useMemo(() => cloneScene(scene, castShadow, receiveShadow), [scene, castShadow, receiveShadow]);
  const finalScale: Vec3 = typeof scale === "number" ? [scale, scale, scale] : scale;

  return (
    <primitive
      name={name}
      object={model}
      position={position}
      rotation={rotation}
      scale={finalScale}
      onClick={onClick ? (event) => { event.stopPropagation(); onClick(); } : undefined}
    />
  );
}

type AnimatedRuntimeGLBProps = RuntimeGLBProps & {
  clip?: string;
  loop?: boolean;
  fadeSeconds?: number;
};

export function AnimatedRuntimeGLB({
  src,
  name = "urai-animated-runtime-glb",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  castShadow = true,
  receiveShadow = true,
  onClick,
  clip,
  loop = true,
  fadeSeconds = 0.3,
}: AnimatedRuntimeGLBProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(src);
  const model = useMemo(() => cloneScene(scene, castShadow, receiveShadow), [scene, castShadow, receiveShadow]);
  const { actions } = useAnimations(animations, group);
  const finalScale: Vec3 = typeof scale === "number" ? [scale, scale, scale] : scale;

  useEffect(() => {
    if (!clip) return;
    const action = actions[clip];
    if (!action) return;
    action.reset();
    action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
    action.clampWhenFinished = !loop;
    action.fadeIn(fadeSeconds).play();
    return () => { action.fadeOut(fadeSeconds); };
  }, [actions, clip, fadeSeconds, loop]);

  return (
    <group
      ref={group}
      name={name}
      position={position}
      rotation={rotation}
      scale={finalScale}
      onClick={onClick ? (event) => { event.stopPropagation(); onClick(); } : undefined}
    >
      <primitive object={model} />
    </group>
  );
}

type HumanGLBPresenceProps = {
  name: string;
  position: Vec3;
  rotation?: Vec3;
  scale?: number;
  skinTone?: string;
  hairColor?: string;
  shirtColor?: string;
  trouserColor?: string;
  shoeColor?: string;
  active?: boolean;
  accentColor?: string;
  onSelect?: () => void;
};

function recolorMaterial(material: THREE.Material, colors: Required<Pick<HumanGLBPresenceProps, "skinTone" | "hairColor" | "shirtColor" | "trouserColor" | "shoeColor">>) {
  if (!(material instanceof THREE.MeshStandardMaterial)) return;
  const n = material.name.toLowerCase();
  if (n.includes("skin")) material.color.set(colors.skinTone);
  else if (n.includes("hair")) material.color.set(colors.hairColor);
  else if (n.includes("cloth-blue") || n.includes("cloth-gray") || n.includes("cloth-warm")) material.color.set(colors.shirtColor);
  else if (n.includes("trouser")) material.color.set(colors.trouserColor);
  else if (n.includes("shoe")) material.color.set(colors.shoeColor);
  material.needsUpdate = true;
}

/**
 * Fallback human bridge retained for non-Council surfaces. Council now uses six
 * independent real-world-v1 GLBs from URAI_SPATIAL_AUTHORITY.
 */
export function HumanGLBPresence({
  name,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  skinTone = "#b8795e",
  hairColor = "#241a15",
  shirtColor = "#2c3d50",
  trouserColor = "#25292e",
  shoeColor = "#171718",
  active = false,
  accentColor = "#8ed7ff",
  onSelect,
}: HumanGLBPresenceProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(URAI_REAL_3D.human);
  const model = useMemo(() => {
    const clone = cloneScene(scene, true, true);
    clone.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      if (Array.isArray(node.material)) node.material.forEach((m) => recolorMaterial(m, { skinTone, hairColor, shirtColor, trouserColor, shoeColor }));
      else if (node.material) recolorMaterial(node.material, { skinTone, hairColor, shirtColor, trouserColor, shoeColor });
    });
    return clone;
  }, [scene, skinTone, hairColor, shirtColor, trouserColor, shoeColor]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.position.y = position[1] + Math.sin(t * 1.25) * 0.0045;
    group.current.rotation.y = rotation[1] + Math.sin(t * 0.27) * 0.006;
  });

  return (
    <group
      ref={group}
      name={name}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onSelect ? (event) => { event.stopPropagation(); onSelect(); } : undefined}
      userData={{ representation: "generated-glb-human-v1-fallback", replaceableByScanGradeHuman: true, nominalHeightMeters: 1.82 }}
    >
      <primitive object={model} />
      <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={active}>
        <ringGeometry args={[0.28, 0.34, 64]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.32} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

Object.values(URAI_SPATIAL_AUTHORITY).forEach((src) => useGLTF.preload(src));
