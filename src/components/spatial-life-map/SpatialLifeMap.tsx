"use client";

import { useEffect, useMemo, useState } from "react";
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

type LifeMapInteractionMode = "galaxy" | "focus" | "replay" | "bloom";

export default function SpatialLifeMap({ userId = "demo-user" }: { userId?: string }) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<LifeMapInteractionMode>("galaxy");

  const { data, loading, error } = useLifeMapData(userId);
  const { activeLayerIds, activeLayers, toggleLayer, enableAll } = useLayerWheel(data.layers);
  const visibleStars = useMemo(() => data.stars.filter((star) => activeLayerIds.includes(star.layer)), [activeLayerIds, data.stars]);
  const selection = useStarSelection(visibleStars);
  const camera = useGalaxyCamera(data.spatialSettings.cameraTarget, data.spatialSettings.zoom);
  const selectedStar = selection.selectedStar;
  const previewStar = selection.hoveredStar ?? selectedStar;
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

  function unwind() {
    if (mode === "replay") {
      setMode(selectedStar ? "focus" : "galaxy");
      return;
    }

    if (mode === "bloom" || selection.bloomStarId) {
      closeBloom();
      return;
    }

    if (selectedStar || mode === "focus") {
      selection.setHoveredStarId(null);
      selection.setSelectedStarId(null);
      setMode("galaxy");
      camera.resetCamera();
      return;
    }

    camera.resetCamera();
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
    <main className={`spatial-life-map is-${mode}`} aria-label="URAI Spatial Life Map Galaxy">
      <div className="spatial-atmosphere" aria-hidden />
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
        <p>{mode === "galaxy" ? "URAI SPATIAL LIFE MAP" : mode.toUpperCase()}</p>
        <h1>{mode === "replay" ? "Replay Thread" : selectedStar ? selectedStar.title : "Memory Galaxy"}</h1>
        <span>{visibleStars.length} active stars · {data.constellations.length} constellations · click star · click focus · Esc unwind</span>
      </header>

      {loading && <div className="spatial-loading">URAI is arranging your living galaxy...</div>}
      {error && <div className="spatial-error">{error}</div>}

      <LayerWheel layers={activeLayers} activeLayerIds={activeLayerIds} onToggle={toggleLayer} onEnableAll={enableAll} />
      <ZoomLevelHUD zoomLevel={camera.cameraState.zoomLevel} zoom={camera.cameraState.zoom} />

      {mode !== "replay" && mode !== "bloom" && (
        <StarPreviewCard
          star={previewStar}
          mode={selection.hoveredStar ? "hover" : "selected"}
          onActivate={!selection.hoveredStar && mode === "focus" && selectedStar ? openReplay : undefined}
          actionLabel="Open replay"
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
          <div className="spatial-replay-orb" style={{ background: selectedStar.auraColor, boxShadow: `0 0 140px ${selectedStar.auraColor}99` }} />
          <p>REPLAY THREAD · SPATIALLY ANCHORED</p>
          <h2>{selectedStar.title}</h2>
          <span>{selectedReplayBloom?.narratorScript ?? selectedStar.narratorReflection}</span>
          <div className="spatial-replay-path" aria-hidden>
            <i />
          </div>
          <button type="button" onClick={unwind}>Esc / unwind to focus</button>
        </section>
      )}
    </main>
  );
}
