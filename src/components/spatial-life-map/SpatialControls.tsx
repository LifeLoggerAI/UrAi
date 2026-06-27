"use client";

import type { LifeMapStar } from "@/lib/spatial-life-map/lifeMap.types";

type LifeMapInteractionMode = "galaxy" | "focus" | "replay" | "bloom";

interface SpatialControlsProps {
  selectedStar: LifeMapStar | null;
  mode: LifeMapInteractionMode;
  onReset: () => void;
  onBloom: () => void;
  onReplay: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  replayDisabled?: boolean;
}

export default function SpatialControls({ selectedStar, mode, onReset, onBloom, onReplay, onZoomIn, onZoomOut, replayDisabled = false }: SpatialControlsProps) {
  const resetLabel = mode === "galaxy" ? "Full galaxy" : mode === "replay" ? "Back to focus" : "Unwind";

  return (
    <div className="spatial-controls" aria-label="Spatial Life Map controls" data-mode={mode}>
      <button type="button" onClick={onZoomOut} aria-label="Zoom out of the Life Map">Zoom out</button>
      <button type="button" onClick={onReset} aria-label={resetLabel === "Full galaxy" ? "Return to the full Life Map galaxy" : resetLabel}>{resetLabel}</button>
      <button type="button" onClick={onZoomIn} aria-label="Zoom into the Life Map">Zoom in</button>
      <button type="button" onClick={onReplay} disabled={replayDisabled} aria-disabled={replayDisabled}>Replay focus</button>
      <button type="button" onClick={onBloom} disabled={!selectedStar || mode === "bloom"} aria-disabled={!selectedStar || mode === "bloom"}>Open bloom</button>
    </div>
  );
}
