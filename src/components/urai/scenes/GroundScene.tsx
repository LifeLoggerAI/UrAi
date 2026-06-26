'use client';

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";
import { useUraiAudio } from "@/providers/UraiAudioProvider";
import { OrbCore } from "@/components/urai/OrbCore";
import { PortalNav } from "@/components/urai/PortalNav";
import { SceneIntro } from "@/components/urai/SceneIntro";

type GroundSceneProps = {
  onNavigate: (scene: UraiScene) => void;
  onReturnHome: () => void;
};

const lanterns = [
  { x: 17, y: 69, delay: 0 },
  { x: 28, y: 63, delay: 0.7 },
  { x: 71, y: 64, delay: 1.2 },
  { x: 83, y: 70, delay: 1.8 },
  { x: 52, y: 58, delay: 2.2 },
];

export function GroundScene({ onNavigate, onReturnHome }: GroundSceneProps) {
  const theme = getSceneTheme("ground");
  const shouldReduceMotion = useReducedMotion();
  const audio = useUraiAudio();

  useEffect(() => {
    if (!audio.settings.enabled || !audio.isUnlocked || audio.settings.reducedSensoryMode) return;
    void audio.playLoop("ground-soft-loop", { category: "ambient", volume: 0.14, fadeMs: 1600 });
    return () => {
      void audio.stopLoop("ground-soft-loop", { fadeMs: 1400 });
    };
  }, [audio, audio.isUnlocked, audio.settings.enabled, audio.settings.reducedSensoryMode]);

  return (
    <section className="relative z-10 min-h-screen w-full overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-[48%] h-[74vh] w-[84vw] -translate-x-1/2 -translate-y-1/2 rounded-[100%] blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(113,209,196,0.18) 0%, rgba(243,184,106,0.16) 34%, transparent 70%)" }}
          animate={shouldReduceMotion ? undefined : { opacity: [0.42, 0.68, 0.42], scale: [1, 1.04, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute inset-x-0 bottom-[31%] h-[18vh] bg-gradient-to-t from-black/20 via-teal-900/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-[24%] h-[18vh]">
          <div className="absolute bottom-0 left-[8%] h-28 w-48 rounded-t-[3rem] bg-black/35 blur-[1px]" />
          <div className="absolute bottom-0 left-[24%] h-36 w-32 rounded-t-[2.5rem] bg-black/40 blur-[1px]" />
          <div className="absolute bottom-0 right-[10%] h-32 w-56 rounded-t-[3rem] bg-black/35 blur-[1px]" />
          <div className="absolute bottom-0 right-[31%] h-24 w-28 rounded-t-[2.2rem] bg-black/35 blur-[1px]" />
          <div className="absolute bottom-0 left-1/2 h-20 w-[54vw] -translate-x-1/2 rounded-t-full bg-black/30 blur-sm" />
        </div>

        <div
          className="absolute bottom-[19%] left-1/2 h-[20vh] w-[88vw] -translate-x-1/2 rounded-[100%] border border-teal-100/10"
          style={{ background: "radial-gradient(circle, rgba(113,209,196,0.18) 0%, rgba(255,255,255,0.05) 34%, rgba(0,0,0,0.28) 72%)", boxShadow: "inset 0 0 40px rgba(255,255,255,0.05)" }}
        />

        <motion.div
          className="absolute bottom-[17%] left-1/2 h-[16vh] w-[78vw] -translate-x-1/2 rounded-[100%]"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(113,209,196,0.12), rgba(0,0,0,0.22))" }}
          animate={shouldReduceMotion ? undefined : { opacity: [0.32, 0.55, 0.32] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute bottom-[12%] left-1/2 h-2 w-[64vw] -translate-x-1/2 rounded-full bg-amber-100/10 blur-md" />

        {lanterns.map((lantern, index) => (
          <motion.span
            key={index}
            className="absolute h-2.5 w-2.5 rounded-full"
            style={{ left: `${lantern.x}%`, top: `${lantern.y}%`, background: theme.accent, boxShadow: `0 0 24px ${theme.glow}, 0 0 48px rgba(243,184,106,0.28)` }}
            animate={shouldReduceMotion ? undefined : { opacity: [0.4, 1, 0.4], scale: [1, 1.35, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: lantern.delay }}
          />
        ))}

        <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col">
        <div className="flex items-start justify-between gap-6 pt-6">
          <div className="max-w-xl">
            <SceneIntro
              eyebrow="Ground"
              title="A living terrain for your emotional field."
              subtitle="Signals settle here as texture, rhythm, and quiet recovery."
            />
          </div>
          <button type="button" onClick={onReturnHome} className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/75 backdrop-blur-xl transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40">Home</button>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-10">
          <motion.div className="relative flex flex-col items-center justify-center text-center" initial={{ opacity: 0, y: 18, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
            <div className="absolute top-[72%] h-24 w-[145%] rounded-[100%] border border-teal-100/10" style={{ background: "radial-gradient(circle, rgba(113,209,196,0.18) 0%, rgba(243,184,106,0.12) 32%, transparent 72%)", boxShadow: `0 0 44px ${theme.glow}` }} />
            <OrbCore scene="ground" size="large" intensity={0.95} />
            <div className="relative mt-8 max-w-xl rounded-3xl border border-white/12 bg-black/20 p-5 shadow-2xl backdrop-blur-2xl">
              <p className="text-xs uppercase tracking-[0.28em]" style={{ color: theme.accent }}>Sanctuary Signal</p>
              <p className="mt-3 text-sm leading-6 text-white/65">This is the place URAI returns to when the world needs to feel held, warm, and human again.</p>
              <button type="button" className="mt-5 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40">Begin grounding</button>
            </div>
          </motion.div>
        </div>

        <PortalNav onNavigate={onNavigate} activeScene="life-map" />
      </div>
    </section>
  );
}
