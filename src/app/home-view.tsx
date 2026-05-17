"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import OrbChatDrawer from "@/components/orb/OrbChatDrawer";

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
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4 text-sm text-white/80">
          <span>{statusMessage}</span>
          <Button variant="secondary">Local-Only</Button>
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-center gap-8 py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={statusIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative h-64 w-64">
                {HERO_IMAGES.map((image, index) => (
                  <motion.video
                    key={image.src}
                    className="absolute inset-0 h-full w-full rounded-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    initial={{ opacity: 0 }}
                    animate={{ opacity: statusIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.6 }}
                    src={image.src}
                  />
                ))}
              </div>

              <div className="flex flex-col items-center gap-4">
                <motion.button
                  type="button"
                  aria-label="Open URAI Orb"
                  onClick={() => setOrbOpen(true)}
                  className="relative flex h-24 w-24 items-center justify-center rounded-full border border-sky-300/30 bg-sky-400/20"
                  animate={{
                    scale: orbState === "open" ? 1.08 : [1, 1.12, 1],
                    boxShadow:
                      orbState === "open"
                        ? "0 0 60px rgba(56,189,248,0.55)"
                        : [
                            "0 0 0 0 rgba(56,189,248,0.55)",
                            "0 0 0 24px rgba(56,189,248,0)",
                            "0 0 0 0 rgba(56,189,248,0)",
                          ],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-2 rounded-full bg-sky-300/30 blur-md" />
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
                    Tap the sky
                  </Button>
                </div>

                <p className="max-w-md text-center text-sm text-white/55">
                  Your orb remembers rhythm, mood, recovery, and emotional patterns over time.
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

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
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
