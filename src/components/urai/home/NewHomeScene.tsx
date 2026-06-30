"use client";

import Link from "next/link";
import { HomeWorldCanvas } from "@/components/urai/home/HomeWorldCanvas";
import { HomeXREntryCard } from "@/components/xr/XRSessionFoundation";

type RouteState = "live" | "preview" | "gated";

const dockItems: Array<{ href: string; label: string; state: RouteState }> = [
  { href: "/home", label: "Home", state: "live" },
  { href: "/ground", label: "Ground", state: "live" },
  { href: "/life-map", label: "Life Map", state: "preview" },
  { href: "/focus", label: "Focus", state: "preview" },
  { href: "/replay", label: "Replay", state: "preview" },
  { href: "/mirror", label: "Mirror", state: "preview" },
  { href: "/passport", label: "Passport", state: "live" },
  { href: "/status", label: "Status", state: "live" },
] as const;

const routeCards = [
  {
    eyebrow: "Sky route",
    title: "Life Map galaxy",
    body: "Memory stars, patterns, focus chambers, and replay paths open as a sample-safe symbolic galaxy.",
    href: "/life-map",
    cta: "Open sky preview",
    state: "preview",
  },
  {
    eyebrow: "Ground route",
    title: "Real-life world",
    body: "Reception, privacy, calendars, tasks, relationships, objects, and helpers live below your feet.",
    href: "/ground",
    cta: "Enter Ground",
    state: "live",
  },
] as const;

