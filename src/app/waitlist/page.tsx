import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata = {
  title: "Join the URAI Waitlist",
  description: "Request early access to the URAI public demo and privacy-gated product roadmap.",
};

export default function WaitlistPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100 sm:px-8">
      <section className="mx-auto grid min-h-[80vh] max-w-5xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Early Access</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">Join the URAI waitlist.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Get updates on the URAI public demo, Life Map direction, and the evidence-gated path toward private features.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
            Waitlist signup does not enable passive sensing, outbound communications, therapy-adjacent behavior, provider integrations, or production analytics. Those systems remain gated until privacy and launch evidence is complete.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/privacy" className="rounded-full border border-white/10 px-4 py-2 text-white/75 hover:text-white">
              Privacy posture
            </Link>
            <Link href="/system" className="rounded-full border border-cyan-200/20 px-4 py-2 text-cyan-100 hover:bg-cyan-200/[0.08]">
              System status
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
          <WaitlistForm source="waitlist-page" handle="adamclamp" />
        </div>
      </section>
    </main>
  );
}
