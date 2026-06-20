import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About URAI",
  description: "URAI is a passive magical life OS for user-owned memory and reflection.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#030712] px-6 py-10 text-white">
      <section className="mx-auto max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">About URAI</p>
        <h1 className="text-4xl font-semibold">A passive magical life OS</h1>
        <p className="text-white/70">URAI turns reflection, memory, and world-building into a launch-safe public surface with private layers protected by permission.</p>
      </section>
    </main>
  );
}
