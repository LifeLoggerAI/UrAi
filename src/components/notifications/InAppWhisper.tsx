"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useUraiNotifications } from "@/providers/UraiNotificationProvider";

type InAppWhisperProps = {
  onOpenCompanion?: () => void;
  onOpenGround?: () => void;
  onOpenRitual?: () => void;
  onOpenPassport?: () => void;
  onOpenLifeMap?: () => void;
  onOpenMirror?: () => void;
  onOpenShadow?: () => void;
  onOpenLegacy?: () => void;
};

export function InAppWhisper({ onOpenCompanion, onOpenGround, onOpenRitual, onOpenPassport, onOpenLifeMap, onOpenMirror, onOpenShadow, onOpenLegacy }: InAppWhisperProps) {
  const reduceMotion = useReducedMotion();
  const notifications = useUraiNotifications();
  const whisper = notifications.activeWhisper;

  useEffect(() => {
    if (!whisper) return;
    const timeout = window.setTimeout(() => notifications.dismissNotification(whisper.id), notifications.timingProfile.reducedNotificationMode ? 9000 : 6500);
    return () => window.clearTimeout(timeout);
  }, [notifications, whisper]);

  const runAction = () => {
    if (!whisper?.action) return;
    if (whisper.action.type === "open_companion") onOpenCompanion?.();
    if (whisper.action.type === "open_ground") onOpenGround?.();
    if (whisper.action.type === "open_ritual") onOpenRitual?.();
    if (whisper.action.type === "open_passport") onOpenPassport?.();
    if (whisper.action.type === "open_life_map") onOpenLifeMap?.();
    if (whisper.action.type === "open_mirror") onOpenMirror?.();
    if (whisper.action.type === "open_shadow") onOpenShadow?.();
    if (whisper.action.type === "open_legacy") onOpenLegacy?.();
    notifications.dismissNotification(whisper.id);
  };

  return (
    <AnimatePresence>
      {whisper ? (
        <motion.aside
          role="status"
          aria-live="polite"
          className="pointer-events-auto fixed bottom-6 right-4 z-[95] w-[min(360px,calc(100vw-2rem))] rounded-[1.5rem] border border-white/12 bg-black/42 p-4 text-white shadow-2xl backdrop-blur-xl"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.98 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/42">Whisper</p>
              <h3 className="mt-1 text-sm font-medium text-white">{whisper.title}</h3>
              <p className="mt-1 text-sm leading-5 text-white/66">{whisper.body}</p>
            </div>
            <button type="button" aria-label="Dismiss whisper" onClick={() => notifications.dismissNotification(whisper.id)} className="rounded-full bg-white/10 px-2 py-1 text-white/66">×</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {whisper.action && whisper.action.type !== "none" ? <button type="button" onClick={runAction} className="rounded-full bg-white/12 px-3 py-2 text-xs text-white/82">{whisper.action.label}</button> : null}
            <button type="button" onClick={() => notifications.snoozeNotification(whisper.id)} className="rounded-full bg-white/[0.07] px-3 py-2 text-xs text-white/58">Later</button>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
