import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Ground is a cinematic URAI Genesis preview for a rooted base layer. Real sensing, health, location, device, and biometric context remain closed until Passport consent and launch evidence are complete.";

export const metadata: Metadata = {
  title: "Ground Preview | URAI Genesis",
  description,
  openGraph: {
    title: "URAI Ground Preview | Genesis",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "URAI Ground Preview | Genesis",
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
  ["Ground", "/ground", "Active"],
  ["Orb", "/orb", "Preview"],
  ["Orb Chat", "/orb-chat", "Safe"],
  ["Sky", "/sky", "Preview"],
  ["Horizon", "/horizon", "Future"],
] as const;

const groundNodes = [
  {
    id: "root-core",
    label: "Root Core",
    status: "Preview shell",
    copy: "Your safe base state. No private signals are connected in this public preview.",
    style: "left-[46%] top-[58%]",
  },
  {
    id: "horizon",
    label: "Horizon",
    status: "Future layer",
    copy: "Future context can appear here after evidence and consent gates are proven.",
    style: "left-[69%] top-[37%]",
  },
  {
    id: "passport",
    label: "Passport Boundary",
    status: "Consent required",
    copy: "Sensitive sources open only through Passport, export/delete controls, and explicit consent.",
    style: "left-[24%] top-[48%]",
  },
  {
    id: "council",
    label: "Council Gate",
    status: "Gated",
    copy: "Future multi-model review stays gated until provider, audit, and policy evidence is complete.",
    style: "left-[73%] top-[70%]",
  },
  {
    id: "calm-zone",
    label: "Calm Zone",
    status: "Local visual",
    copy: "A stabilizing visual state, not a health, sleep, recovery, or biometric inference.",
    style: "left-[31%] top-[72%]",
  },
] as const;

const layerCards = [
  ["Stabilizing, not diagnostic", "Preview", "Ground is designed for calm orientation, not health, recovery, medical, or clinical claims."],
  ["Sample-safe roots", "Preview", "Nodes use local/sample visual states, not private sensor data, passive tracking, or user-derived intelligence."],
  ["Passport boundary", "Consent", "Physical-world sources require explicit Passport consent before any real connection or processing."],
  ["Council gate", "Gated", "Future multi-model review remains gated until evidence, admin controls, and provider boundaries are ready."],
  ["Horizon layer", "Future", "World context appears here as a preview path, not live monitoring, planning, or autonomous action."],
  ["Health and biometrics closed", "Closed", "Health, sleep, location, motion, microphone, camera, and biometrics are closed in the public demo."],
] as const;

const isList = [
  "A calm base layer beneath the Life Map",
  "A Genesis visual preview for grounding and context",
  "A consent-first shell for future physical-world signals",
  "A bridge between Passport, Life Map, Orb, Sky, and Horizon",
] as const;

const isNotList = [
  "Medical diagnosis, therapy, or emergency support",
  "Live health, sleep, location, or biometric monitoring",
  "Passive surveillance or background tracking",
  "Autonomous jobs, provider integrations, or real-world action",
] as const;

const flow = [
  ["Passport", "/passport", "opens consent boundaries"],
  ["Ground", "/ground", "renders safe base context"],
  ["Life Map", "/life-map", "holds symbolic memory sky"],
  ["Sky", "/sky", "frames expansive preview layers"],
  ["Horizon", "/horizon", "marks future paths"],
  ["Council", "/app/council", "stays gated/internal"],
] as const;

const navLink =
  "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200";

const panel = "border border-white/10 bg-slate-950/58 shadow-2xl shadow-black/35 backdrop-blur-2xl";

export default function GroundPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_50%_-8%,rgba(20,184,166,0.18),transparent_30rem),radial-gradient(circle_at_14%_22%,rgba(245,158,11,0.12),transparent_26rem),radial-gradient(circle_at_86%_18%,rgba(56,189,248,0.12),transparent_28rem),linear-gradient(180deg,#030712_0%,#07130f_48%,#020403_100%)] text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-x-[-18%] top-[39%] h-[34rem] rounded-[50%] border-t border-emerald-200/14 bg-[radial-gradient(ellipse_at_50%_0%,rgba(52,211,153,0.16),transparent_50%),linear-gradient(180deg,rgba(6,78,59,0.04),rgba(0,0,0,0.84))]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(167,243,208,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(167,243,208,0.12)_1px,transparent_1px)] [background-size:84px_84px]" />
        <div className="absolute inset-x-0 top-[38%] h-px bg-gradient-to-r from-transparent via-emerald-100/35 to-transparent" />
        <div className="absolute bottom-0 left-1/2 h-[28rem] w-[70rem] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(20,184,166,0.2),transparent_62%)] blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-[min(1260px,calc(100%-2rem))] flex-col pb-20 pt-6">
        <nav className={`${panel} flex items-center justify-between gap-4 rounded-full px-4 py-3`} aria-label="URAI spatial navigation">
          <Link href="/home" className="inline-flex min-h-11 items-center gap-3 rounded-full font-extrabold tracking-[0.16em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200">
            <span className="h-3 w-3 rounded-full bg-emerald-200 shadow-[0_0_28px_rgba(110,231,183,0.9)]" aria-hidden="true" />
            URAI GROUND
          </Link>
          <div className="flex max-w-[820px] flex-wrap justify-end gap-2">
            {navItems.map(([label, href, state]) => {
              const active = href === "/ground";
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`${navLink} ${active ? "border-emerald-200/45 bg-emerald-200/16 text-emerald-50" : "border-white/10 bg-white/[0.05] text-white/70 hover:border-emerald-200/36 hover:bg-white/10 hover:text-white"}`}
                >
                  <span>{label}</span>
                  <span className="ml-2 rounded-full border border-white/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-white/48">{state}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <section className={`${panel} relative mt-4 grid flex-1 items-center gap-8 overflow-hidden rounded-[2.75rem] p-6 sm:p-10 lg:grid-cols-[0.92fr_1.08fr] lg:p-12`} aria-labelledby="ground-title">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.08),transparent_13rem),linear-gradient(125deg,rgba(20,184,166,0.11),transparent_48%)]" aria-hidden="true" />

          <div className="relative z-10">
            <p className="inline-flex rounded-full border border-emerald-200/25 bg-emerald-200/10 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-emerald-100">
              Ground Preview
            </p>
            <h1 id="ground-title" className="mt-6 max-w-3xl text-[clamp(3.55rem,8.5vw,7.25rem)] font-semibold leading-[0.86] tracking-[-0.075em] text-white">
              A calm base layer for returning to yourself.
            </h1>
            <p className="mt-6 max-w-2xl text-[clamp(1.1rem,2.2vw,1.55rem)] leading-[1.22] tracking-[-0.035em] text-emerald-50/82">
              Ground is the rooted layer beneath URAI: a safe Genesis preview for physical-world context, recovery, rhythm, and environment. Real sensing stays closed until Passport consent and launch evidence are complete.
            </p>
            <p className="mt-5 max-w-2xl rounded-2xl border border-emerald-200/14 bg-emerald-200/[0.07] px-4 py-3 text-sm leading-6 text-white/74">
              No live health, sleep, location, biometric, camera, microphone, calendar, contacts, Gmail, or device data is inferred in this public preview.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" aria-label="Ground actions">
              <Link href="/home" className="inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-100/40 bg-gradient-to-br from-emerald-300 to-teal-200 px-6 text-sm font-extrabold text-emerald-950 shadow-[0_18px_44px_rgba(20,184,166,0.24)] transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200">
                Return Home
              </Link>
              <Link href="/life-map" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.075] px-6 text-sm font-bold text-white/84 transition hover:-translate-y-0.5 hover:border-emerald-200/40 hover:bg-white/12 hover:text-white active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200">
                Open Life Map
              </Link>
              <Link href="/passport" className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-200/25 bg-amber-200/10 px-6 text-sm font-bold text-amber-50 transition hover:-translate-y-0.5 hover:bg-amber-200/15 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200">
                Review Passport
              </Link>
            </div>
          </div>

          <section className="relative z-10 overflow-hidden rounded-[2.4rem] border border-emerald-200/16 bg-[radial-gradient(circle_at_48%_38%,rgba(110,231,183,0.2),transparent_13rem),linear-gradient(180deg,rgba(6,78,59,0.1),rgba(2,6,23,0.9))] p-4 shadow-2xl shadow-black/45" aria-labelledby="ground-world-title">
            <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/assets/genesis/ground/ground-base.png')" }} />
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_0_12rem,rgba(2,6,23,0.32)_22rem,rgba(0,0,0,0.86)_100%)]" />
            <div aria-hidden="true" className="absolute inset-x-[-10%] top-[31%] h-36 rounded-[50%] border-t border-emerald-100/22 bg-[radial-gradient(ellipse_at_50%_0%,rgba(110,231,183,0.18),transparent_60%)]" />
            <div aria-hidden="true" className="absolute inset-x-[5%] bottom-[7%] h-[46%] rounded-[50%] border-t border-amber-200/16 bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.13),transparent_58%)]" />
            <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 900 650" aria-hidden="true">
              <path d="M72 206 C214 116 332 276 466 174 S692 230 830 104" fill="none" stroke="rgba(209,250,229,.34)" strokeWidth="1" />
              <path d="M106 388 C246 296 394 420 540 322 S732 342 824 452" fill="none" stroke="rgba(251,191,36,.2)" strokeWidth="1" />
              <path d="M180 502 C308 450 576 448 724 510" fill="none" stroke="rgba(110,231,183,.2)" strokeWidth="1" strokeDasharray="8 12" />
              <circle cx="466" cy="174" r="4" fill="rgba(236,253,245,.9)" />
              <circle cx="830" cy="104" r="4" fill="rgba(251,191,36,.9)" />
              <circle cx="540" cy="322" r="4" fill="rgba(153,246,228,.88)" />
            </svg>

            <div className="relative min-h-[31rem] sm:min-h-[38rem]" aria-label="Ground World Preview">
              <div aria-hidden="true" className="absolute left-1/2 top-[58%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#f0fdf4_0_7%,#6ee7b7_20%,rgba(20,184,166,0.24)_58%,transparent_75%)] shadow-[0_0_90px_rgba(110,231,183,0.62)] motion-safe:animate-pulse" />
              <div aria-hidden="true" className="absolute left-1/2 top-[58%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-100/16" />
              <div aria-hidden="true" className="absolute left-1/2 top-[58%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/10" />

              {groundNodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className={`group absolute ${node.style} z-10 min-h-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/16 bg-slate-950/74 px-4 py-3 text-left shadow-2xl shadow-black/35 backdrop-blur-xl transition hover:z-20 hover:scale-[1.02] hover:border-emerald-200/42 hover:bg-slate-900/86 focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200`}
                  aria-label={`${node.label}: ${node.copy}`}
                >
                  <span className="block text-xs font-black uppercase tracking-[0.15em] text-emerald-100">{node.label}</span>
                  <span className="mt-1 inline-flex rounded-full border border-emerald-200/20 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-[0.1em] text-emerald-100/70">{node.status}</span>
                  <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.7rem)] hidden w-64 -translate-x-1/2 rounded-2xl border border-emerald-200/18 bg-slate-950/92 p-3 text-xs leading-5 text-white/72 shadow-2xl shadow-black/40 group-hover:block group-focus-visible:block">
                    {node.copy}
                  </span>
                </button>
              ))}

              <div className="absolute right-4 top-4 rounded-full border border-emerald-200/20 bg-emerald-200/10 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-emerald-50/82">
                Genesis visual / local preview
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-[1.5rem] border border-white/12 bg-slate-950/74 p-4 backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.26em] text-emerald-200">Ground World Preview</p>
                <h2 id="ground-world-title" className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">The safe shell renders first.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/66">
                  Ground will become the explorable base world for context, councils, and physical-life signals. In Genesis, it renders a local preview shell with no live sensing or private data flow.
                </p>
              </div>
            </div>
          </section>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-6 sm:p-9`} aria-labelledby="ground-layers-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-200">Layer status</p>
            <h2 id="ground-layers-title" className="mt-4 text-[clamp(2.2rem,4vw,3.7rem)] font-semibold leading-none tracking-[-0.06em]">Physical context is visible as a promise, not a claim.</h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {layerCards.map(([title, chip, body]) => (
              <article key={title} className="min-h-[220px] rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(52,211,153,0.12),transparent_14rem)] bg-white/[0.055] p-5">
                <span className="inline-flex min-h-8 items-center rounded-full border border-emerald-200/25 px-3 text-xs font-black uppercase tracking-[0.08em] text-emerald-200">{chip}</span>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.045em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/66">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 grid gap-4 rounded-[2.25rem] p-6 sm:p-9 lg:grid-cols-2`} aria-labelledby="ground-trust-title">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-200">Trust boundary</p>
            <h2 id="ground-trust-title" className="mt-4 text-[clamp(2rem,3.5vw,3.25rem)] font-semibold leading-none tracking-[-0.06em]">What Ground is and is not.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:col-span-2">
            <article className="rounded-[1.5rem] border border-emerald-200/15 bg-emerald-200/[0.06] p-5">
              <h3 className="text-xl font-semibold tracking-[-0.04em] text-white">Ground is</h3>
              <ul className="mt-4 grid gap-3 p-0">
                {isList.map((item) => (
                  <li key={item} className="list-none rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white/72">{item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-[1.5rem] border border-amber-200/15 bg-amber-200/[0.06] p-5">
              <h3 className="text-xl font-semibold tracking-[-0.04em] text-white">Ground is not</h3>
              <ul className="mt-4 grid gap-3 p-0">
                {isNotList.map((item) => (
                  <li key={item} className="list-none rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white/72">{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-6 sm:p-9`} aria-labelledby="ground-flow-title">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-200">How Ground connects</p>
              <h2 id="ground-flow-title" className="mt-4 text-[clamp(2rem,3.6vw,3.35rem)] font-semibold leading-none tracking-[-0.06em]">One route through the URAI world.</h2>
            </div>
            <Link href="/status" className="inline-flex min-h-11 w-fit items-center rounded-full border border-white/12 bg-white/[0.055] px-5 text-sm font-extrabold text-white/78 transition hover:border-emerald-200/36 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200">
              Check launch status
            </Link>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-6" aria-label="Ground route flow">
            {flow.map(([label, href, note], index) => (
              <Link key={label} href={href} className="min-h-[142px] rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4 transition hover:-translate-y-0.5 hover:border-emerald-200/30 hover:bg-white/[0.075] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200">
                <span className="block text-xs font-black tracking-[0.16em] text-emerald-200/68">{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-3 block text-lg tracking-[-0.035em] text-white">{label}</strong>
                <span className="mt-2 block text-xs leading-5 text-white/58">{note}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] border-amber-200/15 bg-[radial-gradient(circle_at_8%_0%,rgba(245,158,11,0.12),transparent_18rem)] p-6 sm:p-8`} aria-labelledby="ground-safety-title">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-200">Launch safety</p>
          <h2 id="ground-safety-title" className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">Ground remains a Genesis preview.</h2>
          <p className="mt-3 max-w-5xl text-sm leading-6 text-white/68">
            Live sensing, health data, recovery inference, location, device, camera, microphone, calendar, contacts, Gmail, and biometric layers stay closed until consent, rules, retention, export/delete, audit, and smoke evidence pass.
          </p>
        </section>
      </div>
    </main>
  );
}