const truthPanels = [
  {
    eyebrow: "Orb companion",
    title: "Listening at the doorway",
    body: "Ask, review, approve, then move through the world with permissioned context. Autonomous action stays gated.",
    href: "/status",
  },
  {
    eyebrow: "Self state",
    title: "Private signals stay yours",
    body: "Focus, recovery, pressure, and body context remain guidance-only and never diagnosis.",
    href: "/privacy-controls",
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

const starDots = Array.from({ length: 82 }, (_, index) => ({
  left: (index * 37 + 11) % 100,
  top: (index * 19 + 7) % 100,
  size: 1 + (index % 5) * 0.5,
  opacity: 0.24 + (index % 7) * 0.065,
}));

function StateBadge({ state }: { state: RouteState }) {
  const copy: Record<RouteState, string> = {
    live: "Live",
    preview: "Preview",
    gated: "Gated",
  };

  return (
    <span
      data-state={state}
      className="rounded-full border border-white/12 bg-white/[0.06] px-2 py-1 text-[0.55rem] font-black uppercase tracking-[0.18em] text-white/62 data-[state=live]:border-emerald-100/30 data-[state=live]:text-emerald-50 data-[state=preview]:border-cyan-100/28 data-[state=preview]:text-cyan-50 data-[state=gated]:border-amber-100/30 data-[state=gated]:text-amber-50"
    >
      {copy[state]}
    </span>
  );
}

function DockLink({ href, label, state }: { href: string; label: string; state: RouteState }) {
  const active = href === "/home";

  return (
    <Link
      href={href}
      data-active={active ? "true" : "false"}
      title={`${label} - ${state}`}
      className="group min-w-fit rounded-full px-3.5 py-2 text-[0.68rem] font-black text-white/68 outline-none transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-100 data-[active=true]:bg-cyan-100 data-[active=true]:text-slate-950 sm:px-4"
    >
      <span>{label}</span>
    </Link>
  );
}

export function NewHomeScene() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02050c] text-white selection:bg-cyan-100/25">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,244,214,0.28),transparent_23%),radial-gradient(circle_at_18%_70%,rgba(45,212,191,0.13),transparent_30%),radial-gradient(circle_at_82%_52%,rgba(125,211,252,0.15),transparent_34%),linear-gradient(180deg,#151716_0%,#081522_44%,#09120f_72%,#010203_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72),transparent_24%,transparent_76%,rgba(0,0,0,0.72))]" />
      <div className="pointer-events-none absolute inset-x-[-18%] bottom-[-24%] h-[55%] rounded-[50%] border border-emerald-100/12 bg-[radial-gradient(ellipse_at_center,rgba(110,231,183,0.18),rgba(8,47,73,0.33)_42%,rgba(2,6,23,0.96)_78%)] blur-sm" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[repeating-radial-gradient(ellipse_at_50%_100%,transparent_0_42px,rgba(253,230,138,0.10)_43px_45px),linear-gradient(180deg,transparent,rgba(0,0,0,0.70))] opacity-80" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {starDots.map((dot, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-cyan-50 shadow-[0_0_18px_rgba(186,230,253,0.48)]"
            style={{ left: `${dot.left}%`, top: `${dot.top}%`, width: dot.size, height: dot.size, opacity: dot.opacity }}
          />
        ))}
        <span className="absolute left-[33%] top-[-4rem] h-[30rem] w-[30rem] rounded-full border border-white/12 opacity-50" />
        <span className="absolute left-[39%] top-[3rem] h-[18rem] w-[44rem] -rotate-[23deg] rounded-[50%] border border-cyan-100/16 opacity-70" />
        <span className="absolute left-[30%] top-[8rem] h-[13rem] w-[52rem] rotate-[12deg] rounded-[50%] border border-white/12 opacity-60" />
        <span className="absolute left-1/2 top-0 h-[46rem] w-24 -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,244,214,0.56),rgba(255,244,214,0.14)_28%,transparent_72%)] blur-sm" />
      </div>

      <header className="relative z-30 mx-auto flex max-w-7xl items-start justify-between gap-4 px-5 py-5 md:px-8">
        <Link href="/home" className="group rounded-2xl border border-white/10 bg-black/45 px-4 py-3 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl outline-none transition hover:border-cyan-100/30 focus-visible:ring-2 focus-visible:ring-cyan-100">
          <span className="block text-[0.72rem] font-black uppercase tracking-[0.5em] text-white">URAI</span>
          <span className="block text-[0.58rem] font-black uppercase tracking-[0.32em] text-white/50">Spatial</span>
        </Link>
        <div className="hidden max-w-sm rounded-2xl border border-white/10 bg-black/40 p-3 text-right text-sm leading-6 text-white/68 shadow-2xl shadow-black/30 backdrop-blur-xl md:block">
          Public-safe spatial surface. Private data, autonomous actions, and headset entry stay gated until proof passes.
        </div>
      </header>

      <section className="relative z-20 mx-auto grid min-h-[calc(100vh-6.5rem)] max-w-7xl items-center gap-6 px-5 pb-28 pt-2 md:px-8 lg:grid-cols-[18rem_minmax(0,1fr)_20rem] lg:gap-8">
        <aside className="order-2 grid gap-3 lg:order-1">
          {routeCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-[1.45rem] border border-white/10 bg-slate-950/68 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-2xl outline-none transition hover:-translate-y-0.5 hover:border-cyan-100/30 hover:bg-slate-950/78 focus-visible:ring-2 focus-visible:ring-cyan-100"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.28em] text-cyan-100/74">{card.eyebrow}</p>
                <StateBadge state={card.state} />
              </div>
              <h2 className="mt-2 text-base font-black text-white">{card.title}</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-white/70">{card.body}</p>
              <span className="mt-3 inline-flex text-xs font-black uppercase tracking-[0.18em] text-cyan-100/82 group-hover:text-white">{card.cta}</span>
            </Link>
          ))}

          <section className="rounded-[1.45rem] border border-amber-100/18 bg-slate-950/68 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
            <p className="text-[0.62rem] font-black uppercase tracking-[0.28em] text-cyan-100/72">Visible workforce</p>
            <h2 className="mt-2 text-base font-black leading-6 text-white">Helpers wait in Ground.</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-white/70">
              {workforce.join(", ")} stage support for review. Nothing acts without permission.
            </p>
            <Link href="/ground" className="mt-4 inline-flex rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-cyan-100">
              Meet workforce
            </Link>
          </section>
        </aside>

        <section className="order-1 text-center lg:order-2">
          <p className="mx-auto inline-flex rounded-full border border-cyan-100/18 bg-cyan-100/10 px-4 py-2 text-[0.66rem] font-black uppercase tracking-[0.34em] text-cyan-100/86 shadow-[0_16px_50px_rgba(8,47,73,0.25)] backdrop-blur-xl">
            Home threshold
          </p>
          <h1 className="mx-auto mt-5 max-w-4xl text-[3.35rem] font-black leading-[0.92] tracking-[-0.075em] text-[#fff5df] drop-shadow-[0_12px_42px_rgba(0,0,0,0.32)] sm:text-6xl lg:text-7xl">
            Own your life. <br /> Step inside yourself.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-white/76 sm:text-lg">
            The ground opens your private real-life world. The sky opens your sample-safe Life Map galaxy. URAI Spatial keeps both honest at the doorway.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/ground" className="rounded-full bg-[#fff5df] px-6 py-3 text-sm font-black text-slate-950 shadow-[0_18px_70px_rgba(255,245,223,0.24)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:ring-2 focus-visible:ring-white">
              Step inside Ground
            </Link>
            <Link href="/life-map" className="rounded-full border border-cyan-100/24 bg-cyan-100/10 px-6 py-3 text-sm font-black text-cyan-50 shadow-[0_18px_70px_rgba(14,116,144,0.18)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-cyan-100/15 focus-visible:ring-2 focus-visible:ring-cyan-100">
              Open Life Map preview
            </Link>
            <Link href="/xr" className="rounded-full border border-white/14 bg-black/38 px-6 py-3 text-sm font-bold text-white/82 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan-100">
              Check XR support
            </Link>
          </div>

          <div className="relative mx-auto mt-10 h-[22rem] max-w-[42rem] sm:h-[28rem]">
            <Link href="/life-map" aria-label="Open the sample-safe Life Map sky" className="absolute inset-x-[8%] top-0 h-[48%] rounded-[50%] border border-cyan-100/12 bg-[radial-gradient(ellipse_at_center,rgba(125,211,252,0.16),transparent_66%)] outline-none transition hover:border-cyan-100/38 focus-visible:ring-2 focus-visible:ring-cyan-100" />
            <Link href="/ground" aria-label="Enter the Ground real-life world" className="absolute inset-x-[3%] bottom-0 h-[42%] rounded-[50%] border border-amber-100/18 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.18),rgba(8,47,73,0.20)_44%,rgba(0,0,0,0.62)_76%)] outline-none transition hover:border-amber-100/42 focus-visible:ring-2 focus-visible:ring-amber-100" />
            <div className="pointer-events-none absolute left-1/2 top-[49%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/24 bg-[radial-gradient(circle_at_36%_26%,rgba(255,245,223,0.92),rgba(255,245,223,0.52)_24%,rgba(14,116,144,0.28)_52%,rgba(2,6,23,0.74)_74%)] shadow-[0_0_120px_rgba(255,245,223,0.35)] sm:h-48 sm:w-48">
              <span className="absolute inset-[26%] rounded-full border-[1.4rem] border-slate-950/40 bg-transparent" />
              <span className="absolute -inset-12 rounded-full border border-amber-100/18" />
            </div>
            <div className="pointer-events-none absolute bottom-8 left-1/2 h-16 w-3 -translate-x-1/2 rounded-t-full bg-slate-950/90 shadow-[0_0_20px_rgba(0,0,0,0.8)]" />
          </div>
        </section>

        <aside className="order-3 grid gap-3">
          {truthPanels.map((panel) => (
            <Link key={panel.title} href={panel.href} className="rounded-[1.45rem] border border-white/10 bg-slate-950/68 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-2xl outline-none transition hover:-translate-y-0.5 hover:border-cyan-100/30 hover:bg-slate-950/78 focus-visible:ring-2 focus-visible:ring-cyan-100">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.28em] text-cyan-100/72">{panel.eyebrow}</p>
              <h2 className="mt-2 text-base font-black text-white">{panel.title}</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-white/70">{panel.body}</p>
            </Link>
          ))}

          <Link href="/ground" className="rounded-[1.45rem] border border-amber-100/16 bg-black/50 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-2xl outline-none transition hover:-translate-y-0.5 hover:border-amber-100/34 focus-visible:ring-2 focus-visible:ring-amber-100">
            <p className="text-base font-black text-amber-50">Click the ground</p>
            <p className="mt-2 text-sm font-medium leading-6 text-white/66">Enter your real-life world, private workforce, and permission layer.</p>
          </Link>
        </aside>
      </section>

      <nav className="fixed inset-x-3 bottom-4 z-40 mx-auto flex max-w-3xl items-center gap-1 overflow-x-auto rounded-full border border-cyan-100/14 bg-slate-950/82 p-2 shadow-[0_18px_80px_rgba(0,0,0,0.46)] backdrop-blur-2xl [scrollbar-width:none]" aria-label="URAI Spatial dock">
        {dockItems.map((item) => (
          <DockLink key={item.href} href={item.href} label={item.label} state={item.state} />
        ))}
      </nav>

      <section className="relative z-20 mx-auto max-w-7xl px-5 pb-36 md:px-8">
        <HomeXREntryCard>
          <HomeWorldCanvas />
        </HomeXREntryCard>
        <div className="mt-4 rounded-[1.6rem] border border-amber-100/18 bg-amber-100/[0.07] p-4 text-sm font-medium leading-6 text-amber-50/80 backdrop-blur-xl">
          <strong className="text-amber-50">Launch safety:</strong> This is a route-true public surface. Private account access, live sensing, generated private media, health inference, autonomous actions, and headset entry remain gated unless the relevant support and consent proof passes.
        </div>
      </section>
    </main>
  );
}

export default NewHomeScene;
