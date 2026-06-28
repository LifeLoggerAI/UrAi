import Link from "next/link";
import type { UraiWorldLayer } from "@/data/uraiWorldSystem";

export default function OrbChatCockpit({ layer }: { layer: UraiWorldLayer }) {
  return (
    <section className="border border-white/10 bg-slate-950/58 shadow-2xl shadow-black/35 backdrop-blur-2xl mt-4 grid gap-5 rounded-[2.25rem] p-6 sm:p-9 lg:grid-cols-[0.92fr_1.08fr]" aria-labelledby="orb-cockpit-title">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Conversational cockpit</p>
        <h2 id="orb-cockpit-title" className="mt-4 text-[clamp(2.1rem,3.8vw,3.55rem)] font-semibold leading-none tracking-[-0.06em]">
          Speak to the system without opening private systems.
        </h2>
        <p className="mt-4 text-sm leading-6 text-white/66">
          The cockpit is useful now as a guided, launch-safe surface. Provider-backed private chat remains gated, so prompt chips explain and route rather than pretending to read personal memories.
        </p>
        <div className="mt-6 grid gap-3">
          {layer.prompts.map((prompt) => (
            <Link key={prompt.label} href="/orb-chat" className="rounded-[1.35rem] border border-cyan-100/14 bg-cyan-100/[0.045] p-4 transition hover:-translate-y-0.5 hover:border-cyan-200/30 hover:bg-cyan-100/[0.075] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
              <span className="inline-flex rounded-full border border-cyan-100/18 px-2 py-1 text-[0.6rem] font-black uppercase tracking-[0.12em] text-cyan-100/72">{prompt.status}</span>
              <strong className="mt-3 block text-lg tracking-[-0.035em] text-white">{prompt.label}</strong>
              <span className="mt-2 block text-sm leading-6 text-white/64">{prompt.prompt}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-[1.8rem] border border-cyan-200/16 bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.13),transparent_18rem),linear-gradient(180deg,rgba(15,23,42,0.72),rgba(2,6,23,0.9))] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-200">Safe public mode</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">The Orb can guide Genesis.</h3>
          </div>
          <span className="rounded-full border border-amber-200/22 bg-amber-200/10 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.14em] text-amber-50/80">
            Provider gated
          </span>
        </div>
        <div className="mt-5 grid gap-3">
          <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4">
            <p className="text-sm leading-6 text-white/72">
              You live. URAI is built to organize around your life with consent. Genesis shows the cockpit shape without loading private account context.
            </p>
          </article>
          <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4">
            <p className="text-sm leading-6 text-white/72">
              Ask for safe routes, launch status, Passport boundaries, or what remains gated. Do not expect private memory analysis in public demo mode.
            </p>
          </article>
        </div>
        <label htmlFor="orb-world-disabled-input" className="mt-5 block text-xs font-black uppercase tracking-[0.2em] text-white/46">
          Chat input
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="orb-world-disabled-input"
            disabled
            value="Private Orb chat opens after provider and privacy gates pass."
            aria-label="Private Orb chat is disabled until provider and privacy gates pass"
            className="min-h-12 flex-1 rounded-full border border-white/10 bg-white/[0.045] px-5 text-sm text-white/58 outline-none disabled:cursor-not-allowed"
            readOnly
          />
          <button type="button" disabled className="min-h-12 rounded-full border border-white/10 bg-white/[0.045] px-5 text-sm font-extrabold text-white/38 disabled:cursor-not-allowed" aria-label="Send disabled because private Orb chat is gated">
            Send gated
          </button>
        </div>
      </div>
    </section>
  );
}
