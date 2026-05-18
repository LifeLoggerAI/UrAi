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

export default function SpatialLifeMap({ userId = "demo-user" }: { userId?: string }) {
  const [mounted, setMounted] = useState(false);
  const [replaying, setReplaying] = useState(false);

  const { data, loading, error } = useLifeMapData(userId);
  const { activeLayerIds, activeLayers, toggleLayer, enableAll } = useLayerWheel(data.layers);
  const visibleStars = useMemo(() => data.stars.filter((star) => activeLayerIds.includes(star.layer)), [activeLayerIds, data.stars]);
  const selection = useStarSelection(visibleStars);
  const camera = useGalaxyCamera(data.spatialSettings.cameraTarget, data.spatialSettings.zoom);
  const selectedBloom = data.memoryBlooms.find((bloom) => bloom.starId === selection.bloomStarId) ?? null;
  const selectedStar = selection.selectedStar;
  const previewStar = selection.hoveredStar ?? selectedStar;

  useEffect(() => {
    setMounted(true);
  }, []);

  function selectStar(star: typeof data.stars[number]) {
    setReplaying(false);
    selection.closeBloom();
    selection.selectStar(star);
    camera.focusPosition(star.position3D, 3.8);
  }

  function openReplay() {
    if (!selectedStar) return;
    selection.closeBloom();
    setReplaying(true);
    camera.focusPosition(selectedStar.position3D, 2.65);
  }

  function unwind() {
    if (replaying) {
      setReplaying(false);
      return;
    }

    if (selection.bloomStarId) {
      selection.closeBloom();
      return;
    }

    selection.setHoveredStarId(null);
    selection.setSelectedStarId(null);
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
    <main className={`spatial-life-map ${selectedStar ? "is-focused" : ""} ${replaying ? "is-replaying" : ""}`} aria-label="URAI Spatial Life Map Galaxy">
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
          onSelectStar={selectStar}
          onOpenStar={selection.openBloom}
        />
      </section>

      <header className="spatial-title-card">
        <p>URAI SPATIAL LIFE MAP</p>
        <h1>{replaying ? "Replay Thread" : selectedStar ? selectedStar.title : "Memory Galaxy"}</h1>
        <span>{visibleStars.length} active stars · {data.constellations.length} constellations · click star · click focus · Esc unwind</span>
      </header>

      {loading && <div className="spatial-loading">URAI is arranging your living galaxy...</div>}
      {error && <div className="spatial-error">{error}</div>}

      <LayerWheel layers={activeLayers} activeLayerIds={activeLayerIds} onToggle={toggleLayer} onEnableAll={enableAll} />
      <ZoomLevelHUD zoomLevel={camera.cameraState.zoomLevel} zoom={camera.cameraState.zoom} />

      {!replaying && (
        <StarPreviewCard
          star={previewStar}
          mode={selection.hoveredStar ? "hover" : "selected"}
          onActivate={!selection.hoveredStar && selectedStar ? openReplay : undefined}
          actionLabel="Open replay"
        />
      )}

      <ChapterRail chapters={data.chapters} constellations={data.constellations} onFocusConstellation={(constellation) => camera.focusPosition(constellation.centerPosition, 5.2)} />

      <SpatialControls
        selectedStar={selectedStar}
        onReset={unwind}
        onZoomIn={() => camera.setZoom(camera.cameraState.zoom - 1.1)}
        onZoomOut={() => camera.setZoom(camera.cameraState.zoom + 1.1)}
        onBloom={() => selection.openBloom(selectedStar)}
        onReplay={openReplay}
        replayDisabled={!selectedStar}
      />

      <MemoryBloomPanel star={selection.bloomStar} bloom={selectedBloom} onClose={selection.closeBloom} />

      {replaying && selectedStar && (
        <section className="spatial-replay-overlay" role="dialog" aria-modal="true" aria-label={`${selectedStar.title} replay`}>
          <div className="spatial-replay-orb" style={{ background: selectedStar.auraColor, boxShadow: `0 0 120px ${selectedStar.auraColor}88` }} />
          <p>REPLAY THREAD · SPATIALLY ANCHORED</p>
          <h2>{selectedStar.title}</h2>
          <span>{selectedBloom?.narratorScript ?? selectedStar.narratorReflection}</span>
          <div className="spatial-replay-path" aria-hidden>
            <i />
          </div>
          <button type="button" onClick={unwind}>Esc / unwind to focus</button>
        </section>
      )}
    </main>
  );
}
