import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-black text-white">
      <section className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col justify-center px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">URAI</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">This path has gone quiet.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">Return to URAI and continue from the orb.</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
            <Link className="rounded-full bg-white px-5 py-3 text-black hover:bg-white/90" href="/app/home">Return Home</Link>
            <Link className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-white hover:bg-white/15" href="/early-access">Early Access</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
