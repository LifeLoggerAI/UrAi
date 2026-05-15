"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  type DocumentData,
} from "firebase/firestore";

import { auth, db, isFirebaseConfigured } from "@/lib/firebase";

export type RhythmState = "stable" | "focused" | "overstimulated" | "offRhythm" | "recovering";
export type CompanionMode = "quiet" | "listening" | "reflecting" | "forecasting" | "ritual" | "protective";
export type LifeMapNodeType = "memory" | "ritual" | "relationship" | "forecast" | "recovery" | "threshold" | "becoming" | "dream" | "mirror" | "breakthrough" | "warning" | "legacy";
export type SocialEnergy = "high" | "balanced" | "low" | "silent" | "strained";
export type HomeVisualState =
  | "calm"
  | "focused"
  | "overstimulated"
  | "offRhythm"
  | "recovery"
  | "threshold"
  | "socialHigh"
  | "socialSilence"
  | "empty";

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

export type UraiHomeInsight = {
  id: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaRoute?: string;
  confidence?: number;
};

export type UraiHomeViewModel = {
  moodWeather: string;
  rhythmState: RhythmState;
  visualState: HomeVisualState;
  auraColor: string;
  auraSecondaryColor: string;
  recoveryScore: number;
  recoveryDirection: "rising" | "flat" | "falling";
  bloomReady: boolean;
  memoryNodeCount: number;
  forecastSummary: string;
  forecastMessage: string;
  companionMode: CompanionMode;
  narratorWhisper: string;
  socialEnergy: SocialEnergy;
  shadowLoad: number;
  cognitiveLoad: number;
  thresholdRisk: number;
  moodConfidence: number;
  insight: UraiHomeInsight;
  nodes: UraiLifeMapNode[];
  source: "firestore" | "demo" | "unconfigured";
  loading: boolean;
  error?: string;
};

export const DEMO_URAI_HOME_STATE: UraiHomeViewModel = {
  moodWeather: "Live Focus Field",
  rhythmState: "focused",
  visualState: "focused",
  auraColor: "#7ee7ff",
  auraSecondaryColor: "#8b5cf6",
  recoveryScore: 67,
  recoveryDirection: "rising",
  bloomReady: false,
  memoryNodeCount: 12,
  forecastSummary: "Soft shift ahead",
  forecastMessage: "Live home state is reading rhythm, recovery, memory nodes, and companion mode.",
  companionMode: "listening",
  narratorWhisper: "Your active field is coming online.",
  socialEnergy: "balanced",
  shadowLoad: 0.22,
  cognitiveLoad: 0.34,
  thresholdRisk: 0.04,
  moodConfidence: 0.72,
  source: "demo",
  loading: false,
  insight: {
    id: "demo-live-field",
    title: "Your active field is coming online.",
    body: "URAI is wiring the home view to mood, rhythm, recovery, companion, and Life Map nodes.",
    ctaLabel: "Enter Life Map",
    ctaRoute: "/lifemap",
    confidence: 0.72,
  },
  nodes: [
    { id: "recovery-signal", type: "recovery", title: "Recovery Signal", subtitle: "A calmer pattern appeared after the late-night loop.", emotionalWeight: 0.74, x: 28, y: 25, auraColor: "#8ddcff" },
    { id: "forecast-shift", type: "forecast", title: "Forecast Shift", subtitle: "The next state is trending softer, not solved yet.", emotionalWeight: 0.64, x: 52, y: 11, auraColor: "#bda8ff" },
    { id: "focus-thread", type: "memory", title: "Focus Thread", subtitle: "Attention returned around one repeated proof action.", emotionalWeight: 0.78, x: 59, y: 27, auraColor: "#7ee7ff" },
    { id: "relationship-echo", type: "relationship", title: "Relationship Echo", subtitle: "A silence pattern is asking to be seen without judgment.", emotionalWeight: 0.58, x: 72, y: 40, auraColor: "#a78bfa" },
  ],
};

const LIFE_MAP_NODE_TYPE_ALIASES: Record<string, LifeMapNodeType> = {
  becoming: "becoming",
  breakthrough: "breakthrough",
  habit: "memory",
  voice: "memory",
  location: "memory",
  warning: "warning",
  dream: "dream",
  mirror: "mirror",
  legacy: "legacy",
  memory: "memory",
  ritual: "ritual",
  relationship: "relationship",
  forecast: "forecast",
  recovery: "recovery",
  threshold: "threshold",
  stress_spike: "threshold",
  emotional_moment: "memory",
  recurring_pattern: "memory",
  urai_insight: "forecast",
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: unknown, fallback: number, min = 0, max = 1) {
  const numeric = asNumber(value, fallback);
  return Math.max(min, Math.min(max, numeric));
}

