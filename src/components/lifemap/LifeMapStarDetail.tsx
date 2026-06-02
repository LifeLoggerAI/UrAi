"use client";

import type { LifeMapStar } from "@/lib/lifemap/lifeMapTypes";

type LifeMapStarDetailProps = {
  star: LifeMapStar | null;
  onClose: () => void;
  onOpenPassport?: () => void;
  onReflect?: (star: LifeMapStar) => void;
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function LifeMapStarDetail({ star, onClose, onOpenPassport, onReflect }: LifeMapStarDetailProps) {
  if (!star) return <aside className="pointer-events-auto absolute inset-x-4 bottom-4 z-30 rounded-3xl border border-white/10 bg-black/35 p-4 text-sm text-white/75 backdrop-blur-xl md:left-auto md:right-6 md:top-24 md:w-[340px] md:bottom-auto">Tap a star to open a moment.</aside>;
  const locked = star.visibility === "requires_permission";
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
      <p className="mt-4 text-sm leading-6 text-white/72">{locked ? "This star needs permission before URAI can reveal more." : star.summary ?? "A quiet symbolic point in the map."}</p>
      <dl className="mt-4 grid gap-1 text-xs text-white/45">
        <div className="flex justify-between gap-3"><dt>Date</dt><dd>{formatDate(star.createdAt)}</dd></div>
        <div className="flex justify-between gap-3"><dt>Layer</dt><dd>{star.sourceLayerId ?? "system"}</dd></div>
        <div className="flex justify-between gap-3"><dt>Status</dt><dd>{star.visibility}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {locked ? <button type="button" onClick={onOpenPassport} className="rounded-full bg-sky-200/15 px-3 py-2 text-xs text-white/84">Open Passport</button> : <button type="button" onClick={() => onReflect?.(star)} className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/84">Reflect with URAI</button>}
        <button type="button" className="rounded-full bg-white/[0.06] px-3 py-2 text-xs text-white/62">Hide this star</button>
      </div>
    </aside>
  );
}
