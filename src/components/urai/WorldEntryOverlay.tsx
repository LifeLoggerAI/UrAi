import Link from "next/link";

import type { WorldEntryState } from "@/lib/world-entry";

export default function WorldEntryOverlay({ entryState }: { entryState: WorldEntryState }) {
  if (entryState.kind === "default") return null;

  const isMemory = entryState.kind === "memory";

  return (
    <aside className={`world-entry-overlay ${isMemory ? "first-spark" : "quiet-world"}`} aria-live="polite">
      <span className="entry-kicker">{isMemory ? `First spark · ${entryState.vibe}` : "Quiet world"}</span>
      <strong>{isMemory ? "This memory can become the first star in your world." : "The sky is quiet for now."}</strong>
      <p>
        {isMemory
          ? entryState.memory
          : "Nothing is required yet. Your world can begin quietly. URAI will let the first patterns appear gently."}
      </p>
      <Link href={isMemory ? "/home#memory-galaxy" : "/home#quiet-sky"}>
        {isMemory ? "See it in the sky" : "Open the quiet sky"}
      </Link>
      <style>{styles}</style>
    </aside>
  );
}

const styles = `
  .world-entry-overlay {
    position: fixed;
    left: calc(env(safe-area-inset-left) + 22px);
    bottom: calc(env(safe-area-inset-bottom) + 22px);
    z-index: 2147483647;
    width: min(360px, calc(100vw - 44px));
    border: 1px solid rgba(186,230,253,.18);
    border-radius: 24px;
    background: linear-gradient(180deg, rgba(2,6,23,.68), rgba(2,6,23,.42));
    box-shadow: 0 24px 80px rgba(0,0,0,.34), inset 0 1px 0 rgba(255,255,255,.08);
    backdrop-filter: blur(22px);
    padding: 18px;
    color: white;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .world-entry-overlay:before {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    pointer-events: none;
    background: radial-gradient(circle at 22% 0%, rgba(125,211,252,.18), transparent 42%);
  }

  .entry-kicker {
    position: relative;
    display: block;
    margin: 0 0 8px;
    color: rgba(125,211,252,.86);
    font-size: .7rem;
    font-weight: 850;
    letter-spacing: .16em;
    text-transform: uppercase;
  }

  .world-entry-overlay strong {
    position: relative;
    display: block;
    font-size: 1.05rem;
    line-height: 1.18;
  }

  .world-entry-overlay p {
    position: relative;
    margin: 10px 0 0;
    color: rgba(226,232,240,.74);
    font-size: .92rem;
    line-height: 1.5;
  }

  .world-entry-overlay a {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 14px;
    min-height: 40px;
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 999px;
    background: rgba(255,255,255,.08);
    color: white;
    padding: 0 14px;
    font-weight: 800;
    text-decoration: none;
  }

  .first-spark {
    border-color: rgba(251,191,36,.24);
  }

  .first-spark:before {
    background: radial-gradient(circle at 24% 0%, rgba(251,191,36,.2), transparent 44%);
  }

  .quiet-world {
    border-color: rgba(125,211,252,.2);
  }

  @media (max-width: 720px) {
    .world-entry-overlay {
      left: 16px;
      right: 16px;
      bottom: 16px;
      width: auto;
    }
  }
`;
