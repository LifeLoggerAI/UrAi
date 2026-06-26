import Link from "next/link";

export const metadata = {
  title: "Login gated | URAI",
  description: "URAI login is gated until private account release evidence is complete.",
};

export default function LoginGatePage() {
  return (
    <main className="min-h-screen bg-[#030712] px-6 py-12 text-white">
      <section className="mx-auto flex min-h-[80vh] max-w-4xl flex-col justify-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/75">Early access</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Login opens after the private beta gate.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
          Public visitors can explore the demo and join the waitlist. Account login stays gated until privacy, security, rollback, monitoring, and release evidence is complete.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/waitlist" className="rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950">Join waitlist</Link>
          <Link href="/" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/75 hover:text-white">Explore demo</Link>
          <Link href="/privacy" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/75 hover:text-white">Privacy</Link>
        </div>
      </section>
    </main>
  );
}
