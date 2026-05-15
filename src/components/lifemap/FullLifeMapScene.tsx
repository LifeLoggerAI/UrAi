'use client';

import Link from 'next/link';
import { useCallback, useMemo, useState, type CSSProperties } from 'react';
import { createWeeklyScrollDraft, getBloomForStar, useFullLifeMapData } from './useFullLifeMapData';
import type { LifeMapChapterId, LifeMapConstellation, LifeMapTone, MemoryStar, ScrollExport } from './lifeMapTypes';

type Mode = 'galaxy' | 'focus' | 'replay' | 'relationship' | 'ritual' | 'scroll' | 'mirror' | 'privacy';
type Lens = 'all' | LifeMapChapterId;

type StarStyle = CSSProperties & {
  '--x': string;
  '--y': string;
  '--z': string;
  '--size': string;
  '--hue': string;
  '--aura': string;
  '--pulse': string;
  '--alpha': string;
};

type OverlayStyle = CSSProperties & {
  '--overlay-x': string;
  '--overlay-y': string;
  '--overlay-color': string;
  '--overlay-alpha': string;
};

const hueByTone: Record<LifeMapTone, string> = {
  calm: '205deg',
  clarity: '188deg',
  joy: '44deg',
  grief: '218deg',
  stress: '18deg',
  recovery: '144deg',
  dream: '263deg',
  shadow: '285deg',
  threshold: '296deg',
  rebirth: '0deg',
  connection: '326deg',
  focus: '202deg',
};

