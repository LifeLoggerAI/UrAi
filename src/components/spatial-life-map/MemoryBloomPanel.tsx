"use client";

import type { LifeMapStar, MemoryBloom } from "@/lib/spatial-life-map/lifeMap.types";

interface MemoryBloomPanelProps {
  star: LifeMapStar | null;
  bloom: MemoryBloom | null;
  onClose: () => void;
}

export default function MemoryBloomPanel({ star, bloom, onClose }: MemoryBloomPanelProps) {
  if (!star || !bloom) return null;

  return (
    <section className="spatial-memory-bloom" role="dialog" aria-modal="true" aria-label={`${star.title} memory bloom`}>
      <button type="button" className="spatial-bloom-close" onClick={onClose} aria-label="Close memory bloom">×</button>
      <div className="spatial-bloom-orb" style={{ background: `radial-gradient(circle at 32% 26%, white, ${star.auraColor} 36%, #020617 78%)`, boxShadow: `0 0 80px ${star.auraColor}80` }} />
      <p>{star.layer} · {star.archetype}</p>
      <h2>{star.title}</h2>
      <h3>{star.emotionalTone}</h3>
      <blockquote>{bloom.narratorScript}</blockquote>
      <div className="spatial-bloom-grid">
        <article>
          <span>Why this matters</span>
          <strong>{bloom.whyThisMatters}</strong>
        </article>
        <article>
          <span>Timeline fragments</span>
          <strong>{bloom.timelineFragments.join(" · ")}</strong>
        </article>
        <article>
          <span>Symbolic tags</span>
          <strong>{bloom.symbolicTags.join(" · ")}</strong>
        </article>
        <article>
          <span>Ritual prompt</span>
          <strong>{bloom.ritualPrompts[0]}</strong>
        </article>
      </div>
    </section>
  );
}
