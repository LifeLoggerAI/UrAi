import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata = {
  title: "Join URAI Genesis Early Access",
  description: "Join the URAI Genesis waitlist after the public Home, Life Map, Focus, and Replay demo path.",
};

export default function WaitlistPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-5 py-10 text-slate-100 sm:px-8">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,.16),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(245,158,11,.14),transparent_28%),linear-gradient(180deg,#020617,#030712_48%,#000)]" />
      <section className="mx-auto grid min-h-[80vh] max-w-5xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <div className="relative z-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Genesis early access</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">If the world clicked, join the next gate.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            The friend demo ends here on purpose: a real waitlist, not a fake unlock. Get updates as private Life Map, owner-scoped media, and provider-backed systems move through evidence gates.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
            Waitlist signup does not enable passive sensing, outbound communications, therapy-adjacent behavior, provider integrations, or production analytics. Those systems remain gated until privacy and launch evidence is complete.
          </p>
          <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-4">
            {["Home", "Life Map", "Focus", "Replay"].map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                <span className="text-xs font-semibold text-cyan-100/48">0{index + 1}</span>
                <p className="mt-1 text-sm font-semibold text-white">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/replay" className="rounded-full border border-cyan-200/20 px-4 py-2 text-cyan-100 hover:bg-cyan-200/[0.08]">
              Back to Replay
            </Link>
            <Link href="/privacy" className="rounded-full border border-white/10 px-4 py-2 text-white/75 hover:text-white">
              Privacy posture
            </Link>
            <Link href="/system" className="rounded-full border border-cyan-200/20 px-4 py-2 text-cyan-100 hover:bg-cyan-200/[0.08]">
              System status
            </Link>
          </div>
        </div>
        <div className="relative z-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <WaitlistForm source="waitlist-page" handle="adamclamp" />
        </div>
      </section>
    </main>
  );
}
