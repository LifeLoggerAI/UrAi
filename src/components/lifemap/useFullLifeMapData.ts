"use client";

import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { demoLifeMapData } from './lifeMapDemoData';
import type {
  CompanionState,
  LifeMapConstellation,
  LifeMapData,
  MemoryBloom,
  MemoryStar,
  MoodWeather,
  NarratorInsight,
  RecoveryArc,
  Ritual,
  ScrollExport,
  SeasonalChapter,
  SocialGraphNode,
  SymbolicOverlay,
} from './lifeMapTypes';

const DEMO_USER_ID = 'demo-user';

function withId<T extends { id: string }>(id: string, value: Omit<T, 'id'> | T): T {
  return { ...(value as T), id };
}

function listenCollection<T extends { id: string }>(
  userId: string,
  path: string,
  fallback: T[],
  onValue: (value: T[]) => void,
  onError: () => void,
  orderField = 'timestamp',
  max = 80,
) {
  try {
    const ref = collection(db(), 'users', userId, path);
    const q = query(ref, orderBy(orderField, 'desc'), limit(max));
    return onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => withId<T>(doc.id, doc.data() as T));
        onValue(docs.length ? docs : fallback);
      },
      onError,
    );
  } catch {
    onError();
    return () => undefined;
  }
}

export function useFullLifeMapData(forceDemo = false): LifeMapData {
  const [data, setData] = useState<LifeMapData>({ ...demoLifeMapData, loading: true });

  useEffect(() => {
    if (forceDemo || !isFirebaseConfigured()) {
      setData({ ...demoLifeMapData, loading: false, source: 'demo' });
      return undefined;
    }

    let cleanups: Array<() => void> = [];
    let authCleanup: (() => void) | undefined;

    const failToDemo = () => setData((current) => ({ ...current, loading: false, source: 'demo', error: undefined }));

    authCleanup = onAuthStateChanged(
      auth(),
      (user) => {
        cleanups.forEach((cleanup) => cleanup());
        cleanups = [];

        const userId = user?.uid ?? DEMO_USER_ID;
        setData((current) => ({ ...current, loading: true }));

        cleanups.push(listenCollection<MemoryStar>(userId, 'memoryStars', demoLifeMapData.stars, (stars) => setData((current) => ({ ...current, stars, source: user ? 'firestore' : 'demo', loading: false })), failToDemo, 'timestamp', 120));
        cleanups.push(listenCollection<LifeMapConstellation>(userId, 'relationshipConstellations', demoLifeMapData.constellations, (constellations) => setData((current) => ({ ...current, constellations })), failToDemo, 'confidence', 32));
        cleanups.push(listenCollection<MemoryBloom>(userId, 'memoryBlooms', demoLifeMapData.blooms, (blooms) => setData((current) => ({ ...current, blooms })), failToDemo, 'emotionalTone', 64));
        cleanups.push(listenCollection<Ritual>(userId, 'rituals', demoLifeMapData.rituals, (rituals) => setData((current) => ({ ...current, rituals })), failToDemo, 'status', 32));
        cleanups.push(listenCollection<NarratorInsight>(userId, 'narratorInsights', demoLifeMapData.insights, (insights) => setData((current) => ({ ...current, insights })), failToDemo, 'confidence', 32));
        cleanups.push(listenCollection<SocialGraphNode>(userId, 'socialGraph', demoLifeMapData.socialGraph, (socialGraph) => setData((current) => ({ ...current, socialGraph })), failToDemo, 'orbitStrength', 32));
        cleanups.push(listenCollection<RecoveryArc>(userId, 'recoveryArcs', demoLifeMapData.recoveryArcs, (recoveryArcs) => setData((current) => ({ ...current, recoveryArcs })), failToDemo, 'score', 32));
        cleanups.push(listenCollection<SeasonalChapter>(userId, 'seasonalChapters', demoLifeMapData.chapters, (chapters) => setData((current) => ({ ...current, chapters })), failToDemo, 'confidence', 16));
        cleanups.push(listenCollection<MoodWeather>(userId, 'emotionalStates', demoLifeMapData.moodWeather, (moodWeather) => setData((current) => ({ ...current, moodWeather })), failToDemo, 'intensity', 16));
        cleanups.push(listenCollection<SymbolicOverlay>(userId, 'symbolicOverlays', demoLifeMapData.overlays, (overlays) => setData((current) => ({ ...current, overlays })), failToDemo, 'intensity', 24));
        cleanups.push(listenCollection<ScrollExport>(userId, 'scrollExports', demoLifeMapData.scrollExports, (scrollExports) => setData((current) => ({ ...current, scrollExports })), failToDemo, 'status', 16));
      },
      () => setData({ ...demoLifeMapData, loading: false, source: 'demo' }),
    );

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      if (authCleanup) authCleanup();
    };
  }, [forceDemo]);

  return useMemo(() => data, [data]);
}

export function createWeeklyScrollDraft(data: LifeMapData): ScrollExport {
  const keyStars = [...data.stars]
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 5)
    .map((star) => star.title)
    .join(', ');

  return {
    id: `local-scroll-${Date.now()}`,
    exportType: 'weekly',
    title: 'This Week in the Life Map',
    targetIds: data.stars.slice(0, 5).map((star) => star.id),
    status: 'draft',
    format: 'html',
    redactionLevel: 'private',
    generatedText: `URAI noticed these key memory lights: ${keyStars}. Raw private content stays out of the export until you choose otherwise.`,
  };
}

export function getBloomForStar(data: LifeMapData, starId: string | null) {
  if (!starId) return null;
  return data.blooms.find((bloom) => bloom.starId === starId) ?? null;
}
