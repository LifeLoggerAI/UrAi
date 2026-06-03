"use client";

import type { PassportDataLayerId } from "@/lib/ai/aiTypes";

type WhySeeingThisProps = {
  sourceLayerIds: PassportDataLayerId[];
  feature: "companion" | "lifemap" | "ground" | "mirror" | "shadow" | "legacy" | "notification" | "export";
};

const FEATURE_LABELS: Record<WhySeeingThisProps["feature"], string> = {
  companion: "Companion",
  lifemap: "Life Map",
  ground: "Ground",
  mirror: "Mirror",
  shadow: "Shadow",
  legacy: "Legacy",
  notification: "Notification",
  export: "Export review",
};

export function WhySeeingThis({ sourceLayerIds, feature }: WhySeeingThisProps) {
  const visibleLayers = sourceLayerIds.length ? sourceLayerIds : ["account"];

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-3 text-white/72" aria-label="Why am I seeing this">
      <p className="text-xs uppercase tracking-[0.22em] text-white/42">Why am I seeing this?</p>
      <p className="mt-2 text-sm leading-6">This appeared in {FEATURE_LABELS[feature]} because these layers are open:</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {visibleLayers.map((layer) => (
          <li key={layer} className="rounded-full bg-white/[0.08] px-3 py-1 text-xs text-white/68">{layer.replace(/_/g, " ")}</li>
        ))}
      </ul>
      <p className="mt-2 text-xs leading-5 text-white/48">Closed layers are not shown here. You can change this in Passport.</p>
    </section>
  );
}
