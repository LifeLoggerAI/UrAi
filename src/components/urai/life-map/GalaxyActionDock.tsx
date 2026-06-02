"use client";

export function GalaxyActionDock({
  onCloseLine,
  onReplay,
  onReflect,
  onCenter,
}: {
  onCloseLine: () => void;
  onReplay: () => void;
  onReflect: () => void;
  onCenter: () => void;
}) {
  return (
    <div className="urai-galaxy-actions glass-panel">
      <button type="button" onClick={onCloseLine}>Close line</button>
      <button type="button" onClick={onReplay}>Replay</button>
      <button type="button">Create scroll</button>
      <button type="button" onClick={onReflect}>Reflect</button>
      <button type="button" onClick={onCenter}>Center</button>
    </div>
  );
}
