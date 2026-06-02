import Link from "next/link";

export const metadata = {
  title: "Changelog | URAI",
  description: "Recent product updates for the URAI emotional life OS.",
};

const updates = [
  {
    title: "Life Map galaxy polish",
    date: "Current release",
    body: "The Life Map now uses the production memory-galaxy scene across direct and in-app entry points, with richer star depth, emotional threads, and privacy-aware memory blooms.",
  },
  {
    title: "Home field refinement",
    date: "Current release",
    body: "The home field emphasizes the present emotional weather, companion state, recovery rhythm, and one clear path into the Life Map.",
  },
  {
    title: "Trust surfaces",
    date: "Current release",
    body: "Memory details now keep confidence, source signal count, privacy level, and correction paths close to the experience instead of hiding them in settings.",
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-[#000108] text-white">
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-20">
        <Link href="/" className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 hover:text-white">
          Return home
        </Link>
        <header className="mt-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-white/45">Release notes</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">What changed in URAI</h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/65">
            A concise record of the product surfaces that changed for launch readiness: world polish, privacy clarity, and calmer navigation.
          </p>
        </header>
        <section className="mt-12 space-y-4">
          {updates.map((update) => (
            <article key={update.title} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/45">{update.date}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{update.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{update.body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
