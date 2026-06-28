import type { UraiWorldLayerId } from "@/data/uraiWorldSystem";

const orbByLayer: Record<UraiWorldLayerId, { aura: string; core: string; ring: string; label: string }> = {
  ground: {
    aura: "bg-[radial-gradient(circle,rgba(110,231,183,0.25),rgba(245,158,11,0.1)_44%,transparent_69%)]",
    core: "bg-[radial-gradient(circle_at_32%_24%,#fff,#bbf7d0_20%,#14b8a6_48%,#03150f_88%)] shadow-[inset_-30px_-34px_48px_rgba(0,0,0,.74),0_0_88px_rgba(110,231,183,.48)]",
    ring: "border-emerald-100/18",
    label: "Rooted",
  },
  sky: {
    aura: "bg-[radial-gradient(circle,rgba(125,211,252,0.25),rgba(167,139,250,0.13)_44%,transparent_69%)]",
    core: "bg-[radial-gradient(circle_at_32%_24%,#fff,#bae6fd_20%,#38bdf8_48%,#031525_88%)] shadow-[inset_-30px_-34px_48px_rgba(0,0,0,.74),0_0_88px_rgba(125,211,252,.5)]",
    ring: "border-sky-100/18",
    label: "Expansive",
  },
  horizon: {
    aura: "bg-[radial-gradient(circle,rgba(253,224,71,0.26),rgba(251,146,60,0.12)_44%,transparent_69%)]",
    core: "bg-[radial-gradient(circle_at_32%_24%,#fff,#fde68a_20%,#f59e0b_48%,#1c1004_88%)] shadow-[inset_-30px_-34px_48px_rgba(0,0,0,.74),0_0_88px_rgba(253,224,71,.48)]",
    ring: "border-amber-100/18",
    label: "Generative",
  },
  orb: {
    aura: "bg-[radial-gradient(circle,rgba(103,232,249,0.28),rgba(168,85,247,0.14)_44%,transparent_69%)]",
    core: "bg-[radial-gradient(circle_at_30%_22%,#fff_0_8%,#cffafe_17%,#67e8f9_31%,#0e7490_55%,#031525_88%)] shadow-[inset_-34px_-38px_56px_rgba(0,0,0,.76),inset_18px_14px_30px_rgba(255,255,255,.26),0_0_92px_rgba(103,232,249,.52)]",
    ring: "border-cyan-100/18",
    label: "Awake",
  },
  chat: {
    aura: "bg-[radial-gradient(circle,rgba(103,232,249,0.28),rgba(168,85,247,0.14)_44%,transparent_69%)]",
    core: "bg-[radial-gradient(circle_at_30%_22%,#fff_0_8%,#cffafe_17%,#67e8f9_31%,#0e7490_55%,#031525_88%)] shadow-[inset_-34px_-38px_56px_rgba(0,0,0,.76),inset_18px_14px_30px_rgba(255,255,255,.26),0_0_92px_rgba(103,232,249,.52)]",
    ring: "border-cyan-100/18",
    label: "Listening",
  },
};

export default function UraiOrbPresence({ layerId, status }: { layerId: UraiWorldLayerId; status: string }) {
  const orb = orbByLayer[layerId];

  return (
    <div className="relative flex h-[min(63vw,22rem)] w-[min(63vw,22rem)] items-center justify-center rounded-full border border-white/12 bg-white/[0.035] shadow-[0_0_150px_rgba(103,232,249,0.18)]" role="img" aria-label={`URAI Orb presence in ${orb.label.toLowerCase()} state`}>
      <div aria-hidden="true" className={`absolute inset-[-20%] rounded-full ${orb.aura} blur-2xl motion-safe:animate-pulse`} />
      <div aria-hidden="true" className={`absolute inset-[8%] rounded-full border ${orb.ring}`} />
      <div aria-hidden="true" className="absolute inset-[18%] rounded-full border border-violet-100/12" />
      <div aria-hidden="true" className="absolute inset-[30%] rounded-full border border-white/10" />
      <div aria-hidden="true" className={`relative h-[min(34vw,12.5rem)] w-[min(34vw,12.5rem)] rounded-full ${orb.core}`} />
      <span className="absolute right-[10%] top-[14%] rounded-full border border-white/18 bg-slate-950/64 px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.12em] text-white/76">
        {orb.label}
      </span>
      <span className="absolute bottom-[14%] left-[10%] max-w-[12rem] rounded-full border border-white/14 bg-slate-950/64 px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.1em] text-white/64">
        {status}
      </span>
    </div>
  );
}
