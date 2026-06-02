import CanonButton from "./CanonButton";

interface LifeMapControlsProps {
  onHideThread: () => void;
  onReplay: () => void;
  onCreateScroll: () => void;
  onMirror: () => void;
  onRecenter: () => void;
}

export default function LifeMapControls({ onHideThread, onReplay, onCreateScroll, onMirror, onRecenter }: LifeMapControlsProps) {
  const controls = [
    ["Hide thread", onHideThread, "ghost"],
    ["Replay thread", onReplay, "primary"],
    ["Make scroll", onCreateScroll, "secondary"],
    ["Open mirror", onMirror, "secondary"],
    ["Recenter sky", onRecenter, "ghost"],
  ] as const;

  return (
    <div className="pointer-events-auto fixed bottom-24 left-1/2 z-30 flex w-[min(620px,calc(100vw-1.5rem))] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-full border border-cyan-100/15 bg-slate-950/68 px-3 py-2 shadow-2xl backdrop-blur-2xl max-sm:bottom-28" aria-label="Life Map actions">
      {controls.map(([label, handler, variant]) => (
        <CanonButton key={label} onClick={handler} variant={variant} aria-label={label}>
          {label}
        </CanonButton>
      ))}
    </div>
  );
}
