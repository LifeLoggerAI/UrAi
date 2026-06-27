import type { Metadata } from "next";
import Link from "next/link";

const description =
  "URAI Cognitive Mirror is a public-safe symbolic reflection chamber: reflective, not diagnostic; private by default; connected to Life Map, Focus, Replay, Passport, Support, and Status.";

export const metadata: Metadata = {
  title: "Cognitive Mirror | URAI",
  description,
  alternates: { canonical: "/mirror" },
  openGraph: {
    title: "Cognitive Mirror | URAI",
    description,
    url: "/mirror",
    images: [
      {
        url: "/og/urai-public-demo.svg",
        width: 1200,
        height: 630,
        alt: "URAI Cognitive Mirror preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cognitive Mirror | URAI",
    description,
    images: ["/og/urai-public-demo.svg"],
  },
};

const navItems = [
  { href: "/home", label: "Home", active: false },
  { href: "/life-map", label: "Life Map", active: false },
  { href: "/focus", label: "Focus", active: false },
  { href: "/replay", label: "Replay", active: false },
  { href: "/mirror", label: "Mirror", active: true },
  { href: "/passport", label: "Passport", active: false },
  { href: "/privacy", label: "Privacy", active: false },
  { href: "/support", label: "Support", active: false },
  { href: "/status", label: "Status", active: false },
] as const;

const reflectionPath = [
  { href: "/life-map", label: "Life Map star", state: "Sample", body: "A symbolic node from the public preview field." },
  { href: "/focus", label: "Focus", state: "Preview", body: "A narrowed view of what matters now." },
  { href: "/mirror", label: "Mirror reflection", state: "Symbolic", body: "A gentle prompt, not a verdict." },
  { href: "/replay", label: "Replay thread", state: "Preview", body: "A cinematic thread without claiming generated private film." },
  { href: "/passport", label: "Passport boundary", state: "Consent-first", body: "Private reflection stays gated until the owner opens it." },
] as const;

const boundaryCards = [
  {
    title: "Reflective, not diagnostic",
    status: "Demo-safe",
    body: "Mirror surfaces prompts and symbolic patterns. It does not provide medical, clinical, legal, or truth determinations.",
  },
  {
    title: "Consent-gated",
    status: "Consent-first",
    body: "Private sources stay closed until Passport, privacy, export, delete, and evidence gates pass.",
  },
  {
    title: "User-correctable",
    status: "Required",
    body: "Private launch requires mark inaccurate, hide, export, delete, and signal-disable controls before deeper reflection opens.",
  },
  {
    title: "Sensitive content slows down",
    status: "Gated",
    body: "When a reflection appears sensitive, URAI should summarize gently, avoid certainty, and point toward real support.",
  },
] as const;

const mirrorIs = [
  "Symbolic reflection",
  "Pattern prompt",
  "Life Map companion surface",
  "User-correctable",
  "Privacy-gated",
] as const;

const mirrorIsNot = [
  "Therapy",
  "Diagnosis",
  "Truth engine",
  "Medical advice",
  "Emotional surveillance",
  "Emergency support",
] as const;

const filterStates = [
  { label: "All", body: "Shows the full public-safe preview." },
  { label: "Sample", body: "Demo reflections only." },
  { label: "Private-gated", body: "Private reflections stay closed." },
  { label: "Vaulted", body: "Protected sources remain locked." },
  { label: "Hidden", body: "Hidden controls are required before private launch." },
  { label: "Deleted-safe", body: "Deleted or revoked sources must not reappear." },
] as const;

const primaryActions = [
  { href: "/life-map", label: "Return to Life Map", body: "Open the sample memory sky." },
  { href: "/focus", label: "Open Focus", body: "Narrow the symbolic field." },
  { href: "/replay", label: "Open Replay", body: "Watch the preview thread." },
  { href: "/passport", label: "Review Passport", body: "Check the consent boundary." },
] as const;

const gatedControls = [
  "Mark inaccurate",
  "Slow this down",
  "Hide this reflection",
] as const;

const navClass =
  "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200";
const panel = "border border-white/10 bg-slate-950/58 shadow-2xl shadow-black/35 backdrop-blur-2xl";

export default function MirrorPage() {
  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_18%_8%,rgba(59,130,246,0.24),transparent_32rem),radial-gradient(circle_at_72%_18%,rgba(168,85,247,0.2),transparent_31rem),radial-gradient(circle_at_50%_78%,rgba(20,184,166,0.12),transparent_34rem),linear-gradient(145deg,#020617_0%,#09111f_48%,#03020a_100%)] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_13%_23%,rgba(255,255,255,0.74)_0_1px,transparent_2px),radial-gradient(circle_at_29%_48%,rgba(147,197,253,0.55)_0_1px,transparent_2px),radial-gradient(circle_at_56%_25%,rgba(216,180,254,0.5)_0_1px,transparent_2px),radial-gradient(circle_at_81%_64%,rgba(153,246,228,0.44)_0_1px,transparent_2px)]" />
        <div className="absolute left-1/2 top-[34%] h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/10 shadow-[0_0_140px_rgba(147,197,253,0.16)]" />
        <div className="absolute inset-x-[-15%] top-[47%] h-36 rounded-[50%] border-t border-violet-100/14 bg-[radial-gradient(ellipse_at_50%_0%,rgba(168,85,247,0.14),transparent_62%)]" />
        <div className="absolute inset-x-[-18%] bottom-[-14rem] h-[34rem] rounded-[50%] border-t border-cyan-100/12 bg-[radial-gradient(ellipse_at_50%_0%,rgba(45,212,191,0.14),transparent_58%),linear-gradient(180deg,rgba(8,47,73,0.04),rgba(0,0,0,0.86))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/82" />
      </div>

      <div className="relative z-10 mx-auto w-[min(1320px,100%)] pb-16">
        <nav className={`${panel} flex flex-wrap items-center justify-between gap-3 rounded-full px-4 py-3`} aria-label="Cognitive Mirror navigation">
          <Link href="/home" className="inline-flex min-h-11 items-center gap-3 rounded-full font-extrabold tracking-[0.16em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" aria-label="URAI Genesis home">
            <span className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_28px_rgba(103,232,249,0.86)]" aria-hidden="true" />
            URAI
          </Link>
          <div className="flex flex-wrap justify-end gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={`${navClass} ${item.active ? "border-violet-200/40 bg-violet-200/[0.12] text-violet-50" : "border-white/10 bg-white/[0.055] text-white/72 hover:border-cyan-200/36 hover:bg-white/10 hover:text-white"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <section className={`${panel} relative mt-4 grid min-h-[calc(100vh-8rem)] overflow-hidden rounded-[2.85rem] p-5 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10 xl:p-12`} aria-labelledby="mirror-title">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.08),transparent_14rem),radial-gradient(circle_at_72%_36%,rgba(168,85,247,0.13),transparent_20rem),linear-gradient(120deg,rgba(14,165,233,0.08),transparent_54%)]" />

          <div className="relative z-10 flex flex-col justify-center py-4">
            <p className="inline-flex w-fit rounded-full border border-violet-100/25 bg-violet-100/10 px-4 py-2 text-xs font-black uppercase tracking-[0.34em] text-violet-100">Cognitive Mirror</p>
            <h1 id="mirror-title" className="mt-6 max-w-4xl text-[clamp(3.55rem,8vw,7.15rem)] font-semibold leading-[0.86] tracking-[-0.078em] text-white">
              Mirror of becoming.
            </h1>
            <p className="mt-6 max-w-3xl text-[clamp(1.08rem,2.1vw,1.5rem)] leading-[1.22] tracking-[-0.035em] text-cyan-50/82">
              URAI reflects symbolic patterns from the Life Map without diagnosing, judging, or claiming certainty. In Genesis, Mirror uses safe preview states while private signals remain consent-gated.
            </p>
            <p className="mt-5 max-w-3xl rounded-2xl border border-emerald-200/18 bg-emerald-200/[0.065] px-4 py-3 text-sm leading-6 text-emerald-50/82">
              Reflective, not diagnostic. Private by default.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" aria-label="Mirror primary route actions">
              {primaryActions.map((action, index) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={index === 0 ? "inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-100/50 bg-gradient-to-br from-cyan-100 via-teal-200 to-violet-200 px-6 text-sm font-black text-slate-950 shadow-[0_20px_54px_rgba(45,212,191,0.23)] transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" : "inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.075] px-6 text-sm font-bold text-white/82 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/12 hover:text-white active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"}
                  aria-label={`${action.label}: ${action.body}`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          <aside className="relative z-10 mt-8 min-h-[500px] overflow-hidden rounded-[2.35rem] border border-cyan-100/15 bg-[radial-gradient(circle_at_50%_28%,rgba(191,219,254,0.23),transparent_12rem),radial-gradient(circle_at_50%_64%,rgba(168,85,247,0.16),transparent_18rem),linear-gradient(180deg,rgba(15,23,42,0.38),rgba(2,6,23,0.92))] p-5 lg:mt-0" aria-label="URAI Cognitive Mirror visual chamber">
            <div aria-hidden="true" className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_18%_20%,rgba(248,250,252,0.78)_0_1px,transparent_2px),radial-gradient(circle_at_72%_24%,rgba(191,219,254,0.72)_0_1px,transparent_2px),radial-gradient(circle_at_44%_42%,rgba(216,180,254,0.58)_0_1px,transparent_2px),radial-gradient(circle_at_82%_58%,rgba(153,246,228,0.5)_0_1px,transparent_2px)]" />
            <div aria-hidden="true" className="absolute left-1/2 top-[42%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/12 shadow-[0_0_70px_rgba(125,211,252,0.18)] motion-safe:animate-pulse" />
            <div aria-hidden="true" className="absolute left-1/2 top-[42%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-100/16 shadow-[0_0_50px_rgba(168,85,247,0.18)]" />
            <div aria-hidden="true" className="absolute left-1/2 top-[42%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_42%_35%,#fff_0_8%,#bae6fd_18%,rgba(168,85,247,0.42)_46%,rgba(15,23,42,0.1)_72%,transparent_78%)] drop-shadow-[0_0_54px_rgba(125,211,252,0.68)]" />
            <div aria-hidden="true" className="absolute left-[18%] top-[62%] h-px w-[64%] rotate-[-18deg] bg-gradient-to-r from-transparent via-cyan-100/35 to-transparent" />
            <div aria-hidden="true" className="absolute left-[24%] top-[27%] h-px w-[48%] rotate-[31deg] bg-gradient-to-r from-transparent via-violet-100/30 to-transparent" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[33%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(153,246,228,0.18),transparent_42%),linear-gradient(180deg,transparent,rgba(0,0,0,0.72))]" />
            <div className="absolute bottom-5 left-5 right-5 rounded-[1.5rem] border border-white/12 bg-slate-950/74 p-5 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-200">URAI Mirror Preview</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] text-white">Symbolic reflection, not certainty.</h2>
              <p className="mt-3 text-sm leading-6 text-white/62">The chamber uses sample-safe constellation signals. Deeper reflection opens only after Passport and evidence gates pass.</p>
            </div>
          </aside>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.12fr_0.88fr]" aria-label="Current Mirror reflection and user controls">
          <article className={`${panel} rounded-[2.25rem] p-5 sm:p-8`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Current reflection</p>
                <h2 className="mt-4 text-[clamp(2.35rem,4vw,4.2rem)] font-semibold leading-none tracking-[-0.065em] text-white">A gentle prompt, not a verdict.</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-[0.68rem] font-black uppercase tracking-[0.14em]">
                <span className="rounded-full border border-cyan-100/20 bg-cyan-100/10 px-3 py-1 text-cyan-50">Preview reflection</span>
                <span className="rounded-full border border-violet-100/20 bg-violet-100/10 px-3 py-1 text-violet-50">Symbolic only</span>
                <span className="rounded-full border border-amber-100/20 bg-amber-100/10 px-3 py-1 text-amber-50">Not clinical</span>
              </div>
            </div>
            <blockquote className="mt-7 rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 text-[clamp(1.15rem,2vw,1.55rem)] leading-[1.35] tracking-[-0.035em] text-white/84">
              A symbolic pattern is forming around return, quiet intensity, and unfinished direction. Treat this as a gentle prompt, not a verdict.
            </blockquote>
            <p className="mt-5 text-sm leading-7 text-white/62">
              This preview does not read private memories, provider data, biometric signals, device activity, or passive sensing. It is a sample-safe reflection surface connected to the public Life Map.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3" aria-label="Gated Mirror correction controls">
              {gatedControls.map((control) => (
                <button
                  key={control}
                  type="button"
                  disabled
                  className="min-h-12 cursor-not-allowed rounded-full border border-white/10 bg-white/[0.035] px-4 text-sm font-bold text-white/42"
                  aria-label={`${control} is required before private launch and currently gated`}
                >
                  {control} <span className="ml-1 text-[0.65rem] uppercase tracking-[0.14em] text-amber-100/58">Gated</span>
                </button>
              ))}
            </div>
          </article>

          <aside className={`${panel} rounded-[2.25rem] border-amber-200/14 bg-amber-200/[0.035] p-5 sm:p-8`} aria-labelledby="sensitive-title">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-amber-100">Sensitive reflection safety</p>
            <h2 id="sensitive-title" className="mt-4 text-3xl font-semibold tracking-[-0.055em] text-white">If it feels heavy, pause.</h2>
            <p className="mt-4 text-sm leading-7 text-white/66">
              URAI is not emergency support and does not diagnose. If a reflection feels intense, step away, talk to someone you trust, or reach out to local professional support.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/support" className="inline-flex min-h-11 items-center rounded-full border border-amber-100/28 bg-amber-100/10 px-4 text-sm font-bold text-amber-50 transition hover:-translate-y-0.5 hover:bg-amber-100/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Open Support</Link>
              <Link href="/privacy" className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/[0.055] px-4 text-sm font-bold text-white/74 transition hover:-translate-y-0.5 hover:border-cyan-200/36 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Review Privacy</Link>
            </div>
          </aside>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-5 sm:p-8`} aria-labelledby="path-title">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Reflection path</p>
            <h2 id="path-title" className="mt-4 text-[clamp(2.25rem,4vw,3.8rem)] font-semibold leading-none tracking-[-0.065em] text-white">Mirror belongs inside the Life Map, not beside it.</h2>
          </div>
          <ol className="mt-7 grid gap-3 md:grid-cols-5">
            {reflectionPath.map((node, index) => (
              <li key={node.label} className="list-none">
                <Link href={node.href} className="group block h-full min-h-[220px] rounded-[1.55rem] border border-white/10 bg-white/[0.052] p-4 transition hover:-translate-y-0.5 hover:border-cyan-200/34 hover:bg-white/[0.075] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                  <span className="text-xs font-black tracking-[0.18em] text-cyan-100/58">0{index + 1}</span>
                  <span className="mt-5 inline-flex rounded-full border border-cyan-100/18 bg-cyan-100/[0.065] px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-cyan-50">{node.state}</span>
                  <h3 className="mt-4 text-xl font-semibold tracking-[-0.045em] text-white">{node.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/62">{node.body}</p>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2" aria-label="Mirror boundaries and identity">
          <article className={`${panel} rounded-[2.25rem] border-emerald-200/15 bg-emerald-200/[0.04] p-5 sm:p-8`}>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-100">Reflection boundaries</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {boundaryCards.map((card) => (
                <section key={card.title} className="rounded-[1.35rem] border border-white/10 bg-black/24 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold tracking-[-0.025em] text-white">{card.title}</h3>
                    <span className="rounded-full border border-emerald-100/18 bg-emerald-100/8 px-2.5 py-1 text-[0.63rem] font-black uppercase tracking-[0.12em] text-emerald-50">{card.status}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/62">{card.body}</p>
                </section>
              ))}
            </div>
          </article>

          <article className={`${panel} rounded-[2.25rem] p-5 sm:p-8`}>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-violet-100">Mirror is / Mirror is not</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.05em] text-white">Mirror is</h3>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-white/66">
                  {mirrorIs.map((item) => <li key={item} className="rounded-2xl border border-cyan-100/12 bg-cyan-100/[0.045] px-4 py-3">{item}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.05em] text-white">Mirror is not</h3>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-white/66">
                  {mirrorIsNot.map((item) => <li key={item} className="rounded-2xl border border-amber-100/12 bg-amber-100/[0.04] px-4 py-3">{item}</li>)}
                </ul>
              </div>
            </div>
          </article>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-5 sm:p-8`} aria-labelledby="filters-title">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Safe preview controls</p>
            <h2 id="filters-title" className="mt-4 text-[clamp(2.2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-white">Filters are explained, not falsely enabled.</h2>
            <p className="mt-4 text-sm leading-6 text-white/62">Private launch filters require real owner data, consent state, deletion state, and evidence enforcement. In Genesis, these are status labels only.</p>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {filterStates.map((state) => (
              <div key={state.label} className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4">
                <p className="font-semibold text-white">{state.label}</p>
                <p className="mt-2 text-sm leading-6 text-white/58">{state.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
