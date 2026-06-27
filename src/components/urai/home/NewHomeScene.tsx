"use client";

import Link from "next/link";

const navItems = [
  { href: "/home", label: "Home" },
  { href: "/life-map", label: "Life Map" },
  { href: "/focus", label: "Focus" },
  { href: "/replay", label: "Replay" },
  { href: "/passport", label: "Passport" },
  { href: "/ground", label: "Ground" },
  { href: "/orb-chat", label: "Orb" },
  { href: "/sky", label: "Sky" },
  { href: "/horizon", label: "Horizon" },
] as const;

const launchActions = [
  { href: "/life-map", label: "Open Life Map", note: "Symbolic memory map" },
  { href: "/replay", label: "Open Replay", note: "Cinematic preview" },
  { href: "/passport", label: "Open Passport", note: "Privacy boundary" },
  { href: "/ground", label: "Touch Ground", note: "Calm return" },
  { href: "/orb-chat", label: "Meet Orb", note: "Companion preview" },
  { href: "/focus", label: "Enter Focus", note: "Reflection chamber" },
  { href: "/horizon", label: "See Horizon", note: "Future path preview" },
  { href: "/status", label: "View system status", note: "Launch truth" },
] as const;

const promiseCards = [
  {
    title: "Public demo first",
    body: "This Home field is a launch-safe doorway. It uses symbolic demo surfaces and does not open private data, passive sensing, or production-only systems.",
  },
  {
    title: "One coherent path",
    body: "Home, Life Map, Focus, Replay, Ground, Orb, Passport, Sky, and Horizon now share the same calm visual language and return paths.",
  },
  {
    title: "No fake memories",
    body: "Sample memories are clearly framed as public-safe previews until owner-scoped proof, consent, and private-account launch gates pass.",
  },
] as const;

const starDots = Array.from({ length: 52 }, (_, index) => ({
  left: (index * 37 + 11) % 100,
  top: (index * 19 + 7) % 100,
  size: 1 + (index % 5) * 0.55,
  opacity: 0.2 + (index % 7) * 0.07,
}));

function PillLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 text-[0.64rem] font-black uppercase tracking-[0.2em] text-cyan-50/78 backdrop-blur-xl transition hover:border-cyan-100/35 hover:bg-cyan-100/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100"
    >
      {label}
    </Link>
  );
}

