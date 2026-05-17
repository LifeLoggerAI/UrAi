"use client";

import type { LifeMapChapter, LifeMapConstellation } from "@/lib/spatial-life-map/lifeMap.types";

interface ChapterRailProps {
  chapters: LifeMapChapter[];
  constellations: LifeMapConstellation[];
  onFocusConstellation: (constellation: LifeMapConstellation) => void;
}

export default function ChapterRail({ chapters, constellations, onFocusConstellation }: ChapterRailProps) {
  return (
    <nav className="spatial-chapter-rail" aria-label="Life chapters">
      {chapters.map((chapter) => {
        const constellation = constellations.find((item) => chapter.constellationIds.includes(item.id));
        return (
          <button key={chapter.id} type="button" onClick={() => constellation && onFocusConstellation(constellation)}>
            <span>{chapter.archetype}</span>
            <strong>{chapter.title}</strong>
            <em>{chapter.dominantEmotion}</em>
          </button>
        );
      })}
    </nav>
  );
}
