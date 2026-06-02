"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";
import { OrbCore } from "@/components/urai/OrbCore";
import { PortalNav } from "@/components/urai/PortalNav";
import { SceneCopy } from "@/components/urai/SceneCopy";

type HomeSceneProps = {
  onNavigate: (scene: UraiScene) => void;
  onOpenOrbChat?: () => void;
};

const homeStars = [
  { x: 18, y: 22, s: 2 },
  { x: 28, y: 34, s: 1 },
  { x: 39, y: 18, s: 2 },
  { x: 53, y: 26, s: 1 },
  { x: 64, y: 15, s: 2 },
  { x: 74, y: 33, s: 1 },
  { x: 82, y: 20, s: 2 },
  { x: 44, y: 43, s: 1 },
  { x: 58, y: 41, s: 1 },
];

const constellationLines = [
  { left: "18%", top: "22%", width: "16%", rotate: 28 },
  { left: "39%", top: "19%", width: "15%", rotate: 15 },
  { left: "63%", top: "16%", width: "18%", rotate: 35 },
  { left: "44%", top: "43%", width: "14%", rotate: -5 },
];

export function HomeScene({ onNavigate, onOpenOrbChat }: HomeSceneProps) {
  const theme = getSceneTheme("home");
  const shouldReduceMotion = useReducedMotion();

  const handleOrbClick = () => {
    if (onOpenOrbChat) {
      onOpenOrbChat();
      return;
    }
    onNavigate("life-map");
  };

  return (
    <section className="relative z-10 flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-[18%] h-[54vh] w-[76vw] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(159,183,255,0.24) 0%, rgba(248,217,139,0.14) 32%, transparent 68%)" }}
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.04, 1], opacity: [0.42, 0.62, 0.42] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute inset-x-0 top-[8%] h-[46vh] opacity-40">
          {homeStars.map((star, index) => (
            <motion.span
              key={index}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.s + 1,
                height: star.s + 1,
                boxShadow: `0 0 18px ${index % 2 === 0 ? theme.glow : "rgba(255,255,255,0.5)"}`,
              }}
              animate={shouldReduceMotion ? undefined : { opacity: [0.25, 0.9, 0.25], scale: [1, 1.35, 1] }}
              transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          {constellationLines.map((line, index) => (
            <motion.span
              key={`line-${index}`}
              className="absolute h-px origin-left bg-gradient-to-r from-transparent via-amber-200/40 to-transparent"
              style={{ left: line.left, top: line.top, width: line.width, transform: `rotate(${line.rotate}deg)` }}
              animate={shouldReduceMotion ? undefined : { opacity: [0.08, 0.38, 0.08] }}
              transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-[10%] h-[24vh]">
          <div className="absolute bottom-0 left-[8%] h-24 w-40 rounded-t-full bg-black/30 blur-sm" />
          <div className="absolute bottom-0 right-[10%] h-28 w-52 rounded-t-full bg-black/30 blur-sm" />
          <div className="absolute bottom-4 left-[22%] h-16 w-12 rounded-t-2xl bg-black/35" />
          <div className="absolute bottom-4 right-[24%] h-20 w-14 rounded-t-2xl bg-black/35" />
          <div className="absolute bottom-8 left-[18%] h-2 w-2 rounded-full" style={{ background: theme.accent, boxShadow: `0 0 18px ${theme.glow}` }} />
          <div className="absolute bottom-12 right-[21%] h-2 w-2 rounded-full" style={{ background: theme.accent, boxShadow: `0 0 18px ${theme.glow}` }} />
        </div>

        <div className="absolute bottom-[14%] left-1/2 h-20 w-[58vw] -translate-x-1/2 rounded-[100%] blur-2xl" style={{ background: `radial-gradient(circle, ${theme.glow} 0%, transparent 68%)`, opacity: 0.45 }} />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center">
        <SceneCopy scene="home" />

        <motion.div
          className="relative mt-10 flex items-center justify-center"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute top-[74%] h-24 w-[130%] rounded-[100%] border border-amber-100/10" style={{ background: "radial-gradient(circle, rgba(248,217,139,0.16) 0%, rgba(255,255,255,0.04) 32%, transparent 70%)", boxShadow: `0 0 38px ${theme.glow}` }} />
          <div className="absolute top-[82%] h-12 w-[95%] rounded-[100%] border border-white/10" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 68%)" }} />
          <OrbCore scene="home" size="hero" interactive onClick={handleOrbClick} />
        </motion.div>

        <PortalNav activeScene="home" onNavigate={onNavigate} onReturnHome={() => onNavigate("home")} />
      </div>
    </section>
  );
}
