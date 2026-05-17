"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import OrbChatDrawer from "@/components/orb/OrbChatDrawer";
import ImmersiveWorld3D from "@/components/urai/world/ImmersiveWorld3D";

const STATUS_MESSAGES = [
  "Calibrating constellations…",
  "Warming the aurora…",
  "Listening for whispers…",
  "Mapping your horizon…",
  "Synchronizing with your rhythm…",
];

const HERO_IMAGES = [
  { src: "/assets/sky/sky-demo.mp4", alt: "Sky energy" },
  { src: "/assets/avatar/avatar-demo.mp4", alt: "Aurora avatar" },
  { src: "/assets/ground/ground-demo.mp4", alt: "Ground energy" },
];

export default function HomeView(): React.ReactElement {
  const [statusIndex, setStatusIndex] = useState(0);
  const [orbOpen, setOrbOpen] = useState(false);
  const [orbState, setOrbState] = useState<"idle" | "pulse" | "open">("pulse");

  const statusMessage = useMemo(() => STATUS_MESSAGES[statusIndex], [statusIndex]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStatusIndex((previous) => (previous + 1) % STATUS_MESSAGES.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setOrbState(orbOpen ? "open" : "pulse");
  }, [orbOpen]);

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-black text-white">
        <ImmersiveWorld3D mode="home" activeLabel={statusMessage} selectedLabel={orbOpen ? "Origin Orb" : undefined} />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black via-transparent to-black/70" />

        <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-4 text-sm text-white/80">
          <span>{statusMessage}</span>
          <Button variant="secondary">Local-Only</Button>
        </div>

        <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center gap-8 py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={statusIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative h-64 w-64 rounded-full border border-cyan-100/10 bg-slate-950/20 shadow-[0_0_120px_rgba(125,211,252,.16)] backdrop-blur-[1px]">
                {HERO_IMAGES.map((image, index) => (
                  <motion.video
                    key={image.src}
                    className="absolute inset-0 h-full w-full rounded-full object-cover mix-blend-screen"
                    autoPlay
                    muted
                    loop
                    playsInline
                    initial={{ opacity: 0 }}
                    animate={{ opacity: statusIndex === index ? 0.62 : 0 }}
                    transition={{ duration: 0.6 }}
                    src={image.src}
                  />
                ))}
                <div className="absolute inset-8 rounded-full bg-cyan-100/10 blur-2xl" />
              </div>

              <div className="flex flex-col items-center gap-4">
                <motion.button
                  type="button"
                  aria-label="Open URAI Orb"
                  onClick={() => setOrbOpen(true)}
                  className="relative flex h-24 w-24 items-center justify-center rounded-full border border-sky-100/40 bg-sky-300/15 shadow-[0_0_80px_rgba(125,211,252,.28)] backdrop-blur-md"
                  animate={{
                    scale: orbState === "open" ? 1.08 : [1, 1.12, 1],
                    boxShadow:
                      orbState === "open"
                        ? "0 0 84px rgba(224,242,254,0.68)"
                        : [
                            "0 0 0 0 rgba(56,189,248,0.55)",
                            "0 0 0 24px rgba(56,189,248,0)",
                            "0 0 0 0 rgba(56,189,248,0)",
                          ],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-2 rounded-full bg-sky-200/35 blur-md" />
                  <div className="relative z-10 text-xs uppercase tracking-[0.25em] text-white/90">
                    Orb
                  </div>
                </motion.button>

                <div className="flex items-center gap-3">
                  <Button variant="primary" onClick={() => setOrbOpen(true)}>
                    Talk to URAI
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      window.location.href = "/life-map";
                    }}
                  >
                    Enter Life Map
                  </Button>
                </div>

                <p className="max-w-md text-center text-sm text-white/65">
                  Move your pointer to feel the world shift around your orb. Enter the Life Map to fly through memory, recovery, purpose, and legacy.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 mb-12 flex gap-4">
          <Chip>Mirror</Chip>
          <Chip>Narrator</Chip>
          <Chip>Orb Chat</Chip>
          <Chip>Rituals</Chip>
        </div>
      </div>

      <OrbChatDrawer
        open={orbOpen}
        onClose={() => setOrbOpen(false)}
        context={{
          todayMoodState: "focused but overloaded",
          mentalLoadScore: 0.72,
          rhythmState: "high momentum",
          lastNarratorInsight:
            "You've been moving fast for a long time without fully dropping the pressure.",
          recentTimelineEvents: [
            "Late-night coding streak",
            "Launch planning",
            "Architecture expansion",
          ],
          relationshipSignals: ["high collaboration", "low recovery time"],
          userTonePreference: "direct",
        }}
      />
    </>
  );
}
