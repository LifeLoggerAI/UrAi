"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const genesisFocusClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200";

export const genesisPanelClass =
  "border border-white/10 bg-slate-950/60 shadow-2xl shadow-black/35 backdrop-blur-2xl";

export const genesisQuietLinkClass =
  `inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.055] px-4 text-sm font-bold text-white/74 transition hover:-translate-y-0.5 hover:border-cyan-200/36 hover:bg-white/10 hover:text-white active:translate-y-0 ${genesisFocusClass}`;

export const genesisPublicNavItems = [
  { href: "/home", label: "Home" },
  { href: "/launch", label: "Launch" },
  { href: "/demo", label: "Demo" },
  { href: "/waitlist", label: "Waitlist" },
  { href: "/passport", label: "Passport" },
  { href: "/status", label: "Status" },
  { href: "/support", label: "Support" },
] as const;

type GenesisPublicNavProps = {
  activeHref?: string;
  label?: string;
  items?: ReadonlyArray<{ href: string; label: string }>;
};

type GenesisShellProps = {
  children: ReactNode;
  activeHref?: string;
  navLabel?: string;
  className?: string;
  maxWidthClassName?: string;
  footerNote?: string;
};

type GenesisPanelProps = {
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "aside" | "div";
  labelledBy?: string;
};

type GenesisCtaLinkProps = {
  href: string;
  children: ReactNode;
  tone?: "primary" | "secondary" | "trust" | "warning";
  className?: string;
};

export function GenesisAtmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.74)_0_1px,transparent_2px),radial-gradient(circle_at_29%_48%,rgba(125,211,252,0.52)_0_1px,transparent_2px),radial-gradient(circle_at_58%_22%,rgba(153,246,228,0.48)_0_1px,transparent_2px),radial-gradient(circle_at_82%_63%,rgba(216,180,254,0.46)_0_1px,transparent_2px)]" />
      <div className="absolute left-1/2 top-[28%] h-[46rem] w-[46rem] -translate-x-1/2 rounded-full border border-cyan-100/10 shadow-[0_0_135px_rgba(45,212,191,0.15)]" />
      <div className="absolute inset-x-[-16%] top-[46%] h-40 rounded-[50%] border-t border-cyan-100/14 bg-[radial-gradient(ellipse_at_50%_0%,rgba(125,211,252,0.15),transparent_60%)]" />
      <div className="absolute inset-x-[-18%] bottom-[-14rem] h-[34rem] rounded-[50%] border-t border-emerald-100/12 bg-[radial-gradient(ellipse_at_50%_0%,rgba(20,184,166,0.16),transparent_58%),linear-gradient(180deg,rgba(6,78,59,0.04),rgba(0,0,0,0.86))]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/86" />
    </div>
  );
}

