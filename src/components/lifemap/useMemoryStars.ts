"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, limit, onSnapshot, orderBy, query, type DocumentData } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { ChapterId, MemoryEmotion } from "./lifeMapEvents";
import type { StarState } from "./lifeMapGlowScheduler";

export type MemoryStar = {
  id: string;
  title: string;
  x: number;
  y: number;
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
};

const EMOTIONS: MemoryEmotion[] = ["focus", "threshold", "recovery", "dream", "mirror", "shadow", "grief", "calm", "joy"];
const CHAPTERS: ChapterId[] = ["season-of-becoming", "threshold", "recovery-arc", "purple-dream-field", "mirror-of-becoming"];

function clamp01(value: unknown, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.max(0, Math.min(1, value));
}

function asEmotion(value: unknown, fallback: MemoryEmotion): MemoryEmotion {
  return typeof value === "string" && EMOTIONS.includes(value as MemoryEmotion) ? (value as MemoryEmotion) : fallback;
}

function asChapter(value: unknown, fallback: ChapterId): ChapterId {
  return typeof value === "string" && CHAPTERS.includes(value as ChapterId) ? (value as ChapterId) : fallback;
}

function positionForIndex(index: number) {
  const radius = 25 + (index % 4) * 6;
  const angle = index * 2.399963229728653;
  return {
    x: Math.max(12, Math.min(88, 50 + Math.cos(angle) * radius)),
    y: Math.max(14, Math.min(82, 48 + Math.sin(angle) * radius)),
  };
}

function toMemoryStar(id: string, data: DocumentData, index: number): MemoryStar {
  const position = positionForIndex(index);
  const intensity = clamp01(data.intensity ?? data.emotionalIntensity ?? data.weight, 0.55);
  const recency = clamp01(data.recency ?? data.recencyScore, Math.max(0.2, 1 - index * 0.08));
  const unresolvedWeight = clamp01(data.unresolvedWeight ?? data.openLoopScore ?? data.shadowWeight, 0.35);
  const emotion = asEmotion(data.emotion ?? data.primaryEmotion ?? data.mood, EMOTIONS[index % EMOTIONS.length]);
  const chapterId = asChapter(data.chapterId ?? data.chapter ?? data.arc, CHAPTERS[index % CHAPTERS.length]);

  return {
    id,
    title: typeof data.title === "string" ? data.title : typeof data.summary === "string" ? data.summary : `Memory ${index + 1}`,
    x: clamp01(data.x, position.x / 100) * 100,
    y: clamp01(data.y, position.y / 100) * 100,
    size: 16 + Math.round(intensity * 12),
    emotion,
    chapterId,
    state: data.resolved === true ? "resolved" : "idle",
    intensity,
    recency,
    unresolvedWeight,
    lastActivatedAt: typeof data.lastActivatedAt === "number" ? data.lastActivatedAt : null,
    narratorLine: typeof data.narratorLine === "string" ? data.narratorLine : `This ${emotion} memory is part of your ${chapterId} arc.`,
    connectedTo: Array.isArray(data.connectedTo) ? data.connectedTo.filter((item: unknown) => typeof item === "string") : [],
  };
}

function addFallbackConnections(stars: MemoryStar[]) {
  return stars.map((star, index) => ({
    ...star,
    connectedTo: star.connectedTo.length
      ? star.connectedTo.filter((id) => stars.some((candidate) => candidate.id === id))
      : [stars[index - 1]?.id, stars[index + 1]?.id].filter(Boolean) as string[],
  }));
}

export function useMemoryStars(fallbackStars: MemoryStar[]) {
  const [stars, setStars] = useState(fallbackStars);

  useEffect(() => {
    let unsubscribeMemories: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth(), (user) => {
      if (unsubscribeMemories) {
        unsubscribeMemories();
        unsubscribeMemories = null;
      }

      if (!user) {
        setStars(fallbackStars);
        return;
      }

      const memoriesQuery = query(
        collection(db(), "users", user.uid, "memories"),
        orderBy("createdAt", "desc"),
        limit(32),
      );

      unsubscribeMemories = onSnapshot(
        memoriesQuery,
        (snapshot) => {
          const next = snapshot.docs.map((docSnap, index) => toMemoryStar(docSnap.id, docSnap.data(), index));
          setStars(next.length ? addFallbackConnections(next) : fallbackStars);
        },
        () => setStars(fallbackStars),
      );
    });

    return () => {
      if (unsubscribeMemories) unsubscribeMemories();
      unsubscribeAuth();
    };
  }, [fallbackStars]);

  return stars;
}
