'use client';

import Link from 'next/link';
import { useCallback, useMemo, useState, type CSSProperties, type PointerEvent } from 'react';
import { createWeeklyScrollDraft, getBloomForStar, useFullLifeMapData } from './useFullLifeMapData';
import type { LifeMapChapterId, LifeMapConstellation, LifeMapTone, MemoryStar, ScrollExport } from './lifeMapTypes';

type Mode = 'galaxy' | 'focus' | 'replay' | 'relationship' | 'ritual' | 'scroll' | 'mirror' | 'privacy';
type Lens = 'all' | LifeMapChapterId;

type ShellStyle = CSSProperties & { '--px': string; '--py': string };
type StarStyle = CSSProperties & { '--x': string; '--y': string; '--z': string; '--size': string; '--hue': string; '--aura': string; '--pulse': string; '--alpha': string };
type DustStyle = CSSProperties & { '--x': string; '--y': string; '--s': string; '--a': string; '--d': string; '--twinkle': string };
type OverlayStyle = CSSProperties & { '--overlay-x': string; '--overlay-y': string; '--overlay-color': string; '--overlay-alpha': string };

const hueByTone: Record<LifeMapTone, string> = {
  calm: '205deg', clarity: '188deg', joy: '44deg', grief: '218deg', stress: '18deg', recovery: '144deg', dream: '263deg', shadow: '285deg', threshold: '296deg', rebirth: '0deg', connection: '326deg', focus: '202deg',
};

const DEEP_STARS = Array.from({ length: 280 }, (_, index) => {
  const x = (index * 37 + 11) % 100;
  const y = (index * 61 + 7) % 100;
  const layer = index % 7;
  return { id: `deep-star-${index}`, x, y, size: layer === 0 ? 2.15 : layer === 1 ? 1.55 : layer === 2 ? 1.12 : layer === 3 ? 0.86 : 0.58, alpha: layer === 0 ? 0.9 : layer === 1 ? 0.68 : layer === 2 ? 0.5 : layer === 3 ? 0.34 : 0.2, depth: layer, twinkle: 3.1 + (index % 9) * 0.42 };
});

function cx(...parts: Array<string | false | null | undefined>) { return parts.filter(Boolean).join(' '); }
function toneHue(tone: LifeMapTone) { return hueByTone[tone] ?? '210deg'; }
function activeRelatedIds(star: MemoryStar | null, constellations: LifeMapConstellation[]) {
  if (!star) return new Set<string>();
  const ids = new Set<string>([star.id]);
  constellations.filter((constellation) => constellation.starIds.includes(star.id)).forEach((constellation) => constellation.starIds.forEach((id) => ids.add(id)));
  return ids;
}
function lineFor(starsById: Map<string, MemoryStar>, a: string, b: string) {
  const first = starsById.get(a);
  const second = starsById.get(b);
  if (!first || !second) return null;
  return { first, second };
}
function starClass(star: MemoryStar, active: boolean, dim: boolean) {
  return cx('life-star', active && 'active', dim && 'dim', `tone-${star.emotionalTone}`, star.starType === 'ritual_completion' && 'ritual', star.starType === 'threshold_moment' && 'threshold', (star.starType === 'relationship_moment' || star.starType === 'repair_moment' || star.starType === 'social_silence') && 'relationship');
}

