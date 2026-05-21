import type { WeeklyReflection } from "@/lib/urai-v1-schemas";

export default function WeeklyReflectionCard({ reflection }: { reflection: WeeklyReflection }) {
  return (
    <section className="urai-sacred-card urai-sacred-card--violet p-5 text-white transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-violet-100/65">Weekly Reflection</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{reflection.title}</h2>
        </div>
        <span className="urai-orb-artifact urai-orb-artifact--violet urai-orb-artifact--small" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm leading-6 text-white/82">{reflection.narratorSummary}</p>
      <div className="urai-cosmic-divider mt-4" />
      <ul className="mt-4 space-y-2">
        {reflection.highlights.map((highlight) => (
          <li key={highlight} className="rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-2 text-sm leading-6 text-white/78">
            {highlight}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="urai-premium-cta mt-4"
      >
        View sample reflection
      </button>
    </section>
  );
}
