import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy | URAI",
  description: "URAI privacy posture for the public demo: consent boundaries, data rights, export/delete expectations, and reflective safety limits.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy | URAI",
    description: "Consent, data-rights, and safety boundaries for the URAI public demo.",
    url: "/privacy",
    images: [{ url: "/og/urai-public-demo.svg", width: 1200, height: 630, alt: "URAI privacy posture" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy | URAI",
    description: "Consent, data-rights, and safety boundaries for the URAI public demo.",
    images: ["/og/urai-public-demo.svg"],
  },
};

const principles = [
  {
    title: "Private by default",
    body: "URAI's public demo uses public-safe sample surfaces. Private inputs and future signal types must stay gated behind consent, owner-only access, export/delete, retention, and audit proof before they become live features.",
  },
  {
    title: "User-controlled memory",
    body: "Every surfaced star should be hideable, correctable, exportable, or removable. Sensitive data paths remain roadmap-only until those controls are implemented and verified.",
  },
  {
    title: "Reflective, not diagnostic",
    body: "URAI describes patterns and emotional weather. It does not diagnose, replace care, or make fixed claims about who you are.",
  },
];

const controls = ["Hide a memory star", "Mark an insight inaccurate", "Disable similar signal types", "Export your account data", "Delete source signals"];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#000108] text-white">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        <Link href="/" className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 hover:text-white">
          Return home
        </Link>
        <header className="mt-10 max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-white/45">Privacy field</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Your map belongs to you.</h1>
          <p className="text-base leading-relaxed text-white/65 sm:text-lg">
            URAI is designed to make patterns visible without making your private life public. The Life Map should remain symbolic, consent-aware, and reversible.
          </p>
          <p className="text-sm leading-relaxed text-white/55">
            For the broader URAI trust center, visit <a href="https://uraiprivacy.com" className="inline-flex min-h-9 items-center rounded-full text-white underline underline-offset-4">URAI Privacy</a>.
          </p>
        </header>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <article key={principle.title} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/30">
              <h2 className="text-lg font-semibold text-white">{principle.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/62">{principle.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-[2rem] border border-cyan-200/10 bg-cyan-100/[0.035] p-6">
          <h2 className="text-xl font-semibold">Controls required before private-account launch</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {controls.map((control) => (
              <div key={control} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                {control}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 text-sm leading-relaxed text-white/65">
          <h2 className="text-xl font-semibold text-white">Safety note</h2>
          <p className="mt-3">
            URAI insights are reflective AI patterns. They are not medical, legal, or clinical determinations. When a signal looks sensitive, the interface should slow down, summarize gently, and point users toward real support.
          </p>
          <p className="mt-4">
            Questions? <a href="mailto:privacy@urai.app" className="inline-flex min-h-9 items-center rounded-full text-white underline underline-offset-4">privacy@urai.app</a>
          </p>
        </section>
      </div>
    </main>
  );
}
