"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDocs, onSnapshot, query, limit, type DocumentData } from "firebase/firestore";

import { auth, db, isFirebaseConfigured } from "@/lib/firebase";

export type RhythmState = "stable" | "focused" | "overstimulated" | "offRhythm" | "recovering";
export type CompanionMode = "quiet" | "listening" | "reflecting" | "forecasting" | "ritual";
export type LifeMapNodeType = "memory" | "ritual" | "relationship" | "forecast" | "recovery";

export type UraiLifeMapNode = {
  id: string;
  type: LifeMapNodeType;
  title: string;
  subtitle: string;
  emotionalWeight: number;
  x: number;
  y: number;
  auraColor: string;
};

export type UraiHomeViewModel = {
  moodWeather: string;
  rhythmState: RhythmState;
  auraColor: string;
  recoveryScore: number;
  memoryNodeCount: number;
  forecastSummary: string;
  companionMode: CompanionMode;
  narratorWhisper: string;
  nodes: UraiLifeMapNode[];
  source: "firestore" | "demo" | "unconfigured";
  loading: boolean;
  error?: string;
};

export const DEMO_URAI_HOME_STATE: UraiHomeViewModel = {
  moodWeather: "Clouded Focus",
  rhythmState: "focused",
  auraColor: "#7ee7ff",
  recoveryScore: 67,
  memoryNodeCount: 12,
  forecastSummary: "Soft shift ahead",
  companionMode: "listening",
  narratorWhisper: "A quiet pattern is becoming visible.",
  source: "demo",
  loading: false,
  nodes: [
    { id: "recovery-signal", type: "recovery", title: "Recovery Signal", subtitle: "A calmer pattern appeared after the late-night loop.", emotionalWeight: 0.74, x: 28, y: 25, auraColor: "#8ddcff" },
    { id: "forecast-shift", type: "forecast", title: "Forecast Shift", subtitle: "The next state is trending softer, not solved yet.", emotionalWeight: 0.64, x: 52, y: 11, auraColor: "#bda8ff" },
    { id: "focus-thread", type: "memory", title: "Focus Thread", subtitle: "Attention returned around one repeated proof action.", emotionalWeight: 0.78, x: 59, y: 27, auraColor: "#7ee7ff" },
    { id: "relationship-echo", type: "relationship", title: "Relationship Echo", subtitle: "A silence pattern is asking to be seen without judgment.", emotionalWeight: 0.58, x: 72, y: 40, auraColor: "#a78bfa" },
  ],
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asRhythm(value: unknown): RhythmState {
  return value === "stable" || value === "focused" || value === "overstimulated" || value === "offRhythm" || value === "recovering"
    ? value
    : DEMO_URAI_HOME_STATE.rhythmState;
}

function asCompanionMode(value: unknown): CompanionMode {
  return value === "quiet" || value === "listening" || value === "reflecting" || value === "forecasting" || value === "ritual"
    ? value
    : DEMO_URAI_HOME_STATE.companionMode;
}

function asNodeType(value: unknown): LifeMapNodeType {
  return value === "memory" || value === "ritual" || value === "relationship" || value === "forecast" || value === "recovery" ? value : "memory";
}

function clampPercent(value: unknown, fallback: number) {
  const numeric = asNumber(value, fallback);
  return Math.max(5, Math.min(95, numeric));
}

function normalizeNode(id: string, data: DocumentData, index: number): UraiLifeMapNode {
  const fallback = DEMO_URAI_HOME_STATE.nodes[index % DEMO_URAI_HOME_STATE.nodes.length];
  return {
    id,
    type: asNodeType(data.type),
    title: asString(data.title ?? data.label, fallback.title),
    subtitle: asString(data.subtitle ?? data.detail ?? data.summary, fallback.subtitle),
    emotionalWeight: Math.max(0.15, Math.min(1, asNumber(data.emotionalWeight ?? data.weight, fallback.emotionalWeight))),
    x: clampPercent(data.x ?? data.positionX, fallback.x),
    y: clampPercent(data.y ?? data.positionY, fallback.y),
    auraColor: asString(data.auraColor ?? data.color, fallback.auraColor),
  };
}

function mergeHomeData(home?: DocumentData, forecast?: DocumentData, companion?: DocumentData, visual?: DocumentData, nodes?: UraiLifeMapNode[]): UraiHomeViewModel {
  const mergedNodes = nodes?.length ? nodes : DEMO_URAI_HOME_STATE.nodes;
  return {
    moodWeather: asString(home?.moodWeather ?? home?.moodLabel ?? visual?.moodWeather, DEMO_URAI_HOME_STATE.moodWeather),
    rhythmState: asRhythm(home?.rhythmState ?? visual?.rhythmState),
    auraColor: asString(visual?.auraColor ?? home?.auraColor, DEMO_URAI_HOME_STATE.auraColor),
    recoveryScore: Math.max(0, Math.min(100, asNumber(home?.recoveryScore ?? home?.recovery, DEMO_URAI_HOME_STATE.recoveryScore))),
    memoryNodeCount: Math.max(mergedNodes.length, asNumber(home?.memoryNodeCount ?? home?.memoryNodes, mergedNodes.length)),
    forecastSummary: asString(forecast?.summary ?? forecast?.forecastSummary ?? home?.forecastSummary, DEMO_URAI_HOME_STATE.forecastSummary),
    companionMode: asCompanionMode(companion?.mode ?? companion?.companionMode ?? home?.companionMode),
    narratorWhisper: asString(companion?.narratorWhisper ?? companion?.whisper ?? home?.narratorWhisper, DEMO_URAI_HOME_STATE.narratorWhisper),
    nodes: mergedNodes,
    source: "firestore",
    loading: false,
  };
}

export function useUraiHomeState(): UraiHomeViewModel {
  const [state, setState] = useState<UraiHomeViewModel>({ ...DEMO_URAI_HOME_STATE, loading: true });

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setState({ ...DEMO_URAI_HOME_STATE, source: "unconfigured", loading: false });
      return undefined;
    }

    let unsubSnapshots: Array<() => void> = [];
    let cancelled = false;

    const unsubAuth = onAuthStateChanged(auth(), async (user) => {
      unsubSnapshots.forEach((unsubscribe) => unsubscribe());
      unsubSnapshots = [];

      if (!user) {
        setState({ ...DEMO_URAI_HOME_STATE, loading: false, source: "demo" });
        return;
      }

      const userRoot = doc(db(), "users", user.uid);
      const homeRef = doc(userRoot, "homeState", "current");
      const forecastRef = doc(userRoot, "moodForecasts", "current");
      const companionRef = doc(userRoot, "companionState", "current");
      const visualRef = doc(userRoot, "visualState", "current");
      const nodesQuery = query(collection(userRoot, "lifeMapNodes"), limit(24));

      let homeData: DocumentData | undefined;
      let forecastData: DocumentData | undefined;
      let companionData: DocumentData | undefined;
      let visualData: DocumentData | undefined;
      let nodesData: UraiLifeMapNode[] = [];

      const sync = () => {
        if (cancelled) return;
        setState(mergeHomeData(homeData, forecastData, companionData, visualData, nodesData));
      };

      unsubSnapshots = [
        onSnapshot(homeRef, (snap) => { homeData = snap.exists() ? snap.data() : undefined; sync(); }, (error) => setState({ ...DEMO_URAI_HOME_STATE, loading: false, error: error.message })),
        onSnapshot(forecastRef, (snap) => { forecastData = snap.exists() ? snap.data() : undefined; sync(); }, (error) => setState({ ...DEMO_URAI_HOME_STATE, loading: false, error: error.message })),
        onSnapshot(companionRef, (snap) => { companionData = snap.exists() ? snap.data() : undefined; sync(); }, (error) => setState({ ...DEMO_URAI_HOME_STATE, loading: false, error: error.message })),
        onSnapshot(visualRef, (snap) => { visualData = snap.exists() ? snap.data() : undefined; sync(); }, (error) => setState({ ...DEMO_URAI_HOME_STATE, loading: false, error: error.message })),
        onSnapshot(nodesQuery, (snapshot) => {
          nodesData = snapshot.docs.map((node, index) => normalizeNode(node.id, node.data(), index));
          sync();
        }, async () => {
          try {
            const snapshot = await getDocs(nodesQuery);
            nodesData = snapshot.docs.map((node, index) => normalizeNode(node.id, node.data(), index));
            sync();
          } catch (error) {
            setState({ ...DEMO_URAI_HOME_STATE, loading: false, error: error instanceof Error ? error.message : "Unable to load home state." });
          }
        }),
      ];
    });

    return () => {
      cancelled = true;
      unsubAuth();
      unsubSnapshots.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  return useMemo(() => state, [state]);
}
