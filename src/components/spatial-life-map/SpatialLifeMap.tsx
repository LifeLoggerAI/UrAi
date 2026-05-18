"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLifeMapData } from "./useLifeMapData";
import { useGalaxyCamera } from "./useGalaxyCamera";
import { useLayerWheel } from "./useLayerWheel";
import { useStarSelection } from "./useStarSelection";
import LifeGalaxyScene from "./LifeGalaxyScene";
import LayerWheel from "./LayerWheel";
import ZoomLevelHUD from "./ZoomLevelHUD";
import StarPreviewCard from "./StarPreviewCard";
import MemoryBloomPanel from "./MemoryBloomPanel";
import ChapterRail from "./ChapterRail";
import SpatialControls from "./SpatialControls";
import type { LifeMapStar, MemoryBloom } from "@/lib/spatial-life-map/lifeMap.types";

type LifeMapInteractionMode = "galaxy" | "focus" | "replay" | "bloom";
type ReturnPhase = "idle" | "returning";

function FocusChamber({
  star,
  bloom,
  onReplay,
  onBloom,
  onClose,
}: {
  star: LifeMapStar;
  bloom: MemoryBloom | null;
  onReplay: () => void;
  onBloom: () => void;
  onClose: () => void;
}) {
  return (
    <section className="spatial-focus-chamber" role="dialog" aria-modal="false" aria-label={`${star.title} memory focus`}>
      <div className="spatial-focus-orb" style={{ background: star.auraColor, boxShadow: `0 0 120px ${star.auraColor}88, 0 0 240px ${star.auraColor}22` }} />
      <div className="spatial-focus-weather" aria-hidden />
      <button type="button" className="spatial-focus-close" onClick={onClose} aria-label="Return to full galaxy">×</button>
      <div className="spatial-focus-copy">
        <p>{star.type.replace(/([A-Z])/g, " $1").trim()} · {star.archetype}</p>
        <h2>{star.title}</h2>
        <span>{bloom?.whyThisMatters ?? star.narratorReflection}</span>
        <div className="spatial-focus-signals">
          <small>{star.emotionalTone}</small>
          <small>{star.sourceSignals.length} source signals</small>
          <small>{star.privacyLevel}</small>
        </div>
        <div className="spatial-focus-actions">
          <button type="button" onClick={onReplay}>Open replay</button>
          <button type="button" onClick={onBloom}>Open bloom</button>
          <button type="button" onClick={onClose}>Back to galaxy</button>
        </div>
      </div>
    </section>
  );
}

