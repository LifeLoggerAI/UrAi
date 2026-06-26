import Link from "next/link";
import StatusGrid from "@/components/StatusGrid";

export const metadata = {
  title: "Status | URAI",
  description: "Public-demo launch status and gated service readiness for URAI.",
};

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl space-y-12 px-6 pb-24 pt-20">
        <header className="space-y-4 text-balance">
          <p className="text-sm uppercase tracking-[0.35em] text-white/50">
            Platform health
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            URAI status &amp; reliability
          </h1>
          <p className="text-base leading-relaxed text-white/60">
            This dashboard reflects the current public-demo launch posture. Systems without deploy logs,
            tests, screenshots, and smoke evidence remain gated.
          </p>
        </header>

        <StatusGrid />

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-relaxed text-white/70">
          <h2 className="mb-3 text-base font-semibold text-white">
            How we track readiness
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-white">Web app</span>: verifies the Next.js
              build, route smoke behavior, screenshots, and onboarding flow health.
            </li>
            <li>
              <span className="text-white">Firebase</span>: remains evidence-gated until hosting,
              Firestore rules/indexes, Storage rules, and smoke checks are deployed and recorded.
            </li>
            <li>
              <span className="text-white">Narrator and media services</span>: stay demo or gated until
              provider credentials, privacy controls, owner-scoped storage, and live smoke evidence are proven.
            </li>
          </ul>
          <p className="mt-4">
            Need deeper history or a correction? Ping us at
            <a
              href="mailto:press@urai.app"
              className="mx-1 inline-flex min-h-9 items-center rounded-full text-white underline decoration-white/40 decoration-dashed underline-offset-4 hover:decoration-white"
            >
              press@urai.app
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
