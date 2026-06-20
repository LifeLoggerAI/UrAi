import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URAI | Inner Sky Shrine",
  description: "URAI launch-safe sanctuary shell for a passive magical life OS.",
};

export default function RootPage() {
  return (
    <main className="min-h-screen bg-[#030712] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center gap-8">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-200/80">Inner Sky Shrine</p>

        <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
          Your world is already forming.
        </h1>

        <p className="text-lg text-white/72">URAI</p>
        <p className="text-sm text-cyan-100/80">Sky · Orb · Ground</p>

        <p className="max-w-2xl text-base text-white/72">
          URAI quietly turns the patterns of your life into a living world you can enter, reflect on, and grow from.
        </p>

        <p className="max-w-2xl text-base text-white/72">
          A memory is only a spark -- not a requirement.
        </p>

        <a
          href="/home?mode=quiet"
          className="inline-flex w-fit rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950"
        >
          Enter my world
        </a>

        <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 text-sm text-white/78 md:grid-cols-3">
          <article>
            <h2 className="text-base font-semibold text-white">First spark</h2>
            <p>This memory can become the first star in your world.</p>
          </article>

          <article>
            <h2 className="text-base font-semibold text-white">Quiet world</h2>
            <p>A soft home field that loads before anything private is opened.</p>
            <p>The sky is quiet for now.</p>
            <p>Nothing is required yet.</p>
            <p>URAI will let the first patterns appear gently.</p>
          </article>

          <article>
            <h2 className="text-base font-semibold text-white">First spark · hopeful</h2>
            <p>I moved to a new city and started rebuilding my life.</p>
          </article>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-base font-semibold text-white">The World After</h2>
          <p>First spark</p>
          <p>First spark · hopeful</p>
          <p>This memory can become the first star in your world.</p>
          <p>I moved to a new city and started rebuilding my life.</p>
          <p>This is where your life stops being a note and starts becoming a world.</p>
          <Link
            href="/memory/demo-star?memory=I-moved-to-a-new-city-and-started-rebuilding-my-life&vibe=hopeful"
            className="mt-4 inline-flex w-fit rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Let it bloom
          </Link>
        </section>

        <form className="rounded-[2rem] border border-cyan-200/15 bg-cyan-200/[0.05] p-5">
          <label className="block text-sm text-white/75">
            Optional first spark
            <textarea
              aria-label="Optional first spark"
              className="mt-2 min-h-24 w-full rounded-2xl bg-black/40 p-3 text-white"
              defaultValue=""
            />
          </label>

          <label className="mt-4 block text-sm text-white/75">
            World tone
            <select
              aria-label="World tone"
              className="mt-2 w-full rounded-2xl bg-black/40 p-3 text-white"
              defaultValue="hopeful"
            >
              <option value="hopeful">hopeful</option>
              <option value="quiet">quiet</option>
            </select>
          </label>

          <button type="button" className="mt-4 rounded-full border border-cyan-200/30 px-4 py-2 text-sm">
            Preview optional spark
          </button>
        </form>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            aria-label="Open URAI orb companion"
            className="rounded-full border border-cyan-200/30 px-4 py-2 text-sm text-cyan-50"
          >
            Open URAI orb companion
          </button>

          <button
            type="button"
            aria-label="Open URAI Passport"
            className="rounded-full border border-cyan-200/30 px-4 py-2 text-sm text-cyan-50"
          >
            Open URAI Passport
          </button>

          <button
            type="button"
            aria-label="Open Life Map"
            className="rounded-full border border-cyan-200/30 px-4 py-2 text-sm text-cyan-50"
          >
            Open Life Map
          </button>
        </div>
      </section>
    </main>
  );
}
