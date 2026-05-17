"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type MemoryCategory = "becoming" | "threshold" | "recovery" | "relationship" | "dream" | "mirror";
type PrivacyState = "private" | "local" | "shareable";

interface MemoryStar {
  id: string;
  title: string;
  subtitle: string;
  category: MemoryCategory;
  x: number;
  y: number;
  z: number;
  magnitude: number;
  confidence: number;
  privacy: PrivacyState;
  narratorText: string;
  dateLabel: string;
  signalCount: number;
  threadIds: string[];
  memoryImageUrl?: string;
  symbolicImageUrl?: string;
}

const cinematicEase = [0.16, 1, 0.3, 1] as const;

const PALETTE: Record<MemoryCategory, { label: string; core: string; halo: string; nebula: string; border: string }> = {
  becoming: { label: "Becoming", core: "#9BE7FF", halo: "rgba(155,231,255,.58)", nebula: "rgba(90,210,255,.13)", border: "rgba(155,231,255,.38)" },
  threshold: { label: "Threshold", core: "#C7A0FF", halo: "rgba(199,160,255,.58)", nebula: "rgba(140,90,255,.14)", border: "rgba(199,160,255,.38)" },
  recovery: { label: "Recovery", core: "#B8FFD8", halo: "rgba(184,255,216,.56)", nebula: "rgba(80,255,170,.13)", border: "rgba(184,255,216,.36)" },
  relationship: { label: "Relationships", core: "#FFB7D6", halo: "rgba(255,183,214,.53)", nebula: "rgba(255,110,180,.13)", border: "rgba(255,183,214,.34)" },
  dream: { label: "Dream Field", core: "#FFE58A", halo: "rgba(255,229,138,.52)", nebula: "rgba(255,202,70,.13)", border: "rgba(255,229,138,.34)" },
  mirror: { label: "Mirror", core: "#E8F2FF", halo: "rgba(232,242,255,.55)", nebula: "rgba(190,220,255,.11)", border: "rgba(232,242,255,.32)" },
};

const MEMORY_STARS: MemoryStar[] = [
  { id: "blue-fog-memory", title: "Blue Fog Memory", subtitle: "quiet grief marker", category: "threshold", x: -310, y: -18, z: 0.44, magnitude: 1.18, confidence: 72, privacy: "private", narratorText: "A soft weather system formed around this moment. URAI marked it as grief, but not collapse.", dateLabel: "Winter thread · inferred", signalCount: 4, threadIds: ["winter-threshold", "soft-recovery"] },
  { id: "protected-hour", title: "Protected Hour", subtitle: "became returned", category: "becoming", x: 76, y: -94, z: 0.8, magnitude: 1.34, confidence: 70, privacy: "local", narratorText: "A protected hour became a small doorway back into clarity.", dateLabel: "Today · focus signal", signalCount: 1, threadIds: ["clarity-thread", "winter-threshold"] },
  { id: "morning-return", title: "Morning Return", subtitle: "body rhythm stabilized", category: "recovery", x: 218, y: -62, z: 0.68, magnitude: 1.08, confidence: 81, privacy: "local", narratorText: "Your rhythm steadied here; URAI saw recovery as an ordinary morning, not a performance.", dateLabel: "Recent week", signalCount: 5, threadIds: ["soft-recovery"] },
  { id: "relationship-spark", title: "Warm Thread", subtitle: "contact felt safe", category: "relationship", x: 308, y: 30, z: 0.58, magnitude: 0.92, confidence: 64, privacy: "private", narratorText: "A familiar signal softened the field. The relationship thread brightened without demanding action.", dateLabel: "Social echo", signalCount: 3, threadIds: ["social-orbit"] },
  { id: "dream-door", title: "Dream Door", subtitle: "symbolic image surfaced", category: "dream", x: -92, y: 104, z: 0.52, magnitude: 0.88, confidence: 58, privacy: "private", narratorText: "A dream symbol repeated. URAI preserved it as image-language, not a conclusion.", dateLabel: "Night field", signalCount: 2, threadIds: ["dream-field"] },
  { id: "mirror-line", title: "Mirror Line", subtitle: "pattern reflected back", category: "mirror", x: 4, y: -12, z: 0.95, magnitude: 1.42, confidence: 88, privacy: "local", narratorText: "This is a mirror moment: not a diagnosis, just a pattern with enough signal to deserve tenderness.", dateLabel: "Pattern index", signalCount: 7, threadIds: ["clarity-thread", "social-orbit", "dream-field"] },
  { id: "golden-pause", title: "Golden Pause", subtitle: "nervous system exhaled", category: "recovery", x: 176, y: 116, z: 0.5, magnitude: 0.82, confidence: 76, privacy: "shareable", narratorText: "The field became less sharp. URAI marked a small restoration bloom.", dateLabel: "Recovery arc", signalCount: 4, threadIds: ["soft-recovery"] },
  { id: "threshold-flare", title: "Threshold Flare", subtitle: "transition pressure rose", category: "threshold", x: -42, y: -142, z: 0.72, magnitude: 1.05, confidence: 69, privacy: "private", narratorText: "A threshold appeared as pressure, not failure. URAI kept the context around it.", dateLabel: "Life shift", signalCount: 6, threadIds: ["winter-threshold"] },
  { id: "soft-laugh", title: "Soft Laugh", subtitle: "relational weather cleared", category: "relationship", x: 382, y: -82, z: 0.4, magnitude: 0.72, confidence: 61, privacy: "shareable", narratorText: "A small laugh changed the social weather more than the transcript alone could show.", dateLabel: "Ambient social", signalCount: 2, threadIds: ["social-orbit"] },
  { id: "future-self", title: "Future Self", subtitle: "becoming thread strengthened", category: "becoming", x: -178, y: 86, z: 0.62, magnitude: 1.0, confidence: 79, privacy: "local", narratorText: "A becoming thread strengthened. URAI marked this as direction without forcing a plan.", dateLabel: "Purpose signal", signalCount: 5, threadIds: ["clarity-thread"] },
];

