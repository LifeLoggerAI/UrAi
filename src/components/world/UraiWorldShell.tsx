import Link from "next/link";
import type { UraiWorldLayerId } from "@/data/uraiWorldSystem";
import { getUraiWorldLayer } from "@/data/uraiWorldSystem";
import UraiLayerPortal from "./UraiLayerPortal";
import UraiWorldAtmosphere, { getUraiWorldAtmosphereClass } from "./UraiWorldAtmosphere";
import UraiWorldCanvas from "./UraiWorldCanvas";
import UraiWorldNavigation from "./UraiWorldNavigation";
import OrbChatCockpit from "./chat/OrbChatCockpit";

const accentByLayer: Record<UraiWorldLayerId, { eyebrow: string; primary: string; secondaryHover: string; focus: string; chip: string }> = {
  ground: {
    eyebrow: "border-emerald-200/25 bg-emerald-200/10 text-emerald-100",
    primary: "border-emerald-100/40 bg-gradient-to-br from-emerald-300 to-teal-200 text-emerald-950 shadow-[0_18px_44px_rgba(20,184,166,0.24)]",
    secondaryHover: "hover:border-emerald-200/40",
    focus: "focus-visible:outline-emerald-200",
    chip: "border-emerald-200/18 text-emerald-100/72",
  },
  sky: {
    eyebrow: "border-sky-200/25 bg-sky-200/10 text-sky-100",
    primary: "border-sky-100/40 bg-gradient-to-br from-sky-200 to-cyan-200 text-sky-950 shadow-[0_18px_44px_rgba(56,189,248,0.24)]",
    secondaryHover: "hover:border-sky-200/40",
    focus: "focus-visible:outline-sky-200",
    chip: "border-sky-200/18 text-sky-100/72",
  },
  horizon: {
    eyebrow: "border-amber-200/25 bg-amber-200/10 text-amber-100",
    primary: "border-amber-100/40 bg-gradient-to-br from-amber-200 to-orange-200 text-stone-950 shadow-[0_18px_44px_rgba(251,191,36,0.24)]",
    secondaryHover: "hover:border-amber-200/40",
    focus: "focus-visible:outline-amber-200",
    chip: "border-amber-200/18 text-amber-100/72",
  },
  orb: {
    eyebrow: "border-cyan-200/25 bg-cyan-200/10 text-cyan-100",
    primary: "border-cyan-100/40 bg-gradient-to-br from-cyan-200 to-teal-200 text-cyan-950 shadow-[0_18px_44px_rgba(34,211,238,0.24)]",
    secondaryHover: "hover:border-cyan-200/40",
    focus: "focus-visible:outline-cyan-200",
    chip: "border-cyan-200/18 text-cyan-100/72",
  },
  chat: {
    eyebrow: "border-cyan-200/25 bg-cyan-200/10 text-cyan-100",
    primary: "border-cyan-100/40 bg-gradient-to-br from-cyan-200 to-teal-200 text-cyan-950 shadow-[0_18px_44px_rgba(34,211,238,0.24)]",
    secondaryHover: "hover:border-cyan-200/40",
    focus: "focus-visible:outline-cyan-200",
    chip: "border-cyan-200/18 text-cyan-100/72",
  },
};

const panel = "border border-white/10 bg-slate-950/58 shadow-2xl shadow-black/35 backdrop-blur-2xl";

