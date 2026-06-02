import Link from "next/link";

type MemoryPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: MemoryPageProps) {
  const { id } = await params;
  return {
    title: `URAI Memory ${id}`,
    description: "A URAI Memory Bloom route for opening a Memory Star from the Life Map.",
  };
}

export default async function MemoryPage({ params }: MemoryPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100 sm:px-8">
      <section className="mx-auto flex min-h-[80vh] max-w-4xl flex-col justify-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Memory Bloom</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">Memory Star opened.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          This route opens a launch-safe Memory Bloom shell for <span className="font-semibold text-cyan-100">{id}</span>. Full private memory content remains owner-only and should be loaded only after auth and Firestore rules verification.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100" href="/life-map">
            Return to Life Map
          </Link>
          <Link className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100" href="/settings/privacy">
            Privacy Controls
          </Link>
        </div>
      </section>
    </main>
  );
}
