'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef, type CSSProperties } from 'react';
import NarratorPanel from './NarratorPanel';
import WebGLLifeMapField from './WebGLLifeMapField';
import { buildPatternClusters } from './patternClusteringEngine';
import { useMemoryStars, type MemoryStar } from './useMemoryStars';
import {
  dispatchNarratorEvent,
  dispatchTimelineSyncEvent,
  type ChapterId,
  type LifeMapPhase,
} from './lifeMapEvents';
import { chooseGlowingStars, createSeededRandom, type GlowHistoryEntry } from './lifeMapGlowScheduler';

type StarfieldStyle = CSSProperties & {
  '--camera-x': string;
  '--camera-y': string;
  '--camera-zoom': string;
  '--camera-tilt': string;
};

type StarStyle = CSSProperties & {
  '--star-z': string;
  '--star-scale': string;
};

type LifeMapCamera = { x: number; y: number; zoom: number; tilt: number };
type MessageSource = 'focus' | 'resolved' | 'cluster' | 'glow' | 'camera';

type MessageEnvelope = {
  id: string;
  source: MessageSource;
  priority: number;
  text: string;
  createdAt: number;
  expiresAt: number | null;
};

type MessageState = {
  queue: MessageEnvelope[];
  lastBySource: Partial<Record<MessageSource, number>>;
  lastText: string | null;
};

type State = {
  stars: MemoryStar[];
  activeStarId: string | null;
  activeChapterId: ChapterId | null;
  camera: LifeMapCamera;
  messages: MessageState;
  phase: LifeMapPhase;
  reducedMotion: boolean;
};

type Action =
  | { type: 'SET_STARS'; stars: MemoryStar[] }
  | { type: 'SET_REDUCED_MOTION'; value: boolean }
  | { type: 'SET_GLOWING_STARS'; ids: string[] }
  | { type: 'FOCUS_STAR'; starId: string }
  | { type: 'FOCUS_CLUSTER'; chapterId: ChapterId; camera: LifeMapCamera; text: string }
  | { type: 'MARK_RESOLVED'; starId: string }
  | { type: 'CLEAR_FOCUS' }
  | { type: 'SET_CAMERA'; camera: LifeMapCamera; announce?: boolean }
  | { type: 'ZOOM_CAMERA'; delta: number; originX?: number; originY?: number }
  | { type: 'PAN_CAMERA'; dx: number; dy: number }
  | { type: 'PUSH_MESSAGE'; msg: MessageEnvelope }
  | { type: 'PRUNE_MESSAGES' };

const SOURCE_PRIORITY: Record<MessageSource, number> = {
  focus: 5,
  resolved: 4,
  cluster: 3,
  camera: 2,
  glow: 2,
};

const SOURCE_COOLDOWN: Record<MessageSource, number> = {
  focus: 0,
  resolved: 2000,
  cluster: 3000,
  camera: 1200,
  glow: 5000,
};

const GLOW_LINES = [
  'Something is asking to be seen.',
  'A pattern is lighting up.',
  'This moment connects to something older.',
];

const CHAPTERS: Array<{ id: ChapterId; title: string; subtitle: string }> = [
  { id: 'season-of-becoming', title: 'Season of Becoming', subtitle: 'Growth signals' },
  { id: 'threshold', title: 'Threshold', subtitle: 'Major shifts' },
  { id: 'recovery-arc', title: 'Recovery Arc', subtitle: 'Softening moments' },
  { id: 'purple-dream-field', title: 'Dream Field', subtitle: 'Symbolic memory' },
  { id: 'mirror-of-becoming', title: 'Mirror of Becoming', subtitle: 'Life synthesis' },
];

const CHAPTER_LINES: Record<ChapterId, string> = {
  'season-of-becoming': 'This season shows where you started becoming someone new.',
  threshold: 'A threshold pattern is forming around this chapter.',
  'recovery-arc': 'This recovery arc shows where strain began turning into strength.',
  'purple-dream-field': 'The dream field is surfacing symbolic echoes.',
  'mirror-of-becoming': 'The mirror is gathering the pattern of who you are becoming.',
};