export default function SpatialLifeMap({ userId = "demo-user" }: { userId?: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<LifeMapInteractionMode>("galaxy");
  const [returnPhase, setReturnPhase] = useState<ReturnPhase>("idle");

  const { data, loading, error } = useLifeMapData(userId);
  const { activeLayerIds, activeLayers, toggleLayer, enableAll } = useLayerWheel(data.layers);
  const visibleStars = useMemo(() => data.stars.filter((star) => activeLayerIds.includes(star.layer)), [activeLayerIds, data.stars]);
  const selection = useStarSelection(visibleStars);
  const camera = useGalaxyCamera(data.spatialSettings.cameraTarget, data.spatialSettings.zoom);
  const selectedStar = selection.selectedStar;
  const previewStar = selection.hoveredStar ?? (mode === "galaxy" ? selectedStar : null);
  const bloomPanelData = data.memoryBlooms.find((bloom) => bloom.starId === selection.bloomStarId) ?? null;
  const selectedReplayBloom = selectedStar ? data.memoryBlooms.find((bloom) => bloom.starId === selectedStar.id) ?? null : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  function focusStar(star: typeof data.stars[number]) {
    selection.closeBloom();
    selection.selectStar(star);
    setMode("focus");
    camera.focusPosition(star.position3D, 3.55);
  }

  function openReplay() {
    if (!selectedStar || mode === "replay") return;
    selection.closeBloom();
    setMode("replay");
    camera.focusPosition(selectedStar.position3D, 2.55);
  }

  function openBloom(star?: typeof data.stars[number] | null) {
    const targetStar = star ?? selectedStar;
    if (!targetStar) return;
    selection.openBloom(targetStar);
    setMode("bloom");
    camera.focusPosition(targetStar.position3D, 3.05);
  }

  function closeBloom() {
    selection.closeBloom();
    setMode(selectedStar ? "focus" : "galaxy");
  }

  function returnToGalaxy() {
    selection.closeBloom();
    selection.setHoveredStarId(null);
    selection.setSelectedStarId(null);
    setMode("galaxy");
    camera.resetCamera();
  }

  function unwind() {
    if (returnPhase === "returning") return;

    if (mode === "replay") {
      setMode(selectedStar ? "focus" : "galaxy");
      return;
    }

    if (mode === "bloom" || selection.bloomStarId) {
      closeBloom();
      return;
    }

    if (selectedStar || mode === "focus") {
      returnToGalaxy();
      return;
    }

    returnHome();
  }

  function returnHome() {
    if (returnPhase === "returning") return;
    setReturnPhase("returning");
    selection.closeBloom();
    selection.setHoveredStarId(null);
    selection.setSelectedStarId(null);
    setMode("galaxy");
    camera.resetCamera();
    window.setTimeout(() => router.push("/"), 980);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      unwind();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!mounted) {
    return (
      <main className="spatial-life-map" aria-label="URAI Spatial Life Map Galaxy">
        <div className="spatial-atmosphere" aria-hidden />
        <section className="spatial-stage">
          <div className="spatial-canvas-placeholder" aria-hidden />
        </section>
      </main>
    );
  }

  return (
    <main className={`spatial-life-map is-${mode} return-${returnPhase}`} aria-label="URAI Spatial Life Map Galaxy">
      <div className="spatial-atmosphere" aria-hidden />
      <div className="spatial-cinematic-vignette" aria-hidden />
      <button type="button" className="spatial-home-gate" onClick={returnHome} aria-label="Return to the Inner Sky Shrine">
        <span>↩</span><strong>Home</strong>
      </button>

      <section className="spatial-stage" {...camera.bind}>
        <LifeGalaxyScene
          stars={data.stars}
          constellations={data.constellations}
          activeLayerIds={activeLayerIds}
          cameraState={camera.cameraState}
          selectedStarId={selection.selectedStarId}
          hoveredStarId={selection.hoveredStarId}
          reducedMotion={data.spatialSettings.reducedMotion}
          onHoverStar={selection.setHoveredStarId}
          onSelectStar={focusStar}
          onOpenStar={openBloom}
        />
      </section>

      <header className="spatial-title-card">
        <p>{mode === "galaxy" ? "URAI SPATIAL LIFE MAP" : mode === "focus" ? "MEMORY STAR FOCUS" : mode === "bloom" ? "MEMORY BLOOM" : "REPLAY THREAD"}</p>
        <h1>{mode === "replay" ? "Replay Thread" : selectedStar ? selectedStar.title : "Memory Galaxy"}</h1>
        <span>{mode === "galaxy" ? "Drag space · scroll to zoom · click a star · Esc returns home" : mode === "focus" ? "Focus held · replay or open bloom · Esc returns to galaxy" : mode === "bloom" ? "Symbolic bloom open · Esc returns to focus" : "Spatial replay active · Esc returns to focus"}</span>
      </header>

      {loading && <div className="spatial-loading">URAI is arranging your living galaxy...</div>}
      {error && <div className="spatial-error">{error}</div>}

      <LayerWheel layers={activeLayers} activeLayerIds={activeLayerIds} onToggle={toggleLayer} onEnableAll={enableAll} />
      <ZoomLevelHUD zoomLevel={camera.cameraState.zoomLevel} zoom={camera.cameraState.zoom} />

      {mode === "galaxy" && (
        <StarPreviewCard
          star={previewStar}
          mode={selection.hoveredStar ? "hover" : "selected"}
          onActivate={!selection.hoveredStar && selectedStar ? openReplay : undefined}
          actionLabel="Open replay"
        />
      )}

      {mode === "focus" && selectedStar && (
        <FocusChamber
          star={selectedStar}
          bloom={selectedReplayBloom}
          onReplay={openReplay}
          onBloom={() => openBloom(selectedStar)}
          onClose={returnToGalaxy}
        />
      )}

      <ChapterRail chapters={data.chapters} constellations={data.constellations} onFocusConstellation={(constellation) => camera.focusPosition(constellation.centerPosition, 5.2)} />

      <SpatialControls
        selectedStar={selectedStar}
        mode={mode}
        onReset={unwind}
        onZoomIn={() => camera.setZoom(camera.cameraState.zoom - 1.1)}
        onZoomOut={() => camera.setZoom(camera.cameraState.zoom + 1.1)}
        onBloom={() => openBloom(selectedStar)}
        onReplay={openReplay}
        replayDisabled={mode !== "focus" || !selectedStar}
      />

      <MemoryBloomPanel star={selection.bloomStar} bloom={bloomPanelData} onClose={closeBloom} />

      {mode === "replay" && selectedStar && (
        <section className="spatial-replay-overlay" role="dialog" aria-modal="true" aria-label={`${selectedStar.title} replay`}>
          <div className="spatial-replay-card">
            <div className="spatial-replay-orb" style={{ background: selectedStar.auraColor, boxShadow: `0 0 140px ${selectedStar.auraColor}99` }} />
            <p>REPLAY THREAD · SPATIALLY ANCHORED</p>
            <h2>{selectedStar.title}</h2>
            <span>{selectedReplayBloom?.narratorScript ?? selectedStar.narratorReflection}</span>
            <div className="spatial-replay-path" aria-hidden>
              <i />
            </div>
            <div className="spatial-replay-actions">
              <button type="button" onClick={unwind}>Back to focus</button>
              <button type="button" onClick={returnToGalaxy}>Back to galaxy</button>
            </div>
          </div>
        </section>
      )}

      {returnPhase === "returning" && (
        <div className="spatial-return-veil" aria-live="polite">
          <div className="spatial-return-orb" />
          <span>Returning to the Inner Sky Shrine</span>
        </div>
      )}
    </main>
  );
}
