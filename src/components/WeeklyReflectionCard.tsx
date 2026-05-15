import type { WeeklyReflection } from "@/lib/urai-v1-schemas";

export default function WeeklyReflectionCard({ reflection }: { reflection: WeeklyReflection }) {
  return (
    <section className="rounded-3xl border border-white/15 bg-black/40 p-5 text-white shadow-2xl backdrop-blur-md transition hover:border-white/25 hover:bg-black/45">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-violet-100/65">Weekly Reflection</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">{reflection.title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/82">{reflection.narratorSummary}</p>
      <ul className="mt-4 space-y-2">
        {reflection.highlights.map((highlight) => (
          <li key={highlight} className="rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-2 text-sm leading-6 text-white/78">
            {highlight}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-4 inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white/88 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40"
      >
        View sample reflection
      </button>
    </section>
  );
}
