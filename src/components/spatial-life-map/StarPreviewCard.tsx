"use client";

import type { LifeMapStar } from "@/lib/spatial-life-map/lifeMap.types";

export default function StarPreviewCard({ star, mode = "hover" }: { star: LifeMapStar | null; mode?: "hover" | "selected" }) {
  if (!star) return null;
  return (
    <aside className={`spatial-star-preview spatial-star-preview-${mode}`} aria-label={`${star.title} preview`}>
      <div className="spatial-preview-orb" style={{ background: star.auraColor, boxShadow: `0 0 42px ${star.auraColor}88` }} />
      <p>{star.type} · {star.archetype}</p>
      <h2>{star.title}</h2>
      <span>{star.emotionalTone}</span>
      <em>{star.narratorReflection}</em>
      <small>{star.sourceSignals.join(" · ")} · {star.privacyLevel}</small>
    </aside>
  );
}
