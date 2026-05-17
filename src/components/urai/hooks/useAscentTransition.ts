"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ASCENT_TIMING_MS, type AscentPhase } from "@/components/urai/motion/ascentMotion";
import { useReducedMotionSafe } from "@/components/urai/hooks/useReducedMotionSafe";

export function useAscentTransition(destination = "/life-map") {
  const router = useRouter();
  const reducedMotion = useReducedMotionSafe();
  const [phase, setPhase] = useState<AscentPhase>("idle");
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  const beginAscent = useCallback(() => {
    if (phase !== "idle") return;
    if (reducedMotion) {
      router.push(destination);
      return;
    }

    setPhase("ignition");
    timers.current = [
      window.setTimeout(() => setPhase("lift"), ASCENT_TIMING_MS.ignition),
      window.setTimeout(() => setPhase("portal"), ASCENT_TIMING_MS.lift),
      window.setTimeout(() => setPhase("emergence"), ASCENT_TIMING_MS.portal),
      window.setTimeout(() => setPhase("settle"), ASCENT_TIMING_MS.emergence),
      window.setTimeout(() => router.push(destination), ASCENT_TIMING_MS.settle),
    ];
  }, [destination, phase, reducedMotion, router]);

  useEffect(() => clearTimers, [clearTimers]);

  return {
    phase,
    beginAscent,
    isTransitioning: phase !== "idle",
    reducedMotion,
  };
}
