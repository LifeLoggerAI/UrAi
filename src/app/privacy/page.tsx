import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Field | URAI",
  description:
    "URAI Genesis privacy boundaries for the public demo: Passport consent, sample-safe Life Map previews, gated sources, and evidence-linked launch truth.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Field | URAI",
    description:
      "Consent, ownership, and safety boundaries for the URAI Genesis public demo.",
    url: "/privacy",
    images: [
      {
        url: "/og/urai-public-demo.svg",
        width: 1200,
        height: 630,
        alt: "URAI Privacy Field",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Field | URAI",
    description:
      "Consent, ownership, and safety boundaries for the URAI Genesis public demo.",
    images: ["/og/urai-public-demo.svg"],
  },
};

const navLinks = [
  { href: "/home", label: "Home" },
  { href: "/passport", label: "Passport" },
  { href: "/status", label: "Status" },
  { href: "/system", label: "System" },
  { href: "/support", label: "Support" },
  { href: "/waitlist", label: "Waitlist" },
];

const principles = [
  {
    title: "Private by default",
    body: "The public demo uses sample-safe surfaces. Private accounts, external sources, and sensitive layers stay gated until consent, export, delete, retention, and evidence checks are complete.",
  },
  {
    title: "User-controlled memory",
    body: "Memory-like surfaces should become hideable, correctable, exportable, and removable before private-account use expands beyond preview.",
  },
  {
    title: "Consent-gated sources",
    body: "Provider, browser, device, health, location, microphone, camera, and other passive sources are not live in the public demo and require explicit permission before any future connection.",
  },
  {
    title: "Reflective, not diagnostic",
    body: "URAI can frame symbolic patterns and emotional weather. It does not diagnose, treat, determine truth, or replace real care.",
  },
  {
    title: "Public demo is sample-safe",
    body: "Genesis preview screens are designed to show the product shape without collecting or exposing private life data.",
  },
];

const boundaryNodes = [
  {
    title: "Life Map",
    state: "Preview open",
    body: "The public Life Map is a Genesis preview built from sample-safe visuals and launch copy. It must not be read as a live map of a visitor's private memories.",
  },
  {
    title: "Passport",
    state: "Consent center",
    body: "Passport is where boundaries become controls. Current launch surfaces explain the model; deeper private-account controls remain gated until verified.",
  },
  {
    title: "Private Memories",
    state: "Closed",
    body: "Private memory ingestion and generated personal outputs remain closed unless an authenticated owner grants consent and production evidence exists.",
  },
  {
    title: "Passive Sources",
    state: "Not live",
    body: "Silent tracking is not live. Audio, location, health, motion, camera, provider, and device sources require separate opt-in paths before any future use.",
  },
  {
    title: "Provider Connections",
    state: "Gated",
    body: "External accounts and model providers require explicit configuration, consent, and evidence. Public demo screens do not open provider access.",
  },
  {
    title: "Export and Delete",
    state: "Required gate",
    body: "Private-account expansion depends on export, delete, revoke, and retention behavior being wired, tested, and documented.",
  },
  {
    title: "Support",
    state: "Public help",
    body: "Support is available for questions about the demo, boundaries, and access requests. It is not an emergency service.",
  },
  {
    title: "System Evidence",
    state: "Truth layer",
    body: "Status and System pages separate what is live, preview, gated, blocked, or roadmap so public claims stay tied to evidence.",
  },
];

const requiredControls = [
  { title: "Hide a memory star", state: "Required" },
  { title: "Mark an insight inaccurate", state: "Required" },
  { title: "Disable similar signal types", state: "Required" },
  { title: "Export your account data", state: "Gated" },
  { title: "Delete source signals", state: "Gated" },
  { title: "Consent history and audit log", state: "Required" },
  { title: "Retention controls", state: "Required" },
  { title: "Provider disconnect", state: "Gated" },
];

const does = [
  "Show symbolic patterns with preview labels.",
  "Keep the public demo sample-safe.",
  "Point sensitive layers toward Passport boundaries.",
  "Label preview, gated, fallback, and roadmap systems.",
  "Tie public claims to Status and System evidence.",
];

const doesNot = [
  "Diagnose, treat, or replace medical, legal, clinical, or emergency support.",
  "Determine truth about a person or relationship.",
  "Silently collect passive signals in the public demo.",
  "Open provider, account, device, health, location, camera, microphone, or contact sources without explicit consent.",
  "Sell user data or publish raw private data from the Genesis preview.",
];

