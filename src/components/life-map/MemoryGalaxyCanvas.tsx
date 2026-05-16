"use client";

import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { CameraKeyframe, LifeMapFilter, LifeMapMode, MemoryStar, NebulaRegion, QualityMode, RelationshipBody, Vector3D } from "@/lib/life-map/types";
import { cameraPaths, resolveEasing } from "@/lib/life-map/camera-paths";
import { lifeMapMockData } from "@/lib/life-map/mock-data";
import { mapMemoryToPosition, mapPrivacyToRenderBehavior, mapStarTypeToVisual } from "@/lib/life-map/visual-mapping";

type CameraCommand = "idle" | "replay" | "mirror" | "recenter" | "focus";

interface MemoryGalaxyCanvasProps {
  mode: LifeMapMode;
  qualityMode: QualityMode;
  activeFilter: LifeMapFilter;
  selectedStarId: string;
  reducedMotion: boolean;
  highContrast: boolean;
  hiddenStarIds: string[];
  blurredStarIds: string[];
  onSelectStar: (star: MemoryStar) => void;
  onOpenStar: (star: MemoryStar) => void;
  cameraCommand: CameraCommand;
  onCameraCommandComplete: () => void;
}

const filterToStarTypes: Partial<Record<LifeMapFilter, string[]>> = {
  Becoming: ["memory", "purpose", "companion"],
  Threshold: ["threshold"],
  Recovery: ["recovery", "ritual"],
  Relationships: ["relationship", "companion"],
  "Dream Field": ["dream"],
  Mirror: ["mirror"],
  Grief: ["grief"],
  Joy: ["joy"],
  Purpose: ["purpose"],
  Conflict: ["shadow", "memory"],
  Legacy: ["legacy"],
  Shadow: ["shadow"],
  Rebirth: ["rebirth"],
};

function v3(v: Vector3D): [number, number, number] {
  return [v.x, v.y, v.z];
}

function AnimatedCamera({ command, selectedStar, reducedMotion, onDone }: { command: CameraCommand; selectedStar?: MemoryStar; reducedMotion: boolean; onDone: () => void }) {
  const { camera } = useThree();
  const animation = useRef<{ frames: CameraKeyframe[]; frameIndex: number; startedAt: number; fromPos: THREE.Vector3; fromTarget: THREE.Vector3 } | null>(null);
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    let frames: CameraKeyframe[] | undefined;
    if (command === "replay") frames = cameraPaths.replay;
    if (command === "mirror") frames = cameraPaths.mirror;
    if (command === "recenter") frames = cameraPaths.opening;
    if (command === "focus" && selectedStar) {
      const target = mapMemoryToPosition(selectedStar, "memoryGalaxy");
      frames = [{ position: { x: target.x + 1.7, y: target.y + 1.1, z: target.z + 4.8 }, target, durationMs: 950, easing: "easeInOutCubic" }];
    }
    if (!frames) return;
    if (reducedMotion) {
      const last = frames[frames.length - 1];
      camera.position.set(last.position.x, last.position.y, last.position.z);
      camera.lookAt(last.target.x, last.target.y, last.target.z);
      onDone();
      return;
    }
    animation.current = { frames, frameIndex: 0, startedAt: performance.now(), fromPos: camera.position.clone(), fromTarget: targetRef.current.clone() };
  }, [camera, command, onDone, reducedMotion, selectedStar]);

  useFrame(() => {
    if (!animation.current) return;
    const current = animation.current.frames[animation.current.frameIndex];
    const progress = Math.min(1, (performance.now() - animation.current.startedAt) / current.durationMs);
    const eased = resolveEasing(current.easing)(progress);
    const nextPos = new THREE.Vector3(current.position.x, current.position.y, current.position.z);
    const nextTarget = new THREE.Vector3(current.target.x, current.target.y, current.target.z);
    camera.position.copy(animation.current.fromPos.clone().lerp(nextPos, eased));
    const liveTarget = animation.current.fromTarget.clone().lerp(nextTarget, eased);
    camera.lookAt(liveTarget);
    targetRef.current.copy(liveTarget);
    if (progress < 1) return;
    const nextIndex = animation.current.frameIndex + 1;
    if (nextIndex >= animation.current.frames.length) {
      animation.current = null;
      onDone();
    } else {
      animation.current = { ...animation.current, frameIndex: nextIndex, startedAt: performance.now(), fromPos: camera.position.clone(), fromTarget: targetRef.current.clone() };
    }
  });

  return null;
}

