"use client";

import Link from "next/link";
import { HomeWorldCanvas } from "@/components/urai/home/HomeWorldCanvas";
import { HomeXREntryCard } from "@/components/xr/XRSessionFoundation";

const navItems = [
  { href: "/home", label: "Home" },
  { href: "/xr", label: "XR" },
  { href: "/ground", label: "Ground" },
  { href: "/life-map", label: "Life Map" },
  { href: "/focus", label: "Focus" },
  { href: "/replay", label: "Replay" },
  { href: "/mirror", label: "Mirror" },
  { href: "/passport", label: "Passport" },
  { href: "/privacy-controls", label: "Privacy" },
  { href: "/location-map", label: "Location" },
  { href: "/status", label: "Status" },
] as const;

const thresholdCards = [
  {
    title: "Ground below",
    body: "Reception, privacy, schedules, relationships, logistics, wellness, and real-life objects become a calm operating world.",
    href: "/ground",
  },
  {
    title: "Galaxy above",
    body: "Memory stars, patterns, focus chambers, and replay paths open above the horizon as a public-safe Life Map preview.",
    href: "/life-map",
  },
  {
    title: "Owner boundary",
    body: "Passport and Privacy Controls keep identity, consent, provenance, export, and deletion visible before deeper access expands.",
    href: "/passport",
  },
] as const;

const workforce = [
  "Receptionist",
  "Privacy Steward",
  "Schedule Steward",
  "Wellness Guide",
  "Relationship Liaison",
  "Logistics Helper",
] as const;

