import type { Metadata } from "next";
import Link from "next/link";
import SupportReportPanel from "@/components/support/SupportReportPanel";

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@urai.app";

export const metadata: Metadata = {
  title: "URAI Support Center",
  description: "Launch-safe URAI support, status, privacy boundaries, and public demo issue reporting.",
  alternates: { canonical: "/support" },
  openGraph: {
    title: "URAI Support Center",
    description: "Help, status, and trust boundaries for the URAI Genesis public demo.",
    url: "/support",
    images: [{ url: "/og/urai-public-demo.svg", width: 1200, height: 630, alt: "URAI Support Center" }],
  },
};

const navLink = "inline-flex min-h-11 items-center rounded-full border border-white/10 bg-white/[0.055] px-4 text-sm font-bold text-white/72 transition hover:border-cyan-200/36 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200";
const panel = "border border-white/10 bg-slate-950/62 shadow-2xl shadow-black/35 backdrop-blur-2xl";

const actions = [
  ["Report a bug", "#report", "Use the support report panel without sending secrets or private memories.", "Issue report"],
  ["Check system status", "/status", "See the lightweight public launch posture before filing a report.", "Status"],
  ["Review Privacy Field", "/privacy", "Check consent and data-boundary language for private systems.", "Privacy"],
  ["Open system registry", "/system", "Inspect canonical release truth, blockers, and evidence gaps.", "Registry"],
  ["Contact support", `mailto:${supportEmail}`, "Email the configured support contact for public demo issues.", "Email"],
  ["Return to demo", "/home", "Go back to the safe Genesis public demo path.", "Demo"],
] as const;

const beforeReporting = [
  ["Public status", "/status", "Check whether the issue is already reflected in the public posture."],
  ["System registry", "/system", "Use the registry for deeper release truth, blockers, and evidence status."],
  ["Privacy Field", "/privacy", "Review privacy, consent, export, delete, and data ownership boundaries."],
] as const;

const faqs = [
  ["Why is login gated?", "Private login opens only after privacy, security, rollback, monitoring, and release evidence gates pass."],
  ["What does the public demo use?", "The public demo uses sample or safe preview states. It does not unlock private account systems by itself."],
  ["Does support access private data here?", "No. Public demo support does not access private life data, private memories, passive signals, or provider outputs."],
  ["Where do I control permissions?", "Passport is the control surface for what opens, closes, exports, or remains protected."],
  ["What if a page looks broken?", "Report the route, what happened, browser or device context, and whether you saw an error. Do not send secrets."],
  ["How do I join early access?", "Join the waitlist to request access. Joining does not enable private sensing, provider access, or private account systems."],
  ["What is preview vs production?", "Preview means the shape is visible but not fully proven live. Production claims require code, tests, deploy evidence, smoke proof, privacy gates, and rollback/monitoring readiness."],
] as const;

const boundaries = [
  "URAI support can help with product feedback and public demo issues.",
  "URAI support is not emergency support, medical advice, therapy, crisis response, diagnosis, or legal advice.",
  "Do not send passwords, private keys, API tokens, medical details, or sensitive private memories.",
  "Account recovery and private-data operations stay gated until the authenticated product systems are proven and documented.",
] as const;

