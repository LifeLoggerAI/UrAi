import type { Metadata } from "next";
import Link from "next/link";

const description =
  "The URAI Orb Companion chamber for Genesis: a privacy-first public demo guide where private memory access and provider-backed intelligence stay gated until proven.";

export const metadata: Metadata = {
  title: "Orb Companion Chamber | URAI Genesis",
  description,
  openGraph: {
    title: "URAI Orb Companion Chamber | Genesis",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "URAI Orb Companion Chamber | Genesis",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
};

const navItems = [
  ["Home", "/home", "Demo"],
  ["Life Map", "/life-map", "Preview"],
  ["Focus", "/focus", "Demo"],
  ["Replay", "/replay", "Preview"],
  ["Passport", "/passport", "Consent"],
  ["Ground", "/ground", "Preview"],
  ["Orb", "/orb", "Identity"],
  ["Orb Chat", "/orb-chat", "Active"],
  ["Status", "/status", "Evidence"],
] as const;

const guidanceActions = [
  ["Start with Life Map", "/life-map", "sample memory sky"],
  ["Review Passport", "/passport", "consent boundary"],
  ["Enter Ground", "/ground", "safe base layer"],
  ["Check Status", "/status", "launch evidence"],
  ["Return Home", "/home", "Genesis doorway"],
] as const;

const boundaries = [
  ["Private by default", "No raw private logs, account memories, Gmail, Calendar, Contacts, location, device, or passive sources appear in public demo mode."],
  ["Safe fallback", "If live companion state is unavailable, the Orb remains calm, explainable, and route-focused instead of exposing internal errors."],
  ["Account gated", "Provider-backed chat and private memory context stay blocked until Passport, server config, tests, and live smoke evidence pass."],
  ["User control", "You can always return home, open Passport, inspect Status, or stay in sample-safe demo routes."],
] as const;

const chamberStates = [
  ["Empty", "No private messages loaded. Public demo mode is safe."],
  ["Loading", "Preparing the Orb chamber without a permanent spinner."],
  ["Disabled", "Private Orb chat opens after provider and privacy gates pass."],
  ["Error", "The Orb stayed safe. Companion state is unavailable in this environment."],
] as const;

const identityNotes = [
  ["What the Orb is", "A calm interface bridge into URAI Genesis, not an always-on listener."],
  ["What it can do now", "Guide the public demo through Home, Life Map, Passport, Ground, Replay, and Status."],
  ["What remains gated", "Private memory access, provider intelligence, voice, passive sources, and account context."],
] as const;

const navLink =
  "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200";

const panel = "border border-white/10 bg-slate-950/58 shadow-2xl shadow-black/35 backdrop-blur-2xl";

export default function OchatPage() {
  return (
    <main aria-label="URAI Orb Companion Chamber" className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_50%_12%,rgba(103,232,249,0.22),transparent_26rem),radial-gradient(circle_at_80%_8%,rgba(168,85,247,0.18),transparent_28rem),radial-gradient(circle_at_12%_32%,rgba(45,212,191,0.12),transparent_28rem),linear-gradient(180deg,#020617_0%,#071121_50%,#02030a_100%)] text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[35%] h-[48rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10 shadow-[0_0_120px_rgba(103,232,249,0.14)]" />
        <div className="absolute left-1/2 top-[35%] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/10" />
        <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.55)_0_1px,transparent_2px),radial-gradient(circle_at_76%_18%,rgba(186,230,253,0.44)_0_1px,transparent_2px),radial-gradient(circle_at_47%_39%,rgba(221,214,254,0.34)_0_1px,transparent_2px),radial-gradient(circle_at_82%_64%,rgba(153,246,228,0.36)_0_1px,transparent_2px)]" />
        <div className="absolute inset-x-[-14%] bottom-[-14rem] h-[30rem] rounded-[50%] border-t border-cyan-200/12 bg-[radial-gradient(ellipse_at_50%_0%,rgba(103,232,249,0.14),transparent_56%),linear-gradient(180deg,rgba(5,7,14,0.06),rgba(0,0,0,0.82))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-[min(1240px,calc(100%-2rem))] flex-col pb-20 pt-6">
        <nav className={`${panel} flex items-center justify-between gap-4 rounded-full px-4 py-3`} aria-label="Orb companion navigation">
          <Link href="/home" className="inline-flex min-h-11 items-center gap-3 rounded-full font-extrabold tracking-[0.16em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
            <span className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_28px_rgba(103,232,249,0.9)]" aria-hidden="true" />
            URAI ORB
          </Link>
          <div className="flex max-w-[800px] flex-wrap justify-end gap-2">
            {navItems.map(([label, href, state]) => {
              const active = href === "/orb-chat";
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`${navLink} ${active ? "border-cyan-200/45 bg-cyan-200/16 text-cyan-50" : "border-white/10 bg-white/[0.05] text-white/70 hover:border-cyan-200/36 hover:bg-white/10 hover:text-white"}`}
                >
                  <span>{label}</span>
                  <span className="ml-2 rounded-full border border-white/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-white/48">{state}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <section className={`${panel} relative mt-4 grid flex-1 items-center gap-8 overflow-hidden rounded-[2.75rem] p-6 sm:p-10 lg:grid-cols-[0.92fr_1.08fr] lg:p-12`} aria-labelledby="orb-chat-title">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.08),transparent_13rem),linear-gradient(125deg,rgba(34,211,238,0.11),transparent_48%)]" aria-hidden="true" />

          <div className="relative z-10">
            <p className="inline-flex rounded-full border border-cyan-200/25 bg-cyan-200/10 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-cyan-100">
              Orb Companion
            </p>
            <h1 id="orb-chat-title" className="mt-6 max-w-3xl text-[clamp(3.55rem,8.5vw,7.1rem)] font-semibold leading-[0.86] tracking-[-0.075em] text-white">
              URAI is here without taking over.
            </h1>
            <p className="mt-6 max-w-2xl text-[clamp(1.1rem,2.2vw,1.55rem)] leading-[1.22] tracking-[-0.035em] text-cyan-50/82">
              The Orb is the calm doorway into URAI. In Genesis, it can guide the public demo while private memory access and provider-backed intelligence stay gated until proven.
            </p>
            <p className="mt-5 max-w-2xl rounded-2xl border border-cyan-200/14 bg-cyan-200/[0.07] px-4 py-3 text-sm leading-6 text-white/74">
              No raw private logs appear here. Public demo mode uses safe sample or empty states.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" aria-label="Orb chamber actions">
              <Link href="/life-map" className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-100/40 bg-gradient-to-br from-cyan-200 to-teal-200 px-6 text-sm font-extrabold text-cyan-950 shadow-[0_18px_44px_rgba(34,211,238,0.24)] transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                Start with Life Map
              </Link>
              <Link href="/passport" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.075] px-6 text-sm font-bold text-white/84 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/12 hover:text-white active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                Review Passport
              </Link>
              <Link href="/orb" className="inline-flex min-h-12 items-center justify-center rounded-full border border-violet-200/25 bg-violet-200/10 px-6 text-sm font-bold text-violet-50 transition hover:-translate-y-0.5 hover:bg-violet-200/15 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                Orb Identity
              </Link>
            </div>
          </div>

          <section className="relative z-10 overflow-hidden rounded-[2.4rem] border border-cyan-200/16 bg-[radial-gradient(circle_at_50%_32%,rgba(103,232,249,0.24),transparent_13rem),radial-gradient(circle_at_56%_66%,rgba(168,85,247,0.14),transparent_18rem),linear-gradient(180deg,rgba(15,23,42,0.16),rgba(2,6,23,0.9))] p-5 shadow-2xl shadow-black/45" aria-labelledby="companion-panel-title">
            <div aria-hidden="true" className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_24%_22%,rgba(248,250,252,0.72)_0_1px,transparent_2px),radial-gradient(circle_at_76%_20%,rgba(125,211,252,0.65)_0_1px,transparent_2px),radial-gradient(circle_at_42%_48%,rgba(221,214,254,0.52)_0_1px,transparent_2px)]" />
            <svg className="absolute inset-0 h-full w-full opacity-65" viewBox="0 0 900 650" aria-hidden="true">
              <circle cx="450" cy="228" r="172" fill="none" stroke="rgba(191,233,255,.18)" strokeWidth="1" />
              <circle cx="450" cy="228" r="112" fill="none" stroke="rgba(221,214,254,.18)" strokeWidth="1" />
              <path d="M126 280 C268 144 386 302 450 228 S640 226 792 104" fill="none" stroke="rgba(191,233,255,.32)" strokeWidth="1" />
              <path d="M156 414 C300 322 420 438 572 342 S748 358 820 458" fill="none" stroke="rgba(221,214,254,.22)" strokeWidth="1" />
              <circle cx="450" cy="228" r="5" fill="rgba(240,253,255,.9)" />
              <circle cx="792" cy="104" r="4" fill="rgba(221,214,254,.9)" />
            </svg>

            <div className="relative flex min-h-[31rem] flex-col justify-between gap-5 sm:min-h-[38rem]">
              <div className="mx-auto mt-6 flex flex-col items-center text-center">
                <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-cyan-100/18 bg-cyan-100/[0.04] shadow-[0_0_130px_rgba(103,232,249,0.22)]" role="img" aria-label="URAI Orb in calm demo-ready state">
                  <div aria-hidden="true" className="absolute inset-[-22%] rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.19),rgba(168,85,247,0.1)_42%,transparent_68%)] blur-2xl motion-safe:animate-pulse" />
                  <div aria-hidden="true" className="absolute inset-[11%] rounded-full border border-cyan-100/18" />
                  <div aria-hidden="true" className="absolute inset-[22%] rounded-full border border-violet-100/14" />
                  <div aria-hidden="true" className="relative h-36 w-36 rounded-full bg-[radial-gradient(circle_at_32%_24%,#fff,#a5f3fc_22%,#0891b2_50%,#031525_88%)] shadow-[inset_-24px_-28px_40px_rgba(0,0,0,.72),0_0_84px_rgba(103,232,249,.46)]" />
                  <span className="absolute right-8 top-10 rounded-full border border-cyan-100/20 bg-slate-950/60 px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.12em] text-cyan-50/75">Demo ready</span>
                </div>
                <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-cyan-100/66">Idle / bounded / not listening</p>
              </div>

              <div className="rounded-[1.6rem] border border-white/12 bg-slate-950/78 p-5 text-left backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-200">Demo-safe companion</p>
                    <h2 id="companion-panel-title" className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">I can guide the public URAI demo.</h2>
                  </div>
                  <span className="rounded-full border border-amber-200/22 bg-amber-200/10 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.14em] text-amber-50/80">Provider gated</span>
                </div>
                <p className="mt-4 rounded-2xl border border-cyan-200/12 bg-cyan-200/[0.055] p-4 text-sm leading-6 text-white/72">
                  Private memory, provider intelligence, and account context stay closed until Passport and launch gates are complete. Choose a safe demo path below.
                </p>
                <label htmlFor="orb-chat-disabled-input" className="mt-4 block text-xs font-black uppercase tracking-[0.2em] text-white/46">Chat input</label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="orb-chat-disabled-input"
                    disabled
                    value="Private Orb chat opens after provider and privacy gates pass."
                    aria-label="Private Orb chat is disabled until provider and privacy gates pass"
                    className="min-h-12 flex-1 rounded-full border border-white/10 bg-white/[0.045] px-5 text-sm text-white/58 outline-none disabled:cursor-not-allowed"
                    readOnly
                  />
                  <button
                    type="button"
                    disabled
                    className="min-h-12 rounded-full border border-white/10 bg-white/[0.045] px-5 text-sm font-extrabold text-white/38 disabled:cursor-not-allowed"
                    aria-label="Send disabled because private Orb chat is gated"
                  >
                    Send gated
                  </button>
                </div>
              </div>
            </div>
          </section>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-6 sm:p-9`} aria-labelledby="guidance-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Guided actions</p>
            <h2 id="guidance-title" className="mt-4 text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.06em]">Useful without pretending to know you.</h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {guidanceActions.map(([title, href, note]) => (
              <Link key={title} href={href} className="min-h-[176px] rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(103,232,249,0.12),transparent_14rem)] bg-white/[0.055] p-5 transition hover:-translate-y-0.5 hover:border-cyan-200/30 hover:bg-white/[0.075] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                <span className="inline-flex min-h-8 items-center rounded-full border border-cyan-200/25 px-3 text-xs font-black uppercase tracking-[0.08em] text-cyan-200">Route</span>
                <strong className="mt-5 block text-xl tracking-[-0.04em] text-white">{title}</strong>
                <span className="mt-3 block text-sm leading-6 text-white/62">{note}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 grid gap-4 rounded-[2.25rem] p-6 sm:p-9 lg:grid-cols-[0.8fr_1.2fr]`} aria-labelledby="identity-title">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Orb identity</p>
            <h2 id="identity-title" className="mt-4 text-[clamp(2rem,3.4vw,3.25rem)] font-semibold leading-none tracking-[-0.06em]">A companion doorway, not a private-data browser.</h2>
            <Link href="/orb" className="mt-6 inline-flex min-h-11 w-fit items-center rounded-full border border-white/12 bg-white/[0.055] px-5 text-sm font-extrabold text-white/78 transition hover:border-cyan-200/36 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
              Open Orb identity page
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {identityNotes.map(([title, body]) => (
              <article key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5">
                <h3 className="text-lg font-semibold tracking-[-0.035em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/64">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-6 sm:p-9`} aria-labelledby="boundaries-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Companion boundaries</p>
            <h2 id="boundaries-title" className="mt-4 text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.06em]">Fallback states become part of the chamber.</h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {boundaries.map(([title, body]) => (
              <article key={title} className="min-h-[210px] rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5">
                <span className="inline-flex min-h-8 items-center rounded-full border border-cyan-200/25 px-3 text-xs font-black uppercase tracking-[0.08em] text-cyan-200">Safe</span>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.04em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/64">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-6 sm:p-9`} aria-labelledby="state-title">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">State system</p>
              <h2 id="state-title" className="mt-4 text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-none tracking-[-0.06em]">No raw errors, no fake thinking.</h2>
            </div>
            <Link href="/privacy" className="inline-flex min-h-11 w-fit items-center rounded-full border border-white/12 bg-white/[0.055] px-5 text-sm font-extrabold text-white/78 transition hover:border-cyan-200/36 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
              Privacy boundary
            </Link>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {chamberStates.map(([label, copy]) => (
              <article key={label} className="rounded-[1.35rem] border border-cyan-100/12 bg-cyan-100/[0.04] p-4">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-cyan-100/58">{label}</p>
                <p className="mt-3 text-sm leading-6 text-slate-100/72">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] border-amber-200/15 bg-[radial-gradient(circle_at_8%_0%,rgba(250,204,21,0.1),transparent_18rem)] p-6 sm:p-8`} aria-labelledby="orb-safety-title">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-200">Launch safety</p>
          <h2 id="orb-safety-title" className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">Private companion intelligence stays gated.</h2>
          <p className="mt-3 max-w-5xl text-sm leading-6 text-white/68">
            Public demo mode uses safe sample or empty states. Private memory, account context, provider-backed intelligence, voice/listening, Gmail, Calendar, Contacts, device data, passive sources, and raw logs remain closed until Passport, server-only configuration, tests, and live evidence pass.
          </p>
        </section>
      </div>
    </main>
  );
}