const INITIAL_CAMERA: LifeMapCamera = { x: 50, y: 50, zoom: 1, tilt: 12 };
const MIN_ZOOM = 0.65;
const MAX_ZOOM = 3.6;

const INITIAL_STARS: MemoryStar[] = [
  { id: 'star-1', title: 'First Signal', x: 22, y: 34, size: 18, emotion: 'focus', chapterId: 'season-of-becoming', state: 'idle', intensity: 0.6, recency: 0.8, unresolvedWeight: 0.4, lastActivatedAt: null, narratorLine: 'This was one of the first signals that your rhythm was changing.', connectedTo: ['star-2', 'star-4'] },
  { id: 'star-2', title: 'Threshold Pulse', x: 42, y: 24, size: 22, emotion: 'threshold', chapterId: 'threshold', state: 'idle', intensity: 0.9, recency: 0.7, unresolvedWeight: 0.8, lastActivatedAt: null, narratorLine: 'This moment marks a threshold where the old pattern started breaking.', connectedTo: ['star-1', 'star-3'] },
  { id: 'star-3', title: 'Recovery Bloom', x: 61, y: 42, size: 24, emotion: 'recovery', chapterId: 'recovery-arc', state: 'idle', intensity: 0.85, recency: 0.9, unresolvedWeight: 0.3, lastActivatedAt: null, narratorLine: 'This is where your system began recovering after pressure.', connectedTo: ['star-2', 'star-5'] },
  { id: 'star-4', title: 'Dream Echo', x: 31, y: 64, size: 20, emotion: 'dream', chapterId: 'purple-dream-field', state: 'idle', intensity: 0.7, recency: 0.5, unresolvedWeight: 0.5, lastActivatedAt: null, narratorLine: 'This dream-like memory keeps echoing through the larger pattern.', connectedTo: ['star-1', 'star-5'] },
  { id: 'star-5', title: 'Mirror Moment', x: 72, y: 66, size: 26, emotion: 'mirror', chapterId: 'mirror-of-becoming', state: 'idle', intensity: 0.95, recency: 0.85, unresolvedWeight: 0.6, lastActivatedAt: null, narratorLine: 'This moment reflects a deeper identity pattern coming into focus.', connectedTo: ['star-3', 'star-4'] },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function clampCamera(camera: LifeMapCamera): LifeMapCamera {
  return {
    x: clamp(camera.x, 5, 95),
    y: clamp(camera.y, 5, 95),
    zoom: clamp(camera.zoom, MIN_ZOOM, MAX_ZOOM),
    tilt: clamp(camera.tilt, 0, 38),
  };
}

function starDepth(star: MemoryStar) {
  return Math.round((star.intensity * 130) + (star.recency * 80) - (star.unresolvedWeight * 45));
}

function createMessage(source: MessageSource, text: string, ttl: number | null): MessageEnvelope {
  const now = Date.now();
  return { id: `${source}-${now}`, source, priority: SOURCE_PRIORITY[source], text, createdAt: now, expiresAt: ttl ? now + ttl : null };
}

function pushMessage(state: MessageState, msg: MessageEnvelope): MessageState {
  const now = Date.now();
  const last = state.lastBySource[msg.source] ?? 0;
  if (now - last < SOURCE_COOLDOWN[msg.source]) return state;
  if (state.lastText === msg.text) return state;
  const queue = [...state.queue, msg].sort((a, b) => b.priority - a.priority || b.createdAt - a.createdAt);
  return { queue: queue.slice(0, 5), lastBySource: { ...state.lastBySource, [msg.source]: now }, lastText: msg.text };
}

function pruneMessages(state: MessageState): MessageState {
  const now = Date.now();
  return { ...state, queue: state.queue.filter((message) => !message.expiresAt || message.expiresAt > now) };
}

function getActiveMessage(state: MessageState) {
  return state.queue[0]?.text ?? 'Use the wheel to move through the stars. Drag to pan the constellation.';
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_STARS': {
      const activeStillExists = action.stars.some((star) => star.id === state.activeStarId);
      return { ...state, stars: action.stars, activeStarId: activeStillExists ? state.activeStarId : null, activeChapterId: activeStillExists ? state.activeChapterId : null, phase: activeStillExists ? state.phase : 'living' };
    }
    case 'SET_REDUCED_MOTION':
      return { ...state, reducedMotion: action.value };
    case 'SET_GLOWING_STARS':
      return { ...state, stars: state.stars.map((star) => (star.id === state.activeStarId || star.state === 'resolved' ? star : { ...star, state: action.ids.includes(star.id) ? 'glowing' : 'idle' })) };
    case 'FOCUS_STAR': {
      const star = state.stars.find((item) => item.id === action.starId);
      if (!star) return state;
      return {
        ...state,
        activeStarId: star.id,
        activeChapterId: star.chapterId,
        phase: 'focus',
        camera: clampCamera({ x: star.x, y: star.y, zoom: 2.25, tilt: 24 }),
        stars: state.stars.map((item) => {
          if (item.id === star.id) return { ...item, state: 'active', lastActivatedAt: Date.now() };
          if (item.state === 'active') return { ...item, state: 'idle' };
          return item;
        }),
        messages: pushMessage(state.messages, createMessage('focus', star.narratorLine, null)),
      };
    }
    case 'FOCUS_CLUSTER':
      return { ...state, phase: 'cluster', activeChapterId: action.chapterId, activeStarId: null, camera: clampCamera(action.camera), messages: pushMessage(state.messages, createMessage('cluster', action.text, 18000)) };
    case 'MARK_RESOLVED':
      return { ...state, stars: state.stars.map((star) => (star.id === action.starId ? { ...star, state: 'resolved' } : star)), messages: pushMessage(state.messages, createMessage('resolved', 'This one has softened.', null)) };
    case 'CLEAR_FOCUS':
      return { ...state, phase: 'living', activeStarId: null, activeChapterId: null, camera: INITIAL_CAMERA, stars: state.stars.map((star) => (star.state === 'active' ? { ...star, state: 'idle' } : star)) };
    case 'SET_CAMERA':
      return {
        ...state,
        phase: action.announce ? 'living' : state.phase,
        activeStarId: action.announce ? null : state.activeStarId,
        activeChapterId: action.announce ? null : state.activeChapterId,
        camera: clampCamera(action.camera),
        messages: action.announce ? pushMessage(state.messages, createMessage('camera', 'Spatial camera reset.', 6000)) : state.messages,
      };
    case 'ZOOM_CAMERA': {
      const nextZoom = clamp(state.camera.zoom * (action.delta > 0 ? 0.9 : 1.12), MIN_ZOOM, MAX_ZOOM);
      const nextTilt = clamp(8 + nextZoom * 8, 8, 34);
      return {
        ...state,
        camera: clampCamera({ ...state.camera, zoom: nextZoom, tilt: nextTilt }),
        messages: pushMessage(state.messages, createMessage('camera', nextZoom > state.camera.zoom ? 'Moving deeper into the constellation.' : 'Pulling back to see the larger pattern.', 5000)),
      };
    }
    case 'PAN_CAMERA':
      return {
        ...state,
        camera: clampCamera({ ...state.camera, x: state.camera.x - action.dx / Math.max(state.camera.zoom, 0.8), y: state.camera.y - action.dy / Math.max(state.camera.zoom, 0.8) }),
      };
    case 'PUSH_MESSAGE':
      return { ...state, messages: pushMessage(state.messages, action.msg) };
    case 'PRUNE_MESSAGES':
      return { ...state, messages: pruneMessages(state.messages) };
    default:
      return state;
  }
}

