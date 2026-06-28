import type { UraiWorldLayerId } from "@/data/uraiWorldSystem";

const atmosphereByLayer: Record<UraiWorldLayerId, string> = {
  ground:
    "bg-[radial-gradient(circle_at_50%_-10%,rgba(45,212,191,0.2),transparent_30rem),radial-gradient(circle_at_14%_22%,rgba(245,158,11,0.12),transparent_26rem),radial-gradient(circle_at_84%_20%,rgba(56,189,248,0.12),transparent_29rem),linear-gradient(180deg,#020617_0%,#07130f_42%,#0b1209_76%,#020403_100%)]",
  sky:
    "bg-[radial-gradient(circle_at_50%_-12%,rgba(125,211,252,0.28),transparent_34rem),radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.18),transparent_30rem),radial-gradient(circle_at_82%_22%,rgba(167,139,250,0.18),transparent_28rem),linear-gradient(180deg,#020617_0%,#07111f_48%,#02030a_100%)]",
  horizon:
    "bg-[radial-gradient(circle_at_50%_-18%,rgba(253,224,71,0.2),transparent_34rem),radial-gradient(circle_at_16%_12%,rgba(251,146,60,0.13),transparent_30rem),radial-gradient(circle_at_82%_18%,rgba(56,189,248,0.14),transparent_30rem),linear-gradient(180deg,#020617_0%,#07111f_42%,#130d05_72%,#02030a_100%)]",
  orb:
    "bg-[radial-gradient(circle_at_50%_18%,rgba(103,232,249,0.24),transparent_28rem),radial-gradient(circle_at_18%_22%,rgba(45,212,191,0.14),transparent_27rem),radial-gradient(circle_at_82%_8%,rgba(168,85,247,0.18),transparent_30rem),linear-gradient(180deg,#020617_0%,#071122_48%,#02030a_100%)]",
  chat:
    "bg-[radial-gradient(circle_at_50%_12%,rgba(103,232,249,0.24),transparent_26rem),radial-gradient(circle_at_80%_8%,rgba(168,85,247,0.18),transparent_28rem),radial-gradient(circle_at_12%_32%,rgba(45,212,191,0.12),transparent_28rem),linear-gradient(180deg,#020617_0%,#071121_50%,#02030a_100%)]",
};

export function getUraiWorldAtmosphereClass(layerId: UraiWorldLayerId): string {
  return atmosphereByLayer[layerId];
}

export default function UraiWorldAtmosphere({ layerId }: { layerId: UraiWorldLayerId }) {
  const warm = layerId === "ground" || layerId === "horizon";
  const cyan = layerId === "sky" || layerId === "orb" || layerId === "chat";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_13%_20%,rgba(255,255,255,0.68)_0_1px,transparent_2px),radial-gradient(circle_at_73%_16%,rgba(186,230,253,0.5)_0_1px,transparent_2px),radial-gradient(circle_at_48%_38%,rgba(221,214,254,0.42)_0_1px,transparent_2px),radial-gradient(circle_at_86%_64%,rgba(251,191,36,0.32)_0_1px,transparent_2px)]" />
      <div className="absolute left-1/2 top-[37%] h-[62rem] w-[62rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8 shadow-[0_0_150px_rgba(125,211,252,0.11)]" />
      <div className="absolute left-1/2 top-[37%] h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/6" />
      <div className={`absolute inset-x-[-16%] top-[42%] h-[20rem] rounded-[50%] border-t ${warm ? "border-amber-100/22 bg-[radial-gradient(ellipse_at_50%_0%,rgba(253,224,71,0.18),transparent_58%)]" : "border-sky-100/18 bg-[radial-gradient(ellipse_at_50%_0%,rgba(125,211,252,0.16),transparent_58%)]"} blur-[1px]`} />
      <div className={`absolute inset-x-[-12%] top-[48%] h-28 blur-2xl ${warm ? "bg-gradient-to-b from-amber-200/12 via-orange-200/6 to-transparent" : "bg-gradient-to-b from-cyan-200/12 via-violet-200/6 to-transparent"}`} />
      <div className={`absolute inset-x-[-16%] bottom-[-16rem] h-[38rem] rounded-[50%] border-t ${cyan ? "border-cyan-100/14 bg-[radial-gradient(ellipse_at_50%_0%,rgba(56,189,248,0.16),transparent_56%),linear-gradient(180deg,rgba(7,89,133,0.05),rgba(0,0,0,0.84))]" : "border-orange-100/14 bg-[radial-gradient(ellipse_at_50%_0%,rgba(251,146,60,0.14),transparent_60%),linear-gradient(180deg,rgba(67,20,7,0.08),rgba(0,0,0,0.86))]"}`} />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:96px_96px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/78" />
    </div>
  );
}
