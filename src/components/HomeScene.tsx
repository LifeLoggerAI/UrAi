"use client";

import { useState } from "react";
import LifeMapScene from "@/components/lifemap/LifeMapScene";

export default function HomeScene() {
  const [mode, setMode] = useState<"home" | "lifemap">("home");

  if (mode === "lifemap") {
    return (
      <div className="relative w-full h-dvh bg-black overflow-hidden">
        <LifeMapScene />
        <button
          type="button"
          onClick={() => setMode("home")}
          className="absolute left-4 top-4 z-50 rounded-full border border-white/30 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
          aria-label="Return to home scene"
        >
          Return home
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-dvh bg-black overflow-hidden">
      <button
        type="button"
        onClick={() => setMode("lifemap")}
        className="absolute inset-0 z-10 cursor-zoom-in"
        aria-label="Open URAI Life Map from the sky"
      >
        <span className="sr-only">Open URAI Life Map</span>
      </button>

      <video
        src="/assets/sky/sky-demo.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <video
        src="/assets/ground/ground-demo.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <video
        src="/assets/avatar/avatar-demo.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white/85 backdrop-blur">
        Tap the sky to open your Life Map
      </div>
    </div>
  );
}
