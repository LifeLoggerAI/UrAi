import type { WeeklyReflection } from "@/lib/urai-v1-schemas";

export default function WeeklyReflectionCard({ reflection }: { reflection: WeeklyReflection }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-md">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Weekly Reflection</p>
      <h2 className="mt-1 text-xl font-semibold">{reflection.title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/80">{reflection.narratorSummary}</p>
      <ul className="mt-4 space-y-2">
        {reflection.highlights.map((highlight) => (
          <li key={highlight} className="rounded-2xl bg-black/25 px-3 py-2 text-sm text-white/75">
            {highlight}
          </li>
        ))}
      </ul>
    </section>
  );
}
