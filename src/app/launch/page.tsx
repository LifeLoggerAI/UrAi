import type { Metadata } from "next";
import Link from "next/link";
import { WaitlistCapture } from "@/components/launch/WaitlistCapture";

const description = "URAI is a public demo for a privacy-gated reflection product: symbolic Life Map, consent boundaries, and roadmap systems labeled before they go live.";

export const metadata: Metadata = {
  title: "URAI Public Demo — Symbolic Life Map",
  description,
  openGraph: {
    title: "URAI Public Demo — Symbolic Life Map",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "URAI Public Demo — Symbolic Life Map",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
};

export default function LaunchPage() {
  const genesisWorld = [
    ["The Orb", "A calm demo doorway for seeing how URAI explains what is sample, private, or gated."],
    ["Life Map", "A symbolic sky of chosen demo moments, not an active passive memory feed."],
    ["Ground", "A roadmap metaphor for real-life context that remains gated until evidence is complete."],
    ["Mirror", "Gentle pattern reflection without diagnosis, verdicts, or medical claims."],
    ["Passport", "The planned permission model for controlling what opens, exports, or stays closed."],
    ["Legacy", "Future user-chosen moments, not an active data marketplace or automated archive."],
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,#233866_0%,#080914_56%,#03040a_100%)] px-5 py-10 text-white">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="rounded-[2rem] border border-white/10 bg-black/24 p-7 shadow-2xl backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-white/42">URAI public demo</p>
          <h1 className="mt-4 text-4xl font-medium tracking-tight md:text-6xl">Your life, reflected gently.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">URAI is a public demo for a symbolic Life Map and privacy-gated reflection product. Private-account, companion, sensing, export, and provider systems stay gated until evidence proves they are safe.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/demo" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black">Enter Demo</Link>
            <a href="#waitlist" className="rounded-full bg-white/[0.08] px-5 py-3 text-sm text-white/74">Join Waitlist</a>
            <Link href="/system" className="rounded-full bg-amber-200/[0.12] px-5 py-3 text-sm text-amber-50">System Status</Link>
          </div>
          <p className="mt-4 text-xs leading-5 text-white/42">The public demo uses sample data. It shows how URAI feels without exposing anyone&apos;s private life or claiming production readiness.</p>
        </div>
        <div id="waitlist">
          <WaitlistCapture source="launch" />
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-xl md:col-span-3">
          <h2 className="text-2xl font-medium">Not another dashboard</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62">URAI is not built around pressure or surveillance. The demo turns reflection into a quiet visual world while private systems remain gated.</p>
        </article>
        {genesisWorld.map(([title, body]) => (
          <article key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-xl">
            <h2 className="text-lg font-medium">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/62">{body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-white/10 bg-black/24 p-5 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-medium">Passport first</h2>
          <p className="mt-2 text-sm leading-6 text-white/62">Passport is the planned control layer for what URAI may see, remember, reflect, use in AI replies, or export. It is not a passed production gate yet.</p>
        </article>
        <article className="rounded-[1.5rem] border border-white/10 bg-black/24 p-5 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-medium">Private by default</h2>
          <p className="mt-2 text-sm leading-6 text-white/62">Sensitive layers stay closed unless evidence gates pass. Shadow, Legacy, Exports, notifications, audio capture, location, health, Gmail, relationships, and provider integrations are not enabled by the public demo.</p>
        </article>
        <article className="rounded-[1.5rem] border border-white/10 bg-black/24 p-5 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-medium">What URAI is not</h2>
          <p className="mt-2 text-sm leading-6 text-white/62">URAI helps users reflect on patterns. It does not diagnose, treat, determine truth, sell user data, or operate as emergency support.</p>
        </article>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-[1.75rem] border border-white/10 bg-black/24 p-6 text-white/68 shadow-2xl backdrop-blur-xl">
        <h2 className="text-2xl font-medium text-white">Why URAI exists</h2>
        <p className="mt-3 text-sm leading-6">URAI began from a simple belief: people should be able to understand their lives without feeling watched, judged, or reduced to a dashboard. The demo is visual and emotional because people are more than data points.</p>
      </section>
    </main>
  );
}
