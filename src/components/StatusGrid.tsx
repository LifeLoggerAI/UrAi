"use client";

type ServiceState = "source_present" | "preview_only";

type ServiceStatus = {
  id: string;
  label: string;
  status: ServiceState;
  message: string;
};

const STATUS_LABELS: Record<ServiceState, { bg: string; text: string; label: string }> = {
  source_present: {
    bg: "bg-sky-500/10 border-sky-400/40",
    text: "text-sky-300",
    label: "Source present",
  },
  preview_only: {
    bg: "bg-amber-500/10 border-amber-400/40",
    text: "text-amber-300",
    label: "Preview mode",
  },
};

const SERVICES: ServiceStatus[] = [
  {
    id: "web-app",
    label: "URAI web app",
    status: "source_present",
    message:
      "Public demo routes exist in source and must be smoke-tested after each deploy before production claims.",
  },
  {
    id: "life-map",
    label: "Life Map and mirror",
    status: "preview_only",
    message:
      "Life Map, replay, mirror, demo, privacy, and terms are preview surfaces until live route and release evidence is captured.",
  },
  {
    id: "preview",
    label: "Public preview",
    status: "preview_only",
    message:
      "This launch is a public preview while dynamic service wiring, persistence, monitoring, and rollback proof remain gated.",
  },
  {
    id: "private-actions",
    label: "Private actions",
    status: "preview_only",
    message:
      "Write actions, private account behavior, and provider-backed service calls remain off on the public preview surface.",
  },
];

export default function StatusGrid() {
  const updatedAt = "Static preview truth";

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Preview service map</h2>
          <p className="text-sm text-white/50">
            Static-safe launch posture. No uptime, backend, provider, or rollback claim is made here.
          </p>
        </div>
        <div className="text-xs text-white/40">Updated {updatedAt}</div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {SERVICES.map((service) => {
          const tone = STATUS_LABELS[service.status];
          return (
            <article
              key={service.id}
              className={`group flex h-full flex-col justify-between rounded-2xl border px-5 py-4 transition hover:border-white/40 hover:bg-white/[0.08] ${tone.bg}`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-semibold text-white">{service.label}</h3>
                <span className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-current/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide ${tone.text}`}>
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {tone.label}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{service.message}</p>
              <footer className="mt-4 text-xs text-white/40">{updatedAt}</footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}
