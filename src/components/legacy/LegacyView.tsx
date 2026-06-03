"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import { useUraiLegacy } from "@/providers/UraiLegacyProvider";
import { LegacyChapterCard } from "./LegacyChapterCard";
import { LegacyConsentGate } from "./LegacyConsentGate";
import { LegacyItemDetail } from "./LegacyItemDetail";

type LegacyViewProps = {
  isOpen: boolean;
  onClose: () => void;
  moodState?: GenesisMoodState;
  onOpenPassport?: () => void;
  onOpenLifeMap?: () => void;
  onOpenGround?: () => void;
  onTalkToCompanion?: () => void;
};

const toneByMood: Record<GenesisMoodState, string> = {
  calm: "from-stone-950 via-amber-950 to-black",
  heavy: "from-stone-950 via-neutral-950 to-black",
  focused: "from-slate-950 via-amber-950 to-black",
  anxious: "from-slate-950 via-stone-950 to-black",
  hopeful: "from-amber-950 via-violet-950 to-black",
  recovering: "from-teal-950 via-amber-950 to-black",
  shadow: "from-indigo-950 via-stone-950 to-black",
  threshold: "from-violet-950 via-amber-950 to-black",
  luminous: "from-violet-950 via-amber-950 to-black",
};

export function LegacyView({ isOpen, onClose, moodState = "luminous", onOpenPassport, onOpenLifeMap, onOpenGround, onTalkToCompanion }: LegacyViewProps) {
  const reduceMotion = useReducedMotion();
  const legacy = useUraiLegacy();

  useEffect(() => {
    if (isOpen) legacy.regenerateLegacy(moodState);
  }, [isOpen, legacy, moodState]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const visibleItems = useMemo(() => legacy.legacyArchive.items.filter((item) => item.visibility !== "sealed"), [legacy.legacyArchive.items]);
  const selectedChapterItems = useMemo(() => {
    if (!legacy.selectedLegacyChapter) return visibleItems;
    return visibleItems.filter((item) => legacy.selectedLegacyChapter?.itemIds.includes(item.id));
  }, [legacy.selectedLegacyChapter, visibleItems]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.section role="dialog" aria-modal="true" aria-label="URAI Legacy" className={`fixed inset-0 z-[70] overflow-hidden bg-gradient-to-b ${toneByMood[moodState]} text-white`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,220,160,0.22),transparent_34%),linear-gradient(180deg,rgba(12,8,20,0.66)_0%,rgba(3,3,8,0.98)_100%)]" />
          <motion.div className="absolute inset-0 opacity-50" animate={reduceMotion ? undefined : { opacity: [0.35, 0.55, 0.35], y: [0, -8, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}>
            <div className="absolute left-1/2 top-[42%] h-[40vh] w-[72vw] -translate-x-1/2 rounded-[50%] border border-amber-100/10 bg-amber-100/[0.025]" />
          </motion.div>

          <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 p-4 md:p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/45">URAI Legacy</p>
              <h2 className="mt-1 text-xl font-medium text-white md:text-2xl">What you choose to carry forward.</h2>
              <p className="mt-1 max-w-xl text-sm text-white/58">Legacy stays closed unless you open it. Nothing is preserved here by default.</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close Legacy" className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/78 backdrop-blur-md">Close</button>
          </header>

          {!legacy.legacyArchive.legacyEnabled ? (
            <div className="absolute inset-0 z-20 grid place-items-center px-4">
              <LegacyConsentGate onOpenLegacy={legacy.confirmLegacyAccess} onKeepClosed={onClose} onReviewPassport={onOpenPassport} />
            </div>
          ) : (
            <main className="absolute inset-0 overflow-auto px-4 pb-40 pt-36 md:px-8 md:pb-24 md:pt-32">
              <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-[minmax(260px,360px)_1fr]">
                <section className="space-y-3" aria-label="Legacy chapters">
                  {legacy.legacyArchive.chapters.length > 0 ? legacy.legacyArchive.chapters.map((chapter) => (
                    <LegacyChapterCard key={chapter.id} chapter={chapter} isSelected={legacy.selectedLegacyChapter?.id === chapter.id} onSelect={legacy.selectLegacyChapter} />
                  )) : (
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-4 text-white/72 backdrop-blur-xl">
                      <p className="text-sm">Legacy is open, but quiet. You can carry moments forward when you choose.</p>
                    </div>
                  )}
                </section>

                <section className="grid gap-3 md:grid-cols-2" aria-label="Legacy items">
                  {selectedChapterItems.length > 0 ? selectedChapterItems.map((item) => (
                    <button key={item.id} type="button" onClick={() => legacy.selectLegacyItem(item.id)} className={`rounded-[1.5rem] border p-4 text-left backdrop-blur-xl transition ${legacy.selectedLegacyItem?.id === item.id ? "border-amber-100/30 bg-amber-100/12" : "border-white/10 bg-white/[0.06] hover:bg-white/[0.09]"}`}>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">{item.type.replace(/_/g, " ")}</p>
                      <h3 className="mt-2 text-base font-medium text-white">{item.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/64">{item.summary}</p>
                      <p className="mt-3 text-[0.68rem] text-white/42">{item.visibility === "sealed" ? "sealed" : item.userApproved ? "approved" : "not approved"}</p>
                    </button>
                  )) : (
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-4 text-white/72 backdrop-blur-xl">
                      <p className="text-sm">No moments have been approved yet.</p>
                    </div>
                  )}
                </section>
              </div>
            </main>
          )}

          <LegacyItemDetail item={legacy.selectedLegacyItem} onClose={legacy.clearSelection} onApprove={legacy.approveLegacyItem} onSeal={legacy.sealLegacyItem} onUnseal={legacy.unsealLegacyItem} onRemove={legacy.removeItemFromLegacy} onOpenPassport={onOpenPassport} onReflect={onTalkToCompanion} onOpenLifeMap={onOpenLifeMap} onOpenGround={onOpenGround} />
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
