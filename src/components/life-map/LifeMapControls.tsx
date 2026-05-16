interface LifeMapControlsProps {
  onHideThread: () => void;
  onReplay: () => void;
  onCreateScroll: () => void;
  onMirror: () => void;
  onRecenter: () => void;
}

export default function LifeMapControls({ onHideThread, onReplay, onCreateScroll, onMirror, onRecenter }: LifeMapControlsProps) {
  const controls = [
    ["Hide thread", onHideThread],
    ["Replay", onReplay],
    ["Create scroll", onCreateScroll],
    ["Mirror", onMirror],
    ["Recenter", onRecenter],
  ] as const;

  return (
    <div className="pointer-events-auto fixed bottom-20 left-1/2 z-30 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-full border border-cyan-100/15 bg-slate-950/70 px-3 py-2 shadow-[0_0_40px_rgba(15,23,42,0.8)] backdrop-blur-2xl max-sm:bottom-24 max-sm:w-[92vw]">
      {controls.map(([label, handler]) => (
        <button key={label} onClick={handler} className="rounded-full border border-cyan-100/15 bg-white/5 px-4 py-2 text-xs font-medium text-cyan-50 transition hover:border-cyan-100/35 hover:bg-cyan-100/10 focus:outline-none focus:ring-2 focus:ring-cyan-200/50">
          {label}
        </button>
      ))}
    </div>
  );
}
