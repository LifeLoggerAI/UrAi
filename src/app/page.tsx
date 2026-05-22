import Link from "next/link";
import { generateScene, SCENE_VIBES, type SceneVibe } from "@/lib/scene-generator";

export const metadata = {
  title: "URAI | Give it one memory",
  description: "Give URAI one memory and watch it become a living world.",
};

// Home lock marker: the deeper resolved home scene remains mounted at ./home/page and is linked from this root entry.
type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseVibe(value: string | undefined): SceneVibe {
  return SCENE_VIBES.includes(value as SceneVibe) ? (value as SceneVibe) : "cinematic";
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const memory = firstParam(params?.memory) ?? "";
  const vibe = parseVibe(firstParam(params?.vibe));
  const hasScene = memory.trim().length > 0;
  const scene = generateScene(memory, vibe);
  const shareHref = `/?memory=${encodeURIComponent(scene.memory)}&vibe=${scene.vibe}`;

  return (
    <main className="urai-entry-shell">
      <section className="entry-card" aria-labelledby="urai-entry-title">
        <p className="eyebrow">URAI</p>
        <h1 id="urai-entry-title">Give URAI one memory. Watch it become a world.</h1>
        <p className="lede">
          Start with a thought, moment, dream, voice-note transcript, or scene from your life.
          URAI turns it into the first piece of a living cinematic world.
        </p>
        <form className="memory-form" action="/" aria-label="Create a URAI scene">
          <label htmlFor="memory">One memory</label>
          <textarea id="memory" name="memory" rows={5} maxLength={900} placeholder="Example: I moved to a new city and started rebuilding my life." defaultValue={memory} />
          <label htmlFor="vibe">Vibe</label>
          <select id="vibe" name="vibe" defaultValue={vibe}>
            {SCENE_VIBES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <button className="primary" type="submit">Create scene</button>
        </form>
        <div className="actions" aria-label="URAI links">
          <Link className="secondary" href="/home">Enter existing world</Link>
        </div>
        <p className="note">No giant setup. Add one piece of life and let the world reveal itself.</p>
      </section>
      <aside className={`scene-card ${hasScene ? "is-ready" : ""}`} aria-live="polite">
        <p className="eyebrow">{hasScene ? "Your first scene" : "Preview"}</p>
        <h2>{scene.title}</h2>
        <p>{scene.atmosphere}</p>
        <p>{scene.world}</p>
        <blockquote>{scene.narratorLine}</blockquote>
        {hasScene ? <Link className="primary" href={shareHref}>Share this scene</Link> : <span className="disabled-link">Add a memory to create the scene.</span>}
      </aside>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <style>{styles}</style>
    </main>
  );
}

const styles = `
  .urai-entry-shell {
    min-height: 100dvh;
    display: grid;
    grid-template-columns: minmax(320px, 720px) minmax(300px, 520px);
    gap: 20px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    background: radial-gradient(circle at 50% 20%, rgba(103,232,249,.18), transparent 34%), radial-gradient(circle at 15% 70%, rgba(168,85,247,.16), transparent 34%), linear-gradient(180deg, #020617, #030712 58%, #000);
    color: white;
    padding: 24px;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  .entry-card, .scene-card {
    position: relative;
    z-index: 2;
    border: 1px solid rgba(255,255,255,.13);
    border-radius: 32px;
    background: rgba(2,6,23,.62);
    box-shadow: 0 28px 120px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.08);
    backdrop-filter: blur(24px);
    padding: clamp(28px, 6vw, 58px);
    text-align: left;
  }
  .scene-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 420px;
    justify-content: center;
  }
  .scene-card.is-ready { border-color: rgba(125,211,252,.32); }
  .eyebrow {
    margin: 0 0 16px;
    color: rgba(125,211,252,.9);
    font-size: .78rem;
    font-weight: 800;
    letter-spacing: .28em;
    text-transform: uppercase;
  }
  h1 {
    margin: 0;
    max-width: 680px;
    font-size: clamp(2.55rem, 8vw, 5.35rem);
    line-height: .9;
    letter-spacing: -.075em;
    text-wrap: balance;
  }
  h2 {
    margin: 0;
    font-size: clamp(1.7rem, 3vw, 2.7rem);
    line-height: 1;
    letter-spacing: -.05em;
  }
  .lede {
    margin: 24px 0 0;
    max-width: 590px;
    color: rgba(226,232,240,.78);
    font-size: clamp(1.02rem, 2vw, 1.18rem);
    line-height: 1.6;
  }
  .scene-card p {
    margin: 0;
    color: rgba(226,232,240,.75);
    line-height: 1.6;
  }
  .scene-card blockquote {
    margin: 4px 0 0;
    border-left: 3px solid rgba(125,211,252,.72);
    padding-left: 16px;
    color: white;
    line-height: 1.55;
  }
  .memory-form {
    display: grid;
    gap: 12px;
    margin-top: 28px;
  }
  .memory-form label {
    color: rgba(226,232,240,.88);
    font-size: .82rem;
    font-weight: 850;
    letter-spacing: .05em;
  }
  .memory-form textarea, .memory-form select {
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 18px;
    background: rgba(15,23,42,.72);
    color: white;
    padding: 14px 16px;
    font: inherit;
    line-height: 1.5;
    outline: none;
  }
  .memory-form textarea:focus, .memory-form select:focus {
    border-color: rgba(125,211,252,.58);
    box-shadow: 0 0 0 4px rgba(125,211,252,.08);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 18px;
  }
  .primary, .secondary, .disabled-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 52px;
    border-radius: 999px;
    padding: 0 22px;
    text-decoration: none;
    font-weight: 800;
    transition: transform .18s ease, border-color .18s ease, background .18s ease;
    border: 0;
  }
  .primary {
    background: white;
    color: #020617;
    box-shadow: 0 16px 50px rgba(255,255,255,.16);
    cursor: pointer;
  }
  .secondary {
    border: 1px solid rgba(255,255,255,.16);
    color: rgba(255,255,255,.9);
    background: rgba(255,255,255,.05);
  }
  .disabled-link {
    background: rgba(255,255,255,.08);
    color: rgba(226,232,240,.62);
  }
  .primary:hover, .secondary:hover { transform: translateY(-1px); }
  .note {
    margin: 20px 0 0;
    max-width: 520px;
    color: rgba(148,163,184,.8);
    font-size: .95rem;
    line-height: 1.55;
  }
  .ambient {
    position: absolute;
    border-radius: 999px;
    filter: blur(80px);
    opacity: .38;
    pointer-events: none;
  }
  .ambient-one {
    width: 360px;
    height: 360px;
    right: -110px;
    top: 12%;
    background: rgba(56,189,248,.38);
  }
  .ambient-two {
    width: 420px;
    height: 420px;
    left: -130px;
    bottom: 2%;
    background: rgba(192,132,252,.26);
  }
  @media (max-width: 980px) {
    .urai-entry-shell { grid-template-columns: 1fr; }
    .entry-card, .scene-card { border-radius: 24px; }
    .actions { display: grid; }
    .actions a, .primary { width: 100%; }
  }
`;
