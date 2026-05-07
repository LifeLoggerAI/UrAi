import type { MoodForecast } from "@/lib/urai-v1-schemas";

export default function ForecastCard({ forecast }: { forecast: MoodForecast }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-md">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Mood Forecast</p>
      <h2 className="mt-1 text-xl font-semibold capitalize">{forecast.rhythmState}</h2>
      <p className="mt-3 text-sm leading-6 text-white/80">{forecast.summary}</p>
      <div className="mt-4 rounded-2xl bg-black/25 p-3 text-sm text-white/75">
        <span className="font-semibold text-white">Next best action: </span>
        {forecast.nextBestAction}
      </div>
      <p className="mt-3 text-xs text-white/45">Confidence {Math.round(forecast.confidence * 100)}%</p>
    </section>
  );
}
