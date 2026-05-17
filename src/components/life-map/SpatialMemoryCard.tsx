"use client";

import type { MemoryStar } from "@/lib/life-map/types";
import { mapPrivacyToRenderBehavior, mapStarTypeToVisual } from "@/lib/life-map/visual-mapping";

export default function SpatialMemoryCard({ star, onClose, onBlur, onHide, onDelete }: { star?: MemoryStar; onClose: () => void; onBlur: () => void; onHide: () => void; onDelete: () => void }) {
  if (!star) return null;
  const visual = mapStarTypeToVisual(star.type);
  const privacy = mapPrivacyToRenderBehavior(star.privacyLevel);

  return (
    <section className="pointer-events-auto fixed left-5 top-28 z-40 w-[min(390px,calc(100vw-2rem))] rounded-3xl border border-cyan-100/15 bg-slate-950/85 p-5 text-cyan-50 shadow-[0_0_70px_rgba(2,6,23,0.75)] backdrop-blur-2xl max-md:left-3 max-md:top-32">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-cyan-100/50">Spatial memory</p>
          <h2 className="mt-1 text-2xl font-semibold">{star.title}</h2>
          <p className="text-sm text-cyan-100/60">{star.subtitle}</p>
        </div>
        <button onClick={onClose} className="rounded-full border border-cyan-100/15 px-3 py-1 text-xs text-cyan-100/70 hover:bg-white/10">Close</button>
      </div>
      <div className="mb-4 rounded-2xl border border-cyan-100/10 bg-white/[0.04] p-4">
        <p className="text-sm leading-6 text-cyan-50/80">{star.narratorText || visual.narratorLine}</p>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-xs text-cyan-100/65">
        <div><dt>Type</dt><dd className="text-cyan-50">{star.type}</dd></div>
        <div><dt>Privacy</dt><dd className="text-cyan-50">{privacy.label}</dd></div>
        <div><dt>Glow</dt><dd className="text-cyan-50">{Math.round(star.glow * 100)}%</dd></div>
        <div><dt>Intensity</dt><dd className="text-cyan-50">{Math.round(star.intensity * 100)}%</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {star.emotionalTags.map((tag) => <span key={tag} className="rounded-full bg-cyan-100/10 px-2.5 py-1 text-xs text-cyan-50/75">{tag}</span>)}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
        <button onClick={onBlur} className="rounded-2xl border border-cyan-100/15 px-3 py-2 hover:bg-white/10">Blur sensitive</button>
        <button onClick={onHide} className="rounded-2xl border border-cyan-100/15 px-3 py-2 hover:bg-white/10">Hide star</button>
        <button className="rounded-2xl border border-cyan-100/15 px-3 py-2 hover:bg-white/10">Local-only mode</button>
        <button onClick={onDelete} className="rounded-2xl border border-rose-200/20 px-3 py-2 text-rose-100 hover:bg-rose-500/10">Delete memory</button>
      </div>
    </section>
  );
}
