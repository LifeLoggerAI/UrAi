"use client";

import { useMemo } from "react";
import { useUraiExport } from "@/providers/UraiExportProvider";
import { useUraiLegacy } from "@/providers/UraiLegacyProvider";
import { useUraiRituals } from "@/providers/UraiRitualProvider";
import { RitualCard } from "./RitualCard";

type RitualShelfProps = {
  isVisible?: boolean;
};

export function RitualShelf({ isVisible = true }: RitualShelfProps) {
  const exports = useUraiExport();
  const legacy = useUraiLegacy();
  const rituals = useUraiRituals();
  const visibleRituals = useMemo(() => rituals.rituals.filter((ritual) => ritual.status !== "hidden").slice(0, 3), [rituals.rituals]);

  if (!isVisible || visibleRituals.length === 0 || rituals.isRitualFlowOpen) return null;

  return (
    <aside className="pointer-events-auto fixed bottom-24 left-4 z-[55] hidden w-[min(360px,calc(100vw-2rem))] space-y-3 md:block" aria-label="Suggested rituals">
      <div className="rounded-full border border-white/10 bg-black/24 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/52 backdrop-blur-xl">Rituals</div>
      {visibleRituals.map((ritual) => (
        <div key={ritual.id} className="space-y-2">
          <RitualCard ritual={ritual} onStart={rituals.startRitual} onSave={rituals.saveRitual} onSkip={rituals.skipRitual} onHide={rituals.hideRitual} />
          <div className="flex flex-wrap gap-2 px-2">
            <button type="button" onClick={() => { const candidate = rituals.addRitualToLegacy(ritual.id); if (candidate) { legacy.addItemToLegacy(candidate); legacy.openLegacy(); } }} className="rounded-full bg-amber-200/12 px-3 py-1.5 text-xs text-white/70">Add to Legacy</button>
            <button type="button" onClick={() => { const review = rituals.exportRitual(ritual.id); if (review) exports.openExport({ id: review.artifact.id, type: review.artifact.type, title: review.artifact.title, subtitle: review.artifact.subtitle, summary: review.artifact.summary, format: review.artifact.format, privacyLevel: review.artifact.privacyLevel, sourceType: review.artifact.sourceType, sourceIds: review.artifact.sourceIds, sourceLayerIds: review.artifact.sourceLayerIds, userApproved: true }); }} className="rounded-full bg-white/[0.08] px-3 py-1.5 text-xs text-white/62">Export card</button>
          </div>
        </div>
      ))}
    </aside>
  );
}