function MemoryStarMesh({ star, mode, selected, hidden, blurred, highContrast, reducedMotion, onSelectStar, onOpenStar }: { star: MemoryStar; mode: LifeMapMode; selected: boolean; hidden: boolean; blurred: boolean; highContrast: boolean; reducedMotion: boolean; onSelectStar: (star: MemoryStar) => void; onOpenStar: (star: MemoryStar) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const visual = mapStarTypeToVisual(star.type);
  const position = mapMemoryToPosition(star, mode);
  const privacy = mapPrivacyToRenderBehavior(blurred ? "blurred" : star.privacyLevel);

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;
    const pulse = Math.sin(state.clock.elapsedTime * visual.pulseSpeed * 2) * 0.06;
    meshRef.current.scale.setScalar(star.scale + pulse + (hovered ? 0.16 : 0) + (selected ? 0.18 : 0));
  });

  if (hidden || !privacy.visible) return null;

  const color = highContrast ? "#ffffff" : visual.color || star.color;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelectStar(star);
  };

  const handleDoubleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onOpenStar(star);
  };

  return (
    <group position={v3(position)}>
      <mesh ref={meshRef} onClick={handleClick} onDoubleClick={handleDoubleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? visual.glowIntensity * 2 : visual.glowIntensity} transparent opacity={privacy.blur ? 0.32 : 0.95} />
      </mesh>
      {(selected || hovered) && (
        <mesh scale={star.scale * (selected ? 2.7 : 2.1)}>
          <sphereGeometry args={[0.13, 32, 32]} />
          <meshBasicMaterial color={color} transparent opacity={selected ? 0.16 : 0.09} />
        </mesh>
      )}
      {visual.particleTrail && !reducedMotion && selected && <Line points={[[0, 0, 0], [-0.35, 0.12, -0.18], [-0.8, 0.04, -0.35]]} color={color} transparent opacity={0.45} lineWidth={1.5} />}
      {selected && (
        <Html center distanceFactor={8} position={[0, 0.55, 0]}>
          <div className="pointer-events-none rounded-2xl border border-cyan-100/25 bg-slate-950/70 px-4 py-2 text-center shadow-[0_0_30px_rgba(191,233,255,0.25)] backdrop-blur-xl">
            <div className="text-sm font-semibold tracking-wide text-cyan-50">{star.title}</div>
            <div className="text-xs text-cyan-100/70">{star.subtitle}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function NebulaField({ nebula, qualityMode, reducedMotion }: { nebula: NebulaRegion; qualityMode: QualityMode; reducedMotion: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current || reducedMotion) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
  });
  if (qualityMode === "low") return null;
  return (
    <mesh ref={ref} position={v3(nebula.position3D)} scale={nebula.radius}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={nebula.color} transparent opacity={qualityMode === "cinematic" ? 0.09 : 0.05} depthWrite={false} />
    </mesh>
  );
}

function RelationshipBodyMesh({ body, reducedMotion }: { body: RelationshipBody; reducedMotion: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current || reducedMotion) return;
    ref.current.rotation.y = state.clock.elapsedTime * body.orbitSpeed;
  });
  return (
    <group ref={ref}>
      <mesh position={[body.orbitRadius, body.position3D.y, body.position3D.z]}>
        <sphereGeometry args={[0.075 + body.strength * 0.04, 24, 24]} />
        <meshStandardMaterial color={body.color} emissive={body.color} emissiveIntensity={0.8} transparent opacity={body.associationVisible ? 0.78 : 0.22} />
      </mesh>
      <Line points={Array.from({ length: 80 }, (_, i) => { const a = (i / 79) * Math.PI * 2; return [Math.cos(a) * body.orbitRadius, body.position3D.y, Math.sin(a) * body.orbitRadius] as [number, number, number]; })} color={body.color} transparent opacity={0.12} lineWidth={1} />
    </group>
  );
}

