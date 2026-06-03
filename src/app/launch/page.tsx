import type { Metadata } from "next";
import Link from "next/link";
import { WaitlistCapture } from "@/components/launch/WaitlistCapture";

const description = "URAI is a privacy-first AI companion and symbolic life map where users control what opens, reflects, remembers, and leaves.";

export const metadata: Metadata = {
  title: "URAI Genesis — Private AI Companion + Symbolic Life Map",
  description,
  openGraph: {
    title: "URAI Genesis — Private AI Companion + Symbolic Life Map",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "URAI Genesis — Private AI Companion + Symbolic Life Map",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
};

export default function LaunchPage() {
  const genesisWorld = [
    ["The Orb", "A calm companion doorway for asking what URAI can see and why."],
    ["Life Map", "A private sky of chosen symbolic moments."],
    ["Ground", "Roots, blooms, and small rituals for return."],
    ["Mirror", "Gentle pattern reflection without verdicts."],
    ["Passport", "The permission system that controls what opens."],
    ["Legacy", "Moments users choose to carry forward."],
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,#233866_0%,#080914_56%,#03040a_100%)] px-5 py-10 text-white">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="rounded-[2rem] border border-white/10 bg-black/24 p-7 shadow-2xl backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-white/42">URAI Genesis</p>
          <h1 className="mt-4 text-4xl font-medium tracking-tight md:text-6xl">Your life, reflected gently.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">URAI is a private AI companion and symbolic life map where your sky, Ground, Mirror, and memories respond only to the layers you choose to open.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/demo" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black">Enter Demo</Link>
            <a href="#waitlist" className="rounded-full bg-white/[0.08] px-5 py-3 text-sm text-white/74">Join Waitlist</a>
          </div>
          <p className="mt-4 text-xs leading-5 text-white/42">The public demo uses sample data. It shows how URAI feels without exposing anyone’s private life.</p>
        </div>
        <div id="waitlist">
          <WaitlistCapture source="launch" />
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-xl md:col-span-3">
          <h2 className="text-2xl font-medium">Not another dashboard</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62">URAI is not built around charts, streaks, or pressure. It turns reflection into a quiet visual world.</p>
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
          <p className="mt-2 text-sm leading-6 text-white/62">Passport controls what URAI can see, remember, reflect, use in AI replies, or export.</p>
        </article>
        <article className="rounded-[1.5rem] border border-white/10 bg-black/24 p-5 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-medium">Private by default</h2>
          <p className="mt-2 text-sm leading-6 text-white/62">Sensitive layers stay closed unless you open them. Shadow, Legacy, Exports, notifications, audio capture, location, health, Gmail, and relationships are never enabled by safe defaults.</p>
        </article>
        <article className="rounded-[1.5rem] border border-white/10 bg-black/24 p-5 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-medium">What URAI is not</h2>
          <p className="mt-2 text-sm leading-6 text-white/62">URAI helps users reflect on patterns. It does not diagnose, treat, or determine truth.</p>
        </article>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-[1.75rem] border border-white/10 bg-black/24 p-6 text-white/68 shadow-2xl backdrop-blur-xl">
        <h2 className="text-2xl font-medium text-white">Why URAI exists</h2>
        <p className="mt-3 text-sm leading-6">URAI began from a simple belief: people should be able to understand their lives without feeling watched, judged, or reduced to a dashboard. Genesis is visual and emotional because people are more than data points.</p>
      </section>
    </main>
  );
}
