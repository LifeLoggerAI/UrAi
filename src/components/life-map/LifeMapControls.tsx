interface LifeMapControlsProps {
  onHideThread: () => void;
  onReplay: () => void;
  onCreateScroll: () => void;
  onMirror: () => void;
  onRecenter: () => void;
  hidden?: boolean;
  disabled?: boolean;
}

const controls = [
  ["Hide thread", "Hide the active memory thread"],
  ["Replay thread", "Replay the selected thread"],
  ["Make scroll", "Create a private memory scroll"],
  ["Open mirror", "Reflect this memory"],
  ["Recenter sky", "Return to the full constellation"],
] as const;

export default function LifeMapControls({ onHideThread, onReplay, onCreateScroll, onMirror, onRecenter, hidden = false, disabled = false }: LifeMapControlsProps) {
  const handlers = [onHideThread, onReplay, onCreateScroll, onMirror, onRecenter] as const;

  if (hidden) return null;

  return (
    <nav
      className="pointer-events-auto fixed bottom-[6.25rem] left-1/2 z-30 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-full border border-cyan-100/15 bg-slate-950/72 px-3 py-2 shadow-[0_24px_70px_rgba(0,0,0,0.46)] backdrop-blur-2xl max-sm:bottom-[6.75rem] max-sm:w-[calc(100vw-1.5rem)]"
      aria-label="URAI memory actions"
    >
      {controls.map(([label, ariaLabel], index) => (
        <button
          key={label}
          onClick={handlers[index]}
          disabled={disabled}
          className={`min-h-11 rounded-full border px-4 py-2 text-xs font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-200/70 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-40 ${
            index === 1
              ? "border-cyan-100/45 bg-cyan-100 text-slate-950 shadow-[0_0_28px_rgba(191,233,255,0.32)] hover:scale-[1.025]"
              : "border-cyan-100/18 bg-white/[0.055] text-cyan-50 hover:scale-[1.025] hover:border-cyan-100/35 hover:bg-cyan-100/10"
          } active:scale-[0.97]`}
          aria-label={ariaLabel}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
