import Link from "next/link";
import StatusGrid from "@/components/StatusGrid";

export const metadata = {
  title: "Status | URAI",
  description: "Live service health for the URAI platform.",
};

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-20 space-y-12">
        <header className="space-y-4 text-balance">
          <p className="text-sm uppercase tracking-[0.35em] text-white/50">
            Platform health
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            URAI status &amp; reliability
          </h1>
          <p className="text-base leading-relaxed text-white/60">
            This dashboard reflects the current heartbeat of the URAI experience —
            from the web app to Firebase services. It updates automatically, and
            you can always report anything strange via the feedback tools in the
            footer.
          </p>
        </header>

        <StatusGrid />

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-relaxed text-white/70">
          <h2 className="mb-3 text-base font-semibold text-white">
            How we track uptime
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-white">Web app</span>: verifies the Next.js
              build, CDN edge responses, and onboarding flow health.
            </li>
            <li>
              <span className="text-white">Firebase</span>: watches Firestore,
              Functions, and Storage connectivity used for demos, pilots, and
              creator instances.
            </li>
            <li>
              <span className="text-white">Narrator services</span>: ensures the
              realtime narration and recovery bloom generator are reachable.
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
