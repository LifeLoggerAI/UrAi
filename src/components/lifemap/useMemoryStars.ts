"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, limit, onSnapshot, orderBy, query, type DocumentData } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import type { ChapterId, MemoryEmotion } from "./lifeMapEvents";
import type { StarState } from "./lifeMapGlowScheduler";
import { enrichMemorySignal } from "./memoryIntelligenceEngine";

export type MemoryStar = {
  id: string;
  title: string;
  subtitle?: string;
  x: number;
  y: number;
  z?: number;
  size: number;
  emotion: MemoryEmotion;
  chapterId: ChapterId;
  state: StarState;
  intensity: number;
  recency: number;
  unresolvedWeight: number;
  lastActivatedAt: number | null;
  narratorLine: string;
  connectedTo: string[];
  sourceSignalIds?: string[];
  timestamp?: string | number | Date | null;
};

const CHAPTER_ALIASES: Record<string, ChapterId> = {
  becoming: "season-of-becoming",
  growth: "season-of-becoming",
  "season-of-becoming": "season-of-becoming",
  threshold: "threshold",
  recovery: "recovery-arc",
  "recovery-arc": "recovery-arc",
  "dream-field": "purple-dream-field",
  dream: "purple-dream-field",
  "purple-dream-field": "purple-dream-field",
  mirror: "mirror-of-becoming",
  "mirror-of-becoming": "mirror-of-becoming",
};

const EMOTION_ALIASES: Record<string, MemoryEmotion> = {
  stress: "threshold",
  rebirth: "recovery",
  connection: "calm",
  clarity: "focus",
  threshold: "threshold",
  grief: "grief",
  recovery: "recovery",
  shadow: "shadow",
  mirror: "mirror",
  dream: "dream",
  calm: "calm",
  joy: "joy",
  focus: "focus",
};

function positionForIndex(index: number) {
  const radius = 13 + (index % 5) * 3.8;
  const angle = index * 2.399963229728653;
  return {
    x: Math.max(26, Math.min(74, 50 + Math.cos(angle) * radius)),
    y: Math.max(25, Math.min(72, 48 + Math.sin(angle) * radius * 0.78)),
  };
}

