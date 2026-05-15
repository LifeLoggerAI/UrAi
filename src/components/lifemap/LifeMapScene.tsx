'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type WheelEvent } from 'react';
import WebGLLifeMapField from './WebGLLifeMapField';
import { useMemoryStars, type MemoryStar } from './useMemoryStars';
import { dispatchNarratorEvent, dispatchTimelineSyncEvent, type ChapterId, type LifeMapPhase } from './lifeMapEvents';
import type { CompanionPrompt, LifeMapCategory, LifeMapInteraction, LifeMapInteractionMode, LifeMapNodeType, LifeMapThread, MemoryReplay, MirrorInsight, ThresholdNode } from './lifeMapTypes';

type Camera = { x: number; y: number; zoom: number };
type FieldStyle = CSSProperties & { '--x': string; '--y': string; '--z': string };
type NodeStyle = CSSProperties & { '--depth': string; '--scale': string; '--hue': string; '--alpha': string; '--node-glow': string };
type BloomStyle = CSSProperties & { '--bloom-hue': string };

type Chapter = { id: ChapterId; title: string; subtitle: string; x: number; y: number; category: LifeMapCategory };

const INITIAL_CAMERA: Camera = { x: 50, y: 50, zoom: 1 };
const MIN_ZOOM = 0.72;
const MAX_ZOOM = 4.8;

const CHAPTERS: Chapter[] = [
  { id: 'season-of-becoming', title: 'Becoming', subtitle: 'growth', x: 38, y: 39, category: { id: 'season-of-becoming', label: 'Becoming', subtitle: 'growth', icon: 'seed', color: '205deg', nodeTypes: ['becoming', 'breakthrough', 'habit', 'voice'] } },
  { id: 'threshold', title: 'Threshold', subtitle: 'crossing', x: 50, y: 31, category: { id: 'threshold', label: 'Threshold', subtitle: 'crossing', icon: 'gate', color: '285deg', nodeTypes: ['threshold', 'warning'] } },
  { id: 'recovery-arc', title: 'Recovery', subtitle: 'softening', x: 62, y: 43, category: { id: 'recovery-arc', label: 'Recovery', subtitle: 'softening', icon: 'bloom', color: '158deg', nodeTypes: ['recovery', 'ritual', 'relationship'] } },
  { id: 'purple-dream-field', title: 'Dream Field', subtitle: 'symbols', x: 41, y: 61, category: { id: 'purple-dream-field', label: 'Dream Field', subtitle: 'symbols', icon: 'moon', color: '248deg', nodeTypes: ['dream', 'legacy', 'location'] } },
  { id: 'mirror-of-becoming', title: 'Mirror', subtitle: 'identity', x: 64, y: 61, category: { id: 'mirror-of-becoming', label: 'Mirror', subtitle: 'identity', icon: 'mirror', color: '42deg', nodeTypes: ['mirror', 'relationship', 'breakthrough'] } },
];

const CHAPTER_LINES: Record<ChapterId, string> = {
  'season-of-becoming': 'Growth signals are collecting into a new pattern.',
  threshold: 'This chapter marks the crossing point where pressure became visible.',
  'recovery-arc': 'The recovery arc shows strain turning back into rhythm.',
  'purple-dream-field': 'Symbolic echoes are gathering in the dream field.',
  'mirror-of-becoming': 'The mirror shows who the pattern is helping you become.',
};

const NODE_TYPE_BY_EMOTION: Record<MemoryStar['emotion'], LifeMapNodeType> = {
  threshold: 'threshold',
  grief: 'threshold',
  recovery: 'recovery',
  shadow: 'warning',
  mirror: 'mirror',
  dream: 'dream',
  calm: 'ritual',
  joy: 'breakthrough',
  focus: 'becoming',
};

const HUMAN_NODE_LABEL: Record<LifeMapNodeType, string> = {
  becoming: 'Growth signal',
  threshold: 'Threshold signal',
  recovery: 'Recovery bloom',
  dream: 'Dream signal',
  mirror: 'Mirror signal',
  relationship: 'Relationship signal',
  habit: 'Habit signal',
  voice: 'Voice signal',
  location: 'Place signal',
  ritual: 'Ritual signal',
  warning: 'Pressure signal',
  breakthrough: 'Breakthrough signal',
  legacy: 'Legacy signal',
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
  if (star.emotion === 'threshold' || star.emotion === 'grief' || star.emotion === 'shadow') return '285deg';
  if (star.emotion === 'dream') return '248deg';
  if (star.emotion === 'mirror' || star.emotion === 'joy') return '42deg';
  return '205deg';
}

function depthFor(star: MemoryStar) {
  return Math.round(star.intensity * 105 + star.recency * 60 - star.unresolvedWeight * 32);
}

