import Link from "next/link";

export const metadata = {
  title: "URAI Passport",
  description:
    "URAI Passport is the launch-safe identity, consent, provenance, and ownership vault for the public demo surface.",
};

const navItems = [
  ["Home", "/home"],
  ["Ground", "/ground"],
  ["Life Map", "/life-map"],
  ["Focus", "/focus"],
  ["Replay", "/replay"],
  ["Mirror", "/mirror"],
  ["Privacy", "/privacy-controls"],
  ["Status", "/status"],
] as const;

const passportSections = [
  {
    label: "Identity",
    title: "Owner-bound world record",
    body: "The public Passport shows the shape of an owner record without opening private account data. Identity, display state, and world access stay explicitly owned.",
  },
  {
    label: "Consent",
    title: "Permission before expansion",
    body: "Stars, replay, reflection, location, media, and assistant actions are framed as review-gated surfaces until the owner approves access.",
  },
  {
    label: "Provenance",
    title: "Every surface explains itself",
    body: "URAI should be able to show why something appears, what source it came from, and what can be exported, corrected, paused, or deleted.",
  },
  {
    label: "Portability",
    title: "Export and deletion are core",
    body: "The Passport is the control plane for export, retention, deletion, replay derivatives, and future account-level data boundaries.",
  },
] as const;

const permissionRows = [
  ["Memory stars", "Preview only", "Sample public data"],
  ["Replay media", "Closed", "No private generated media"],
  ["Location context", "Gated", "Emotional-weather map preview only"],
  ["Health / body signals", "Closed", "Guidance copy only, never diagnosis"],
  ["Assistant actions", "Approval required", "No autonomous outbound action"],
  ["Exports", "Review required", "Owner action before release"],
] as const;

export default function PassportPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02040d] text-white selection:bg-cyan-100/25">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(125,211,252,0.18),transparent_24%),radial-gradient(circle_at_18%_68%,rgba(45,212,191,0.13),transparent_30%),radial-gradient(circle_at_84%_44%,rgba(251,191,36,0.12),transparent_30%),linear-gradient(180deg,#02040d_0%,#06111f_48%,#030712_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[38%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/10 bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.52),rgba(186,230,253,0.24)_18%,rgba(14,116,144,0.10)_50%,transparent_70%)] shadow-[0_0_170px_rgba(125,211,252,0.22)]" />

      <header className="relative z-20 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 md:px-8">
        <Link href="/home" className="rounded-full border border-cyan-100/18 bg-black/34 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.26em] text-cyan-50/78 backdrop-blur-xl hover:text-white">
          URAI Passport
        </Link>
        <nav className="flex flex-wrap justify-end gap-2" aria-label="Passport navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full border border-white/10 bg-black/28 px-3 py-2 text-[0.64rem] font-black uppercase tracking-[0.16em] text-white/58 backdrop-blur-xl transition hover:border-cyan-100/30 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-5 pb-10 md:grid-cols-[0.92fr_1.08fr] md:px-8">
        <div>
          <p className="inline-flex rounded-full border border-cyan-100/20 bg-cyan-100/8 px-4 py-2 text-[0.64rem] font-black uppercase tracking-[0.32em] text-cyan-100/76 backdrop-blur-xl">
            Ownership vault
          </p>
          <h1 className="mt-6 text-5xl font-black leading-[0.88] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
            Your world needs a visible owner.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Passport is URAI&apos;s identity, consent, provenance, and control layer. It makes ownership feel premium instead of admin-like, and it keeps the public demo honest about what is open versus gated.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/privacy-controls" className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-[0_18px_60px_rgba(125,211,252,0.20)] hover:bg-cyan-50">
              Open controls
            </Link>
            <Link href="/life-map" className="rounded-full border border-white/15 bg-white/[0.07] px-5 py-3 text-sm font-bold text-white backdrop-blur-xl hover:bg-white/[0.12]">
              Back to Life Map
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative min-h-[36rem] overflow-hidden rounded-[2.8rem] border border-cyan-100/16 bg-slate-950/52 p-6 shadow-[0_30px_130px_rgba(8,47,73,0.34)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(186,230,253,0.20),transparent_26%),radial-gradient(circle_at_70%_70%,rgba(251,191,36,0.14),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.18),rgba(2,6,23,0.92))]" />
            <div className="absolute left-1/2 top-[38%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/10" />
            <div className="absolute left-1/2 top-[38%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
            <div className="absolute left-1/2 top-[34%] grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-100/18 bg-[radial-gradient(circle_at_34%_24%,#fff,rgba(186,230,253,0.9)_18%,rgba(14,116,144,0.70)_48%,rgba(2,6,23,0.92)_78%)] text-xs font-black uppercase tracking-[0.18em] text-slate-950 shadow-[0_0_140px_rgba(125,211,252,0.48)]">
              Owner
            </div>

            <div className="relative z-10 mt-60 rounded-[2rem] border border-white/10 bg-black/42 p-5 backdrop-blur-2xl">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.28em] text-cyan-100/56">Passport state</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-white">Private by default</h2>
              <p className="mt-3 text-sm leading-6 text-white/64">
                This public page shows the control architecture, not a live private identity record. Every deeper surface remains consent-gated until proof exists.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {[["Owner", "Visible"], ["Consent", "Required"], ["Private data", "Closed"]].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                    <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-white/38">{label}</p>
                    <p className="mt-1 text-xs font-bold text-white/74">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-4 px-5 pb-10 md:grid-cols-4 md:px-8">
        {passportSections.map((section) => (
          <article key={section.label} className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl">
            <p className="text-[0.62rem] font-black uppercase tracking-[0.24em] text-cyan-100/56">{section.label}</p>
            <h2 className="mt-3 text-lg font-black tracking-[-0.04em] text-white">{section.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">{section.body}</p>
          </article>
        ))}
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-14 md:px-8">
        <div className="rounded-[2rem] border border-cyan-100/14 bg-cyan-100/[0.045] p-5 backdrop-blur-2xl">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.30em] text-cyan-100/62">Permission constellation</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">What is open, gated, or closed.</h2>
            </div>
            <Link href="/status" className="text-sm font-bold text-cyan-100 underline underline-offset-4 hover:text-white">View status truth</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {permissionRows.map(([surface, state, note]) => (
              <article key={surface} className="rounded-2xl border border-white/10 bg-black/24 p-4">
                <p className="text-sm font-black text-white">{surface}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100/58">{state}</p>
                <p className="mt-2 text-xs leading-5 text-white/56">{note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
