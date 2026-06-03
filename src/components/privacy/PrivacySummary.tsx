"use client";

export function PrivacySummary() {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-black/28 p-4 text-white backdrop-blur-xl" aria-label="URAI privacy summary">
      <p className="text-xs uppercase tracking-[0.24em] text-white/45">Privacy</p>
      <h3 className="mt-2 text-lg font-medium text-white">Private by default</h3>
      <div className="mt-3 space-y-2 text-sm leading-6 text-white/64">
        <p>Passport controls which layers open, sync, export, or appear in AI context.</p>
        <p>The Companion uses only opened summaries. Closed layers stay closed.</p>
        <p>Exports require review before anything leaves URAI.</p>
        <p>Shadow and Legacy stay closed unless you explicitly open them.</p>
        <p>Local-only mode is available, and you can close layers anytime.</p>
      </div>
    </section>
  );
}
