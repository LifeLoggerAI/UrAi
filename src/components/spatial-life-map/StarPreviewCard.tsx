"use client";

import type { LifeMapStar } from "@/lib/spatial-life-map/lifeMap.types";

export default function StarPreviewCard({
  star,
  mode = "hover",
  onActivate,
  actionLabel = "Open replay",
}: {
  star: LifeMapStar | null;
  mode?: "hover" | "selected";
  onActivate?: () => void;
  actionLabel?: string;
}) {
  if (!star) return null;

  const body = (
    <>
      <div className="spatial-preview-orb" style={{ background: star.auraColor, boxShadow: `0 0 42px ${star.auraColor}88` }} />
      <p>{star.emotionalTone} / {star.archetype}</p>
      <h2>{star.title}</h2>
      <span>{star.type.replace(/([A-Z])/g, " $1").trim()} star / constellation {star.constellationId}</span>
      <em>{star.narratorReflection}</em>
      <small>{star.sourceSignals.join(" / ")} / {star.privacyLevel}</small>
      <strong className="spatial-preview-action">{onActivate ? actionLabel : "Click star to focus"}</strong>
    </>
  );

  if (!onActivate) {
    return (
      <aside className={`spatial-star-preview spatial-star-preview-${mode}`} aria-label={`${star.title} preview`}>
        {body}
      </aside>
    );
  }

  return (
    <button type="button" className={`spatial-star-preview spatial-star-preview-${mode}`} aria-label={`${star.title} focus. ${actionLabel}`} onClick={onActivate}>
      {body}
    </button>
  );
}
