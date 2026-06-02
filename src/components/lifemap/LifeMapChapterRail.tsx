"use client";

import type { LifeMapChapter, LifeMapStar } from "@/lib/lifemap/lifeMapTypes";

type LifeMapChapterRailProps = {
  chapters: LifeMapChapter[];
  stars: LifeMapStar[];
  selectedChapterId?: string;
};

export function LifeMapChapterRail({ chapters, stars, selectedChapterId }: LifeMapChapterRailProps) {
  return (
    <aside className="pointer-events-auto absolute left-4 top-24 z-20 hidden max-w-[240px] flex-col gap-2 rounded-3xl border border-white/10 bg-black/24 p-3 text-white/80 backdrop-blur-xl md:flex">
      {chapters.map((chapter) => {
        const count = chapter.starIds.filter((id) => stars.some((star) => star.id === id && star.visibility === "visible")).length;
        const active = selectedChapterId === chapter.id;
        return (
          <div key={chapter.id} className={`rounded-2xl px-3 py-2 ${active ? "bg-white/12" : "bg-white/[0.04]"}`}>
            <p className="text-sm font-medium text-white/90">{chapter.title}</p>
            <p className="mt-0.5 text-xs text-white/52">{count} stars</p>
            {chapter.subtitle ? <p className="mt-1 text-xs text-white/62">{chapter.subtitle}</p> : null}
          </div>
        );
      })}
    </aside>
  );
}
