import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Horizon is URAI Genesis's launch-safe future direction layer: a cinematic roadmap preview where personal forecasting, generated media, exports, automation, and autonomous jobs remain gated.";

export const metadata: Metadata = {
  title: "Horizon Preview | URAI Genesis",
  description,
  openGraph: {
    title: "URAI Horizon Preview | Genesis",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "URAI Horizon Preview | Genesis",
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
  ["Orb", "/orb", "Guide"],
  ["Orb Chat", "/orb-chat", "Safe"],
  ["Sky", "/sky", "Atmosphere"],
  ["Horizon", "/horizon", "Active"],
] as const;

const primaryActions = [
  ["Open Life Map", "/life-map", "sample memory field"],
  ["Open Replay", "/replay", "cinematic preview"],
  ["Join Early Access", "/launch", "real CTA"],
  ["Return Home", "/home", "Genesis entry"],
  ["Review Passport", "/passport", "consent boundary"],
] as const;

const horizonNodes = [
  {
    label: "Replay Path",
    status: "Preview",
    copy: "Cinematic thread previews begin from selected sample memories. Real generated life films remain gated.",
    href: "/replay",
    style: "left-[67%] top-[38%]",
  },
  {
    label: "Future Thread",
    status: "Roadmap",
    copy: "Future-direction surfaces remain roadmap-style in Genesis, not private recommendations or forecasting.",
    href: "/horizon",
    style: "left-[50%] top-[24%]",
  },
  {
    label: "Media Gate",
    status: "Gated",
    copy: "Provider-backed media generation stays closed until infrastructure, storage, and smoke proof are complete.",
    href: "/status",
    style: "left-[34%] top-[42%]",
  },
  {
    label: "Export Gate",
    status: "Gated",
    copy: "Owner-scoped export systems stay closed until privacy, deletion, access, and live proof pass.",
    href: "/status",
    style: "left-[76%] top-[58%]",
  },
  {
    label: "Council Gate",
    status: "Gated",
    copy: "Future multi-model review remains gated. No autonomous council jobs are live from this preview.",
    href: "/status",
    style: "left-[24%] top-[61%]",
  },
  {
    label: "Passport Boundary",
    status: "Consent",
    copy: "Sensitive future-facing systems open only through consent, ownership, export, and revoke controls.",
    href: "/passport",
    style: "left-[50%] top-[74%]",
  },
  {
    label: "Ground Return",
    status: "Preview",
    copy: "Ground is the base layer beneath the forward path, still public-safe and sample-only.",
    href: "/ground",
    style: "left-[18%] top-[80%]",
  },
  {
    label: "Sky Field",
    status: "Preview",
    copy: "Sky gives the path atmosphere while passive signals and emotional inference remain closed.",
    href: "/sky",
    style: "left-[82%] top-[80%]",
  },
] as const;

const worldFlow = [
  ["Ground", "/ground", "root layer", "Preview"],
  ["Sky", "/sky", "atmosphere", "Preview"],
  ["Horizon", "/horizon", "future direction", "Active"],
  ["Life Map", "/life-map", "symbolic memory field", "Preview"],
  ["Focus", "/focus", "selected moment", "Demo"],
  ["Replay", "/replay", "cinematic thread", "Preview"],
  ["Orb", "/orb", "companion guide", "Guide"],
  ["Passport", "/passport", "consent boundary", "Consent"],
] as const;

const pathCards = [
  [
    "Forward-looking, not presumptive",
    "Preview",
    "Horizon points toward possible routes without claiming certainty, prediction, or private-life forecasting.",
  ],
  [
    "Evidence-gated",
    "Gated",
    "Generated media, exports, automation, and autonomous jobs remain gated until infrastructure and smoke evidence are complete.",
  ],
  [
    "Replay connected",
    "Connected",
    "Horizon connects forward direction to Replay and story threads while keeping generated output clearly preview-only.",
  ],
  [
    "Passport controlled",
    "Consent-first",
    "Future-facing systems remain bound by consent, ownership, export, delete, and revoke controls.",
  ],
  [
    "Launch-safe entry",
    "Safe",
    "Public users are directed into real demo routes and early-access paths, not fake production affordances.",
  ],
] as const;

const horizonIs = [
  "Forward direction and possibility framing",
  "A roadmap-style Genesis preview",
  "A bridge between Replay, world layers, and future systems",
  "A public-safe visual layer connected to real demo routes",
] as const;

const horizonIsNot = [
  "Guaranteed forecasting or private-life prediction",
  "Autonomous job planning or action in the world",
  "Production media generation, exports, or marketplace flows",
  "A promise that future owner-scoped systems are already live",
] as const;

const navLink =
  "inline-flex min-h-11 items-center rounded-full border px-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200";

const panel = "border border-white/10 bg-slate-950/58 shadow-2xl shadow-black/35 backdrop-blur-2xl";

export default function HorizonPage() {
  return (
    <main
      aria-label="URAI Horizon preview layer"
      className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_50%_-18%,rgba(253,224,71,0.18),transparent_34rem),radial-gradient(circle_at_16%_12%,rgba(251,146,60,0.12),transparent_30rem),radial-gradient(circle_at_82%_18%,rgba(56,189,248,0.14),transparent_30rem),linear-gradient(180deg,#020617_0%,#07111f_42%,#130d05_72%,#02030a_100%)] text-white"
    >
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_13%_20%,rgba(255,255,255,0.68)_0_1px,transparent_2px),radial-gradient(circle_at_73%_16%,rgba(253,224,71,0.58)_0_1px,transparent_2px),radial-gradient(circle_at_48%_38%,rgba(186,230,253,0.44)_0_1px,transparent_2px),radial-gradient(circle_at_86%_64%,rgba(251,191,36,0.36)_0_1px,transparent_2px)]" />
        <div className="absolute inset-x-[-16%] top-[42%] h-[20rem] rounded-[50%] border-t border-amber-100/22 bg-[radial-gradient(ellipse_at_50%_0%,rgba(253,224,71,0.18),transparent_58%)] blur-[1px]" />
        <div className="absolute inset-x-[-12%] top-[48%] h-28 bg-gradient-to-b from-amber-200/12 via-orange-200/6 to-transparent blur-2xl" />
        <div className="absolute inset-x-[-16%] bottom-[-16rem] h-[38rem] rounded-[50%] border-t border-orange-100/14 bg-[radial-gradient(ellipse_at_50%_0%,rgba(251,146,60,0.14),transparent_60%),linear-gradient(180deg,rgba(67,20,7,0.08),rgba(0,0,0,0.86))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/78" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-[min(1280px,calc(100%-2rem))] flex-col pb-20 pt-6">
        <nav className={`${panel} flex items-center justify-between gap-4 rounded-full px-4 py-3`} aria-label="URAI spatial navigation">
          <Link
            href="/home"
            className="inline-flex min-h-11 items-center gap-3 rounded-full font-extrabold tracking-[0.16em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
          >
            <span className="h-3 w-3 rounded-full bg-amber-200 shadow-[0_0_28px_rgba(253,224,71,0.9)]" aria-hidden="true" />
            URAI HORIZON
          </Link>
          <div className="flex max-w-[990px] flex-wrap justify-end gap-2">
            {navItems.map(([label, href, state]) => {
              const active = href === "/horizon";
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`${navLink} ${
                    active
                      ? "border-amber-200/45 bg-amber-200/16 text-amber-50"
                      : "border-white/10 bg-white/[0.05] text-white/70 hover:border-amber-200/36 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{label}</span>
                  <span className="ml-2 hidden rounded-full border border-white/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-white/48 2xl:inline-flex">
                    {state}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        <section
          className={`${panel} relative mt-4 grid flex-1 items-center gap-6 overflow-hidden rounded-[3rem] p-5 sm:p-8 lg:grid-cols-[1.12fr_0.88fr] lg:p-8`}
          aria-labelledby="horizon-title"
        >
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_28%_10%,rgba(255,255,255,0.08),transparent_13rem),radial-gradient(circle_at_76%_24%,rgba(253,224,71,0.08),transparent_17rem),linear-gradient(125deg,rgba(251,191,36,0.09),transparent_48%)]"
            aria-hidden="true"
          />

          <section
            className="relative z-10 min-h-[31rem] overflow-hidden rounded-[2.6rem] border border-amber-200/16 bg-[radial-gradient(circle_at_50%_38%,rgba(253,224,71,0.22),transparent_15rem),radial-gradient(circle_at_54%_60%,rgba(56,189,248,0.11),transparent_18rem),linear-gradient(180deg,rgba(15,23,42,0.08),rgba(2,6,23,0.88))] p-5 shadow-2xl shadow-black/45 sm:min-h-[35rem]"
            aria-labelledby="horizon-visual-title"
          >
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(253,224,71,0.1),transparent_35%,rgba(251,146,60,0.09)_58%,transparent_86%)]" />
            <div aria-hidden="true" className="absolute left-[-12%] top-[39%] h-32 w-[124%] rotate-[-2deg] rounded-[50%] bg-amber-200/12 blur-3xl" />
            <div aria-hidden="true" className="absolute inset-x-[-12%] top-[48%] h-20 rounded-[50%] border-t border-amber-100/34 bg-[radial-gradient(ellipse_at_50%_0%,rgba(253,224,71,0.24),transparent_66%)]" />
            <div aria-hidden="true" className="absolute inset-x-[-22%] bottom-[-8rem] h-[20rem] rounded-[50%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(251,146,60,0.18),transparent_62%)]" />

            <svg className="absolute inset-0 h-full w-full opacity-80" viewBox="0 0 920 700" aria-hidden="true">
              <defs>
                <linearGradient id="horizonPath" x1="460" x2="460" y1="246" y2="690" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="rgba(253,224,71,.62)" />
                  <stop offset="1" stopColor="rgba(251,146,60,.06)" />
                </linearGradient>
                <radialGradient id="horizonGlow" cx="50%" cy="49%" r="44%">
                  <stop offset="0" stopColor="rgba(255,247,237,.86)" />
                  <stop offset=".28" stopColor="rgba(253,224,71,.28)" />
                  <stop offset="1" stopColor="rgba(253,224,71,0)" />
                </radialGradient>
              </defs>
              <ellipse cx="460" cy="335" rx="350" ry="120" fill="url(#horizonGlow)" />
              <path d="M454 286 L262 690" stroke="url(#horizonPath)" strokeWidth="2" />
              <path d="M466 286 L664 690" stroke="url(#horizonPath)" strokeWidth="2" />
              <path d="M418 302 C318 392 214 482 92 650" fill="none" stroke="rgba(253,224,71,.28)" strokeWidth="1.4" />
              <path d="M500 302 C606 392 712 482 830 650" fill="none" stroke="rgba(125,211,252,.28)" strokeWidth="1.4" />
              <path d="M246 500 C350 438 566 438 674 500" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1" strokeDasharray="7 12" />
              <path d="M178 602 C330 548 590 548 746 602" fill="none" stroke="rgba(251,191,36,.16)" strokeWidth="1" />
              <circle cx="460" cy="286" r="6" fill="rgba(255,247,237,.95)" />
              <circle cx="674" cy="500" r="4" fill="rgba(186,230,253,.9)" />
              <circle cx="246" cy="500" r="4" fill="rgba(253,224,71,.88)" />
              <circle cx="178" cy="602" r="3.5" fill="rgba(251,191,36,.8)" />
              <circle cx="746" cy="602" r="3.5" fill="rgba(125,211,252,.78)" />
            </svg>

            <div className="relative min-h-[28rem] sm:min-h-[32rem]" aria-label="Horizon visual preview field">
              <div aria-hidden="true" className="absolute left-1/2 top-[43%] h-[21rem] w-[21rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/12 shadow-[0_0_120px_rgba(253,224,71,0.12)]" />
              <div aria-hidden="true" className="absolute left-1/2 top-[44%] h-[10rem] w-[10rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff7ed_0_5%,#fde68a_15%,rgba(251,191,36,0.22)_46%,transparent_74%)] blur-sm motion-safe:animate-pulse" />
              <div className="absolute right-4 top-4 rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-amber-50/82">
                Genesis visual / roadmap preview
              </div>

              {horizonNodes.map((node) => (
                <Link
                  key={node.label}
                  href={node.href}
                  className={`group absolute ${node.style} z-10 min-h-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/16 bg-slate-950/72 px-4 py-3 text-left shadow-2xl shadow-black/35 backdrop-blur-xl transition hover:z-20 hover:scale-[1.02] hover:border-amber-200/42 hover:bg-slate-900/86 focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200`}
                  aria-label={`${node.label}: ${node.copy}`}
                >
                  <span className="block text-xs font-black uppercase tracking-[0.15em] text-amber-100">{node.label}</span>
                  <span className="mt-1 inline-flex rounded-full border border-amber-200/20 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-[0.1em] text-amber-100/70">
                    {node.status}
                  </span>
                  <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.7rem)] hidden w-64 -translate-x-1/2 rounded-2xl border border-amber-200/18 bg-slate-950/92 p-3 text-xs leading-5 text-white/72 shadow-2xl shadow-black/40 group-hover:block group-focus-visible:block">
                    {node.copy}
                  </span>
                </Link>
              ))}

              <div className="absolute bottom-4 left-4 right-4 rounded-[1.5rem] border border-white/12 bg-slate-950/76 p-4 backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.26em] text-amber-200">Future direction layer</p>
                <h2 id="horizon-visual-title" className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                  The path opens before it becomes personal.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/66">
                  This field is symbolic and public-safe. It shows where URAI can point next without running private forecasting, provider planning, or autonomous work.
                </p>
              </div>
            </div>
          </section>

          <div className="relative z-10">
            <p className="inline-flex rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-amber-100">
              Horizon Preview
            </p>
            <h1 id="horizon-title" className="mt-5 max-w-3xl text-[clamp(2.8rem,6vw,5.3rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
              A future path, clearly marked before it becomes personal.
            </h1>
            <p className="mt-5 max-w-2xl text-[clamp(1rem,1.75vw,1.25rem)] leading-[1.3] tracking-[-0.03em] text-amber-50/82">
              Horizon frames where URAI may help organize future direction, story threads, and possibility. In Genesis, it remains a safe roadmap preview while owner-scoped systems, generated media, export, automation, and autonomous jobs stay gated until proven.
            </p>
            <p className="mt-5 max-w-2xl rounded-2xl border border-amber-200/14 bg-amber-200/[0.07] px-4 py-3 text-sm leading-6 text-white/74">
              No personal forecasting, private recommendations, or future-claim systems are running in this public preview.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" aria-label="Horizon actions">
              {primaryActions.map(([label, href, note], index) => (
                <Link
                  key={label}
                  href={href}
                  className={
                    index === 0
                      ? "inline-flex min-h-12 items-center justify-center rounded-full border border-amber-100/40 bg-gradient-to-br from-amber-200 to-orange-200 px-6 text-sm font-extrabold text-stone-950 shadow-[0_18px_44px_rgba(251,191,36,0.24)] transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
                      : "inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.075] px-5 text-sm font-bold text-white/84 transition hover:-translate-y-0.5 hover:border-amber-200/40 hover:bg-white/12 hover:text-white active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
                  }
                >
                  <span>{label}</span>
                  <span className="ml-2 hidden rounded-full border border-white/15 px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.12em] opacity-60 sm:inline-flex">
                    {note}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-6 sm:p-9`} aria-labelledby="flow-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-amber-200">URAI world flow</p>
            <h2 id="flow-title" className="mt-4 text-[clamp(2.2rem,4vw,3.7rem)] font-semibold leading-none tracking-[-0.06em]">
              The future edge is connected, but not automated.
            </h2>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-8" aria-label="Horizon connected routes">
            {worldFlow.map(([label, href, note, chip], index) => (
              <Link
                key={label}
                href={href}
                className="min-h-[154px] rounded-[1.35rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(253,224,71,0.12),transparent_12rem)] bg-white/[0.05] p-4 transition hover:-translate-y-0.5 hover:border-amber-200/30 hover:bg-white/[0.075] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
              >
                <span className="block text-xs font-black tracking-[0.16em] text-amber-200/68">{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-3 block text-xl tracking-[-0.04em] text-white">{label}</strong>
                <span className="mt-2 block text-xs leading-5 text-white/58">{note}</span>
                <span className="mt-3 inline-flex rounded-full border border-amber-200/18 px-2 py-1 text-[0.6rem] font-black uppercase tracking-[0.12em] text-amber-100/72">
                  {chip}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-6 sm:p-9`} aria-labelledby="path-cards-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-amber-200">Path status</p>
            <h2 id="path-cards-title" className="mt-4 text-[clamp(2.1rem,3.7vw,3.45rem)] font-semibold leading-none tracking-[-0.06em]">
              The route is visible. The private systems stay closed.
            </h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {pathCards.map(([title, chip, body]) => (
              <article
                key={title}
                className="min-h-[226px] rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(251,191,36,0.12),transparent_14rem)] bg-white/[0.055] p-5"
              >
                <span className="inline-flex min-h-8 items-center rounded-full border border-amber-200/25 px-3 text-xs font-black uppercase tracking-[0.08em] text-amber-200">
                  {chip}
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.04em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/64">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 grid gap-4 rounded-[2.25rem] p-6 sm:p-9 lg:grid-cols-2`} aria-labelledby="horizon-trust-title">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-amber-200">Trust boundary</p>
            <h2 id="horizon-trust-title" className="mt-4 text-[clamp(2rem,3.5vw,3.25rem)] font-semibold leading-none tracking-[-0.06em]">
              What Horizon is and is not.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:col-span-2">
            <article className="rounded-[1.5rem] border border-amber-200/15 bg-amber-200/[0.06] p-5">
              <h3 className="text-xl font-semibold tracking-[-0.04em] text-white">Horizon is</h3>
              <ul className="mt-4 grid gap-3 p-0">
                {horizonIs.map((item) => (
                  <li key={item} className="list-none rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white/72">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-[1.5rem] border border-sky-200/15 bg-sky-200/[0.055] p-5">
              <h3 className="text-xl font-semibold tracking-[-0.04em] text-white">Horizon is not</h3>
              <ul className="mt-4 grid gap-3 p-0">
                {horizonIsNot.map((item) => (
                  <li key={item} className="list-none rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white/72">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section
          className={`${panel} mt-4 rounded-[2.25rem] border-amber-200/15 bg-[radial-gradient(circle_at_8%_0%,rgba(250,204,21,0.1),transparent_18rem)] p-6 sm:p-8`}
          aria-labelledby="horizon-safety-title"
        >
          <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-200">Launch safety</p>
          <h2 id="horizon-safety-title" className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
            Horizon is a roadmap-style Genesis preview.
          </h2>
          <p className="mt-3 max-w-5xl text-sm leading-6 text-white/68">
            Real generated life films, autonomous jobs, marketplace flows, export systems, private forecasting, provider-backed life planning, and production media generation remain gated until infrastructure, privacy controls, owner-scoped storage, tests, and smoke evidence are complete.
          </p>
        </section>
      </div>
    </main>
  );
}