const privacyJourney = [
  "Start in the public demo",
  "Review this Privacy Field",
  "Open Passport boundaries",
  "Choose layers only when controls exist",
  "Check Status and System evidence",
  "Request access or continue home",
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#02040b] text-white">
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-[-14rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-[-18rem] left-[-8rem] h-[32rem] w-[32rem] rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute bottom-[-16rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-amber-200/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <nav className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.045] px-4 py-3 shadow-2xl shadow-black/25 backdrop-blur-xl">
          <Link href="/home" className="group inline-flex items-center gap-3" aria-label="URAI Home">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-100/10 text-sm font-semibold tracking-[0.22em] text-cyan-50 shadow-lg shadow-cyan-950/30">
              UR
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-[0.22em] text-white">URAI</span>
              <span className="block text-xs uppercase tracking-[0.24em] text-white/45">Privacy Field</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="min-h-10 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 transition hover:border-cyan-200/35 hover:bg-cyan-100/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <section className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.04fr_0.96fr] lg:py-20" aria-labelledby="privacy-title">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.42em] text-cyan-200/70">Privacy Field</p>
            <h1 id="privacy-title" className="mt-5 text-5xl font-semibold tracking-[-0.065em] text-white sm:text-7xl lg:text-8xl">
              Your map belongs to you.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
              URAI is designed to make patterns visible without making your private life public. The Life Map starts demo-safe, and sensitive layers stay closed until Passport consent and launch evidence gates are complete.
            </p>
            <p className="mt-5 max-w-2xl rounded-[1.5rem] border border-emerald-200/15 bg-emerald-200/[0.055] px-5 py-4 text-sm leading-6 text-emerald-50/80">
              No hidden passive sensing, provider access, or private memory collection occurs in the public demo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/passport" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-2xl shadow-white/15 transition hover:-translate-y-0.5">
                Open Passport
              </Link>
              <Link href="/system" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.045] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-200/40">
                Check System Truth
              </Link>
              <Link href="/status" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.035] px-6 py-3 text-sm font-semibold text-white/78 transition hover:-translate-y-0.5 hover:text-white">
                View Status
              </Link>
              <Link href="/support" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.035] px-6 py-3 text-sm font-semibold text-white/78 transition hover:-translate-y-0.5 hover:text-white">
                Contact Support
              </Link>
            </div>
          </div>

          <div className="relative min-h-[34rem] rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(125,211,252,0.18),transparent_36%),linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-5 overflow-hidden rounded-[2rem] border border-cyan-100/10 bg-black/30" aria-hidden="true">
              <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.24),transparent_9%),radial-gradient(circle_at_68%_30%,rgba(125,211,252,0.28),transparent_8%),radial-gradient(circle_at_78%_16%,rgba(167,243,208,0.22),transparent_7%)]" />
              <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/30 bg-cyan-100/10 shadow-[0_0_90px_rgba(103,232,249,0.34)]" />
              <div className="absolute left-[15%] top-[45%] h-px w-[72%] rotate-[-16deg] bg-gradient-to-r from-transparent via-cyan-100/35 to-transparent" />
              <div className="absolute left-[12%] top-[60%] h-px w-[76%] rotate-[13deg] bg-gradient-to-r from-transparent via-emerald-100/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.18),transparent_58%)]" />
            </div>
            <div className="relative flex h-full min-h-[30rem] flex-col justify-between rounded-[2rem] p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-cyan-100/20 bg-cyan-100/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-50">
                  Closed until chosen
                </span>
                <span className="rounded-full border border-emerald-100/20 bg-emerald-100/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-50">
                  Demo-safe
                </span>
              </div>
              <div className="mx-auto grid h-56 w-56 place-items-center rounded-full border border-white/15 bg-white/[0.06] shadow-[0_0_100px_rgba(125,211,252,0.24)]">
                <div className="grid h-36 w-36 place-items-center rounded-full border border-cyan-100/30 bg-cyan-100/10 text-center">
                  <span className="text-xs uppercase tracking-[0.35em] text-cyan-50/80">Passport</span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Life Map", "Consent", "Evidence"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm text-white/70">
                    <strong className="block text-white">{item}</strong>
                    <span>Boundary visible</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 rounded-[2rem] border border-white/10 bg-white/[0.045] p-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="URAI privacy principles">
          {principles.map((principle) => (
            <article key={principle.title} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <h2 className="text-base font-semibold text-white">{principle.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">{principle.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]" aria-labelledby="trust-map-title">
          <div className="rounded-[2rem] border border-cyan-100/10 bg-cyan-100/[0.035] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100/60">Consent Boundary Map</p>
            <h2 id="trust-map-title" className="mt-4 text-3xl font-semibold tracking-[-0.04em]">What opens, what stays closed.</h2>
            <p className="mt-4 text-sm leading-7 text-white/62">
              Each layer below is intentionally labeled. Preview means it is visible in Genesis. Gated means the real private-data path requires consent, tests, and launch evidence first.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {boundaryNodes.map((node) => (
              <details key={node.title} className="group rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 open:border-cyan-100/25 open:bg-cyan-100/[0.055]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <span>
                    <span className="block text-base font-semibold text-white">{node.title}</span>
                    <span className="mt-1 inline-flex rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/55">
                      {node.state}
                    </span>
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-white/70 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-6 text-white/63">{node.body}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-amber-100/12 bg-amber-100/[0.035] p-7" aria-labelledby="controls-title">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-100/60">Private-account release gates</p>
              <h2 id="controls-title" className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Controls required before private accounts open.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/62">
              These are launch requirements, not blanket live claims. A control moves from gated to live only when code, tests, and smoke evidence prove it.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {requiredControls.map((control) => (
              <article key={control.title} className="rounded-[1.35rem] border border-white/10 bg-black/30 p-5">
                <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/55">{control.state}</span>
                <h3 className="mt-4 text-base font-semibold text-white">{control.title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2" aria-label="What URAI does and does not do">
          <article className="rounded-[2rem] border border-emerald-100/10 bg-emerald-100/[0.035] p-7">
            <h2 className="text-2xl font-semibold">What URAI does</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-white/66">
              {does.map((item) => (
                <li key={item} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-[2rem] border border-rose-100/10 bg-rose-100/[0.035] p-7">
            <h2 className="text-2xl font-semibold">What URAI does not do</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-white/66">
              {doesNot.map((item) => (
                <li key={item} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-6 grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 lg:grid-cols-[0.72fr_1.28fr]" aria-labelledby="journey-title">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/45">Privacy journey</p>
            <h2 id="journey-title" className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Move from preview to consent one step at a time.</h2>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {privacyJourney.map((step, index) => (
              <li key={step} className="rounded-[1.35rem] border border-white/10 bg-black/25 p-5">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/55">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-3 text-sm font-semibold leading-6 text-white">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <article className="rounded-[2rem] border border-cyan-100/12 bg-cyan-100/[0.04] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100/60">Passport</p>
            <h2 className="mt-4 text-2xl font-semibold">Passport is where boundaries become controls.</h2>
            <p className="mt-4 text-sm leading-7 text-white/62">
              Start there when you want to review what is open, closed, gated, or preview-only.
            </p>
            <Link href="/passport" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-black">
              Open Passport
            </Link>
          </article>
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/45">Evidence</p>
            <h2 className="mt-4 text-2xl font-semibold">Trust is tied to evidence.</h2>
            <p className="mt-4 text-sm leading-7 text-white/62">
              Status shows public launch posture. System shows the fuller registry and release truth.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/status" className="inline-flex min-h-11 items-center rounded-full border border-white/12 px-5 py-2 text-sm font-semibold text-white/78">Status</Link>
              <Link href="/system" className="inline-flex min-h-11 items-center rounded-full border border-white/12 px-5 py-2 text-sm font-semibold text-white/78">System</Link>
            </div>
          </article>
          <article className="rounded-[2rem] border border-emerald-100/12 bg-emerald-100/[0.035] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-100/60">Support</p>
            <h2 className="mt-4 text-2xl font-semibold">Questions about privacy?</h2>
            <p className="mt-4 text-sm leading-7 text-white/62">
              Use Support for public demo questions, privacy boundaries, access requests, and reporting a trust issue.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/support" className="inline-flex min-h-11 items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-black">Contact Support</Link>
              <a href="mailto:privacy@urai.app" className="inline-flex min-h-11 items-center rounded-full border border-white/12 px-5 py-2 text-sm font-semibold text-white/78">
                privacy@urai.app
              </a>
            </div>
          </article>
        </section>

        <section className="my-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-7 text-sm leading-7 text-white/66">
          <h2 className="text-2xl font-semibold text-white">Safety note</h2>
          <p className="mt-4">
            URAI insights are reflective AI patterns. They are not medical, legal, clinical, emergency, or truth determinations. When a signal looks sensitive, the interface should slow down, summarize gently, and point users toward real support.
          </p>
          <p className="mt-4">
            Public Genesis pages demonstrate the shape of URAI. Private-data systems remain gated until the release evidence says otherwise.
          </p>
        </section>
      </div>
    </main>
  );
}