function numberBetween(value: unknown, min: number, max: number, fallback: number) {
  const numeric = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.max(min, Math.min(max, numeric));
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizeChapter(value: unknown, fallback: ChapterId): ChapterId {
  if (typeof value !== "string") return fallback;
  return CHAPTER_ALIASES[value] ?? fallback;
}

function normalizeEmotion(value: unknown, fallback: MemoryEmotion): MemoryEmotion {
  if (typeof value !== "string") return fallback;
  return EMOTION_ALIASES[value] ?? fallback;
}

function timestampToRecency(value: unknown, fallback: number) {
  const millis =
    value instanceof Date ? value.getTime() :
    typeof value === "number" ? value :
    typeof value === "string" ? Date.parse(value) :
    typeof value === "object" && value && "toMillis" in value && typeof value.toMillis === "function" ? value.toMillis() :
    Number.NaN;

  if (!Number.isFinite(millis)) return fallback;
  const ageDays = Math.max(0, (Date.now() - millis) / 86400000);
  return numberBetween(1 - ageDays / 90, 0.08, 1, fallback);
}

function toMemoryStar(id: string, data: DocumentData, index: number): MemoryStar {
  const enriched = enrichMemorySignal(data, index);
  const position = positionForIndex(index);

  return {
    id,
    title: enriched.title,
    x: position.x,
    y: position.y,
    size: 8 + Math.round(enriched.intensity * 8),
    emotion: enriched.emotion,
    chapterId: enriched.chapterId,
    state: data.resolved === true ? "resolved" : "idle",
    intensity: enriched.intensity,
    recency: enriched.recency,
    unresolvedWeight: enriched.unresolvedWeight,
    lastActivatedAt: null,
    narratorLine: enriched.narratorLine,
    connectedTo: stringArray(data.connectedTo),
    sourceSignalIds: stringArray(data.sourceSignalIds),
    timestamp: data.createdAt ?? data.timestamp ?? null,
  };
}

function toLifeMapNodeStar(id: string, data: DocumentData, index: number): MemoryStar {
  const fallbackPosition = positionForIndex(index);
  const rawPosition = typeof data.position === "object" && data.position ? data.position as Record<string, unknown> : null;
  const intensity = numberBetween(data.intensity ?? data.emotionalIntensity ?? data.importanceScore, 0, 1, 0.62);
  const confidence = numberBetween(data.confidence, 0, 1, 0.72);
  const recency = timestampToRecency(data.timestamp ?? data.createdAt, numberBetween(data.recency, 0, 1, 0.58));
  const unresolvedWeight = numberBetween(data.unresolvedWeight ?? data.shadowWeight ?? (data.safetySensitive === true ? 0.82 : 1 - confidence), 0, 1, 0.28);
  const emotion = normalizeEmotion(data.emotionalTone ?? data.dominantEmotion ?? data.emotion, intensity > 0.82 ? "threshold" : "focus");
  const chapterId = normalizeChapter(data.chapterId ?? data.categoryId, emotion === "recovery" ? "recovery-arc" : emotion === "dream" ? "purple-dream-field" : emotion === "mirror" ? "mirror-of-becoming" : emotion === "threshold" || emotion === "shadow" ? "threshold" : "season-of-becoming");
  const x = numberBetween(data.x ?? rawPosition?.x, 20, 80, fallbackPosition.x);
  const y = numberBetween(data.y ?? rawPosition?.y, 22, 78, fallbackPosition.y);
  const z = numberBetween(data.z ?? rawPosition?.z, -220, 260, Math.round(intensity * 160));
  const title = typeof data.title === "string" && data.title.trim() ? data.title : `Memory signal ${index + 1}`;
  const narratorLine = typeof data.narratorLine === "string" && data.narratorLine.trim()
    ? data.narratorLine
    : typeof data.summary === "string" && data.summary.trim()
      ? data.summary
      : "This memory has enough signal strength to appear in the Life Map.";

  return {
    id,
    title,
    subtitle: typeof data.subtitle === "string" ? data.subtitle : undefined,
    x,
    y,
    z,
    size: numberBetween(data.size, 6, 24, 8 + Math.round(intensity * 10)),
    emotion,
    chapterId,
    state: data.resolved === true ? "resolved" : "idle",
    intensity,
    recency,
    unresolvedWeight,
    lastActivatedAt: null,
    narratorLine,
    connectedTo: [
      ...stringArray(data.connectedTo),
      ...stringArray(data.relatedNodeIds),
      ...stringArray(data.relatedStarIds),
    ],
    sourceSignalIds: stringArray(data.sourceSignalIds ?? data.sourceEventIds),
    timestamp: data.timestamp ?? data.createdAt ?? null,
  };
}

export function useMemoryStars(fallbackStars: MemoryStar[]) {
  const [stars, setStars] = useState(fallbackStars);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setStars(fallbackStars);
      return undefined;
    }

    let unsubscribeNodes: (() => void) | null = null;
    let unsubscribeMemories: (() => void) | null = null;
    let unsubscribeAuth: (() => void) | null = null;

    try {
      unsubscribeAuth = onAuthStateChanged(auth(), (user) => {
        if (unsubscribeNodes) {
          unsubscribeNodes();
          unsubscribeNodes = null;
        }
        if (unsubscribeMemories) {
          unsubscribeMemories();
          unsubscribeMemories = null;
        }

        if (!user) {
          setStars(fallbackStars);
          return;
        }

        let nodeStars: MemoryStar[] = [];
        let memoryStars: MemoryStar[] = [];
        const publish = () => setStars(nodeStars.length ? nodeStars : memoryStars.length ? memoryStars : fallbackStars);

        const nodesQuery = query(collection(db(), "users", user.uid, "lifeMapNodes"), limit(48));
        unsubscribeNodes = onSnapshot(
          nodesQuery,
          (snapshot) => {
            nodeStars = snapshot.docs.map((docSnap, index) => toLifeMapNodeStar(docSnap.id, docSnap.data(), index));
            publish();
          },
          () => {
            nodeStars = [];
            publish();
          },
        );

        const memoriesQuery = query(
          collection(db(), "users", user.uid, "memories"),
          orderBy("createdAt", "desc"),
          limit(32),
        );

        unsubscribeMemories = onSnapshot(
          memoriesQuery,
          (snapshot) => {
            memoryStars = snapshot.docs.map((docSnap, index) => toMemoryStar(docSnap.id, docSnap.data(), index));
            publish();
          },
          () => {
            memoryStars = [];
            publish();
          },
        );
      }, () => setStars(fallbackStars));
    } catch {
      setStars(fallbackStars);
      return undefined;
    }

    return () => {
      if (unsubscribeNodes) unsubscribeNodes();
      if (unsubscribeMemories) unsubscribeMemories();
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, [fallbackStars]);

  return stars;
}
