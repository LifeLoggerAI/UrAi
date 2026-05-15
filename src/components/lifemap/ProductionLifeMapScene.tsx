'use client';

import Link from 'next/link';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState, type CSSProperties, type PointerEvent } from 'react';
import {
  buildReplayBeats,
  cameraPhaseMap,
  focusTransformForStar,
  interpolateReplayBeat,
  phaseTransform,
  type CameraPhase,
  type ReplayBeat,
} from './cinematicLifeMapSystem';
import { createWeeklyScrollDraft, getBloomForStar, useFullLifeMapData } from './useFullLifeMapData';
import type { LifeMapChapterId, LifeMapConstellation, LifeMapTone, MemoryStar, ScrollExport } from './lifeMapTypes';

type PanelMode = 'none' | 'focus' | 'replay' | 'ritual' | 'scroll' | 'mirror' | 'privacy';
type Lens = 'all' | LifeMapChapterId;
type ShellStyle = CSSProperties & { '--px': string; '--py': string; '--camera-x': string; '--camera-y': string; '--camera-scale': string; '--camera-blur': string };
type StarStyle = CSSProperties & { '--x': string; '--y': string; '--z': string; '--size': string; '--hue': string; '--aura': string; '--pulse': string; '--alpha': string };
type DustStyle = CSSProperties & { '--x': string; '--y': string; '--s': string; '--a': string; '--d': string; '--twinkle': string };

const hueByTone: Record<LifeMapTone, string> = {
  calm: '205deg', clarity: '188deg', joy: '44deg', grief: '218deg', stress: '18deg', recovery: '144deg', dream: '263deg', shadow: '285deg', threshold: '296deg', rebirth: '0deg', connection: '326deg', focus: '202deg',
};

const deepStars = Array.from({ length: 340 }, (_, index) => {
  const layer = index % 8;
  return {
    id: `deep-${index}`,
    x: (index * 37 + 11) % 100,
    y: (index * 61 + 7) % 100,
    size: layer < 2 ? 1.9 : layer < 4 ? 1.05 : 0.56,
    alpha: layer < 2 ? 0.78 : layer < 4 ? 0.46 : 0.22,
    depth: layer * 34,
    twinkle: 3.2 + (index % 9) * 0.43,
  };
});

const bloomVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 16, scale: 0.98, filter: 'blur(8px)', transition: { duration: 0.22 } },
};