const chapterCopy: Record<LifeMapChapterId, string> = {
  becoming: 'Growth signals, focus returns, and small future-facing memory lights.',
  threshold: 'Crossing points where pressure became visible enough to name.',
  recovery: 'Recovery blooms, sleep shifts, grounding rituals, and return arcs.',
  relationships: 'Relationship orbits, silence trails, repair threads, and social warmth.',
  'dream-field': 'Symbolic echoes, dream signals, and recurring inner imagery.',
  shadow: 'Hidden strain, digital friction, bedtime loops, and protective uncertainty.',
  mirror: 'Long-term identity synthesis and Mirror of Becoming signals.',
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function toneHue(tone: LifeMapTone) {
  return hueByTone[tone] ?? '210deg';
}

function activeRelatedIds(star: MemoryStar | null, constellations: LifeMapConstellation[]) {
  if (!star) return new Set<string>();
  const ids = new Set<string>([star.id]);
  constellations
    .filter((constellation) => constellation.starIds.includes(star.id))
    .forEach((constellation) => constellation.starIds.forEach((id) => ids.add(id)));
  return ids;
}

function lineFor(starsById: Map<string, MemoryStar>, a: string, b: string) {
  const first = starsById.get(a);
  const second = starsById.get(b);
  if (!first || !second) return null;
  return { first, second };
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

  const stars = useMemo(() => {
    return data.stars.filter((star) => star.isVisible && (lens === 'all' || star.chapterId === lens));
  }, [data.stars, lens]);

  const starsById = useMemo(() => new Map(data.stars.map((star) => [star.id, star])), [data.stars]);
  const selectedStar = selectedStarId ? starsById.get(selectedStarId) ?? null : null;
  const selectedBloom = getBloomForStar(data, selectedStarId);
  const relatedIds = activeRelatedIds(selectedStar, data.constellations);
  const selectedConstellation = selectedConstellationId ? data.constellations.find((item) => item.id === selectedConstellationId) ?? null : null;
  const companionLine = selectedStar?.narratorLine ?? selectedConstellation?.narratorLine ?? data.companion.currentPrompt;

  const handleStar = useCallback((star: MemoryStar) => {
    setSelectedStarId(star.id);
    setSelectedConstellationId(star.constellationIds[0] ?? null);
    setShowWhy(false);
    setMode('focus');
    setZoom(1.18);
  }, []);

  const reset = useCallback(() => {
    setSelectedStarId(null);
    setSelectedConstellationId(null);
    setMode('galaxy');
    setShowWhy(false);
    setZoom(1);
  }, []);

  const createScroll = useCallback(() => {
    const draft = createWeeklyScrollDraft(data);
    setLocalScroll(draft);
    setMode('scroll');
  }, [data]);

  const replayStars = selectedConstellation?.starIds ?? selectedStar?.constellationIds.flatMap((id) => data.constellations.find((item) => item.id === id)?.starIds ?? []) ?? [];

  return (
    <main className={cx('life-map-v2', mode !== 'galaxy' && 'is-layered')} aria-label="URAI Life Map final implementation">
      <div className="sky-vignette" aria-hidden />
      <div className="emotional-core" aria-hidden />
      <div className="particle-dust" aria-hidden />

      {data.overlays.map((overlay, index) => {
        const style: OverlayStyle = {
          '--overlay-x': `${33 + index * 18}%`,
          '--overlay-y': `${38 + (index % 2) * 18}%`,
          '--overlay-color': toneHue(overlay.overlayType === 'shadow' ? 'shadow' : overlay.overlayType === 'threshold' ? 'threshold' : 'recovery'),
          '--overlay-alpha': String(Math.max(0.12, overlay.intensity * 0.34)),
        };
        return <div key={overlay.id} className={`symbolic-overlay ${overlay.overlayType}`} style={style} aria-hidden />;
      })}

      <header className="life-map-header">
        <p>URAI Life Map</p>
        <h1>{mode === 'focus' && selectedStar ? selectedStar.title : mode === 'mirror' ? 'Mirror of Becoming' : 'Emotional constellation of your life'}</h1>
        <span>{data.source === 'firestore' ? 'Live Firestore signals' : 'Demo passive-signal field'} · pinch, wheel, drag, tap, replay, export</span>
      </header>

      <Link href="/" className="home-link">Return home</Link>

      <section className="companion-panel" aria-live="polite">
        <strong>Companion</strong>
        <span>{companionLine}</span>
        <small>{data.loading ? 'Forming your Life Map…' : `${data.stars.length} memory stars · ${data.constellations.length} constellations`}</small>
      </section>

      <section className="galaxy-shell" style={{ transform: `scale(${zoom})` }}>
        <svg className={cx('constellation-svg', showThreads && 'visible')} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {data.constellations.map((constellation) => {
            const ids = constellation.starIds;
            return ids.slice(1).map((id, index) => {
              const pair = lineFor(starsById, ids[index], id);
              if (!pair) return null;
              const active = constellation.id === selectedConstellationId || (selectedStar && constellation.starIds.includes(selectedStar.id));
              return (
                <line
                  key={`${constellation.id}-${ids[index]}-${id}`}
                  className={cx('constellation-line', active && 'active', mode === 'replay' && replayStars.includes(id) && 'replay')}
                  x1={pair.first.position.x}
                  y1={pair.first.position.y}
                  x2={pair.second.position.x}
                  y2={pair.second.position.y}
                />
              );
            });
          })}
        </svg>

        {stars.map((star) => {
          const active = selectedStarId === star.id;
          const related = relatedIds.has(star.id);
          const style: StarStyle = {
            '--x': `${star.position.x}%`,
            '--y': `${star.position.y}%`,
            '--z': `${star.position.z}px`,
            '--size': `${star.visual.size}px`,
            '--hue': toneHue(star.emotionalTone),
            '--aura': `${star.visual.auraRadius}px`,
            '--pulse': `${1.6 + star.visual.pulseSpeed * 2.8}s`,
            '--alpha': String(Math.max(0.38, star.confidence)),
          };
          return (
            <button
              key={star.id}
              type="button"
              className={cx('life-star', active && 'active', selectedStar && !related && 'dim', star.starType === 'ritual_completion' && 'ritual', star.starType === 'threshold_moment' && 'threshold')}
              style={style}
              onClick={() => handleStar(star)}
              onDoubleClick={() => setMode('replay')}
              aria-label={`Open memory bloom for ${star.title}`}
            >
              <span className="star-glyph">{star.glyphType}</span>
              <span className="star-label"><strong>{star.title}</strong><small>{star.subtitle}</small></span>
            </button>
          );
        })}
      </section>

      <nav className="lens-bar" aria-label="Life Map lenses">
        <button className={lens === 'all' ? 'active' : ''} onClick={() => setLens('all')}>All life</button>
        {data.chapters.map((chapter) => (
          <button key={chapter.id} className={lens === chapter.id ? 'active' : ''} onClick={() => { setLens(chapter.id); setSelectedConstellationId(chapter.constellationIds[0] ?? null); }}>
            <strong>{chapter.title}</strong><small>{chapter.subtitle}</small>
          </button>
        ))}
      </nav>

      <div className="control-dock">
        <button onClick={() => setZoom((value) => Math.min(1.75, value + 0.12))}>Enter</button>
        <button onClick={() => setZoom((value) => Math.max(0.72, value - 0.12))}>Pull back</button>
        <button onClick={() => setShowThreads((value) => !value)}>{showThreads ? 'Hide threads' : 'Show threads'}</button>
        <button onClick={() => setMode('relationship')}>Relationships</button>
        <button onClick={() => setMode('ritual')}>Rituals</button>
        <button onClick={createScroll}>Weekly scroll</button>
        <button onClick={() => setMode('mirror')}>Mirror</button>
        <button onClick={reset}>Reset</button>
      </div>

      {selectedStar && mode === 'focus' && (
        <section className="memory-bloom" aria-live="polite">
          <div className="bloom-orb" style={{ '--hue': toneHue(selectedStar.emotionalTone) } as CSSProperties} aria-hidden />
          <article>
            <p>{selectedStar.chapterId} · {selectedStar.starType.replaceAll('_', ' ')}</p>
            <h2>{selectedBloom?.title ?? selectedStar.title}</h2>
            <span>{selectedBloom?.narratorReflection ?? selectedStar.narratorLine}</span>
            <div className="source-row">
              <small>Confidence {Math.round(selectedStar.confidence * 100)}%</small>
              <small>{selectedStar.privacyLevel}</small>
              <small>{selectedStar.sourceSignalIds.length} passive signals</small>
            </div>
            {showWhy && (
              <div className="why-box">
                <strong>Why am I seeing this?</strong>
                <p>{selectedBloom?.whyThis.explanation ?? 'URAI surfaced this because it crossed the Life Map importance threshold using passive, privacy-filtered signal categories.'}</p>
              </div>
            )}
            <div className="bloom-actions">
              <button onClick={() => setMode('replay')}>Replay thread</button>
              <button onClick={() => setShowWhy((value) => !value)}>Why this?</button>
              <button onClick={() => setMode('ritual')}>Ritual</button>
              <button onClick={() => setMode('privacy')}>Privacy</button>
              <button onClick={reset}>Return to galaxy</button>
            </div>
          </article>
        </section>
      )}

      {mode === 'replay' && (
        <section className="side-sheet replay-sheet">
          <p>Timeline playback</p>
          <h2>{selectedConstellation?.title ?? 'Selected memory thread'}</h2>
          {(selectedConstellation?.starIds ?? replayStars).map((id, index) => {
            const star = starsById.get(id);
            return star ? <div key={id} className="replay-step"><b>{index + 1}</b><span>{star.title}</span><small>{star.narratorLine}</small></div> : null;
          })}
          <button onClick={() => setMode(selectedStar ? 'focus' : 'galaxy')}>Close replay</button>
        </section>
      )}

      {mode === 'relationship' && (
        <section className="side-sheet">
          <p>Relationship constellation</p>
          <h2>Social orbit paths</h2>
          {data.socialGraph.map((node) => <div key={node.id} className="metric-row"><span>{node.alias}</span><b>{Math.round(node.orbitStrength * 100)}%</b><small>warmth {Math.round(node.warmthScore * 100)} · tension {Math.round(node.tensionScore * 100)}</small></div>)}
          <button onClick={() => setMode('galaxy')}>Return</button>
        </section>
      )}

      {mode === 'ritual' && (
        <section className="side-sheet">
          <p>Ritual layer</p>
          <h2>Unlocked rituals</h2>
          {data.rituals.map((ritual) => <div key={ritual.id} className="metric-row"><span>{ritual.title}</span><b>{ritual.status}</b><small>{ritual.narratorLine}</small></div>)}
          <button onClick={() => setMode(selectedStar ? 'focus' : 'galaxy')}>Return</button>
        </section>
      )}

      {mode === 'scroll' && (
        <section className="side-sheet scroll-sheet">
          <p>Weekly scroll export</p>
          <h2>{localScroll?.title ?? data.scrollExports[0]?.title ?? 'Weekly scroll'}</h2>
          <span>{localScroll?.generatedText ?? data.scrollExports[0]?.generatedText}</span>
          <small>Export stub: private HTML/JSON draft. PDF, image, and video come next.</small>
          <button onClick={() => setMode('galaxy')}>Return</button>
        </section>
      )}

      {mode === 'mirror' && (
        <section className="mirror-layer">
          <p>Mirror of Becoming</p>
          <h2>Your long arc is forming</h2>
          <span>{data.insights.find((insight) => insight.insightType === 'mirror')?.text ?? 'The Mirror gathers long-term constellations without turning them into fixed identity claims.'}</span>
          <div className="mirror-grid">
            {data.chapters.map((chapter) => <div key={chapter.id}><strong>{chapter.title}</strong><small>{chapter.narratorSummary}</small></div>)}
          </div>
          <button onClick={() => setMode('galaxy')}>Return to Life Map</button>
        </section>
      )}

      {mode === 'privacy' && (
        <section className="side-sheet privacy-sheet">
          <p>Privacy controls</p>
          <h2>{selectedStar?.title ?? 'Life Map privacy'}</h2>
          <span>Raw private content is not shown in the map. This layer should support hide, delete, mark inaccurate, disable signal type, export data, and private mode.</span>
          <div className="bloom-actions vertical">
            <button>Hide this star</button>
            <button>Mark inaccurate</button>
            <button>Disable similar signal type</button>
            <button>Delete source signals</button>
          </div>
          <button onClick={() => setMode(selectedStar ? 'focus' : 'galaxy')}>Return</button>
        </section>
      )}

      <style jsx>{`
        .life-map-v2 { min-height: 100dvh; position: relative; overflow: hidden; color: white; background: radial-gradient(circle at 50% 48%, #203d78 0%, #071026 48%, #01020a 100%); isolation: isolate; }
        .sky-vignette { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(circle at 50% 50%, transparent 0 30%, rgba(0,0,0,.18) 58%, rgba(0,0,0,.88) 100%), linear-gradient(180deg, rgba(10,20,55,.2), transparent 28%, rgba(0,0,0,.25)); }
        .emotional-core { position: absolute; z-index: 0; left: 50%; top: 50%; width: min(72vw, 880px); height: min(72vw, 880px); transform: translate(-50%,-50%); border-radius: 999px; background: radial-gradient(circle, rgba(255,255,255,.12), rgba(125,165,255,.2) 16%, rgba(68,87,190,.11) 48%, transparent 72%); filter: blur(16px); animation: coreBreath 8s ease-in-out infinite; }
        .particle-dust { position: absolute; inset: 0; z-index: 2; pointer-events: none; opacity: .55; background-image: radial-gradient(circle, rgba(255,255,255,.22) 0 1px, transparent 1.6px); background-size: 53px 53px; mask-image: radial-gradient(circle at 50% 50%, #000 0 42%, transparent 76%); animation: drift 30s linear infinite; }
        .symbolic-overlay { position: absolute; z-index: 2; left: var(--overlay-x); top: var(--overlay-y); width: min(35vw, 420px); height: min(24vw, 300px); transform: translate(-50%,-50%) rotate(-16deg); border-radius: 999px; background: radial-gradient(ellipse, hsl(var(--overlay-color) 88% 65% / var(--overlay-alpha)), transparent 68%); filter: blur(22px); opacity: .9; pointer-events: none; }
        .symbolic-overlay.shadow { mix-blend-mode: screen; opacity: .48; }
        .life-map-header { position: absolute; z-index: 8; top: 1rem; left: 50%; transform: translateX(-50%); text-align: center; pointer-events: none; text-shadow: 0 12px 40px rgba(0,0,0,.65); }
        .life-map-header p, .side-sheet p, .mirror-layer p, .memory-bloom p { margin: 0; text-transform: uppercase; letter-spacing: .34em; font-size: .58rem; color: rgba(255,255,255,.4); }
        .life-map-header h1 { margin: .2rem 0; font-size: clamp(1.05rem, 2.2vw, 1.75rem); }
        .life-map-header span { color: rgba(255,255,255,.52); font-size: .72rem; }
        .home-link { position: absolute; z-index: 20; left: 1rem; top: 1rem; border: 1px solid rgba(255,255,255,.24); border-radius: 999px; padding: .6rem .9rem; color: white; text-decoration: none; background: rgba(0,0,0,.36); backdrop-filter: blur(12px); }
        .companion-panel { position: absolute; z-index: 9; right: 1rem; top: 1rem; width: min(285px, calc(100vw - 2rem)); border: 1px solid rgba(170,205,255,.18); background: rgba(3,6,18,.46); backdrop-filter: blur(14px); border-radius: 18px; padding: .8rem; box-shadow: 0 20px 70px rgba(0,0,0,.25); }
        .companion-panel strong { display: block; font-size: .62rem; text-transform: uppercase; letter-spacing: .14em; color: rgba(255,255,255,.46); margin-bottom: .35rem; }
        .companion-panel span, .side-sheet span, .mirror-layer span, .memory-bloom article > span { display: block; color: rgba(255,255,255,.76); font-size: .82rem; line-height: 1.5; }
        .companion-panel small { display: block; margin-top: .45rem; color: rgba(255,255,255,.38); }
        .galaxy-shell { position: absolute; z-index: 4; inset: 6rem 3rem 8.8rem; transform-origin: 50% 50%; transition: transform .7s cubic-bezier(.19,1,.22,1), filter .45s ease, opacity .45s ease; }
        .is-layered .galaxy-shell { filter: saturate(.82) blur(.7px); opacity: .62; }
        .constellation-svg { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; transition: opacity .45s ease; overflow: visible; }
        .constellation-svg.visible { opacity: 1; }
        .constellation-line { stroke: rgba(190,220,255,.13); stroke-width: .09; stroke-linecap: round; filter: drop-shadow(0 0 5px rgba(160,210,255,.16)); transition: stroke .3s ease, stroke-width .3s ease, opacity .3s ease; }
        .constellation-line.active { stroke: rgba(230,248,255,.38); stroke-width: .14; }
        .constellation-line.replay { stroke-dasharray: 4 3; animation: dash 1.2s linear infinite; stroke: rgba(255,255,255,.72); }
        .life-star { position: absolute; left: var(--x); top: var(--y); width: var(--size); height: var(--size); transform: translate3d(-50%,-50%,var(--z)); border: 0; border-radius: 999px; cursor: pointer; background: radial-gradient(circle at 35% 28%, #fff 0 12%, #eef8ff 18%, hsl(var(--hue) 88% 72%) 48%, hsl(var(--hue) 90% 58% / .12) 100%); box-shadow: 0 0 12px rgba(255,255,255,.86), 0 0 var(--aura) hsl(var(--hue) 88% 68% / .46), 0 0 calc(var(--aura) * 2) hsl(var(--hue) 88% 62% / .18); opacity: var(--alpha); transition: transform .35s ease, opacity .35s ease, filter .35s ease; animation: starPulse var(--pulse) ease-in-out infinite; }
        .life-star::before { content: ''; position: absolute; inset: -18px; border-radius: inherit; background: radial-gradient(circle, hsl(var(--hue) 90% 72% / .22), transparent 66%); }
        .life-star.ritual::after, .life-star.threshold::after { content: ''; position: absolute; inset: -14px; border-radius: inherit; border: 1px solid hsl(var(--hue) 90% 82% / .28); transform: rotate(-16deg) scaleX(1.7); }
        .life-star:hover, .life-star.active { transform: translate3d(-50%,-50%,calc(var(--z) + 44px)) scale(1.24); opacity: 1; filter: brightness(1.2); z-index: 10; }
        .life-star.dim { opacity: .18; filter: blur(.5px) saturate(.5); }
        .star-glyph { display: none; }
        .star-label { position: absolute; left: 50%; top: calc(100% + .7rem); transform: translateX(-50%); min-width: 150px; text-align: center; opacity: 0; pointer-events: none; transition: opacity .2s ease; text-shadow: 0 6px 25px black; }
        .life-star:hover .star-label, .life-star.active .star-label { opacity: 1; }
        .star-label strong, .star-label small { display: block; }
        .star-label strong { font-size: .75rem; }
        .star-label small { color: rgba(255,255,255,.58); font-size: .62rem; }
        .lens-bar { position: absolute; z-index: 10; left: 50%; bottom: 1rem; transform: translateX(-50%); width: min(980px, calc(100vw - 2rem)); display: grid; grid-template-columns: repeat(8, minmax(0,1fr)); gap: .35rem; border: 1px solid rgba(170,205,255,.2); border-radius: 28px; background: rgba(3,6,18,.42); backdrop-filter: blur(14px); padding: .45rem; }
        .lens-bar button, .control-dock button, .memory-bloom button, .side-sheet button, .mirror-layer button { border: 1px solid rgba(170,205,255,.22); border-radius: 999px; background: rgba(12,19,44,.62); color: white; padding: .56rem .72rem; font-size: .73rem; cursor: pointer; }
        .lens-bar button { border: 0; border-radius: 20px; text-align: left; background: transparent; color: rgba(255,255,255,.62); }
        .lens-bar button.active, .lens-bar button:hover { background: rgba(255,255,255,.08); color: white; }
        .lens-bar strong, .lens-bar small { display: block; }
        .lens-bar small { opacity: .6; font-size: .58rem; }
        .control-dock { position: absolute; z-index: 11; left: 50%; bottom: 6.25rem; transform: translateX(-50%); display: flex; gap: .35rem; flex-wrap: wrap; justify-content: center; max-width: min(900px, calc(100vw - 2rem)); border: 1px solid rgba(170,205,255,.16); border-radius: 999px; padding: .4rem; background: rgba(3,6,18,.38); backdrop-filter: blur(14px); }
        .memory-bloom { position: absolute; z-index: 30; inset: 0; display: grid; place-items: center; background: radial-gradient(circle at 50% 48%, rgba(255,255,255,.06), rgba(0,0,0,.72)); padding: 2rem; }
        .bloom-orb { width: clamp(130px, 18vw, 220px); height: clamp(130px, 18vw, 220px); border-radius: 999px; background: radial-gradient(circle at 34% 28%, #fff, hsl(var(--hue) 90% 76%) 42%, hsl(var(--hue) 90% 52% / .18)); box-shadow: 0 0 34px white, 0 0 130px hsl(var(--hue) 90% 68% / .42); animation: bloomBreath 4s ease-in-out infinite; }
        .memory-bloom article { position: absolute; bottom: 4rem; width: min(660px, calc(100vw - 2rem)); text-align: center; border: 1px solid rgba(205,226,255,.22); border-radius: 34px; padding: 1.35rem; background: linear-gradient(180deg, rgba(10,16,38,.72), rgba(3,6,18,.52)); backdrop-filter: blur(18px); }
        .memory-bloom h2, .side-sheet h2, .mirror-layer h2 { margin: .35rem 0 .55rem; font-size: clamp(1.6rem, 4vw, 3.7rem); line-height: .96; letter-spacing: -.05em; }
        .source-row, .bloom-actions { display: flex; gap: .45rem; justify-content: center; flex-wrap: wrap; margin-top: .9rem; }
        .source-row small, .side-sheet small, .mirror-layer small { color: rgba(255,255,255,.52); }
        .why-box { margin: 1rem auto 0; max-width: 560px; border: 1px solid rgba(255,255,255,.14); border-radius: 20px; padding: .85rem; background: rgba(255,255,255,.06); text-align: left; }
        .why-box p { margin: .35rem 0 0; color: rgba(255,255,255,.68); line-height: 1.5; }
        .side-sheet { position: absolute; z-index: 28; right: 1rem; top: 6rem; bottom: 1rem; width: min(410px, calc(100vw - 2rem)); border: 1px solid rgba(205,226,255,.2); border-radius: 28px; background: rgba(3,6,18,.66); backdrop-filter: blur(18px); padding: 1rem; overflow: auto; box-shadow: 0 30px 100px rgba(0,0,0,.4); }
        .metric-row, .replay-step, .mirror-grid div { border: 1px solid rgba(255,255,255,.1); border-radius: 18px; padding: .75rem; margin-top: .65rem; background: rgba(255,255,255,.055); }
        .metric-row span, .metric-row b, .metric-row small, .replay-step span, .replay-step small { display: block; }
        .replay-step b { display: inline-grid; place-items: center; width: 1.65rem; height: 1.65rem; border-radius: 999px; background: rgba(255,255,255,.12); margin-bottom: .4rem; }
        .mirror-layer { position: absolute; z-index: 29; inset: 3rem; display: grid; place-items: center; align-content: center; text-align: center; border: 1px solid rgba(255,255,255,.14); border-radius: 42px; background: radial-gradient(circle, rgba(255,255,255,.09), rgba(4,6,18,.82)); backdrop-filter: blur(18px); padding: 2rem; }
        .mirror-grid { margin: 1rem auto; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .6rem; max-width: 900px; }
        .vertical { flex-direction: column; }
        @keyframes coreBreath { 0%,100% { transform: translate(-50%,-50%) scale(.96); opacity: .74; } 50% { transform: translate(-50%,-50%) scale(1.04); opacity: 1; } }
        @keyframes drift { from { transform: translate3d(0,0,0); } to { transform: translate3d(54px,54px,0); } }
        @keyframes starPulse { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.18); } }
        @keyframes bloomBreath { 0%,100% { transform: scale(.96); } 50% { transform: scale(1.04); } }
        @keyframes dash { to { stroke-dashoffset: -14; } }
        @media (max-width: 760px) { .life-map-header { top: 5.2rem; width: calc(100vw - 2rem); } .companion-panel { left: 1rem; right: 1rem; top: auto; bottom: 9.9rem; width: auto; } .galaxy-shell { inset: 8rem 1rem 15rem; } .control-dock { bottom: 6.7rem; border-radius: 24px; } .lens-bar { grid-template-columns: repeat(2, minmax(0,1fr)); bottom: .5rem; border-radius: 22px; } .side-sheet { left: 1rem; right: 1rem; width: auto; top: 7rem; } .mirror-layer { inset: 1rem; } .mirror-grid { grid-template-columns: 1fr; } .memory-bloom article { bottom: 1rem; } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition-duration: .01ms !important; } }
      `}</style>
    </main>
  );
}
