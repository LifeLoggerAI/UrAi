import type { MoodForecast } from "@/lib/urai-v1-schemas";

export default function ForecastCard({ forecast }: { forecast: MoodForecast }) {
  const confidence = Math.round(forecast.confidence * 100);

  return (
    <section className="urai-sacred-card p-5 text-white transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-sky-100/65">Mood Forecast</p>
          <h2 className="mt-2 text-2xl font-semibold capitalize tracking-tight">{forecast.rhythmState}</h2>
        </div>
        <span className="urai-orb-artifact urai-orb-artifact--small" aria-hidden="true" />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-full border border-emerald-200/15 bg-emerald-300/10 px-3 py-2">
        <span className="text-xs uppercase tracking-[0.24em] text-emerald-100/60">Pattern confidence</span>
        <span className="text-sm font-semibold text-emerald-100">{confidence}%</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-white/82">{forecast.summary}</p>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.07] p-3 text-sm leading-6 text-white/78">
        <span className="font-semibold text-white">Next best action: </span>
        {forecast.nextBestAction}
      </div>
      <button
        type="button"
        className="urai-premium-cta mt-4"
        aria-label="Explain why this mood forecast appears"
      >
        Why am I seeing this?
      </button>
      <p className="mt-3 text-xs leading-5 text-white/45">Demo signal only. No diagnosis or certainty claim.</p>
    </section>
  );
}