function cx(...parts: Array<string | false | null | undefined>) { return parts.filter(Boolean).join(' '); }
function toneHue(tone: LifeMapTone) { return hueByTone[tone] ?? '210deg'; }
function relatedIdsFor(star: MemoryStar | null, constellations: LifeMapConstellation[]) {
  if (!star) return new Set<string>();
  const ids = new Set([star.id]);
  constellations.filter((item) => item.starIds.includes(star.id)).forEach((item) => item.starIds.forEach((id) => ids.add(id)));
  return ids;
}
function lineFor(starsById: Map<string, MemoryStar>, a: string, b: string) {
  const first = starsById.get(a);
  const second = starsById.get(b);
  return first && second ? { first, second } : null;
}
function starClass(star: MemoryStar, active: boolean, related: boolean, replayBeat: boolean) {
  return cx('memory-star', active && 'active', related && 'related', replayBeat && 'replay-beat', !related && 'dim', star.starType === 'threshold_moment' && 'threshold', star.starType === 'ritual_completion' && 'ritual');
}
function msLabel(ms: number) {
  const total = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

export default function ProductionLifeMapScene({ forceDemo = false }: { forceDemo?: boolean }) {
  const data = useFullLifeMapData(forceDemo);
  const [phase, setPhase] = useState<CameraPhase>('lifeMap');
  const [panel, setPanel] = useState<PanelMode>('none');
  const [lens, setLens] = useState<Lens>('all');
  const [selectedStarId, setSelectedStarId] = useState<string | null>(null);
  const [selectedConstellationId, setSelectedConstellationId] = useState<string | null>(null);
  const [showThreads, setShowThreads] = useState(true);
  const [showWhy, setShowWhy] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scrollDraft, setScrollDraft] = useState<ScrollExport | null>(null);
  const [replayElapsed, setReplayElapsed] = useState(0);
  const [replayPlaying, setReplayPlaying] = useState(false);

  const stars = useMemo(() => data.stars.filter((star) => star.isVisible && (lens === 'all' || star.chapterId === lens)), [data.stars, lens]);
  const starsById = useMemo(() => new Map(data.stars.map((star) => [star.id, star])), [data.stars]);
  const selectedStar = selectedStarId ? starsById.get(selectedStarId) ?? null : null;
  const bloom = getBloomForStar(data, selectedStarId);
  const relatedIds = relatedIdsFor(selectedStar, data.constellations);
  const replayBeats = useMemo(() => buildReplayBeats(stars, selectedConstellationId ?? 'current-era'), [stars, selectedConstellationId]);
  const replayState = useMemo(() => interpolateReplayBeat(replayBeats, replayElapsed), [replayBeats, replayElapsed]);
  const activeReplayBeat = replayState.beat;
  const activeReplayStar = activeReplayBeat ? starsById.get(activeReplayBeat.starId) ?? null : null;
  const selectedConstellation = selectedConstellationId ? data.constellations.find((item) => item.id === selectedConstellationId) ?? null : null;

  const camera = useMemo(() => {
    if ((phase === 'focusing' || phase === 'focusedMemory') && selectedStar) return focusTransformForStar(selectedStar);
    if ((phase === 'replaying' || phase === 'replayPaused') && activeReplayStar && activeReplayBeat) {
      return { ...focusTransformForStar(activeReplayStar), scale: activeReplayBeat.cameraTarget.scale, durationMs: 260 };
    }
    return phaseTransform(phase);
  }, [activeReplayBeat, activeReplayStar, phase, selectedStar]);

  const shellStyle: ShellStyle = {
    '--px': `${pointer.x}`,
    '--py': `${pointer.y}`,
    '--camera-x': `${camera.x}vw`,
    '--camera-y': `${camera.y}vh`,
    '--camera-scale': `${camera.scale}`,
    '--camera-blur': `${camera.blur}px`,
  };

  const companionLine = activeReplayBeat?.narratorLine ?? selectedStar?.narratorLine ?? selectedConstellation?.narratorLine ?? 'Choose a Memory Star. URAI will open the memory, thread, and reason it appeared.';

  useEffect(() => {
    if (!replayPlaying || phase !== 'replaying') return undefined;
    const startedAt = Date.now() - replayElapsed;
    const timer = window.setInterval(() => {
      const next = Date.now() - startedAt;
      if (next >= replayState.totalMs) {
        setReplayElapsed(replayState.totalMs);
        setReplayPlaying(false);
        setPhase('replayPaused');
      } else {
        setReplayElapsed(next);
      }
    }, 80);
    return () => window.clearInterval(timer);
  }, [phase, replayElapsed, replayPlaying, replayState.totalMs]);

  const lock = cameraPhaseMap[phase].interactionLocked;
  const openStar = useCallback((star: MemoryStar) => {
    if (lock) return;
    setSelectedStarId(star.id);
    setSelectedConstellationId(star.constellationIds[0] ?? null);
    setShowWhy(false);
    setPanel('focus');
    setPhase('focusing');
    window.setTimeout(() => setPhase('focusedMemory'), cameraPhaseMap.focusing.durationMs);
  }, [lock]);

  const returnToMap = useCallback(() => {
    setReplayPlaying(false);
    setPanel('none');
    setPhase('replayExit');
    window.setTimeout(() => {
      setPhase('lifeMap');
      setReplayElapsed(0);
      setSelectedStarId(null);
    }, cameraPhaseMap.replayExit.durationMs);
  }, []);

  const startReplay = useCallback(() => {
    if (replayBeats.length === 0) return;
    setPanel('replay');
    setPhase('replayIntro');
    setReplayElapsed(0);
    window.setTimeout(() => {
      setPhase('replaying');
      setReplayPlaying(true);
    }, cameraPhaseMap.replayIntro.durationMs);
  }, [replayBeats.length]);

  const createScroll = useCallback(() => {
    setScrollDraft(createWeeklyScrollDraft(data));
    setPanel('scroll');
  }, [data]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({ x: Number((((event.clientX - rect.left) / rect.width - 0.5) * 2).toFixed(3)), y: Number((((event.clientY - rect.top) / rect.height - 0.5) * 2).toFixed(3)) });
  }, []);

  return (
    <main className={cx('urai-map', panel !== 'none' && 'has-panel', `phase-${phase}`)} style={shellStyle} onPointerMove={handlePointerMove} aria-label="URAI Symbolic Life Map">
      <div className="void" aria-hidden />
      <div className="weather weather-a" aria-hidden />
      <div className="weather weather-b" aria-hidden />
      <div className="dust" aria-hidden>{deepStars.map((star) => { const style: DustStyle = { '--x': `${star.x}%`, '--y': `${star.y}%`, '--s': `${star.size}px`, '--a': `${star.alpha}`, '--d': `${star.depth}px`, '--twinkle': `${star.twinkle}s` }; return <span key={star.id} style={style} />; })}</div>

      <header className="map-header">
        <p>URAI LIFE MAP</p>
        <h1>{panel === 'focus' && selectedStar ? selectedStar.title : panel === 'replay' ? 'Replay Era' : 'Memory galaxy'}</h1>
        <span>{stars.length} Memory Stars · {data.constellations.length} Timeline Constellations · {cameraPhaseMap[phase].depth}</span>
      </header>

      <Link href="/" className="home-link">Home</Link>
      <aside className="companion" aria-live="polite"><strong>Companion</strong><span>{companionLine}</span><small>{cameraPhaseMap[phase].narratorEligible ? 'Narration ready.' : 'Holding quiet while the camera moves.'}</small></aside>

      <section className="camera-stage" style={{ transitionDuration: `${camera.durationMs}ms`, transitionTimingFunction: `cubic-bezier(${camera.easing.join(',')})` }}>
        <div className="galaxy-plane plane-a" aria-hidden /><div className="galaxy-plane plane-b" aria-hidden /><div className="galaxy-plane plane-c" aria-hidden />
        <svg className={cx('threads', showThreads && 'visible', panel === 'replay' && 'replay-trace')} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {data.constellations.map((constellation) => constellation.starIds.slice(1).map((id, index) => {
            const pair = lineFor(starsById, constellation.starIds[index], id);
            if (!pair) return null;
            const active = constellation.id === selectedConstellationId || Boolean(activeReplayBeat && constellation.starIds.includes(activeReplayBeat.starId));
            return <line key={`${constellation.id}-${id}`} className={cx('thread', active && 'active')} x1={pair.first.position.x} y1={pair.first.position.y} x2={pair.second.position.x} y2={pair.second.position.y} />;
          }))}
        </svg>
        {stars.map((star) => {
          const isActive = star.id === selectedStarId || star.id === activeReplayBeat?.starId;
          const isRelated = !selectedStarId || relatedIds.has(star.id) || panel === 'replay';
          const style: StarStyle = { '--x': `${star.position.x}%`, '--y': `${star.position.y}%`, '--z': `${star.position.z}px`, '--size': `${Math.max(6, star.visual.size * 0.68)}px`, '--hue': toneHue(star.emotionalTone), '--aura': `${Math.max(24, star.visual.auraRadius * 0.7)}px`, '--pulse': `${1.8 + star.visual.pulseSpeed * 2.8}s`, '--alpha': `${Math.max(0.55, star.confidence)}` };
          return <button key={star.id} type="button" className={starClass(star, isActive, isRelated, star.id === activeReplayBeat?.starId)} style={style} onClick={() => openStar(star)} aria-label={`Focus Memory Star: ${star.title}`}><span className="core" /><span className="ray ray-x" /><span className="ray ray-y" /><span className="label"><b>{star.title}</b><small>{star.subtitle}</small></span></button>;
        })}
      </section>

      <nav className="lens" aria-label="Symbolic Life Map lenses"><button className={lens === 'all' ? 'active' : ''} onClick={() => setLens('all')}>All</button>{data.chapters.map((chapter) => <button key={chapter.id} className={lens === chapter.id ? 'active' : ''} onClick={() => setLens(chapter.id)}><b>{chapter.title}</b><small>{chapter.subtitle}</small></button>)}</nav>
      <div className="dock"><button onClick={() => setShowThreads((value) => !value)}>{showThreads ? 'Hide thread' : 'Reveal thread'}</button><button onClick={startReplay}>Replay</button><button onClick={createScroll}>Create scroll</button><button onClick={() => setPanel('mirror')}>Mirror</button><button onClick={returnToMap}>Recenter</button></div>

      <AnimatePresence>
        {panel === 'focus' && selectedStar && <motion.section className="bloom-sheet" variants={bloomVariants} initial="hidden" animate="visible" exit="exit"><div className="bloom-orb" style={{ '--hue': toneHue(selectedStar.emotionalTone) } as CSSProperties} /><article><p>{selectedStar.chapterId} · {selectedStar.starType.replaceAll('_', ' ')}</p><h2>{bloom?.title ?? selectedStar.title}</h2><span>{bloom?.narratorReflection ?? selectedStar.narratorLine}</span><div className="trust"><small>Confidence {Math.round(selectedStar.confidence * 100)}%</small><small>{selectedStar.privacyLevel}</small><small>{selectedStar.sourceSignalIds.length} passive signals</small></div>{showWhy && <div className="why"><strong>Why this appeared</strong><p>{bloom?.whyThis.explanation ?? 'This Memory Star crossed URAI’s importance threshold through private, summarized signals.'}</p></div>}<div className="actions"><button onClick={startReplay}>Replay thread</button><button onClick={() => setShowWhy((value) => !value)}>Why this?</button><button onClick={() => setPanel('ritual')}>Ritual</button><button onClick={() => setPanel('privacy')}>Privacy</button><button onClick={returnToMap}>Return</button></div></article></motion.section>}
        {panel === 'replay' && <motion.section className="replay-panel" variants={bloomVariants} initial="hidden" animate="visible" exit="exit"><p>Replay Era</p><h2>{selectedConstellation?.title ?? 'Current emotional arc'}</h2><span>{activeReplayBeat?.narratorLine ?? 'URAI is ready to travel through this Timeline Constellation.'}</span><div className="replay-meter"><span>{msLabel(replayElapsed)}</span><input aria-label="Replay scrubber" type="range" min={0} max={replayState.totalMs || 1} value={Math.min(replayElapsed, replayState.totalMs || 1)} onChange={(event) => { setReplayElapsed(Number(event.target.value)); setReplayPlaying(false); setPhase('replayPaused'); }} /><span>{msLabel(replayState.totalMs)}</span></div><div className="actions"><button onClick={() => { setPhase('replaying'); setReplayPlaying(true); }}>{replayPlaying ? 'Playing' : 'Play'}</button><button onClick={() => { setReplayPlaying(false); setPhase('replayPaused'); }}>Pause</button><button onClick={() => setReplayElapsed((value) => Math.max(0, value - 2200))}>Back</button><button onClick={() => setReplayElapsed((value) => Math.min(replayState.totalMs, value + 2200))}>Forward</button><button onClick={returnToMap}>Exit</button></div>{replayBeats.slice(0, 6).map((beat: ReplayBeat, index) => <div key={beat.id} className={cx('beat', beat.id === activeReplayBeat?.id && 'active')}><b>{index + 1}</b><span>{beat.beatType}</span><small>{beat.narratorLine}</small></div>)}</motion.section>}
        {panel === 'scroll' && <motion.section className="side-panel" variants={bloomVariants} initial="hidden" animate="visible" exit="exit"><p>Memory scroll</p><h2>{scrollDraft?.title ?? data.scrollExports[0]?.title ?? 'Weekly scroll'}</h2><span>{scrollDraft?.generatedText ?? data.scrollExports[0]?.generatedText}</span><button onClick={returnToMap}>Return</button></motion.section>}
        {panel === 'mirror' && <motion.section className="side-panel" variants={bloomVariants} initial="hidden" animate="visible" exit="exit"><p>Mirror of Becoming</p><h2>Your long arc is forming</h2><span>{data.insights.find((insight) => insight.insightType === 'mirror')?.text ?? 'URAI is gathering long-term constellations without turning them into fixed claims.'}</span><button onClick={returnToMap}>Return</button></motion.section>}
        {panel === 'ritual' && <motion.section className="side-panel" variants={bloomVariants} initial="hidden" animate="visible" exit="exit"><p>Ritual layer</p><h2>Suggested rituals</h2>{data.rituals.map((ritual) => <div key={ritual.id} className="beat"><span>{ritual.title}</span><small>{ritual.narratorLine}</small></div>)}<button onClick={() => setPanel('focus')}>Return</button></motion.section>}
        {panel === 'privacy' && <motion.section className="side-panel" variants={bloomVariants} initial="hidden" animate="visible" exit="exit"><p>Privacy controls</p><h2>{selectedStar?.title ?? 'Life Map privacy'}</h2><span>Raw private content is not shown in the map. Hide, correct, disable, delete, or export any signal path.</span><div className="actions vertical"><button>Hide this star</button><button>Mark inaccurate</button><button>Disable similar signals</button><button>Delete source signals</button></div><button onClick={() => setPanel('focus')}>Return</button></motion.section>}
      </AnimatePresence>

      <style jsx>{`
        .urai-map{position:fixed;inset:0;overflow:hidden;min-height:100dvh;background:#000108;color:white;isolation:isolate}.void{position:absolute;inset:0;background:radial-gradient(circle at calc(50% + var(--px)*2%) calc(50% + var(--py)*2%),rgba(21,43,88,.34),rgba(2,5,18,.74) 42%,#000 100%)}.weather{position:absolute;border-radius:999px;filter:blur(58px);mix-blend-mode:screen;pointer-events:none}.weather-a{inset:23% 20% 26% 18%;background:radial-gradient(ellipse,rgba(49,112,229,.2),transparent 72%);animation:drift 24s ease-in-out infinite alternate}.weather-b{inset:18% 9% 35% 45%;background:radial-gradient(ellipse,rgba(177,92,255,.13),transparent 76%);animation:drift 31s ease-in-out infinite alternate-reverse}.dust{position:absolute;inset:0;transform:translate3d(calc(var(--px)*-18px),calc(var(--py)*-14px),0);transition:transform .18s ease-out}.dust span{position:absolute;left:var(--x);top:var(--y);width:var(--s);height:var(--s);border-radius:50%;background:rgba(255,255,255,var(--a));box-shadow:0 0 10px rgba(210,232,255,var(--a));transform:translate3d(-50%,-50%,var(--d));animation:twinkle var(--twinkle) ease-in-out infinite}.map-header{position:absolute;z-index:20;top:1rem;left:50%;transform:translateX(-50%);text-align:center;text-shadow:0 14px 38px #000}.map-header p,.bloom-sheet p,.side-panel p,.replay-panel p{margin:0;text-transform:uppercase;letter-spacing:.34em;font-size:.58rem;color:rgba(255,255,255,.46)}.map-header h1{margin:.2rem 0;font-size:clamp(1.35rem,2.8vw,2.5rem);letter-spacing:-.05em}.map-header span{font-size:.72rem;color:rgba(232,244,255,.58)}.home-link,.companion,.lens,.dock,.bloom-sheet article,.side-panel,.replay-panel{backdrop-filter:blur(18px);border:1px solid rgba(190,220,255,.14);background:rgba(1,5,18,.48);box-shadow:0 28px 90px rgba(0,0,0,.36)}.home-link{position:absolute;z-index:30;left:1rem;top:1rem;border-radius:999px;padding:.55rem .85rem;color:white;text-decoration:none}.companion{position:absolute;z-index:22;right:1rem;top:1rem;width:min(310px,calc(100vw - 2rem));border-radius:20px;padding:.85rem}.companion strong{display:block;text-transform:uppercase;letter-spacing:.16em;font-size:.62rem;color:rgba(255,255,255,.48)}.companion span{display:block;margin-top:.4rem;font-size:.84rem;line-height:1.5;color:rgba(255,255,255,.78)}.companion small{display:block;margin-top:.4rem;color:rgba(255,255,255,.44)}.camera-stage{position:absolute;z-index:8;inset:5.2rem 3rem 8rem;transform:translate3d(var(--camera-x),var(--camera-y),0) scale(var(--camera-scale));filter:blur(var(--camera-blur));transform-origin:50% 50%;transition-property:transform,filter,opacity;perspective:1400px;transform-style:preserve-3d}.galaxy-plane{position:absolute;left:50%;top:50%;border-radius:50%;border:1px solid rgba(180,220,255,.045);pointer-events:none}.plane-a{width:84%;height:43%;transform:translate(-50%,-50%) rotate(-14deg);box-shadow:0 0 110px rgba(70,120,220,.13)}.plane-b{width:58%;height:27%;transform:translate(-50%,-50%) rotate(19deg);box-shadow:inset 0 0 80px rgba(160,190,255,.07)}.plane-c{width:35%;height:15%;transform:translate(-50%,-50%) rotate(34deg);opacity:.5}.threads{position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity .35s ease;overflow:visible}.threads.visible{opacity:.56}.thread{stroke:rgba(205,232,255,.15);stroke-width:.07;stroke-linecap:round;filter:drop-shadow(0 0 8px rgba(150,210,255,.22))}.thread.active{stroke:rgba(255,255,255,.62);stroke-width:.14}.replay-trace .thread.active{stroke-dasharray:4 3;animation:dash 1.2s linear infinite}.memory-star{position:absolute;left:var(--x);top:var(--y);width:var(--size);height:var(--size);transform:translate3d(-50%,-50%,var(--z));border:0;border-radius:999px;background:transparent;cursor:pointer;opacity:var(--alpha);transition:transform .34s ease,opacity .34s ease,filter .34s ease}.memory-star.dim{opacity:.14;filter:saturate(.4) blur(.5px)}.memory-star.active,.memory-star:hover,.memory-star:focus-visible{opacity:1;transform:translate3d(-50%,-50%,calc(var(--z) + 80px)) scale(1.65);z-index:12;outline:none}.memory-star.replay-beat{animation:beatPulse 1.25s ease-in-out infinite}.core{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 39% 32%,#fff 0 18%,hsl(var(--hue) 95% 80%) 44%,hsl(var(--hue) 90% 52%/.16) 76%,transparent 100%);box-shadow:0 0 8px #fff,0 0 var(--aura) hsl(var(--hue) 90% 68%/.55),0 0 calc(var(--aura)*2.6) hsl(var(--hue) 90% 58%/.16);animation:starPulse var(--pulse) ease-in-out infinite}.core:before{content:'';position:absolute;inset:-120%;border-radius:50%;background:radial-gradient(circle,hsl(var(--hue) 90% 74%/.18),transparent 62%)}.threshold .core:after,.ritual .core:after{content:'';position:absolute;inset:-90%;border:1px solid hsl(var(--hue) 90% 82%/.28);border-radius:50%;transform:rotate(-18deg) scaleX(1.72)}.ray{position:absolute;left:50%;top:50%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.82),transparent);opacity:.55}.ray-x{width:calc(var(--size)*4.6);transform:translate(-50%,-50%)}.ray-y{width:calc(var(--size)*3.3);transform:translate(-50%,-50%) rotate(90deg)}.label{position:absolute;left:50%;top:calc(100% + .7rem);min-width:150px;transform:translateX(-50%);text-align:center;opacity:0;pointer-events:none;text-shadow:0 10px 24px #000}.memory-star:hover .label,.memory-star.active .label,.memory-star:focus-visible .label{opacity:1}.label b,.label small{display:block}.label b{font-size:.75rem}.label small{font-size:.62rem;color:rgba(255,255,255,.62)}.lens{position:absolute;z-index:22;left:50%;bottom:1rem;transform:translateX(-50%);display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:.35rem;width:min(980px,calc(100vw - 2rem));border-radius:28px;padding:.45rem;opacity:.62;transition:.25s}.lens:hover,.lens:focus-within{opacity:1}.lens button,.dock button,.actions button,.side-panel button,.replay-panel button{border:1px solid rgba(180,215,255,.18);border-radius:999px;background:rgba(10,18,44,.64);color:white;padding:.56rem .75rem;font-size:.73rem;cursor:pointer}.lens button{border:0;border-radius:20px;text-align:left;background:transparent;color:rgba(255,255,255,.62)}.lens button.active,.lens button:hover,.lens button:focus-visible{background:rgba(255,255,255,.08);color:white}.lens b,.lens small{display:block}.lens small{font-size:.58rem;opacity:.6}.dock{position:absolute;z-index:24;left:50%;bottom:6.25rem;transform:translateX(-50%) translateY(6px);display:flex;gap:.35rem;flex-wrap:wrap;justify-content:center;border-radius:999px;padding:.4rem;opacity:.36;transition:.25s}.dock:hover,.dock:focus-within{opacity:.96;transform:translateX(-50%)}.bloom-sheet{position:absolute;z-index:40;inset:0;display:grid;place-items:center;background:radial-gradient(circle at 50% 48%,rgba(255,255,255,.05),rgba(0,0,0,.82));padding:2rem}.bloom-orb{width:clamp(130px,18vw,230px);height:clamp(130px,18vw,230px);border-radius:999px;background:radial-gradient(circle at 34% 28%,#fff,hsl(var(--hue) 90% 76%) 42%,hsl(var(--hue) 90% 52%/.16));box-shadow:0 0 34px white,0 0 140px hsl(var(--hue) 90% 68%/.42);animation:breathe 4s ease-in-out infinite}.bloom-sheet article{position:absolute;bottom:4rem;width:min(680px,calc(100vw - 2rem));border-radius:34px;padding:1.35rem;text-align:center}.bloom-sheet h2,.side-panel h2,.replay-panel h2{margin:.35rem 0 .55rem;font-size:clamp(1.8rem,4.4vw,4rem);line-height:.95;letter-spacing:-.055em}.bloom-sheet article>span,.side-panel span,.replay-panel span{display:block;color:rgba(255,255,255,.74);line-height:1.55}.trust,.actions{display:flex;gap:.45rem;justify-content:center;flex-wrap:wrap;margin-top:.9rem}.trust small{color:rgba(255,255,255,.55)}.why{margin:1rem auto 0;max-width:560px;border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:.85rem;background:rgba(255,255,255,.055);text-align:left}.why p{margin:.35rem 0 0;color:rgba(255,255,255,.68)}.side-panel,.replay-panel{position:absolute;z-index:42;right:1rem;top:6rem;bottom:1rem;width:min(430px,calc(100vw - 2rem));border-radius:30px;padding:1rem;overflow:auto}.beat{margin-top:.65rem;border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:.75rem;background:rgba(255,255,255,.05)}.beat.active{border-color:rgba(255,255,255,.34);box-shadow:0 0 28px rgba(130,220,255,.18)}.beat b,.beat span,.beat small{display:block}.replay-meter{display:grid;grid-template-columns:auto 1fr auto;gap:.6rem;align-items:center;margin:1rem 0}.replay-meter input{width:100%;accent-color:white}.vertical{flex-direction:column}@keyframes twinkle{0%,100%{opacity:calc(var(--a)*.55);transform:translate3d(-50%,-50%,var(--d)) scale(.82)}50%{opacity:var(--a);transform:translate3d(-50%,-50%,var(--d)) scale(1.22)}}@keyframes drift{from{transform:translate3d(-2%,-1%,0) scale(.98)}to{transform:translate3d(2%,1%,0) scale(1.04)}}@keyframes starPulse{50%{filter:brightness(1.25)}}@keyframes breathe{50%{transform:scale(1.04)}}@keyframes dash{to{stroke-dashoffset:-14}}@keyframes beatPulse{50%{filter:brightness(1.4)}}@media (max-width:760px){.map-header{top:5.1rem;width:calc(100vw - 2rem)}.companion{left:1rem;right:1rem;top:auto;bottom:9.8rem;width:auto}.camera-stage{inset:8rem 1rem 15rem}.lens{grid-template-columns:repeat(2,minmax(0,1fr));bottom:.5rem;opacity:.9}.dock{bottom:6.7rem;border-radius:24px;opacity:.85}.side-panel,.replay-panel{left:1rem;right:1rem;width:auto;top:7rem}.bloom-sheet article{bottom:1rem}}@media (prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition-duration:.01ms!important}.dust,.camera-stage{transform:none!important;filter:none!important}}
      `}</style>
    </main>
  );
}
