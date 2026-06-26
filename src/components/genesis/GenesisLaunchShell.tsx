import Link from "next/link";

type SurfaceAction = {
  href: string;
  label: string;
  note: string;
};

type SurfaceCard = {
  title: string;
  body: string;
};

type GenesisLaunchShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  accent: "cyan" | "gold" | "violet" | "emerald";
  visualLabel: string;
  visualAsset: string;
  supportingAssets?: string[];
  cards: SurfaceCard[];
  actions: SurfaceAction[];
  safetyNote: string;
};

const accentStyles = {
  cyan: {
    text: "text-cyan-100",
    border: "border-cyan-200/25",
    glow: "shadow-cyan-950/30",
    bg: "from-cyan-200/20",
  },
  gold: {
    text: "text-amber-100",
    border: "border-amber-200/25",
    glow: "shadow-amber-950/30",
    bg: "from-amber-200/20",
  },
  violet: {
    text: "text-violet-100",
    border: "border-violet-200/25",
    glow: "shadow-violet-950/30",
    bg: "from-violet-200/20",
  },
  emerald: {
    text: "text-emerald-100",
    border: "border-emerald-200/25",
    glow: "shadow-emerald-950/30",
    bg: "from-emerald-200/20",
  },
} as const;

const shellNav = [
  { href: "/home", label: "Home" },
  { href: "/life-map", label: "Life Map" },
  { href: "/focus", label: "Focus" },
  { href: "/replay", label: "Replay" },
  { href: "/passport", label: "Passport" },
  { href: "/ground", label: "Ground" },
  { href: "/orb", label: "Orb" },
  { href: "/orb-chat", label: "Orb Chat" },
  { href: "/sky", label: "Sky" },
  { href: "/horizon", label: "Horizon" },
];

export default function GenesisLaunchShell({
  eyebrow,
  title,
  description,
  accent,
  visualLabel,
  visualAsset,
  supportingAssets = [],
  cards,
  actions,
  safetyNote,
}: GenesisLaunchShellProps) {
  const tone = accentStyles[accent];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02040b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(234,247,255,0.13),transparent_18rem),radial-gradient(circle_at_18%_34%,rgba(34,211,238,0.12),transparent_24rem),radial-gradient(circle_at_84%_24%,rgba(196,181,253,0.13),transparent_22rem),linear-gradient(180deg,#02040b_0%,#07111f_48%,#000_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_8%_20%,rgba(255,255,255,0.75)_0_1px,transparent_2px),radial-gradient(circle_at_22%_66%,rgba(125,211,252,0.55)_0_1px,transparent_2px),radial-gradient(circle_at_46%_28%,rgba(255,255,255,0.45)_0_1px,transparent_2px),radial-gradient(circle_at_68%_58%,rgba(190,232,255,0.5)_0_1px,transparent_2px),radial-gradient(circle_at_86%_30%,rgba(255,255,255,0.62)_0_1px,transparent_2px)]" />
      <div className={`pointer-events-none absolute left-1/2 top-[56%] h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b ${tone.bg} to-transparent blur-3xl`} />

      <section className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10">
        <div className="flex min-h-[42rem] flex-col justify-between">
          <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/48" aria-label="Genesis launch routes">
            {shellNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 transition hover:border-white/24 hover:bg-white/[0.08] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="py-12 sm:py-16 lg:py-20">
            <p className={`inline-flex rounded-full border ${tone.border} bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${tone.text}`}>
              {eyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.065em] text-white sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
              {description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" aria-label="Primary route actions">
              {actions.map((action, index) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={
                    index === 0
                      ? `rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-2xl ${tone.glow} transition hover:-translate-y-0.5`
                      : "rounded-full border border-white/16 bg-white/[0.055] px-6 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/32 hover:bg-white/[0.09]"
                  }
                >
                  <span className="block">{action.label}</span>
                  <span className="mt-0.5 block text-[0.65rem] font-medium uppercase tracking-[0.16em] opacity-60">{action.note}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-amber-200/20 bg-amber-200/[0.075] p-4 text-sm leading-6 text-amber-50/78 shadow-2xl shadow-black/20">
            <strong className="text-amber-50">Launch safety:</strong> {safetyNote}
          </div>
        </div>

        <div className="flex min-h-[42rem] flex-col justify-center gap-5">
          <div className={`relative min-h-[28rem] overflow-hidden rounded-[2.5rem] border ${tone.border} bg-white/[0.045] shadow-2xl shadow-black/40 backdrop-blur-xl`}>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-78"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(2,4,11,0.2), rgba(2,4,11,0.8)), url(${visualAsset})`,
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.76)_100%)]" aria-hidden="true" />
            {supportingAssets.map((asset, index) => (
              <div
                key={asset}
                className="absolute rounded-full bg-cover bg-center opacity-45 mix-blend-screen blur-[0.2px]"
                style={{
                  backgroundImage: `url(${asset})`,
                  width: index === 0 ? "42%" : "30%",
                  height: index === 0 ? "42%" : "30%",
                  left: index === 0 ? "8%" : "62%",
                  top: index === 0 ? "12%" : "54%",
                }}
                aria-hidden="true"
              />
            ))}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 sm:p-8">
              <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${tone.text}`}>Genesis visual</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">{visualLabel}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/64">
                Local Genesis asset with CSS fallback. No external asset dependency and no generated private media claim.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card) => (
              <article key={card.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <h2 className="text-base font-semibold tracking-[-0.02em] text-white">{card.title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/62">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
