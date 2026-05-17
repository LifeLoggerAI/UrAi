"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import type { GalaxyCameraState, LifeMapConstellation, LifeMapLayerId, LifeMapStar } from "@/lib/spatial-life-map/lifeMap.types";
import GalaxyCameraController from "./GalaxyCameraController";
import StarField from "./StarField";
import NebulaBackdrop from "./NebulaBackdrop";
import LifeStar from "./LifeStar";
import ConstellationLines from "./ConstellationLines";

interface LifeGalaxySceneProps {
  stars: LifeMapStar[];
  constellations: LifeMapConstellation[];
  activeLayerIds: LifeMapLayerId[];
  cameraState: GalaxyCameraState;
  selectedStarId: string | null;
  hoveredStarId: string | null;
  reducedMotion?: boolean;
  onHoverStar: (starId: string | null) => void;
  onSelectStar: (star: LifeMapStar) => void;
  onOpenStar: (star: LifeMapStar) => void;
}

function EmotionalLightField({ selectedStar }: { selectedStar?: LifeMapStar }) {
  const color = selectedStar?.auraColor ?? "#7dd3fc";
  return (
    <>
      <ambientLight intensity={0.36} color="#c7f6ff" />
      <pointLight position={[0, 1.5, 3.5]} intensity={2.2} color={color} distance={14} />
      <pointLight position={[-4, -2, 4]} intensity={0.7} color="#c4b5fd" distance={12} />
      <directionalLight position={[2, 6, 4]} intensity={1.1} color="#f8fbff" />
    </>
  );
}

export default function LifeGalaxyScene({ stars, constellations, activeLayerIds, cameraState, selectedStarId, hoveredStarId, reducedMotion = false, onHoverStar, onSelectStar, onOpenStar }: LifeGalaxySceneProps) {
  const visibleStars = stars.filter((star) => activeLayerIds.includes(star.layer));
  const selectedStar = stars.find((star) => star.id === selectedStarId) ?? null;

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ position: [0, 2, cameraState.zoom], fov: 50, near: 0.05, far: 90 }}
      className="spatial-canvas"
    >
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#051020", 7, 26]} />
      <GalaxyCameraController cameraState={cameraState} reducedMotion={reducedMotion} />
      <EmotionalLightField selectedStar={selectedStar ?? undefined} />
      <StarField reducedMotion={reducedMotion} />
      <NebulaBackdrop reducedMotion={reducedMotion} />
      <ConstellationLines stars={visibleStars} constellations={constellations} selectedConstellationId={selectedStar?.constellationId ?? null} />
      {visibleStars.map((star) => (
        <LifeStar
          key={star.id}
          star={star}
          selected={star.id === selectedStarId}
          hovered={star.id === hoveredStarId}
          dimmed={Boolean(selectedStarId && star.id !== selectedStarId && star.constellationId !== selectedStar?.constellationId)}
          onHover={onHoverStar}
          onSelect={onSelectStar}
          onOpen={onOpenStar}
        />
      ))}
    </Canvas>
  );
}
