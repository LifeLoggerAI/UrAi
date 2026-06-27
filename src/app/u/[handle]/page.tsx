import type { Metadata } from "next";
import Link from "next/link";
import SystemRoutePage from "@/components/SystemRoutePage";
import { publicProfileHandle } from "@/lib/publicDeepRoutes";

export const metadata: Metadata = {
  title: "Public Constellation | URAI",
  description: "Public-safe URAI constellation view with demo data and early access CTA.",
};

type PageProps = {
  params: Promise<{ handle: string }> | { handle: string };
};

export default async function PublicConstellationPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const handle = publicProfileHandle(resolvedParams.handle);

  if (!handle) {
    return (
      <SystemRoutePage
        eyebrow="Public constellation boundary"
        title="This public constellation is unavailable."
        description="URAI could not open this public profile safely. The route closes without exposing account state, private memory data, or raw route parameters."
        status="guarded"
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_8%,rgba(45,212,191,0.18),transparent_32rem),radial-gradient(circle_at_82%_18%,rgba(125,211,252,0.14),transparent_30rem),linear-gradient(145deg,#020617_0%,#06111f_48%,#02030a_100%)] px-5 py-7 text-white sm:px-8">
      <div aria-hidden="true" className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_16%_22%,rgba(255,255,255,0.74)_0_1px,transparent_2px),radial-gradient(circle_at_58%_28%,rgba(125,211,252,0.58)_0_1px,transparent_2px),radial-gradient(circle_at_78%_62%,rgba(153,246,228,0.52)_0_1px,transparent_2px)]" />
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-6xl flex-col justify-center gap-7">
        <div className="rounded-[2.6rem] border border-white/10 bg-white/[0.055] p-6 shadow-[0_0_90px_rgba(45,212,191,0.12)] backdrop-blur-2xl sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Public Constellation</p>
          <h1 className="mt-5 max-w-4xl text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.075em] text-white">
            A public-safe constellation preview.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-cyan-50/76">
            This page shows sample blooms, a public-safe reflection shell, and early access entry without exposing owner-only memory data.
          </p>
          <p className="mt-4 inline-flex rounded-full border border-cyan-100/18 bg-cyan-100/[0.08] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-50">
            Public handle verified for demo display
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold tracking-[-0.045em]">Memory Blooms</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">Sample public-safe blooms only. Private memory content never opens from this route.</p>
          </section>
          <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold tracking-[-0.045em]">Star Timeline</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">A preview of the constellation shape, not a live personal history feed.</p>
          </section>
        </div>

        <div className="rounded-[1.8rem] border border-cyan-200/18 bg-cyan-200/[0.06] p-5 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">Join Early Access</h2>
          <p className="mt-2 text-sm leading-6 text-white/68">Request access without enabling passive sensing, private generated media, or provider-backed systems.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="rounded-full bg-cyan-100 px-5 py-3 text-sm font-black text-slate-950" href="/waitlist">Open waitlist</Link>
            <Link className="rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white/78" href="/privacy">Privacy Field</Link>
            <Link className="rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white/78" href="/status">Status</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