export function NewHomeScene() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02050c] text-white selection:bg-cyan-100/25">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(125,211,252,0.20),transparent_26%),radial-gradient(circle_at_22%_68%,rgba(45,212,191,0.16),transparent_30%),radial-gradient(circle_at_82%_42%,rgba(168,85,247,0.16),transparent_32%),linear-gradient(180deg,#02050c_0%,#071525_46%,#04120f_74%,#010203_100%)]" />
      <div className="pointer-events-none absolute inset-x-[-18%] bottom-[-26%] h-[48%] rounded-[50%] border border-emerald-100/8 bg-[radial-gradient(ellipse_at_center,rgba(110,231,183,0.16),rgba(8,47,73,0.28)_42%,rgba(2,6,23,0.95)_78%)] blur-sm" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-b from-transparent via-[#02050c]/35 to-[#010203]" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {starDots.map((dot, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-cyan-50 shadow-[0_0_18px_rgba(186,230,253,0.48)]"
            style={{ left: `${dot.left}%`, top: `${dot.top}%`, width: dot.size, height: dot.size, opacity: dot.opacity }}
          />
        ))}
        <span className="absolute left-[6%] top-[28%] h-px w-[42%] rotate-12 bg-gradient-to-r from-transparent via-cyan-100/25 to-transparent" />
        <span className="absolute right-[8%] top-[46%] h-px w-[38%] -rotate-12 bg-gradient-to-r from-transparent via-violet-100/22 to-transparent" />
        <span className="absolute left-[30%] top-[61%] h-px w-[36%] rotate-[22deg] bg-gradient-to-r from-transparent via-emerald-100/18 to-transparent" />
      </div>

      <header className="relative z-30 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
        <Link href="/" className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-100/20 bg-cyan-100/8 shadow-[0_0_40px_rgba(125,211,252,0.18)] backdrop-blur-xl">
            <span className="h-4 w-4 rounded-full bg-cyan-100 shadow-[0_0_22px_rgba(186,230,253,0.85)]" />
          </span>
          <span>
            <span className="block text-[0.62rem] font-black uppercase tracking-[0.52em] text-cyan-100/68">URAI</span>
            <span className="block text-xs text-white/45">Genesis home</span>
          </span>
        </Link>
        <nav className="flex max-w-3xl flex-wrap justify-end gap-2" aria-label="Genesis navigation">
          {navItems.map((item) => (
            <PillLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
      </header>

      <section className="relative z-20 mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-7xl items-center gap-10 px-5 pb-10 pt-4 md:grid-cols-[1.02fr_0.98fr] md:px-8 lg:gap-16">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-cyan-100/20 bg-cyan-100/8 px-4 py-2 text-[0.64rem] font-black uppercase tracking-[0.32em] text-cyan-100/75 backdrop-blur-xl">
            Genesis home preview
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.88] tracking-[-0.07em] text-white sm:text-6xl lg:text-7xl">
            The home field opens before anything private does.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            URAI Home is the calm launch doorway: a cinematic public demo that points to Life Map, Focus, Replay, Ground, Orb, Sky, and Horizon without claiming private data systems are live.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/life-map" className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-[0_18px_60px_rgba(125,211,252,0.22)] transition hover:-translate-y-0.5 hover:bg-cyan-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Open Life Map
            </Link>
            <Link href="/replay" className="rounded-full border border-white/15 bg-white/7 px-5 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100">
              Open Replay
            </Link>
            <Link href="/passport" className="rounded-full border border-cyan-100/20 bg-cyan-100/8 px-5 py-3 text-sm font-bold text-cyan-50 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-cyan-100/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100">
              Open Passport
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <Link href="/life-map" aria-label="Open the URAI Life Map demo" className="group block rounded-[2.65rem] border border-cyan-100/18 bg-slate-950/38 p-4 shadow-[0_28px_120px_rgba(8,47,73,0.35)] backdrop-blur-2xl transition hover:-translate-y-1 hover:border-cyan-100/42 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 md:p-5">
            <div className="relative min-h-[31rem] overflow-hidden rounded-[2.15rem] border border-white/10 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.15),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.36),rgba(8,47,73,0.20)_44%,rgba(5,46,22,0.24)_74%,rgba(2,6,23,0.92))]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(125,211,252,0.20),transparent_26%),radial-gradient(circle_at_35%_78%,rgba(74,222,128,0.13),transparent_30%)]" />
              <div className="absolute left-1/2 top-[40%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/10" />
              <div className="absolute left-1/2 top-[40%] h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
              <div className="absolute left-1/2 top-[42%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_34%_26%,#fff,rgba(186,230,253,0.92)_18%,rgba(14,116,144,0.72)_48%,rgba(2,6,23,0.92)_78%)] shadow-[0_0_110px_rgba(125,211,252,0.45)]">
                <span className="absolute -inset-10 rounded-full border border-cyan-100/10" />
                <span className="absolute inset-5 rounded-full border border-white/15" />
              </div>
              <div className="absolute inset-x-[-12%] bottom-[-13%] h-[34%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(110,231,183,0.24),rgba(8,47,73,0.52)_52%,rgba(2,6,23,1)_82%)]" />
              <div className="absolute left-6 top-6 rounded-full border border-cyan-100/15 bg-black/35 px-4 py-2 text-[0.64rem] font-black uppercase tracking-[0.24em] text-cyan-50/78 backdrop-blur-xl">
                Genesis visual
              </div>
              <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/10 bg-black/42 p-4 backdrop-blur-2xl">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.28em] text-cyan-100/56">Home Orb field</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">Public-safe memory weather</h2>
                <p className="mt-2 text-sm leading-6 text-white/64">Local CSS, sample stars, and route truth only. No generated private media and no passive sensing are claimed here.</p>
              </div>
            </div>
          </Link>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {promiseCards.map((card) => (
              <article key={card.title} className="rounded-3xl border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl">
                <h2 className="text-sm font-black text-white">{card.title}</h2>
                <p className="mt-2 text-xs leading-5 text-white/58">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto max-w-7xl px-5 pb-8 md:px-8">
        <div className="rounded-[2rem] border border-cyan-100/14 bg-cyan-100/[0.045] p-5 backdrop-blur-2xl">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.30em] text-cyan-100/62">Launch-safe paths</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Every primary action goes somewhere real.</h2>
            </div>
            <Link href="/privacy-controls" className="text-sm font-bold text-cyan-100 underline underline-offset-4 hover:text-white">Review privacy posture</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {launchActions.map((action) => (
              <Link key={action.href} href={action.href} className="rounded-2xl border border-white/10 bg-black/24 p-4 transition hover:border-cyan-100/35 hover:bg-cyan-100/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100">
                <span className="block text-sm font-black text-white">{action.label}</span>
                <span className="mt-1 block text-xs text-white/52">{action.note}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[1.6rem] border border-amber-100/18 bg-amber-100/[0.06] p-4 text-sm leading-6 text-amber-50/76">
          <strong className="text-amber-50">Launch safety:</strong> Home is a public demo route. Live sensing, health data, recovery inference, generated media, autonomous jobs, and private account access remain gated until proof exists.
        </div>
      </section>
    </main>
  );
}

export default NewHomeScene;
