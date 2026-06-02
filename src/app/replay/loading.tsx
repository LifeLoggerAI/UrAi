export default function ReplayLoading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#111827_0%,#020617_50%,#000_100%)] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
        <div className="w-full rounded-[2.25rem] border border-violet-100/10 bg-white/[0.04] p-8 shadow-[0_0_90px_rgba(168,85,247,.14)] backdrop-blur-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-100/70">Replay theater</p>
          <div className="mt-6 aspect-video w-full animate-pulse rounded-[1.5rem] bg-white/10" aria-hidden="true" />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="h-12 animate-pulse rounded-full bg-white/10" aria-hidden="true" />
            <div className="h-12 animate-pulse rounded-full bg-white/10" aria-hidden="true" />
            <div className="h-12 animate-pulse rounded-full bg-white/10" aria-hidden="true" />
          </div>
          <span className="sr-only">Loading replay theater</span>
        </div>
      </section>
    </main>
  );
}
