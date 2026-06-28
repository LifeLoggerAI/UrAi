import Link from "next/link";

export const metadata = {
  title: "URAI Location Map",
  description: "URAI sample place map for the public demo route chain.",
};

const navItems = [
  ["Home", "/home"],
  ["Ground", "/ground"],
  ["Life Map", "/life-map"],
  ["Replay", "/replay"],
  ["Passport", "/passport"],
  ["Status", "/status"],
] as const;

const cards = [
  ["Home base", "Calm return", "Routines, reset, and privacy live close to Ground."],
  ["Work zone", "Pressure ridge", "Focus load and unfinished loops become visible."],
  ["Connection field", "Warm signal", "Check-ins and repair threads become relationship weather."],
  ["Memory coast", "Blue fog", "Replay-ready memories sit near symbolic recovery arcs."],
  ["Recovery garden", "Green bloom", "Lower-pressure days appear as restorative patterns."],
  ["Future horizon", "Gold ascent", "Plans and future self routes glow as preview paths."],
] as const;

export default function LocationMapPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02040d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(125,211,252,0.18),transparent_24%),radial-gradient(circle_at_78%_18%,rgba(251,191,36,0.12),transparent_28%),radial-gradient(circle_at_50%_74%,rgba(45,212,191,0.16),transparent_34%),linear-gradient(180deg,#02040d_0%,#06111f_42%,#03120e_100%)]" />

      <header className="relative z-20 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 md:px-8">
        <Link href="/home" className="rounded-full border border-cyan-100/18 bg-black/34 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.26em] text-cyan-50/78 backdrop-blur-xl hover:text-white">
          URAI Location Map
        </Link>
        <nav className="flex flex-wrap justify-end gap-2" aria-label="Location Map navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full border border-white/10 bg-black/28 px-3 py-2 text-[0.64rem] font-black uppercase tracking-[0.16em] text-white/58 backdrop-blur-xl transition hover:border-cyan-100/30 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-5 pb-10 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div>
          <p className="inline-flex rounded-full border border-cyan-100/20 bg-cyan-100/8 px-4 py-2 text-[0.64rem] font-black uppercase tracking-[0.32em] text-cyan-100/76 backdrop-blur-xl">
            Emotional weather map
          </p>
          <h1 className="mt-6 text-5xl font-black leading-[0.88] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
            Places become patterns.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            This public demo connects sample places, routines, memory weather, relationship fields, and recovery signals as a visual preview.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ground" className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-[0_18px_60px_rgba(125,211,252,0.20)] hover:bg-cyan-50">
              Return to Ground
            </Link>
            <Link href="/life-map" className="rounded-full border border-white/15 bg-white/[0.07] px-5 py-3 text-sm font-bold text-white backdrop-blur-xl hover:bg-white/[0.12]">
              Open Life Map
            </Link>
          </div>
        </div>

        <div className="relative grid gap-3 rounded-[2.8rem] border border-cyan-100/16 bg-slate-950/46 p-5 shadow-[0_30px_130px_rgba(8,47,73,0.34)] backdrop-blur-2xl sm:grid-cols-2">
          {cards.map(([name, signal, note]) => (
            <article key={name} className="rounded-3xl border border-white/10 bg-black/42 p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl">
              <span className="mb-3 block h-3 w-3 rounded-full bg-cyan-100 shadow-[0_0_22px_rgba(186,230,253,0.85)]" />
              <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-cyan-100/56">{signal}</p>
              <h2 className="mt-2 text-sm font-black text-white">{name}</h2>
              <p className="mt-2 text-xs leading-5 text-white/58">{note}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