function ConstellationLines({ visibleStars, activeFilter, reducedMotion }: { visibleStars: MemoryStar[]; activeFilter: LifeMapFilter; reducedMotion: boolean }) {
  const byId = new Map(visibleStars.map((star) => [star.id, star]));
  return (
    <group>
      {lifeMapMockData.lifeConstellations.filter((thread) => activeFilter === "All" || thread.theme === activeFilter).map((thread) => {
        const points = thread.starIds.map((id) => byId.get(id)).filter(Boolean).map((star) => v3(mapMemoryToPosition(star as MemoryStar, "memoryGalaxy")));
        if (points.length < 2) return null;
        return <Line key={thread.id} points={points} color={thread.lineColor} transparent opacity={reducedMotion ? 0.26 : thread.lineOpacity} lineWidth={1.2} />;
      })}
    </group>
  );
}

function Scene(props: MemoryGalaxyCanvasProps) {
  const selectedStar = lifeMapMockData.memoryStars.find((star) => star.id === props.selectedStarId);
  const visibleStars = useMemo(() => {
    const allowed = filterToStarTypes[props.activeFilter] || [];
    return lifeMapMockData.memoryStars.filter((star) => allowed.length === 0 || allowed.includes(star.type) || star.emotionalTags.some((tag) => tag.toLowerCase().includes(props.activeFilter.toLowerCase())));
  }, [props.activeFilter]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.4, 8.2]} fov={58} />
      <AnimatedCamera command={props.cameraCommand} selectedStar={selectedStar} reducedMotion={props.reducedMotion} onDone={props.onCameraCommandComplete} />
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 4, 4]} intensity={1.1} color="#bfe9ff" />
      {props.qualityMode !== "low" && <Stars radius={70} depth={42} count={props.qualityMode === "cinematic" ? 4200 : 1800} factor={4} saturation={0} fade speed={props.reducedMotion ? 0 : 0.35} />}
      {lifeMapMockData.nebulaRegions.map((nebula) => <NebulaField key={nebula.id} nebula={nebula} qualityMode={props.qualityMode} reducedMotion={props.reducedMotion} />)}
      <ConstellationLines visibleStars={visibleStars} activeFilter={props.activeFilter} reducedMotion={props.reducedMotion} />
      {lifeMapMockData.relationshipBodies.map((body) => <RelationshipBodyMesh key={body.id} body={body} reducedMotion={props.reducedMotion} />)}
      {visibleStars.map((star) => (
        <MemoryStarMesh key={star.id} star={star} mode={props.mode} selected={star.id === props.selectedStarId} hidden={props.hiddenStarIds.includes(star.id)} blurred={props.blurredStarIds.includes(star.id)} highContrast={props.highContrast} reducedMotion={props.reducedMotion} onSelectStar={props.onSelectStar} onOpenStar={props.onOpenStar} />
      ))}
      <OrbitControls enableDamping={!props.reducedMotion} dampingFactor={0.08} enablePan enableZoom maxDistance={14} minDistance={2.4} />
    </>
  );
}

export default function MemoryGalaxyCanvas(props: MemoryGalaxyCanvasProps) {
  if (props.qualityMode === "low") {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(14,165,233,0.20),transparent_34%),linear-gradient(180deg,#020617,#020617_55%,#08111f)]">
        <Canvas dpr={[1, 1.25]} gl={{ antialias: false, alpha: true }}>
          <Suspense fallback={null}><Scene {...props} /></Suspense>
        </Canvas>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_42%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_68%_22%,rgba(168,85,247,0.14),transparent_26%),linear-gradient(180deg,#020617,#030712_62%,#07111f)]">
      <Canvas dpr={props.qualityMode === "cinematic" ? [1, 2] : [1, 1.5]} gl={{ antialias: props.qualityMode !== "medium", alpha: true }}>
        <Suspense fallback={null}><Scene {...props} /></Suspense>
      </Canvas>
    </div>
  );
}
