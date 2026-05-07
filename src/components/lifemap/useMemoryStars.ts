"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, limit, onSnapshot, orderBy, query, type DocumentData } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { ChapterId, MemoryEmotion } from "./lifeMapEvents";
import type { StarState } from "./lifeMapGlowScheduler";
import { enrichMemorySignal } from "./memoryIntelligenceEngine";

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

function positionForIndex(index: number) {
  const radius = 25 + (index % 4) * 6;
  const angle = index * 2.399963229728653;
  return {
    x: Math.max(12, Math.min(88, 50 + Math.cos(angle) * radius)),
    y: Math.max(14, Math.min(82, 48 + Math.sin(angle) * radius)),
  };
}

function toMemoryStar(id: string, data: DocumentData, index: number): MemoryStar {
  const enriched = enrichMemorySignal(data, index);
  const position = positionForIndex(index);

  return {
    id,
    title: enriched.title,
    x: position.x,
    y: position.y,
    size: 16 + Math.round(enriched.intensity * 12),
    emotion: enriched.emotion,
    chapterId: enriched.chapterId,
    state: data.resolved === true ? "resolved" : "idle",
    intensity: enriched.intensity,
    recency: enriched.recency,
    unresolvedWeight: enriched.unresolvedWeight,
    lastActivatedAt: null,
    narratorLine: enriched.narratorLine,
    connectedTo: [],
  };
}

function addFallbackConnections(stars: MemoryStar[]) {
  return stars.map((star, index) => ({
    ...star,
    connectedTo: [stars[index - 1]?.id, stars[index + 1]?.id].filter(Boolean) as string[],
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
          const next = snapshot.docs.map((docSnap, index) =>
            toMemoryStar(docSnap.id, docSnap.data(), index),
          );

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