export default function FullLifeMapScene({ forceDemo = false }: { forceDemo?: boolean }) {
  const data = useFullLifeMapData(forceDemo);
  const [selectedStarId, setSelectedStarId] = useState<string | null>(null);
  const [selectedConstellationId, setSelectedConstellationId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('galaxy');
  const [lens, setLens] = useState<Lens>('all');
  const [showThreads, setShowThreads] = useState(true);
  const [showWhy, setShowWhy] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [localScroll, setLocalScroll] = useState<ScrollExport | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const stars = useMemo(() => data.stars.filter((star) => star.isVisible && (lens === 'all' || star.chapterId === lens)), [data.stars, lens]);
  const starsById = useMemo(() => new Map(data.stars.map((star) => [star.id, star])), [data.stars]);
  const selectedStar = selectedStarId ? starsById.get(selectedStarId) ?? null : null;
  const selectedBloom = getBloomForStar(data, selectedStarId);
  const relatedIds = activeRelatedIds(selectedStar, data.constellations);
  const selectedConstellation = selectedConstellationId ? data.constellations.find((item) => item.id === selectedConstellationId) ?? null : null;
  const companionLine = selectedStar?.narratorLine ?? selectedConstellation?.narratorLine ?? 'Choose a bright star. URAI will open the memory, thread, and reason it appeared.';
  const currentLensTitle = lens === 'all' ? 'All stars' : data.chapters.find((chapter) => chapter.id === lens)?.title ?? 'Life Map';
  const shellStyle: ShellStyle = { '--px': `${pointer.x}`, '--py': `${pointer.y}` };

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
    setPointer({ x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) });
  }, []);
  const handleStar = useCallback((star: MemoryStar) => { setSelectedStarId(star.id); setSelectedConstellationId(star.constellationIds[0] ?? null); setShowWhy(false); setMode('focus'); setZoom(1.16); }, []);
  const reset = useCallback(() => { setSelectedStarId(null); setSelectedConstellationId(null); setMode('galaxy'); setShowWhy(false); setZoom(1); }, []);
  const createScroll = useCallback(() => { const draft = createWeeklyScrollDraft(data); setLocalScroll(draft); setMode('scroll'); }, [data]);
  const replayStars = selectedConstellation?.starIds ?? selectedStar?.constellationIds.flatMap((id) => data.constellations.find((item) => item.id === id)?.starIds ?? []) ?? [];

  return (
    <main className={cx('life-map-v4', mode !== 'galaxy' && 'is-layered')} aria-label="URAI Life Map" style={shellStyle} onPointerMove={handlePointerMove}>
      <div className="void" aria-hidden /><div className="depth-grid" aria-hidden /><div className="nebula nebula-blue" aria-hidden /><div className="nebula nebula-violet" aria-hidden /><div className="nebula nebula-gold" aria-hidden />
      <div className="star-dust" aria-hidden>{DEEP_STARS.map((star) => { const style: DustStyle = { '--x': `${star.x}%`, '--y': `${star.y}%`, '--s': `${star.size}px`, '--a': String(star.alpha), '--d': `${star.depth * 34}px`, '--twinkle': `${star.twinkle}s` }; return <span key={star.id} style={style} />; })}</div>
      {data.overlays.map((overlay, index) => { const style: OverlayStyle = { '--overlay-x': `${30 + index * 20}%`, '--overlay-y': `${36 + (index % 2) * 22}%`, '--overlay-color': toneHue(overlay.overlayType === 'shadow' ? 'shadow' : overlay.overlayType === 'threshold' ? 'threshold' : 'recovery'), '--overlay-alpha': String(Math.max(0.05, overlay.intensity * 0.16)) }; return <div key={overlay.id} className={`symbolic-overlay ${overlay.overlayType}`} style={style} aria-hidden />; })}
      <header className="life-map-header"><p>URAI LIFE MAP</p><h1>{mode === 'focus' && selectedStar ? selectedStar.title : mode === 'mirror' ? 'Mirror of Becoming' : 'Memory galaxy'}</h1><span>{data.stars.length} memory stars · {data.constellations.length} emotional threads · {currentLensTitle}</span></header>
      <Link href="/" className="home-link">Home</Link>
      <section className="companion-panel" aria-live="polite"><strong>Companion</strong><span>{companionLine}</span><small>{data.loading ? 'Forming the field…' : 'Tap a star to open the bloom.'}</small></section>
      <section className="galaxy-shell" style={{ transform: `translate3d(calc(var(--px) * -10px), calc(var(--py) * -8px), 0) scale(${zoom})` }}>
        <div className="galaxy-plane galaxy-plane-back" aria-hidden /><div className="galaxy-plane galaxy-plane-mid" aria-hidden /><div className="galaxy-plane galaxy-plane-front" aria-hidden />
        <svg className={cx('constellation-svg', showThreads && 'visible')} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>{data.constellations.map((constellation) => constellation.starIds.slice(1).map((id, index) => { const pair = lineFor(starsById, constellation.starIds[index], id); if (!pair) return null; const active = constellation.id === selectedConstellationId || (selectedStar && constellation.starIds.includes(selectedStar.id)); return <line key={`${constellation.id}-${constellation.starIds[index]}-${id}`} className={cx('constellation-line', active && 'active', mode === 'replay' && replayStars.includes(id) && 'replay')} x1={pair.first.position.x} y1={pair.first.position.y} x2={pair.second.position.x} y2={pair.second.position.y} />; }))}</svg>
        {stars.map((star) => { const active = selectedStarId === star.id; const related = relatedIds.has(star.id); const style: StarStyle = { '--x': `${star.position.x}%`, '--y': `${star.position.y}%`, '--z': `${star.position.z}px`, '--size': `${Math.max(5.5, star.visual.size * 0.62)}px`, '--hue': toneHue(star.emotionalTone), '--aura': `${Math.max(24, star.visual.auraRadius * 0.72)}px`, '--pulse': `${1.8 + star.visual.pulseSpeed * 3.2}s`, '--alpha': String(Math.max(0.55, star.confidence)) }; return <button key={star.id} type="button" className={starClass(star, active, Boolean(selectedStar && !related))} style={style} onClick={() => handleStar(star)} onDoubleClick={() => setMode('replay')} aria-label={`Open memory bloom for ${star.title}`}><span className="star-core" /><span className="star-ray ray-one" /><span className="star-ray ray-two" /><span className="star-label"><strong>{star.title}</strong><small>{star.subtitle}</small></span></button>; })}
      </section>
      <nav className="lens-bar" aria-label="Life Map lenses"><button className={lens === 'all' ? 'active' : ''} onClick={() => setLens('all')}>All</button>{data.chapters.map((chapter) => <button key={chapter.id} className={lens === chapter.id ? 'active' : ''} onClick={() => { setLens(chapter.id); setSelectedConstellationId(chapter.constellationIds[0] ?? null); }}><strong>{chapter.title}</strong><small>{chapter.subtitle}</small></button>)}</nav>
      <div className="control-dock"><button onClick={() => setZoom((value) => Math.min(1.82, value + 0.12))}>Drift in</button><button onClick={() => setZoom((value) => Math.max(0.78, value - 0.12))}>Drift back</button><button onClick={() => setShowThreads((value) => !value)}>{showThreads ? 'Hide thread' : 'Reveal thread'}</button><button onClick={createScroll}>Create scroll</button><button onClick={() => setMode('mirror')}>Mirror</button><button onClick={reset}>Recenter</button></div>
      {selectedStar && mode === 'focus' && <section className="memory-bloom" aria-live="polite"><div className="bloom-orb" style={{ '--hue': toneHue(selectedStar.emotionalTone) } as CSSProperties} aria-hidden /><article><p>{selectedStar.chapterId} · {selectedStar.starType.replaceAll('_', ' ')}</p><h2>{selectedBloom?.title ?? selectedStar.title}</h2><span>{selectedBloom?.narratorReflection ?? selectedStar.narratorLine}</span><div className="source-row"><small>Confidence {Math.round(selectedStar.confidence * 100)}%</small><small>{selectedStar.privacyLevel}</small><small>{selectedStar.sourceSignalIds.length} passive signals</small></div>{showWhy && <div className="why-box"><strong>Why this appeared</strong><p>{selectedBloom?.whyThis.explanation ?? 'URAI surfaced this because it crossed the Life Map importance threshold using passive, privacy-filtered signal categories.'}</p></div>}<div className="bloom-actions"><button onClick={() => setMode('replay')}>Replay thread</button><button onClick={() => setShowWhy((value) => !value)}>Why this?</button><button onClick={() => setMode('ritual')}>Ritual</button><button onClick={() => setMode('privacy')}>Privacy</button><button onClick={reset}>Return</button></div></article></section>}
      {mode === 'replay' && <section className="side-sheet replay-sheet"><p>Timeline playback</p><h2>{selectedConstellation?.title ?? 'Selected memory thread'}</h2>{(selectedConstellation?.starIds ?? replayStars).map((id, index) => { const star = starsById.get(id); return star ? <div key={id} className="replay-step"><b>{index + 1}</b><span>{star.title}</span><small>{star.narratorLine}</small></div> : null; })}<button onClick={() => setMode(selectedStar ? 'focus' : 'galaxy')}>Close replay</button></section>}
      {mode === 'relationship' && <section className="side-sheet"><p>Relationship constellation</p><h2>Social orbit paths</h2>{data.socialGraph.map((node) => <div key={node.id} className="metric-row"><span>{node.alias}</span><b>{Math.round(node.orbitStrength * 100)}%</b><small>warmth {Math.round(node.warmthScore * 100)} · tension {Math.round(node.tensionScore * 100)}</small></div>)}<button onClick={() => setMode('galaxy')}>Return</button></section>}
      {mode === 'ritual' && <section className="side-sheet"><p>Ritual layer</p><h2>Unlocked rituals</h2>{data.rituals.map((ritual) => <div key={ritual.id} className="metric-row"><span>{ritual.title}</span><b>{ritual.status}</b><small>{ritual.narratorLine}</small></div>)}<button onClick={() => setMode(selectedStar ? 'focus' : 'galaxy')}>Return</button></section>}
      {mode === 'scroll' && <section className="side-sheet scroll-sheet"><p>Memory scroll</p><h2>{localScroll?.title ?? data.scrollExports[0]?.title ?? 'Weekly scroll'}</h2><span>{localScroll?.generatedText ?? data.scrollExports[0]?.generatedText}</span><small>Scroll prepared privately. Export when ready.</small><button onClick={() => setMode('galaxy')}>Return</button></section>}
      {mode === 'mirror' && <section className="mirror-layer"><p>Mirror of Becoming</p><h2>Your long arc is forming</h2><span>{data.insights.find((insight) => insight.insightType === 'mirror')?.text ?? 'The Mirror gathers long-term constellations without turning them into fixed identity claims.'}</span><div className="mirror-grid">{data.chapters.map((chapter) => <div key={chapter.id}><strong>{chapter.title}</strong><small>{chapter.narratorSummary}</small></div>)}</div><button onClick={() => setMode('galaxy')}>Return to Life Map</button></section>}
      {mode === 'privacy' && <section className="side-sheet privacy-sheet"><p>Privacy controls</p><h2>{selectedStar?.title ?? 'Life Map privacy'}</h2><span>Raw private content is not shown in the map. Hide, correct, disable, delete, or export any signal path.</span><div className="bloom-actions vertical"><button>Hide this star</button><button>Mark inaccurate</button><button>Disable similar signal type</button><button>Delete source signals</button></div><button onClick={() => setMode(selectedStar ? 'focus' : 'galaxy')}>Return</button></section>}
      <style jsx>{`
        .life-map-v4 { position: fixed; inset: 0; min-height: 100dvh; overflow: hidden; color: white; background: #000108; isolation: isolate; font-family: inherit; }
        .void { position: absolute; inset: 0; z-index: 0; background: radial-gradient(circle at calc(50% + var(--px) * 2%) calc(52% + var(--py) * 2%), rgba(22,45,92,.32) 0 12%, rgba(4,8,24,.72) 36%, #01020a 66%, #000 100%); }
        .depth-grid { position: absolute; inset: 11% 10% 16%; z-index: 1; border-radius: 999px; border: 1px solid rgba(130,170,255,.025); transform: translate3d(calc(var(--px) * -4px), calc(var(--py) * -3px), 0) rotate(-11deg); box-shadow: inset 0 0 120px rgba(60,110,210,.06), 0 0 160px rgba(0,0,0,.38); pointer-events: none; }
        .nebula { position: absolute; z-index: 1; pointer-events: none; border-radius: 999px; filter: blur(58px); opacity: .38; mix-blend-mode: screen; }
        .nebula-blue { left: 22%; top: 25%; width: 52vw; height: 34vh; background: radial-gradient(ellipse, rgba(56,112,220,.22), transparent 74%); animation: nebulaDrift 26s ease-in-out infinite alternate; }
        .nebula-violet { right: 10%; top: 20%; width: 31vw; height: 40vh; background: radial-gradient(ellipse, rgba(145,89,255,.12), transparent 72%); animation: nebulaDrift 31s ease-in-out infinite alternate-reverse; }
        .nebula-gold { left: 42%; bottom: 17%; width: 24vw; height: 22vh; background: radial-gradient(ellipse, rgba(255,218,119,.06), transparent 70%); }
        .star-dust { position: absolute; inset: 0; z-index: 2; pointer-events: none; perspective: 1200px; transform: translate3d(calc(var(--px) * -18px), calc(var(--py) * -14px), 0); transition: transform .18s ease-out; }
        .star-dust span { position: absolute; left: var(--x); top: var(--y); width: var(--s); height: var(--s); border-radius: 50%; background: rgba(255,255,255,var(--a)); box-shadow: 0 0 9px rgba(190,220,255,var(--a)); transform: translate3d(-50%, -50%, var(--d)); animation: dustTwinkle var(--twinkle) ease-in-out infinite; }
        .symbolic-overlay { position: absolute; z-index: 2; left: var(--overlay-x); top: var(--overlay-y); width: min(24vw,330px); height: min(17vw,220px); transform: translate(-50%,-50%) rotate(-16deg); border-radius: 999px; background: radial-gradient(ellipse, hsl(var(--overlay-color) 88% 65% / var(--overlay-alpha)), transparent 72%); filter: blur(42px); pointer-events: none; }
        .life-map-header { position: absolute; z-index: 20; top: 1.05rem; left: 50%; transform: translateX(-50%); text-align: center; pointer-events: none; text-shadow: 0 12px 40px rgba(0,0,0,.92); }
        .life-map-header p, .side-sheet p, .mirror-layer p, .memory-bloom p { margin: 0; text-transform: uppercase; letter-spacing: .34em; font-size: .58rem; color: rgba(255,255,255,.46); }
        .life-map-header h1 { margin: .2rem 0; font-size: clamp(1.15rem,2.3vw,2rem); letter-spacing: -.035em; }
        .life-map-header span { color: rgba(226,242,255,.58); font-size: .72rem; }
        .home-link { position: absolute; z-index: 30; left: 1rem; top: 1rem; border: 1px solid rgba(255,255,255,.18); border-radius: 999px; padding: .55rem .85rem; color: white; text-decoration: none; background: rgba(0,0,0,.34); backdrop-filter: blur(12px); }
        .companion-panel { position: absolute; z-index: 21; right: 1rem; top: 1rem; width: min(292px, calc(100vw - 2rem)); border: 1px solid rgba(170,205,255,.14); background: rgba(1,4,14,.45); backdrop-filter: blur(16px); border-radius: 18px; padding: .78rem; box-shadow: 0 20px 70px rgba(0,0,0,.32); opacity: .82; }
        .companion-panel strong { display: block; font-size: .62rem; text-transform: uppercase; letter-spacing: .14em; color: rgba(255,255,255,.48); margin-bottom: .35rem; }
        .companion-panel span, .side-sheet span, .mirror-layer span, .memory-bloom article > span { display: block; color: rgba(255,255,255,.78); font-size: .82rem; line-height: 1.5; }
        .companion-panel small { display: block; margin-top: .45rem; color: rgba(255,255,255,.42); }
        .galaxy-shell { position: absolute; z-index: 8; inset: 5rem 3rem 8.1rem; transform-origin: 50% 50%; transition: transform .7s cubic-bezier(.19,1,.22,1), filter .45s ease, opacity .45s ease; perspective: 1400px; transform-style: preserve-3d; }
        .is-layered .galaxy-shell { filter: saturate(.88); opacity: .72; }
        .galaxy-plane { position: absolute; left: 50%; top: 50%; border-radius: 50%; pointer-events: none; transform: translate(-50%, -50%) rotate(-14deg); border: 1px solid rgba(170,210,255,.04); }
        .galaxy-plane-back { width: 82%; height: 43%; box-shadow: 0 0 95px rgba(60,112,220,.1); }
        .galaxy-plane-mid { width: 59%; height: 27%; transform: translate(-50%, -50%) rotate(18deg); box-shadow: inset 0 0 75px rgba(130,170,255,.06); }
        .galaxy-plane-front { width: 35%; height: 15%; transform: translate(-50%, -50%) rotate(34deg); opacity: .38; }
        .constellation-svg { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; transition: opacity .45s ease; overflow: visible; transform: translateZ(-110px); }
        .constellation-svg.visible { opacity: .55; }
        .constellation-line { stroke: rgba(190,220,255,.14); stroke-width: .065; stroke-linecap: round; filter: drop-shadow(0 0 8px rgba(160,210,255,.2)); transition: stroke .3s ease, stroke-width .3s ease, opacity .3s ease; }
        .constellation-line.active { stroke: rgba(235,248,255,.52); stroke-width: .13; }
        .constellation-line.replay { stroke-dasharray: 4 3; animation: dash 1.2s linear infinite; stroke: rgba(255,255,255,.78); }
        .life-star { position: absolute; left: var(--x); top: var(--y); width: var(--size); height: var(--size); transform: translate3d(-50%,-50%,var(--z)); border: 0; border-radius: 999px; cursor: pointer; background: transparent; opacity: var(--alpha); transition: transform .35s ease, opacity .35s ease, filter .35s ease; animation: starPulse var(--pulse) ease-in-out infinite; }
        .star-core { position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle at 42% 36%, #fff 0 18%, #f5fbff 22%, hsl(var(--hue) 92% 78%) 48%, hsl(var(--hue) 88% 48% / .2) 76%, transparent 100%); box-shadow: 0 0 8px rgba(255,255,255,.98), 0 0 var(--aura) hsl(var(--hue) 90% 68% / .52), 0 0 calc(var(--aura) * 2.6) hsl(var(--hue) 90% 58% / .14); }
        .star-core::before { content: ''; position: absolute; inset: -125%; border-radius: 50%; background: radial-gradient(circle, hsl(var(--hue) 90% 72% / .18), transparent 64%); filter: blur(3px); }
        .star-ray { position: absolute; left: 50%; top: 50%; width: calc(var(--size) * 4.7); height: 1px; transform-origin: center; background: linear-gradient(90deg, transparent, rgba(255,255,255,.82), transparent); opacity: .6; filter: blur(.12px); }
        .ray-one { transform: translate(-50%,-50%); }
        .ray-two { transform: translate(-50%,-50%) rotate(90deg); opacity: .38; width: calc(var(--size) * 3.4); }
        .life-star.threshold .star-core::after, .life-star.ritual .star-core::after, .life-star.relationship .star-core::after { content: ''; position: absolute; inset: -90%; border-radius: 50%; border: 1px solid hsl(var(--hue) 90% 82% / .24); transform: rotate(-18deg) scaleX(1.72); }
        .life-star:hover, .life-star.active { transform: translate3d(-50%,-50%,calc(var(--z) + 80px)) scale(1.58); opacity: 1; filter: brightness(1.26); z-index: 12; }
        .life-star.dim { opacity: .13; filter: blur(.45px) saturate(.42); }
        .star-label { position: absolute; left: 50%; top: calc(100% + .7rem); transform: translateX(-50%); min-width: 150px; text-align: center; opacity: 0; pointer-events: none; transition: opacity .2s ease; text-shadow: 0 6px 25px black; }
        .life-star:hover .star-label, .life-star.active .star-label { opacity: 1; }
        .star-label strong, .star-label small { display: block; }
        .star-label strong { font-size: .75rem; }
        .star-label small { color: rgba(255,255,255,.62); font-size: .62rem; }
        .lens-bar { position: absolute; z-index: 22; left: 50%; bottom: 1rem; transform: translateX(-50%); width: min(980px, calc(100vw - 2rem)); display: grid; grid-template-columns: repeat(8, minmax(0,1fr)); gap: .35rem; border: 1px solid rgba(170,205,255,.12); border-radius: 28px; background: rgba(1,4,14,.44); backdrop-filter: blur(16px); padding: .45rem; opacity: .58; transition: opacity .25s ease, transform .25s ease; }
        .lens-bar:hover, .lens-bar:focus-within { opacity: 1; transform: translateX(-50%) translateY(-2px); }
        .lens-bar button, .control-dock button, .memory-bloom button, .side-sheet button, .mirror-layer button { border: 1px solid rgba(170,205,255,.18); border-radius: 999px; background: rgba(7,14,36,.62); color: white; padding: .56rem .72rem; font-size: .73rem; cursor: pointer; }
        .lens-bar button { border: 0; border-radius: 20px; text-align: left; background: transparent; color: rgba(255,255,255,.62); }
        .lens-bar button.active, .lens-bar button:hover { background: rgba(255,255,255,.075); color: white; }
        .lens-bar strong, .lens-bar small { display: block; }
        .lens-bar small { opacity: .62; font-size: .58rem; }
        .control-dock { position: absolute; z-index: 23; left: 50%; bottom: 6.25rem; transform: translateX(-50%) translateY(6px); display: flex; gap: .35rem; flex-wrap: wrap; justify-content: center; max-width: min(900px, calc(100vw - 2rem)); border: 1px solid rgba(170,205,255,.1); border-radius: 999px; padding: .4rem; background: rgba(1,4,14,.4); backdrop-filter: blur(16px); opacity: .34; transition: opacity .25s ease, transform .25s ease; }
        .control-dock:hover, .control-dock:focus-within { opacity: .95; transform: translateX(-50%) translateY(0); }
        .memory-bloom { position: absolute; z-index: 40; inset: 0; display: grid; place-items: center; background: radial-gradient(circle at 50% 48%, rgba(255,255,255,.05), rgba(0,0,0,.82)); padding: 2rem; }
        .bloom-orb { width: clamp(130px,18vw,220px); height: clamp(130px,18vw,220px); border-radius: 999px; background: radial-gradient(circle at 34% 28%, #fff, hsl(var(--hue) 90% 76%) 42%, hsl(var(--hue) 90% 52% / .18)); box-shadow: 0 0 34px white, 0 0 130px hsl(var(--hue) 90% 68% / .42); animation: bloomBreath 4s ease-in-out infinite; }
        .memory-bloom article { position: absolute; bottom: 4rem; width: min(660px, calc(100vw - 2rem)); text-align: center; border: 1px solid rgba(205,226,255,.18); border-radius: 34px; padding: 1.35rem; background: linear-gradient(180deg, rgba(7,12,30,.78), rgba(1,4,14,.62)); backdrop-filter: blur(20px); }
        .memory-bloom h2, .side-sheet h2, .mirror-layer h2 { margin: .35rem 0 .55rem; font-size: clamp(1.6rem,4vw,3.7rem); line-height: .96; letter-spacing: -.05em; }
        .source-row, .bloom-actions { display: flex; gap: .45rem; justify-content: center; flex-wrap: wrap; margin-top: .9rem; }
        .source-row small, .side-sheet small, .mirror-layer small { color: rgba(255,255,255,.55); }
        .why-box { margin: 1rem auto 0; max-width: 560px; border: 1px solid rgba(255,255,255,.13); border-radius: 20px; padding: .85rem; background: rgba(255,255,255,.055); text-align: left; }
        .why-box p { margin: .35rem 0 0; color: rgba(255,255,255,.7); line-height: 1.5; }
        .side-sheet { position: absolute; z-index: 38; right: 1rem; top: 6rem; bottom: 1rem; width: min(410px, calc(100vw - 2rem)); border: 1px solid rgba(205,226,255,.16); border-radius: 28px; background: rgba(1,4,14,.74); backdrop-filter: blur(20px); padding: 1rem; overflow: auto; box-shadow: 0 30px 100px rgba(0,0,0,.5); }
        .metric-row, .replay-step, .mirror-grid div { border: 1px solid rgba(255,255,255,.1); border-radius: 18px; padding: .75rem; margin-top: .65rem; background: rgba(255,255,255,.05); }
        .metric-row span, .metric-row b, .metric-row small, .replay-step span, .replay-step small { display: block; }
        .replay-step b { display: inline-grid; place-items: center; width: 1.65rem; height: 1.65rem; border-radius: 999px; background: rgba(255,255,255,.12); margin-bottom: .4rem; }
        .mirror-layer { position: absolute; z-index: 39; inset: 3rem; display: grid; place-items: center; align-content: center; text-align: center; border: 1px solid rgba(255,255,255,.13); border-radius: 42px; background: radial-gradient(circle, rgba(255,255,255,.08), rgba(2,4,14,.88)); backdrop-filter: blur(20px); padding: 2rem; }
        .mirror-grid { margin: 1rem auto; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: .6rem; max-width: 900px; }
        .vertical { flex-direction: column; }
        @keyframes dustTwinkle { 0%,100% { opacity: calc(var(--a) * .54); transform: translate3d(-50%, -50%, var(--d)) scale(.82); } 50% { opacity: var(--a); transform: translate3d(-50%, -50%, var(--d)) scale(1.25); } }
        @keyframes nebulaDrift { from { transform: translate3d(-2%, -1%, 0) scale(.98); } to { transform: translate3d(2%, 1%, 0) scale(1.04); } }
        @keyframes starPulse { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.25); } }
        @keyframes bloomBreath { 0%,100% { transform: scale(.96); } 50% { transform: scale(1.04); } }
        @keyframes dash { to { stroke-dashoffset: -14; } }
        @media (max-width: 760px) { .life-map-header { top: 5.2rem; width: calc(100vw - 2rem); } .companion-panel { left: 1rem; right: 1rem; top: auto; bottom: 9.9rem; width: auto; } .galaxy-shell { inset: 8rem 1rem 15rem; } .control-dock { bottom: 6.7rem; border-radius: 24px; opacity: .78; } .lens-bar { grid-template-columns: repeat(2,minmax(0,1fr)); bottom: .5rem; border-radius: 22px; opacity: .82; } .side-sheet { left: 1rem; right: 1rem; width: auto; top: 7rem; } .mirror-layer { inset: 1rem; } .mirror-grid { grid-template-columns: 1fr; } .memory-bloom article { bottom: 1rem; } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition-duration: .01ms !important; } }
      `}</style>
    </main>
  );
}
