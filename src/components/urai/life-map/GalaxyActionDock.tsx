"use client";

export function GalaxyActionDock({
  onHideThread,
  onReplay,
  onMirror,
  onRecenter,
}: {
  onHideThread: () => void;
  onReplay: () => void;
  onMirror: () => void;
  onRecenter: () => void;
}) {
  return (
    <div className="urai-galaxy-actions glass-panel">
      <button type="button" onClick={onHideThread}>Hide thread</button>
      <button type="button" onClick={onReplay}>Replay</button>
      <button type="button">Create scroll</button>
      <button type="button" onClick={onMirror}>Mirror</button>
      <button type="button" onClick={onRecenter}>Recenter</button>
    </div>
  );
}
