import StatusGrid from "@/components/StatusGrid";

export const metadata = {
  title: "Status | URAI",
  description: "Preview service status for the URAI public demo.",
};

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-20 space-y-12">
        <header className="space-y-4 text-balance">
          <p className="text-sm uppercase tracking-[0.35em] text-white/50">
            Preview health
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            URAI status &amp; reliability
          </h1>
          <p className="text-base leading-relaxed text-white/60">
            This page reports the public demo posture for URAI. It does not claim
            full production monitoring, backend uptime, provider health, or
            private-service availability until deployment, rollback, and alerting
            evidence is published.
          </p>
        </header>

        <StatusGrid />

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-relaxed text-white/70">
          <h2 className="mb-3 text-base font-semibold text-white">
            What this status page proves now
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-white">Public routes</span>: the source
              includes route and smoke-test coverage for the main public demo
              surfaces; live route parity still needs release evidence.
            </li>
            <li>
              <span className="text-white">Firebase</span>: configuration points
              at the intended project, but deployed rules, write persistence, and
              release metadata must be proven before production claims.
            </li>
            <li>
              <span className="text-white">Narrator and companion services</span>:
              local/demo behavior and provider-capable source paths exist, but
              deployed provider smoke and monitoring evidence are still required.
            </li>
          </ul>
          <p className="mt-4">
            Need deeper history or an export? Ping us at
            <a
              href="mailto:press@urai.app"
              className="text-white underline decoration-white/40 decoration-dashed underline-offset-4 hover:decoration-white"
            >
              {" "}
              press@urai.app
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
