import type { Metadata } from "next";
import Link from "next/link";

const description =
  "The URAI Orb identity chamber for Genesis: a cinematic, privacy-first companion presence that guides the public demo while private intelligence remains gated.";

export const metadata: Metadata = {
  title: "Orb Identity Chamber | URAI Genesis",
  description,
  openGraph: {
    title: "URAI Orb Identity Chamber | Genesis",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "URAI Orb Identity Chamber | Genesis",
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
  ["Orb", "/orb", "Active"],
  ["Orb Chat", "/orb-chat", "Chamber"],
  ["Sky", "/sky", "Preview"],
  ["Horizon", "/horizon", "Future"],
] as const;

const primaryActions = [
  ["Open Orb Chat", "/orb-chat", "companion chamber"],
  ["Return Home", "/home", "Genesis doorway"],
  ["Review Passport Boundaries", "/passport", "consent controls"],
  ["Open Life Map", "/life-map", "sample memory sky"],
  ["View System Status", "/status", "launch evidence"],
] as const;

const identityCards = [
  ["Companion, not controller", "The Orb guides without taking over. It can orient the demo, explain boundaries, and help users choose the next route."],
  ["Privacy-first", "No raw private logs, hidden memory access, or private account context appear in public demo mode."],
  ["Provider-gated", "Deeper AI/provider-backed behavior remains gated until server-side credentials, tests, and live smoke evidence pass."],
  ["Calm fallback", "If live companion state is unavailable, URAI still presents a safe, polished chamber rather than raw errors."],
] as const;

const canDoNow = [
  ["Explain sample vs private", "Clarify what is public demo, preview, gated, or private before a user trusts the system."],
  ["Guide to Life Map", "Route visitors into the symbolic sample memory sky without implying private data access."],
  ["Guide to Passport", "Point users to the control surface for consent, export, delete, and data boundaries."],
  ["Guide to Ground", "Open the rooted Genesis base layer without claiming live physical-world sensing."],
  ["Route safely through Genesis", "Help users move between Home, Focus, Replay, Status, and Orb Chat with clear labels."],
] as const;

const chamberStates = [
  ["Idle", "Calm and visible. The Orb is present without pretending to listen or monitor."],
  ["Ready", "Demo guidance is available through safe route actions and the Orb Chat chamber."],
  ["Gated", "Private intelligence, memory access, provider chat, voice, and passive sources stay closed."],
  ["Fallback", "The chamber remains polished if richer companion state is unavailable in this environment."],
] as const;

const navLink =
  "inline-flex min-h-11 items-center rounded-full border px-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200";

const panel = "border border-white/10 bg-slate-950/58 shadow-2xl shadow-black/35 backdrop-blur-2xl";

export default function OrbPage() {
  return (
    <main aria-label="URAI Orb identity chamber" className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_50%_18%,rgba(103,232,249,0.24),transparent_28rem),radial-gradient(circle_at_18%_22%,rgba(45,212,191,0.14),transparent_27rem),radial-gradient(circle_at_82%_8%,rgba(168,85,247,0.18),transparent_30rem),linear-gradient(180deg,#020617_0%,#071122_48%,#02030a_100%)] text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[39%] h-[58rem] w-[58rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10 shadow-[0_0_140px_rgba(103,232,249,0.16)]" />
        <div className="absolute left-1/2 top-[39%] h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/10" />
        <div className="absolute left-1/2 top-[39%] h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-200/12" />
        <div className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_16%_20%,rgba(255,255,255,0.58)_0_1px,transparent_2px),radial-gradient(circle_at_76%_18%,rgba(186,230,253,0.44)_0_1px,transparent_2px),radial-gradient(circle_at_47%_39%,rgba(221,214,254,0.34)_0_1px,transparent_2px),radial-gradient(circle_at_82%_64%,rgba(153,246,228,0.34)_0_1px,transparent_2px)]" />
        <div className="absolute inset-x-[-16%] bottom-[-14rem] h-[34rem] rounded-[50%] border-t border-cyan-200/12 bg-[radial-gradient(ellipse_at_50%_0%,rgba(103,232,249,0.14),transparent_56%),linear-gradient(180deg,rgba(5,7,14,0.06),rgba(0,0,0,0.84))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/72" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-[min(1260px,calc(100%-2rem))] flex-col pb-20 pt-6">
        <nav className={`${panel} flex items-center justify-between gap-4 rounded-full px-4 py-3`} aria-label="Orb identity navigation">
          <Link href="/home" className="inline-flex min-h-11 items-center gap-3 rounded-full font-extrabold tracking-[0.16em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
            <span className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_28px_rgba(103,232,249,0.9)]" aria-hidden="true" />
            URAI ORB
          </Link>
          <div className="flex max-w-[960px] flex-wrap justify-end gap-2">
            {navItems.map(([label, href, state]) => {
              const active = href === "/orb";
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`${navLink} ${active ? "border-cyan-200/45 bg-cyan-200/16 text-cyan-50" : "border-white/10 bg-white/[0.05] text-white/70 hover:border-cyan-200/36 hover:bg-white/10 hover:text-white"}`}
                >
                  <span>{label}</span>
                  <span className="ml-2 hidden rounded-full border border-white/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-white/48 2xl:inline-flex">{state}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <section className={`${panel} relative mt-4 grid flex-1 items-center gap-6 overflow-hidden rounded-[3rem] p-5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-8`} aria-labelledby="orb-title">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.08),transparent_13rem),linear-gradient(125deg,rgba(34,211,238,0.1),transparent_48%)]" aria-hidden="true" />

          <div className="relative z-10 lg:order-2">
            <p className="inline-flex rounded-full border border-cyan-200/25 bg-cyan-200/10 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-cyan-100">
              Orb Identity
            </p>
            <h1 id="orb-title" className="mt-5 max-w-3xl text-[clamp(2.8rem,6.25vw,5.35rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
              The companion presence stays gentle, visible, and bounded.
            </h1>
            <p className="mt-5 max-w-2xl text-[clamp(1rem,1.75vw,1.25rem)] leading-[1.3] tracking-[-0.03em] text-cyan-50/82">
              The Orb is URAI&apos;s calm companion presence. In Genesis it can orient the user, explain boundaries, and guide the demo while private intelligence and provider-backed memory access remain gated until proven.
            </p>
            <p className="mt-5 max-w-2xl rounded-2xl border border-cyan-200/14 bg-cyan-200/[0.07] px-4 py-3 text-sm leading-6 text-white/74">
              No fake therapy. No hidden private memory claims. No silent overreach.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" aria-label="Orb identity primary actions">
              {primaryActions.map(([label, href, note], index) => (
                <Link
                  key={label}
                  href={href}
                  className={index === 0 ? "inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-100/40 bg-gradient-to-br from-cyan-200 to-teal-200 px-6 text-sm font-extrabold text-cyan-950 shadow-[0_18px_44px_rgba(34,211,238,0.24)] transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" : "inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.075] px-5 text-sm font-bold text-white/84 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/12 hover:text-white active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"}
                >
                  <span>{label}</span>
                  <span className="ml-2 hidden rounded-full border border-white/15 px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.12em] opacity-60 sm:inline-flex">{note}</span>
                </Link>
              ))}
            </div>
          </div>

          <section className="relative z-10 min-h-[28rem] overflow-hidden rounded-[2.6rem] border border-cyan-200/16 bg-[radial-gradient(circle_at_50%_34%,rgba(103,232,249,0.25),transparent_13rem),radial-gradient(circle_at_50%_63%,rgba(168,85,247,0.13),transparent_19rem),linear-gradient(180deg,rgba(15,23,42,0.18),rgba(2,6,23,0.9))] p-5 shadow-2xl shadow-black/45 sm:min-h-[34rem] lg:order-1" aria-labelledby="orb-visual-title">
            <div aria-hidden="true" className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_24%_22%,rgba(248,250,252,0.72)_0_1px,transparent_2px),radial-gradient(circle_at_76%_20%,rgba(125,211,252,0.65)_0_1px,transparent_2px),radial-gradient(circle_at_42%_48%,rgba(221,214,254,0.52)_0_1px,transparent_2px)]" />
            <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 900 760" aria-hidden="true">
              <circle cx="450" cy="318" r="230" fill="none" stroke="rgba(191,233,255,.14)" strokeWidth="1" />
              <circle cx="450" cy="318" r="164" fill="none" stroke="rgba(221,214,254,.16)" strokeWidth="1" />
              <circle cx="450" cy="318" r="96" fill="none" stroke="rgba(153,246,228,.18)" strokeWidth="1" />
              <path d="M100 322 C246 178 368 336 450 268 S646 256 802 136" fill="none" stroke="rgba(191,233,255,.32)" strokeWidth="1" />
              <path d="M136 488 C286 396 420 510 580 410 S752 424 820 548" fill="none" stroke="rgba(221,214,254,.22)" strokeWidth="1" />
              <circle cx="450" cy="268" r="5" fill="rgba(240,253,255,.9)" />
              <circle cx="802" cy="136" r="4" fill="rgba(221,214,254,.9)" />
            </svg>

            <div className="relative flex min-h-[25rem] flex-col items-center justify-center gap-5 sm:min-h-[31rem]">
              <div className="relative flex h-[min(64vw,23rem)] w-[min(64vw,23rem)] items-center justify-center rounded-full border border-cyan-100/18 bg-cyan-100/[0.035] shadow-[0_0_150px_rgba(103,232,249,0.22)]" role="img" aria-label="URAI Orb in calm bounded identity state">
                <div aria-hidden="true" className="absolute inset-[-18%] rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.22),rgba(168,85,247,0.11)_44%,transparent_69%)] blur-2xl motion-safe:animate-pulse" />
                <div aria-hidden="true" className="absolute inset-[8%] rounded-full border border-cyan-100/18" />
                <div aria-hidden="true" className="absolute inset-[18%] rounded-full border border-violet-100/14" />
                <div aria-hidden="true" className="absolute inset-[29%] rounded-full border border-teal-100/12" />
                <div aria-hidden="true" className="relative h-[min(34vw,12.5rem)] w-[min(34vw,12.5rem)] rounded-full bg-[radial-gradient(circle_at_30%_22%,#fff_0_8%,#cffafe_17%,#67e8f9_31%,#0e7490_55%,#031525_88%)] shadow-[inset_-34px_-38px_56px_rgba(0,0,0,.76),inset_18px_14px_30px_rgba(255,255,255,.26),0_0_92px_rgba(103,232,249,.52)]" />
                <span className="absolute right-[14%] top-[16%] rounded-full border border-cyan-100/20 bg-slate-950/62 px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.12em] text-cyan-50/78">Calm ready</span>
                <span className="absolute bottom-[17%] left-[13%] rounded-full border border-violet-100/18 bg-slate-950/62 px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.12em] text-violet-50/75">Not listening</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 rounded-[1.5rem] border border-white/12 bg-slate-950/76 p-4 backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-200">Signature artifact</p>
                <h2 id="orb-visual-title" className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">The Orb is the front face of URAI.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/66">
                  A visual identity, a guide, and a boundary-holder. Genesis keeps the chamber beautiful before private intelligence opens.
                </p>
              </div>
            </div>
          </section>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-6 sm:p-9`} aria-labelledby="trust-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Identity system</p>
            <h2 id="trust-title" className="mt-4 text-[clamp(2.2rem,4vw,3.65rem)] font-semibold leading-none tracking-[-0.06em]">The companion has boundaries before it has power.</h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {identityCards.map(([title, body]) => (
              <article key={title} className="min-h-[220px] rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(103,232,249,0.12),transparent_14rem)] bg-white/[0.055] p-5">
                <span className="inline-flex min-h-8 items-center rounded-full border border-cyan-200/25 px-3 text-xs font-black uppercase tracking-[0.08em] text-cyan-200">Trust</span>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.04em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/64">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-6 sm:p-9`} aria-labelledby="can-do-title">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">What the Orb can do now</p>
              <h2 id="can-do-title" className="mt-4 text-[clamp(2rem,3.6vw,3.35rem)] font-semibold leading-none tracking-[-0.06em]">Useful guidance without private claims.</h2>
            </div>
            <Link href="/orb-chat" className="inline-flex min-h-11 w-fit items-center rounded-full border border-cyan-100/30 bg-cyan-100/10 px-5 text-sm font-extrabold text-cyan-50 transition hover:border-cyan-100/45 hover:bg-cyan-100/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
              Enter Orb Chat
            </Link>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {canDoNow.map(([title, body]) => (
              <article key={title} className="rounded-[1.45rem] border border-white/10 bg-white/[0.05] p-5">
                <h3 className="text-lg font-semibold tracking-[-0.035em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-6 sm:p-9`} aria-labelledby="states-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Chamber states</p>
            <h2 id="states-title" className="mt-4 text-[clamp(2rem,3.5vw,3.2rem)] font-semibold leading-none tracking-[-0.06em]">Alive, but never overreaching.</h2>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {chamberStates.map(([title, body]) => (
              <article key={title} className="rounded-[1.35rem] border border-cyan-100/12 bg-cyan-100/[0.04] p-4">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-cyan-100/58">{title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-100/72">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] border-amber-200/15 bg-[radial-gradient(circle_at_8%_0%,rgba(250,204,21,0.1),transparent_18rem)] p-6 sm:p-8`} aria-labelledby="orb-safety-title">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-200">Launch safety</p>
          <h2 id="orb-safety-title" className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">Orb is a Genesis companion preview.</h2>
          <p className="mt-3 max-w-5xl text-sm leading-6 text-white/68">
            The Orb does not prove therapy, diagnosis, autonomous agents, passive sensing, live voice/listening, provider-backed intelligence, or production private-memory AI. Those systems stay gated until consent, server-only configuration, tests, audit, and live smoke evidence pass.
          </p>
        </section>
      </div>
    </main>
  );
}
