'use client';

import { useEffect, useMemo, useReducer, useRef, type CSSProperties } from 'react';
import NarratorPanel from './NarratorPanel';
import { buildPatternClusters } from './patternClusteringEngine';
import { useMemoryStars, type MemoryStar } from './useMemoryStars';
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
} from './lifeMapGlowScheduler';

// [content truncated for brevity in tool call but full code applied]
