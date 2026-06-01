"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import OrbChatDrawer from "@/components/orb/OrbChatDrawer";
import ImmersiveWorld3D from "@/components/urai/world/ImmersiveWorld3D";
import { URAI_CONSENT_CATEGORIES, getEnabledConsentCategories, setAllConsentCategories, setConsentCategory } from "@/lib/urai/consent";
import { createDefaultGenesisHomeState } from "@/lib/urai/genesis";
import type { UraiConsentCategory } from "@/lib/urai/types";

const USER_ID = "local-genesis-user";

export default function HomeView(): React.ReactElement {
  const initialState = useMemo(() => createDefaultGenesisHomeState(USER_ID), []);
  const [homeState, setHomeState] = useState(initialState);
  const [orbOpen, setOrbOpen] = useState(false);
  const [controlOpen, setControlOpen] = useState(false);
  const [passportOpen, setPassportOpen] = useState(false);
  const [selectedStarId, setSelectedStarId] = useState<string | null>(null);

  const latestReflection = homeState.latestReflections[0];
  const selectedStar = homeState.memoryStars.find((star) => star.id === selectedStarId);
  const selectedReflection = homeState.latestReflections.find(
    (reflection) => reflection.id === selectedStar?.reflectionId,
  );
  const enabledCategories = getEnabledConsentCategories(homeState.consent);

  function toggleConsent(category: UraiConsentCategory, enabled: boolean): void {
    setHomeState((current) => ({
      ...current,
      consent: setConsentCategory(current.consent, category, enabled),
    }));
  }

  function toggleAllConsent(enabled: boolean): void {
    setHomeState((current) => ({
      ...current,
      consent: setAllConsentCategories(current.consent, enabled),
    }));
  }

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-black text-white">
        <ImmersiveWorld3D
          mode="home"
          activeLabel={latestReflection?.title ?? "Genesis"}
          selectedLabel={orbOpen ? "Origin Orb" : selectedStar?.label}
        />

        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_18%,rgba(125,211,252,0.22),transparent_28%),linear-gradient(to_top,rgba(0,0,0,0.95),transparent_48%,rgba(0,0,0,0.72))]" />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_20%_36%,rgba(45,212,191,0.12),transparent_22%),radial-gradient(circle_at_78%_26%,rgba(168,85,247,0.14),transparent_24%)]" />

        <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-4 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(125,211,252,.85)]" />
            <span>Genesis</span>
          </div>
          <Button variant="secondary" onClick={() => setPassportOpen(true)}>
            Passport
          </Button>
        </header>

        <section className="relative z-10 flex w-full flex-1 flex-col items-center justify-center gap-8 px-5 py-20 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={latestReflection?.id ?? "genesis"}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.55 }}
              className="flex w-full flex-col items-center gap-7"
            >
              <button
                type="button"
                aria-label="Open URAI Orb"
                onClick={() => setOrbOpen(true)}
                className="group relative flex h-52 w-52 items-center justify-center rounded-full border border-cyan-100/20 bg-slate-950/20 shadow-[0_0_120px_rgba(125,211,252,.18)] backdrop-blur-[2px] md:h-64 md:w-64"
              >
                <motion.div
                  className="absolute inset-0 rounded-full border border-white/15"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-8 rounded-full bg-cyan-100/10 blur-2xl"
                  animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.88, 0.55] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="relative h-24 w-24 rounded-full border border-sky-100/40 bg-sky-300/15 shadow-[0_0_80px_rgba(125,211,252,.34)] backdrop-blur-md md:h-28 md:w-28"
                  animate={{
                    scale: orbOpen ? 1.08 : [1, 1.09, 1],
                    boxShadow: orbOpen
                      ? "0 0 86px rgba(224,242,254,0.68)"
                      : [
                          "0 0 0 0 rgba(56,189,248,0.46)",
                          "0 0 0 24px rgba(56,189,248,0)",
                          "0 0 0 0 rgba(56,189,248,0)",
                        ],
                  }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="absolute inset-3 rounded-full bg-sky-100/30 blur-md" />
                  <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,.9),transparent_16%),radial-gradient(circle_at_50%_52%,rgba(125,211,252,.75),rgba(168,85,247,.35)_60%,transparent)]" />
                </motion.div>
              </button>

              <div className="max-w-2xl rounded-[2rem] border border-white/10 bg-black/35 p-5 shadow-[0_24px_100px_rgba(0,0,0,.42)] backdrop-blur-xl md:p-7">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/75">
                  URAI is awake
                </p>
                <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white md:text-7xl">
                  {latestReflection?.title ?? "Your map is beginning"}
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/68 md:text-base">
                  {latestReflection?.body ?? "URAI is preparing your first private life-map signal."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button variant="primary" onClick={() => setOrbOpen(true)}>
                  Talk to URAI
                </Button>
                <Button variant="secondary" onClick={() => setControlOpen(true)}>
                  Permissions
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
            </motion.div>
          </AnimatePresence>
        </section>

        <section className="pointer-events-none absolute inset-0 z-[6]" aria-label="Memory stars">
          {homeState.memoryStars.map((star) => (
            <button
              key={star.id}
              type="button"
              aria-label={`Open memory star: ${star.label}`}
              onClick={() => setSelectedStarId(star.id)}
              className="pointer-events-auto absolute h-2.5 w-2.5 rounded-full border-0"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                background: star.auraColor,
                boxShadow: `0 0 ${22 + star.magnitude * 28}px ${star.auraColor}`,
                transform: `scale(${0.85 + star.magnitude})`,
              }}
            />
          ))}
        </section>

        <footer className="relative z-10 mb-12 flex flex-wrap justify-center gap-3 px-4">
          <Chip>Mirror</Chip>
          <Chip>Narrator</Chip>
          <Chip>Passport</Chip>
          <Chip>Life Map</Chip>
        </footer>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] h-[32vh] bg-[radial-gradient(ellipse_at_50%_100%,rgba(118,255,190,.2),transparent_42%),linear-gradient(to_bottom,transparent,rgba(5,13,10,.96))]" />
      </div>

      <AnimatePresence>
        {selectedStar && (
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="fixed bottom-24 right-4 z-30 w-[min(420px,calc(100vw-2rem))] rounded-[1.75rem] border border-white/15 bg-slate-950/85 p-5 text-white shadow-[0_24px_100px_rgba(0,0,0,.55)] backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/70">
                  {selectedStar.constellation ?? "Memory"}
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.04em]">{selectedStar.label}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStarId(null)}
                aria-label="Close memory star"
                className="rounded-full bg-white/10 px-3 py-1 text-xl"
              >
                x
              </button>
            </div>
            {selectedReflection && <p className="mt-3 text-sm leading-7 text-white/68">{selectedReflection.body}</p>}
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {controlOpen && (
          <motion.aside
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }}
            className="fixed right-4 top-4 z-30 max-h-[calc(100svh-2rem)] w-[min(460px,calc(100vw-2rem))] overflow-auto rounded-[1.75rem] border border-white/15 bg-slate-950/88 p-5 text-white shadow-[0_24px_100px_rgba(0,0,0,.55)] backdrop-blur-xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/70">
                  Control center
                </p>
                <h2 className="text-3xl font-semibold tracking-[-0.05em]">Permissions</h2>
              </div>
              <button
                type="button"
                onClick={() => setControlOpen(false)}
                aria-label="Close permissions"
                className="rounded-full bg-white/10 px-3 py-1 text-xl"
              >
                x
              </button>
            </div>

            <label className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <span>
                <strong className="block">Enable Genesis permissions</strong>
                <small className="mt-1 block text-white/60">You stay in control of what URAI can use.</small>
              </span>
              <input
                type="checkbox"
                checked={homeState.consent.allEnabled}
                onChange={(event) => toggleAllConsent(event.target.checked)}
                className="h-5 w-5 accent-cyan-200"
              />
            </label>

            <div className="grid gap-3">
              {URAI_CONSENT_CATEGORIES.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4"
                >
                  <span>
                    <strong className="block">{category.label}</strong>
                    <small className="mt-1 block leading-5 text-white/58">{category.description}</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={homeState.consent.categories[category.id]}
                    onChange={(event) => toggleConsent(category.id, event.target.checked)}
                    className="h-5 w-5 accent-cyan-200"
                  />
                </label>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {passportOpen && (
          <motion.aside
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }}
            className="fixed right-4 top-4 z-30 max-h-[calc(100svh-2rem)] w-[min(420px,calc(100vw-2rem))] overflow-auto rounded-[1.75rem] border border-white/15 bg-slate-950/88 p-5 text-white shadow-[0_24px_100px_rgba(0,0,0,.55)] backdrop-blur-xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/70">
                  URAI Passport
                </p>
                <h2 className="text-3xl font-semibold tracking-[-0.05em]">Your control layer</h2>
              </div>
              <button
                type="button"
                onClick={() => setPassportOpen(false)}
                aria-label="Close Passport"
                className="rounded-full bg-white/10 px-3 py-1 text-xl"
              >
                x
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Current mode</p>
              <h3 className="mt-2 text-2xl font-semibold capitalize">{homeState.passport.shareMode}</h3>
              <p className="mt-2 text-sm leading-6 text-white/62">
                Private means nothing is shared outward from URAI. Passport keeps your permission state visible.
              </p>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-semibold">Enabled inputs</h3>
              {enabledCategories.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2 p-0">
                  {enabledCategories.map((category) => (
                    <li key={category} className="list-none rounded-full bg-cyan-100/12 px-3 py-1 text-sm text-cyan-50/90">
                      {category}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-white/58">No inputs are enabled yet.</p>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <OrbChatDrawer
        open={orbOpen}
        onClose={() => setOrbOpen(false)}
        context={{
          todayMoodState: homeState.moodWeather.moodBlend.join(" + "),
          mentalLoadScore: homeState.moodWeather.intensity,
          rhythmState: homeState.moodWeather.skyState,
          lastNarratorInsight: latestReflection?.body,
          recentTimelineEvents: homeState.latestSignals.map((signal) => signal.title ?? signal.contextLabel ?? signal.source),
          relationshipSignals: enabledCategories,
          userTonePreference: "direct",
        }}
      />
    </>
  );
}
