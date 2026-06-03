"use client";

import type { MirrorReflection } from "@/lib/mirror/mirrorTypes";
import { legacyCandidateFromSummary } from "@/lib/legacy/buildPermissionedLegacy";
import { useUraiLegacy } from "@/providers/UraiLegacyProvider";

type MirrorReflectionDetailProps = {
  reflection: MirrorReflection | null;
  onClose: () => void;
  onOpenGround?: () => void;
  onOpenLifeMap?: () => void;
  onOpenPassport?: () => void;
  onTalkToCompanion?: () => void;
};

const confidenceCopy: Record<MirrorReflection["confidence"], string> = {
  low: "This is an early signal. You can ignore or hide it.",
  medium: "This may be a forming pattern from visible layers.",
  high: "This looks clearer, but it still is not certainty.",
};

function whyText(reflection: MirrorReflection): string {
  if (reflection.permissionRequired) return "More detail is closed in Passport.";
  if (reflection.sourceLayerIds.length === 0) return "This appeared from safe system context.";
  return `This appeared from visible ${reflection.sourceLayerIds.join(", ")} layers.`;
}

export function MirrorReflectionDetail({ reflection, onClose, onOpenGround, onOpenLifeMap, onOpenPassport, onTalkToCompanion }: MirrorReflectionDetailProps) {
  const legacy = useUraiLegacy();
  if (!reflection) return <aside className="pointer-events-auto absolute inset-x-4 bottom-4 z-30 rounded-3xl border border-white/10 bg-black/35 p-4 text-sm text-white/75 backdrop-blur-xl md:left-auto md:right-6 md:top-24 md:w-[360px] md:bottom-auto">Select a reflection to open it gently.</aside>;

  const addToLegacy = () => {
    if (reflection.permissionRequired) return;
    legacy.addItemToLegacy(legacyCandidateFromSummary({ id: `legacy-mirror-${reflection.id}`, type: "mirror_pattern", title: reflection.title, summary: reflection.summary, sourceLayerIds: reflection.sourceLayerIds.length ? reflection.sourceLayerIds : ["system"], tone: "reflective", linkedMirrorReflectionId: reflection.id }));
    legacy.openLegacy();
  };

  const runAction = () => {
    if (reflection.suggestedAction === "open_ground") onOpenGround?.();
    if (reflection.suggestedAction === "open_life_map") onOpenLifeMap?.();
    if (reflection.suggestedAction === "open_passport") onOpenPassport?.();
    if (reflection.suggestedAction === "talk_to_companion") onTalkToCompanion?.();
  };

  return (
    <aside className="pointer-events-auto absolute inset-x-4 bottom-4 z-30 rounded-3xl border border-white/10 bg-black/42 p-4 text-white/82 shadow-2xl backdrop-blur-xl md:left-auto md:right-6 md:top-24 md:w-[380px] md:bottom-auto">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">{reflection.patternType.replace(/_/g, " ")}</p>
          <h3 className="mt-1 text-lg font-medium text-white">{reflection.title}</h3>
        </div>
        <button type="button" onClick={onClose} aria-label="Close reflection detail" className="rounded-full bg-white/10 px-2 py-1 text-white/70">×</button>
      </div>
      <p className="mt-4 text-sm leading-6 text-white/72">{reflection.summary}</p>
      <div className="mt-4 rounded-2xl bg-white/[0.055] p-3 text-sm leading-6 text-white/64">
        <p>{whyText(reflection)}</p>
        <p className="mt-2">{confidenceCopy[reflection.confidence]}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {reflection.suggestedAction && reflection.suggestedAction !== "none" ? <button type="button" onClick={runAction} className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/84">Suggested next step</button> : null}
        <button type="button" onClick={onTalkToCompanion} className="rounded-full bg-white/[0.07] px-3 py-2 text-xs text-white/68">Reflect with URAI</button>
        {!reflection.permissionRequired ? <button type="button" onClick={addToLegacy} className="rounded-full bg-amber-200/14 px-3 py-2 text-xs text-white/84">Add to Legacy</button> : null}
        <button type="button" className="rounded-full bg-white/[0.05] px-3 py-2 text-xs text-white/56">Hide reflection</button>
      </div>
    </aside>
  );
}
