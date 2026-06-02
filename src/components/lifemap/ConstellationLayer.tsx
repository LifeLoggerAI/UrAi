"use client";

import type { LifeMapChapter, LifeMapStar } from "@/lib/lifemap/lifeMapTypes";

type ConstellationLayerProps = {
  stars: LifeMapStar[];
  chapters: LifeMapChapter[];
  selectedChapterId?: string;
};

export function ConstellationLayer({ stars, chapters, selectedChapterId }: ConstellationLayerProps) {
  const starById = new Map(stars.map((star) => [star.id, star]));

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      {chapters.flatMap((chapter) => {
        const chapterStars = chapter.starIds.map((id) => starById.get(id)).filter((star): star is LifeMapStar => Boolean(star));
        return chapterStars.slice(1).map((star, index) => {
          const previous = chapterStars[index];
          if (!previous) return null;
          const active = selectedChapterId === chapter.id;
          return (
            <line
              key={`${chapter.id}-${previous.id}-${star.id}`}
              x1={`${previous.x}%`}
              y1={`${previous.y}%`}
              x2={`${star.x}%`}
              y2={`${star.y}%`}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={active ? 1.4 : 0.8}
              strokeDasharray="4 10"
              opacity={active ? 0.54 : 0.28}
            />
          );
        });
      })}
    </svg>
  );
}
