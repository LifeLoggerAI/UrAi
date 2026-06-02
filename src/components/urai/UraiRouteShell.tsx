import Link from "next/link";

type UraiRouteShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  sections?: Array<{ title: string; body: string }>;
};

export default function UraiRouteShell({
  eyebrow,
  title,
  description,
  primaryHref = "/home",
  primaryLabel = "Return Home",
  secondaryHref = "/privacy",
  secondaryLabel = "Privacy Center",
  sections = [],
}: UraiRouteShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100 sm:px-8">
      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">{eyebrow}</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{description}</p>

        <div className="mt-8 flex flex-wrap gap-3" aria-label="Route actions">
          <Link className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100" href={primaryHref}>
            {primaryLabel}
          </Link>
          <Link className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100" href={secondaryHref}>
            {secondaryLabel}
          </Link>
        </div>

        {sections.length ? (
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {sections.map((section) => (
              <article key={section.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
                <h2 className="text-base font-semibold text-white">{section.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{section.body}</p>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
