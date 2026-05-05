"use client";

import { useEffect, useState } from "react";
import GroundLayer from "@/components/GroundLayer";
import { sendCognitiveMirrorEvent, fetchLatestInsight } from "@/lib/uraiPipeline";
import { speakNarrator } from "@/lib/narratorVoice";

export default function HomeScene() {
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [revealing, setRevealing] = useState(false);

  const loadInsight = async () => {
    try {
      const res = await fetchLatestInsight();
      setInsight(res.insight);
      if (res?.insight?.summary) {
        speakNarrator(res.insight.summary, "calm");
      }
    } catch {
      setInsight(null);
    }
  };

  const triggerEvent = async () => {
    setLoading(true);
    setRevealing(true);

    try {
      const res: any = await sendCognitiveMirrorEvent();
      if (res?.insight) {
        setInsight(res.insight);
        speakNarrator(res.insight.summary, "curious");
      }
    } finally {
      setLoading(false);
      window.setTimeout(() => setRevealing(false), 1800);
    }
  };

  useEffect(() => {
    loadInsight();
  }, []);

  const summary = insight?.summary || "Tap the mirror. URAI will listen for a signal and reflect the first pattern back.";

  return (
    <div className="relative w-full h-dvh bg-black overflow-hidden text-white">
      <video
        src="/assets/sky/sky-demo.mp4"
        autoPlay
        muted
        loop
        className={`absolute inset-0 w-full h-full object-cover transition duration-1000 ${revealing ? "scale-105 brightness-125" : "scale-100 brightness-100"}`}
      />

      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.24),rgba(88,80,255,0.12),rgba(0,0,0,0.72))] transition-opacity duration-1000 ${revealing ? "opacity-100" : "opacity-55"}`} />
      <div className={`absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 blur-sm transition duration-1000 ${revealing ? "scale-125 opacity-80" : "scale-75 opacity-20"}`} />

      <GroundLayer />

      <video
        src="/assets/avatar/avatar-demo.mp4"
        autoPlay
        muted
        loop
        className={`absolute inset-0 w-full h-full object-contain transition duration-700 ${revealing ? "drop-shadow-[0_0_40px_rgba(255,255,255,0.65)]" : ""}`}
      />

      <div className="absolute left-1/2 top-10 -translate-x-1/2 text-center tracking-[0.35em] text-[10px] uppercase text-white/70">
        URAI Cognitive Mirror
      </div>

      <div className={`absolute bottom-20 left-1/2 w-[340px] -translate-x-1/2 rounded-3xl border border-white/20 bg-black/65 p-5 shadow-2xl backdrop-blur-xl transition duration-700 ${revealing ? "scale-105 border-white/60 shadow-white/20" : "scale-100"}`}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-white/50">Cognitive Mirror</div>
            <div className="mt-1 text-lg font-semibold">{loading ? "Reading the signal..." : "Reflection ready"}</div>
          </div>
          <div className={`h-3 w-3 rounded-full bg-white ${loading || revealing ? "animate-ping" : "opacity-40"}`} />
        </div>

        <div className="min-h-24 rounded-2xl border border-white/10 bg-white/8 p-4 text-sm leading-relaxed text-white/90">
          {summary}
        </div>

        <button
          onClick={triggerEvent}
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? "Pattern forming..." : "Pulse the Mirror"}
        </button>

        <div className="mt-3 text-center text-[11px] text-white/45">
          Signal → memory shard → reflection
        </div>
      </div>
    </div>
  );
}
