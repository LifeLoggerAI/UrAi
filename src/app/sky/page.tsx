import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Sky is URAI Genesis's launch-safe atmosphere layer: an expansive visual reflection preview where emotional weather, passive signals, and derived intelligence remain gated.";

export const metadata: Metadata = {
  title: "Sky Preview | URAI Genesis",
  description,
  openGraph: {
    title: "URAI Sky Preview | Genesis",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "URAI Sky Preview | Genesis",
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
  ["Sky", "/sky", "Active"],
  ["Horizon", "/horizon", "Future"],
] as const;

const primaryActions = [
  ["Open Horizon", "/horizon", "future preview"],
  ["Touch Ground", "/ground", "base layer"],
  ["Return Home", "/home", "Genesis entry"],
  ["Review Passport", "/passport", "consent boundary"],
  ["Open Life Map", "/life-map", "symbolic sky"],
] as const;

const skyNodes = [
  {
    label: "Atmosphere",
    status: "Safe visual",
    copy: "The visual mood layer of URAI's Genesis preview. It is atmosphere, not live inference.",
    href: "/sky",
    style: "left-[50%] top-[34%]",
  },
  {
    label: "Emotional Weather",
    status: "Gated",
    copy: "Future derived reflection remains gated. No live mood tracking runs in the public demo.",
    href: "/status",
    style: "left-[72%] top-[29%]",
  },
  {
    label: "Constellation Drift",
    status: "Preview",
    copy: "Sample stars and arcs show how reflection may feel without using private memory data.",
    href: "/life-map",
    style: "left-[31%] top-[28%]",
  },
  {
    label: "Passport Boundary",
    status: "Consent",
    copy: "Sensitive context opens only through Passport, export/delete controls, and explicit consent.",
    href: "/passport",
    style: "left-[23%] top-[58%]",
  },
  {
    label: "Horizon Gate",
    status: "Future",
    copy: "The future direction layer is visible as preview only, not autonomous planning or jobs.",
    href: "/horizon",
    style: "left-[76%] top-[58%]",
  },
  {
    label: "Ground Anchor",
    status: "Preview",
    copy: "Return to the stabilizing base layer. No location, health, or device signals are connected here.",
    href: "/ground",
    style: "left-[50%] top-[74%]",
  },
] as const;

const stack = [
  ["Ground", "/ground", "rooted base layer", "Preview"],
  ["Sky", "/sky", "reflective atmosphere", "Active"],
  ["Horizon", "/horizon", "future direction", "Future"],
  ["Life Map", "/life-map", "symbolic memory field", "Preview"],
  ["Orb", "/orb", "companion guide", "Guide"],
  ["Passport", "/passport", "consent boundary", "Consent"],
] as const;

const atmosphereCards = [
  ["Expansive, not empty", "Preview", "Sky creates space for reflection without becoming a blank page or fake sensor dashboard."],
  ["No hidden sensing", "Closed", "No location, audio, camera, health, sleep, device, or biometric capture occurs in this preview."],
  ["Emotional weather gated", "Gated", "Derived mood and context systems remain closed until consent and evidence gates pass."],
  ["Connected to Ground", "Preview", "Sky sits above the rooted base layer and points ahead toward Horizon."],
  ["Public-safe preview", "Safe visual", "This route uses safe local visuals while richer systems stay gated."],
] as const;

const skyIs = [
  "Spacious reflection and perspective",
  "Atmosphere for the URAI Genesis world",
  "A safe visual preview using local/sample states",
  "Connected to Ground, Horizon, Life Map, Orb, and Passport",
] as const;

const skyIsNot = [
  "Surveillance, passive sensing, or background tracking",
  "Emotional diagnosis, therapy, or emergency support",
  "Live mood, health, location, audio, camera, or biometric capture",
  "Provider-backed private-memory AI or autonomous jobs",
] as const;

const navLink =
  "inline-flex min-h-11 items-center rounded-full border px-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-200";

const panel = "border border-white/10 bg-slate-950/58 shadow-2xl shadow-black/35 backdrop-blur-2xl";

export default function SkyPage() {
  return (
    <main aria-label="URAI Sky preview layer" className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_50%_-12%,rgba(125,211,252,0.28),transparent_34rem),radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.18),transparent_30rem),radial-gradient(circle_at_82%_22%,rgba(167,139,250,0.18),transparent_28rem),linear-gradient(180deg,#020617_0%,#07111f_46%,#02030a_100%)] text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_15%_18%,rgba(255,255,255,0.72)_0_1px,transparent_2px),radial-gradient(circle_at_72%_17%,rgba(186,230,253,0.58)_0_1px,transparent_2px),radial-gradient(circle_at_43%_38%,rgba(221,214,254,0.48)_0_1px,transparent_2px),radial-gradient(circle_at_84%_63%,rgba(125,211,252,0.38)_0_1px,transparent_2px)]" />
        <div className="absolute left-1/2 top-[35%] h-[62rem] w-[62rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/10 shadow-[0_0_150px_rgba(125,211,252,0.14)]" />
        <div className="absolute inset-x-[-12%] top-[43%] h-[18rem] rounded-[50%] border-t border-sky-100/18 bg-[radial-gradient(ellipse_at_50%_0%,rgba(125,211,252,0.16),transparent_58%)] blur-[1px]" />
        <div className="absolute inset-x-[-16%] bottom-[-15rem] h-[36rem] rounded-[50%] border-t border-cyan-100/14 bg-[radial-gradient(ellipse_at_50%_0%,rgba(56,189,248,0.16),transparent_56%),linear-gradient(180deg,rgba(7,89,133,0.05),rgba(0,0,0,0.84))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/76" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-[min(1260px,calc(100%-2rem))] flex-col pb-20 pt-6">
        <nav className={`${panel} flex items-center justify-between gap-4 rounded-full px-4 py-3`} aria-label="URAI spatial navigation">
          <Link href="/home" className="inline-flex min-h-11 items-center gap-3 rounded-full font-extrabold tracking-[0.16em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-200">
            <span className="h-3 w-3 rounded-full bg-sky-200 shadow-[0_0_28px_rgba(125,211,252,0.9)]" aria-hidden="true" />
            URAI SKY
          </Link>
          <div className="flex max-w-[960px] flex-wrap justify-end gap-2">
            {navItems.map(([label, href, state]) => {
              const active = href === "/sky";
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`${navLink} ${active ? "border-sky-200/45 bg-sky-200/16 text-sky-50" : "border-white/10 bg-white/[0.05] text-white/70 hover:border-sky-200/36 hover:bg-white/10 hover:text-white"}`}
                >
                  <span>{label}</span>
                  <span className="ml-2 hidden rounded-full border border-white/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-white/48 2xl:inline-flex">{state}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <section className={`${panel} relative mt-4 grid flex-1 items-center gap-6 overflow-hidden rounded-[3rem] p-5 sm:p-8 lg:grid-cols-[1.08fr_0.92fr] lg:p-8`} aria-labelledby="sky-title">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_12%,rgba(255,255,255,0.08),transparent_13rem),linear-gradient(125deg,rgba(56,189,248,0.1),transparent_48%)]" aria-hidden="true" />

          <section className="relative z-10 min-h-[28rem] overflow-hidden rounded-[2.6rem] border border-sky-200/16 bg-[radial-gradient(circle_at_50%_22%,rgba(125,211,252,0.24),transparent_16rem),radial-gradient(circle_at_58%_58%,rgba(167,139,250,0.13),transparent_18rem),linear-gradient(180deg,rgba(15,23,42,0.08),rgba(2,6,23,0.88))] p-5 shadow-2xl shadow-black/45 sm:min-h-[34rem]" aria-labelledby="sky-visual-title">
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(147,197,253,0.12),transparent_38%,rgba(14,165,233,0.08)_58%,transparent_82%)]" />
            <div aria-hidden="true" className="absolute left-[-12%] top-[26%] h-32 w-[124%] rotate-[-4deg] rounded-[50%] bg-sky-200/10 blur-3xl" />
            <div aria-hidden="true" className="absolute left-[-14%] top-[48%] h-28 w-[130%] rotate-[3deg] rounded-[50%] bg-violet-200/10 blur-3xl" />
            <div aria-hidden="true" className="absolute inset-x-[-8%] top-[57%] h-28 rounded-[50%] border-t border-cyan-100/25 bg-[radial-gradient(ellipse_at_50%_0%,rgba(125,211,252,0.18),transparent_62%)]" />
            <svg className="absolute inset-0 h-full w-full opacity-75" viewBox="0 0 900 680" aria-hidden="true">
              <path d="M82 226 C214 112 340 278 462 184 S658 240 818 112" fill="none" stroke="rgba(191,233,255,.34)" strokeWidth="1" />
              <path d="M118 392 C268 282 402 422 560 322 S744 354 822 482" fill="none" stroke="rgba(221,214,254,.22)" strokeWidth="1" />
              <path d="M170 520 C302 458 576 454 734 520" fill="none" stroke="rgba(125,211,252,.22)" strokeWidth="1" strokeDasharray="7 12" />
              <circle cx="462" cy="184" r="5" fill="rgba(240,249,255,.92)" />
              <circle cx="818" cy="112" r="4" fill="rgba(221,214,254,.9)" />
              <circle cx="560" cy="322" r="4" fill="rgba(186,230,253,.9)" />
              <circle cx="170" cy="520" r="3" fill="rgba(153,246,228,.8)" />
            </svg>

            <div className="relative min-h-[25rem] sm:min-h-[31rem]" aria-label="Sky visual preview field">
              <div aria-hidden="true" className="absolute left-1/2 top-[46%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-100/12 shadow-[0_0_120px_rgba(125,211,252,0.12)]" />
              <div aria-hidden="true" className="absolute left-1/2 top-[46%] h-[14rem] w-[14rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#f0f9ff_0_4%,#7dd3fc_14%,rgba(56,189,248,0.2)_48%,transparent_74%)] blur-sm motion-safe:animate-pulse" />
              <div className="absolute right-4 top-4 rounded-full border border-sky-200/20 bg-sky-200/10 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-sky-50/82">
                Genesis visual / safe preview
              </div>

              {skyNodes.map((node) => (
                <Link
                  key={node.label}
                  href={node.href}
                  className={`group absolute ${node.style} z-10 min-h-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/16 bg-slate-950/72 px-4 py-3 text-left shadow-2xl shadow-black/35 backdrop-blur-xl transition hover:z-20 hover:scale-[1.02] hover:border-sky-200/42 hover:bg-slate-900/86 focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-200`}
                  aria-label={`${node.label}: ${node.copy}`}
                >
                  <span className="block text-xs font-black uppercase tracking-[0.15em] text-sky-100">{node.label}</span>
                  <span className="mt-1 inline-flex rounded-full border border-sky-200/20 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-[0.1em] text-sky-100/70">{node.status}</span>
                  <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.7rem)] hidden w-64 -translate-x-1/2 rounded-2xl border border-sky-200/18 bg-slate-950/92 p-3 text-xs leading-5 text-white/72 shadow-2xl shadow-black/40 group-hover:block group-focus-visible:block">
                    {node.copy}
                  </span>
                </Link>
              ))}

              <div className="absolute bottom-4 left-4 right-4 rounded-[1.5rem] border border-white/12 bg-slate-950/74 p-4 backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.26em] text-sky-200">Reflective atmosphere</p>
                <h2 id="sky-visual-title" className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">The sky opens before the sensors do.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/66">
                  This field is local, symbolic, and preview-only. It shows how URAI can feel spacious without claiming hidden sensing or private emotional inference.
                </p>
              </div>
            </div>
          </section>

          <div className="relative z-10">
            <p className="inline-flex rounded-full border border-sky-200/25 bg-sky-200/10 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-sky-100">
              Sky Preview
            </p>
            <h1 id="sky-title" className="mt-5 max-w-3xl text-[clamp(2.85rem,6.2vw,5.45rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
              An expansive field for reflection without surveillance.
            </h1>
            <p className="mt-5 max-w-2xl text-[clamp(1rem,1.75vw,1.25rem)] leading-[1.3] tracking-[-0.03em] text-sky-50/82">
              Sky gives URAI its atmosphere: space, perspective, and emotional weather. In Genesis, it is a safe visual layer. Passive signals, derived intelligence, and private context remain gated until consent and launch evidence are complete.
            </p>
            <p className="mt-5 max-w-2xl rounded-2xl border border-sky-200/14 bg-sky-200/[0.07] px-4 py-3 text-sm leading-6 text-white/74">
              No hidden sensing, audio, device, health, location, camera, or biometric capture occurs in this public preview.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" aria-label="Sky actions">
              {primaryActions.map(([label, href, note], index) => (
                <Link
                  key={label}
                  href={href}
                  className={index === 0 ? "inline-flex min-h-12 items-center justify-center rounded-full border border-sky-100/40 bg-gradient-to-br from-sky-200 to-cyan-200 px-6 text-sm font-extrabold text-sky-950 shadow-[0_18px_44px_rgba(56,189,248,0.24)] transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-200" : "inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.075] px-5 text-sm font-bold text-white/84 transition hover:-translate-y-0.5 hover:border-sky-200/40 hover:bg-white/12 hover:text-white active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-200"}
                >
                  <span>{label}</span>
                  <span className="ml-2 hidden rounded-full border border-white/15 px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.12em] opacity-60 sm:inline-flex">{note}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-6 sm:p-9`} aria-labelledby="stack-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-sky-200">URAI spatial stack</p>
            <h2 id="stack-title" className="mt-4 text-[clamp(2.2rem,4vw,3.7rem)] font-semibold leading-none tracking-[-0.06em]">Sky only makes sense when the whole world is visible.</h2>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-6" aria-label="Sky connected routes">
            {stack.map(([label, href, note, chip], index) => (
              <Link key={label} href={href} className="min-h-[148px] rounded-[1.35rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(125,211,252,0.12),transparent_12rem)] bg-white/[0.05] p-4 transition hover:-translate-y-0.5 hover:border-sky-200/30 hover:bg-white/[0.075] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-200">
                <span className="block text-xs font-black tracking-[0.16em] text-sky-200/68">{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-3 block text-xl tracking-[-0.04em] text-white">{label}</strong>
                <span className="mt-2 block text-xs leading-5 text-white/58">{note}</span>
                <span className="mt-3 inline-flex rounded-full border border-sky-200/18 px-2 py-1 text-[0.6rem] font-black uppercase tracking-[0.12em] text-sky-100/72">{chip}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-6 sm:p-9`} aria-labelledby="sky-cards-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-sky-200">Atmosphere status</p>
            <h2 id="sky-cards-title" className="mt-4 text-[clamp(2.1rem,3.7vw,3.45rem)] font-semibold leading-none tracking-[-0.06em]">The atmosphere is alive, but the sensing is closed.</h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {atmosphereCards.map(([title, chip, body]) => (
              <article key={title} className="min-h-[220px] rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(56,189,248,0.12),transparent_14rem)] bg-white/[0.055] p-5">
                <span className="inline-flex min-h-8 items-center rounded-full border border-sky-200/25 px-3 text-xs font-black uppercase tracking-[0.08em] text-sky-200">{chip}</span>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.04em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/64">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 grid gap-4 rounded-[2.25rem] p-6 sm:p-9 lg:grid-cols-2`} aria-labelledby="sky-trust-title">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-sky-200">Trust boundary</p>
            <h2 id="sky-trust-title" className="mt-4 text-[clamp(2rem,3.5vw,3.25rem)] font-semibold leading-none tracking-[-0.06em]">What Sky is and is not.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:col-span-2">
            <article className="rounded-[1.5rem] border border-sky-200/15 bg-sky-200/[0.06] p-5">
              <h3 className="text-xl font-semibold tracking-[-0.04em] text-white">Sky is</h3>
              <ul className="mt-4 grid gap-3 p-0">
                {skyIs.map((item) => (
                  <li key={item} className="list-none rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white/72">{item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-[1.5rem] border border-amber-200/15 bg-amber-200/[0.06] p-5">
              <h3 className="text-xl font-semibold tracking-[-0.04em] text-white">Sky is not</h3>
              <ul className="mt-4 grid gap-3 p-0">
                {skyIsNot.map((item) => (
                  <li key={item} className="list-none rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white/72">{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] border-amber-200/15 bg-[radial-gradient(circle_at_8%_0%,rgba(250,204,21,0.1),transparent_18rem)] p-6 sm:p-8`} aria-labelledby="sky-safety-title">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-200">Launch safety</p>
          <h2 id="sky-safety-title" className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">Sky is a visual preview only.</h2>
          <p className="mt-3 max-w-5xl text-sm leading-6 text-white/68">
            Emotional weather, passive signals, device context, health data, biometrics, location, camera, microphone, provider-backed intelligence, and derived private context remain gated until consent, privacy controls, export/delete, tests, audit, and live smoke evidence are complete.
          </p>
        </section>
      </div>
    </main>
  );
}
