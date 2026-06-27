import Link from "next/link";
import type { Metadata } from "next";

const title = "URAI Genesis | Cinematic Life Map Demo";
const description = "Walk the URAI Genesis friend-demo path: Home, Life Map, Focus, Replay, and Waitlist with sample data only and clearly gated future systems.";
const shareImage = "/og/urai-public-demo.svg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "URAI",
    title,
    description,
    images: [{ url: shareImage, width: 1200, height: 630, alt: "URAI public demo preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [shareImage],
  },
};

const demoPromises = [
  {
    title: "A living world, safely staged",
    body: "Genesis shows the feeling of URAI as an orb, sky, memory galaxy, focus chamber, and cinematic replay path without opening private user data.",
  },
  {
    title: "Sample memories are labeled",
    body: "The Life Map uses demo-safe stars for moments, places, people, time, and meaning. Nothing here is presented as a real private account.",
  },
  {
    title: "The future stays gated",
    body: "Personalized films, provider media generation, passive sensing, agents, and marketplace systems remain roadmap-gated until evidence proves them.",
  },
];

const launchLinks = [
  { href: "/home", label: "Enter Genesis Home", note: "Orb / sky / ground" },
  { href: "/life-map", label: "Open Life Map", note: "Sample memory world" },
  { href: "/focus", label: "Enter Focus", note: "What matters now" },
  { href: "/replay", label: "Open Replay", note: "Genesis preview reel" },
  { href: "/waitlist", label: "Join Waitlist", note: "Real early-access CTA" },
  { href: "/ground", label: "Touch Ground", note: "Calm preview" },
  { href: "/orb", label: "Meet Orb", note: "Companion identity" },
  { href: "/orb-chat", label: "Open Orb Chat", note: "Safe fallback" },
  { href: "/sky", label: "Open Sky", note: "Reflection field" },
  { href: "/horizon", label: "See Horizon", note: "Future-path preview" },
  { href: "/system", label: "View system status", note: "Registry and production-lock truth" },
];

const demoPath = [
  { step: "01", title: "Home", body: "The orb opens the field before anything private unlocks." },
  { step: "02", title: "Life Map", body: "Sample stars show moments, people, places, time, and meaning." },
  { step: "03", title: "Focus", body: "URAI narrows the galaxy into one humane next step." },
  { step: "04", title: "Replay", body: "A cinematic preview shows where memory-to-film can go later." },
  { step: "05", title: "Waitlist", body: "Friends have a real place to raise their hand." },
];

export default function RootPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-white">
      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12 sm:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(45,212,191,0.12),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0),rgba(3,7,18,0.95))]" />

        <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:items-end">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-cyan-200/75">URAI Genesis friend demo</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.065em] text-white sm:text-7xl">
              Walk through a living memory world.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              URAI Genesis is a cinematic, privacy-safe demo path from Home to Life Map to Focus to Replay. It shows the product direction without pretending private data, personalized films, passive sensing, or provider generation are live.
            </p>
          </div>

          <div className="relative min-h-80 overflow-hidden rounded-[2.5rem] border border-cyan-100/15 bg-white/[0.045] p-5 shadow-2xl shadow-cyan-950/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(191,233,255,.26),transparent_32%),radial-gradient(circle_at_50%_74%,rgba(45,212,191,.14),transparent_32%),linear-gradient(180deg,rgba(2,6,23,.2),rgba(0,0,0,.82))]" />
            <div className="absolute left-1/2 top-[42%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/20 bg-cyan-100/10 shadow-[0_0_110px_rgba(125,211,252,.28)]" />
            <div className="absolute left-1/2 top-[42%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_70px_rgba(255,255,255,.42)]" />
            <div className="absolute inset-x-8 bottom-8 rounded-[1.5rem] border border-white/10 bg-black/34 p-4 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-100/70">Friend-demo route</p>
              <p className="mt-2 text-sm leading-6 text-white/72">Home to Life Map to Focus to Replay to Waitlist. Every step is real, sample-only, and launch-safe.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/home" className="rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30">
            Start the Genesis path
          </Link>
          <Link href="/life-map" className="rounded-full border border-cyan-200/25 bg-cyan-200/[0.08] px-5 py-3 text-sm font-semibold text-cyan-50 hover:bg-cyan-200/[0.12]">
            Jump to Life Map
          </Link>
          <Link href="/waitlist" className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.1]">
            Join waitlist
          </Link>
          <Link href="/system" className="rounded-full border border-amber-200/25 bg-amber-200/[0.08] px-5 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-200/[0.12]">
            Check launch truth
          </Link>
        </div>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {demoPromises.map((item) => (
            <article key={item.title} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20">
              <h2 className="text-base font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/64">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-5 grid gap-3 lg:grid-cols-5">
          {demoPath.map((item) => (
            <article key={item.step} className="rounded-[1.5rem] border border-white/10 bg-black/24 p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/52">{item.step}</span>
              <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-5 rounded-[2rem] border border-cyan-200/15 bg-cyan-200/[0.045] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100/70">Launch-safe paths</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">Every primary action goes somewhere real.</h2>
            </div>
            <Link href="/privacy" className="inline-flex min-h-9 items-center rounded-full text-sm font-semibold text-cyan-100 underline underline-offset-4">
              Review privacy posture
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {launchLinks.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/72 hover:border-cyan-200/30 hover:bg-cyan-200/[0.06]">
                <span className="block font-semibold text-white">{item.label}</span>
                <span className="mt-1 block text-white/52">{item.note}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-amber-200/20 bg-amber-200/[0.07] p-5 text-sm leading-6 text-amber-50/78">
          <h2 className="text-base font-semibold text-amber-50">Safety boundary</h2>
          <p className="mt-2">
            URAI does not claim production readiness from this page. Passive sensing, outbound communications, therapy-adjacent behavior, monetization, live provider integrations, and user-derived intelligence remain gated until privacy, evidence, monitoring, rollback, and launch checks pass.
          </p>
        </section>

        <footer className="mt-8 flex flex-wrap gap-3 text-sm text-white/50">
          <Link href="/privacy" className="inline-flex min-h-9 items-center rounded-full px-1 hover:text-white">Privacy</Link>
          <Link href="/terms" className="inline-flex min-h-9 items-center rounded-full px-1 hover:text-white">Terms</Link>
          <Link href="/system" className="inline-flex min-h-9 items-center rounded-full px-1 hover:text-white">System status</Link>
        </footer>
      </section>
    </main>
  );
}