const THREADS = [
  ["blue-fog-memory", "threshold-flare", "mirror-line", "protected-hour"],
  ["blue-fog-memory", "dream-door", "golden-pause", "morning-return"],
  ["mirror-line", "relationship-spark", "soft-laugh"],
  ["future-self", "mirror-line", "protected-hour", "morning-return"],
];

function useReducedMotionSafe() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function fallbackStyle(star: MemoryStar) {
  const palette = PALETTE[star.category];
  return {
    background:
      `radial-gradient(circle at 38% 32%, rgba(255,255,255,.72), transparent 7%), ` +
      `radial-gradient(circle at 50% 48%, ${palette.halo}, transparent 32%), ` +
      `radial-gradient(circle at 50% 80%, ${palette.nebula}, transparent 44%), ` +
      `linear-gradient(145deg, rgba(3,10,25,.88), rgba(8,20,45,.62))`,
  };
}

function GalaxyParticles() {
  const reduced = useReducedMotionSafe();
  const stars = useMemo(() => {
    const count = reduced ? 70 : 180;
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      x: (index * 83) % 100,
      y: (index * 47) % 100,
      size: 0.7 + ((index * 13) % 26) / 15,
      opacity: 0.14 + ((index * 17) % 72) / 100,
      delay: ((index * 7) % 50) / 10,
    }));
  }, [reduced]);

  return (
    <div className="urai-galaxy-particles" aria-hidden>
      {stars.map((star) => <span key={star.id} style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, opacity: star.opacity, animationDelay: `${star.delay}s` }} />)}
    </div>
  );
}

