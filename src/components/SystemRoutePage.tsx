import type { ReactNode } from "react";
import Link from "next/link";
import {
  GenesisEyebrow,
  GenesisPanel,
  GenesisShell,
  GenesisStatusChip,
  genesisQuietLinkClass,
} from "@/components/urai/GenesisVisualSystem";

export type SystemRoutePageProps = {
  title: string;
  eyebrow?: string;
  description: string;
  status?: "wired" | "guarded" | "demo";
  children?: ReactNode;
};

const statusTone = {
  wired: "safe",
  guarded: "gated",
  demo: "preview",
} as const;

const systemLinks = [
  { href: "/home", label: "Home" },
  { href: "/life-map", label: "Life Map" },
  { href: "/demo", label: "Demo" },
  { href: "/passport", label: "Passport" },
  { href: "/status", label: "Status" },
  { href: "/system", label: "System" },
  { href: "/support", label: "Support" },
] as const;

export default function SystemRoutePage({
  title,
  eyebrow = "URAI System of Systems",
  description,
  status = "wired",
  children,
}: SystemRoutePageProps) {
  return (
    <GenesisShell activeHref="/system" footerNote="URAI system route - release truth is evidence-bound, public-safe, and conservative by default.">
      <GenesisPanel className="relative min-h-[68vh] overflow-hidden rounded-[2.75rem]">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_24%_12%,rgba(255,255,255,0.08),transparent_14rem),radial-gradient(circle_at_78%_30%,rgba(56,189,248,0.12),transparent_20rem),linear-gradient(125deg,rgba(20,184,166,0.08),transparent_54%)]" />
        <div className="relative z-10 max-w-4xl">
          <GenesisEyebrow>{eyebrow}</GenesisEyebrow>
          <h1 className="mt-6 text-[clamp(3rem,7vw,6.25rem)] font-semibold leading-[0.88] tracking-[-0.075em] text-white">{title}</h1>
          <p className="mt-6 max-w-3xl text-[clamp(1.06rem,2vw,1.42rem)] leading-[1.3] tracking-[-0.035em] text-cyan-50/82">{description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <GenesisStatusChip tone={statusTone[status]}>{status}</GenesisStatusChip>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white/52">
              No live claim without proof
            </span>
          </div>
        </div>
        {children ? <div className="relative z-10 mt-8">{children}</div> : null}
      </GenesisPanel>

      <GenesisPanel className="rounded-[2rem]" labelledBy="system-route-nav-title">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <GenesisEyebrow>Connected routes</GenesisEyebrow>
            <h2 id="system-route-nav-title" className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-none tracking-[-0.06em] text-white">
              Stay inside the same launch surface.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-white/58">
            These links intentionally point to public-safe routes. Private app and admin surfaces stay behind their own gates.
          </p>
        </div>
        <nav className="mt-7 flex flex-wrap gap-3" aria-label="System route navigation">
          {systemLinks.map((link) => (
            <Link key={link.href} href={link.href} className={genesisQuietLinkClass}>
              {link.label}
            </Link>
          ))}
        </nav>
      </GenesisPanel>
    </GenesisShell>
  );
}