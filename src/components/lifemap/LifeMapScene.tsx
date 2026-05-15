'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef, type CSSProperties, type PointerEvent, type WheelEvent } from 'react';
import WebGLLifeMapField from './WebGLLifeMapField';
import { useMemoryStars, type MemoryStar } from './useMemoryStars';
import {
  dispatchNarratorEvent,
  dispatchTimelineSyncEvent,
  type ChapterId,
  type LifeMapPhase,
} from './lifeMapEvents';
import { chooseGlowingStars, createSeededRandom, type GlowHistoryEntry } from './lifeMapGlowScheduler';

type Camera = { x: number; y: number; zoom: number; tilt: number };
type MessageSource = 'focus' | 'resolved' | 'glow' | 'camera';

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
  camera: Camera;
  phase: LifeMapPhase;
  messages: MessageState;
  reducedMotion: boolean;
  showThreads: boolean;
};

type Action =
  | { type: 'SET_STARS'; stars: MemoryStar[] }
  | { type: 'SET_REDUCED_MOTION'; value: boolean }
  | { type: 'SET_GLOWING_STARS'; ids: string[] }
  | { type: 'FOCUS_STAR'; starId: string }
  | { type: 'FOCUS_CHAPTER'; chapterId: ChapterId; camera: Camera; text: string }
  | { type: 'MARK_RESOLVED'; starId: string }
  | { type: 'CLEAR_FOCUS' }
  | { type: 'SET_CAMERA'; camera: Camera; announce?: boolean }
  | { type: 'ZOOM_CAMERA'; delta: number }
  | { type: 'PAN_CAMERA'; dx: number; dy: number }
  | { type: 'TOGGLE_THREADS' }
  | { type: 'PUSH_MESSAGE'; msg: MessageEnvelope }
  | { type: 'PRUNE_MESSAGES' };

type FieldStyle = CSSProperties & {
  '--camera-x': string;
  '--camera-y': string;
  '--camera-zoom': string;
  '--camera-tilt': string;
};

type StarStyle = CSSProperties & {
  '--star-z': string;
  '--star-scale': string;
  '--star-alpha': string;
};

const INITIAL_CAMERA: Camera = { x: 50, y: 50, zoom: 1, tilt: 0 };
const MIN_ZOOM = 0.78;
const MAX_ZOOM = 4.2;

const SOURCE_PRIORITY: Record<MessageSource, number> = {
  focus: 5,
  resolved: 4,
  camera: 3,
  glow: 2,
};

const SOURCE_COOLDOWN: Record<MessageSource, number> = {
  focus: 0,
  resolved: 1800,
  camera: 900,
  glow: 5200,
};

const GLOW_LINES = [
  'A memory is beginning to glow.',
  'One part of the map is asking for attention.',
  'A soft signal is rising from the background.',
];

const CHAPTERS: Array<{ id: ChapterId; title: string; subtitle: string; x: number; y: number }> = [
  { id: 'season-of-becoming', title: 'Becoming', subtitle: 'growth', x: 38, y: 39 },
  { id: 'threshold', title: 'Threshold', subtitle: 'major shifts', x: 50, y: 31 },
  { id: 'recovery-arc', title: 'Recovery', subtitle: 'softening', x: 62, y: 43 },
  { id: 'purple-dream-field', title: 'Dream Field', subtitle: 'symbols', x: 41, y: 61 },
  { id: 'mirror-of-becoming', title: 'Mirror', subtitle: 'life synthesis', x: 64, y: 61 },
];

const CHAPTER_LINES: Record<ChapterId, string> = {
  'season-of-becoming': 'The becoming chapter shows where growth signals are collecting.',
  threshold: 'A threshold is where pressure becomes visible enough to name.',
  'recovery-arc': 'The recovery arc shows strain turning into steadier rhythm.',
  'purple-dream-field': 'The dream field gathers symbolic echoes and soft memory fragments.',
  'mirror-of-becoming': 'The mirror chapter reflects the larger pattern of who you are becoming.',
};

