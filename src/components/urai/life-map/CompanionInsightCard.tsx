import { emotionPalette } from "@/components/urai/data/emotionPalette";
import type { MemoryStar } from "@/components/urai/data/memoryStars";

export function CompanionInsightCard({ selected }: { selected: MemoryStar | null }) {
  const message = selected
    ? `URAI rendered this ${emotionPalette[selected.category].label.toLowerCase()} memory softly.`
    : "This memory field is ready. Select a star to open its portal.";

  return (
    <aside className="urai-companion-card glass-panel">
      <span>COMPANION</span>
      <p>{message}</p>
      <em>Narration ready.</em>
    </aside>
  );
}