function depthLabel(zoomLevel: number) {
  if (zoomLevel < 1) return 'Whole life';
  if (zoomLevel < 1.55) return 'Wide field';
  if (zoomLevel < 2.45) return 'Near memory';
  return 'Inside signal';
}

function whyTextFor(star: MemoryStar) {
  const nodeType = HUMAN_NODE_LABEL[NODE_TYPE_BY_EMOTION[star.emotion]];
  const confidence = Math.round(clamp(star.intensity * 0.58 + star.recency * 0.26 + (1 - star.unresolvedWeight) * 0.16, 0, 1) * 100);
  return {
    nodeType,
    confidence,
    reason: `${nodeType} appeared because emotional tone, recency, connected memories, and unresolved weight clustered around this point.`,
    source: 'Generated from: emotional tone · recency · linked memory nodes · recovery/pressure weighting',
    safety: 'Reflective AI pattern, not a diagnosis. You control what gets saved, replayed, or turned into a ritual.',
  };
}

function buildThread(star: MemoryStar, starById: Map<string, MemoryStar>): LifeMapThread {
  const connected = star.connectedTo.filter((id) => starById.has(id));
  const type: LifeMapThread['type'] = star.emotion === 'recovery' ? 'recovery_arc' : star.emotion === 'threshold' ? 'shadow_arc' : star.emotion === 'dream' ? 'dream_arc' : star.emotion === 'mirror' ? 'identity_arc' : 'growth_arc';

  return {
    id: `${star.id}-thread`,
    type,
    title: `${star.title} thread`,
    nodeIds: [star.id, ...connected],
    dominantEmotion: star.emotion,
    arcStrength: clamp(star.intensity + connected.length * 0.08, 0, 1),
    color: hueFor(star),
    narratorSummary: connected.length ? `${star.title} is linked to ${connected.length} memory point${connected.length === 1 ? '' : 's'}.` : 'This memory is still forming its constellation.',
  };
}

function buildCompanionPrompt(mode: CompanionPrompt['mode'], body: string, linkedNodeId?: string): CompanionPrompt {
  return {
    id: `lifemap-${mode}-${linkedNodeId ?? 'field'}`,
    mode,
    title: mode === 'warning' ? 'Grounding companion' : mode === 'reflecting' ? 'Mirror companion' : mode === 'memory_replay' ? 'Memory replay' : 'Companion',
    body,
    voiceTone: mode === 'warning' ? 'grounding' : mode === 'reflecting' ? 'wise' : mode === 'ritual_prompt' ? 'ceremonial' : 'soft',
    linkedNodeId,
  };
}

function buildReplay(star: MemoryStar): MemoryReplay {
  return {
    id: `${star.id}-replay`,
    nodeId: star.id,
    title: star.title,
    dateRange: { start: new Date().toISOString() },
    summary: star.narratorLine,
    narratorScript: `${star.narratorLine} The map is showing this because its signal is bright enough to become part of the larger story.`,
    emotionalArc: [star.emotion, star.intensity > 0.78 ? 'high-intensity' : 'soft-signal'],
    sourceSignals: ['emotional tone', 'recency', 'connected memories', 'unresolved weight'],
    suggestedRitual: star.emotion === 'threshold' ? 'Grounding. Slower pacing. No pressure to act.' : 'Let the memory play once without forcing a conclusion.',
    replayScenes: [
      { id: `${star.id}-aura`, order: 1, visualMode: 'aura', caption: star.title, ttsLine: star.narratorLine, durationMs: 4200, animationCue: 'bloom-orb-breathe' },
      { id: `${star.id}-thread`, order: 2, visualMode: 'constellation', caption: 'Thread revealed', ttsLine: 'Related signals begin to connect around this point.', durationMs: 3600, animationCue: 'thread-glow' },
    ],
  };
}

function buildMirrorInsight(star: MemoryStar): MirrorInsight {
  return {
    id: `${star.id}-mirror`,
    title: 'Mirror of Becoming',
    identityTheme: 'identity pattern forming',
    recurringPattern: star.connectedTo.length ? 'This signal repeats across nearby memory points.' : 'This signal is early and still becoming legible.',
    oldSelfSignal: 'reactive pattern',
    newSelfSignal: 'chosen rhythm',
    confidence: clamp(star.intensity * 0.72 + star.recency * 0.28, 0, 1),
    narratorReflection: 'This pattern has appeared before. Not as failure, as rehearsal.',
  };
}

function buildThresholdNode(star: MemoryStar): ThresholdNode {
  return {
    severity: star.intensity > 0.86 || star.unresolvedWeight > 0.75 ? 'high' : star.intensity > 0.65 ? 'medium' : 'low',
    triggerSignals: ['pressure spike', 'unresolved weight', 'recent intensity'],
    recommendedResponse: star.unresolvedWeight > 0.75 ? 'grounding' : 'journal',
    safetySensitive: star.unresolvedWeight > 0.8,
  };
}

