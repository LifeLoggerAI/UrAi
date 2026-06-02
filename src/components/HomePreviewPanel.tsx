"use client";

import type { MemoryBloom, TimelineEvent } from "@/lib/urai-v1-schemas";

type Props = {
  event: TimelineEvent;
  bloom: MemoryBloom;
  onOpenLifeMap: () => void;
};

const steps = [
  "Private life signals become patterns.",
  "Patterns become mood forecasts and memory blooms.",
  "The companion explains what changed and what to protect."
];

export default function HomePreviewPanel({ event, bloom, onOpenLifeMap }: Props) {
  return (
    <section className="home-preview-panel" aria-label="URAI preview explanation and sample memory star">
      <div className="rounded-3xl border border-white/12 bg-black/35 p-5 text-white shadow-2xl backdrop-blur-md">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/55">How URAI Works</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">From signals to story</h2>
        <ol className="mt-4 space-y-3">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-6 text-white/76">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xs font-semibold text-white/80">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <button
        type="button"
        onClick={onOpenLifeMap}
        className="group rounded-3xl border border-sky-100/20 bg-sky-100/10 p-5 text-left text-white shadow-2xl backdrop-blur-md transition hover:border-sky-100/35 hover:bg-sky-100/15 focus:outline-none focus:ring-2 focus:ring-white/45"
        aria-label={`Open sample memory star: ${event.title}`}
      >
        <div className="flex items-start gap-4">
          <span className="relative mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_0_32px_rgba(125,211,252,.24)]">
            <span className="absolute h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,.9)]" />
            <span className="absolute h-8 w-8 rounded-full border border-sky-100/30 transition group-hover:scale-110" />
          </span>
          <span>
            <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-sky-100/65">Sample Memory Star</span>
            <span className="mt-2 block text-2xl font-semibold tracking-tight">{event.title}</span>
            <span className="mt-2 block text-sm leading-6 text-white/76">{event.detail}</span>
            <span className="mt-3 block rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-white/74">
              Companion reflection: {bloom.narratorLine}
            </span>
            <span className="mt-4 inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white/88 transition group-hover:bg-white/15">
              Open in Life Map
            </span>
          </span>
        </div>
      </button>

      <style jsx>{`
        .home-preview-panel {
          position: relative;
          z-index: 25;
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          gap: 1rem;
          max-width: 56rem;
        }

        @media (max-width: 900px) {
          .home-preview-panel {
            grid-template-columns: 1fr;
            max-width: none;
          }
        }
      `}</style>
    </section>
  );
}
