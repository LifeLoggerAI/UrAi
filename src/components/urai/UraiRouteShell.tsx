import {
  GenesisCtaLink,
  GenesisEyebrow,
  GenesisPanel,
  GenesisShell,
  GenesisStatusChip,
  GenesisTrustCallout,
} from "@/components/urai/GenesisVisualSystem";

type UraiRouteShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  sections?: Array<{ title: string; body: string }>;
};

export default function UraiRouteShell({
  eyebrow,
  title,
  description,
  primaryHref = "/home",
  primaryLabel = "Return Home",
  secondaryHref = "/privacy",
  secondaryLabel = "Privacy Center",
  sections = [],
}: UraiRouteShellProps) {
  return (
    <GenesisShell activeHref={primaryHref === "/" ? "/home" : primaryHref} footerNote="URAI Genesis route shell - public-safe, consent-first, and evidence-gated.">
      <GenesisPanel className="relative grid min-h-[72vh] overflow-hidden rounded-[2.75rem] lg:grid-cols-[1fr_0.72fr]">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(255,255,255,0.08),transparent_14rem),radial-gradient(circle_at_78%_42%,rgba(45,212,191,0.12),transparent_20rem),linear-gradient(120deg,rgba(14,165,233,0.1),transparent_52%)]" />
        <div className="relative z-10 flex flex-col justify-center py-4">
          <GenesisEyebrow>{eyebrow}</GenesisEyebrow>
          <h1 className="mt-6 max-w-4xl text-[clamp(3.1rem,7vw,6.35rem)] font-semibold leading-[0.88] tracking-[-0.075em] text-white">{title}</h1>
          <p className="mt-6 max-w-3xl text-[clamp(1.08rem,2.1vw,1.42rem)] leading-[1.28] tracking-[-0.035em] text-cyan-50/82">{description}</p>
          <div className="mt-5 max-w-2xl">
            <GenesisTrustCallout>
              Public routes use sample-safe preview states. Private systems stay closed until consent, evidence, export, delete, rollback, and smoke gates pass.
            </GenesisTrustCallout>
          </div>

          <div className="mt-8 flex flex-wrap gap-3" aria-label="Route actions">
            <GenesisCtaLink tone="primary" href={primaryHref}>
              {primaryLabel}
            </GenesisCtaLink>
            <GenesisCtaLink href={secondaryHref}>
              {secondaryLabel}
            </GenesisCtaLink>
          </div>
        </div>

        <aside className="relative z-10 mt-8 min-h-[360px] overflow-hidden rounded-[2rem] border border-cyan-100/15 bg-[radial-gradient(circle_at_50%_28%,rgba(125,211,252,0.22),transparent_12rem),radial-gradient(circle_at_50%_72%,rgba(20,184,166,0.16),transparent_18rem),linear-gradient(180deg,rgba(15,23,42,0.38),rgba(2,6,23,0.92))] p-5 lg:mt-0">
          <div aria-hidden="true" className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_18%_20%,rgba(248,250,252,0.78)_0_1px,transparent_2px),radial-gradient(circle_at_72%_24%,rgba(125,211,252,0.68)_0_1px,transparent_2px),radial-gradient(circle_at_44%_42%,rgba(153,246,228,0.56)_0_1px,transparent_2px),radial-gradient(circle_at_82%_58%,rgba(248,250,252,0.52)_0_1px,transparent_2px)]" />
          <div aria-hidden="true" className="absolute left-1/2 top-[42%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/14 shadow-[0_0_70px_rgba(45,212,191,0.2)]" />
          <div aria-hidden="true" className="absolute left-1/2 top-[42%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff_0_8%,#67e8f9_22%,rgba(20,184,166,0.2)_62%,transparent_74%)] drop-shadow-[0_0_48px_rgba(103,232,249,0.72)] motion-safe:animate-pulse" />
          <div className="absolute bottom-5 left-5 right-5 rounded-[1.45rem] border border-white/12 bg-slate-950/72 p-5 backdrop-blur-xl">
            <GenesisStatusChip tone="preview">Genesis route</GenesisStatusChip>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.045em] text-white">One visual system, one truth boundary.</h2>
            <p className="mt-3 text-sm leading-6 text-white/62">This route is part of the same cinematic public surface. It does not unlock private memory, sensing, provider, or generated-media systems.</p>
          </div>
        </aside>
      </GenesisPanel>

      {sections.length ? (
        <section className="grid gap-4 md:grid-cols-3" aria-label={`${eyebrow} route details`}>
          {sections.map((section) => (
            <article key={section.title} className="rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(45,212,191,0.1),transparent_14rem)] bg-white/[0.052] p-5 shadow-2xl shadow-black/20">
              <h2 className="text-xl font-semibold tracking-[-0.04em] text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/64">{section.body}</p>
            </article>
          ))}
        </section>
      ) : null}
    </GenesisShell>
  );
}