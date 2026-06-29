"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import type { GalaxyCameraState, LifeMapConstellation, LifeMapLayerId, LifeMapStar } from "@/lib/spatial-life-map/lifeMap.types";
import GalaxyCameraController from "./GalaxyCameraController";
import StarField from "./StarField";
import NebulaBackdrop from "./NebulaBackdrop";
import LifeStar from "./LifeStar";
import ConstellationLines from "./ConstellationLines";
import LifeMapQuestInteractionLayer from "./LifeMapQuestInteraction";

type BrowserXR = {
  isSessionSupported?: (mode: "immersive-vr") => Promise<boolean>;
};

type NavigatorWithXR = Navigator & {
  xr?: BrowserXR;
};

interface LifeGalaxySceneProps {
  stars: LifeMapStar[];
  constellations: LifeMapConstellation[];
  activeLayerIds: LifeMapLayerId[];
  cameraState: GalaxyCameraState;
  selectedStarId: string | null;
  hoveredStarId: string | null;
  xrPanelStar?: LifeMapStar | null;
  activePath?: string;
  reducedMotion?: boolean;
  onHoverStar: (starId: string | null) => void;
  onSelectStar: (star: LifeMapStar) => void;
  onOpenStar: (star: LifeMapStar) => void;
  onCloseStarPanel?: () => void;
  onNavigate?: (href: string) => void;
  onSceneReady?: () => void;
}

function SceneReadyBeacon({ onReady }: { onReady?: () => void }) {
  const didSignal = useRef(false);

  useFrame(() => {
    if (!onReady || didSignal.current) return;
    didSignal.current = true;
    onReady();
  });

  return null;
}

function WebXREntryButton() {
  const { gl } = useThree();

  useEffect(() => {
    let cancelled = false;
    let button: HTMLElement | null = null;
    gl.xr.enabled = true;

    const removeExistingButton = () => {
      const existing = document.querySelector(".urai-xr-entry-button");
      if (existing) existing.remove();
    };

    const mountSupportedButton = async () => {
      removeExistingButton();

      const xr = (navigator as NavigatorWithXR).xr;
      if (!window.isSecureContext || !xr?.isSessionSupported) {
        return;
      }

      try {
        const immersiveVrSupported = await xr.isSessionSupported("immersive-vr");
        if (cancelled || !immersiveVrSupported) return;

        button = VRButton.createButton(gl);
        button.classList.add("urai-xr-entry-button");
        button.setAttribute("aria-label", "Enter spatial Life Map");
        document.body.appendChild(button);
      } catch {
        removeExistingButton();
      }
    };

    void mountSupportedButton();

    return () => {
      cancelled = true;
      button?.remove();
    };
  }, [gl]);

  return null;
}

function EmotionalLightField({ selectedStar }: { selectedStar?: LifeMapStar }) {
  const color = selectedStar?.auraColor ?? "#7dd3fc";
  return (
    <>
      <ambientLight intensity={0.48} color="#dffaff" />
      <hemisphereLight args={["#c9f6ff", "#020617", 0.62]} />
      <pointLight position={[0, 1.8, 4.6]} intensity={3.4} color={color} distance={18} />
      <pointLight position={[-5.6, -1.6, 2.8]} intensity={1.25} color="#c4b5fd" distance={18} />
      <pointLight position={[5.2, 0.9, -2.4]} intensity={0.85} color="#fde68a" distance={16} />
      <directionalLight position={[2, 7, 5]} intensity={1.35} color="#f8fbff" />
    </>
  );
}

function DepthReferencePlanes() {
  return (
    <group rotation={[0.2, -0.18, -0.08]}>
      <mesh position={[0, -1.42, -7.6]} rotation={[Math.PI / 2.28, 0, -0.08]}>
        <ringGeometry args={[4.2, 4.22, 220]} />
        <meshBasicMaterial color="#9be7ff" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.4, -1.55, -8.8]} rotation={[Math.PI / 2.18, 0.05, 0.22]}>
        <ringGeometry args={[6.8, 6.82, 260]} />
        <meshBasicMaterial color="#c7a0ff" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.4, -1.7, -10.6]} rotation={[Math.PI / 2.08, -0.04, -0.24]}>
        <ringGeometry args={[9.6, 9.62, 300]} />
        <meshBasicMaterial color="#ffe58a" transparent opacity={0.045} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function LifeGalaxyScene({
  stars,
  constellations,
  activeLayerIds,
  cameraState,
  selectedStarId,
  hoveredStarId,
  xrPanelStar = null,
  activePath = "/life-map",
  reducedMotion = false,
  onHoverStar,
  onSelectStar,
  onOpenStar,
  onCloseStarPanel,
  onNavigate,
  onSceneReady,
}: LifeGalaxySceneProps) {
  const visibleStars = stars.filter((star) => activeLayerIds.includes(star.layer));
  const selectedStar = stars.find((star) => star.id === selectedStarId) ?? null;

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
      camera={{ position: [0, 2.2, cameraState.zoom], fov: 47, near: 0.03, far: 120 }}
      className="spatial-canvas"
    >
      <WebXREntryButton />
      <SceneReadyBeacon onReady={onSceneReady} />
      <color attach="background" args={["#00030b"]} />
      <fog attach="fog" args={["#030b18", 5.5, 38]} />
      <GalaxyCameraController cameraState={cameraState} reducedMotion={reducedMotion} />
      <EmotionalLightField selectedStar={selectedStar ?? undefined} />
      <NebulaBackdrop reducedMotion={reducedMotion} />
      <DepthReferencePlanes />
      <StarField reducedMotion={reducedMotion} />
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
      <LifeMapQuestInteractionLayer
        stars={visibleStars}
        selectedStar={xrPanelStar}
        activePath={activePath}
        onHoverStar={onHoverStar}
        onSelectStar={onSelectStar}
        onClosePanel={onCloseStarPanel ?? (() => {})}
        onNavigate={onNavigate ?? (() => {})}
      />
    </Canvas>
  );
}
