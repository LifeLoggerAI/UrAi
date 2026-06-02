import type { GalaxyCameraState } from "@/components/urai/hooks/useGalaxyCamera";

export function ZoomMiniMap({ camera }: { camera: GalaxyCameraState }) {
  return (
    <div className="urai-zoom-minimap glass-panel">
      <span>Zoom</span>
      <strong>{Math.round(camera.scale * 100)}%</strong>
      <em>x {Math.round(camera.x)} · y {Math.round(camera.y)}</em>
    </div>
  );
}
