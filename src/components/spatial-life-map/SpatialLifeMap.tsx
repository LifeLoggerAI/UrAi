"use client";

import { useMemo } from "react";
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
  const { data, loading, error } = useLifeMapData(userId);
  const { activeLayerIds, activeLayers, toggleLayer, enableAll } = useLayerWheel(data.layers);
  const visibleStars = useMemo(() => data.stars.filter((star) => activeLayerIds.includes(star.layer)), [activeLayerIds, data.stars]);
  const selection = useStarSelection(visibleStars);
  const camera = useGalaxyCamera(data.spatialSettings.cameraTarget, data.spatialSettings.zoom);
  const selectedBloom = data.memoryBlooms.find((bloom) => bloom.starId === selection.bloomStarId) ?? null;

  function selectStar(star: typeof data.stars[number]) {
    selection.selectStar(star);
    camera.focusPosition(star.position3D, 3.8);
  }

  return (
    <main className="spatial-life-map" aria-label="URAI Spatial Life Map Galaxy">
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
        <h1>Memory Galaxy</h1>
        <span>{visibleStars.length} active stars · {data.constellations.length} constellations · drag, wheel, tap</span>
      </header>

      {loading && <div className="spatial-loading">URAI is arranging your living galaxy...</div>}
      {error && <div className="spatial-error">{error}</div>}

      <LayerWheel layers={activeLayers} activeLayerIds={activeLayerIds} onToggle={toggleLayer} onEnableAll={enableAll} />
      <ZoomLevelHUD zoomLevel={camera.cameraState.zoomLevel} zoom={camera.cameraState.zoom} />
      <StarPreviewCard star={selection.hoveredStar ?? selection.selectedStar} mode={selection.hoveredStar ? "hover" : "selected"} />
      <ChapterRail chapters={data.chapters} constellations={data.constellations} onFocusConstellation={(constellation) => camera.focusPosition(constellation.centerPosition, 5.2)} />
      <SpatialControls selectedStar={selection.selectedStar} onReset={camera.resetCamera} onZoomIn={() => camera.setZoom(camera.cameraState.zoom - 1.1)} onZoomOut={() => camera.setZoom(camera.cameraState.zoom + 1.1)} onBloom={() => selection.openBloom(selection.selectedStar)} />
      <MemoryBloomPanel star={selection.bloomStar} bloom={selectedBloom} onClose={selection.closeBloom} />
    </main>
  );
}
