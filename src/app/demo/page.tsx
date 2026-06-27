import Link from "next/link";
import type { Metadata } from "next";

const description =
  "A cinematic, public-safe URAI Genesis walkthrough: Passport boundaries, Orb, Life Map, Focus, Replay, world layers, Status, and System truth without opening private data.";

export const metadata: Metadata = {
  title: "Public Demo Walkthrough | URAI",
  description,
  alternates: { canonical: "/demo" },
  openGraph: {
    title: "Public Demo Walkthrough | URAI",
    description,
    url: "/demo",
    images: [{ url: "/og/urai-public-demo.svg", width: 1200, height: 630, alt: "URAI public-safe demo walkthrough" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Public Demo Walkthrough | URAI",
    description,
    images: ["/og/urai-public-demo.svg"],
  },
};

const navItems = [
  { href: "/launch", label: "Launch", active: false },
  { href: "/demo", label: "Demo", active: true },
  { href: "/passport", label: "Passport", active: false },
  { href: "/life-map", label: "Life Map", active: false },
  { href: "/status", label: "Status", active: false },
  { href: "/waitlist", label: "Waitlist", active: false },
] as const;

const demoModules = [
  {
    title: "Open the boundary",
    eyebrow: "Passport",
    body: "See how consent, ownership, export, delete, and private layers stay closed until the owner chooses and evidence proves the path.",
    href: "/passport",
    cta: "Review Passport",
    marker: "seal",
  },
  {
    title: "Meet the companion",
    eyebrow: "Orb",
    body: "Enter the sample-safe interface bridge. The Orb can orient the demo without claiming private memory access or autonomous action.",
    href: "/orb",
    cta: "Open Orb",
    marker: "orb",
  },
  {
    title: "Enter the galaxy",
    eyebrow: "Life Map",
    body: "Move into the symbolic memory sky. It shows the shape of URAI with preview states, not a real visitor's private life data.",
    href: "/life-map",
    cta: "Open Life Map",
    marker: "stars",
  },
] as const;

const walkthroughSteps = [
  { step: "01", title: "Passport boundary", body: "Start with the rule: private layers stay closed until consent and evidence gates pass.", href: "/passport", cta: "Open Passport", state: "Consent-first" },
  { step: "02", title: "Orb companion", body: "Meet the living interface bridge in a sample-safe mode that does not open private memory.", href: "/orb", cta: "Open Orb", state: "Demo" },
  { step: "03", title: "Life Map galaxy", body: "Walk into the symbolic star field and see the product shape without a passive memory feed.", href: "/life-map", cta: "Enter Life Map", state: "Preview" },
  { step: "04", title: "Focus a memory", body: "Narrow the field into a single sample-safe focus state without claiming real personal inference.", href: "/focus", cta: "Open Focus", state: "Sample-safe" },
  { step: "05", title: "Replay a sample thread", body: "Watch the cinematic preview path while generated private life movies stay gated.", href: "/replay", cta: "Watch Replay", state: "Preview" },
  { step: "06", title: "Ground layer", body: "View the foundation layer for council, models, useful action, and job ideas as launch-safe preview language.", href: "/ground", cta: "Open Ground", state: "Preview" },
  { step: "07", title: "Sky layer", body: "See emotional weather, stars, and relationship-thread metaphors without passive sensing or private collection.", href: "/sky", cta: "Open Sky", state: "Preview" },
  { step: "08", title: "Horizon layer", body: "Look toward future paths while keeping production media generation, jobs, and marketplace systems gated.", href: "/horizon", cta: "Open Horizon", state: "Gated" },
  { step: "09", title: "Status and System truth", body: "Verify what is live, preview, blocked, or roadmap before any product claim expands.", href: "/status", cta: "Open Status", state: "Evidence" },
] as const;

const previewNodes = [
  { label: "Passport", x: "18%", y: "64%" },
  { label: "Orb", x: "48%", y: "42%" },
  { label: "Life Map", x: "72%", y: "22%" },
  { label: "Focus", x: "68%", y: "60%" },
  { label: "Replay", x: "38%", y: "76%" },
] as const;

const guaranteeItems = [
  "Uses sample and safe preview states only.",
  "No private account data is opened from this route.",
  "Passive sensing remains closed in the public demo.",
  "No provider access is opened from the walkthrough.",
  "No hidden private memory collection runs here.",
  "Private systems remain gated until evidence and consent gates pass.",
] as const;

const shows = [
  "Product flow across public routes.",
  "Symbolic Life Map preview.",
  "Focus and Replay preview states.",
  "Orb, Passport, and consent boundaries.",
  "Ground, Sky, and Horizon world shell.",
] as const;

const staysClosed = [
  "Real private memories.",
  "Provider data and account connections.",
  "Passive signals and hidden sensing.",
  "Health, location, device, audio, and camera data.",
  "Generated life movies as a production service.",
  "Autonomous jobs and marketplace systems.",
] as const;

const proofLinks = [
  { href: "/status", title: "Open Status", body: "Public launch posture and route-level readiness." },
  { href: "/system", title: "Open System Registry", body: "Canonical release truth, evidence gaps, blockers, and repo roles." },
] as const;

const footerLinks = [
  { href: "/launch", label: "Launch" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/waitlist", label: "Waitlist" },
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" },
] as const;

const navLink =
  "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200";
const quietLink =
  "inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/[0.055] px-4 text-sm font-bold text-white/74 transition hover:border-cyan-200/36 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200";
const panel = "border border-white/10 bg-slate-950/62 shadow-2xl shadow-black/35 backdrop-blur-2xl";

function Marker({ type }: { type: "seal" | "orb" | "stars" }) {
  if (type === "seal") {
    return <span aria-hidden="true" className="relative block h-24 rounded-[1.5rem] border border-cyan-100/18 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_24%),linear-gradient(135deg,rgba(34,211,238,0.16),rgba(15,23,42,0.2))]"><span className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/30 shadow-[0_0_34px_rgba(103,232,249,0.22)]" /></span>;
  }
  if (type === "orb") {
    return <span aria-hidden="true" className="grid h-24 place-items-center rounded-[1.5rem] border border-cyan-100/18 bg-[radial-gradient(circle_at_50%_50%,rgba(103,232,249,0.22),transparent_48%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]"><span className="h-14 w-14 rounded-full bg-[radial-gradient(circle,#fff_0_8%,#67e8f9_24%,rgba(20,184,166,0.22)_62%,transparent_74%)] drop-shadow-[0_0_34px_rgba(103,232,249,0.68)]" /></span>;
  }
  return <span aria-hidden="true" className="relative block h-24 overflow-hidden rounded-[1.5rem] border border-cyan-100/18 bg-[radial-gradient(circle_at_25%_38%,rgba(255,255,255,0.75)_0_2px,transparent_3px),radial-gradient(circle_at_62%_22%,rgba(125,211,252,0.78)_0_2px,transparent_3px),radial-gradient(circle_at_78%_64%,rgba(153,246,228,0.75)_0_2px,transparent_3px),linear-gradient(135deg,rgba(14,165,233,0.14),rgba(15,23,42,0.24))]"><span className="absolute left-[28%] top-[41%] h-px w-[42%] rotate-[-14deg] bg-cyan-100/34" /><span className="absolute left-[61%] top-[30%] h-px w-[28%] rotate-[48deg] bg-teal-100/28" /></span>;
}

export default function DemoPage() {
  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_16%_4%,rgba(56,189,248,0.22),transparent_31rem),radial-gradient(circle_at_88%_10%,rgba(45,212,191,0.16),transparent_30rem),radial-gradient(circle_at_48%_76%,rgba(245,158,11,0.1),transparent_32rem),linear-gradient(145deg,#020617_0%,#07111f_48%,#02030a_100%)] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.72)_0_1px,transparent_2px),radial-gradient(circle_at_26%_46%,rgba(125,211,252,0.5)_0_1px,transparent_2px),radial-gradient(circle_at_58%_24%,rgba(153,246,228,0.52)_0_1px,transparent_2px),radial-gradient(circle_at_74%_60%,rgba(224,242,254,0.45)_0_1px,transparent_2px),radial-gradient(circle_at_91%_32%,rgba(186,230,253,0.58)_0_1px,transparent_2px)]" />
        <div className="absolute left-1/2 top-[38%] h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/10 shadow-[0_0_130px_rgba(45,212,191,0.15)]" />
        <div className="absolute inset-x-[-12%] top-[45%] h-36 rounded-[50%] border-t border-cyan-100/16 bg-[radial-gradient(ellipse_at_50%_0%,rgba(125,211,252,0.16),transparent_60%)]" />
        <div className="absolute inset-x-[-18%] bottom-[-14rem] h-[34rem] rounded-[50%] border-t border-emerald-100/14 bg-[radial-gradient(ellipse_at_50%_0%,rgba(20,184,166,0.18),transparent_58%),linear-gradient(180deg,rgba(6,78,59,0.04),rgba(0,0,0,0.86))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/84" />
      </div>

      <div className="relative z-10 mx-auto w-[min(1320px,100%)] pb-16">
        <nav className={`${panel} flex flex-wrap items-center justify-between gap-3 rounded-full px-4 py-3`} aria-label="Demo navigation">
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
                className={`${navLink} ${item.active ? "border-cyan-200/40 bg-cyan-200/[0.12] text-cyan-50" : "border-white/10 bg-white/[0.055] text-white/72 hover:border-cyan-200/36 hover:bg-white/10 hover:text-white"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <section className={`${panel} relative mt-4 grid min-h-[calc(100vh-8rem)] overflow-hidden rounded-[2.85rem] p-5 sm:p-8 lg:grid-cols-[1fr_0.84fr] lg:p-10 xl:p-12`} aria-labelledby="demo-title">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(255,255,255,0.08),transparent_14rem),radial-gradient(circle_at_78%_36%,rgba(45,212,191,0.12),transparent_20rem),linear-gradient(120deg,rgba(14,165,233,0.11),transparent_52%)]" />
          <div className="relative z-10 flex flex-col justify-center py-4">
            <p className="inline-flex w-fit rounded-full border border-cyan-100/25 bg-cyan-100/10 px-4 py-2 text-xs font-black uppercase tracking-[0.34em] text-cyan-100">Sample Demo</p>
            <h1 id="demo-title" className="mt-6 max-w-5xl text-[clamp(3.55rem,8vw,7.25rem)] font-semibold leading-[0.86] tracking-[-0.078em] text-white">
              Walk through URAI without opening anything private.
            </h1>
            <p className="mt-6 max-w-3xl text-[clamp(1.12rem,2.2vw,1.58rem)] leading-[1.2] tracking-[-0.035em] text-cyan-50/82">
              This is the public-safe preview: a Passport boundary, a companion sample, a Life Map galaxy, focus and replay states, and world layers that show the feeling without exposing a real account.
            </p>
            <p className="mt-5 max-w-3xl rounded-2xl border border-emerald-200/18 bg-emerald-200/[0.065] px-4 py-3 text-sm leading-6 text-emerald-50/82">
              No private memory, provider, sensing, or account data is unlocked in this demo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" aria-label="Demo primary actions">
              <a href="#walkthrough" className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-100/50 bg-gradient-to-br from-cyan-100 via-teal-200 to-emerald-200 px-6 text-sm font-black text-slate-950 shadow-[0_20px_54px_rgba(45,212,191,0.25)] transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                Start guided demo
              </a>
              <Link href="/replay" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.075] px-6 text-sm font-bold text-white/82 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/12 hover:text-white active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                Watch replay preview
              </Link>
              <Link href="/passport" className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-200/25 bg-amber-200/10 px-6 text-sm font-bold text-amber-50 transition hover:-translate-y-0.5 hover:bg-amber-200/15 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                Review Passport
              </Link>
            </div>
          </div>

          <aside className="relative z-10 mt-8 min-h-[430px] overflow-hidden rounded-[2.25rem] border border-cyan-100/15 bg-[radial-gradient(circle_at_50%_26%,rgba(125,211,252,0.22),transparent_12rem),radial-gradient(circle_at_50%_72%,rgba(20,184,166,0.18),transparent_19rem),linear-gradient(180deg,rgba(15,23,42,0.38),rgba(2,6,23,0.92))] p-5 lg:mt-0" aria-label="URAI public demo preview map">
            <div aria-hidden="true" className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_18%_20%,rgba(248,250,252,0.78)_0_1px,transparent_2px),radial-gradient(circle_at_72%_24%,rgba(125,211,252,0.68)_0_1px,transparent_2px),radial-gradient(circle_at_44%_42%,rgba(153,246,228,0.56)_0_1px,transparent_2px),radial-gradient(circle_at_82%_58%,rgba(248,250,252,0.52)_0_1px,transparent_2px)]" />
            <div aria-hidden="true" className="absolute left-[16%] top-[64%] h-px w-[58%] rotate-[-28deg] bg-gradient-to-r from-transparent via-cyan-100/36 to-transparent" />
            <div aria-hidden="true" className="absolute left-[47%] top-[42%] h-px w-[34%] rotate-[26deg] bg-gradient-to-r from-transparent via-teal-100/30 to-transparent" />
            <div aria-hidden="true" className="absolute left-[38%] top-[76%] h-px w-[31%] rotate-[-18deg] bg-gradient-to-r from-transparent via-amber-100/26 to-transparent" />
            <div aria-hidden="true" className="absolute left-1/2 top-[45%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff_0_8%,#67e8f9_22%,rgba(20,184,166,0.2)_62%,transparent_74%)] drop-shadow-[0_0_48px_rgba(103,232,249,0.72)] motion-safe:animate-pulse" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[30%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(153,246,228,0.22),transparent_42%),linear-gradient(180deg,transparent,rgba(0,0,0,0.72))]" />
            {previewNodes.map((node) => (
              <Link
                key={node.label}
                href={node.label === "Passport" ? "/passport" : node.label === "Orb" ? "/orb" : node.label === "Life Map" ? "/life-map" : node.label === "Focus" ? "/focus" : "/replay"}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/24 bg-slate-950/72 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-cyan-50 shadow-[0_12px_34px_rgba(0,0,0,0.35)] transition hover:-translate-y-[calc(50%+2px)] hover:border-cyan-100/55 hover:bg-cyan-100/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                style={{ left: node.x, top: node.y }}
              >
                {node.label}
              </Link>
            ))}
            <div className="absolute bottom-5 left-5 right-5 rounded-[1.5rem] border border-white/12 bg-slate-950/72 p-5 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-200">URAI Demo Preview</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] text-white">A guided public route through the system.</h2>
              <p className="mt-3 text-sm leading-6 text-white/62">Every node opens a real route. None opens private data.</p>
            </div>
          </aside>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-3" aria-label="Featured demo modules">
          {demoModules.map((module) => (
            <Link key={module.title} href={module.href} className={`${panel} group min-h-[330px] rounded-[2rem] p-5 transition hover:-translate-y-1 hover:border-cyan-200/34`}>
              <Marker type={module.marker} />
              <span className="mt-5 inline-flex rounded-full border border-cyan-200/24 bg-cyan-200/[0.08] px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.14em] text-cyan-50">{module.eyebrow}</span>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.055em] text-white">{module.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/64">{module.body}</p>
              <span className="mt-6 inline-flex min-h-11 items-center rounded-full border border-cyan-200/24 bg-white/[0.055] px-4 text-sm font-black text-cyan-50 transition group-hover:border-cyan-100/55 group-hover:bg-cyan-200/[0.12]">{module.cta}</span>
            </Link>
          ))}
        </section>

        <section id="walkthrough" className={`${panel} mt-4 rounded-[2.45rem] p-5 sm:p-8`} aria-labelledby="walkthrough-title">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Walkthrough sequence</p>
              <h2 id="walkthrough-title" className="mt-4 text-[clamp(2.35rem,4.4vw,4rem)] font-semibold leading-none tracking-[-0.07em] text-white">A guided path through the public-safe URAI system.</h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-white/58">Follow the nodes in order or jump anywhere. Each route is real, demo-safe, and labeled by its current launch state.</p>
          </div>
          <ol className="relative mt-8 grid gap-4 p-0 md:grid-cols-2 xl:grid-cols-3" aria-label="Public demo walkthrough steps">
            {walkthroughSteps.map((item) => (
              <li key={item.title} className="list-none">
                <Link href={item.href} className="group block min-h-[230px] rounded-[1.65rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(45,212,191,0.1),transparent_14rem)] bg-white/[0.052] p-5 transition hover:-translate-y-0.5 hover:border-cyan-200/34 hover:bg-white/[0.075] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-black tracking-[0.18em] text-cyan-100/58">{item.step}</span>
                    <span className="rounded-full border border-cyan-100/20 px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.12em] text-cyan-50">{item.state}</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.048em] text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/62">{item.body}</p>
                  <span className="mt-5 inline-flex min-h-10 items-center rounded-full border border-white/12 px-4 text-sm font-black text-cyan-100 transition group-hover:border-cyan-100/46 group-hover:bg-cyan-100/10">{item.cta}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] border-emerald-200/15 bg-emerald-200/[0.045] p-5 sm:p-8`} aria-labelledby="public-safe-title">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-100">Public-safe by design</p>
            <h2 id="public-safe-title" className="mt-4 text-[clamp(2.25rem,4vw,3.65rem)] font-semibold leading-none tracking-[-0.065em] text-white">The walkthrough shows URAI without opening a person.</h2>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {guaranteeItems.map((item) => (
              <p key={item} className="rounded-[1.3rem] border border-emerald-100/14 bg-black/25 p-4 text-sm leading-6 text-emerald-50/78">{item}</p>
            ))}
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2" aria-label="What demo shows and what stays closed">
          <article className={`${panel} rounded-[2.25rem] p-5 sm:p-8`}>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">What this demo shows</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.055em] text-white">The shape of URAI.</h2>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-white/66">
              {shows.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">{item}</li>)}
            </ul>
          </article>
          <article className={`${panel} rounded-[2.25rem] border-amber-200/14 bg-amber-200/[0.035] p-5 sm:p-8`}>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-amber-100">What stays closed</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.055em] text-white">The private system.</h2>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-white/66">
              {staysClosed.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">{item}</li>)}
            </ul>
          </article>
        </section>

        <section className={`${panel} mt-4 grid gap-6 rounded-[2.25rem] border-amber-200/16 bg-[radial-gradient(circle_at_0_0,rgba(250,204,21,0.11),transparent_20rem)] p-5 sm:p-8 lg:grid-cols-[0.82fr_1fr]`} aria-labelledby="launch-note-title">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-amber-100">Launch note</p>
            <h2 id="launch-note-title" className="mt-4 text-[clamp(2.2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-white">Sample-safe on purpose.</h2>
          </div>
          <p className="text-sm leading-7 text-white/68">
            The public demo is intentionally sample-safe. The full owner-bound memory system stays behind account, consent, provider, export/delete, privacy, and service gates.
          </p>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-5 sm:p-8`} aria-labelledby="proof-title">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Want the proof?</p>
            <h2 id="proof-title" className="mt-4 text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.065em] text-white">Claims stay tied to evidence.</h2>
            <p className="mt-4 text-sm leading-6 text-white/62">Status shows public posture. System shows canonical release truth. Neither page invents readiness.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {proofLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-[1.5rem] border border-white/10 bg-white/[0.052] p-5 transition hover:-translate-y-0.5 hover:border-cyan-200/34 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                <h3 className="text-2xl font-semibold tracking-[-0.045em] text-white">{link.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{link.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <footer className={`${panel} mt-4 grid items-center gap-4 rounded-[2rem] p-5 text-sm text-white/62 sm:p-7 lg:grid-cols-[1fr_auto]`}>
          <p>URAI Genesis public demo walkthrough - sample-safe, consent-first, and evidence-gated.</p>
          <div className="flex flex-wrap gap-2">
            {footerLinks.map((link) => <Link key={link.href} href={link.href} className={quietLink}>{link.label}</Link>)}
          </div>
        </footer>
      </div>
    </main>
  );
}
