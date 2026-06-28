import Link from "next/link";

export const metadata = {
  title: "URAI Privacy Controls",
  description:
    "Launch-safe URAI controls for identity, memory access, replay, location, exports, and provenance.",
};

const controls = [
  ["Identity stays owned", "Your world has a visible owner and clear permission boundaries before any deeper surface opens."],
  ["Memory access is gated", "Private detail remains closed until a route makes access intentional and reviewable."],
  ["Replay stays reviewable", "Generated media, private people, and life-movie outputs remain closed on the public surface."],
  ["Location is contextual", "The Location Map shows emotional-weather patterns only, not live tracking or precise location disclosure."],
  ["Provenance stays attached", "Every star, replay, reflection, and artifact should explain why it appears and where it came from."],
  ["Export and delete are core", "Owner-controlled export, correction, deletion, and retention are Passport-level requirements."],
] as const;

const navItems = [
  ["Home", "/home"],
  ["Ground", "/ground"],
  ["Life Map", "/life-map"],
  ["Replay", "/replay"],
  ["Passport", "/passport"],
  ["Location", "/location-map"],
  ["Status", "/status"],
] as const;

export default function PrivacyControlsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02040d] text-white selection:bg-cyan-100/25">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(125,211,252,0.20),transparent_26%),radial-gradient(circle_at_20%_72%,rgba(45,212,191,0.14),transparent_30%),radial-gradient(circle_at_82%_50%,rgba(251,191,36,0.12),transparent_30%),linear-gradient(180deg,#02040d_0%,#06111f_48%,#030712_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[42%] h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/10 bg-[radial-gradient(circle_at_50%_40%,rgba(186,230,253,0.22),transparent_58%)] shadow-[0_0_170px_rgba(125,211,252,0.18)]" />

      <header className="relative z-20 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 md:px-8">
        <Link href="/passport" className="rounded-full border border-cyan-100/18 bg-black/34 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.26em] text-cyan-50/78 backdrop-blur-xl hover:text-white">
          URAI Passport Controls
        </Link>
        <nav className="flex flex-wrap justify-end gap-2" aria-label="Privacy navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full border border-white/10 bg-black/28 px-3 py-2 text-[0.64rem] font-black uppercase tracking-[0.16em] text-white/58 backdrop-blur-xl transition hover:border-cyan-100/30 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-5 pb-10 md:grid-cols-[0.95fr_1.05fr] md:px-8">
        <div>
          <p className="inline-flex rounded-full border border-cyan-100/20 bg-cyan-100/8 px-4 py-2 text-[0.64rem] font-black uppercase tracking-[0.32em] text-cyan-100/76 backdrop-blur-xl">
            Consent surface
          </p>
          <h1 className="mt-6 text-5xl font-black leading-[0.88] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
            Choose what the world can hold.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Privacy is part of the world surface. Identity, consent, provenance, and memory access stay visible before a star, replay, reflection, or location layer expands.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/passport" className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-[0_18px_60px_rgba(125,211,252,0.20)] hover:bg-cyan-50">
              Open Passport
            </Link>
            <Link href="/life-map" className="rounded-full border border-white/15 bg-white/[0.07] px-5 py-3 text-sm font-bold text-white backdrop-blur-xl hover:bg-white/[0.12]">
              Return to Life Map
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {controls.map(([title, body], index) => (
            <article key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-cyan-100/20 bg-cyan-100/10 text-xs font-black text-cyan-50">
                0{index + 1}
              </span>
              <h2 className="mt-4 text-lg font-black tracking-[-0.04em] text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-14 md:px-8">
        <div className="rounded-[1.6rem] border border-amber-100/18 bg-amber-100/[0.06] p-4 text-sm leading-6 text-amber-50/76 backdrop-blur-xl">
          <strong className="text-amber-50">Launch safety:</strong> These controls are public-route proof and product shape. They do not expose live private account data, live sensing, or autonomous action.
        </div>
      </section>
    </main>
  );
}