export default function LifeMapScene() {
  const fallbackStars = useMemo(() => INITIAL_STARS, []);
  const liveStars = useMemoryStars(fallbackStars);
  const [state, dispatch] = useReducer(reducer, {
    stars: fallbackStars,
    activeStarId: null,
    activeChapterId: null,
    camera: INITIAL_CAMERA,
    phase: 'living',
    reducedMotion: false,
    messages: { queue: [], lastBySource: {}, lastText: null },
  });

  const glowHistoryRef = useRef<GlowHistoryEntry[]>([]);
  const tickRef = useRef(0);
  const rngRef = useRef(createSeededRandom(90210));
  const lastPatternRef = useRef<string | null>(null);
  const dragRef = useRef<{ active: boolean; x: number; y: number }>({ active: false, x: 0, y: 0 });

  useEffect(() => {
    dispatch({ type: 'SET_STARS', stars: liveStars });
  }, [liveStars]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => dispatch({ type: 'SET_REDUCED_MOTION', value: mq.matches });
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch({ type: 'CLEAR_FOCUS' });
        dispatchTimelineSyncEvent({ phase: 'living', activeStarId: null, activeChapterId: null });
      }
      if (event.key === '+' || event.key === '=') dispatch({ type: 'ZOOM_CAMERA', delta: -1 });
      if (event.key === '-' || event.key === '_') dispatch({ type: 'ZOOM_CAMERA', delta: 1 });
      if (event.key === '0') dispatch({ type: 'SET_CAMERA', camera: INITIAL_CAMERA, announce: true });
      if (event.key === 'ArrowLeft') dispatch({ type: 'PAN_CAMERA', dx: -2.8, dy: 0 });
      if (event.key === 'ArrowRight') dispatch({ type: 'PAN_CAMERA', dx: 2.8, dy: 0 });
      if (event.key === 'ArrowUp') dispatch({ type: 'PAN_CAMERA', dx: 0, dy: -2.8 });
      if (event.key === 'ArrowDown') dispatch({ type: 'PAN_CAMERA', dx: 0, dy: 2.8 });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activeStar = state.stars.find((star) => star.id === state.activeStarId) ?? null;
  const activeMessage = getActiveMessage(state.messages);
  const clusters = useMemo(() => buildPatternClusters(state.stars), [state.stars]);
  const topCluster = clusters[0] ?? null;
  const starById = useMemo(() => new Map(state.stars.map((star) => [star.id, star])), [state.stars]);
  const starfieldStyle: StarfieldStyle = {
    '--camera-x': `${state.camera.x}%`,
    '--camera-y': `${state.camera.y}%`,
    '--camera-zoom': String(state.camera.zoom),
    '--camera-tilt': `${state.camera.tilt}deg`,
  };

  const handleWheel = useCallback((event: React.WheelEvent<HTMLElement>) => {
    event.preventDefault();
    dispatch({ type: 'ZOOM_CAMERA', delta: event.deltaY, originX: event.clientX, originY: event.clientY });
  }, []);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('button, a')) return;
    dragRef.current = { active: true, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (!dragRef.current.active) return;
    const dx = ((event.clientX - dragRef.current.x) / Math.max(window.innerWidth, 1)) * 100;
    const dy = ((event.clientY - dragRef.current.y) / Math.max(window.innerHeight, 1)) * 100;
    dragRef.current = { active: true, x: event.clientX, y: event.clientY };
    dispatch({ type: 'PAN_CAMERA', dx, dy });
  }, []);

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLElement>) => {
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let timer: number | undefined;
    const run = () => {
      const picked = chooseGlowingStars(
        state.stars.filter((star) => star.id !== state.activeStarId),
        glowHistoryRef.current,
        { count: 1 + Math.floor(rngRef.current() * 3), tick: tickRef.current, minTicksBetweenGlows: 2, repeatWindowTicks: 6, maxRepeatsPerWindow: 2 },
        rngRef.current,
      );
      dispatch({ type: 'SET_GLOWING_STARS', ids: picked });
      dispatch({ type: 'PUSH_MESSAGE', msg: createMessage('glow', GLOW_LINES[Math.floor(rngRef.current() * GLOW_LINES.length)], 12000) });
      dispatch({ type: 'PRUNE_MESSAGES' });
      picked.forEach((id) => {
        const star = state.stars.find((item) => item.id === id);
        dispatchNarratorEvent({ event: 'lifemap.star.glow', starId: id, chapterId: star?.chapterId ?? null, emotion: star?.emotion ?? null });
      });
      dispatchTimelineSyncEvent({ phase: 'living', activeStarId: state.activeStarId, activeChapterId: state.activeChapterId });
      glowHistoryRef.current = [...glowHistoryRef.current.slice(-20), { tick: tickRef.current, ids: picked }];
      tickRef.current += 1;
      timer = window.setTimeout(run, state.reducedMotion ? 14000 : 9000);
    };
    timer = window.setTimeout(run, state.reducedMotion ? 14000 : 9000);
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [state.stars, state.activeStarId, state.activeChapterId, state.reducedMotion]);

  useEffect(() => {
    if (!topCluster || lastPatternRef.current === topCluster.id) return;
    lastPatternRef.current = topCluster.id;
    dispatch({ type: 'PUSH_MESSAGE', msg: createMessage('cluster', topCluster.narrativeLine, 22000) });
    dispatchNarratorEvent({ event: 'lifemap.cluster.focus', chapterId: topCluster.chapterId ?? null, emotion: topCluster.emotion ?? null });
  }, [topCluster]);

  return (
    <main className="life-map-shell" aria-label="URAI spatial Life Map scene" onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
      <WebGLLifeMapField />
      <div className="depth-fog" aria-hidden />
      <header className="lifemap-title" aria-label="Life Map title">
        <p>URAI Sky Map V1 · Spatial constellation</p>
        <h1>Wheel to zoom · drag to pan · click stars to enter memories</h1>
      </header>
      <section className={`lifemap-space ${activeStar ? 'is-focused' : ''}`}>
        <div className="starfield" style={starfieldStyle}>
          <svg className="connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {state.stars.flatMap((star) => star.connectedTo.map((to) => [star.id, to] as const)).filter(([a, b]) => a < b).map(([a, b]) => {
              const s1 = starById.get(a);
              const s2 = starById.get(b);
              if (!s1 || !s2) return null;
              const isActive = !!activeStar && (a === activeStar.id || b === activeStar.id || activeStar.connectedTo.includes(a) || activeStar.connectedTo.includes(b));
              return <line key={`${a}-${b}`} className={`connection-line is-flowing ${isActive ? 'is-active' : activeStar ? 'is-dimmed' : 'is-glowing'}`} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} />;
            })}
          </svg>
          {state.stars.map((star) => {
            const connected = !!activeStar && activeStar.connectedTo.includes(star.id);
            const chapterFocused = state.phase === 'cluster' && star.chapterId === state.activeChapterId;
            const patternFocused = !!topCluster && topCluster.starIds.includes(star.id);
            const dimmed = !!activeStar && star.id !== activeStar.id && !connected;
            const depth = starDepth(star);
            const starStyle: StarStyle = {
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--star-z': `${depth}px`,
              '--star-scale': String(1 + depth / 380),
            };
            return (
              <button key={star.id} type="button" className={`memory-star state-${star.state} ${connected ? 'is-connected' : ''} ${chapterFocused ? 'is-chapter-focused' : ''} ${patternFocused ? 'is-pattern-focused' : ''} ${dimmed ? 'is-dimmed' : ''}`} style={starStyle} aria-label={`${star.title}, ${star.emotion}, ${star.state}`} onClick={(event) => {
                event.stopPropagation();
                dispatch({ type: 'FOCUS_STAR', starId: star.id });
                dispatchNarratorEvent({ event: 'lifemap.star.focus', starId: star.id, chapterId: star.chapterId, emotion: star.emotion });
                dispatchTimelineSyncEvent({ phase: 'focus', activeStarId: star.id, activeChapterId: star.chapterId });
              }}>
                <span>{star.title}</span>
              </button>
            );
          })}
        </div>
      </section>
      <NarratorPanel />
      <div className="camera-controls" aria-label="Camera controls">
        <button type="button" onClick={() => dispatch({ type: 'ZOOM_CAMERA', delta: -1 })}>Zoom in</button>
        <button type="button" onClick={() => dispatch({ type: 'ZOOM_CAMERA', delta: 1 })}>Zoom out</button>
        <button type="button" onClick={() => dispatch({ type: 'SET_CAMERA', camera: INITIAL_CAMERA, announce: true })}>Reset view</button>
        <span>{Math.round(state.camera.zoom * 100)}%</span>
      </div>
      {topCluster && (
        <aside className="panel pattern-panel" aria-label="Pattern insight panel">
          <h2>{topCluster.label}</h2>
          <p>{topCluster.narrativeLine}</p>
          <small>{topCluster.starIds.length} memories · intensity {Math.round(topCluster.intensity * 100)} · unresolved {Math.round(topCluster.unresolvedWeight * 100)}</small>
        </aside>
      )}
      <aside className="panel export-panel" aria-label="Export panel"><button type="button">Export snapshot</button><button type="button">Export arc</button></aside>
      <aside className="panel companion-panel" aria-label="Companion panel"><h2>Companion</h2><p>{activeMessage}</p></aside>
      {activeStar && (
        <aside className="panel detail" aria-live="polite">
          <h3>{activeStar.title}</h3>
          <p>{activeStar.emotion} · {CHAPTERS.find((chapter) => chapter.id === activeStar.chapterId)?.title}</p>
          <p>{activeStar.narratorLine}</p>
          <div className="actions">
            <button type="button" onClick={() => { dispatch({ type: 'PUSH_MESSAGE', msg: createMessage('focus', 'Replaying the emotional thread.', 12000) }); dispatchNarratorEvent({ event: 'lifemap.star.focus', starId: activeStar.id, chapterId: activeStar.chapterId, emotion: activeStar.emotion, action: 'replay' }); }}>Replay</button>
            <button type="button" onClick={() => { dispatch({ type: 'PUSH_MESSAGE', msg: createMessage('focus', 'Reflection mode is open.', 12000) }); dispatchNarratorEvent({ event: 'lifemap.star.focus', starId: activeStar.id, chapterId: activeStar.chapterId, emotion: activeStar.emotion, action: 'reflect' }); }}>Reflect</button>
            <button type="button" onClick={() => { dispatch({ type: 'MARK_RESOLVED', starId: activeStar.id }); dispatchNarratorEvent({ event: 'lifemap.star.resolved', starId: activeStar.id, chapterId: activeStar.chapterId, emotion: activeStar.emotion, action: 'resolve' }); dispatchTimelineSyncEvent({ phase: 'focus', activeStarId: activeStar.id, activeChapterId: activeStar.chapterId }); }}>Mark resolved</button>
          </div>
        </aside>
      )}
      <nav className="chapter-row" aria-label="Chapter anchors">
        {CHAPTERS.map((chapter) => (
          <button type="button" key={chapter.id} className={`chapter-pill ${state.activeChapterId === chapter.id ? 'active' : ''}`} onClick={() => {
            const chapterStars = state.stars.filter((star) => star.chapterId === chapter.id);
            if (!chapterStars.length) return;
            const x = chapterStars.reduce((sum, star) => sum + star.x, 0) / chapterStars.length;
            const y = chapterStars.reduce((sum, star) => sum + star.y, 0) / chapterStars.length;
            dispatch({ type: 'FOCUS_CLUSTER', chapterId: chapter.id, camera: { x, y, zoom: 1.85, tilt: 22 }, text: CHAPTER_LINES[chapter.id] });
            dispatchNarratorEvent({ event: 'lifemap.cluster.focus', chapterId: chapter.id });
            dispatchTimelineSyncEvent({ phase: 'cluster', activeStarId: null, activeChapterId: chapter.id });
          }}><strong>{chapter.title}</strong><small>{chapter.subtitle}</small></button>
        ))}
      </nav>
      <style jsx>{`
        .life-map-shell { min-height: 100vh; background: radial-gradient(circle at 50% 28%, #26366d, #0a0f20 58%, #05060f 100%); color: #eef3ff; position: relative; padding: 1rem; overflow: hidden; touch-action: none; cursor: grab; perspective: 1100px; }
        .life-map-shell:active { cursor: grabbing; }
        .depth-fog { position: absolute; inset: 0; z-index: 2; pointer-events: none; background: radial-gradient(circle at 50% 45%, transparent 0 34%, rgba(4,7,17,.18) 62%, rgba(0,0,0,.68) 100%); }
        .lifemap-title { position: absolute; z-index: 7; left: 29%; top: 1rem; pointer-events: none; }
        .lifemap-title p { margin: 0; color: rgba(238, 243, 255, 0.55); font-size: 0.64rem; letter-spacing: 0.32em; text-transform: uppercase; }
        .lifemap-title h1 { margin: 0.25rem 0 0; color: rgba(255, 255, 255, 0.94); font-size: 1rem; font-weight: 700; }
        .lifemap-space { position: absolute; inset: 0 0 120px; z-index: 3; perspective: 1100px; transform-style: preserve-3d; }
        .starfield { position: absolute; inset: 0; transform-style: preserve-3d; will-change: transform; transform-origin: var(--camera-x) var(--camera-y); transform: perspective(1100px) rotateX(var(--camera-tilt)) translate3d(calc(50% - var(--camera-x)), calc(50% - var(--camera-y)), 0) scale(var(--camera-zoom)); transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1); }
        .connections { position: absolute; inset: 0; width: 100%; height: 100%; transform: translateZ(-80px); opacity: .82; }
        .connection-line { stroke: rgba(190, 220, 255, 0.22); stroke-width: 0.2; stroke-dasharray: 1 1.8; }
        .connection-line.is-flowing { animation: constellationFlow 6s linear infinite; }
        .connection-line.is-active { stroke: rgba(210, 240, 255, 0.75); stroke-width: 0.34; filter: drop-shadow(0 0 8px rgba(125, 211, 252, 0.7)); }
        .connection-line.is-dimmed { opacity: 0.25; }
        .memory-star { position: absolute; transform: translate3d(-50%, -50%, var(--star-z)) scale(var(--star-scale)); border: 0; border-radius: 999px; background: radial-gradient(circle, #f8fbff 0%, #b4ceff 48%, #779dff 100%); color: #071022; font-weight: 700; display: grid; place-items: center; box-shadow: 0 0 10px rgba(255,255,255,.75), 0 0 24px rgba(120,170,255,.45), 0 22px 42px rgba(0,0,0,.25); transition: opacity .28s ease, transform .28s ease, filter .28s ease; cursor: pointer; transform-style: preserve-3d; }
        .memory-star:hover { filter: brightness(1.22); transform: translate3d(-50%, -50%, calc(var(--star-z) + 50px)) scale(calc(var(--star-scale) * 1.18)); }
        .memory-star span { position: absolute; top: calc(100% + .42rem); left: 50%; transform: translateX(-50%) translateZ(28px); white-space: nowrap; font-size: .68rem; color: rgba(238,243,255,.9); text-shadow: 0 1px 8px rgba(0,0,0,.85); pointer-events: none; }
        .memory-star.state-glowing { animation: starPulse 2.8s ease-in-out infinite; }
        .memory-star.state-active { transform: translate3d(-50%, -50%, calc(var(--star-z) + 140px)) scale(calc(var(--star-scale) * 1.35)); z-index: 3; }
        .memory-star.is-dimmed { opacity: .24; }
        .memory-star.is-chapter-focused { box-shadow: 0 0 16px rgba(255,255,255,.9), 0 0 44px rgba(196,181,253,.65); }
        .memory-star.is-pattern-focused { box-shadow: 0 0 18px rgba(255,255,255,.95), 0 0 54px rgba(251,191,36,.55), 0 0 90px rgba(251,191,36,.28); }
        .panel { position: absolute; z-index: 8; background: rgba(7,10,25,.75); border: 1px solid rgba(157,196,255,.32); border-radius: 12px; padding: .8rem; backdrop-filter: blur(6px); }
        .export-panel { left: 1rem; top: 1rem; display: flex; gap: .5rem; }
        .camera-controls { position: absolute; z-index: 9; left: 50%; transform: translateX(-50%); top: 4.25rem; display: flex; align-items: center; gap: .45rem; border: 1px solid rgba(157,196,255,.32); border-radius: 999px; background: rgba(7,10,25,.68); padding: .4rem; backdrop-filter: blur(8px); }
        .camera-controls button, .camera-controls span { border: 1px solid rgba(157,196,255,.32); background: rgba(13,20,45,.8); border-radius: 999px; color: #edf4ff; padding: .42rem .72rem; font-size: .78rem; }
        .pattern-panel { left: 1rem; top: 74px; width: 320px; border-color: rgba(251,191,36,.42); animation: patternPanelIn 520ms ease both; }
        .pattern-panel h2 { margin: 0 0 .4rem; font-size: .95rem; }
        .pattern-panel p { margin: 0 0 .5rem; line-height: 1.4; }
        .pattern-panel small { opacity: .78; }
        .companion-panel { right: 1rem; top: 1rem; width: 280px; }
        .detail { right: 1rem; top: 130px; width: 300px; }
        .actions { display: flex; gap: .5rem; flex-wrap: wrap; }
        button { font: inherit; }
        .panel button, .chapter-pill { border: 1px solid rgba(157,196,255,.4); background: rgba(13,20,45,.85); color: #edf4ff; }
        .panel button { border-radius: 999px; padding: .45rem .7rem; cursor: pointer; }
        .chapter-row { position: absolute; z-index: 8; left: 1rem; right: 1rem; bottom: 1rem; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: .5rem; }
        .chapter-pill { border-radius: 999px; padding: .5rem .7rem; text-align: left; cursor: pointer; }
        .chapter-pill.active { border-color: #b9d7ff; box-shadow: 0 0 18px rgba(125,211,252,.35); }
        .chapter-pill small { display: block; opacity: .8; }
        @keyframes constellationFlow { to { stroke-dashoffset: -80; } }
        @keyframes starPulse { 0%, 100% { transform: translate3d(-50%, -50%, var(--star-z)) scale(var(--star-scale)); } 50% { transform: translate3d(-50%, -50%, calc(var(--star-z) + 36px)) scale(calc(var(--star-scale) * 1.12)); } }
        @keyframes patternPanelIn { from { opacity: 0; transform: translateY(-8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (max-width: 760px) { .lifemap-title { left: 1rem; right: 1rem; } .camera-controls { left: 1rem; right: 1rem; transform: none; top: 4.5rem; overflow-x: auto; } .companion-panel, .detail, .pattern-panel { left: 1rem; right: 1rem; width: auto; } .pattern-panel { top: 7.8rem; } .detail { top: auto; bottom: 7.5rem; } .chapter-row { grid-template-columns: 1fr; max-height: 6.5rem; overflow: auto; } }
        @media (prefers-reduced-motion: reduce) { .memory-star, .connection-line, .starfield, .pattern-panel { animation: none !important; transition-duration: .01ms !important; } }
      `}</style>
    </main>
  );
}
