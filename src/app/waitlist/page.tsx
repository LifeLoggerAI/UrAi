import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata = {
  title: "Join the URAI waitlist | Genesis Early Access",
  description:
    "Join the URAI Genesis waitlist. Public demo access stays sample-safe while private Life Map, Orb, Passport, Ground, Sky, Horizon, and Replay layers open only after evidence gates pass.",
  openGraph: {
    title: "Join the URAI waitlist | Genesis Early Access",
    description:
      "A cinematic, privacy-forward early-access gate for URAI Genesis. Waitlist signup does not enable private sensing or personal data collection.",
    images: ["/og/urai-genesis-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the URAI waitlist | Genesis Early Access",
    description:
      "Request early access to URAI Genesis updates while private systems remain gated behind consent, security, rollback, monitoring, and launch evidence.",
    images: ["/og/urai-genesis-preview.png"],
  },
};

const navItems = [
  { href: "/launch", label: "Launch" },
  { href: "/demo", label: "Demo" },
  { href: "/passport", label: "Passport" },
  { href: "/status", label: "Status" },
] as const;

const accessPath = [
  { label: "Public Demo", status: "Available", href: "/demo", detail: "Sample-safe Genesis path." },
  { label: "Life Map", status: "Preview", href: "/life-map", detail: "Symbolic sample memory world." },
  { label: "Orb", status: "Preview", href: "/orb", detail: "Living interface bridge." },
  { label: "Passport", status: "Consent-first", href: "/passport", detail: "Boundaries before access." },
  { label: "Ground", status: "Preview", href: "/ground", detail: "Foundation and council layer." },
  { label: "Sky", status: "Preview", href: "/sky", detail: "Dream and reflection field." },
  { label: "Horizon", status: "Future", href: "/horizon", detail: "Generated paths remain gated." },
  { label: "Replay", status: "Preview", href: "/replay", detail: "Cinematic sample path." },
  { label: "Private Beta", status: "Gated", href: "/login", detail: "Opens only after evidence gates." },
] as const;

const trustCards = [
  {
    title: "Public demo remains safe",
    body: "Sample and preview states show the shape of URAI without private data, provider access, or hidden collection.",
  },
  {
    title: "Private access is gated",
    body: "Accounts open only after privacy, security, rollback, monitoring, and launch evidence checks are complete.",
  },
  {
    title: "Passport controls boundaries",
    body: "Sensitive layers open through user consent, deletion, export, revocation, and clear ownership controls.",
  },
  {
    title: "No hidden collection",
    body: "Waitlist signup does not enable passive sensing, generated media, autonomous jobs, or marketplace flows.",
  },
] as const;

const actions = [
  { href: "/demo", label: "Explore Public Demo", tone: "primary" },
  { href: "/life-map", label: "Open Life Map", tone: "secondary" },
  { href: "/passport", label: "Review Passport", tone: "secondary" },
  { href: "/status", label: "Check System Status", tone: "secondary" },
  { href: "/launch", label: "Return to Launch", tone: "secondary" },
] as const;

const navLink =
  "inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 text-sm font-bold text-white/72 transition hover:border-cyan-200/40 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200";

const panel = "border border-white/10 bg-slate-950/58 shadow-2xl shadow-black/35 backdrop-blur-2xl";

export default function WaitlistPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_18%_8%,rgba(56,189,248,0.22),transparent_30rem),radial-gradient(circle_at_82%_16%,rgba(45,212,191,0.16),transparent_30rem),radial-gradient(circle_at_50%_78%,rgba(245,158,11,0.1),transparent_34rem),linear-gradient(145deg,#020617_0%,#08111f_46%,#02030a_100%)] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.75)_0_1px,transparent_2px),radial-gradient(circle_at_26%_46%,rgba(125,211,252,0.52)_0_1px,transparent_2px),radial-gradient(circle_at_58%_24%,rgba(153,246,228,0.52)_0_1px,transparent_2px),radial-gradient(circle_at_74%_60%,rgba(224,242,254,0.48)_0_1px,transparent_2px),radial-gradient(circle_at_91%_32%,rgba(186,230,253,0.6)_0_1px,transparent_2px)]" />
        <div className="absolute left-1/2 top-[42%] h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/10 shadow-[0_0_130px_rgba(45,212,191,0.16)]" />
        <div className="absolute inset-x-[-10%] top-[44%] h-40 rounded-[50%] border-t border-cyan-100/18 bg-[radial-gradient(ellipse_at_50%_0%,rgba(125,211,252,0.16),transparent_60%)]" />
        <div className="absolute inset-x-[-18%] bottom-[-14rem] h-[34rem] rounded-[50%] border-t border-emerald-100/14 bg-[radial-gradient(ellipse_at_50%_0%,rgba(20,184,166,0.18),transparent_58%),linear-gradient(180deg,rgba(6,78,59,0.04),rgba(0,0,0,0.86))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/84" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2.5rem)] w-[min(1240px,100%)] flex-col pb-14">
        <nav className={`${panel} flex items-center justify-between gap-4 rounded-full px-4 py-3`} aria-label="Waitlist navigation">
          <Link href="/home" className="inline-flex min-h-11 items-center gap-3 rounded-full font-extrabold tracking-[0.16em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200" aria-label="URAI Genesis home">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan-100/25 bg-cyan-100/10 text-xs shadow-[0_0_28px_rgba(103,232,249,0.35)]">U</span>
            <span className="hidden sm:inline">URAI</span>
          </Link>
          <div className="flex flex-wrap justify-end gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={navLink}>{item.label}</Link>
            ))}
          </div>
        </nav>

        <section className={`${panel} relative mt-4 grid flex-1 items-center gap-8 overflow-hidden rounded-[2.75rem] p-5 sm:p-8 lg:grid-cols-[1.02fr_0.88fr] lg:p-10 xl:p-12`} aria-labelledby="waitlist-title">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_26%_16%,rgba(255,255,255,0.08),transparent_14rem),radial-gradient(circle_at_74%_42%,rgba(45,212,191,0.1),transparent_20rem),linear-gradient(120deg,rgba(14,165,233,0.11),transparent_48%)]" />

          <div className="relative z-10 max-w-3xl">
            <p className="inline-flex rounded-full border border-cyan-100/25 bg-cyan-100/10 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-cyan-100">
              Early Access
            </p>
            <h1 id="waitlist-title" className="mt-6 text-[clamp(3.7rem,8vw,7rem)] font-semibold leading-[0.86] tracking-[-0.075em] text-white">
              Join the URAI waitlist.
            </h1>
            <p className="mt-6 max-w-2xl text-[clamp(1.14rem,2.4vw,1.65rem)] leading-[1.18] tracking-[-0.04em] text-cyan-50/86">
              Be first in line as the private Life Map, Orb, Passport, Ground, Sky, and Horizon layers open safely.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
              The public demo stays sample-safe. Private access opens only after consent, privacy, security, rollback, monitoring, and launch evidence gates pass.
            </p>
            <p className="mt-5 max-w-2xl rounded-2xl border border-amber-200/18 bg-amber-200/[0.07] px-4 py-3 text-sm leading-6 text-amber-50/82">
              Joining does not enable private sensing, provider access, personal data collection, generated media, autonomous jobs, or marketplace behavior.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" aria-label="Waitlist alternate actions">
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={action.tone === "primary"
                    ? "inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-100/50 bg-gradient-to-br from-cyan-100 via-teal-200 to-emerald-200 px-6 text-sm font-black text-slate-950 shadow-[0_20px_54px_rgba(45,212,191,0.25)] transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                    : "inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.075] px-5 text-sm font-bold text-white/82 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/12 hover:text-white active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          <aside className="relative z-10" aria-label="URAI early access request form">
            <div aria-hidden="true" className="absolute inset-[-1.5rem] rounded-[2.8rem] bg-[radial-gradient(circle_at_50%_40%,rgba(103,232,249,0.22),transparent_17rem)] blur-2xl" />
            <WaitlistForm source="waitlist-page" handle="adamclamp" />
          </aside>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-5 sm:p-8`} aria-labelledby="access-path-title">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Access path</p>
              <h2 id="access-path-title" className="mt-4 text-[clamp(2.2rem,4vw,3.7rem)] font-semibold leading-none tracking-[-0.06em]">
                What opens over time.
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-white/58">
              Route links are real. Status labels are intentionally conservative: preview, consent-first, gated, or future until proof exists.
            </p>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {accessPath.map((item, index) => (
              <Link key={item.label} href={item.href} className="group min-h-[154px] rounded-[1.45rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(45,212,191,0.1),transparent_13rem)] bg-white/[0.05] p-4 transition hover:-translate-y-0.5 hover:border-cyan-200/34 hover:bg-white/[0.075] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                <span className="text-xs font-black tracking-[0.18em] text-cyan-100/46">{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-3 block text-xl tracking-[-0.045em] text-white">{item.label}</strong>
                <span className="mt-3 inline-flex rounded-full border border-cyan-100/18 px-2.5 py-1 text-[0.64rem] font-black uppercase tracking-[0.11em] text-cyan-100/80">{item.status}</span>
                <span className="mt-3 block text-sm leading-5 text-white/58">{item.detail}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 grid gap-6 rounded-[2.25rem] p-5 sm:p-8 lg:grid-cols-[0.76fr_1fr]`} aria-labelledby="joining-means-title">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">What joining means</p>
            <h2 id="joining-means-title" className="mt-4 text-[clamp(2.1rem,4vw,3.45rem)] font-semibold leading-none tracking-[-0.06em]">
              A careful gate for an intimate product.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/64">
              URAI is opening carefully because the product is intimate. Early users help shape how Life Map, Orb, Passport, Replay, Ground, Sky, and Horizon become safe enough for real private use.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustCards.map((card) => (
              <article key={card.title} className="rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(125,211,252,0.1),transparent_12rem)] bg-white/[0.055] p-5">
                <h3 className="text-xl font-semibold tracking-[-0.04em] text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/64">{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className={`${panel} mt-4 grid items-center gap-4 rounded-[2rem] p-5 text-sm text-white/62 sm:p-7 lg:grid-cols-[1fr_auto]`}>
          <p>URAI Genesis waitlist - access request only, not a private-system unlock.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/privacy" className={navLink}>Privacy</Link>
            <Link href="/terms" className={navLink}>Terms</Link>
            <Link href="/support" className={navLink}>Support</Link>
            <a href="mailto:support@urai.app" className={navLink}>Email support</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
