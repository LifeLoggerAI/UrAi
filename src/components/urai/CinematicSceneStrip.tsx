"use client";

type SceneStripFrame = {
  id: string;
  kind: string;
  title: string;
  fallbackGradient: string;
  assetUrl?: string;
  posterUrl?: string;
};

type Props = {
  frames: SceneStripFrame[];
  activeFrameId: string;
  memoryColor: string;
  onSelectFrame: (index: number) => void;
};

export function CinematicSceneStrip({ frames, activeFrameId, memoryColor, onSelectFrame }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {frames.map((frame, index) => {
        const isActive = frame.id === activeFrameId;
        return (
          <button
            key={frame.id}
            type="button"
            onClick={() => onSelectFrame(index)}
            className="overflow-hidden rounded-3xl border bg-black/30 text-left shadow-xl transition focus:outline-none focus:ring-2 focus:ring-white/40"
            style={{ borderColor: isActive ? memoryColor : "rgba(255,255,255,0.12)" }}
          >
            <div className="relative h-24 overflow-hidden" style={{ background: frame.fallbackGradient }}>
              {frame.kind === "photo" && frame.assetUrl && <img src={frame.assetUrl} alt="" className="h-full w-full object-cover" />}
              {frame.kind === "video" && frame.posterUrl && <img src={frame.posterUrl} alt="" className="h-full w-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute bottom-2 left-3 text-[0.6rem] uppercase tracking-[0.2em] text-white/65">Scene {index + 1}</span>
            </div>
            <div className="p-3">
              <p className="text-xs text-white/80">{frame.title}</p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.16em] text-white/38">{frame.kind}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
