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
  const radius = 13 + (index % 5) * 3.8;
  const angle = index * 2.399963229728653;
  return {
    x: Math.max(26, Math.min(74, 50 + Math.cos(angle) * radius)),
    y: Math.max(25, Math.min(72, 48 + Math.sin(angle) * radius * 0.78)),
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
    size: 8 + Math.round(enriched.intensity * 8),
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

export function useMemoryStars(fallbackStars: MemoryStar[]) {
  const [stars, setStars] = useState(fallbackStars);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setStars(fallbackStars);
      return undefined;
    }

    let unsubscribeMemories: (() => void) | null = null;
    let unsubscribeAuth: (() => void) | null = null;

    try {
      unsubscribeAuth = onAuthStateChanged(auth(), (user) => {
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

            setStars(next.length ? next : fallbackStars);
          },
          () => setStars(fallbackStars),
        );
      }, () => setStars(fallbackStars));
    } catch {
      setStars(fallbackStars);
      return undefined;
    }

    return () => {
      if (unsubscribeMemories) unsubscribeMemories();
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, [fallbackStars]);

  return stars;
}
