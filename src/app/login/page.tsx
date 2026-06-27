import type { Metadata } from "next";
import Link from "next/link";
import { WaitlistCapture } from "@/components/launch/WaitlistCapture";

const description =
  "URAI private login is gated while the public Genesis demo, waitlist, Passport, and status pages remain available.";

export const metadata: Metadata = {
  title: "Private beta gate | URAI",
  description,
  openGraph: {
    title: "URAI Private Beta Gate",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "URAI Private Beta Gate",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
};

const gateRows = [
  ["Public demo", "Available", "Explore the sample-data Genesis experience now."],
  ["Waitlist", "Available", "Submit interest or use support email if capture is unavailable."],
  ["Private login", "Gated", "No public account login opens until release evidence is complete."],
  ["Account data", "Closed", "Private owner-scoped data remains closed from the public demo."],
  ["Provider connections", "Closed", "No Gmail, Calendar, Contacts, media provider, or passive feed is live here."],
] as const;

const exploreCards = [
  ["Public Demo", "Demo", "Enter the cinematic Genesis demo path with sample data only.", "/demo", "Explore demo"],
  ["Life Map", "Preview", "Open the symbolic sky of demo moments, not a passive memory feed.", "/life-map", "Open Life Map"],
  ["Passport", "Consent-first", "Review the control model for what may open, export, or stay closed.", "/passport", "View Passport"],
  ["Status", "Public status", "Check which systems are live, preview, gated, or blocked.", "/status", "View Status"],
] as const;

const navLink =
  "inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 text-sm text-white/72 transition hover:border-cyan-200/40 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200";

const panel = "border border-white/10 bg-slate-950/58 shadow-2xl shadow-black/35 backdrop-blur-2xl";

export default function LoginGatePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_16%_10%,rgba(56,189,248,0.18),transparent_30rem),radial-gradient(circle_at_86%_16%,rgba(45,212,191,0.16),transparent_28rem),linear-gradient(145deg,#020617_0%,#07111f_48%,#03040a_100%)] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-8 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full border border-cyan-200/10 shadow-[0_0_100px_rgba(45,212,191,0.12)]" />
        <div className="absolute -right-52 bottom-8 h-[34rem] w-[34rem] rounded-full border border-teal-200/10" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] [background-size:80px_80px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-[min(1180px,100%)] flex-col pb-16">
        <nav className={`${panel} flex items-center justify-between gap-4 rounded-full px-4 py-3`} aria-label="Login gate navigation">
          <Link href="/launch" className="inline-flex min-h-11 items-center gap-3 rounded-full font-extrabold tracking-[0.16em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
            <span className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_28px_rgba(103,232,249,0.9)]" aria-hidden="true" />
            URAI
          </Link>
          <div className="flex flex-wrap justify-end gap-2">
            <Link href="/launch" className={navLink}>Launch</Link>
            <Link href="/demo" className={navLink}>Demo</Link>
            <Link href="/passport" className={navLink}>Passport</Link>
            <Link href="/status" className={navLink}>Status</Link>
          </div>
        </nav>

        <section className={`${panel} relative mt-4 grid flex-1 items-center gap-8 overflow-hidden rounded-[2.5rem] p-6 sm:p-10 lg:grid-cols-[1.02fr_0.98fr] lg:p-14`} aria-labelledby="login-title">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.08),transparent_13rem),linear-gradient(120deg,rgba(14,165,233,0.1),transparent_48%)]" aria-hidden="true" />

          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Early Access</p>
            <h1 id="login-title" className="mt-5 text-[clamp(3.5rem,8.8vw,7rem)] font-semibold leading-[0.88] tracking-[-0.07em] text-white">
              Private login opens after the beta gate.
            </h1>
            <p className="mt-6 max-w-2xl text-[clamp(1.15rem,2.4vw,1.75rem)] leading-[1.18] tracking-[-0.04em] text-teal-100">
              Public visitors can explore the demo and join the waitlist. Account login stays gated until privacy, security, rollback, monitoring, and release evidence gates are complete.
            </p>
            <p className="mt-5 max-w-2xl rounded-2xl border border-cyan-200/14 bg-cyan-200/[0.055] px-4 py-3 text-sm leading-6 text-white/72">
              Private systems stay closed until the gate is ready. That is intentional protection, not a broken login flow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" aria-label="Login gate actions">
              <Link href="/demo" className="inline-flex min-h-12 items-center justify-center rounded-full border border-teal-100/40 bg-gradient-to-br from-teal-300 to-cyan-200 px-6 text-sm font-extrabold text-teal-950 shadow-[0_18px_44px_rgba(20,184,166,0.25)] transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" aria-label="Explore the public URAI demo walkthrough">
                Explore public demo
              </Link>
              <a href="#waitlist" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.075] px-6 text-sm font-bold text-white/82 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/12 hover:text-white active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" aria-label="Join the URAI waitlist">
                Join waitlist
              </a>
              <Link href="/passport" className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-200/25 bg-amber-200/10 px-6 text-sm font-bold text-amber-50 transition hover:-translate-y-0.5 hover:bg-amber-200/15 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" aria-label="View URAI Passport privacy controls">
                View Passport
              </Link>
              <Link href="/status" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-6 text-sm font-bold text-white/72 transition hover:-translate-y-0.5 hover:border-cyan-200/35 hover:text-white active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" aria-label="Open URAI system status">
                System status
              </Link>
            </div>
          </div>

          <aside className="relative z-10 overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-[radial-gradient(circle_at_50%_26%,rgba(125,211,252,0.2),transparent_12rem),radial-gradient(circle_at_50%_70%,rgba(20,184,166,0.16),transparent_18rem),linear-gradient(180deg,rgba(15,23,42,0.38),rgba(2,6,23,0.92))] p-5" aria-labelledby="access-status-title">
            <div aria-hidden="true" className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_18%_20%,rgba(248,250,252,0.75)_0_1px,transparent_2px),radial-gradient(circle_at_72%_24%,rgba(125,211,252,0.65)_0_1px,transparent_2px),radial-gradient(circle_at_44%_42%,rgba(153,246,228,0.55)_0_1px,transparent_2px)]" />
            <div aria-hidden="true" className="absolute left-1/2 top-[42%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/18 shadow-[0_0_70px_rgba(45,212,191,0.18)]" />
            <div aria-hidden="true" className="absolute left-1/2 top-[42%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#f8fafc_0_8%,#67e8f9_21%,rgba(20,184,166,0.2)_62%,transparent_75%)] drop-shadow-[0_0_42px_rgba(103,232,249,0.75)]" />

            <div className="relative rounded-[1.5rem] border border-white/12 bg-slate-950/68 p-5 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Static launch preview</p>
              <h2 id="access-status-title" className="mt-3 text-3xl font-semibold tracking-[-0.05em]">Access gate status</h2>
              <div className="mt-5 grid gap-3">
                {gateRows.map(([label, state, detail]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-sm text-white">{label}</strong>
                      <span className="rounded-full border border-cyan-200/20 px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-cyan-100">{state}</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-white/58">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section id="waitlist" className={`${panel} mt-4 grid items-center gap-6 rounded-[2rem] p-6 sm:p-9 lg:grid-cols-[0.86fr_0.72fr]`} aria-labelledby="login-waitlist-title">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Private beta queue</p>
            <h2 id="login-waitlist-title" className="mt-4 text-[clamp(2.1rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em]">
              Ask for access without opening private systems.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/68">
              The waitlist is a contact path, not an account unlock. It does not enable private memories, passive sensing, generated media, outbound communications, provider integrations, or marketplace behavior.
            </p>
          </div>
          <WaitlistCapture source="login-private-beta-gate" />
        </section>

        <section className={`${panel} mt-4 grid gap-4 rounded-[2rem] p-6 sm:p-9 lg:grid-cols-[0.82fr_1fr]`} aria-labelledby="why-gate-title">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Why the gate exists</p>
            <h2 id="why-gate-title" className="mt-4 text-[clamp(2.1rem,4vw,3.4rem)] font-semibold leading-none tracking-[-0.06em]">
              URAI protects the threshold before it opens it.
            </h2>
          </div>
          <div className="grid gap-4 text-sm leading-6 text-white/66">
            <p>
              URAI handles sensitive life layers. Private login opens only after privacy, rollback, monitoring, consent controls, and owner-scoped security evidence are verified.
            </p>
            <p>
              Until then, public visitors can explore a sample-data demo, inspect Passport boundaries, and read system status without connecting private accounts or providers.
            </p>
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2rem] p-6 sm:p-9`} aria-labelledby="explore-now-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">What you can explore now</p>
            <h2 id="explore-now-title" className="mt-4 text-[clamp(2.1rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em]">
              A useful gate, not a dead end.
            </h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {exploreCards.map(([title, state, body, href, cta]) => (
              <article key={title} className="flex min-h-[240px] flex-col justify-between rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(45,212,191,0.1),transparent_14rem)] bg-white/[0.055] p-5">
                <div>
                  <span className="inline-flex min-h-8 items-center rounded-full border border-teal-200/25 px-3 text-xs font-black uppercase tracking-[0.08em] text-teal-200">{state}</span>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/66">{body}</p>
                </div>
                <Link href={href} className="mt-5 inline-flex min-h-11 w-fit items-center rounded-full border border-teal-200/25 bg-white/[0.055] px-4 text-sm font-extrabold text-teal-200 transition hover:border-teal-100/50 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                  {cta}
                </Link>
              </article>
            ))}
          </div>
        </section>        <footer className={`${panel} mt-4 grid items-center gap-4 rounded-[2rem] p-6 text-sm text-white/62 sm:p-7 lg:grid-cols-[1fr_auto]`}>
          <p>URAI private beta gate - public demo available, private login closed until evidence gates pass.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/launch" className={navLink}>Launch</Link>
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