function asRhythm(value: unknown): RhythmState {
  if (value === "off_rhythm") return "offRhythm";
  return value === "stable" || value === "focused" || value === "overstimulated" || value === "offRhythm" || value === "recovering"
    ? value
    : DEMO_URAI_HOME_STATE.rhythmState;
}

function asVisualState(value: unknown, rhythm: RhythmState, thresholdRisk: number, bloomReady: boolean, socialEnergy: SocialEnergy): HomeVisualState {
  if (value === "off_rhythm") return "offRhythm";
  if (value === "social_high") return "socialHigh";
  if (value === "social_silence") return "socialSilence";
  if (value === "calm" || value === "focused" || value === "overstimulated" || value === "offRhythm" || value === "recovery" || value === "threshold" || value === "socialHigh" || value === "socialSilence" || value === "empty") return value;
  if (thresholdRisk > 0.7) return "threshold";
  if (bloomReady || rhythm === "recovering") return "recovery";
  if (socialEnergy === "high") return "socialHigh";
  if (socialEnergy === "silent") return "socialSilence";
  if (rhythm === "offRhythm") return "offRhythm";
  if (rhythm === "overstimulated") return "overstimulated";
  return rhythm === "focused" ? "focused" : "calm";
}

function asCompanionMode(value: unknown): CompanionMode {
  if (value === "ambient") return "quiet";
  return value === "quiet" || value === "listening" || value === "reflecting" || value === "forecasting" || value === "ritual" || value === "protective"
    ? value
    : DEMO_URAI_HOME_STATE.companionMode;
}

function asSocialEnergy(value: unknown): SocialEnergy {
  return value === "high" || value === "balanced" || value === "low" || value === "silent" || value === "strained"
    ? value
    : DEMO_URAI_HOME_STATE.socialEnergy;
}

function asNodeType(value: unknown): LifeMapNodeType {
  if (typeof value !== "string") return "memory";
  return LIFE_MAP_NODE_TYPE_ALIASES[value] ?? "memory";
}

function clampPercent(value: unknown, fallback: number) {
  return clamp(value, fallback, 5, 95);
}

function normalizeAuraColor(value: unknown, fallback: string) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  if (value.endsWith("deg")) return `hsl(${value} 90% 72%)`;
  return value;
}

function normalizeNode(id: string, data: DocumentData, index: number): UraiLifeMapNode {
  const fallback = DEMO_URAI_HOME_STATE.nodes[index % DEMO_URAI_HOME_STATE.nodes.length];
  const position = typeof data.position === "object" && data.position ? data.position as Record<string, unknown> : undefined;
  const emotionalWeight = clamp(data.emotionalWeight ?? data.weight ?? data.importance ?? data.intensity ?? data.emotionalIntensity ?? data.glow, fallback.emotionalWeight, 0.15, 1);
  return {
    id,
    type: asNodeType(data.type ?? data.starType),
    title: asString(data.title ?? data.label, fallback.title),
    subtitle: asString(data.subtitle ?? data.detail ?? data.summary ?? data.narratorLine, fallback.subtitle),
    emotionalWeight,
    x: clampPercent(data.x ?? data.positionX ?? position?.x, fallback.x),
    y: clampPercent(data.y ?? data.positionY ?? position?.y, fallback.y),
    auraColor: normalizeAuraColor(data.auraColor ?? data.color, fallback.auraColor),
  };
}

function normalizeRecentStars(home?: DocumentData): UraiLifeMapNode[] | undefined {
  const memory = typeof home?.memory === "object" && home?.memory ? home.memory as Record<string, unknown> : undefined;
  const recentStars = Array.isArray(memory?.recentStars) ? memory?.recentStars : Array.isArray(home?.recentStars) ? home?.recentStars : undefined;
  if (!recentStars?.length) return undefined;
  return recentStars.slice(0, 24).map((star, index) => normalizeNode(asString((star as DocumentData).id, `home-star-${index}`), star as DocumentData, index));
}

function nested(source: DocumentData | undefined, key: string): Record<string, unknown> | undefined {
  const value = source?.[key];
  return typeof value === "object" && value ? value as Record<string, unknown> : undefined;
}

function deriveMoodWeatherFromNodes(nodes: UraiLifeMapNode[], fallback: string) {
  if (!nodes.length) return fallback;
  const strongest = [...nodes].sort((a, b) => b.emotionalWeight - a.emotionalWeight)[0];
  if (strongest.type === "threshold" || strongest.type === "warning") return "Threshold Field";
  if (strongest.type === "recovery") return "Recovery Weather";
  if (strongest.type === "dream") return "Dream Signal";
  if (strongest.type === "mirror") return "Mirror Clarity";
  if (strongest.type === "breakthrough") return "Breakthrough Glow";
  return fallback;
}

