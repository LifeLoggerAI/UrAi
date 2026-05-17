"use client";

import { emotionPalette, type MemoryCategory } from "@/components/urai/data/emotionPalette";

export function CategoryFilterDock({
  activeCategory,
  onChange,
}: {
  activeCategory: MemoryCategory | "all";
  onChange: (category: MemoryCategory | "all") => void;
}) {
  return (
    <nav className="urai-category-dock glass-panel" aria-label="Memory filters">
      <button type="button" className={activeCategory === "all" ? "is-active" : ""} onClick={() => onChange("all")}>All</button>
      {(Object.keys(emotionPalette) as MemoryCategory[]).map((category) => (
        <button key={category} type="button" className={activeCategory === category ? "is-active" : ""} onClick={() => onChange(category)}>
          {emotionPalette[category].label}
        </button>
      ))}
    </nav>
  );
}
