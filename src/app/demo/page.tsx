import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample Demo | URAI",
  description: "Public-safe URAI sample demo using sample data only.",
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#030712] px-6 py-10 text-white">
      <section className="mx-auto max-w-4xl space-y-8">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Sample Demo</p>
        <h1 className="text-4xl font-semibold">URAI public sample experience</h1>
        <p className="text-white/70">This public walkthrough is sample-safe and does not open owner-only layers.</p>

        <button type="button" className="rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950">
          Enter demo
        </button>

        <div className="grid gap-4 md:grid-cols-3">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <button type="button" aria-label="Open URAI Passport" className="rounded-full border border-white/15 px-4 py-2 text-sm">
              Open pass
            </button>
            <p className="mt-4 text-sm text-white/75">sample data Passport permission boundary.</p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <button type="button" aria-label="Open URAI Companion" className="rounded-full border border-white/15 px-4 py-2 text-sm">
              Companion sample
            </button>
            <label className="mt-4 block text-sm text-white/75">
              Message URAI
              <textarea aria-label="Message URAI" className="mt-2 min-h-20 w-full rounded-2xl bg-black/40 p-3 text-white" />
            </label>
            <button type="button" className="mt-3 rounded-full border border-cyan-200/30 px-4 py-2 text-sm">
              Send
            </button>
            <p className="mt-4 text-sm text-cyan-100">sample-safe boundary response</p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <button type="button" aria-label="Open Life Map" className="rounded-full border border-white/15 px-4 py-2 text-sm">
              Open Life Map
            </button>
            <p className="mt-4 text-sm text-white/75">Life Map Galaxy sample view.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
