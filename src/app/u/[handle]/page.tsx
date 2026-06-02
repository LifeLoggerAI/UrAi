import type { Metadata } from "next";
import ForecastCard from "@/components/ForecastCard";
import WaitlistForm from "@/components/WaitlistForm";
import WeeklyReflectionCard from "@/components/WeeklyReflectionCard";
import { getDemoProfileByHandle } from "@/lib/demo-data";

type PageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const profile = getDemoProfileByHandle(handle);
  const title = `@${profile.user.handle} Public Constellation`;
  const description = `${profile.user.displayName}'s URAI demo constellation with a mood forecast, weekly reflection, and public-safe memory timeline.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default async function PublicConstellationPage({ params }: PageProps) {
  const { handle } = await params;
  const profile = getDemoProfileByHandle(handle);

  return (
    <main className="urai-sacred-background px-5 py-8 text-white">
      <span className="urai-star-mist-layer" aria-hidden="true" />
      <span className="urai-reflective-floor" aria-hidden="true" />
      <section className="urai-sacred-content mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs uppercase tracking-[0.45em] text-white/45">Public Constellation</p>
          <span className="urai-chip">Demo data · public-safe view</span>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-end">
          <div>
            <h1 className="text-5xl font-semibold tracking-[-0.06em] md:text-7xl">@{profile.user.handle}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/72">{profile.user.tagline}</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
              This V1 demo path shows a shareable constellation, mood forecast,
              weekly reflection, and waitlist CTA without exposing private memory data.
            </p>
          </div>
          <div className="hidden justify-self-end lg:block">
            <span className="urai-orb-artifact" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <ForecastCard forecast={profile.moodForecast} />
          <WeeklyReflectionCard reflection={profile.weeklyReflection} />
          <WaitlistForm source="public-constellation" handle={profile.user.handle} />
        </div>

        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Demo memories</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Memory Blooms</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/50">
              Each artifact is summarized for a public viewer: clear enough to feel the story,
              bounded enough to avoid private-detail leakage.
            </p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {profile.memoryBlooms.map((bloom) => (
              <article key={bloom.id} className="urai-sacred-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/45">{bloom.emotionalTone}</p>
                  <span className="urai-orb-artifact urai-orb-artifact--small" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-lg font-semibold">{bloom.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{bloom.summary}</p>
                <div className="urai-cosmic-divider mt-4" />
                <p className="mt-4 text-sm italic text-white/60">“{bloom.narratorLine}”</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 pb-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Pattern timeline</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Star Timeline</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/50">
              The timeline keeps the demo legible on first pass: what happened, how intense it felt,
              and which symbolic tags the companion can explain.
            </p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {profile.timelineEvents.map((event) => (
              <article key={event.id} className="urai-sacred-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-white/45">{new Date(event.occurredAt).toDateString()}</p>
                  <span className="urai-chip">{Math.round(event.intensity * 100)}%</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{event.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{event.detail}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {event.symbolicTags.map((tag) => (
                    <span key={tag} className="urai-chip">{tag}</span>
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
