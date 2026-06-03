"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useUraiShadow } from "@/providers/UraiShadowProvider";
import { ShadowReflectionCard } from "./ShadowReflectionCard";
import { ShadowReflectionDetail } from "./ShadowReflectionDetail";

type ShadowRealmViewProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenGround?: () => void;
  onOpenPassport?: () => void;
  onTalkToGuardian?: () => void;
};

export function ShadowRealmView({ isOpen, onClose, onOpenGround, onOpenPassport, onTalkToGuardian }: ShadowRealmViewProps) {
  const reduceMotion = useReducedMotion();
  const shadow = useUraiShadow();

  useEffect(() => {
    if (isOpen) shadow.regenerateShadow();
  }, [isOpen, shadow]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const visibleReflections = useMemo(() => shadow.shadowSession.reflections.filter((reflection) => reflection.visibility !== "hidden"), [shadow.shadowSession.reflections]);
  const sealed = !shadow.shadowSession.shadowConsentConfirmed;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.section role="dialog" aria-modal="true" aria-label="URAI Shadow Realm" className="fixed inset-0 z-[70] overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-black text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(115,106,180,0.22),transparent_34%),linear-gradient(180deg,rgba(6,8,18,0.72)_0%,rgba(2,3,8,0.98)_100%)]" />
          <motion.div className="absolute inset-0 opacity-45" animate={reduceMotion ? undefined : { opacity: [0.3, 0.48, 0.3], scale: [1, 1.018, 1] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}>
            <div className="absolute left-1/2 top-[42%] h-[38vh] w-[70vw] -translate-x-1/2 rounded-[50%] border border-white/8 bg-white/[0.025]" />
          </motion.div>

          <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 p-4 md:p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/45">URAI Shadow</p>
              <h2 className="mt-1 text-xl font-medium text-white md:text-2xl">A protected space. Not a judgment.</h2>
              <p className="mt-1 max-w-xl text-sm text-white/58">Shadow stays sealed unless you explicitly open it in Passport. You can soften or hide anything here.</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close Shadow Realm" className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/78 backdrop-blur-md">Close</button>
          </header>

          <div className="pointer-events-auto absolute inset-x-4 top-[6.25rem] z-30 flex gap-2 overflow-x-auto md:left-6 md:right-auto md:top-auto md:bottom-6">
            {(["sealed", "soft", "clear", "guardian"] as const).map((mode) => (
              <button key={mode} type="button" onClick={() => shadow.setViewMode(mode)} className={`rounded-full px-3 py-2 text-xs backdrop-blur-md ${shadow.viewMode === mode ? "bg-white/18 text-white" : "bg-white/[0.07] text-white/62"}`}>{mode}</button>
            ))}
          </div>

          {sealed ? (
            <aside className="pointer-events-auto absolute left-1/2 top-1/2 z-20 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/10 bg-black/34 p-5 text-white/78 shadow-2xl backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Sealed by Passport</p>
              <h3 className="mt-2 text-lg font-medium text-white">Shadow is closed for now.</h3>
              <p className="mt-3 text-sm leading-6 text-white/68">Nothing difficult is being reflected here unless you explicitly open Shadow. This safe preview does not contain personal difficult-pattern claims.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={onOpenPassport} className="rounded-full bg-sky-200/15 px-3 py-2 text-xs text-white/84">Open Passport</button>
                <button type="button" onClick={() => shadow.setViewMode("soft")} className="rounded-full bg-white/[0.07] px-3 py-2 text-xs text-white/64">Open safe preview</button>
              </div>
            </aside>
          ) : null}

          <main className="absolute inset-0 overflow-auto px-4 pb-40 pt-40 md:px-8 md:pb-24 md:pt-32">
            <div className="mx-auto grid max-w-5xl gap-3 md:grid-cols-2 lg:grid-cols-3">
              {visibleReflections.map((reflection) => <ShadowReflectionCard key={reflection.id} reflection={reflection} viewMode={shadow.viewMode} isSelected={shadow.selectedReflection?.id === reflection.id} onSelect={shadow.selectReflection} />)}
            </div>
          </main>

          <ShadowReflectionDetail reflection={shadow.selectedReflection} viewMode={shadow.viewMode} onClose={shadow.clearSelectedReflection} onOpenGround={onOpenGround} onOpenPassport={onOpenPassport} onTalkToGuardian={onTalkToGuardian} onSoften={shadow.softenSelectedReflection} onHide={shadow.hideSelectedReflection} />
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
