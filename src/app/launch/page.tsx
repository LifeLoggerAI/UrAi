import type { Metadata } from "next";
import Link from "next/link";
import { WaitlistCapture } from "@/components/launch/WaitlistCapture";

export const metadata: Metadata = {
  title: "URAI Genesis — Private Symbolic Life Interface",
  description: "A privacy-first AI companion and symbolic life map where users control what opens, reflects, remembers, and leaves.",
  openGraph: {
    title: "URAI Genesis — Private Symbolic Life Interface",
    description: "A privacy-first AI companion and symbolic life map where users control what opens, reflects, remembers, and leaves.",
    images: ["/og/urai-genesis-preview.png"],
  },
};

export default function LaunchPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,#233866_0%,#080914_56%,#03040a_100%)] px-5 py-10 text-white">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="rounded-[2rem] border border-white/10 bg-black/24 p-7 shadow-2xl backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-white/42">URAI Genesis</p>
          <h1 className="mt-4 text-4xl font-medium tracking-tight md:text-6xl">A private symbolic interface for reflection.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">URAI is a cinematic life interface where your sky, Ground, Mirror, and Companion respond only to the layers you choose to open.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/demo" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black">Enter demo</Link>
            <a href="#waitlist" className="rounded-full bg-white/[0.08] px-5 py-3 text-sm text-white/74">Join waitlist</a>
          </div>
          <p className="mt-4 text-xs leading-5 text-white/42">The public demo uses sample data and does not show private user information.</p>
        </div>
        <WaitlistCapture source="launch" />
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-3">
        {[
          ["What URAI is", "A private reflection interface for symbolic memory, mood, Ground, Mirror, Life Map, and Companion experiences."],
          ["What URAI is not", "URAI is not a medical device, therapist, emergency service, diagnostic tool, lie detector, or surveillance tool."],
          ["Passport promise", "Passport controls what opens, reflects, remembers, syncs, and leaves."],
          ["Companion", "A calm guide that can explain opened layers without claiming hidden certainty."],
          ["Life Map", "A sky of sample stars in the demo, designed to show how chosen moments can become symbolic."],
          ["Ground and Mirror", "Ground supports simple return rituals. Mirror reflects visible patterns without verdicts."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-xl">
            <h2 className="text-lg font-medium">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/62">{body}</p>
          </article>
        ))}
      </section>

      <section id="waitlist" className="mx-auto mt-8 max-w-3xl rounded-[1.75rem] border border-white/10 bg-black/24 p-6 text-white/68 shadow-2xl backdrop-blur-xl">
        <h2 className="text-2xl font-medium text-white">Founder note</h2>
        <p className="mt-3 text-sm leading-6">URAI is being prepared as a privacy-first, permission-led Genesis experience. The launch demo is intentionally sample-only so the product can be seen without exposing private data.</p>
      </section>
    </main>
  );
}
