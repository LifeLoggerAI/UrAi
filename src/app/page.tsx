import Link from "next/link";
import type { Metadata } from "next";

const title = "URAI Public Demo | Symbolic Life Map";
const description =
  "Explore URAI's public demo: a privacy-gated symbolic Life Map with sample data, real CTAs, and clearly labeled roadmap systems.";
const shareImage = "/og/urai-public-demo.svg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "URAI",
    title,
    description,
    images: [
      {
        url: shareImage,
        width: 1200,
        height: 630,
        alt: "URAI public demo preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [shareImage],
  },
};

const demoPromises = [
  {
    title: "Public demo first",
    body: "This surface shows the URAI direction without opening private data, passive sensing, provider integrations, or production-only systems.",
  },
  {
    title: "Your map stays yours",
    body: "Life Map language is reflective and symbolic. Consent, export, deletion, retention, and admin audit gates must pass before private data features go live.",
  },
  {
    title: "Roadmap is labeled",
    body: "Spatial, analytics, communications, jobs, generated assets, and story systems remain demo, staging, roadmap, or gated until evidence proves otherwise.",
  },
];

const launchLinks = [
  {
    href: "/home",
    label: "Enter demo",
    note: "Genesis home experience",
  },
  {
    href: "/life-map",
    label: "Open Life Map demo",
    note: "Symbolic demo surface",
  },
  {
    href: "/waitlist",
    label: "Join early access",
    note: "Real public CTA",
  },
  {
    href: "/system",
    label: "View system status",
    note: "Registry and production-lock truth",
  },
];

export default function RootPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-white">
      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12 sm:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(45,212,191,0.12),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0),rgba(3,7,18,0.95))]" />

        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-cyan-200/75">
            URAI public demo
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.055em] text-white sm:text-7xl">
            A quieter way to see your life take shape.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            URAI is a privacy-gated reflection product. The public demo
            introduces the Home field, Life Map, and trust posture without
            claiming unsafe systems are live.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/home"
            className="rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30"
          >
            Enter demo
          </Link>

          <Link
            href="/waitlist"
            className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.1]"
          >
            Join waitlist
          </Link>

          <Link
            href="/system"
            className="rounded-full border border-amber-200/25 bg-amber-200/[0.08] px-5 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-200/[0.12]"
          >
            Check launch truth
          </Link>
        </div>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {demoPromises.map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20"
            >
              <h2 className="text-base font-semibold text-white">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/64">
                {item.body}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-5 rounded-[2rem] border border-cyan-200/15 bg-cyan-200/[0.045] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100/70">
                Launch-safe paths
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                Every primary action goes somewhere real.
              </h2>
            </div>

            <Link
              href="/privacy"
              className="text-sm font-semibold text-cyan-100 underline underline-offset-4"
            >
              Review privacy posture
            </Link>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {launchLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/72 hover:border-cyan-200/30 hover:bg-cyan-200/[0.06]"
              >
                <span className="block font-semibold text-white">
                  {item.label}
                </span>
                <span className="mt-1 block text-white/52">{item.note}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-amber-200/20 bg-amber-200/[0.07] p-5 text-sm leading-6 text-amber-50/78">
          <h2 className="text-base font-semibold text-amber-50">
            Safety boundary
          </h2>
          <p className="mt-2">
            URAI does not claim production readiness from this page. Passive
            sensing, outbound communications, therapy-adjacent behavior,
            monetization, live provider integrations, and user-derived
            intelligence remain gated until privacy, evidence, monitoring,
            rollback, and launch checks pass.
          </p>
        </section>

        <footer className="mt-8 flex flex-wrap gap-4 text-sm text-white/50">
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
          <Link href="/system" className="hover:text-white">
            System status
          </Link>
        </footer>
      </section>
    </main>
  );
}