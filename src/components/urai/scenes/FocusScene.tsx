'use client';

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";
import { OrbCore } from "@/components/urai/OrbCore";
import { PortalNav } from "@/components/urai/PortalNav";

type FocusMode = "desert" | "storm";

type FocusSceneProps = {
  onNavigate: (scene: UraiScene) => void;
  onReturnHome: () => void;
};

export function FocusScene({ onNavigate, onReturnHome }: FocusSceneProps) {
  const [mode, setMode] = useState<FocusMode>("desert");
  const [isActive, setIsActive] = useState(false);
  const theme = getSceneTheme("focus");
  const shouldReduceMotion = useReducedMotion();
  const isStorm = mode === "storm";

  return (
    <section className="relative z-10 min-h-screen w-full overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: isStorm
              ? "radial-gradient(circle at 50% 38%, rgba(143,215,255,0.20) 0%, rgba(15,23,42,0.38) 42%, rgba(0,0,0,0.64) 100%)"
              : "radial-gradient(circle at 50% 42%, rgba(255,211,138,0.22) 0%, rgba(91,60,37,0.26) 44%, rgba(0,0,0,0.66) 100%)",
          }}
          animate={shouldReduceMotion ? undefined : { opacity: isActive ? [0.74, 1, 0.74] : [0.52, 0.72, 0.52] }}
          transition={{ duration: isStorm ? 4 : 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          className="absolute bottom-[27%] left-1/2 h-[18vh] w-[110vw] -translate-x-1/2 rounded-[100%]"
          style={{
            background: isStorm
              ? "radial-gradient(circle, rgba(143,215,255,0.12) 0%, rgba(255,255,255,0.03) 30%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,211,138,0.18) 0%, rgba(255,255,255,0.05) 32%, transparent 72%)",
          }}
        />

        <div
          className="absolute bottom-[24%] left-1/2 h-px w-[82vw] -translate-x-1/2"
          style={{
            background: isStorm
              ? "linear-gradient(90deg, transparent, rgba(143,215,255,0.42), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,211,138,0.45), transparent)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

        {isStorm && (
          <>
            <motion.div
              className="absolute left-[16%] top-[18%] h-px w-40 rotate-[24deg] bg-cyan-100/50 blur-[1px]"
              animate={shouldReduceMotion ? undefined : { opacity: [0, 0.9, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-[14%] top-[29%] h-px w-52 rotate-[-18deg] bg-cyan-100/40 blur-[1px]"
              animate={shouldReduceMotion ? undefined : { opacity: [0, 0.72, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            />
          </>
        )}

        {!isStorm && (
          <motion.div
            className="absolute left-1/2 top-[36%] h-[38vh] w-[38vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,211,138,0.24) 0%, rgba(255,255,255,0.04) 34%, transparent 70%)" }}
            animate={shouldReduceMotion ? undefined : { opacity: [0.35, 0.62, 0.35], scale: [1, 1.05, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col">
        <div className="flex items-start justify-between gap-6 pt-6">
          <div className="max-w-xl">
            <div></div>
          </div>
          <button
            type="button"
            onClick={onReturnHome}
            className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/75 backdrop-blur-xl transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Home
          </button>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-10">
          <motion.div
            className="relative flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute top-[73%] h-24 w-[136%] rounded-[100%] border border-white/10"
              style={{
                background: isStorm
                  ? "radial-gradient(circle, rgba(143,215,255,0.14) 0%, transparent 72%)"
                  : "radial-gradient(circle, rgba(255,211,138,0.16) 0%, transparent 72%)",
                boxShadow: isStorm ? "0 0 50px rgba(143,215,255,0.32)" : `0 0 44px ${theme.glow}`,
              }}
              animate={shouldReduceMotion ? undefined : { scale: isActive ? [1, 1.08, 1] : [1, 1.03, 1] }}
              transition={{ duration: isActive ? 3 : 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <OrbCore scene="focus" size="large" intensity={isActive ? 1.25 : 0.95} interactive onClick={() => setIsActive((value) => !value)} />

            <div className="relative mt-8 max-w-xl rounded-3xl border border-white/12 bg-black/22 p-5 shadow-2xl backdrop-blur-2xl">
              <p className="text-xs uppercase tracking-[0.28em]" style={{ color: isStorm ? "#8fd7ff" : theme.accent }}>
                {isStorm ? "Storm Focus" : "Desert Focus"}
              </p>

              <p className="mt-3 text-sm leading-6 text-white/65">
                {isStorm ? "Hold the center while the weather moves around you." : "Let the horizon simplify until only the center remains."}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsActive((value) => !value)}
                  className="rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  {isActive ? "Pause" : "Begin"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsActive(false)}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/65 transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  End
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode("desert")}
                  className="rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] transition focus:outline-none focus:ring-2 focus:ring-white/40"
                  style={{
                    borderColor: mode === "desert" ? theme.accent : "rgba(255,255,255,0.14)",
                    background: mode === "desert" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                    color: mode === "desert" ? "#fff" : "rgba(255,255,255,0.58)",
                  }}
                >
                  Desert
                </button>
                <button
                  type="button"
                  onClick={() => setMode("storm")}
                  className="rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] transition focus:outline-none focus:ring-2 focus:ring-white/40"
                  style={{
                    borderColor: mode === "storm" ? "#8fd7ff" : "rgba(255,255,255,0.14)",
                    background: mode === "storm" ? "rgba(143,215,255,0.12)" : "rgba(255,255,255,0.04)",
                    color: mode === "storm" ? "#fff" : "rgba(255,255,255,0.58)",
                  }}
                >
                  Storm
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <PortalNav onNavigate={(scene) => onNavigate(scene)} activeScene="life-map" />
      </div>
    </section>
  );
}
