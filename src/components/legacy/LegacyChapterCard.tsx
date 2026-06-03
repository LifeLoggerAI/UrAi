"use client";

import type { LegacyChapter } from "@/lib/legacy/legacyTypes";

type LegacyChapterCardProps = {
  chapter: LegacyChapter;
  isSelected?: boolean;
  onSelect: (chapterId: string) => void;
};

function formatRange(chapter: LegacyChapter): string {
  const start = new Date(chapter.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  if (!chapter.endDate) return start;
  const end = new Date(chapter.endDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  return `${start} - ${end}`;
}

export function LegacyChapterCard({ chapter, isSelected = false, onSelect }: LegacyChapterCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(chapter.id)}
      className={`w-full rounded-[1.75rem] border p-4 text-left shadow-2xl backdrop-blur-xl transition ${isSelected ? "border-amber-100/30 bg-amber-100/12" : "border-white/10 bg-white/[0.06] hover:bg-white/[0.09]"}`}
      aria-label={`Open chapter ${chapter.title}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-amber-100/10 px-2 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-white/55">{chapter.tone}</span>
        <span className="rounded-full bg-white/[0.07] px-2 py-1 text-[0.65rem] text-white/52">{chapter.itemIds.length} items</span>
      </div>
      <h3 className="mt-3 text-base font-medium text-white">{chapter.title}</h3>
      {chapter.subtitle ? <p className="mt-1 text-sm text-white/58">{chapter.subtitle}</p> : null}
      <p className="mt-2 text-xs text-white/42">{formatRange(chapter)}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/66">{chapter.summary}</p>
      <p className="mt-3 text-[0.68rem] text-white/42">{chapter.exportAllowed ? "Export allowed" : "Private by default"}</p>
    </button>
  );
}