const INITIAL_STARS: MemoryStar[] = [
  { id: 'star-1', title: 'First Signal', x: 37, y: 40, size: 10, emotion: 'focus', chapterId: 'season-of-becoming', state: 'idle', intensity: 0.62, recency: 0.78, unresolvedWeight: 0.35, lastActivatedAt: null, narratorLine: 'This was one of the first signals that your rhythm was changing.', connectedTo: ['star-2', 'star-4'] },
  { id: 'star-2', title: 'Threshold Pulse', x: 49, y: 31, size: 11, emotion: 'threshold', chapterId: 'threshold', state: 'idle', intensity: 0.92, recency: 0.72, unresolvedWeight: 0.82, lastActivatedAt: null, narratorLine: 'This moment marks a threshold where the old pattern started breaking.', connectedTo: ['star-1', 'star-3', 'star-8'] },
  { id: 'star-3', title: 'Recovery Bloom', x: 62, y: 43, size: 12, emotion: 'recovery', chapterId: 'recovery-arc', state: 'idle', intensity: 0.88, recency: 0.9, unresolvedWeight: 0.24, lastActivatedAt: null, narratorLine: 'This is where your system began recovering after pressure.', connectedTo: ['star-2', 'star-5', 'star-7'] },
  { id: 'star-4', title: 'Dream Echo', x: 41, y: 61, size: 10, emotion: 'dream', chapterId: 'purple-dream-field', state: 'idle', intensity: 0.72, recency: 0.52, unresolvedWeight: 0.48, lastActivatedAt: null, narratorLine: 'This dream-like memory keeps echoing through the larger pattern.', connectedTo: ['star-1', 'star-5'] },
  { id: 'star-5', title: 'Mirror Moment', x: 64, y: 61, size: 13, emotion: 'mirror', chapterId: 'mirror-of-becoming', state: 'idle', intensity: 0.95, recency: 0.84, unresolvedWeight: 0.55, lastActivatedAt: null, narratorLine: 'This moment reflects a deeper identity pattern coming into focus.', connectedTo: ['star-3', 'star-4'] },
  { id: 'star-6', title: 'Quiet Return', x: 54, y: 52, size: 9, emotion: 'recovery', chapterId: 'recovery-arc', state: 'idle', intensity: 0.66, recency: 0.7, unresolvedWeight: 0.22, lastActivatedAt: null, narratorLine: 'A quieter rhythm returned after the noise softened.', connectedTo: ['star-3'] },
  { id: 'star-7', title: 'Protected Hour', x: 59, y: 35, size: 8, emotion: 'focus', chapterId: 'season-of-becoming', state: 'idle', intensity: 0.58, recency: 0.64, unresolvedWeight: 0.18, lastActivatedAt: null, narratorLine: 'A protected hour became a small doorway back into clarity.', connectedTo: ['star-3'] },
  { id: 'star-8', title: 'Pressure Named', x: 46, y: 49, size: 9, emotion: 'threshold', chapterId: 'threshold', state: 'idle', intensity: 0.74, recency: 0.62, unresolvedWeight: 0.68, lastActivatedAt: null, narratorLine: 'The pressure changed when it became something you could name.', connectedTo: ['star-2'] },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function clampCamera(camera: Camera): Camera {
  return {
    x: clamp(camera.x, 24, 76),
    y: clamp(camera.y, 26, 74),
    zoom: clamp(camera.zoom, MIN_ZOOM, MAX_ZOOM),
    tilt: clamp(camera.tilt, 0, 12),
  };
}

function starDepth(star: MemoryStar) {
  return Math.round((star.intensity * 92) + (star.recency * 48) - (star.unresolvedWeight * 30));
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
  return { queue: queue.slice(0, 4), lastBySource: { ...state.lastBySource, [msg.source]: now }, lastText: msg.text };
}

function pruneMessages(state: MessageState): MessageState {
  const now = Date.now();
  return { ...state, queue: state.queue.filter((message) => !message.expiresAt || message.expiresAt > now) };
}

function getActiveMessage(state: MessageState) {
  return state.queue[0]?.text ?? 'Wheel inward to enter the memory field. Click a glowing star when it feels alive.';
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
        showThreads: true,
        camera: clampCamera({ x: star.x, y: star.y, zoom: 2.55, tilt: 7 }),
        stars: state.stars.map((item) => {
          if (item.id === star.id) return { ...item, state: 'active', lastActivatedAt: Date.now() };
          if (item.state === 'active') return { ...item, state: 'idle' };
          return item;
        }),
        messages: pushMessage(state.messages, createMessage('focus', star.narratorLine, null)),
      };
    }
    case 'FOCUS_CHAPTER':
      return { ...state, phase: 'cluster', activeChapterId: action.chapterId, activeStarId: null, showThreads: false, camera: clampCamera(action.camera), messages: pushMessage(state.messages, createMessage('camera', action.text, 12000)) };
    case 'MARK_RESOLVED':
      return { ...state, stars: state.stars.map((star) => (star.id === action.starId ? { ...star, state: 'resolved' } : star)), messages: pushMessage(state.messages, createMessage('resolved', 'This one has softened.', null)) };
    case 'CLEAR_FOCUS':
      return { ...state, phase: 'living', activeStarId: null, activeChapterId: null, camera: INITIAL_CAMERA, showThreads: false, stars: state.stars.map((star) => (star.state === 'active' ? { ...star, state: 'idle' } : star)) };
    case 'SET_CAMERA':
      return {
        ...state,
        phase: action.announce ? 'living' : state.phase,
        activeStarId: action.announce ? null : state.activeStarId,
        activeChapterId: action.announce ? null : state.activeChapterId,
        showThreads: action.announce ? false : state.showThreads,
        camera: clampCamera(action.camera),
        messages: action.announce ? pushMessage(state.messages, createMessage('camera', 'The map returned to its full shape.', 5200)) : state.messages,
      };
    case 'ZOOM_CAMERA': {
      const nextZoom = clamp(state.camera.zoom * (action.delta > 0 ? 0.9 : 1.13), MIN_ZOOM, MAX_ZOOM);
      const nextTilt = nextZoom > 1.8 ? 6 : 0;
      return {
        ...state,
        camera: clampCamera({ ...state.camera, zoom: nextZoom, tilt: nextTilt }),
        messages: pushMessage(state.messages, createMessage('camera', nextZoom > state.camera.zoom ? 'Entering the memory field.' : 'Pulling back into the larger sky.', 4200)),
      };
    }
    case 'PAN_CAMERA':
      return { ...state, camera: clampCamera({ ...state.camera, x: state.camera.x - action.dx / Math.max(state.camera.zoom, 1), y: state.camera.y - action.dy / Math.max(state.camera.zoom, 1) }) };
    case 'TOGGLE_THREADS':
      return { ...state, showThreads: !state.showThreads };
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
    showThreads: false,
    messages: { queue: [], lastBySource: {}, lastText: null },
  });

  const glowHistoryRef = useRef<GlowHistoryEntry[]>([]);
  const tickRef = useRef(0);
  const rngRef = useRef(createSeededRandom(90210));
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
      if (event.key === 't' || event.key === 'T') dispatch({ type: 'TOGGLE_THREADS' });
      if (event.key === 'ArrowLeft') dispatch({ type: 'PAN_CAMERA', dx: -2, dy: 0 });
      if (event.key === 'ArrowRight') dispatch({ type: 'PAN_CAMERA', dx: 2, dy: 0 });
      if (event.key === 'ArrowUp') dispatch({ type: 'PAN_CAMERA', dx: 0, dy: -2 });
      if (event.key === 'ArrowDown') dispatch({ type: 'PAN_CAMERA', dx: 0, dy: 2 });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activeStar = state.stars.find((star) => star.id === state.activeStarId) ?? null;
  const activeMessage = getActiveMessage(state.messages);
  const starById = useMemo(() => new Map(state.stars.map((star) => [star.id, star])), [state.stars]);
  const isDeep = state.camera.zoom > 1.45 || Boolean(activeStar);
  const fieldStyle: FieldStyle = {
    '--camera-x': `${state.camera.x}%`,
    '--camera-y': `${state.camera.y}%`,
    '--camera-zoom': String(state.camera.zoom),
    '--camera-tilt': `${state.camera.tilt}deg`,
  };

  const handleWheel = useCallback((event: WheelEvent<HTMLElement>) => {
    event.preventDefault();
    dispatch({ type: 'ZOOM_CAMERA', delta: event.deltaY });
  }, []);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('button, a')) return;
    dragRef.current = { active: true, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (!dragRef.current.active) return;
    const dx = ((event.clientX - dragRef.current.x) / Math.max(window.innerWidth, 1)) * 100;
    const dy = ((event.clientY - dragRef.current.y) / Math.max(window.innerHeight, 1)) * 100;
    dragRef.current = { active: true, x: event.clientX, y: event.clientY };
    dispatch({ type: 'PAN_CAMERA', dx, dy });
  }, []);

  const handlePointerUp = useCallback((event: PointerEvent<HTMLElement>) => {
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let timer: number | undefined;
    const run = () => {
      const picked = chooseGlowingStars(
        state.stars.filter((star) => star.id !== state.activeStarId),
        glowHistoryRef.current,
        { count: 1, tick: tickRef.current, minTicksBetweenGlows: 2, repeatWindowTicks: 6, maxRepeatsPerWindow: 2 },
        rngRef.current,
      );
      dispatch({ type: 'SET_GLOWING_STARS', ids: picked });
      dispatch({ type: 'PUSH_MESSAGE', msg: createMessage('glow', GLOW_LINES[Math.floor(rngRef.current() * GLOW_LINES.length)], 9000) });
      dispatch({ type: 'PRUNE_MESSAGES' });
      picked.forEach((id) => {
        const star = state.stars.find((item) => item.id === id);
        dispatchNarratorEvent({ event: 'lifemap.star.glow', starId: id, chapterId: star?.chapterId ?? null, emotion: star?.emotion ?? null });
      });
      glowHistoryRef.current = [...glowHistoryRef.current.slice(-20), { tick: tickRef.current, ids: picked }];
      tickRef.current += 1;
      timer = window.setTimeout(run, state.reducedMotion ? 14000 : 9000);
    };
    timer = window.setTimeout(run, state.reducedMotion ? 14000 : 9000);
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [state.stars, state.activeStarId, state.reducedMotion]);

  return (
    <main className={`life-map-shell ${isDeep ? 'is-deep' : ''} ${activeStar ? 'has-active-star' : ''}`} aria-label="URAI immersive Life Map" onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
      <WebGLLifeMapField />
      <div className="cosmic-vignette" aria-hidden />
      <div className="life-map-orb" aria-hidden />

      <header className="life-map-hud" aria-label="Life Map status">
        <p>URAI Life Map</p>
        <h1>{activeStar ? activeStar.title : 'Immersive memory field'}</h1>
        <span>{activeStar ? 'Memory opened' : 'Wheel inward · drag to drift · click a glowing star'}</span>
      </header>

      <section className={`field-space ${state.showThreads || activeStar ? 'show-threads' : ''}`}>
        <div className="field-camera" style={fieldStyle}>
          <svg className="threads" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {state.stars.flatMap((star) => star.connectedTo.map((to) => [star.id, to] as const)).filter(([a, b]) => a < b).map(([a, b]) => {
              const s1 = starById.get(a);
              const s2 = starById.get(b);
              if (!s1 || !s2) return null;
              const activeThread = !!activeStar && (a === activeStar.id || b === activeStar.id || activeStar.connectedTo.includes(a) || activeStar.connectedTo.includes(b));
              return <line key={`${a}-${b}`} className={activeThread ? 'thread active' : 'thread'} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} />;
            })}
          </svg>

          {state.stars.map((star) => {
            const depth = starDepth(star);
            const dimmed = !!activeStar && star.id !== activeStar.id && !activeStar.connectedTo.includes(star.id);
            const style: StarStyle = {
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--star-z': `${depth}px`,
              '--star-scale': String(1 + depth / 520),
              '--star-alpha': String(clamp(0.52 + star.recency * 0.42, 0.5, 0.96)),
            };
            return (
              <button key={star.id} type="button" className={`memory-node state-${star.state} ${star.id === activeStar?.id ? 'active' : ''} ${dimmed ? 'dimmed' : ''}`} style={style} aria-label={`Open ${star.title}`} onClick={(event) => {
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

      <aside className="companion-whisper" aria-live="polite">
        <strong>Companion</strong>
        <span>{activeMessage}</span>
      </aside>

      <nav className="chapter-dock" aria-label="Life Map chapters">
        {CHAPTERS.map((chapter) => (
          <button key={chapter.id} type="button" className={state.activeChapterId === chapter.id ? 'active' : ''} onClick={() => {
            dispatch({ type: 'FOCUS_CHAPTER', chapterId: chapter.id, camera: { x: chapter.x, y: chapter.y, zoom: 1.55, tilt: 4 }, text: CHAPTER_LINES[chapter.id] });
            dispatchNarratorEvent({ event: 'lifemap.cluster.focus', chapterId: chapter.id });
            dispatchTimelineSyncEvent({ phase: 'cluster', activeStarId: null, activeChapterId: chapter.id });
          }}>
            <strong>{chapter.title}</strong>
            <span>{chapter.subtitle}</span>
          </button>
        ))}
      </nav>

      <div className="camera-dock" aria-label="Camera controls">
        <button type="button" onClick={() => dispatch({ type: 'ZOOM_CAMERA', delta: -1 })}>Enter</button>
        <button type="button" onClick={() => dispatch({ type: 'ZOOM_CAMERA', delta: 1 })}>Pull back</button>
        <button type="button" onClick={() => dispatch({ type: 'TOGGLE_THREADS' })}>{state.showThreads ? 'Hide threads' : 'Show threads'}</button>
        <button type="button" onClick={() => dispatch({ type: 'SET_CAMERA', camera: INITIAL_CAMERA, announce: true })}>Reset</button>
        <span>{Math.round(state.camera.zoom * 100)}%</span>
      </div>

      {activeStar && (
        <aside className="memory-card" aria-live="polite">
          <p>{CHAPTERS.find((chapter) => chapter.id === activeStar.chapterId)?.title}</p>
          <h2>{activeStar.title}</h2>
          <span>{activeStar.narratorLine}</span>
          <div>
            <button type="button" onClick={() => dispatch({ type: 'PUSH_MESSAGE', msg: createMessage('focus', 'Replaying the emotional thread.', 9000) })}>Replay</button>
            <button type="button" onClick={() => dispatch({ type: 'MARK_RESOLVED', starId: activeStar.id })}>Soften</button>
            <button type="button" onClick={() => dispatch({ type: 'CLEAR_FOCUS' })}>Close</button>
          </div>
        </aside>
      )}

      <style jsx>{`
        .life-map-shell {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          color: white;
          background: radial-gradient(circle at 50% 44%, #17295c 0%, #070c1d 54%, #01020a 100%);
          touch-action: none;
          cursor: grab;
          perspective: 1400px;
          isolation: isolate;
        }
        .life-map-shell:active { cursor: grabbing; }
        .cosmic-vignette, .life-map-orb { position: absolute; inset: 0; pointer-events: none; }
        .cosmic-vignette {
          z-index: 2;
          background:
            radial-gradient(circle at 50% 48%, transparent 0 26%, rgba(0,0,0,.18) 56%, rgba(0,0,0,.76) 100%),
            radial-gradient(circle at 50% 54%, rgba(125,211,252,.09), transparent 34%);
        }
        .life-map-orb {
          z-index: 1;
          inset: 18% 20% 14%;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(125,211,252,.12), rgba(75,92,190,.04) 44%, transparent 68%);
          filter: blur(8px);
        }
        .life-map-hud {
          position: absolute;
          z-index: 8;
          left: 50%;
          top: 1rem;
          transform: translateX(-50%);
          text-align: center;
          pointer-events: none;
          text-shadow: 0 2px 16px rgba(0,0,0,.85);
        }
        .life-map-hud p { margin: 0; font-size: .62rem; letter-spacing: .42em; text-transform: uppercase; color: rgba(255,255,255,.48); }
        .life-map-hud h1 { margin: .2rem 0 0; font-size: clamp(1rem, 2.1vw, 1.8rem); letter-spacing: .02em; }
        .life-map-hud span { display: block; margin-top: .25rem; font-size: .74rem; color: rgba(255,255,255,.58); }
        .field-space {
          position: absolute;
          z-index: 4;
          inset: 0;
          perspective: 1400px;
          transform-style: preserve-3d;
        }
        .field-camera {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transform-origin: var(--camera-x) var(--camera-y);
          will-change: transform;
          transform: perspective(1400px) rotateX(var(--camera-tilt)) translate3d(calc(50% - var(--camera-x)), calc(50% - var(--camera-y)), 0) scale(var(--camera-zoom));
          transition: transform 480ms cubic-bezier(.19, 1, .22, 1);
        }
        .threads {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transform: translateZ(-110px);
          opacity: 0;
          transition: opacity .45s ease;
        }
        .show-threads .threads { opacity: .34; }
        .thread { stroke: rgba(180,215,255,.18); stroke-width: .11; }
        .thread.active { stroke: rgba(220,245,255,.48); stroke-width: .16; filter: drop-shadow(0 0 5px rgba(125,211,252,.42)); }
        .memory-node {
          position: absolute;
          transform: translate3d(-50%, -50%, var(--star-z)) scale(var(--star-scale));
          width: 10px;
          height: 10px;
          border: 0;
          border-radius: 999px;
          background: radial-gradient(circle at 42% 32%, #fff 0%, #dcecff 22%, #8fb2ff 54%, rgba(116,151,255,.12) 100%);
          box-shadow: 0 0 8px rgba(255,255,255,.76), 0 0 28px rgba(125,170,255,.48), 0 0 72px rgba(125,211,252,.16);
          opacity: var(--star-alpha);
          cursor: pointer;
          transition: opacity .35s ease, transform .35s ease, filter .35s ease;
          transform-style: preserve-3d;
        }
        .memory-node::before {
          content: '';
          position: absolute;
          inset: -16px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255,255,255,.18), transparent 62%);
          opacity: .32;
        }
        .memory-node:hover, .memory-node.active {
          opacity: 1;
          filter: brightness(1.18);
          transform: translate3d(-50%, -50%, calc(var(--star-z) + 54px)) scale(calc(var(--star-scale) * 1.18));
        }
        .memory-node.state-glowing { animation: nodePulse 3.2s ease-in-out infinite; }
        .memory-node.dimmed { opacity: .18; }
        .memory-node span {
          position: absolute;
          top: calc(100% + .5rem);
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          color: rgba(255,255,255,.78);
          font-size: .62rem;
          letter-spacing: .015em;
          text-shadow: 0 2px 12px rgba(0,0,0,.95);
          opacity: 0;
          pointer-events: none;
          transition: opacity .25s ease;
        }
        .is-deep .memory-node span, .memory-node:hover span, .memory-node.active span { opacity: .88; }
        .companion-whisper {
          position: absolute;
          z-index: 8;
          right: 1rem;
          top: 1rem;
          width: min(280px, calc(100vw - 2rem));
          border: 1px solid rgba(157,196,255,.22);
          border-radius: 16px;
          background: rgba(4,7,18,.52);
          backdrop-filter: blur(10px);
          padding: .75rem .85rem;
          color: rgba(255,255,255,.76);
          box-shadow: 0 20px 54px rgba(0,0,0,.22);
        }
        .companion-whisper strong { display: block; margin-bottom: .3rem; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.52); }
        .companion-whisper span { font-size: .82rem; line-height: 1.45; }
        .camera-dock, .chapter-dock, .memory-card {
          position: absolute;
          z-index: 9;
          border: 1px solid rgba(157,196,255,.24);
          background: rgba(5,8,20,.56);
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 64px rgba(0,0,0,.26);
        }
        .camera-dock {
          left: 50%;
          bottom: 6.2rem;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: .4rem;
          border-radius: 999px;
          padding: .36rem;
        }
        .camera-dock button, .camera-dock span, .memory-card button {
          border: 1px solid rgba(157,196,255,.24);
          border-radius: 999px;
          background: rgba(13,20,45,.64);
          color: white;
          font-size: .72rem;
          padding: .44rem .7rem;
        }
        .chapter-dock {
          left: 50%;
          bottom: 1rem;
          transform: translateX(-50%);
          width: min(880px, calc(100vw - 2rem));
          border-radius: 28px;
          padding: .45rem;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: .35rem;
        }
        .chapter-dock button {
          border: 0;
          border-radius: 22px;
          background: transparent;
          color: rgba(255,255,255,.62);
          padding: .55rem .65rem;
          text-align: left;
          transition: background .2s ease, color .2s ease;
        }
        .chapter-dock button:hover, .chapter-dock button.active { background: rgba(255,255,255,.08); color: white; }
        .chapter-dock strong { display: block; font-size: .78rem; }
        .chapter-dock span { display: block; margin-top: .12rem; font-size: .62rem; opacity: .66; }
        .memory-card {
          left: 50%;
          bottom: 10.4rem;
          transform: translateX(-50%);
          width: min(520px, calc(100vw - 2rem));
          border-radius: 24px;
          padding: 1rem;
          text-align: center;
        }
        .memory-card p { margin: 0; font-size: .68rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.48); }
        .memory-card h2 { margin: .35rem 0 .5rem; font-size: 1.5rem; }
        .memory-card span { display: block; color: rgba(255,255,255,.78); line-height: 1.55; }
        .memory-card div { display: flex; justify-content: center; gap: .5rem; margin-top: .9rem; flex-wrap: wrap; }
        @keyframes nodePulse {
          0%, 100% { transform: translate3d(-50%, -50%, var(--star-z)) scale(var(--star-scale)); }
          50% { transform: translate3d(-50%, -50%, calc(var(--star-z) + 28px)) scale(calc(var(--star-scale) * 1.12)); }
        }
        @media (max-width: 760px) {
          .life-map-hud { left: 1rem; right: 1rem; transform: none; }
          .companion-whisper { left: 1rem; right: 1rem; top: auto; bottom: 10rem; width: auto; }
          .camera-dock { bottom: 6.8rem; width: calc(100vw - 2rem); overflow-x: auto; justify-content: flex-start; }
          .chapter-dock { grid-template-columns: 1fr 1fr; max-height: 5.6rem; overflow: auto; }
          .memory-card { bottom: 13.3rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .field-camera, .memory-node, .threads { animation: none !important; transition-duration: .01ms !important; }
        }
      `}</style>
    </main>
  );
}
