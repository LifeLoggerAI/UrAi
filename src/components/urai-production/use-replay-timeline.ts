"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReplayBeat } from "./types";

export function useReplayTimeline({
  beats,
  isPlaying,
  initialProgressMs = 0,
  onComplete,
}: {
  beats: ReplayBeat[];
  isPlaying: boolean;
  initialProgressMs?: number;
  onComplete?: () => void;
}) {
  const sortedBeats = useMemo(() => [...beats].sort((a, b) => a.timestamp.localeCompare(b.timestamp)), [beats]);
  const totalDurationMs = useMemo(() => sortedBeats.reduce((sum, beat) => sum + beat.durationMs, 0), [sortedBeats]);
  const [progressMs, setProgressMs] = useState(initialProgressMs);
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);

  const getBeatIndex = useCallback((progress: number) => {
    let cursor = 0;
    for (let i = 0; i < sortedBeats.length; i += 1) {
      cursor += sortedBeats[i].durationMs;
      if (progress <= cursor) return i;
    }
    return Math.max(sortedBeats.length - 1, 0);
  }, [sortedBeats]);

  const scrubTo = useCallback((targetMs: number) => {
    const bounded = Math.max(0, Math.min(targetMs, totalDurationMs));
    setProgressMs(bounded);
    setActiveBeatIndex(getBeatIndex(bounded));
  }, [getBeatIndex, totalDurationMs]);

  useEffect(() => {
    if (!isPlaying || totalDurationMs <= 0) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastFrameRef.current = null;
      return;
    }

    const tick = (time: number) => {
      if (lastFrameRef.current == null) lastFrameRef.current = time;
      const delta = time - lastFrameRef.current;
      lastFrameRef.current = time;
      setProgressMs((current) => {
        const next = Math.min(current + delta, totalDurationMs);
        if (next >= totalDurationMs) {
          onComplete?.();
          return totalDurationMs;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastFrameRef.current = null;
    };
  }, [isPlaying, onComplete, totalDurationMs]);

  useEffect(() => {
    setActiveBeatIndex(getBeatIndex(progressMs));
  }, [getBeatIndex, progressMs]);

  return {
    progressMs,
    totalDurationMs,
    progressPercent: totalDurationMs ? progressMs / totalDurationMs : 0,
    activeBeat: sortedBeats[activeBeatIndex] ?? null,
    activeBeatIndex,
    scrubTo,
    rewind: () => scrubTo(progressMs - 5000),
    fastForward: () => scrubTo(progressMs + 5000),
  };
}
