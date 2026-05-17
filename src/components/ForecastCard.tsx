import type { MoodForecast } from "@/lib/urai-v1-schemas";

export default function ForecastCard({ forecast }: { forecast: MoodForecast }) {
  const confidence = Math.round(forecast.confidence * 100);

  return (
    <section className="rounded-3xl border border-white/15 bg-black/40 p-5 text-white shadow-2xl backdrop-blur-md transition hover:border-white/25 hover:bg-black/45">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-sky-100/65">Mood Forecast</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold capitalize tracking-tight">{forecast.rhythmState}</h2>
        <span className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
          {confidence}%
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/82">{forecast.summary}</p>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.07] p-3 text-sm leading-6 text-white/78">
        <span className="font-semibold text-white">Next best action: </span>
        {forecast.nextBestAction}
      </div>
      <button
        type="button"
        className="mt-4 inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white/88 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40"
        aria-label="Explain why this mood forecast appears"
      >
        Why am I seeing this?
      </button>
      <p className="mt-3 text-xs leading-5 text-white/45">Pattern confidence: {confidence}%. Demo uses sample data.</p>
    </section>
  );
}
