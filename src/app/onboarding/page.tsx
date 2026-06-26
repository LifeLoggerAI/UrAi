import Link from "next/link";

const onboardingSteps = [
  {
    label: "01",
    title: "Set your privacy baseline",
    body: "Start with consent-first controls before URAI stores or reflects anything personal.",
    href: "/settings/privacy",
    action: "Review privacy",
  },
  {
    label: "02",
    title: "Open your passport",
    body: "Your passport is the place for identity, consent, export, and data ownership boundaries.",
    href: "/passport",
    action: "Open passport",
  },
  {
    label: "03",
    title: "Enter the URAI home",
    body: "Move into the launch experience with safe empty states until real user data exists.",
    href: "/home",
    action: "Continue home",
  },
];

export default function OnboardingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b10] text-white">
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-8 lg:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(76,175,240,0.24),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(90,210,166,0.18),transparent_30%),linear-gradient(150deg,#080b10_0%,#101923_48%,#050608_100%)]" />
        <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

        <nav className="flex items-center justify-between text-sm text-white/70">
          <Link href="/" className="inline-flex min-h-9 items-center rounded-full font-semibold uppercase tracking-[0.35em] text-white">
            URAI
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="inline-flex min-h-9 items-center rounded-full transition hover:text-white">
              Privacy
            </Link>
            <Link href="/system" className="inline-flex min-h-9 items-center rounded-full transition hover:text-white">
              System status
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-cyan-100">
              Launch onboarding
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Begin with consent, then build the life map.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              URAI starts from a simple rule: private life data should stay under user control. This launch path brings people into the app while unfinished sensing, generated media, and automation systems stay clearly gated.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/home"
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-[#081018] shadow-[0_18px_60px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-100"
              >
                Continue to URAI home
              </Link>
              <Link
                href="/passport"
                className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/10"
              >
                Review passport first
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/80">
                Safe start sequence
              </p>
              <div className="mt-5 space-y-4">
                {onboardingSteps.map((step) => (
                  <Link
                    key={step.label}
                    href={step.href}
                    className="group block rounded-3xl border border-white/10 bg-white/[0.06] p-5 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/[0.1]"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-200/15 text-sm font-semibold text-cyan-100">
                        {step.label}
                      </span>
                      <div>
                        <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
                          {step.title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-white/68">{step.body}</p>
                        <p className="mt-4 text-sm font-semibold text-cyan-100 transition group-hover:text-white">
                          {step.action}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-4 rounded-3xl border border-amber-200/20 bg-amber-200/10 p-4 text-sm leading-6 text-amber-50/82">
              Launch note: passive sensing, broad communications, data monetization, and clinical/therapy claims stay gated until privacy, export, delete, audit, and live evidence requirements are satisfied.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
