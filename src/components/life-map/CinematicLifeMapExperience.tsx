"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "galaxy" | "focus" | "returning";

type Star = {
  id: string;
  title: string;
  archetype: string;
  tone: string;
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  reflection: string;
};

const stars: Star[] = [
  { id: "blue-fog", title: "Blue Fog Memory", archetype: "The Witness", tone: "quiet grief", x: 50, y: 45, z: 1, size: 1.4, color: "#c8f4ff", reflection: "URAI rendered this softly: not as a metric, but as a held atmosphere." },
  { id: "threshold", title: "Threshold Before Clarity", archetype: "Threshold Keeper", tone: "crossing", x: 34, y: 59, z: .72, size: .86, color: "#d7c8ff", reflection: "A crossing point where pressure turns into direction." },
  { id: "winter", title: "Winter Becoming", archetype: "Witness", tone: "quiet grief", x: 22, y: 32, z: .58, size: .74, color: "#dff7ff", reflection: "A season of stillness, protected inside a pale blue field." },
  { id: "social-weather", title: "Social Weather", archetype: "Relational Field", tone: "trust", x: 62, y: 31, z: .78, size: .9, color: "#f4d48c", reflection: "Relationship gravity gathers as warm orbit lines." },
  { id: "dream", title: "Dream Field", archetype: "Weather Seer", tone: "symbolic wonder", x: 72, y: 52, z: .66, size: .78, color: "#9df7ff", reflection: "Signals bend into possibility before they become language." },
  { id: "legacy", title: "Legacy Arc", archetype: "Ancestor Thread", tone: "gold continuity", x: 82, y: 38, z: .88, size: .82, color: "#ffe5a8", reflection: "The map shows what endured, softened, and became wisdom." },
  { id: "future", title: "Future Forecast", archetype: "Weather Seer", tone: "emerging clarity", x: 42, y: 23, z: .52, size: .7, color: "#a6f7ff", reflection: "A soft forecast, not a command: the next weather of becoming." },
  { id: "recovery", title: "Recovery Bloom", archetype: "Ground Signal", tone: "body returning", x: 58, y: 68, z: .62, size: .92, color: "#7fffd8", reflection: "Recovery appears as a field rebuilding under the sky." },
];

const paths = [
  ["winter", "blue-fog"],
  ["blue-fog", "threshold"],
  ["threshold", "recovery"],
  ["blue-fog", "social-weather"],
  ["social-weather", "legacy"],
  ["future", "social-weather"],
  ["dream", "legacy"],
  ["recovery", "dream"],
];

