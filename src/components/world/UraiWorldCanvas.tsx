import Link from "next/link";
import type { UraiWorldLayer, UraiWorldLayerId } from "@/data/uraiWorldSystem";
import UraiOrbPresence from "./UraiOrbPresence";

const stageByLayer: Record<UraiWorldLayerId, { border: string; gradient: string; glow: string; chip: string; focus: string; lineA: string; lineB: string }> = {
  ground: {
    border: "border-emerald-200/16",
    gradient: "bg-[radial-gradient(circle_at_50%_56%,rgba(110,231,183,0.22),transparent_14rem),radial-gradient(circle_at_48%_30%,rgba(245,158,11,0.12),transparent_18rem),linear-gradient(180deg,rgba(6,78,59,0.1),rgba(2,6,23,0.9))]",
    glow: "bg-emerald-200/12",
    chip: "border-emerald-200/20 bg-emerald-200/10 text-emerald-50/82",
    focus: "focus-visible:outline-emerald-200 hover:border-emerald-200/42",
    lineA: "rgba(110,231,183,.34)",
    lineB: "rgba(251,191,36,.22)",
  },
  sky: {
    border: "border-sky-200/16",
    gradient: "bg-[radial-gradient(circle_at_50%_25%,rgba(125,211,252,0.25),transparent_16rem),radial-gradient(circle_at_58%_58%,rgba(167,139,250,0.13),transparent_18rem),linear-gradient(180deg,rgba(15,23,42,0.08),rgba(2,6,23,0.88))]",
    glow: "bg-sky-200/12",
    chip: "border-sky-200/20 bg-sky-200/10 text-sky-50/82",
    focus: "focus-visible:outline-sky-200 hover:border-sky-200/42",
    lineA: "rgba(191,233,255,.34)",
    lineB: "rgba(221,214,254,.22)",
  },
  horizon: {
    border: "border-amber-200/16",
    gradient: "bg-[radial-gradient(circle_at_50%_38%,rgba(253,224,71,0.22),transparent_15rem),radial-gradient(circle_at_54%_60%,rgba(56,189,248,0.11),transparent_18rem),linear-gradient(180deg,rgba(15,23,42,0.08),rgba(2,6,23,0.88))]",
    glow: "bg-amber-200/12",
    chip: "border-amber-200/20 bg-amber-200/10 text-amber-50/82",
    focus: "focus-visible:outline-amber-200 hover:border-amber-200/42",
    lineA: "rgba(253,224,71,.34)",
    lineB: "rgba(125,211,252,.24)",
  },
  orb: {
    border: "border-cyan-200/16",
    gradient: "bg-[radial-gradient(circle_at_50%_34%,rgba(103,232,249,0.25),transparent_13rem),radial-gradient(circle_at_50%_63%,rgba(168,85,247,0.13),transparent_19rem),linear-gradient(180deg,rgba(15,23,42,0.18),rgba(2,6,23,0.9))]",
    glow: "bg-cyan-200/12",
    chip: "border-cyan-200/20 bg-cyan-200/10 text-cyan-50/82",
    focus: "focus-visible:outline-cyan-200 hover:border-cyan-200/42",
    lineA: "rgba(191,233,255,.34)",
    lineB: "rgba(221,214,254,.22)",
  },
  chat: {
    border: "border-cyan-200/16",
    gradient: "bg-[radial-gradient(circle_at_50%_32%,rgba(103,232,249,0.24),transparent_13rem),radial-gradient(circle_at_56%_66%,rgba(168,85,247,0.14),transparent_18rem),linear-gradient(180deg,rgba(15,23,42,0.16),rgba(2,6,23,0.9))]",
    glow: "bg-cyan-200/12",
    chip: "border-cyan-200/20 bg-cyan-200/10 text-cyan-50/82",
    focus: "focus-visible:outline-cyan-200 hover:border-cyan-200/42",
    lineA: "rgba(191,233,255,.34)",
    lineB: "rgba(221,214,254,.22)",
  },
};

