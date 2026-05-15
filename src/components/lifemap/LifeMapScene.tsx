'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type WheelEvent } from 'react';
import WebGLLifeMapField from './WebGLLifeMapField';
import { useMemoryStars, type MemoryStar } from './useMemoryStars';
import { dispatchNarratorEvent, dispatchTimelineSyncEvent, type ChapterId, type LifeMapPhase } from './lifeMapEvents';

type Camera = { x: number; y: number; zoom: number };
type FieldStyle = CSSProperties & { '--x': string; '--y': string; '--z': string };
type NodeStyle = CSSProperties & { '--depth': string; '--scale': string; '--hue': string; '--alpha': string };

type Chapter = { id: ChapterId; title: string; subtitle: string; x: number; y: number };

const INITIAL_CAMERA: Camera = { x: 50, y: 50, zoom: 1 };
const MIN_ZOOM = 0.72;
const MAX_ZOOM = 4.8;

const CHAPTERS: Chapter[] = [
  { id: 'season-of-becoming', title: 'Becoming', subtitle: 'growth', x: 38, y: 39 },
  { id: 'threshold', title: 'Threshold', subtitle: 'crossing', x: 50, y: 31 },
  { id: 'recovery-arc', title: 'Recovery', subtitle: 'softening', x: 62, y: 43 },
  { id: 'purple-dream-field', title: 'Dream Field', subtitle: 'symbols', x: 41, y: 61 },
  { id: 'mirror-of-becoming', title: 'Mirror', subtitle: 'identity', x: 64, y: 61 },
];

const CHAPTER_LINES: Record<ChapterId, string> = {
  'season-of-becoming': 'Growth signals are collecting into a new pattern.',
  threshold: 'This chapter marks the crossing point where pressure became visible.',
  'recovery-arc': 'The recovery arc shows strain turning back into rhythm.',
  'purple-dream-field': 'Symbolic echoes are gathering in the dream field.',
  'mirror-of-becoming': 'The mirror shows who the pattern is helping you become.',
};

