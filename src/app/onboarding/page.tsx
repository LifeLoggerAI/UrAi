import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Begin URAI Genesis with a consent-first onboarding path. Public demo mode uses safe sample and empty states while private layers stay gated.";

export const metadata: Metadata = {
  title: "Genesis Onboarding - Consent First",
  description,
  openGraph: {
    title: "URAI Genesis Onboarding - Consent First",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "URAI Genesis Onboarding - Consent First",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
};

const navLink =
  "inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 text-sm text-white/72 transition hover:border-cyan-200/40 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200";

const panel = "border border-white/10 bg-slate-950/58 shadow-2xl shadow-black/35 backdrop-blur-2xl";

const sequenceSteps = [
  {
    step: "01",
    chip: "Recommended",
    title: "Set your privacy baseline",
    body: "Start with consent-first controls before URAI stores or reflects anything personal.",
    href: "/privacy",
    cta: "Review privacy",
  },
  {
    step: "02",
    chip: "Consent-first",
    title: "Open your Passport",
    body: "Passport is where identity, consent, export, and data ownership boundaries live.",
    href: "/passport",
    cta: "Open Passport",
  },
  {
    step: "03",
    chip: "Safe demo",
    title: "Enter the URAI home",
    body: "Move into the launch experience with safe empty states until real user data exists.",
    href: "/home",
    cta: "Continue home",
  },
] as const;

const opensNow = [
  ["Home", "Demo", "The public demo entry point.", "/home"],
  ["Life Map", "Preview", "A symbolic sample memory sky.", "/life-map"],
  ["Passport", "Consent-first", "Consent and privacy control surface.", "/passport"],
  ["Status", "Public status", "Public launch evidence and readiness.", "/status"],
] as const;

const flow = [
  ["Consent", "/privacy"],
  ["Passport", "/passport"],
  ["Home", "/home"],
  ["Life Map", "/life-map"],
  ["Focus", "/focus"],
  ["Replay", "/replay"],
] as const;

export default function OnboardingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.2),transparent_30rem),radial-gradient(circle_at_82%_12%,rgba(45,212,191,0.16),transparent_28rem),radial-gradient(circle_at_48%_55%,rgba(250,204,21,0.08),transparent_34rem),linear-gradient(145deg,#020617_0%,#07111f_48%,#03040a_100%)] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-12 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full border border-cyan-200/10 shadow-[0_0_100px_rgba(45,212,191,0.12)]" />
        <div className="absolute -left-64 bottom-8 h-[38rem] w-[38rem] rounded-full border border-amber-200/10" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] [background-size:82px_82px]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_100%,rgba(20,184,166,0.12),transparent_54%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-[min(1180px,100%)] flex-col pb-16">
        <nav className={`${panel} flex items-center justify-between gap-4 rounded-full px-4 py-3`} aria-label="Onboarding navigation">
          <Link href="/launch" className="inline-flex min-h-11 items-center gap-3 rounded-full font-extrabold tracking-[0.16em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
            <span className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_28px_rgba(103,232,249,0.9)]" aria-hidden="true" />
            URAI
          </Link>
          <div className="flex flex-wrap justify-end gap-2">
            <Link href="/demo" className={navLink}>Demo</Link>
            <Link href="/passport" className={navLink}>Passport</Link>
            <Link href="/privacy" className={navLink}>Privacy</Link>
            <Link href="/status" className={navLink}>Status</Link>
          </div>
        </nav>

        <section className={`${panel} relative mt-4 grid flex-1 items-center gap-8 overflow-hidden rounded-[2.5rem] p-6 sm:p-10 lg:grid-cols-[0.98fr_1.02fr] lg:p-14`} aria-labelledby="onboarding-title">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.08),transparent_13rem),linear-gradient(120deg,rgba(14,165,233,0.1),transparent_48%)]" aria-hidden="true" />

          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Launch Onboarding</p>
            <h1 id="onboarding-title" className="mt-5 text-[clamp(3.4rem,8vw,6.8rem)] font-semibold leading-[0.88] tracking-[-0.07em] text-white">
              Begin with consent. Then build the Life Map.
            </h1>
            <p className="mt-6 max-w-2xl text-[clamp(1.12rem,2.3vw,1.7rem)] leading-[1.18] tracking-[-0.04em] text-teal-100">
              URAI starts from a simple rule: private life data stays under your control. This launch path opens people into the app while unfinished sensing, generated media, and automation systems stay clearly gated.
            </p>
            <p className="mt-5 max-w-2xl rounded-2xl border border-cyan-200/14 bg-cyan-200/[0.055] px-4 py-3 text-sm leading-6 text-white/72">
              Public demo mode uses safe sample and empty states until private layers are opened by consent.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" aria-label="Onboarding actions">
              <Link href="/home" className="inline-flex min-h-12 items-center justify-center rounded-full border border-teal-100/40 bg-gradient-to-br from-teal-300 to-cyan-200 px-6 text-sm font-extrabold text-teal-950 shadow-[0_18px_44px_rgba(20,184,166,0.25)] transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" aria-label="Continue to URAI Home">
                Continue to URAI Home
              </Link>
              <Link href="/passport" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.075] px-6 text-sm font-bold text-white/82 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/12 hover:text-white active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" aria-label="Review Passport first">
                Review Passport First
              </Link>
              <Link href="/status" className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-200/25 bg-amber-200/10 px-6 text-sm font-bold text-amber-50 transition hover:-translate-y-0.5 hover:bg-amber-200/15 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" aria-label="View system status">
                View System Status
              </Link>
            </div>
          </div>

          <aside className="relative z-10 overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-[radial-gradient(circle_at_50%_20%,rgba(125,211,252,0.2),transparent_12rem),radial-gradient(circle_at_50%_68%,rgba(20,184,166,0.16),transparent_18rem),linear-gradient(180deg,rgba(15,23,42,0.38),rgba(2,6,23,0.92))] p-5" aria-labelledby="safe-start-title">
            <div aria-hidden="true" className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_18%_20%,rgba(248,250,252,0.75)_0_1px,transparent_2px),radial-gradient(circle_at_72%_24%,rgba(125,211,252,0.65)_0_1px,transparent_2px),radial-gradient(circle_at_44%_42%,rgba(153,246,228,0.55)_0_1px,transparent_2px)]" />
            <div aria-hidden="true" className="absolute left-1/2 top-[36%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/18 shadow-[0_0_70px_rgba(45,212,191,0.18)]" />
            <div aria-hidden="true" className="absolute left-1/2 top-[36%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#f8fafc_0_8%,#67e8f9_21%,rgba(20,184,166,0.2)_62%,transparent_75%)] drop-shadow-[0_0_42px_rgba(103,232,249,0.75)] motion-safe:animate-pulse" />

            <div className="relative rounded-[1.5rem] border border-white/12 bg-slate-950/70 p-5 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Safe Start Sequence</p>
              <h2 id="safe-start-title" className="mt-3 text-3xl font-semibold tracking-[-0.05em]">Consent before memory.</h2>
              <ol className="mt-5 grid gap-3 p-0" aria-label="Safe start sequence steps">
                {sequenceSteps.map((item) => (
                  <li key={item.title} className="list-none rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-black tracking-[0.18em] text-cyan-100/58">{item.step}</span>
                      <span className="rounded-full border border-cyan-200/20 px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-cyan-100">{item.chip}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold tracking-[-0.035em] text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/62">{item.body}</p>
                    <Link href={item.href} className="mt-4 inline-flex min-h-10 w-fit items-center rounded-full border border-teal-200/25 bg-white/[0.055] px-4 text-sm font-extrabold text-teal-200 transition hover:border-teal-100/50 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                      {item.cta}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </section>

        <section className={`${panel} mt-4 rounded-[2rem] border-amber-200/15 bg-[radial-gradient(circle_at_0_0,rgba(250,204,21,0.11),transparent_18rem)] p-6 sm:p-7`} aria-labelledby="launch-note-title">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-200">Launch note</p>
          <h2 id="launch-note-title" className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">Gated systems stay gated.</h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-white/68">
            Passive sensing, broad communications, data monetization, clinical or therapy claims, autonomous jobs, provider integrations, and production generated media stay gated until privacy, export, delete, audit, and live evidence requirements are satisfied.
          </p>
        </section>

        <section className={`${panel} mt-4 rounded-[2rem] p-6 sm:p-9`} aria-labelledby="opens-now-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">What opens now</p>
            <h2 id="opens-now-title" className="mt-4 text-[clamp(2.1rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em]">The demo starts safely.</h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {opensNow.map(([title, state, body, href]) => (
              <article key={title} className="flex min-h-[220px] flex-col justify-between rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(45,212,191,0.1),transparent_14rem)] bg-white/[0.055] p-5">
                <div>
                  <span className="inline-flex min-h-8 items-center rounded-full border border-teal-200/25 px-3 text-xs font-black uppercase tracking-[0.08em] text-teal-200">{state}</span>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/66">{body}</p>
                </div>
                <Link href={href} className="mt-5 inline-flex min-h-11 w-fit items-center rounded-full border border-teal-200/25 bg-white/[0.055] px-4 text-sm font-extrabold text-teal-200 transition hover:border-teal-100/50 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                  Open {title}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2rem] p-6 sm:p-8`} aria-labelledby="flow-title">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">URAI Genesis flow</p>
              <h2 id="flow-title" className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">A calm route from permission to reflection.</h2>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Genesis onboarding route flow">
              {flow.map(([label, href], index) => (
                <Link key={label} href={href} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 text-sm font-bold text-white/76 transition hover:border-cyan-200/40 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                  <span className="text-cyan-200/70">{String(index + 1).padStart(2, "0")}</span>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <footer className={`${panel} mt-4 grid items-center gap-4 rounded-[2rem] p-6 text-sm text-white/62 sm:p-7 lg:grid-cols-[1fr_auto]`}>
          <p>URAI Genesis onboarding - sample or empty-safe data, Passport-first controls, evidence-gated private systems.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/launch" className={navLink}>Launch</Link>
            <Link href="/privacy" className={navLink}>Privacy</Link>
            <Link href="/status" className={navLink}>Status</Link>
            <Link href="/support" className={navLink}>Support</Link>
            <a href="mailto:support@urai.app" className={navLink}>Email</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
