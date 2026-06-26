import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample Demo | URAI",
  description: "Public-safe URAI sample demo using sample data only.",
};

const demoCards = [
  {
    eyebrow: "Passport",
    title: "Open a safe pass",
    body: "Sample permissions show how URAI separates public preview data from private owner layers.",
    href: "/passport",
    cta: "Open pass",
  },
  {
    eyebrow: "Companion",
    title: "Message the orb",
    body: "A sample-safe response explains the boundary without pretending private memory is unlocked.",
    href: "/mirror",
    cta: "Companion sample",
  },
  {
    eyebrow: "Life Map",
    title: "Enter the galaxy",
    body: "See the symbolic map, starter star, and replay thread without exposing real user data.",
    href: "/life-map",
    cta: "Open Life Map",
  },
];

export default function DemoPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] px-6 py-12 text-white">
      <section className="relative mx-auto max-w-6xl space-y-10">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-cyan-200/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-56 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />

        <header className="relative max-w-3xl space-y-5">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Sample demo</p>
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            Walk through URAI without opening anything private.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            This is the public-safe preview: a passport boundary, a companion sample, and a Life Map galaxy that shows the feeling without exposing a real account.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/life-map" className="rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950">
              Enter demo
            </Link>
            <Link href="/replay" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 hover:border-white/40 hover:text-white">
              Watch replay
            </Link>
          </div>
        </header>

        <div className="relative grid gap-5 md:grid-cols-3">
          {demoCards.map((card) => (
            <section key={card.title} className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/60">{card.eyebrow}</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">{card.title}</h2>
              <p className="mt-4 min-h-24 text-sm leading-relaxed text-white/68">{card.body}</p>
              <Link href={card.href} className="mt-6 inline-flex rounded-full border border-cyan-200/30 px-4 py-2 text-sm font-semibold text-cyan-50 hover:bg-cyan-200 hover:text-slate-950">
                {card.cta}
              </Link>
            </section>
          ))}
        </div>

        <section className="relative rounded-[2rem] border border-cyan-200/15 bg-cyan-200/[0.045] p-6 text-sm leading-relaxed text-white/70">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/60">Launch note</p>
          <p className="mt-3 max-w-3xl">
            The public demo is intentionally sample-only. The full owner-bound memory system stays behind account, consent, and service gates.
          </p>
        </section>
      </section>
    </main>
  );
}
