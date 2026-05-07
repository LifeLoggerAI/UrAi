import ForecastCard from "@/components/ForecastCard";
import WaitlistForm from "@/components/WaitlistForm";
import WeeklyReflectionCard from "@/components/WeeklyReflectionCard";
import { getDemoProfileByHandle } from "@/lib/demo-data";

export default function PublicConstellationPage({ params }: { params: { handle: string } }) {
  const profile = getDemoProfileByHandle(params.handle);

  return (
    <main className="min-h-dvh bg-black px-5 py-8 text-white">
      <section className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.45em] text-white/45">Public Constellation</p>
        <h1 className="mt-4 text-4xl font-semibold">@{profile.user.handle}</h1>
        <p className="mt-3 max-w-2xl text-white/65">{profile.user.tagline}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <ForecastCard forecast={profile.moodForecast} />
          <WeeklyReflectionCard reflection={profile.weeklyReflection} />
          <WaitlistForm source="public-constellation" handle={profile.user.handle} />
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Memory Blooms</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {profile.memoryBlooms.map((bloom) => (
              <article key={bloom.id} className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-white/45">{bloom.emotionalTone}</p>
                <h3 className="mt-2 text-lg font-semibold">{bloom.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{bloom.summary}</p>
                <p className="mt-4 text-sm italic text-white/60">“{bloom.narratorLine}”</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Star Timeline</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {profile.timelineEvents.map((event) => (
              <article key={event.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-white/45">{new Date(event.occurredAt).toDateString()}</p>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/60">{Math.round(event.intensity * 100)}%</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{event.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{event.detail}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {event.symbolicTags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/55">{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