export function GenesisPublicNav({
  activeHref,
  label = "URAI",
  items = genesisPublicNavItems,
}: GenesisPublicNavProps) {
  const pathname = usePathname();
  const active = activeHref ?? pathname;

  return (
    <nav className={`${genesisPanelClass} flex flex-wrap items-center justify-between gap-3 rounded-full px-4 py-3`} aria-label="URAI public navigation">
      <Link href="/home" className={`inline-flex min-h-11 items-center gap-3 rounded-full font-extrabold tracking-[0.16em] text-white ${genesisFocusClass}`} aria-label="URAI Genesis home">
        <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan-100/25 bg-cyan-100/10 text-xs text-cyan-50 shadow-[0_0_28px_rgba(103,232,249,0.34)]" aria-hidden="true">
          U
        </span>
        <span className="hidden sm:inline">{label}</span>
      </Link>
      <div className="flex flex-wrap justify-end gap-2">
        {items.map((item) => {
          const isActive = active === item.href || (item.href !== "/" && active?.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-bold transition ${genesisFocusClass} ${
                isActive
                  ? "border-cyan-200/44 bg-cyan-200/[0.13] text-cyan-50 shadow-[0_0_28px_rgba(103,232,249,0.12)]"
                  : "border-white/10 bg-white/[0.055] text-white/72 hover:border-cyan-200/36 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function GenesisShell({
  children,
  activeHref,
  navLabel = "URAI",
  className = "",
  maxWidthClassName = "w-[min(1240px,100%)]",
  footerNote = "URAI Genesis public surface - sample-safe, consent-first, and evidence-gated.",
}: GenesisShellProps) {
  return (
    <main className={`relative min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_18%_8%,rgba(56,189,248,0.22),transparent_30rem),radial-gradient(circle_at_82%_16%,rgba(45,212,191,0.16),transparent_30rem),radial-gradient(circle_at_50%_78%,rgba(245,158,11,0.1),transparent_34rem),linear-gradient(145deg,#020617_0%,#08111f_46%,#02030a_100%)] px-4 py-5 text-white sm:px-6 lg:px-8 ${className}`}>
      <GenesisAtmosphere />
      <div className={`relative z-10 mx-auto flex min-h-[calc(100vh-2.5rem)] ${maxWidthClassName} flex-col pb-16`}>
        <GenesisPublicNav activeHref={activeHref} label={navLabel} />
        <div className="mt-4 flex flex-1 flex-col gap-4">{children}</div>
        <GenesisFooter note={footerNote} />
      </div>
    </main>
  );
}

export function GenesisPanel({
  children,
  className = "",
  as = "section",
  labelledBy,
}: GenesisPanelProps) {
  const Component = as;
  return (
    <Component className={`${genesisPanelClass} rounded-[2.25rem] p-5 sm:p-8 ${className}`} aria-labelledby={labelledBy}>
      {children}
    </Component>
  );
}

export function GenesisEyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`inline-flex w-fit rounded-full border border-cyan-100/25 bg-cyan-100/10 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-cyan-100 ${className}`}>
      {children}
    </p>
  );
}

export function GenesisStatusChip({ children, tone = "preview" }: { children: ReactNode; tone?: "live" | "preview" | "gated" | "blocked" | "safe" }) {
  const toneClass = {
    live: "border-emerald-200/24 bg-emerald-200/[0.08] text-emerald-50",
    preview: "border-cyan-200/24 bg-cyan-200/[0.08] text-cyan-50",
    gated: "border-amber-200/24 bg-amber-200/[0.08] text-amber-50",
    blocked: "border-rose-200/24 bg-rose-200/[0.08] text-rose-50",
    safe: "border-teal-200/24 bg-teal-200/[0.08] text-teal-50",
  }[tone];

  return (
    <span className={`inline-flex min-h-8 items-center rounded-full border px-3 text-[0.66rem] font-black uppercase tracking-[0.12em] ${toneClass}`}>
      {children}
    </span>
  );
}

export function GenesisCtaLink({ href, children, tone = "secondary", className = "" }: GenesisCtaLinkProps) {
  const toneClass = {
    primary:
      "border-cyan-100/50 bg-gradient-to-br from-cyan-100 via-teal-200 to-emerald-200 text-slate-950 shadow-[0_20px_54px_rgba(45,212,191,0.24)]",
    secondary:
      "border-white/12 bg-white/[0.075] text-white/82 hover:border-cyan-200/40 hover:bg-white/12 hover:text-white",
    trust:
      "border-emerald-200/24 bg-emerald-200/[0.08] text-emerald-50 hover:bg-emerald-200/[0.12]",
    warning:
      "border-amber-200/24 bg-amber-200/[0.08] text-amber-50 hover:bg-amber-200/[0.12]",
  }[tone];

  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-full border px-6 text-sm font-black transition hover:-translate-y-0.5 active:translate-y-0 ${genesisFocusClass} ${toneClass} ${className}`}
    >
      {children}
    </Link>
  );
}

export function GenesisTrustCallout({ children, tone = "safe" }: { children: ReactNode; tone?: "safe" | "warning" | "neutral" }) {
  const toneClass = {
    safe: "border-emerald-200/18 bg-emerald-200/[0.065] text-emerald-50/82",
    warning: "border-amber-200/18 bg-amber-200/[0.07] text-amber-50/82",
    neutral: "border-cyan-200/14 bg-cyan-200/[0.055] text-white/72",
  }[tone];

  return <p className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${toneClass}`}>{children}</p>;
}

export function GenesisFooter({ note }: { note: string }) {
  const footerLinks = [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/support", label: "Support" },
    { href: "/status", label: "Status" },
  ] as const;

  return (
    <footer className={`${genesisPanelClass} mt-4 grid items-center gap-4 rounded-[2rem] p-5 text-sm text-white/62 sm:p-7 lg:grid-cols-[1fr_auto]`}>
      <p>{note}</p>
      <div className="flex flex-wrap gap-2">
        {footerLinks.map((link) => (
          <Link key={link.href} href={link.href} className={genesisQuietLinkClass}>
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