export default function SupportPage() {
  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_18%_6%,rgba(45,212,191,0.2),transparent_32rem),radial-gradient(circle_at_88%_12%,rgba(125,211,252,0.16),transparent_30rem),linear-gradient(145deg,#020617_0%,#06111f_48%,#02030a_100%)] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] [background-size:82px_82px]" />
        <div className="absolute left-1/2 top-[20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full border border-cyan-100/10 shadow-[0_0_120px_rgba(45,212,191,0.12)]" />
        <div className="absolute inset-x-[-14%] bottom-[-18rem] h-[36rem] rounded-[50%] border-t border-cyan-100/12 bg-[radial-gradient(ellipse_at_50%_0%,rgba(20,184,166,0.16),transparent_58%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/82" />
      </div>

      <div className="relative z-10 mx-auto w-[min(1280px,100%)] pb-28">
        <nav className={`${panel} flex flex-wrap items-center justify-between gap-3 rounded-full px-4 py-3`} aria-label="Support navigation">
          <Link href="/home" className="inline-flex min-h-11 items-center gap-3 rounded-full font-extrabold tracking-[0.16em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
            <span className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_28px_rgba(103,232,249,0.86)]" aria-hidden="true" />
            URAI
          </Link>
          <div className="flex flex-wrap justify-end gap-2">
            <Link href="/launch" className={navLink}>Launch</Link>
            <Link href="/home" className={navLink}>Home</Link>
            <Link href="/life-map" className={navLink}>Life Map</Link>
            <Link href="/passport" className={navLink}>Passport</Link>
            <Link href="/status" className={navLink}>Status</Link>
            <Link href="/system" className={navLink}>System</Link>
            <Link href="/waitlist" className={navLink}>Waitlist</Link>
          </div>
        </nav>

        <header className={`${panel} relative mt-4 grid overflow-hidden rounded-[2.75rem] p-5 sm:p-8 lg:grid-cols-[1fr_0.72fr] lg:p-10`} aria-labelledby="support-title">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(255,255,255,0.08),transparent_14rem),radial-gradient(circle_at_80%_42%,rgba(45,212,191,0.1),transparent_20rem),linear-gradient(120deg,rgba(14,165,233,0.1),transparent_52%)]" />
          <section className="relative z-10">
            <p className="inline-flex rounded-full border border-cyan-100/25 bg-cyan-100/10 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-cyan-100">URAI Support</p>
            <h1 id="support-title" className="mt-6 max-w-4xl text-[clamp(3.35rem,7vw,6.6rem)] font-semibold leading-[0.86] tracking-[-0.075em] text-white">Help, status, and trust in one place.</h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white/70 md:text-lg">
              Use this center to report issues, check launch status, review privacy boundaries, and find the safest next step. Public demo support is limited and private systems remain gated until release evidence is complete.
            </p>
            <p className="mt-5 max-w-3xl rounded-2xl border border-cyan-100/16 bg-cyan-100/[0.065] px-4 py-3 text-sm leading-6 text-cyan-50/76">
              URAI support does not access private life data from the public demo.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#report" className="inline-flex min-h-12 items-center rounded-full border border-cyan-100/40 bg-gradient-to-br from-cyan-100 via-teal-200 to-emerald-200 px-6 text-sm font-black text-slate-950 shadow-[0_20px_54px_rgba(45,212,191,0.24)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Report a bug</a>
              <Link href="/status" className="inline-flex min-h-12 items-center rounded-full border border-white/12 bg-white/[0.075] px-6 text-sm font-bold text-white/82 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Check status</Link>
              <Link href="/home" className="inline-flex min-h-12 items-center rounded-full border border-white/12 bg-white/[0.075] px-6 text-sm font-bold text-white/82 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Return to demo</Link>
            </div>
          </section>
          <aside className="relative z-10 mt-8 min-h-[330px] overflow-hidden rounded-[2rem] border border-cyan-100/15 bg-[radial-gradient(circle_at_50%_24%,rgba(125,211,252,0.2),transparent_12rem),linear-gradient(180deg,rgba(15,23,42,0.38),rgba(2,6,23,0.9))] p-5 lg:mt-0" aria-label="Support trust preview">
            <div aria-hidden="true" className="absolute left-1/2 top-[34%] h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/14 shadow-[0_0_80px_rgba(45,212,191,0.14)]" />
            <div aria-hidden="true" className="absolute left-1/2 top-[34%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff_0_8%,#67e8f9_22%,rgba(45,212,191,0.2)_62%,transparent_74%)] drop-shadow-[0_0_46px_rgba(103,232,249,0.62)]" />
            <div className="absolute inset-x-[12%] top-[20%] h-px rotate-[-12deg] bg-gradient-to-r from-transparent via-cyan-100/32 to-transparent" />
            <div className="absolute inset-x-[18%] top-[44%] h-px rotate-[18deg] bg-gradient-to-r from-transparent via-teal-100/24 to-transparent" />
            <div className="relative mt-56 rounded-[1.5rem] border border-white/12 bg-slate-950/72 p-5 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-200">Support posture</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">Product help, not private-data access.</h2>
              <p className="mt-3 text-sm leading-6 text-white/62">Status, Passport, and System pages show what is live, preview, gated, or blocked before any claim expands.</p>
            </div>
          </aside>
        </header>

        <section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3" aria-label="Primary support actions">
          {actions.map(([title, href, body, badge]) => {
            const isMail = href.startsWith("mailto:");
            const className = `${panel} group min-h-[210px] rounded-[1.75rem] p-5 transition hover:-translate-y-0.5 hover:border-cyan-200/36`;
            const content = <><span className="inline-flex rounded-full border border-cyan-200/24 bg-cyan-200/[0.08] px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.12em] text-cyan-50">{badge}</span><h2 className="mt-5 text-2xl font-semibold tracking-[-0.045em] text-white">{title}</h2><p className="mt-3 text-sm leading-6 text-white/62">{body}</p><span className="mt-5 inline-flex text-sm font-black text-cyan-100 group-hover:text-white">Open</span></>;
            return isMail ? <a key={title} href={href} className={className}>{content}</a> : <Link key={title} href={href} className={className}>{content}</Link>;
          })}
        </section>

        <section id="before-reporting" className={`${panel} mt-4 rounded-[2.25rem] p-5 sm:p-8`} aria-labelledby="before-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Before reporting</p>
            <h2 id="before-title" className="mt-4 text-[clamp(2.1rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-white">Check the truth surfaces first.</h2>
            <p className="mt-4 text-sm leading-6 text-white/62">Support is strongest when reports point to a route, visible symptom, and current launch posture.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {beforeReporting.map(([title, href, body]) => <Link key={title} href={href} className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 transition hover:-translate-y-0.5 hover:border-cyan-200/36 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"><h3 className="text-xl font-semibold tracking-[-0.04em] text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-white/62">{body}</p></Link>)}
          </div>
        </section>

        <SupportReportPanel supportEmail={supportEmail} />

        <section className={`${panel} mt-4 grid gap-5 rounded-[2.25rem] p-5 sm:p-8 lg:grid-cols-[0.8fr_1fr]`} aria-labelledby="contact-title">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Contact</p>
            <h2 id="contact-title" className="mt-4 text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-none tracking-[-0.06em] text-white">Use the configured support contact.</h2>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5">
            <p className="text-sm leading-6 text-white/66">For time-sensitive launch/demo issues, email the configured support contact. Do not send passwords, private keys, API tokens, or sensitive private memories.</p>
            <a href={`mailto:${supportEmail}`} className="mt-5 inline-flex min-h-12 items-center rounded-full border border-cyan-200/30 bg-cyan-200/[0.08] px-5 text-sm font-black text-cyan-50 transition hover:border-cyan-100/55 hover:bg-cyan-200/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">{supportEmail}</a>
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] p-5 sm:p-8`} aria-labelledby="faq-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Help topics</p>
            <h2 id="faq-title" className="mt-4 text-[clamp(2.1rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-white">Common Genesis support questions.</h2>
          </div>
          <div className="mt-7 grid gap-3">
            {faqs.map(([question, answer]) => <details key={question} className="group rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-5"><summary className="cursor-pointer list-none text-lg font-semibold tracking-[-0.035em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">{question}<span className="float-right ml-4 text-cyan-200 group-open:rotate-45">+</span></summary><p className="mt-4 text-sm leading-6 text-white/62">{answer}</p></details>)}
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] border-amber-200/18 bg-amber-200/[0.055] p-5 sm:p-8`} aria-labelledby="boundary-title">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-amber-200">Support boundaries</p>
          <h2 id="boundary-title" className="mt-4 text-[clamp(2.1rem,4vw,3.4rem)] font-semibold leading-none tracking-[-0.06em] text-white">What support is not.</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {boundaries.map((item) => <p key={item} className="rounded-[1.25rem] border border-amber-100/12 bg-black/24 p-4 text-sm leading-6 text-amber-50/78">{item}</p>)}
          </div>
        </section>
      </div>
    </main>
  );
}
