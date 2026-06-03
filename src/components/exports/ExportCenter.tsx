"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import { useUraiExport } from "@/providers/UraiExportProvider";
import { ExportArtifactPreview } from "./ExportArtifactPreview";
import { ExportPrivacyReview } from "./ExportPrivacyReview";

type ExportCenterProps = {
  isOpen: boolean;
  onClose: () => void;
  moodState?: GenesisMoodState;
  onOpenPassport?: () => void;
};

export function ExportCenter({ isOpen, onClose, moodState = "luminous", onOpenPassport }: ExportCenterProps) {
  const exports = useUraiExport();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.section role="dialog" aria-modal="true" aria-label="URAI Export Scrolls" className="fixed inset-0 z-[80] overflow-hidden bg-gradient-to-b from-slate-950 via-violet-950 to-black text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,220,160,0.18),transparent_32%),linear-gradient(180deg,rgba(6,8,18,0.62)_0%,rgba(2,2,8,0.98)_100%)]" />
          <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 p-4 md:p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/45">URAI Export Scrolls</p>
              <h2 className="mt-1 text-xl font-medium text-white md:text-2xl">Create a beautiful artifact, not a data dump.</h2>
              <p className="mt-1 max-w-xl text-sm text-white/58">Exports are opt-in, reviewed first, and summary-only by default.</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close Export Center" className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/78 backdrop-blur-md">Close</button>
          </header>

          <main className="absolute inset-0 overflow-auto px-4 pb-24 pt-32 md:px-8">
            <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1fr_360px]">
              <ExportArtifactPreview artifact={exports.currentReview?.artifact ?? null} templateId={exports.currentReview?.artifact.includesShadow ? "shadow_soft" : exports.currentReview?.artifact.sourceType === "legacy" ? "legacy_archive" : exports.currentReview?.artifact.sourceType === "ground" ? "ground_bloom" : exports.currentReview?.artifact.sourceType === "mirror" ? "mirror_glass" : "celestial_scroll"} />
              <div className="space-y-4">
                <ExportPrivacyReview review={exports.currentReview} onApprove={exports.approveCurrentExport} onOpenPassport={onOpenPassport} />
                <section className="rounded-[1.75rem] border border-white/10 bg-black/28 p-4 text-white/70 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Created locally</p>
                  <p className="mt-2 text-sm">{exports.exportedArtifacts.length} artifact{exports.exportedArtifacts.length === 1 ? "" : "s"} approved this session.</p>
                  <p className="mt-2 text-xs leading-5 text-white/50">Download/PDF rendering can connect to this artifact structure next. No raw source data is stored here.</p>
                </section>
              </div>
            </div>
          </main>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
