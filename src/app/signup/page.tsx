import Link from "next/link";

export const metadata = {
  title: "Signup gated | URAI",
  description: "URAI signup is gated behind the early-access waitlist until release evidence is complete.",
};

export default function SignupGatePage() {
  return (
    <main className="min-h-screen bg-[#030712] px-6 py-12 text-white">
      <section className="mx-auto flex min-h-[80vh] max-w-4xl flex-col justify-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/75">Signup gate</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Signup is waitlist-first for now.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
          URAI is not opening general accounts from the public demo. Join the waitlist for access updates while private-account evidence gates remain in progress.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/waitlist" className="rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950">Join waitlist</Link>
          <Link href="/system" className="rounded-full border border-amber-200/25 px-5 py-3 text-sm font-semibold text-amber-50">View system status</Link>
          <Link href="/terms" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/75 hover:text-white">Terms</Link>
        </div>
      </section>
    </main>
  );
}
