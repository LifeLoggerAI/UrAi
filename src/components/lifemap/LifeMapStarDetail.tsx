"use client";

import type { LifeMapStar } from "@/lib/lifemap/lifeMapTypes";

type LifeMapStarDetailProps = {
  star: LifeMapStar | null;
  onClose: () => void;
};

export function LifeMapStarDetail({ star, onClose }: LifeMapStarDetailProps) {
  if (!star) return <aside className="pointer-events-auto absolute inset-x-4 bottom-4 z-30 rounded-3xl border border-white/10 bg-black/35 p-4 text-sm text-white/75 backdrop-blur-xl md:left-auto md:right-6 md:top-24 md:w-[340px] md:bottom-auto">Tap a star to open a moment.</aside>;

  return (
    <aside className="pointer-events-auto absolute inset-x-4 bottom-4 z-30 rounded-3xl border border-white/10 bg-black/40 p-4 text-white/82 shadow-2xl backdrop-blur-xl md:left-auto md:right-6 md:top-24 md:w-[360px] md:bottom-auto">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">{star.type}</p>
          <h3 className="mt-1 text-lg font-medium text-white">{star.title}</h3>
          {star.subtitle ? <p className="mt-1 text-sm text-white/62">{star.subtitle}</p> : null}
        </div>
        <button type="button" onClick={onClose} aria-label="Close star detail" className="rounded-full bg-white/10 px-2 py-1 text-white/70">×</button>
      </div>
      <p className="mt-4 text-sm leading-6 text-white/72">{star.summary ?? "A quiet symbolic point in the map."}</p>
      <p className="mt-3 text-xs text-white/45">Layer: {star.sourceLayerId ?? "system"}</p>
    </aside>
  );
}
