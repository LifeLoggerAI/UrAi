import WaitlistForm from "@/components/WaitlistForm";
import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "Join the URAI Waitlist",
  description: "Request early access to URAI, the passive magical life OS.",
};

export default function WaitlistPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100 sm:px-8">
      <section className="mx-auto grid min-h-[80vh] max-w-5xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Early Access</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">Join the URAI waitlist.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            URAI V1 turns the Home Orb, emotional weather, Memory Stars, and the companion into one calm launch-ready experience.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
          <WaitlistForm source="waitlist-page" handle="adamclamp" />
        </div>
      </section>
    </main>
  );
}
