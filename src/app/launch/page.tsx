import type { Metadata } from "next";
import Link from "next/link";
import { WaitlistCapture } from "@/components/launch/WaitlistCapture";

const description = "URAI Genesis is a public demo for a privacy-gated reflection product: symbolic Life Map, consent boundaries, and roadmap systems labeled before they go live.";

export const metadata: Metadata = {
  title: "URAI Public Demo - Symbolic Life Map",
  description,
  openGraph: {
    title: "URAI Public Demo - Symbolic Life Map",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "URAI Public Demo - Symbolic Life Map",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
};

const surfaces = [
  ["The Orb", "Demo doorway", "A calm demo doorway for seeing how URAI explains what is sample, private, or gated.", "/orb", "Open Orb"],
  ["Life Map", "Public demo", "A symbolic sky of chosen demo moments, not an active passive memory feed.", "/life-map", "Open Life Map"],
  ["Ground", "Preview metaphor", "A roadmap metaphor for real-life context that remains gated until evidence is complete.", "/ground", "Open Ground"],
  ["Mirror", "Gentle preview", "Gentle pattern reflection without diagnosis, verdicts, or medical claims.", "/cognitive-mirror", "Open Mirror"],
  ["Passport", "Consent-first", "The consent model for controlling what opens, exports, or stays closed.", "/passport", "Review Passport"],
  ["Legacy", "Gated future", "Future user-chosen moments, not an active data marketplace or automated archive.", "", "No public unlock yet"],
] as const;

const trustCards = [
  ["Passport first", "Passport is the planned control layer for what URAI may see, remember, reflect, use in AI replies, or export."],
  ["Private by default", "Sensitive layers stay closed unless evidence, consent, and approval gates pass."],
  ["Demo uses sample data", "The public demo shows the shape of URAI without exposing anyone's private life or claiming production readiness."],
  ["What URAI is not", "URAI helps users reflect on patterns. It does not diagnose, treat, determine truth, sell user data, or operate as emergency support."],
] as const;

const demoSteps = [
  ["Enter Demo", "/home", "start in the Genesis home world"],
  ["Open Life Map", "/life-map", "see the symbolic demo sky"],
  ["Focus a memory star", "/focus", "narrow attention gently"],
  ["Replay the sample thread", "/replay", "view cinematic preview states"],
  ["Review Passport", "/passport", "see consent boundaries"],
  ["Check Status", "/status", "verify launch posture"],
] as const;

const navLink = "inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 text-sm text-white/72 transition hover:border-cyan-200/40 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200";
const panel = "border border-white/10 bg-slate-950/55 shadow-2xl shadow-black/35 backdrop-blur-2xl";

export default function LaunchPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_16%_8%,rgba(45,212,191,0.2),transparent_32rem),radial-gradient(circle_at_76%_0%,rgba(125,211,252,0.18),transparent_30rem),linear-gradient(145deg,#020617_0%,#07111f_48%,#03040a_100%)] text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-48 -top-56 h-[48rem] w-[48rem] rounded-full border border-cyan-200/10 shadow-[0_0_90px_rgba(45,212,191,0.12)]" />
        <div className="absolute -left-64 bottom-[12%] h-[44rem] w-[44rem] rounded-full border border-amber-200/10" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:76px_76px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950" />
      </div>

      <div className="relative z-10 mx-auto w-[min(1200px,calc(100%-2rem))] pb-24 pt-7">
        <nav className={`${panel} flex items-center justify-between gap-4 rounded-full px-4 py-3`} aria-label="Launch navigation">
          <Link href="/home" className="inline-flex min-h-11 items-center gap-3 rounded-full font-extrabold tracking-[0.16em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
            <span className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_28px_rgba(103,232,249,0.9)]" aria-hidden="true" />
            URAI
          </Link>
          <div className="flex flex-wrap justify-end gap-2">
            <Link href="/home" className={navLink}>Enter Demo</Link>
            <Link href="/life-map" className={navLink}>Life Map</Link>
            <Link href="/passport" className={navLink}>Passport</Link>
            <Link href="/status" className={navLink}>Status</Link>
          </div>
        </nav>        <section className={`${panel} relative mt-4 grid overflow-hidden rounded-[2.5rem] p-6 sm:p-10 lg:grid-cols-[1.08fr_0.92fr] lg:p-16`} aria-labelledby="launch-title">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(255,255,255,0.08),transparent_13rem),linear-gradient(120deg,rgba(34,211,238,0.09),transparent_48%)]" aria-hidden="true" />
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">URAI Public Demo</p>
            <h1 id="launch-title" className="mt-5 max-w-3xl text-[clamp(4rem,10vw,7.6rem)] font-semibold leading-[0.86] tracking-[-0.07em] text-white">Your life, reflected gently.</h1>
            <p className="mt-6 max-w-3xl text-[clamp(1.35rem,3vw,2.25rem)] leading-[1.08] tracking-[-0.045em] text-teal-100">URAI turns chosen memories into a private symbolic Life Map, then lets you focus, replay, and protect each layer through consent.</p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">The public demo uses sample data. Private systems stay gated until consent, privacy, and launch evidence gates pass.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/home" className="inline-flex min-h-12 items-center justify-center rounded-full border border-teal-100/40 bg-gradient-to-br from-teal-300 to-cyan-200 px-6 text-sm font-extrabold text-teal-950 shadow-[0_18px_44px_rgba(20,184,166,0.25)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" aria-label="Enter the URAI public demo">Enter Demo</Link>
              <a href="#waitlist" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/8 px-6 text-sm font-bold text-white/82 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/12 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" aria-label="Join the URAI waitlist">Join Waitlist</a>
              <Link href="/status" className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-200/25 bg-amber-200/10 px-6 text-sm font-bold text-amber-50 transition hover:-translate-y-0.5 hover:bg-amber-200/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" aria-label="Open URAI system status">System Status</Link>
            </div>
          </div>

          <aside className="relative z-10 mt-10 min-h-[330px] overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-[radial-gradient(circle_at_50%_34%,rgba(125,211,252,0.24),transparent_12rem),radial-gradient(circle_at_50%_62%,rgba(20,184,166,0.22),transparent_18rem),linear-gradient(180deg,rgba(15,23,42,0.22),rgba(2,6,23,0.9))] lg:mt-0 lg:min-h-[520px]" aria-label="Symbolic URAI launch preview">
            <div className="absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_18%_20%,rgba(248,250,252,0.9)_0_1px,transparent_2px),radial-gradient(circle_at_72%_24%,rgba(125,211,252,0.75)_0_1px,transparent_2px),radial-gradient(circle_at_44%_42%,rgba(153,246,228,0.7)_0_1px,transparent_2px),radial-gradient(circle_at_82%_58%,rgba(248,250,252,0.6)_0_1px,transparent_2px)]" />
            <div className="absolute inset-x-[10%] bottom-[24%] top-[10%] rotate-[-10deg] rounded-full border border-teal-200/15">
              <span className="absolute left-[22%] top-[28%] h-3.5 w-3.5 rounded-full bg-sky-100 shadow-[0_0_24px_rgba(125,211,252,0.8)]" />
              <span className="absolute left-[58%] top-[20%] h-3.5 w-3.5 rounded-full bg-sky-100 shadow-[0_0_24px_rgba(125,211,252,0.8)]" />
              <span className="absolute left-[72%] top-[62%] h-3.5 w-3.5 rounded-full bg-sky-100 shadow-[0_0_24px_rgba(125,211,252,0.8)]" />
              <span className="absolute left-[24%] top-[31%] h-px w-[38%] rotate-[-8deg] bg-gradient-to-r from-teal-200/50 to-transparent" />
              <span className="absolute left-[59%] top-[24%] h-px w-[25%] rotate-[50deg] bg-gradient-to-r from-teal-200/50 to-transparent" />
            </div>
            <div className="absolute left-1/2 top-[54%] h-[min(38vw,12rem)] w-[min(38vw,12rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#f8fafc_0_8%,#67e8f9_20%,rgba(20,184,166,0.16)_62%,transparent_74%)] drop-shadow-[0_0_42px_rgba(103,232,249,0.75)]" />
            <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(153,246,228,0.24),transparent_42%),linear-gradient(180deg,transparent,rgba(0,0,0,0.72))]" />
            <div className="absolute bottom-5 right-5 max-w-xs rounded-2xl border border-white/15 bg-slate-950/60 p-4">
              <span className="block text-xs font-black uppercase tracking-[0.12em] text-white/56">Sample data only</span>
              <strong className="mt-1 block text-white">Consent-gated preview</strong>
            </div>
          </aside>
        </section>

        <section className={`${panel} mt-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl px-5 py-4 text-white/72`} aria-label="Launch status summary">
          <span>Public demo routes are available.</span>
          <span>Systems remain marked preview until release evidence is verified.</span>
          <Link href="/status" className="font-extrabold text-teal-200 underline-offset-4 hover:underline">Read status</Link>
        </section>

        <section id="waitlist" className={`${panel} mt-4 grid items-center gap-6 rounded-[2rem] p-6 sm:p-9 lg:grid-cols-[0.9fr_0.7fr]`} aria-labelledby="waitlist-title">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Early Access</p>
            <h2 id="waitlist-title" className="mt-4 text-[clamp(2.1rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.06em]">Join the quiet launch path.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/68">The waitlist is for access updates only. It does not unlock passive sensing, provider-backed media generation, private accounts, outbound communications, or data marketplace systems.</p>
          </div>
          <WaitlistCapture source="launch" />
        </section>

        <section className={`${panel} mt-4 grid items-center gap-6 rounded-[2rem] p-6 sm:p-9 lg:grid-cols-[1fr_0.75fr]`} aria-labelledby="story-title">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Product Story</p>
            <h2 id="story-title" className="mt-4 text-[clamp(2.1rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.06em]">Not another dashboard.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/68">URAI does not pressure you with surveillance or productivity noise. It turns chosen moments into a quiet symbolic world while private systems remain gated.</p>
          </div>
          <div className="grid gap-3" aria-label="URAI flow summary">
            {['Chosen moment', 'Life Map', 'Focus', 'Replay', 'Passport'].map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-white/88">{item}</span>)}
          </div>
        </section>        <section className={`${panel} mt-4 rounded-[2rem] p-6 sm:p-9`} aria-labelledby="surfaces-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Product Surfaces</p>
            <h2 id="surfaces-title" className="mt-4 text-[clamp(2.1rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.06em]">One coherent symbolic life system.</h2>
            <p className="mt-4 text-base leading-7 text-white/68">Every module is labelled by its current launch state. Preview and gated systems stay honest until code, tests, deploy evidence, consent, and smoke proof exist.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {surfaces.map(([name, state, body, href, cta]) => (
              <article key={name} className="flex min-h-[280px] flex-col justify-between rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(45,212,191,0.1),transparent_14rem)] bg-white/[0.055] p-5">
                <div>
                  <div className="h-9 w-9 rounded-full border border-teal-200/30 bg-[radial-gradient(circle,rgba(248,250,252,0.85),rgba(45,212,191,0.2)_48%,transparent_72%)] shadow-[0_0_28px_rgba(45,212,191,0.25)]" />
                  <span className="mt-5 inline-flex min-h-8 items-center rounded-full border border-teal-200/25 px-3 text-xs font-black uppercase tracking-[0.08em] text-teal-200">{state}</span>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{name}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/66">{body}</p>
                </div>
                {href ? <Link href={href} className="mt-5 inline-flex min-h-11 w-fit items-center rounded-full border border-teal-200/25 bg-white/[0.055] px-4 text-sm font-extrabold text-teal-200 transition hover:border-teal-100/50 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">{cta}</Link> : <span className="mt-5 inline-flex min-h-8 w-fit items-center rounded-full border border-amber-200/25 px-3 text-xs font-black uppercase tracking-[0.08em] text-amber-200">{cta}</span>}
              </article>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2rem] p-6 sm:p-9`} aria-labelledby="trust-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Trust Manifesto</p>
            <h2 id="trust-title" className="mt-4 text-[clamp(2.1rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.06em]">Launch-safe by design.</h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {trustCards.map(([title, body]) => (
              <article key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5">
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/66">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2rem] p-6 sm:p-9`} aria-labelledby="demo-flow-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">How to experience the demo</p>
            <h2 id="demo-flow-title" className="mt-4 text-[clamp(2.1rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.06em]">A clear first path through Genesis.</h2>
          </div>
          <ol className="mt-7 grid gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">
            {demoSteps.map(([label, href, note], index) => (
              <li key={label} className="list-none rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-5">
                <span className="block text-xs font-black tracking-[0.16em] text-teal-200/70">{String(index + 1).padStart(2, "0")}</span>
                <Link href={href} className="mt-2 inline-flex text-lg font-extrabold text-white transition hover:text-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">{label}</Link>
                <p className="mt-2 text-sm leading-6 text-white/62">{note}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${panel} mt-4 grid items-center gap-6 rounded-[2rem] bg-[radial-gradient(circle_at_12%_0%,rgba(250,204,21,0.1),transparent_18rem)] p-6 sm:p-9 lg:grid-cols-[0.82fr_1fr]`} aria-labelledby="mission-title">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Why URAI exists</p>
            <h2 id="mission-title" className="mt-4 text-[clamp(2.1rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.06em]">People should understand their lives without feeling watched.</h2>
          </div>
          <p className="text-base leading-7 text-white/68">URAI began from a simple belief: people should be able to understand their lives without feeling judged or reduced to metrics. The first public demo is symbolic on purpose. It shows the shape of the system before private layers open.</p>
        </section>

        <footer className={`${panel} mt-4 grid items-center gap-4 rounded-[2rem] p-6 text-sm text-white/62 sm:p-7 lg:grid-cols-[1fr_auto]`}>
          <p>URAI Genesis public demo - sample data, consent-first boundaries, evidence-gated claims.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/privacy" className={navLink}>Privacy</Link>
            <Link href="/terms" className={navLink}>Terms</Link>
            <Link href="/support" className={navLink}>Support</Link>
            <a href="mailto:support@urai.app" className={navLink}>Email</a>
          </div>
        </footer>
      </div>
    </main>
  );
}