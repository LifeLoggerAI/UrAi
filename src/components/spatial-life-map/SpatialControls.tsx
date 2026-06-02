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
      <button type="button" onClick={onZoomOut}>Zoom out</button>
      <button type="button" onClick={onReset}>{resetLabel}</button>
      <button type="button" onClick={onZoomIn}>Zoom in</button>
      <button type="button" onClick={onReplay} disabled={replayDisabled}>Replay focus</button>
      <button type="button" onClick={onBloom} disabled={!selectedStar || mode === "bloom"}>Open bloom</button>
    </div>
  );
}