function mergeHomeData(home?: DocumentData, forecast?: DocumentData, companion?: DocumentData, visual?: DocumentData, nodes?: UraiLifeMapNode[]): UraiHomeViewModel {
  const mood = nested(home, "mood");
  const rhythm = nested(home, "rhythm");
  const stress = nested(home, "stress");
  const recovery = nested(home, "recovery");
  const homeForecast = nested(home, "forecast");
  const memory = nested(home, "memory");
  const social = nested(home, "social");
  const insight = nested(home, "insight");
  const homeCompanion = nested(home, "companion");
  const homeVisual = nested(home, "visual");
  const mergedNodes = nodes?.length ? nodes : normalizeRecentStars(home) ?? DEMO_URAI_HOME_STATE.nodes;

  const thresholdRisk = clamp(stress?.thresholdRisk ?? home?.thresholdRisk, DEMO_URAI_HOME_STATE.thresholdRisk);
  const bloomReady = Boolean(recovery?.bloomReady ?? home?.bloomReady ?? false);
  const socialEnergy = asSocialEnergy(social?.energy ?? home?.socialEnergy);
  const rhythmState = asRhythm(rhythm?.state ?? home?.rhythmState ?? visual?.rhythmState);
  const recoveryScore = clamp(recovery?.score ?? home?.recoveryScore ?? home?.recovery, DEMO_URAI_HOME_STATE.recoveryScore, 0, 100);
  const strongestNode = [...mergedNodes].sort((a, b) => b.emotionalWeight - a.emotionalWeight)[0];
  const defaultTitle = strongestNode ? `${strongestNode.title} is active.` : DEMO_URAI_HOME_STATE.insight.title;
  const defaultBody = strongestNode ? strongestNode.subtitle : DEMO_URAI_HOME_STATE.insight.body;
  const forecastText = asString(homeForecast?.message ?? forecast?.message ?? home?.forecastMessage, `Recovery is ${Math.round(recoveryScore)}%. ${mergedNodes.length} memory signals are currently shaping the field.`);
  const moodWeather = deriveMoodWeatherFromNodes(mergedNodes, asString(mood?.label ?? home?.moodWeather ?? home?.moodLabel ?? visual?.moodWeather, DEMO_URAI_HOME_STATE.moodWeather));

  return {
    moodWeather,
    rhythmState,
    visualState: asVisualState(homeVisual?.state ?? home?.visualState ?? visual?.visualState, rhythmState, thresholdRisk, bloomReady, socialEnergy),
    auraColor: asString(homeVisual?.auraColor ?? visual?.auraColor ?? home?.auraColor, DEMO_URAI_HOME_STATE.auraColor),
    auraSecondaryColor: asString(homeVisual?.auraSecondaryColor ?? visual?.auraSecondaryColor ?? home?.auraSecondaryColor, DEMO_URAI_HOME_STATE.auraSecondaryColor),
    recoveryScore,
    recoveryDirection: recovery?.direction === "rising" || recovery?.direction === "flat" || recovery?.direction === "falling" ? recovery.direction : DEMO_URAI_HOME_STATE.recoveryDirection,
    bloomReady,
    memoryNodeCount: Math.max(mergedNodes.length, asNumber(memory?.nodeCount ?? home?.memoryNodeCount ?? home?.memoryNodes, mergedNodes.length)),
    forecastSummary: asString(homeForecast?.label ?? forecast?.summary ?? forecast?.forecastSummary ?? home?.forecastSummary, strongestNode ? `${strongestNode.type} signal active` : DEMO_URAI_HOME_STATE.forecastSummary),
    forecastMessage: forecastText,
    companionMode: asCompanionMode(homeCompanion?.state ?? companion?.mode ?? companion?.companionMode ?? home?.companionMode),
    narratorWhisper: asString(homeCompanion?.message ?? companion?.narratorWhisper ?? companion?.whisper ?? home?.narratorWhisper, defaultTitle),
    socialEnergy,
    shadowLoad: clamp(stress?.shadowLoad ?? home?.shadowLoad, DEMO_URAI_HOME_STATE.shadowLoad),
    cognitiveLoad: clamp(stress?.cognitiveLoad ?? home?.cognitiveLoad, DEMO_URAI_HOME_STATE.cognitiveLoad),
    thresholdRisk,
    moodConfidence: clamp(mood?.confidence ?? home?.moodConfidence ?? strongestNode?.emotionalWeight, DEMO_URAI_HOME_STATE.moodConfidence),
    insight: {
      id: asString(insight?.id, strongestNode?.id ?? DEMO_URAI_HOME_STATE.insight.id),
      title: asString(insight?.title ?? home?.narratorWhisper, defaultTitle),
      body: asString(insight?.body ?? home?.insightBody, defaultBody),
      ctaLabel: asString(insight?.ctaLabel, "Enter Life Map"),
      ctaRoute: asString(insight?.ctaRoute, "/lifemap"),
      confidence: clamp(insight?.confidence ?? strongestNode?.emotionalWeight, DEMO_URAI_HOME_STATE.insight.confidence ?? 0.7),
    },
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