const starDots = Array.from({ length: 64 }, (_, index) => ({
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(125,211,252,0.24),transparent_28%),radial-gradient(circle_at_23%_72%,rgba(45,212,191,0.16),transparent_32%),radial-gradient(circle_at_82%_48%,rgba(251,191,36,0.13),transparent_34%),linear-gradient(180deg,#02050c_0%,#071525_40%,#06140f_76%,#010203_100%)]" />
      <div className="pointer-events-none absolute inset-x-[-22%] bottom-[-24%] h-[58%] rounded-[50%] border border-emerald-100/10 bg-[radial-gradient(ellipse_at_center,rgba(110,231,183,0.20),rgba(8,47,73,0.34)_42%,rgba(2,6,23,0.96)_78%)] blur-sm" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-transparent via-[#02050c]/35 to-[#010203]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[repeating-radial-gradient(ellipse_at_50%_100%,transparent_0_44px,rgba(253,230,138,0.09)_45px_47px)] opacity-70" />

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
        <Link href="/home" className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-100/20 bg-cyan-100/8 shadow-[0_0_40px_rgba(125,211,252,0.18)] backdrop-blur-xl">
            <span className="h-4 w-4 rounded-full bg-cyan-100 shadow-[0_0_22px_rgba(186,230,253,0.85)]" />
          </span>
          <span>
            <span className="block text-[0.62rem] font-black uppercase tracking-[0.52em] text-cyan-100/68">URAI</span>
            <span className="block text-xs text-white/45">Home threshold</span>
          </span>
        </Link>
        <nav className="flex max-w-4xl flex-wrap justify-end gap-2" aria-label="Genesis navigation">
          {navItems.map((item) => (
            <PillLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
      </header>

      <section className="relative z-20 mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-7xl items-center gap-10 px-5 pb-10 pt-4 md:grid-cols-[0.95fr_1.05fr] md:px-8 lg:gap-16">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-cyan-100/20 bg-cyan-100/8 px-4 py-2 text-[0.64rem] font-black uppercase tracking-[0.32em] text-cyan-100/75 backdrop-blur-xl">
            Ground below · Galaxy above
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.88] tracking-[-0.07em] text-white sm:text-6xl lg:text-7xl">
            Own your life. Step inside yourself.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            URAI Home is the threshold between your real-life Ground world and the Life Map galaxy. The public demo is route-true and sample-safe: no private data opens until Passport and consent gates say it can.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ground" className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-[0_18px_60px_rgba(125,211,252,0.22)] transition hover:-translate-y-0.5 hover:bg-cyan-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Enter Ground
            </Link>
            <Link href="/life-map" className="rounded-full border border-white/15 bg-white/7 px-5 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100">
              Ascend to Life Map
            </Link>
            <Link href="/xr" className="rounded-full border border-cyan-100/20 bg-cyan-100/8 px-5 py-3 text-sm font-bold text-cyan-50 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-cyan-100/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100">
              Check XR
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="relative min-h-[34rem] overflow-hidden rounded-[2.75rem] border border-cyan-100/18 bg-slate-950/38 p-5 shadow-[0_28px_120px_rgba(8,47,73,0.35)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.16),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.32),rgba(8,47,73,0.20)_44%,rgba(5,46,22,0.24)_74%,rgba(2,6,23,0.92))]" />
            <Link href="/life-map" aria-label="Open Life Map through the sky" className="absolute inset-x-4 top-4 h-[48%] rounded-[2rem] border border-cyan-100/10 bg-[radial-gradient(circle_at_50%_45%,rgba(125,211,252,0.24),transparent_34%)] transition hover:border-cyan-100/36" />
            <Link href="/ground" aria-label="Enter Ground through the lower world" className="absolute inset-x-4 bottom-4 h-[42%] rounded-[2rem] border border-emerald-100/10 bg-[radial-gradient(ellipse_at_center,rgba(110,231,183,0.22),rgba(8,47,73,0.44)_52%,rgba(2,6,23,0.92)_82%)] transition hover:border-emerald-100/34" />
            <div className="pointer-events-none absolute left-1/2 top-[45%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_34%_26%,#fff,rgba(186,230,253,0.92)_18%,rgba(14,116,144,0.72)_48%,rgba(2,6,23,0.92)_78%)] shadow-[0_0_120px_rgba(125,211,252,0.48)]">
              <span className="absolute -inset-10 rounded-full border border-cyan-100/10" />
              <span className="absolute inset-5 rounded-full border border-white/15" />
            </div>
            <div className="pointer-events-none absolute bottom-7 left-7 right-7 rounded-3xl border border-white/10 bg-black/48 p-4 backdrop-blur-2xl">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.28em] text-cyan-100/56">Home world</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">Click sky or ground</h2>
              <p className="mt-2 text-sm leading-6 text-white/64">The sky opens memory. The ground opens real-life support. The orb keeps both connected.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto max-w-7xl px-5 pb-8 md:px-8">
        <HomeXREntryCard>
          <HomeWorldCanvas />
        </HomeXREntryCard>
      </section>

      <section className="relative z-20 mx-auto grid max-w-7xl gap-4 px-5 pb-8 md:grid-cols-3 md:px-8">
        {thresholdCards.map((card) => (
          <Link key={card.title} href={card.href} className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl transition hover:-translate-y-1 hover:border-cyan-100/30 hover:bg-cyan-100/[0.07]">
            <h2 className="text-base font-black text-white">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">{card.body}</p>
          </Link>
        ))}
      </section>

      <section className="relative z-20 mx-auto max-w-7xl px-5 pb-8 md:px-8">
        <div className="rounded-[2rem] border border-amber-100/14 bg-amber-100/[0.055] p-5 backdrop-blur-2xl">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.30em] text-amber-100/62">Visible workforce</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Ground already has the private helper shape.</h2>
            </div>
            <Link href="/ground" className="text-sm font-bold text-amber-100 underline underline-offset-4 hover:text-white">Meet workforce</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {workforce.map((name, index) => (
              <article key={name} className="rounded-2xl border border-white/10 bg-black/24 p-4">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan-100/20 bg-cyan-100/10 text-xs font-black text-cyan-50">0{index + 1}</span>
                <h3 className="mt-3 text-sm font-black text-white">{name}</h3>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[1.6rem] border border-amber-100/18 bg-amber-100/[0.06] p-4 text-sm leading-6 text-amber-50/76">
          <strong className="text-amber-50">Launch safety:</strong> Home is route-true and public-safe. Live sensing, private account access, health inference, generated private media, autonomous actions, and headset entry remain gated until the current browser proves support.
        </div>
      </section>
    </main>
  );
}

export default NewHomeScene;
