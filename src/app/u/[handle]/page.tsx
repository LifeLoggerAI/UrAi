import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Constellation | URAI",
  description: "Public-safe URAI constellation view with demo data and early access CTA.",
};

type PageProps = {
  params: Promise<{ handle: string }> | { handle: string };
};

export default async function PublicConstellationPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const handle = resolvedParams.handle;

  return (
    <main className="min-h-screen bg-[#030712] px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Public Constellation</p>
          <h1 className="text-5xl font-semibold">@{handle}</h1>
          <p className="text-white/70">Demo data · public-safe view</p>
          <p className="text-white/60">This page shows public blooms, weekly reflection, and waitlist CTA without exposing owner-only memory data.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-2xl font-semibold">Memory Blooms</h2>
            <p className="mt-2 text-sm text-white/65">Sample public-safe blooms only.</p>
          </section>
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-2xl font-semibold">Star Timeline</h2>
            <p className="mt-2 text-sm text-white/65">Public-safe timeline preview.</p>
          </section>
        </div>

        <form className="rounded-3xl border border-cyan-200/20 bg-cyan-200/[0.06] p-5">
          <h2 className="text-2xl font-semibold">Join Early Access</h2>
          <label className="mt-4 block text-sm text-white/75">
            Email address
            <input
              id="waitlist-email-public-constellation"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl bg-black/40 px-4 py-3 text-white"
            />
          </label>
          <button type="submit" disabled className="mt-4 rounded-full border border-white/20 px-5 py-3 text-sm text-white/50">
            Request Access
          </button>
        </form>
      </section>
    </main>
  );
}
