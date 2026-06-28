import Link from "next/link";
import type { UraiWorldLayerId } from "@/data/uraiWorldSystem";
import { uraiWorldNavigation } from "@/data/uraiWorldSystem";

const accentByLayer: Record<UraiWorldLayerId, { dot: string; active: string; hover: string; focus: string }> = {
  ground: {
    dot: "bg-emerald-200 shadow-[0_0_28px_rgba(110,231,183,0.9)]",
    active: "border-emerald-200/45 bg-emerald-200/16 text-emerald-50",
    hover: "hover:border-emerald-200/36",
    focus: "focus-visible:outline-emerald-200",
  },
  sky: {
    dot: "bg-sky-200 shadow-[0_0_28px_rgba(125,211,252,0.9)]",
    active: "border-sky-200/45 bg-sky-200/16 text-sky-50",
    hover: "hover:border-sky-200/36",
    focus: "focus-visible:outline-sky-200",
  },
  horizon: {
    dot: "bg-amber-200 shadow-[0_0_28px_rgba(253,224,71,0.9)]",
    active: "border-amber-200/45 bg-amber-200/16 text-amber-50",
    hover: "hover:border-amber-200/36",
    focus: "focus-visible:outline-amber-200",
  },
  orb: {
    dot: "bg-cyan-200 shadow-[0_0_28px_rgba(103,232,249,0.9)]",
    active: "border-cyan-200/45 bg-cyan-200/16 text-cyan-50",
    hover: "hover:border-cyan-200/36",
    focus: "focus-visible:outline-cyan-200",
  },
  chat: {
    dot: "bg-cyan-200 shadow-[0_0_28px_rgba(103,232,249,0.9)]",
    active: "border-cyan-200/45 bg-cyan-200/16 text-cyan-50",
    hover: "hover:border-cyan-200/36",
    focus: "focus-visible:outline-cyan-200",
  },
};

const navLink =
  "inline-flex min-h-11 items-center rounded-full border px-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

const panel = "border border-white/10 bg-slate-950/58 shadow-2xl shadow-black/35 backdrop-blur-2xl";

export default function UraiWorldNavigation({ activeLayerId, label }: { activeLayerId: UraiWorldLayerId; label: string }) {
  const accent = accentByLayer[activeLayerId];

  return (
    <nav className={`${panel} flex items-center justify-between gap-4 rounded-full px-4 py-3`} aria-label="URAI world navigation">
      <Link href="/home" className={`inline-flex min-h-11 items-center gap-3 rounded-full font-extrabold tracking-[0.16em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${accent.focus}`}>
        <span className={`h-3 w-3 rounded-full ${accent.dot}`} aria-hidden="true" />
        {label}
      </Link>
      <div className="flex max-w-[1000px] flex-wrap justify-end gap-2">
        {uraiWorldNavigation.map((item) => {
          const active = item.id === activeLayerId;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`${navLink} ${accent.focus} ${active ? accent.active : `border-white/10 bg-white/[0.05] text-white/70 ${accent.hover} hover:bg-white/10 hover:text-white`}`}
            >
              <span>{item.label}</span>
              <span className="ml-2 hidden rounded-full border border-white/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-white/48 2xl:inline-flex">
                {active ? "Active" : item.status}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
