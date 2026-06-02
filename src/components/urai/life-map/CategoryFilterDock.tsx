"use client";

import { emotionPalette, type MemoryCategory } from "@/components/urai/data/emotionPalette";

type FilterValue = MemoryCategory | "all";

const categories = Object.entries(emotionPalette) as [MemoryCategory, { label: string }][];

export function CategoryFilterDock({ value, onChange }: { value: FilterValue; onChange: (value: FilterValue) => void }) {
  return (
    <nav className="urai-category-dock glass-panel" aria-label="Memory filters">
      <button type="button" className={value === "all" ? "is-active" : ""} onClick={() => onChange("all")}>All</button>
      {categories.map(([key, item]) => (
        <button key={key} type="button" className={value === key ? "is-active" : ""} onClick={() => onChange(key)}>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
