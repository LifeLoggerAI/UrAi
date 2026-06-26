import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About URAI",
  description: "URAI is a public demo for a privacy-gated life reflection product and symbolic Life Map.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#030712] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[80vh] max-w-3xl flex-col justify-center space-y-5">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">About URAI</p>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">A symbolic Life Map, gated before it becomes personal.</h1>
        <p className="text-base leading-7 text-white/70">
          URAI turns reflection, memory, and world-building into a launch-safe public demo. Private layers stay behind consent, export/delete, retention, admin audit, monitoring, rollback, and release evidence gates.
        </p>
        <p className="text-sm leading-6 text-white/55">
          The public demo is not therapy, diagnosis, passive sensing, outbound communication, autonomous jobs, or a data marketplace. Those systems are roadmap or gated until evidence proves they are safe.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950">Explore demo</Link>
          <Link href="/system" className="rounded-full border border-amber-200/25 px-5 py-3 text-sm font-semibold text-amber-50">System status</Link>
          <Link href="/privacy" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/75 hover:text-white">Privacy</Link>
        </div>
      </section>
    </main>
  );
}