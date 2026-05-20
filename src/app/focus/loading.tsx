export default function FocusLoading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#172554_0%,#020617_48%,#000_100%)] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-cyan-100/10 bg-white/[0.04] p-8 shadow-[0_0_90px_rgba(14,165,233,.16)] backdrop-blur-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100/70">Focus chamber</p>
          <div className="mt-6 h-10 w-2/3 animate-pulse rounded-full bg-white/10" aria-hidden="true" />
          <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-white/10" aria-hidden="true" />
          <div className="mt-3 h-4 w-4/5 animate-pulse rounded-full bg-white/10" aria-hidden="true" />
          <span className="sr-only">Loading focus chamber</span>
        </div>
      </section>
    </main>
  );
}
