'use client';

import { useEffect, useMemo, useReducer, useRef, type CSSProperties } from 'react';
import NarratorPanel from './NarratorPanel';
import { useMemoryStars } from './useMemoryStars';
import {
  dispatchNarratorEvent,
  dispatchTimelineSyncEvent,
  type ChapterId,
  type LifeMapPhase,
  type MemoryEmotion,
} from './lifeMapEvents';
import {
  chooseGlowingStars,
  createSeededRandom,
  type GlowHistoryEntry,
  type StarState,
} from './lifeMapGlowScheduler';

// ... (rest unchanged until INITIAL_STARS)

const INITIAL_STARS = [] as any;

// reducer unchanged

export default function LifeMapScene() {
  const fallbackStars = useMemo(() => INITIAL_STARS, []);
  const liveStars = useMemoryStars(fallbackStars);

  const [state, dispatch] = useReducer(reducer, {
    stars: liveStars,
    activeStarId: null,
    activeChapterId: null,
    camera: { x: 50, y: 50, zoom: 1 },
    phase: 'living',
    reducedMotion: false,
    messages: { queue: [], lastBySource: {}, lastText: null },
  });

  // sync stars when Firebase updates
  useEffect(() => {
    dispatch({ type: 'SET_GLOWING_STARS', ids: [] });
  }, [liveStars]);

  // rest of component stays same but uses state.stars

  return (
    <main className="life-map-shell">
      {/* existing UI unchanged */}
      <NarratorPanel />
    </main>
  );
}
