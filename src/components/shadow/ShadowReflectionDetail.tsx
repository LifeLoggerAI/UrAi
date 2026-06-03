"use client";

import type { PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";
import { legacyCandidateFromSummary } from "@/lib/legacy/buildPermissionedLegacy";
import type { ShadowReflection, ShadowViewMode } from "@/lib/shadow/shadowTypes";
import { useUraiExport } from "@/providers/UraiExportProvider";
import { useUraiLegacy } from "@/providers/UraiLegacyProvider";
import { useUraiRituals } from "@/providers/UraiRitualProvider";

type ShadowReflectionDetailProps = {
  reflection: ShadowReflection | null;
  viewMode: ShadowViewMode;
  onClose: () => void;
  onOpenGround?: () => void;
  onOpenPassport?: () => void;
  onTalkToGuardian?: () => void;
  onSoften?: () => void;
  onHide?: () => void;
};

function titleFor(reflection: ShadowReflection, mode: ShadowViewMode): string {
  if (reflection.visibility === "locked") return reflection.softenedTitle ?? "This layer is closed.";
  if (mode === "soft" || reflection.visibility === "softened") return reflection.softenedTitle ?? reflection.title;
  return reflection.title;
}

function summaryFor(reflection: ShadowReflection, mode: ShadowViewMode): string {
  if (reflection.visibility === "locked") return reflection.softenedSummary ?? "This layer is closed in Passport.";
  if (mode === "soft" || reflection.visibility === "softened") return reflection.softenedSummary ?? reflection.summary;
  return reflection.summary;
}

export function ShadowReflectionDetail({ reflection, viewMode, onClose, onOpenGround, onOpenPassport, onTalkToGuardian, onSoften, onHide }: ShadowReflectionDetailProps) {
  const exports = useUraiExport();
  const legacy = useUraiLegacy();
  const rituals = useUraiRituals();
  if (!reflection) return <aside className="pointer-events-auto absolute inset-x-4 bottom-4 z-30 rounded-3xl border border-white/10 bg-black/35 p-4 text-sm text-white/75 backdrop-blur-xl md:left-auto md:right-6 md:top-24 md:w-[360px] md:bottom-auto">Select a protected reflection, or keep Shadow sealed.</aside>;
  const locked = reflection.visibility === "locked";
  const layers: PassportDataLayerId[] = reflection.sourceLayerIds.length ? reflection.sourceLayerIds : ["shadow"];
  const softTitle = titleFor(reflection, "soft");
  const softSummary = summaryFor(reflection, "soft");
  const addToLegacy = () => {
    if (locked) return;
    legacy.addItemToLegacy(legacyCandidateFromSummary({ id: `legacy-shadow-${reflection.id}`, type: "shadow_reflection", title: softTitle, summary: softSummary, sourceLayerIds: layers, tone: "solemn", linkedShadowReflectionId: reflection.id }));
    legacy.openLegacy();
  };
  const createRitual = () => {
    if (locked) return;
    const [ritual] = rituals.suggestForContext({ selectedShadowReflection: { id: reflection.id, sourceLayerIds: layers, visibility: reflection.visibility }, passportProfile: { ritualsEnabled: true, shadowEnabled: true, enabledLayers: { shadow: true, system: true } } });
    if (ritual) rituals.startRitual(ritual.id);
  };
  const exportSoft = () => {
    if (locked) return;
    exports.openExport({ id: `export-shadow-${reflection.id}`, type: "shadow_soft_summary", title: softTitle, summary: softSummary, format: "png", privacyLevel: "requires_review", sourceType: "shadow", sourceIds: [reflection.id], sourceLayerIds: layers, userApproved: true });
  };
  const runSuggested = () => { if (reflection.suggestedAction === "open_ground") onOpenGround?.(); if (reflection.suggestedAction === "talk_to_guardian") onTalkToGuardian?.(); if (reflection.suggestedAction === "open_passport") onOpenPassport?.(); if (reflection.suggestedAction === "soften_view") onSoften?.(); if (reflection.suggestedAction === "hide") onHide?.(); };
  return (
    <aside className="pointer-events-auto absolute inset-x-4 bottom-4 z-30 rounded-3xl border border-white/10 bg-black/44 p-4 text-white/82 shadow-2xl backdrop-blur-xl md:left-auto md:right-6 md:top-24 md:w-[380px] md:bottom-auto">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.24em] text-white/45">{reflection.patternType.replace(/_/g, " ")}</p><h3 className="mt-1 text-lg font-medium text-white">{titleFor(reflection, viewMode)}</h3></div><button type="button" onClick={onClose} aria-label="Close Shadow detail" className="rounded-full bg-white/10 px-2 py-1 text-white/70">×</button></div>
      <p className="mt-4 text-sm leading-6 text-white/72">{summaryFor(reflection, viewMode)}</p>
      <div className="mt-4 rounded-2xl bg-white/[0.055] p-3 text-sm leading-6 text-white/64"><p>{locked ? "This layer is closed in Passport." : "This appeared only from visible, permissioned Shadow context."}</p><p className="mt-2">This is not a diagnosis or certainty. You can soften, hide, or leave it alone.</p></div>
      <div className="mt-4 flex flex-wrap gap-2">
        {locked ? <button type="button" onClick={onOpenPassport} className="rounded-full bg-sky-200/15 px-3 py-2 text-xs text-white/84">Open Passport</button> : null}
        {reflection.suggestedAction && reflection.suggestedAction !== "none" ? <button type="button" onClick={runSuggested} className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/84">Suggested next step</button> : null}
        <button type="button" onClick={onTalkToGuardian} className="rounded-full bg-white/[0.07] px-3 py-2 text-xs text-white/68">Talk to Guardian</button>
        {!locked ? <button type="button" onClick={createRitual} className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/84">Soften with ritual</button> : null}
        {!locked ? <button type="button" onClick={addToLegacy} className="rounded-full bg-amber-200/14 px-3 py-2 text-xs text-white/84">Add to Legacy</button> : null}
        {!locked ? <button type="button" onClick={exportSoft} className="rounded-full bg-white/[0.08] px-3 py-2 text-xs text-white/62">Export soft summary</button> : null}
        {reflection.userCanSoften ? <button type="button" onClick={onSoften} className="rounded-full bg-white/[0.06] px-3 py-2 text-xs text-white/62">Soften view</button> : null}
        {reflection.userCanHide ? <button type="button" onClick={onHide} className="rounded-full bg-white/[0.05] px-3 py-2 text-xs text-white/56">Hide</button> : null}
      </div>
    </aside>
  );
}