export default function LifeMapScene() {
  const liveStars = useMemoryStars(FALLBACK_STARS);
  const stars = liveStars.length < 10 ? FALLBACK_STARS : liveStars;
  const [camera, setCamera] = useState<Camera>(INITIAL_CAMERA);
  const [activeStarId, setActiveStarId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<ChapterId | null>(null);
  const [showThreads, setShowThreads] = useState(false);
  const [replayOpen, setReplayOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [message, setMessage] = useState('A threshold cluster is active. Click the brightest memory to see why.');
  const [interactionMode, setInteractionMode] = useState<LifeMapInteractionMode>('overview');
  const dragRef = useRef({ active: false, x: 0, y: 0 });

  const activeStar = stars.find((star) => star.id === activeStarId) ?? null;
  const activeChapter = activeStar ? CHAPTERS.find((chapter) => chapter.id === activeStar.chapterId) : null;
  const activeCategory = CHAPTERS.find((chapter) => chapter.id === activeChapterId)?.category ?? null;
  const starById = useMemo(() => new Map(stars.map((star) => [star.id, star])), [stars]);
  const activeThread = useMemo(() => (activeStar ? buildThread(activeStar, starById) : null), [activeStar, starById]);
  const activeReplay = useMemo(() => (activeStar ? buildReplay(activeStar) : null), [activeStar]);
  const mirrorInsight = useMemo(() => (activeStar?.emotion === 'mirror' ? buildMirrorInsight(activeStar) : null), [activeStar]);
  const thresholdNode = useMemo(() => (activeStar && ['threshold', 'grief', 'shadow'].includes(activeStar.emotion) ? buildThresholdNode(activeStar) : null), [activeStar]);
  const whyDetails = useMemo(() => (activeStar ? whyTextFor(activeStar) : null), [activeStar]);
  const companionPrompt = useMemo(() => buildCompanionPrompt(thresholdNode ? 'warning' : mirrorInsight ? 'reflecting' : replayOpen ? 'memory_replay' : activeStar ? 'explaining' : showThreads ? 'guiding' : 'idle', message, activeStar?.id), [activeStar, message, mirrorInsight, replayOpen, showThreads, thresholdNode]);
  const interaction: LifeMapInteraction = { mode: interactionMode, zoomLevel: camera.zoom, selectedNodeId: activeStarId, selectedThreadId: activeThread?.id ?? null, activeCategoryId: activeChapterId, showThreads, cameraFocus: { x: camera.x, y: camera.y, z: camera.zoom } };

  const visibleStars = useMemo(() => {
    if (!activeCategory) return stars;
    return stars.filter((star) => activeCategory.nodeTypes.includes(NODE_TYPE_BY_EMOTION[star.emotion]) || star.chapterId === activeCategory.id);
  }, [activeCategory, stars]);

  const fieldStyle: FieldStyle = { '--x': `${camera.x}%`, '--y': `${camera.y}%`, '--z': String(camera.zoom) };

  const setClampedCamera = useCallback((next: Camera) => {
    setCamera({ x: clamp(next.x, 20, 80), y: clamp(next.y, 22, 78), zoom: clamp(next.zoom, MIN_ZOOM, MAX_ZOOM) });
  }, []);

  const focusStar = useCallback((star: MemoryStar) => {
    setActiveStarId(star.id);
    setActiveChapterId(star.chapterId);
    setShowThreads(true);
    setReplayOpen(false);
    setWhyOpen(false);
    setInteractionMode(star.emotion === 'mirror' ? 'mirror_mode' : 'node_selected');
    setMessage(star.emotion === 'threshold' ? 'I found a threshold cluster. We can look at why it is glowing without rushing to solve it.' : star.narratorLine);
    setClampedCamera({ x: star.x, y: star.y, zoom: 1.72 });
    dispatchNarratorEvent({ event: 'lifemap.star.focus', starId: star.id, chapterId: star.chapterId, emotion: star.emotion });
    dispatchTimelineSyncEvent({ phase: 'focus' as LifeMapPhase, activeStarId: star.id, activeChapterId: star.chapterId });
  }, [setClampedCamera]);

  const resetView = useCallback(() => {
    setActiveStarId(null);
    setActiveChapterId(null);
    setShowThreads(false);
    setReplayOpen(false);
    setWhyOpen(false);
    setInteractionMode('overview');
    setMessage('The map returned to its full shape.');
    setClampedCamera(INITIAL_CAMERA);
    dispatchTimelineSyncEvent({ phase: 'living' as LifeMapPhase, activeStarId: null, activeChapterId: null });
  }, [setClampedCamera]);

  const zoom = useCallback((delta: number) => {
    setCamera((current) => {
      const nextZoom = clamp(current.zoom * (delta > 0 ? 0.9 : 1.13), MIN_ZOOM, MAX_ZOOM);
      setInteractionMode(nextZoom > 1.18 ? 'immersive' : 'overview');
      setMessage(nextZoom > current.zoom ? 'Entering the memory field.' : 'Pulling back into the larger sky.');
      return { ...current, zoom: nextZoom };
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === '0') resetView();
      if (!activeStar && (event.key === '+' || event.key === '=')) zoom(-1);
      if (!activeStar && (event.key === '-' || event.key === '_')) zoom(1);
      if (!activeStar && (event.key === 't' || event.key === 'T')) {
        setShowThreads((value) => !value);
        setInteractionMode('thread_view');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeStar, resetView, zoom]);

  const handleWheel = useCallback((event: WheelEvent<HTMLElement>) => {
    event.preventDefault();
    if (!activeStar) zoom(event.deltaY);
  }, [activeStar, zoom]);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    if (activeStar || (event.target as HTMLElement).closest('button, a')) return;
    dragRef.current = { active: true, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [activeStar]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (!dragRef.current.active || activeStar) return;
    const dx = ((event.clientX - dragRef.current.x) / Math.max(window.innerWidth, 1)) * 100;
    const dy = ((event.clientY - dragRef.current.y) / Math.max(window.innerHeight, 1)) * 100;
    dragRef.current = { active: true, x: event.clientX, y: event.clientY };
    setCamera((current) => ({ ...current, x: clamp(current.x - dx / Math.max(current.zoom, 1), 20, 80), y: clamp(current.y - dy / Math.max(current.zoom, 1), 22, 78) }));
  }, [activeStar]);

  const handlePointerUp = useCallback((event: PointerEvent<HTMLElement>) => {
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (activeStarId) return;
      const glowing = visibleStars[Math.floor(Math.random() * visibleStars.length)];
      if (glowing) setMessage(`${glowing.title} is beginning to glow. Tap it to see why.`);
    }, 9000);
    return () => window.clearInterval(timer);
  }, [activeStarId, visibleStars]);

  const bloomStyle: BloomStyle | undefined = activeStar ? { '--bloom-hue': hueFor(activeStar) } : undefined;
  const shellClasses = ['life-map-shell', activeStar ? 'has-active' : '', thresholdNode ? 'threshold-mode' : '', replayOpen ? 'replay-mode' : ''].filter(Boolean).join(' ');

  return (
    <main className={shellClasses} aria-label="URAI immersive Life Map" data-mode={interaction.mode} onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
      <WebGLLifeMapField />
      <div className="cosmic-background" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="core" aria-hidden />
      <div className="weather-layer" aria-hidden />
      <div className="orbit orbit-one" aria-hidden />
      <div className="orbit orbit-two" aria-hidden />
      <div className="deep-mist" aria-hidden />

      <header className="hud">
        <p>URAI Life Map</p>
        <h1>{activeStar ? activeStar.title : 'Private symbolic memory field'}</h1>
        <span>{activeStar ? 'Memory bloom opened' : 'Wheel inward · drag to drift · click a bright memory'}</span>
      </header>

      <section className={`field ${showThreads ? 'show-threads' : ''}`}>
        <div className="camera" style={fieldStyle}>
          <svg className="threads" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {visibleStars.flatMap((star) => star.connectedTo.map((to) => [star.id, to] as const)).filter(([a, b]) => a < b).map(([a, b]) => {
              const s1 = starById.get(a);
              const s2 = starById.get(b);
              if (!s1 || !s2) return null;
              const active = activeStar && (a === activeStar.id || b === activeStar.id || activeStar.connectedTo.includes(a) || activeStar.connectedTo.includes(b));
              return <line key={`${a}-${b}`} className={active ? 'thread active' : 'thread'} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} />;
            })}
          </svg>

          {visibleStars.map((star) => {
            const depth = depthFor(star);
            const dim = activeStar && star.id !== activeStar.id && !activeStar.connectedTo.includes(star.id);
            const style: NodeStyle = {
              left: `${star.x}%`, top: `${star.y}%`, width: `${star.size}px`, height: `${star.size}px`, '--depth': `${depth}px`, '--scale': String(1 + depth / 560), '--hue': hueFor(star), '--alpha': String(clamp(0.62 + star.recency * 0.32, 0.54, 0.98)), '--node-glow': String(clamp(star.intensity + star.recency * 0.28, 0.35, 1.2)),
            };
            return (
              <button key={star.id} type="button" className={`node node-${NODE_TYPE_BY_EMOTION[star.emotion]} ${star.id === activeStar?.id ? 'active' : ''} ${dim ? 'dim' : ''}`} style={style} aria-label={`Open ${star.title}`} onClick={(event) => { event.stopPropagation(); focusStar(star); }}>
                <span className="node-label">{star.title}</span>
              </button>
            );
          })}
        </div>
      </section>

      <aside className={`companion companion-${companionPrompt.mode}`}>
        <strong>{companionPrompt.title}</strong>
        <span>{companionPrompt.body}</span>
        {activeThread && <em>{activeThread.narratorSummary}</em>}
      </aside>

      {activeStar && activeReplay && whyDetails && (
        <section className="bloom-scene" style={bloomStyle} aria-live="polite">
          <div className="bloom-aura" aria-hidden>
            <span className="bloom-ring bloom-ring-one" />
            <span className="bloom-ring bloom-ring-two" />
            <span className="bloom-orb" />
          </div>
          <article className="bloom-card">
            <p>{activeChapter?.title ?? activeStar.chapterId}</p>
            <h2>{activeStar.title}</h2>
            <span>{activeReplay.summary}</span>
            <dl className="memory-meta">
              <div><dt>Signal</dt><dd>{whyDetails.nodeType}</dd></div>
              <div><dt>Confidence</dt><dd>{whyDetails.confidence}%</dd></div>
              <div><dt>Why now</dt><dd>{whyDetails.reason}</dd></div>
            </dl>
            {whyOpen && <div className="why-card"><strong>Why this appeared</strong><span>{whyDetails.source}</span><small>{whyDetails.safety}</small></div>}
            {thresholdNode && <div className="safety-card"><strong>Recommended response</strong><span>{activeReplay.suggestedRitual} Severity: {thresholdNode.severity}. Use softer pacing and grounding copy.</span></div>}
            {mirrorInsight && <div className="mirror-card"><strong>{mirrorInsight.title}</strong><span>{mirrorInsight.narratorReflection}</span></div>}
            {replayOpen && <ol className="replay-list">{activeReplay.replayScenes.map((scene) => <li key={scene.id}><strong>{scene.caption}</strong><span>{scene.ttsLine}</span></li>)}</ol>}
            <div className="bloom-actions">
              <button type="button" onClick={() => { setReplayOpen(true); setWhyOpen(false); setInteractionMode('replay'); setMessage('Replaying the emotional thread.'); }}>Replay</button>
              <button type="button" onClick={() => setMessage(activeReplay.suggestedRitual ?? 'A ritual can be created from this memory.')}>Create ritual</button>
              <button type="button" onClick={() => { setWhyOpen((value) => !value); setMessage(activeReplay.narratorScript); }}>Why this appeared</button>
              <button type="button" onClick={resetView}>Close</button>
            </div>
          </article>
        </section>
      )}

      <div className="controls">
        <button type="button" onClick={() => { setInteractionMode('entering'); zoom(-1); }}>Open memory</button>
        <button type="button" onClick={() => zoom(1)}>Zoom out</button>
        <button type="button" onClick={() => { setShowThreads((value) => !value); setInteractionMode('thread_view'); }}>{showThreads ? 'Hide threads' : 'Reveal threads'}</button>
        <button type="button" onClick={resetView}>Recenter</button>
        <span>Depth: {depthLabel(camera.zoom)}</span>
      </div>

      <nav className="chapters" aria-label="Life Map chapters">
        {CHAPTERS.map((chapter) => (
          <button key={chapter.id} type="button" className={activeChapterId === chapter.id ? 'active' : ''} onClick={() => {
            setActiveStarId(null);
            setReplayOpen(false);
            setWhyOpen(false);
            setActiveChapterId(chapter.id);
            setShowThreads(false);
            setInteractionMode('cluster');
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
        .life-map-shell { min-height: 100vh; position: relative; overflow: hidden; isolation: isolate; color: white; background: radial-gradient(circle at 50% 48%, #203c78 0%, #081026 48%, #01020a 100%); touch-action: none; cursor: grab; perspective: 1500px; user-select: none; -webkit-user-select: none; }
        .life-map-shell * { user-select: none; -webkit-user-select: none; }
        .life-map-shell:active { cursor: grabbing; }
        .cosmic-background, .vignette, .core, .orbit, .deep-mist, .weather-layer { position: absolute; pointer-events: none; }
        .cosmic-background { z-index: 1; inset: -10%; background: radial-gradient(circle at 35% 28%, rgba(111, 158, 255, .16), transparent 28%), radial-gradient(circle at 68% 55%, rgba(94, 234, 212, .1), transparent 22%), radial-gradient(circle at 50% 62%, rgba(255, 255, 255, .06), transparent 18%); filter: blur(14px); animation: drift 26s ease-in-out infinite alternate; }
        .vignette { z-index: 2; inset: 0; background: radial-gradient(circle at 50% 50%, transparent 0 24%, rgba(0,0,0,.12) 52%, rgba(0,0,0,.84) 100%), radial-gradient(circle at 50% 54%, rgba(125,211,252,.12), transparent 34%); }
        .core { z-index: 1; left: 50%; top: 52%; width: min(52vw, 660px); height: min(52vw, 660px); transform: translate(-50%, -50%); border-radius: 999px; background: radial-gradient(circle, rgba(255,255,255,.11), transparent 12%), radial-gradient(circle, rgba(125,211,252,.17), rgba(70,90,190,.06) 46%, transparent 72%); filter: blur(10px); opacity: .95; }
        .weather-layer { z-index: 3; inset: 0; opacity: 0; transition: opacity .45s ease; background: radial-gradient(circle at 50% 48%, rgba(168, 85, 247, .14), transparent 36%), linear-gradient(180deg, rgba(2,6,23,.2), rgba(2,6,23,.68)); backdrop-filter: blur(1px); }
        .threshold-mode .weather-layer { opacity: .88; }
        .deep-mist { z-index: 3; inset: 14% 12% 18%; background: radial-gradient(ellipse at 50% 50%, rgba(120,165,255,.08), transparent 64%); filter: blur(22px); opacity: .8; }
        .orbit { z-index: 3; left: 50%; top: 52%; border: 1px solid rgba(180,215,255,.035); border-radius: 999px; transform: translate(-50%, -50%) rotate(-14deg); }
        .orbit-one { width: min(46vw, 580px); height: min(21vw, 270px); }
        .orbit-two { width: min(62vw, 760px); height: min(31vw, 390px); transform: translate(-50%, -50%) rotate(18deg); opacity: .22; }
        .hud { position: absolute; z-index: 8; left: 50%; top: 1rem; transform: translateX(-50%); text-align: center; pointer-events: none; text-shadow: 0 2px 16px rgba(0,0,0,.85); transition: opacity .35s ease, transform .35s ease; }
        .hud p { margin: 0; font-size: .56rem; letter-spacing: .42em; text-transform: uppercase; color: rgba(255,255,255,.34); }
        .hud h1 { margin: .2rem 0 0; font-size: clamp(.95rem, 1.6vw, 1.32rem); font-weight: 600; }
        .hud span { display: block; margin-top: .25rem; font-size: .66rem; color: rgba(255,255,255,.45); }
        .field { position: absolute; z-index: 4; inset: 0; perspective: 1500px; transform-style: preserve-3d; transition: opacity .55s ease, filter .55s ease, transform .55s ease; }
        .camera { position: absolute; inset: 0; transform-style: preserve-3d; transform-origin: var(--x) var(--y); will-change: transform; transform: perspective(1500px) translate3d(calc(50% - var(--x)), calc(50% - var(--y)), 0) scale(var(--z)); transition: transform 500ms cubic-bezier(.19,1,.22,1); }
        .threads { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; transition: opacity .4s ease; transform: translateZ(-150px); }
        .show-threads .threads { opacity: .28; }
        .thread { stroke: rgba(180,215,255,.12); stroke-width: .06; }
        .thread.active { stroke: rgba(220,245,255,.42); stroke-width: .11; filter: drop-shadow(0 0 6px rgba(190,225,255,.4)); }
        .node { position: absolute; transform: translate3d(-50%, -50%, var(--depth)) scale(var(--scale)); border: 0; border-radius: 999px; background: radial-gradient(circle at 38% 30%, #fff 0%, #eef7ff 18%, hsl(var(--hue) 82% 76%) 50%, rgba(116,151,255,.08) 100%); box-shadow: 0 0 10px rgba(255,255,255,.78), 0 0 calc(28px * var(--node-glow)) hsl(var(--hue) 86% 68% / .48), 0 0 calc(80px * var(--node-glow)) hsl(var(--hue) 92% 64% / .2); opacity: var(--alpha); cursor: pointer; transition: opacity .35s ease, transform .35s ease, filter .35s ease; transform-style: preserve-3d; }
        .node::before { content: ''; position: absolute; inset: -18px; border-radius: 999px; background: radial-gradient(circle, hsl(var(--hue) 90% 70% / .22), transparent 64%); opacity: .5; animation: pulse 4.8s ease-in-out infinite; }
        .node:hover, .node.active { opacity: 1; filter: brightness(1.18); transform: translate3d(-50%, -50%, calc(var(--depth) + 30px)) scale(calc(var(--scale) * 1.08)); }
        .node-threshold::after, .node-warning::after { content: ''; position: absolute; inset: -9px; border-radius: inherit; border: 1px solid rgba(216,180,254,.32); box-shadow: 0 0 18px rgba(216,180,254,.16); }
        .node-recovery::after { content: ''; position: absolute; inset: -12px; border-radius: inherit; border: 1px solid rgba(94,234,212,.18); box-shadow: 0 0 18px rgba(94,234,212,.2); }
        .node-dream::after { content: ''; position: absolute; inset: -16px; border-radius: inherit; background: radial-gradient(circle, rgba(167,139,250,.16), transparent 68%); filter: blur(5px); }
        .node-mirror::after { content: ''; position: absolute; inset: -10px; border-radius: inherit; border: 1px solid rgba(255,255,255,.22); box-shadow: 0 0 22px rgba(255,255,255,.22); }
        .node.dim { opacity: .28; }
        .node-label { display: none; position: absolute; left: 50%; top: calc(100% + .55rem); transform: translateX(-50%); white-space: nowrap; color: rgba(255,255,255,.84); font-size: .66rem; text-shadow: 0 2px 12px rgba(0,0,0,.95); opacity: 0; pointer-events: none; transition: opacity .2s ease; }
        .node:hover .node-label { display: block; opacity: .9; }
        .companion { position: absolute; z-index: 8; right: 1rem; top: 1rem; width: min(292px, calc(100vw - 2rem)); border: 1px solid rgba(157,196,255,.16); border-radius: 16px; background: rgba(4,7,18,.34); backdrop-filter: blur(10px); padding: .68rem .75rem; color: rgba(255,255,255,.68); box-shadow: 0 20px 54px rgba(0,0,0,.18); transition: opacity .35s ease; }
        .companion-warning { border-color: rgba(216,180,254,.28); background: rgba(23, 12, 34, .42); }
        .companion strong, .companion em { display: block; margin-bottom: .3rem; font-size: .6rem; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.38); font-style: normal; }
        .companion em { margin-top: .55rem; margin-bottom: 0; line-height: 1.45; text-transform: none; letter-spacing: 0; color: rgba(255,255,255,.48); }
        .companion span { font-size: .74rem; line-height: 1.45; }
        .controls, .chapters { position: absolute; z-index: 9; border: 1px solid rgba(157,196,255,.18); background: rgba(5,8,20,.38); backdrop-filter: blur(12px); box-shadow: 0 24px 64px rgba(0,0,0,.18); transition: opacity .35s ease, transform .35s ease, background .25s ease; opacity: .34; }
        .life-map-shell:hover .controls, .life-map-shell:hover .chapters, .controls:focus-within, .chapters:focus-within { opacity: .92; }
        .controls { left: 50%; bottom: 6.2rem; transform: translateX(-50%); display: flex; align-items: center; gap: .4rem; border-radius: 999px; padding: .36rem; }
        .controls button, .controls span, .bloom-card button { border: 1px solid rgba(157,196,255,.24); border-radius: 999px; background: rgba(13,20,45,.64); color: white; font-size: .72rem; padding: .44rem .7rem; }
        .controls span { color: rgba(226,242,255,.68); }
        .chapters { left: 50%; bottom: 1rem; transform: translateX(-50%); width: min(880px, calc(100vw - 2rem)); border-radius: 28px; padding: .45rem; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: .35rem; }
        .chapters button { border: 0; border-radius: 22px; background: transparent; color: rgba(255,255,255,.62); padding: .55rem .65rem; text-align: left; transition: background .2s ease, color .2s ease, transform .2s ease; }
        .chapters button:hover, .chapters button.active { background: rgba(255,255,255,.08); color: white; transform: translateY(-1px); }
        .chapters strong { display: block; font-size: .78rem; }
        .chapters span { display: block; margin-top: .12rem; font-size: .62rem; opacity: .66; }
        .has-active .field { opacity: .18; filter: blur(1.1px) saturate(.78); transform: scale(.985); pointer-events: none; }
        .has-active .controls, .has-active .chapters { opacity: 0; pointer-events: none; transform: translateX(-50%) translateY(.75rem); }
        .has-active .companion { opacity: 0; pointer-events: none; }
        .has-active .hud { opacity: 0; transform: translateX(-50%) translateY(-.45rem); }
        .bloom-scene { position: absolute; z-index: 12; inset: 0; display: grid; place-items: center; padding: 4rem 1rem 2rem; background: radial-gradient(circle at 50% 48%, hsl(var(--bloom-hue) 90% 60% / .2), rgba(1,2,10,.18) 34%, rgba(0,0,0,.74) 100%); animation: bloomIn .55s cubic-bezier(.19,1,.22,1) both; }
        .bloom-aura { position: relative; width: min(48vw, 560px); height: min(48vw, 560px); min-width: 310px; min-height: 310px; display: grid; place-items: center; transform: translateY(-3rem); }
        .bloom-orb { width: clamp(112px, 15vw, 176px); height: clamp(112px, 15vw, 176px); border-radius: 999px; background: radial-gradient(circle at 35% 30%, #fff 0%, #f5fbff 18%, hsl(var(--bloom-hue) 90% 77%) 52%, hsl(var(--bloom-hue) 85% 48% / .2) 100%); box-shadow: 0 0 28px rgba(255,255,255,.9), 0 0 96px hsl(var(--bloom-hue) 90% 70% / .55), 0 0 220px hsl(var(--bloom-hue) 90% 60% / .25); animation: breathe 4.6s ease-in-out infinite; }
        .bloom-ring { position: absolute; inset: 17%; border-radius: 999px; border: 1px solid hsl(var(--bloom-hue) 90% 80% / .18); box-shadow: inset 0 0 40px hsl(var(--bloom-hue) 90% 70% / .08); }
        .bloom-ring-one { transform: rotate(-18deg) scaleX(1.42); }
        .bloom-ring-two { transform: rotate(24deg) scaleX(1.66); opacity: .58; }
        .bloom-card { position: absolute; left: 50%; bottom: 2.4rem; transform: translateX(-50%); width: min(760px, calc(100vw - 2rem)); border: 1px solid hsl(var(--bloom-hue) 80% 78% / .22); border-radius: 32px; background: linear-gradient(180deg, rgba(10,14,34,.78), rgba(5,8,20,.58)); backdrop-filter: blur(20px); box-shadow: 0 30px 90px rgba(0,0,0,.38); padding: 1.25rem; text-align: center; }
        .bloom-card p { margin: 0; font-size: .68rem; letter-spacing: .22em; text-transform: uppercase; color: hsl(var(--bloom-hue) 90% 82% / .62); }
        .bloom-card h2 { margin: .32rem 0 .45rem; font-size: clamp(1.65rem, 3.6vw, 3.2rem); line-height: 1; letter-spacing: -.04em; }
        .bloom-card span { display: block; max-width: 46rem; margin: 0 auto; color: rgba(255,255,255,.82); line-height: 1.55; }
        .bloom-actions { display: flex; justify-content: center; gap: .5rem; flex-wrap: wrap; margin-top: 1rem; }
        .memory-meta { display: grid; grid-template-columns: 1fr 1fr 2fr; gap: .5rem; margin: 1rem 0 0; text-align: left; }
        .memory-meta div, .safety-card, .mirror-card, .why-card, .replay-list li { border: 1px solid rgba(157,196,255,.16); border-radius: 16px; background: rgba(255,255,255,.04); padding: .65rem; }
        .memory-meta dt { font-size: .58rem; text-transform: uppercase; letter-spacing: .12em; color: rgba(255,255,255,.38); }
        .memory-meta dd { margin: .25rem 0 0; font-size: .72rem; color: rgba(255,255,255,.76); }
        .safety-card, .mirror-card, .why-card { margin-top: .7rem; text-align: left; }
        .safety-card strong, .mirror-card strong, .why-card strong, .replay-list strong { display: block; margin-bottom: .25rem; color: rgba(255,255,255,.86); }
        .why-card small { display: block; margin-top: .45rem; color: rgba(226,242,255,.52); line-height: 1.45; }
        .replay-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem; margin: .8rem 0 0; padding: 0; list-style: none; text-align: left; }
        @keyframes bloomIn { from { opacity: 0; transform: scale(.97); } to { opacity: 1; transform: scale(1); } }
        @keyframes breathe { 0%, 100% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.07); filter: brightness(1.12); } }
        @keyframes pulse { 0%, 100% { opacity: .32; transform: scale(.96); } 50% { opacity: .78; transform: scale(1.05); } }
        @keyframes drift { from { transform: translate3d(-1%, -1%, 0) scale(1); } to { transform: translate3d(1.5%, 1%, 0) scale(1.04); } }
        @media (max-width: 760px) { .hud { left: 1rem; right: 1rem; transform: none; } .companion { left: 1rem; right: 1rem; top: auto; bottom: 10rem; width: auto; } .controls { bottom: 6.8rem; width: calc(100vw - 2rem); overflow-x: auto; justify-content: flex-start; } .chapters { grid-template-columns: 1fr 1fr; max-height: 5.6rem; overflow: auto; } .bloom-aura { transform: translateY(-5rem); } .bloom-card { bottom: 1rem; max-height: none; width: calc(100vw - 1rem); padding: 1rem; } .memory-meta { grid-template-columns: 1fr; } .replay-list { grid-template-columns: 1fr; } .has-active .companion { opacity: 0; pointer-events: none; } }
      `}</style>
    </main>
  );
}
