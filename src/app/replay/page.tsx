import Link from "next/link";

export const metadata = {
  title: "URAI Replay Preview",
  description: "Launch-safe URAI replay preview with public demo copy and clear private-data boundaries.",
};

const beats = [
  "The Quiet Reset",
  "First Signal of Recovery",
  "Energy Came Back Slowly",
  "The Root System Glowed",
  "Sprout and Root Glow",
] as const;

const evidenceCards = [
  ["Mode", "Cinematic preview"],
  ["Private media", "Not opened"],
  ["People", "Protected"],
  ["Replay state", "Sample thread"],
] as const;

const backgroundStars = Array.from({ length: 56 }, (_, index) => ({
  left: (index * 29 + 9) % 100,
  top: (index * 41 + 13) % 100,
  size: 1 + (index % 4) * 0.6,
  opacity: 0.18 + (index % 6) * 0.08,
}));

export default function ReplayPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02040d] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_45%_22%,rgba(125,211,252,0.18),transparent_24%),radial-gradient(circle_at_62%_68%,rgba(168,85,247,0.14),transparent_30%),linear-gradient(180deg,#02040d_0%,#07101f_48%,#02040d_100%)]" />
      <div className="pointer-events-none absolute inset-0 backdrop-blur-[1px]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
        {backgroundStars.map((star, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-cyan-50 shadow-[0_0_18px_rgba(186,230,253,0.45)]"
            style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, opacity: star.opacity }}
          />
        ))}
      </div>

      <header className="relative z-20 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 md:px-8">
        <Link href="/home" className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[0.7rem] font-black uppercase tracking-[0.22em] text-white/70 backdrop-blur-xl hover:text-white">
          Back home
        </Link>
        <nav className="flex flex-wrap gap-2" aria-label="Replay navigation">
          {["/life-map", "/focus", "/passport", "/status"].map((href) => (
            <Link key={href} href={href} className="rounded-full border border-white/10 bg-black/28 px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/58 backdrop-blur-xl hover:border-cyan-100/30 hover:text-white">
              {href.slice(1).replace("life-map", "Life Map")}
            </Link>
          ))}
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-5.2rem)] max-w-6xl items-center gap-8 px-5 pb-10 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div>
          <p className="inline-flex rounded-full border border-cyan-100/18 bg-cyan-100/8 px-4 py-2 text-[0.64rem] font-black uppercase tracking-[0.3em] text-cyan-100/72 backdrop-blur-xl">
            Replay thread / sample memory preview
          </p>
          <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">
            Blue Fog Memory
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
            This is a launch-safe cinematic replay preview. It slows the public demo field, follows a sample thread, and keeps private media, people, provider data, and generated life movies behind consent gates.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/focus" className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-[0_18px_60px_rgba(125,211,252,0.20)] hover:bg-cyan-50">
              Back to focus
            </Link>
            <Link href="/life-map" className="rounded-full border border-white/15 bg-white/[0.07] px-5 py-3 text-sm font-bold text-white backdrop-blur-xl hover:bg-white/[0.12]">
              Back to galaxy
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative min-h-[32rem] overflow-hidden rounded-[2.75rem] border border-cyan-100/14 bg-slate-950/54 p-6 shadow-[0_30px_130px_rgba(8,47,73,0.34)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(186,230,253,0.20),transparent_25%),radial-gradient(circle_at_74%_68%,rgba(168,85,247,0.16),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.22),rgba(2,6,23,0.92))]" />
            <div className="absolute left-1/2 top-[38%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/10" />
            <div className="absolute left-1/2 top-[38%] h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
            <div className="absolute left-1/2 top-[35%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_34%_24%,#fff,rgba(186,230,253,0.9)_18%,rgba(14,116,144,0.70)_48%,rgba(2,6,23,0.92)_78%)] shadow-[0_0_140px_rgba(125,211,252,0.48)]" />

            <div className="relative z-10 mt-64 rounded-[2rem] border border-white/10 bg-black/42 p-5 backdrop-blur-2xl">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.28em] text-cyan-100/56">Now previewing</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-white">The Quiet Reset</h2>
              <p className="mt-3 text-sm leading-6 text-white/64">A quieter rhythm returned before the week knew how to name it. In Genesis, replay is a symbolic chamber until private proof is owner-approved.</p>
              <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/3 rounded-full bg-cyan-100/70" />
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-4">
                {evidenceCards.map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                    <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-white/38">{label}</p>
                    <p className="mt-1 text-xs font-bold text-white/74">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ol className="mt-4 grid gap-2 sm:grid-cols-5" aria-label="Replay beats">
            {beats.map((beat, index) => (
              <li key={beat} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-xs leading-5 text-white/62 backdrop-blur-xl">
                <span className="block text-[0.58rem] font-black uppercase tracking-[0.2em] text-cyan-100/48">0{index + 1}</span>
                <strong className="mt-1 block text-white/82">{beat}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
