import Link from "next/link";

export const metadata = {
  title: "URAI Orb Companion",
  description: "The URAI orb companion chamber for calm, privacy-safe reflection and guided return to the home world.",
};

export default function OchatPage() {
  return (
    <main aria-label="URAI orb companion chamber" className="relative min-h-dvh overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(103,232,249,.22),transparent_30%),radial-gradient(circle_at_78%_12%,rgba(168,85,247,.2),transparent_35%),linear-gradient(180deg,#01030a,#07152b_48%,#020617)]" />
      <div className="pointer-events-none fixed inset-0 opacity-60 [background-image:radial-gradient(circle_at_18%_22%,rgba(255,255,255,.42)_0_1px,transparent_1.5px),radial-gradient(circle_at_76%_18%,rgba(186,230,253,.34)_0_1px,transparent_1.5px),radial-gradient(circle_at_47%_39%,rgba(221,214,254,.28)_0_1px,transparent_1.5px)]" />

      <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center justify-center px-5 py-12 text-center">
        <div aria-hidden="true" className="relative flex h-72 w-72 items-center justify-center rounded-full border border-cyan-100/15 bg-cyan-100/[0.035] shadow-[0_0_130px_rgba(103,232,249,.22)]">
          <div className="absolute inset-[-24%] rounded-full bg-[radial-gradient(circle,rgba(103,232,249,.18),rgba(168,85,247,.1)_42%,transparent_68%)] blur-2xl" />
          <div className="relative h-36 w-36 rounded-full bg-[radial-gradient(circle_at_32%_24%,#fff,#a5f3fc_24%,#0891b2_52%,#031525_88%)] shadow-[inset_-24px_-28px_40px_rgba(0,0,0,.72),0_0_80px_rgba(103,232,249,.42)]" />
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.36em] text-cyan-100/65">Orb companion</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">URAI is here without taking over.</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200/75">
          This chamber is the safe fallback for companion reflection. It only uses sourced, user-scoped state when connected, and stays calm when data is missing.
        </p>

        <div className="mt-8 grid w-full gap-3 text-left sm:grid-cols-3">
          {[
            ["Privacy", "No raw private logs appear here."],
            ["Fallback", "If live companion state is unavailable, the orb remains calm."],
            ["Return", "The user can always unwind home."],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/55">{label}</p>
              <p className="mt-3 text-sm leading-6 text-slate-100/80">{value}</p>
            </article>
          ))}
        </div>

        <nav aria-label="Orb companion navigation" className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/home" className="rounded-full border border-cyan-100/30 bg-cyan-100/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-50">Return home</Link>
          <Link href="/life-map" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-100">Open life map</Link>
        </nav>
      </section>
    </main>
  );
}