const FALLBACK_STARS: MemoryStar[] = [
  { id: 'star-1', title: 'First Signal', x: 37, y: 40, size: 12, emotion: 'focus', chapterId: 'season-of-becoming', state: 'idle', intensity: 0.62, recency: 0.78, unresolvedWeight: 0.35, lastActivatedAt: null, narratorLine: 'This was one of the first signals that your rhythm was changing.', connectedTo: ['star-2', 'star-4'] },
  { id: 'star-2', title: 'Threshold Pulse', x: 49, y: 31, size: 14, emotion: 'threshold', chapterId: 'threshold', state: 'idle', intensity: 0.92, recency: 0.72, unresolvedWeight: 0.82, lastActivatedAt: null, narratorLine: 'This moment marks a threshold where the old pattern started breaking.', connectedTo: ['star-1', 'star-3', 'star-8'] },
  { id: 'star-3', title: 'Recovery Bloom', x: 62, y: 43, size: 15, emotion: 'recovery', chapterId: 'recovery-arc', state: 'idle', intensity: 0.88, recency: 0.9, unresolvedWeight: 0.24, lastActivatedAt: null, narratorLine: 'This is where your system began recovering after pressure.', connectedTo: ['star-2', 'star-5', 'star-7'] },
  { id: 'star-4', title: 'Dream Echo', x: 41, y: 61, size: 12, emotion: 'dream', chapterId: 'purple-dream-field', state: 'idle', intensity: 0.72, recency: 0.52, unresolvedWeight: 0.48, lastActivatedAt: null, narratorLine: 'This dream-like memory keeps echoing through the larger pattern.', connectedTo: ['star-1', 'star-5'] },
  { id: 'star-5', title: 'Mirror Moment', x: 64, y: 61, size: 16, emotion: 'mirror', chapterId: 'mirror-of-becoming', state: 'idle', intensity: 0.95, recency: 0.84, unresolvedWeight: 0.55, lastActivatedAt: null, narratorLine: 'This moment reflects a deeper identity pattern coming into focus.', connectedTo: ['star-3', 'star-4'] },
  { id: 'star-6', title: 'Quiet Return', x: 54, y: 52, size: 10, emotion: 'recovery', chapterId: 'recovery-arc', state: 'idle', intensity: 0.66, recency: 0.7, unresolvedWeight: 0.22, lastActivatedAt: null, narratorLine: 'A quieter rhythm returned after the noise softened.', connectedTo: ['star-3'] },
  { id: 'star-7', title: 'Protected Hour', x: 59, y: 35, size: 10, emotion: 'focus', chapterId: 'season-of-becoming', state: 'idle', intensity: 0.58, recency: 0.64, unresolvedWeight: 0.18, lastActivatedAt: null, narratorLine: 'A protected hour became a small doorway back into clarity.', connectedTo: ['star-3'] },
  { id: 'star-8', title: 'Pressure Named', x: 46, y: 49, size: 11, emotion: 'threshold', chapterId: 'threshold', state: 'idle', intensity: 0.74, recency: 0.62, unresolvedWeight: 0.68, lastActivatedAt: null, narratorLine: 'The pressure changed when it became something you could name.', connectedTo: ['star-2'] },
  { id: 'star-9', title: 'Small Light', x: 33, y: 54, size: 7, emotion: 'focus', chapterId: 'season-of-becoming', state: 'idle', intensity: 0.42, recency: 0.48, unresolvedWeight: 0.12, lastActivatedAt: null, narratorLine: 'A small focus signal survived the noise.', connectedTo: ['star-1'] },
  { id: 'star-10', title: 'Softened Edge', x: 57, y: 67, size: 8, emotion: 'recovery', chapterId: 'recovery-arc', state: 'idle', intensity: 0.5, recency: 0.56, unresolvedWeight: 0.16, lastActivatedAt: null, narratorLine: 'The edge of the week softened.', connectedTo: ['star-5'] },
  { id: 'star-11', title: 'Old Echo', x: 70, y: 50, size: 9, emotion: 'dream', chapterId: 'purple-dream-field', state: 'idle', intensity: 0.61, recency: 0.42, unresolvedWeight: 0.52, lastActivatedAt: null, narratorLine: 'An older echo appeared near the edge of the field.', connectedTo: ['star-4'] },
  { id: 'star-12', title: 'New Center', x: 50, y: 58, size: 9, emotion: 'mirror', chapterId: 'mirror-of-becoming', state: 'idle', intensity: 0.68, recency: 0.66, unresolvedWeight: 0.28, lastActivatedAt: null, narratorLine: 'A new center began forming quietly.', connectedTo: ['star-5'] },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function hueFor(star: MemoryStar) {
  if (star.emotion === 'recovery') return '158deg';
  if (star.emotion === 'threshold') return '285deg';
  if (star.emotion === 'dream') return '248deg';
  if (star.emotion === 'mirror') return '42deg';
  return '205deg';
}

function depthFor(star: MemoryStar) {
  return Math.round(star.intensity * 105 + star.recency * 60 - star.unresolvedWeight * 32);
}

export default function LifeMapScene() {
  const liveStars = useMemoryStars(FALLBACK_STARS);
  const stars = liveStars.length < 10 ? FALLBACK_STARS : liveStars;
  const [camera, setCamera] = useState<Camera>(INITIAL_CAMERA);
  const [activeStarId, setActiveStarId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<ChapterId | null>(null);
  const [showThreads, setShowThreads] = useState(false);
  const [message, setMessage] = useState('Wheel inward to enter the memory field. Click a bright memory when it feels alive.');
  const dragRef = useRef({ active: false, x: 0, y: 0 });

  const activeStar = stars.find((star) => star.id === activeStarId) ?? null;
  const starById = useMemo(() => new Map(stars.map((star) => [star.id, star])), [stars]);

  const fieldStyle: FieldStyle = {
    '--x': `${camera.x}%`,
    '--y': `${camera.y}%`,
    '--z': String(camera.zoom),
  };

  const setClampedCamera = useCallback((next: Camera) => {
    setCamera({
      x: clamp(next.x, 20, 80),
      y: clamp(next.y, 22, 78),
      zoom: clamp(next.zoom, MIN_ZOOM, MAX_ZOOM),
    });
  }, []);

  const focusStar = useCallback((star: MemoryStar) => {
    setActiveStarId(star.id);
    setActiveChapterId(star.chapterId);
    setShowThreads(false);
    setMessage(star.narratorLine);
    setClampedCamera({ x: star.x, y: star.y, zoom: 1.82 });
    dispatchNarratorEvent({ event: 'lifemap.star.focus', starId: star.id, chapterId: star.chapterId, emotion: star.emotion });
    dispatchTimelineSyncEvent({ phase: 'focus' as LifeMapPhase, activeStarId: star.id, activeChapterId: star.chapterId });
  }, [setClampedCamera]);

  const resetView = useCallback(() => {
    setActiveStarId(null);
    setActiveChapterId(null);
    setShowThreads(false);
    setMessage('The map returned to its full shape.');
    setClampedCamera(INITIAL_CAMERA);
    dispatchTimelineSyncEvent({ phase: 'living' as LifeMapPhase, activeStarId: null, activeChapterId: null });
  }, [setClampedCamera]);

  const zoom = useCallback((delta: number) => {
    setCamera((current) => {
      const nextZoom = clamp(current.zoom * (delta > 0 ? 0.9 : 1.13), MIN_ZOOM, MAX_ZOOM);
      setMessage(nextZoom > current.zoom ? 'Entering the memory field.' : 'Pulling back into the larger sky.');
      return { ...current, zoom: nextZoom };
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === '0') resetView();
      if (event.key === '+' || event.key === '=') zoom(-1);
      if (event.key === '-' || event.key === '_') zoom(1);
      if (event.key === 't' || event.key === 'T') setShowThreads((value) => !value);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [resetView, zoom]);

  const handleWheel = useCallback((event: WheelEvent<HTMLElement>) => {
    event.preventDefault();
    zoom(event.deltaY);
  }, [zoom]);

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
    setCamera((current) => ({
      ...current,
      x: clamp(current.x - dx / Math.max(current.zoom, 1), 20, 80),
      y: clamp(current.y - dy / Math.max(current.zoom, 1), 22, 78),
    }));
  }, []);

  const handlePointerUp = useCallback((event: PointerEvent<HTMLElement>) => {
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (activeStarId) return;
      const glowing = stars[Math.floor(Math.random() * stars.length)];
      if (glowing) setMessage(`${glowing.title} is beginning to glow.`);
    }, 9000);
    return () => window.clearInterval(timer);
  }, [activeStarId, stars]);

  return (
    <main className={`life-map-shell ${activeStar ? 'has-active' : ''}`} aria-label="URAI immersive Life Map" onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
      <WebGLLifeMapField />
      <div className="vignette" aria-hidden />
      <div className="core" aria-hidden />
      <div className="orbit orbit-one" aria-hidden />
      <div className="orbit orbit-two" aria-hidden />

      <header className="hud">
        <p>URAI Life Map</p>
        <h1>{activeStar ? activeStar.title : 'Immersive memory field'}</h1>
        <span>{activeStar ? 'Memory opened' : 'Wheel inward · drag to drift · click a bright memory'}</span>
      </header>

      <section className={`field ${showThreads ? 'show-threads' : ''}`}>
        <div className="camera" style={fieldStyle}>
          <svg className="threads" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {stars.flatMap((star) => star.connectedTo.map((to) => [star.id, to] as const)).filter(([a, b]) => a < b).map(([a, b]) => {
              const s1 = starById.get(a);
              const s2 = starById.get(b);
              if (!s1 || !s2) return null;
              const active = activeStar && (a === activeStar.id || b === activeStar.id || activeStar.connectedTo.includes(a) || activeStar.connectedTo.includes(b));
              return <line key={`${a}-${b}`} className={active ? 'thread active' : 'thread'} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} />;
            })}
          </svg>

          {stars.map((star) => {
            const depth = depthFor(star);
            const dim = activeStar && star.id !== activeStar.id && !activeStar.connectedTo.includes(star.id);
            const style: NodeStyle = {
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--depth': `${depth}px`,
              '--scale': String(1 + depth / 560),
              '--hue': hueFor(star),
              '--alpha': String(clamp(0.62 + star.recency * 0.32, 0.54, 0.98)),
            };
            return (
              <button key={star.id} type="button" className={`node ${star.id === activeStar?.id ? 'active' : ''} ${dim ? 'dim' : ''}`} style={style} aria-label={`Open ${star.title}`} onClick={(event) => { event.stopPropagation(); focusStar(star); }}>
                <span className="node-label">{star.title}</span>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="companion"><strong>Companion</strong><span>{message}</span></aside>

      {activeStar && (
        <aside className="memory-card" aria-live="polite">
          <p>{CHAPTERS.find((chapter) => chapter.id === activeStar.chapterId)?.title}</p>
          <h2>{activeStar.title}</h2>
          <span>{activeStar.narratorLine}</span>
          <div>
            <button type="button" onClick={() => setMessage('Replaying the emotional thread.')}>Replay</button>
            <button type="button" onClick={() => setMessage('This one has softened.')}>Soften</button>
            <button type="button" onClick={resetView}>Close</button>
          </div>
        </aside>
      )}

      <div className="controls">
        <button type="button" onClick={() => zoom(-1)}>Enter</button>
        <button type="button" onClick={() => zoom(1)}>Pull back</button>
        <button type="button" onClick={() => setShowThreads((value) => !value)}>{showThreads ? 'Hide threads' : 'Show threads'}</button>
        <button type="button" onClick={resetView}>Reset</button>
        <span>{Math.round(camera.zoom * 100)}%</span>
      </div>

      <nav className="chapters" aria-label="Life Map chapters">
        {CHAPTERS.map((chapter) => (
          <button key={chapter.id} type="button" className={activeChapterId === chapter.id ? 'active' : ''} onClick={() => {
            setActiveStarId(null);
            setActiveChapterId(chapter.id);
            setShowThreads(false);
            setMessage(CHAPTER_LINES[chapter.id]);
            setClampedCamera({ x: chapter.x, y: chapter.y, zoom: 1.42 });
            dispatchNarratorEvent({ event: 'lifemap.cluster.focus', chapterId: chapter.id });
            dispatchTimelineSyncEvent({ phase: 'cluster' as LifeMapPhase, activeStarId: null, activeChapterId: chapter.id });
          }}>
            <strong>{chapter.title}</strong>
            <span>{chapter.subtitle}</span>
          </button>
        ))}
      </nav>

      <style jsx>{`
        .life-map-shell { min-height: 100vh; position: relative; overflow: hidden; isolation: isolate; color: white; background: radial-gradient(circle at 50% 48%, #203c78 0%, #081026 48%, #01020a 100%); touch-action: none; cursor: grab; perspective: 1500px; }
        .life-map-shell:active { cursor: grabbing; }
        .vignette, .core, .orbit { position: absolute; pointer-events: none; }
        .vignette { z-index: 2; inset: 0; background: radial-gradient(circle at 50% 50%, transparent 0 24%, rgba(0,0,0,.12) 52%, rgba(0,0,0,.84) 100%), radial-gradient(circle at 50% 54%, rgba(125,211,252,.12), transparent 34%); }
        .core { z-index: 1; left: 50%; top: 52%; width: min(52vw, 660px); height: min(52vw, 660px); transform: translate(-50%, -50%); border-radius: 999px; background: radial-gradient(circle, rgba(255,255,255,.11), transparent 12%), radial-gradient(circle, rgba(125,211,252,.17), rgba(70,90,190,.06) 46%, transparent 72%); filter: blur(10px); opacity: .95; }
        .orbit { z-index: 3; left: 50%; top: 52%; border: 1px solid rgba(180,215,255,.045); border-radius: 999px; transform: translate(-50%, -50%) rotate(-14deg); }
        .orbit-one { width: min(46vw, 580px); height: min(21vw, 270px); }
        .orbit-two { width: min(62vw, 760px); height: min(31vw, 390px); transform: translate(-50%, -50%) rotate(18deg); opacity: .28; }
        .hud { position: absolute; z-index: 8; left: 50%; top: 1rem; transform: translateX(-50%); text-align: center; pointer-events: none; text-shadow: 0 2px 16px rgba(0,0,0,.85); }
        .hud p { margin: 0; font-size: .58rem; letter-spacing: .42em; text-transform: uppercase; color: rgba(255,255,255,.42); }
        .hud h1 { margin: .2rem 0 0; font-size: clamp(1rem, 2vw, 1.65rem); }
        .hud span { display: block; margin-top: .25rem; font-size: .72rem; color: rgba(255,255,255,.56); }
        .field { position: absolute; z-index: 4; inset: 0; perspective: 1500px; transform-style: preserve-3d; }
        .camera { position: absolute; inset: 0; transform-style: preserve-3d; transform-origin: var(--x) var(--y); will-change: transform; transform: perspective(1500px) translate3d(calc(50% - var(--x)), calc(50% - var(--y)), 0) scale(var(--z)); transition: transform 500ms cubic-bezier(.19,1,.22,1); }
        .threads { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; transition: opacity .4s ease; transform: translateZ(-150px); }
        .show-threads .threads { opacity: .12; }
        .thread { stroke: rgba(180,215,255,.1); stroke-width: .07; }
        .thread.active { stroke: rgba(220,245,255,.22); stroke-width: .1; filter: none; }
        .node { position: absolute; transform: translate3d(-50%, -50%, var(--depth)) scale(var(--scale)); border: 0; border-radius: 999px; background: radial-gradient(circle at 38% 30%, #fff 0%, #eef7ff 18%, hsl(var(--hue) 82% 76%) 50%, rgba(116,151,255,.08) 100%); box-shadow: 0 0 10px rgba(255,255,255,.78), 0 0 32px hsl(var(--hue) 86% 68% / .42), 0 0 82px hsl(var(--hue) 92% 64% / .16); opacity: var(--alpha); cursor: pointer; transition: opacity .35s ease, transform .35s ease, filter .35s ease; transform-style: preserve-3d; }
        .node::before { content: ''; position: absolute; inset: -18px; border-radius: 999px; background: radial-gradient(circle, hsl(var(--hue) 90% 70% / .22), transparent 64%); opacity: .5; }
        .node:hover { opacity: 1; filter: brightness(1.18); transform: translate3d(-50%, -50%, calc(var(--depth) + 30px)) scale(calc(var(--scale) * 1.08)); }
        .node.active { opacity: 1; filter: brightness(1.12); transform: translate3d(-50%, -50%, calc(var(--depth) + 26px)) scale(calc(var(--scale) * 1.06)); }
        .node.dim { opacity: .28; }
        .node-label { display: none; position: absolute; left: 50%; top: calc(100% + .55rem); transform: translateX(-50%); white-space: nowrap; color: rgba(255,255,255,.84); font-size: .66rem; text-shadow: 0 2px 12px rgba(0,0,0,.95); opacity: 0; pointer-events: none; transition: opacity .2s ease; }
        .node:hover .node-label { display: block; opacity: .9; }
        .companion { position: absolute; z-index: 8; right: 1rem; top: 1rem; width: min(280px, calc(100vw - 2rem)); border: 1px solid rgba(157,196,255,.2); border-radius: 16px; background: rgba(4,7,18,.46); backdrop-filter: blur(10px); padding: .75rem .85rem; color: rgba(255,255,255,.76); box-shadow: 0 20px 54px rgba(0,0,0,.22); }
        .companion strong { display: block; margin-bottom: .3rem; font-size: .64rem; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.46); }
        .companion span { font-size: .8rem; line-height: 1.45; }
        .controls, .chapters, .memory-card { position: absolute; z-index: 9; border: 1px solid rgba(157,196,255,.22); background: rgba(5,8,20,.5); backdrop-filter: blur(12px); box-shadow: 0 24px 64px rgba(0,0,0,.25); }
        .controls { left: 50%; bottom: 6.2rem; transform: translateX(-50%); display: flex; align-items: center; gap: .4rem; border-radius: 999px; padding: .36rem; }
        .controls button, .controls span, .memory-card button { border: 1px solid rgba(157,196,255,.24); border-radius: 999px; background: rgba(13,20,45,.64); color: white; font-size: .72rem; padding: .44rem .7rem; }
        .chapters { left: 50%; bottom: 1rem; transform: translateX(-50%); width: min(880px, calc(100vw - 2rem)); border-radius: 28px; padding: .45rem; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: .35rem; }
        .chapters button { border: 0; border-radius: 22px; background: transparent; color: rgba(255,255,255,.62); padding: .55rem .65rem; text-align: left; transition: background .2s ease, color .2s ease; }
        .chapters button:hover, .chapters button.active { background: rgba(255,255,255,.08); color: white; }
        .chapters strong { display: block; font-size: .78rem; }
        .chapters span { display: block; margin-top: .12rem; font-size: .62rem; opacity: .66; }
        .memory-card { left: 50%; bottom: 10.4rem; transform: translateX(-50%); width: min(520px, calc(100vw - 2rem)); border-radius: 24px; padding: 1rem; text-align: center; }
        .memory-card p { margin: 0; font-size: .68rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.48); }
        .memory-card h2 { margin: .35rem 0 .5rem; font-size: 1.5rem; }
        .memory-card span { display: block; color: rgba(255,255,255,.78); line-height: 1.55; }
        .memory-card div { display: flex; justify-content: center; gap: .5rem; margin-top: .9rem; flex-wrap: wrap; }
        @media (max-width: 760px) { .hud { left: 1rem; right: 1rem; transform: none; } .companion { left: 1rem; right: 1rem; top: auto; bottom: 10rem; width: auto; } .controls { bottom: 6.8rem; width: calc(100vw - 2rem); overflow-x: auto; justify-content: flex-start; } .chapters { grid-template-columns: 1fr 1fr; max-height: 5.6rem; overflow: auto; } .memory-card { bottom: 13.3rem; } }
      `}</style>
    </main>
  );
}
