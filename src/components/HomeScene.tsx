"use client";

import { useEffect, useState } from "react";
import GroundLayer from "@/components/GroundLayer";
import { sendCognitiveMirrorEvent, fetchLatestInsight } from "@/lib/uraiPipeline";

export default function HomeScene() {
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadInsight = async () => {
    const res = await fetchLatestInsight();
    setInsight(res.insight);
  };

  const triggerEvent = async () => {
    setLoading(true);
    const res: any = await sendCognitiveMirrorEvent();
    if (res?.insight) setInsight(res.insight);
    setLoading(false);
  };

  useEffect(() => {
    loadInsight();
  }, []);

  return (
    <div className="relative w-full h-dvh bg-black overflow-hidden">
      {/* SKY */}
      <video
        src="/assets/sky/sky-demo.mp4"
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* GROUND */}
      <GroundLayer />

      {/* AVATAR */}
      <video
        src="/assets/avatar/avatar-demo.mp4"
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* COGNITIVE MIRROR PANEL */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/70 text-white p-4 rounded-xl w-[320px] backdrop-blur">
        <div className="text-sm opacity-70 mb-2">Cognitive Mirror</div>
        <div className="text-base mb-3">
          {insight?.summary || "No insight yet. Tap to generate signal."}
        </div>

        <button
          onClick={triggerEvent}
          disabled={loading}
          className="w-full bg-white text-black py-2 rounded-lg"
        >
          {loading ? "Processing..." : "Trigger Insight"}
        </button>
      </div>
    </div>
  );
}
