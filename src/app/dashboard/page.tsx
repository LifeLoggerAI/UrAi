import Link from "next/link";

export const metadata = {
  title: "Dashboard gated | URAI",
  description: "URAI dashboard access is gated until private account, privacy, and admin-audit evidence is complete.",
};

export default function DashboardGatePage() {
  return (
    <main className="min-h-screen bg-[#030712] px-6 py-12 text-white">
      <section className="mx-auto flex min-h-[80vh] max-w-4xl flex-col justify-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/75">Gated surface</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Dashboard access is not public yet.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
          The URAI dashboard will require private account, consent, export/delete, retention, and admin-audit evidence before it becomes a live user surface. For launch, use the public demo and waitlist only.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950">Return to demo</Link>
          <Link href="/waitlist" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/75 hover:text-white">Join waitlist</Link>
          <Link href="/system" className="rounded-full border border-amber-200/25 px-5 py-3 text-sm font-semibold text-amber-50">View launch truth</Link>
        </div>
      </section>
    </main>
  );
}
