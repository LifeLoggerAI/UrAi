"use client";

import {useEffect, useMemo, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "@/lib/firebase";
import {
  AncientSignalResult,
  computeAncientSignals,
  mapUserDataToAncientSignals,
} from "@/lib/ancientSignals";
import {getLatestAncientSignalSnapshot} from "@/lib/ancientSignalsRepository";

export type AncientSignalsSource = "persisted" | "demo" | "fallback";

export type UseAncientSignalsResult = {
  result: AncientSignalResult;
  source: AncientSignalsSource;
  loading: boolean;
  error: string | null;
};

export const ANCIENT_SIGNALS_DEMO_RAW_DATA = {
  moodScore: 0.52,
  stressScore: 0.46,
  sleepDebtHours: 3,
  notificationFrictionScore: 0.38,
  socialGapScore: 0.42,
  recoveryActionCount: 2,
  lateNightUseScore: 0.28,
  frictionTapScore: 0.32,
  hesitationScore: 0.34,
  cancelLoopScore: 0.24,
  scrollVelocityScore: 0.36,
  pauseDensity: 0.22,
  voiceTension: 0.3,
  speechCompression: 0.26,
  wordDisclosure: 0.48,
};

export function buildDemoAncientSignals(): AncientSignalResult {
  return computeAncientSignals(mapUserDataToAncientSignals(ANCIENT_SIGNALS_DEMO_RAW_DATA));
}

export function useAncientSignals(): UseAncientSignalsResult {
  const demoResult = useMemo(() => buildDemoAncientSignals(), []);
  const [result, setResult] = useState<AncientSignalResult>(demoResult);
  const [source, setSource] = useState<AncientSignalsSource>("demo");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth(), async (user) => {
      if (!mounted) return;

      if (!user) {
        setResult(demoResult);
        setSource("demo");
        setLoading(false);
        setError(null);
        return;
      }

      try {
        const latest = await getLatestAncientSignalSnapshot(user.uid);
        if (!mounted) return;
        setResult(latest ?? demoResult);
        setSource(latest ? "persisted" : "demo");
        setError(null);
      } catch (caught) {
        if (!mounted) return;
        console.warn("Ancient Signals fallback mode active", caught);
        setResult(demoResult);
        setSource("fallback");
        setError(caught instanceof Error ? caught.message : "Unable to load Ancient Signals snapshot.");
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [demoResult]);

  return {result, source, loading, error};
}