export function LifeMapPage() {
  const [activeCategory, setActiveCategory] = useState<MemoryCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>("blue-fog-memory");
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState<"default" | "replay" | "mirror">("default");
  const drag = useRef({ x: 0, y: 0, cameraX: 0, cameraY: 0 });
  const selected = MEMORY_STARS.find((star) => star.id === selectedId) ?? null;

  const relatedIds = useMemo(() => {
    if (!selected) return new Set<string>();
    const ids = new Set<string>([selected.id]);
    selected.threadIds.forEach((threadId) => MEMORY_STARS.filter((star) => star.threadIds.includes(threadId)).forEach((star) => ids.add(star.id)));
    return ids;
  }, [selected]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
      if (event.key.toLowerCase() === "r") setCamera({ x: 0, y: 0, scale: 1 });
      if (event.key === "+" || event.key === "=") setCamera((c) => ({ ...c, scale: clamp(c.scale + 0.15, 0.62, 2.85) }));
      if (event.key === "-") setCamera((c) => ({ ...c, scale: clamp(c.scale - 0.15, 0.62, 2.85) }));
      if (event.key === "ArrowLeft") setCamera((c) => ({ ...c, x: c.x + 36 }));
      if (event.key === "ArrowRight") setCamera((c) => ({ ...c, x: c.x - 36 }));
      if (event.key === "ArrowUp") setCamera((c) => ({ ...c, y: c.y + 36 }));
      if (event.key === "ArrowDown") setCamera((c) => ({ ...c, y: c.y - 36 }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const zoom = (delta: number) => setCamera((c) => ({ ...c, scale: clamp(c.scale - delta * 0.0012, 0.62, 2.85) }));
  const recenter = () => setCamera({ x: 0, y: 0, scale: 1 });
  const replay = () => {
    setMode("replay");
    let i = 0;
    const sequence = ["blue-fog-memory", "threshold-flare", "mirror-line", "protected-hour", "morning-return"];
    const timer = window.setInterval(() => {
      const id = sequence[i % sequence.length];
      const star = MEMORY_STARS.find((item) => item.id === id);
      if (star) {
        setSelectedId(star.id);
        setCamera({ x: -star.x * 0.22, y: -star.y * 0.22, scale: 1.28 });
      }
      i += 1;
      if (i > sequence.length) {
        window.clearInterval(timer);
        setMode("default");
      }
    }, 960);
  };

  return (
    <main className={`urai-screen urai-life-map-screen ${mode === "mirror" ? "is-mirror-mode" : ""} ${selected ? "has-selected-star" : ""}`}>
      <GalaxyParticles />
      <div className="urai-galaxy-bg" aria-hidden><div className="urai-galaxy-core" /><div className="urai-galaxy-band" /></div>
      <header className="urai-life-title"><span>URAI LIFE MAP</span><strong>Memory Galaxy</strong><em>{MEMORY_STARS.length} Memory Stars · {THREADS.length} Timeline Constellations · {mode}</em></header>
      <section
        className="urai-galaxy-viewport"
        onWheel={(event) => { event.preventDefault(); zoom(event.deltaY); }}
        onPointerDown={(event) => { setDragging(true); drag.current = { x: event.clientX, y: event.clientY, cameraX: camera.x, cameraY: camera.y }; }}
        onPointerMove={(event) => { if (!dragging) return; setCamera((c) => ({ ...c, x: drag.current.cameraX + event.clientX - drag.current.x, y: drag.current.cameraY + event.clientY - drag.current.y })); }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <motion.div className="urai-galaxy-camera" animate={{ x: camera.x, y: camera.y, scale: camera.scale }} transition={{ duration: dragging ? 0 : 0.42, ease: cinematicEase }}>
          <div className="urai-galaxy-world">
            <div className="urai-nebula-zones" aria-hidden>
              {Object.entries(PALETTE).map(([category, palette], index) => (
                <div key={category} className="urai-galaxy-nebula-zone" style={{ left: `${18 + index * 13}%`, top: `${30 + (index % 3) * 16}%`, width: `${42 + (index % 2) * 18}%`, height: `${22 + (index % 3) * 5}%`, transform: `translate(-50%, -50%) rotate(${index % 2 ? 14 : -14}deg)`, background: `radial-gradient(ellipse at center, ${palette.nebula}, transparent 68%)`, opacity: activeCategory === "all" || activeCategory === category ? 1 : 0.24 }} />
              ))}
            </div>
            <svg className="urai-orbit-rings" viewBox="-600 -360 1200 720" aria-hidden>
              {[1, 2, 3, 4].map((ring) => <ellipse key={ring} cx="0" cy="0" rx={220 + ring * 86} ry={70 + ring * 32} transform={`rotate(${ring % 2 ? -14 : 16})`} fill="none" stroke="rgba(155,231,255,.18)" strokeWidth={ring === 3 ? 1.4 : 0.9} strokeDasharray={ring % 2 ? "12 18" : ""} />)}
              {mode === "mirror" && <line x1="0" x2="0" y1="-310" y2="310" stroke="rgba(232,242,255,.2)" />}
            </svg>
            <svg className="urai-thread-layer" viewBox="-600 -360 1200 720" aria-hidden>
              {THREADS.map((thread, index) => thread.slice(1).map((id, pointIndex) => {
                const from = MEMORY_STARS.find((star) => star.id === thread[pointIndex]);
                const to = MEMORY_STARS.find((star) => star.id === id);
                if (!from || !to) return null;
                const active = selected ? relatedIds.has(from.id) && relatedIds.has(to.id) : true;
                return <line key={`${index}-${id}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={active ? "rgba(155,231,255,.48)" : "rgba(155,231,255,.12)"} strokeWidth={active ? 1.2 : 0.6} />;
              }))}
            </svg>
            <div className="urai-memory-star-layer">
              {MEMORY_STARS.map((star) => {
                const palette = PALETTE[star.category];
                const selectedStar = star.id === selectedId;
                const filteredOut = activeCategory !== "all" && star.category !== activeCategory;
                return (
                  <motion.button
                    key={star.id}
                    className={`urai-memory-star ${selectedStar ? "is-selected" : ""} ${selected && !relatedIds.has(star.id) ? "is-dimmed" : ""} ${filteredOut ? "is-filtered-out" : ""}`}
                    style={{ left: `calc(50% + ${star.x}px)`, top: `calc(50% + ${star.y}px)`, zIndex: Math.round(20 + star.z * 20) }}
                    onClick={(event) => { event.stopPropagation(); setSelectedId(star.id); }}
                    whileHover={{ scale: 1.18 }}
                    animate={{ scale: selectedStar ? 1.18 : 1, opacity: filteredOut ? 0.18 : 1 }}
                    transition={{ duration: 0.22 }}
                    aria-label={`Open ${star.title}`}
                  >
                    <span className="urai-star-halo" style={{ background: `radial-gradient(circle, ${palette.halo}, transparent 70%)` }} />
                    <span className="urai-star-core" style={{ background: palette.core, boxShadow: `0 0 ${18 + star.magnitude * 10}px ${palette.halo}` }} />
                    <span className="urai-star-label"><strong>{star.title}</strong><em>{star.subtitle}</em></span>
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence>
              {selected && (
                <motion.div className="urai-selected-star-focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <button className="urai-focus-scrim" onClick={() => setSelectedId(null)} aria-label="Close memory focus" />
                  <motion.div className="urai-memory-portal-anchor" style={{ left: `calc(50% + ${selected.x}px)`, top: `calc(50% + ${selected.y}px)` }} initial={{ scale: 0.18, opacity: 0, x: "-50%", y: "-50%" }} animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }} exit={{ scale: 0.28, opacity: 0, x: "-50%", y: "-50%" }} transition={{ duration: 0.52, ease: cinematicEase }}>
                    <div className="urai-portal-thread-tether" />
                    <div className="urai-memory-portal" style={{ borderColor: PALETTE[selected.category].border }}>
                      <div className="urai-portal-image" style={selected.memoryImageUrl || selected.symbolicImageUrl ? { backgroundImage: `url(${selected.memoryImageUrl ?? selected.symbolicImageUrl})` } : fallbackStyle(selected)} />
                      <div className="urai-portal-ring" />
                      <div className="urai-confidence-ring" style={{ background: `conic-gradient(${PALETTE[selected.category].core} ${selected.confidence * 3.6}deg, rgba(255,255,255,.08) 0deg)` }} />
                    </div>
                  </motion.div>
                  <motion.aside className="urai-memory-detail glass-panel" initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.34, delay: 0.2, ease: cinematicEase }}>
                    <div className="urai-detail-kicker">{PALETTE[selected.category].label} · {selected.dateLabel}</div>
                    <h2>{selected.title}</h2>
                    <p>{selected.narratorText}</p>
                    <div className="urai-detail-meta"><span>Confidence {selected.confidence}%</span><span>{selected.signalCount} passive signals</span><span>{selected.privacy}</span></div>
                    {mode === "mirror" && <div className="urai-mirror-note">What this reflects: this memory is acting as a pattern mirror, not a diagnosis.</div>}
                    <div className="urai-detail-actions"><button onClick={replay}>Replay</button><button onClick={() => setMode(mode === "mirror" ? "default" : "mirror")}>Mirror</button><button>Recount</button><button>Create Ritual</button><button>Private</button></div>
                  </motion.aside>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>
      <aside className="urai-companion-card glass-panel"><span>COMPANION</span><p>{selected ? `This memory carries ${PALETTE[selected.category].label.toLowerCase()} weight, so URAI rendered it softly.` : "Narration ready."}</p><em>Narration ready.</em></aside>
      <div className="urai-galaxy-actions glass-panel"><button onClick={() => setSelectedId(null)}>Hide thread</button><button onClick={replay}>Replay</button><button>Create scroll</button><button onClick={() => setMode(mode === "mirror" ? "default" : "mirror")}>Mirror</button><button onClick={recenter}>Recenter</button></div>
      <nav className="urai-category-dock glass-panel" aria-label="Memory filters"><button className={activeCategory === "all" ? "is-active" : ""} onClick={() => setActiveCategory("all")}>All</button>{(Object.keys(PALETTE) as MemoryCategory[]).map((category) => <button key={category} className={activeCategory === category ? "is-active" : ""} onClick={() => setActiveCategory(category)}>{PALETTE[category].label}</button>)}</nav>
      <div className="urai-zoom-minimap glass-panel"><span>Zoom</span><strong>{Math.round(camera.scale * 100)}%</strong><em>x {Math.round(camera.x)} · y {Math.round(camera.y)}</em></div>
    </main>
  );
}