export default function UraiWorldShell({ layerId }: { layerId: UraiWorldLayerId }) {
  const layer = getUraiWorldLayer(layerId);
  const accent = accentByLayer[layer.id];

  return (
    <main aria-label={`URAI ${layer.name} world layer`} className={`relative min-h-screen overflow-x-hidden ${getUraiWorldAtmosphereClass(layer.id)} text-white`}>
      <UraiWorldAtmosphere layerId={layer.id} />

      <div className="relative z-10 mx-auto flex min-h-screen w-[min(1280px,calc(100%-2rem))] flex-col pb-20 pt-6">
        <UraiWorldNavigation activeLayerId={layer.id} label={layer.navLabel} />

        <section className={`${panel} relative mt-4 grid flex-1 items-center gap-6 overflow-hidden rounded-[3rem] p-5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-8`} aria-labelledby={`${layer.id}-title`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_14%,rgba(255,255,255,0.08),transparent_13rem),linear-gradient(125deg,rgba(255,255,255,0.07),transparent_48%)]" aria-hidden="true" />

          <div className="relative z-10">
            <p className={`inline-flex rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.3em] ${accent.eyebrow}`}>
              {layer.eyebrow}
            </p>
            <h1 id={`${layer.id}-title`} className="mt-5 max-w-3xl text-[clamp(2.75rem,6vw,5.65rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
              {layer.title}
            </h1>
            <p className="mt-5 max-w-2xl text-[clamp(1rem,1.75vw,1.27rem)] leading-[1.3] tracking-[-0.03em] text-white/82">
              {layer.tagline}
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-white/66">{layer.body}</p>
            <p className="mt-5 max-w-2xl rounded-2xl border border-white/12 bg-white/[0.065] px-4 py-3 text-sm leading-6 text-white/74">
              {layer.trustLine}
            </p>
            <div className="mt-8 flex flex-wrap gap-3" aria-label={`${layer.name} primary actions`}>
              {layer.primaryActions.map((action, index) => (
                <Link
                  key={action.href + action.label}
                  href={action.href}
                  className={
                    index === 0
                      ? `inline-flex min-h-12 items-center justify-center rounded-full border px-6 text-sm font-extrabold transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${accent.primary} ${accent.focus}`
                      : `inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.075] px-5 text-sm font-bold text-white/84 transition hover:-translate-y-0.5 ${accent.secondaryHover} hover:bg-white/12 hover:text-white active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${accent.focus}`
                  }
                >
                  <span>{action.label}</span>
                  <span className="ml-2 hidden rounded-full border border-white/15 px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.12em] opacity-60 sm:inline-flex">
                    {action.note}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <UraiWorldCanvas layer={layer} />
        </section>

        <UraiLayerPortal activeLayerId={layer.id} />

        {layer.id === "chat" ? <OrbChatCockpit layer={layer} /> : null}

        <section className={`${panel} mt-4 rounded-[2.25rem] p-6 sm:p-9`} aria-labelledby={`${layer.id}-cards-title`}>
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-white/46">Layer meaning</p>
            <h2 id={`${layer.id}-cards-title`} className="mt-4 text-[clamp(2.1rem,3.7vw,3.45rem)] font-semibold leading-none tracking-[-0.06em]">
              {layer.layerFeeling}
            </h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {layer.cards.map((card) => (
              <article key={card.title} className="min-h-[218px] rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(255,255,255,0.1),transparent_14rem)] bg-white/[0.055] p-5">
                <span className={`inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-black uppercase tracking-[0.08em] ${accent.chip}`}>
                  {card.status}
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.04em] text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/64">{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-4 grid gap-4 rounded-[2.25rem] p-6 sm:p-9 lg:grid-cols-2`} aria-labelledby={`${layer.id}-trust-title`}>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-white/46">Trust boundary</p>
            <h2 id={`${layer.id}-trust-title`} className="mt-4 text-[clamp(2rem,3.5vw,3.25rem)] font-semibold leading-none tracking-[-0.06em]">
              What {layer.name} is and is not.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:col-span-2">
            <article className="rounded-[1.5rem] border border-white/12 bg-white/[0.055] p-5">
              <h3 className="text-xl font-semibold tracking-[-0.04em] text-white">{layer.name} is</h3>
              <ul className="mt-4 grid gap-3 p-0">
                {layer.isList.map((item) => (
                  <li key={item} className="list-none rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white/72">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-[1.5rem] border border-amber-200/15 bg-amber-200/[0.055] p-5">
              <h3 className="text-xl font-semibold tracking-[-0.04em] text-white">{layer.name} is not</h3>
              <ul className="mt-4 grid gap-3 p-0">
                {layer.isNotList.map((item) => (
                  <li key={item} className="list-none rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white/72">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className={`${panel} mt-4 rounded-[2.25rem] border-amber-200/15 bg-[radial-gradient(circle_at_8%_0%,rgba(250,204,21,0.1),transparent_18rem)] p-6 sm:p-8`} aria-labelledby={`${layer.id}-safety-title`}>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-200">Launch safety</p>
          <h2 id={`${layer.id}-safety-title`} className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
            {layer.safetyTitle}
          </h2>
          <p className="mt-3 max-w-5xl text-sm leading-6 text-white/68">{layer.safetyCopy}</p>
        </section>
      </div>
    </main>
  );
}