export default function UraiWorldCanvas({ layer }: { layer: UraiWorldLayer }) {
  const stage = stageByLayer[layer.id];

  return (
    <section className={`relative z-10 min-h-[31rem] overflow-hidden rounded-[2.6rem] border ${stage.border} ${stage.gradient} p-5 shadow-2xl shadow-black/45 sm:min-h-[36rem]`} aria-labelledby={`${layer.id}-visual-title`}>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_35%,rgba(255,255,255,0.04)_58%,transparent_86%)]" />
      <div aria-hidden="true" className={`absolute left-[-12%] top-[38%] h-32 w-[124%] rotate-[-2deg] rounded-[50%] ${stage.glow} blur-3xl`} />
      <div aria-hidden="true" className="absolute inset-x-[-12%] top-[48%] h-20 rounded-[50%] border-t border-white/18 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.12),transparent_66%)]" />
      <div aria-hidden="true" className="absolute inset-x-[-22%] bottom-[-8rem] h-[20rem] rounded-[50%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.08),transparent_62%)]" />

      <svg className="absolute inset-0 h-full w-full opacity-80" viewBox="0 0 920 700" aria-hidden="true">
        <path d="M88 220 C214 112 344 278 462 184 S660 240 824 112" fill="none" stroke={stage.lineA} strokeWidth="1" />
        <path d="M112 408 C270 294 404 426 558 326 S744 354 830 486" fill="none" stroke={stage.lineB} strokeWidth="1" />
        <path d="M454 286 L262 690" stroke={stage.lineA} strokeWidth="1.4" />
        <path d="M466 286 L664 690" stroke={stage.lineB} strokeWidth="1.4" />
        <path d="M186 600 C330 548 590 548 746 602" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="1" strokeDasharray="8 12" />
        <circle cx="462" cy="184" r="5" fill="rgba(240,249,255,.92)" />
        <circle cx="824" cy="112" r="4" fill="rgba(221,214,254,.9)" />
        <circle cx="558" cy="326" r="4" fill="rgba(186,230,253,.9)" />
        <circle cx="186" cy="600" r="3" fill="rgba(253,224,71,.8)" />
        <circle cx="746" cy="602" r="3" fill="rgba(125,211,252,.8)" />
      </svg>

      <div className="relative hidden min-h-[31rem] sm:block" aria-label={`${layer.name} world visual field`}>
        <div className="absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-1/2">
          <UraiOrbPresence layerId={layer.id} status={layer.orbStatus} />
        </div>
        <div className={`absolute right-4 top-4 rounded-full border px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.18em] ${stage.chip}`}>
          {layer.visualLabel}
        </div>

        {layer.nodes.map((node) => (
          <Link
            key={node.id}
            href={node.href}
            className={`group absolute ${node.positionClass} z-10 min-h-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/16 bg-slate-950/72 px-4 py-3 text-left shadow-2xl shadow-black/35 backdrop-blur-xl transition hover:z-20 hover:scale-[1.02] hover:bg-slate-900/86 focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${stage.focus}`}
            aria-label={`${node.label}: ${node.copy}`}
          >
            <span className="block text-xs font-black uppercase tracking-[0.15em] text-white/88">{node.label}</span>
            <span className="mt-1 inline-flex rounded-full border border-white/16 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-[0.1em] text-white/62">
              {node.status}
            </span>
            <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.7rem)] hidden w-64 -translate-x-1/2 rounded-2xl border border-white/14 bg-slate-950/94 p-3 text-xs leading-5 text-white/72 shadow-2xl shadow-black/40 group-hover:block group-focus-visible:block">
              {node.copy}
            </span>
          </Link>
        ))}
      </div>

      <div className="relative grid gap-3 pt-16 sm:hidden" aria-label={`${layer.name} mobile world nodes`}>
        <div className="mx-auto">
          <UraiOrbPresence layerId={layer.id} status={layer.orbStatus} />
        </div>
        {layer.nodes.map((node) => (
          <Link key={node.id} href={node.href} className={`rounded-[1.25rem] border border-white/12 bg-slate-950/72 p-4 text-left backdrop-blur-xl transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${stage.focus}`}>
            <span className="block text-xs font-black uppercase tracking-[0.16em] text-white/84">{node.label}</span>
            <span className="mt-2 inline-flex rounded-full border border-white/14 px-2 py-1 text-[0.6rem] font-black uppercase tracking-[0.12em] text-white/60">{node.status}</span>
            <span className="mt-3 block text-sm leading-6 text-white/68">{node.copy}</span>
          </Link>
        ))}
      </div>

      <div className="relative mt-4 rounded-[1.5rem] border border-white/12 bg-slate-950/76 p-4 backdrop-blur-xl sm:absolute sm:bottom-4 sm:left-4 sm:right-4 sm:mt-0">
        <p className="text-xs font-black uppercase tracking-[0.26em] text-white/62">{layer.spatialRole}</p>
        <h2 id={`${layer.id}-visual-title`} className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
          {layer.visualTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/66">{layer.visualBody}</p>
      </div>
    </section>
  );
}