export default function CinematicLifeMapExperience() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("galaxy");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ x: 0, y: 0, cx: 0, cy: 0 });
  const selected = useMemo(() => stars.find((star) => star.id === selectedId) ?? null, [selectedId]);

  function returnHome() {
    if (mode === "returning") return;
    setMode("returning");
    window.setTimeout(() => router.push("/"), 620);
  }

  function openStar(star: Star) {
    setSelectedId(star.id);
    setMode("focus");
    setCamera({ x: (50 - star.x) * 8, y: (46 - star.y) * 6, scale: 1.55 });
    window.history.pushState({ urai: "star", id: star.id }, "", `#${star.id}`);
  }

  function closeFocus() {
    setSelectedId(null);
    setMode("galaxy");
    setCamera({ x: 0, y: 0, scale: 1 });
    window.history.replaceState({ urai: "galaxy" }, "", window.location.pathname);
  }

  function unwind() {
    if (mode === "focus") {
      closeFocus();
      return;
    }
    returnHome();
  }

  useEffect(() => {
    window.history.replaceState({ urai: "galaxy" }, "", window.location.pathname);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        unwind();
      }
    };
    const onPop = () => unwind();
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("popstate", onPop);
    };
  });

  return (
    <main className={`cinematic-life-map mode-${mode}`} aria-label="URAI Memory Galaxy">
      <div className="cinematic-sky" aria-hidden />
      <div className="cinematic-dust" aria-hidden>
        {Array.from({ length: 90 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}
      </div>

      <button type="button" className="cinematic-home-button" onClick={returnHome} aria-label="Return to Inner Sky Shrine">
        <span>↶</span><strong>Home</strong>
      </button>

      <section
        className="cinematic-galaxy-field"
        onPointerDown={(event) => {
          if (mode !== "galaxy") return;
          setIsDragging(true);
          dragRef.current = { x: event.clientX, y: event.clientY, cx: camera.x, cy: camera.y };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!isDragging || mode !== "galaxy") return;
          setCamera((current) => ({ ...current, x: dragRef.current.cx + (event.clientX - dragRef.current.x) * .55, y: dragRef.current.cy + (event.clientY - dragRef.current.y) * .55 }));
        }}
        onPointerUp={() => setIsDragging(false)}
        onPointerCancel={() => setIsDragging(false)}
        onWheel={(event) => {
          event.preventDefault();
          setCamera((current) => ({ ...current, scale: Math.max(.72, Math.min(1.9, current.scale + (event.deltaY > 0 ? -.08 : .08))) }));
        }}
      >
        <div className="cinematic-galaxy-camera" style={{ transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})` }}>
          <svg className="cinematic-constellation" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {paths.map(([from, to]) => {
              const a = stars.find((star) => star.id === from)!;
              const b = stars.find((star) => star.id === to)!;
              return <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
            })}
          </svg>
          <div className="cinematic-nebula nebula-a" />
          <div className="cinematic-nebula nebula-b" />
          <div className="cinematic-nebula nebula-c" />
          {stars.map((star) => (
            <button
              key={star.id}
              type="button"
              className={`cinematic-star ${selectedId === star.id ? "selected" : ""}`}
              style={{ left: `${star.x}%`, top: `${star.y}%`, "--star-color": star.color, "--star-size": star.size, "--star-z": star.z } as React.CSSProperties}
              onClick={(event) => { event.stopPropagation(); openStar(star); }}
              aria-label={`Open ${star.title}`}
            >
              <span className="cinematic-star-glow" />
              <span className="cinematic-star-core" />
              <span className="cinematic-star-label"><strong>{star.title}</strong><em>{star.tone}</em></span>
            </button>
          ))}
        </div>
      </section>

      <header className="cinematic-title">
        <span>URAI SPATIAL LIFE MAP</span>
        <h1>{selected ? selected.title : "Memory Galaxy"}</h1>
        <p>{mode === "focus" ? "Focused memory bloom · Esc returns to galaxy" : "Drag space · scroll to zoom · click a star · Esc returns home"}</p>
      </header>

      <aside className="cinematic-witness">
        <i style={{ background: selected?.color ?? "#c8f4ff" }} />
        <span>{selected?.archetype ?? "Memory · The Witness"}</span>
        <h2>{selected?.title ?? "Blue Fog Memory"}</h2>
        <strong>{selected?.tone ?? "quiet grief"}</strong>
        <p>{selected?.reflection ?? "This memory carried weight, so URAI rendered it softly."}</p>
      </aside>

      <nav className="cinematic-dock" aria-label="Life Map actions">
        <button type="button" onClick={() => setCamera((c) => ({ ...c, scale: Math.max(.72, c.scale - .12) }))}>Zoom out</button>
        <button type="button" onClick={() => { setCamera({ x: 0, y: 0, scale: 1 }); setSelectedId(null); setMode("galaxy"); }}>Full galaxy</button>
        <button type="button" onClick={() => setCamera((c) => ({ ...c, scale: Math.min(1.9, c.scale + .12) }))}>Zoom in</button>
        <button type="button" onClick={selected ? closeFocus : returnHome}>{selected ? "Close bloom" : "Unwind home"}</button>
      </nav>

      {selected && (
        <section className="cinematic-focus-card" role="dialog" aria-modal="true" aria-label={`${selected.title} focus`}>
          <button type="button" onClick={closeFocus} aria-label="Close memory focus">×</button>
          <div className="cinematic-focus-orb" style={{ background: selected.color, boxShadow: `0 0 130px ${selected.color}` }} />
          <span>{selected.archetype}</span>
          <h2>{selected.title}</h2>
          <p>{selected.reflection}</p>
        </section>
      )}

      {mode === "returning" && (
        <div className="cinematic-return" aria-live="assertive">
          <div />
          <p>Returning to the Inner Sky Shrine</p>
        </div>
      )}
    </main>
  );
}
