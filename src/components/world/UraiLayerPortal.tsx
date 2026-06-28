import Link from "next/link";
import type { UraiWorldLayerId } from "@/data/uraiWorldSystem";
import { uraiWorldLayers } from "@/data/uraiWorldSystem";

const focusByLayer: Record<UraiWorldLayerId, string> = {
  ground: "focus-visible:outline-emerald-200 hover:border-emerald-200/30",
  sky: "focus-visible:outline-sky-200 hover:border-sky-200/30",
  horizon: "focus-visible:outline-amber-200 hover:border-amber-200/30",
  orb: "focus-visible:outline-cyan-200 hover:border-cyan-200/30",
  chat: "focus-visible:outline-cyan-200 hover:border-cyan-200/30",
};

export default function UraiLayerPortal({ activeLayerId }: { activeLayerId: UraiWorldLayerId }) {
  const focus = focusByLayer[activeLayerId];

  return (
    <section className="border border-white/10 bg-slate-950/58 shadow-2xl shadow-black/35 backdrop-blur-2xl mt-4 rounded-[2.25rem] p-6 sm:p-9" aria-labelledby="urai-world-flow-title">
      <div className="max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-white/48">URAI World System</p>
        <h2 id="urai-world-flow-title" className="mt-4 text-[clamp(2.15rem,4vw,3.7rem)] font-semibold leading-none tracking-[-0.06em]">
          One living world, five camera layers.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-white/62">
          Ground, Sky, Horizon, Orb, and Orb Chat now share the same atmosphere, navigation, Orb presence, and safety language. Moving between them should feel like changing layers inside one cinematic system.
        </p>
      </div>
      <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-5" aria-label="URAI world layer portals">
        {uraiWorldLayers.map((layer, index) => {
          const active = layer.id === activeLayerId;
          return (
            <Link
              key={layer.id}
              href={layer.route}
              aria-current={active ? "page" : undefined}
              className={`min-h-[176px] rounded-[1.35rem] border p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.075] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${focus} ${active ? "border-white/24 bg-white/[0.09]" : "border-white/10 bg-white/[0.05]"}`}
            >
              <span className="block text-xs font-black tracking-[0.16em] text-white/48">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-3 block text-2xl tracking-[-0.05em] text-white">{layer.name}</strong>
              <span className="mt-2 block text-xs font-black uppercase tracking-[0.14em] text-white/44">{active ? "Active layer" : layer.navStatus}</span>
              <span className="mt-3 block text-sm leading-6 text-white/62">{layer.spatialRole}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
