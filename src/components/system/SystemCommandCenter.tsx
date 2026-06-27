"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LaunchMode, StagingEvidenceState, SystemRegistry, SystemRepo } from "@/lib/system-registry";

type RepoView = SystemRepo & { stagingEvidenceState: StagingEvidenceState; stagingEvidenceNotes: string[] };
type SectionView = { id: string; title: string; description: string; repos: RepoView[] };
type Props = { registry: SystemRegistry; registryValid: boolean; sections: SectionView[] };
type StatusFilter = "all" | "production-eligible" | "blocked" | "demo-safe" | "roadmap-only" | "evidence-missing" | "staging-only" | "not-checked";

const filters: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "production-eligible", label: "Production eligible" },
  { id: "blocked", label: "Blocked" },
  { id: "demo-safe", label: "Demo safe" },
  { id: "roadmap-only", label: "Roadmap only" },
  { id: "evidence-missing", label: "Evidence missing" },
  { id: "staging-only", label: "Staging only" },
  { id: "not-checked", label: "Not checked" },
];

const legend = [
  ["Production eligible", "Only when launchMode is production, canClaimProduction is true, and evidence gates are present."],
  ["Blocked", "A blocker or blocked launch mode is recorded. Do not market it as live."],
  ["Demo safe", "Usable in the Genesis demo without production readiness claims."],
  ["Roadmap only", "Future, scaffold, or preview-only. Keep it gated or not live."],
  ["Evidence missing", "Deploy, smoke, rollback, monitoring, privacy, DNS/SSL, or legal proof is absent."],
  ["Staging only", "Valid as a proving ground only, not production truth."],
  ["Sandbox only", "Development-only. Useful work must be ported into canonical first."],
  ["Legacy archive", "Historical source only. It is not release authority."],
] as const;

const modeLabel: Record<LaunchMode, string> = {
  production: "Production",
  "public-demo": "Public demo",
  "staging-only": "Staging only",
  "demo-only": "Demo only",
  "roadmap-only": "Roadmap only",
  blocked: "Blocked",
  "legacy-archive": "Legacy archive",
  "sandbox-only": "Sandbox only",
};

function privacyGate(repo: RepoView) { return repo.name === "LifeLoggerAI/urai-privacy" || repo.dependsOn.includes("LifeLoggerAI/urai-privacy"); }
function productionEligible(repo: RepoView) { return repo.productionLock.launchMode === "production" && repo.canClaimProduction && repo.productionLock.eligibleForLaunch; }
function blocked(repo: RepoView) { return repo.classification === "blocked" || repo.status.toLowerCase().includes("blocked") || repo.productionLock.launchMode === "blocked" || repo.productionLock.blockingReasons.length > 0; }
function roadmap(repo: RepoView) { return repo.productionLock.launchMode === "roadmap-only" || (!repo.canUseInV1 && !repo.canClaimProduction && repo.productionLock.launchMode !== "legacy-archive" && repo.productionLock.launchMode !== "sandbox-only"); }
function evidenceMissing(repo: RepoView) { const lock = repo.productionLock; return repo.evidenceRequired.length > 0 || !lock.deployEvidence || !lock.rollbackEvidence || !lock.monitoringEvidence || (privacyGate(repo) && !lock.privacyGateEvidence); }
function yesNo(value: boolean) { return value ? "yes" : "no"; }
function proofText(value: string | null | boolean) { if (typeof value === "boolean") return yesNo(value); return value?.trim() ? value : "not recorded"; }
function proofStatus(value: string | null | boolean) { return typeof value === "boolean" ? (value ? "verified" : "missing") : value ? "recorded" : "missing"; }
function proofTone(value: string | null | boolean) { const present = typeof value === "boolean" ? value : Boolean(value); return present ? "text-cyan-100" : "text-amber-100"; }

function tone(label: string) {
  if (/production eligible/i.test(label)) return "border-lime-200/35 bg-lime-200/[0.12] text-lime-50";
  if (/blocked/i.test(label)) return "border-rose-200/35 bg-rose-200/[0.12] text-rose-50";
  if (/evidence/i.test(label)) return "border-amber-200/35 bg-amber-200/[0.12] text-amber-50";
  if (/canonical|privacy|demo/i.test(label)) return "border-cyan-200/30 bg-cyan-200/[0.11] text-cyan-50";
  if (/staging/i.test(label)) return "border-sky-200/30 bg-sky-200/[0.1] text-sky-50";
  return "border-white/15 bg-white/[0.06] text-white/70";
}

function tags(repo: RepoView) {
  const output: string[] = [];
  if (repo.classification === "canonical-product") output.push("Canonical");
  if (repo.classification === "staging") output.push("Staging");
  if (repo.name === "LifeLoggerAI/urai-privacy") output.push("Privacy gate");
  if (repo.classification === "sandbox") output.push("Sandbox only");
  if (repo.classification === "legacy-archive") output.push("Legacy archive");
  if (blocked(repo)) output.push("Blocked");
  if (repo.canUseInV1 && !repo.canClaimProduction) output.push("Demo safe");
  if (roadmap(repo)) output.push("Roadmap only");
  if (productionEligible(repo)) output.push("Production eligible");
  if (evidenceMissing(repo)) output.push("Evidence missing");
  return Array.from(new Set(output));
}

function matches(repo: RepoView, query: string, filter: StatusFilter) {
  const q = query.trim().toLowerCase();
  const haystack = [repo.name, repo.role, repo.status, repo.classification, repo.productionLock.launchMode, ...repo.notes, ...repo.evidenceRequired, ...repo.dependsOn].join(" ").toLowerCase();
  const queryOk = !q || haystack.includes(q);
  const filterOk = filter === "all" ||
    (filter === "production-eligible" && productionEligible(repo)) ||
    (filter === "blocked" && blocked(repo)) ||
    (filter === "demo-safe" && repo.canUseInV1 && !repo.canClaimProduction) ||
    (filter === "roadmap-only" && roadmap(repo)) ||
    (filter === "evidence-missing" && evidenceMissing(repo)) ||
    (filter === "staging-only" && repo.productionLock.launchMode === "staging-only") ||
    (filter === "not-checked" && repo.stagingEvidenceState === "not_checked" && !repo.productionLock.smokeEvidence);
  return queryOk && filterOk;
}

function Metric({ label, value, detail, toneClass = "from-cyan-300/14" }: { label: string; value: number | string; detail: string; toneClass?: string }) {
  return <article className={`rounded-[1.35rem] border border-white/10 bg-gradient-to-br ${toneClass} to-white/[0.045] p-4 shadow-2xl shadow-black/20`}><p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-white/48">{label}</p><strong className="mt-3 block text-[clamp(1.8rem,3vw,2.55rem)] font-semibold leading-none tracking-[-0.055em] text-white">{value}</strong><p className="mt-2 text-sm leading-5 text-white/58">{detail}</p></article>;
}

function Signal({ label, value }: { label: string; value: string | null | boolean }) {
  return <div className="rounded-2xl border border-white/10 bg-black/22 p-3"><div className="flex items-center justify-between gap-3"><span className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-white/44">{label}</span><span className={`text-xs font-black uppercase tracking-[0.12em] ${proofTone(value)}`}>{proofStatus(value)}</span></div><p className="mt-2 break-words text-xs leading-5 text-white/62">{proofText(value)}</p></div>;
}

function TextList({ title, values, empty }: { title: string; values: string[]; empty: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><h4 className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-white/44">{title}</h4>{values.length ? <ul className="mt-3 space-y-2 text-sm leading-6 text-white/66">{values.map((value) => <li key={value} className="break-words">{value}</li>)}</ul> : <p className="mt-3 text-sm text-white/38">{empty}</p>}</div>;
}

function RegistryCard({ repo, expanded, onToggle }: { repo: RepoView; expanded: boolean; onToggle: () => void }) {
  const lock = repo.productionLock;
  const blockers = lock.blockingReasons;
  return <article className="rounded-[1.65rem] border border-white/10 bg-[radial-gradient(circle_at_0_0,rgba(45,212,191,0.1),transparent_16rem)] bg-slate-950/66 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><p className="break-words text-lg font-semibold tracking-[-0.03em] text-white">{repo.name}</p><p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">{repo.role}</p></div><div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end"><span className={`rounded-full border px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.12em] ${tone(lock.launchMode)}`}>{modeLabel[lock.launchMode]}</span>{tags(repo).slice(0, 4).map((tag) => <span key={tag} className={`rounded-full border px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.12em] ${tone(tag)}`}>{tag}</span>)}</div></div>
    <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm leading-6 text-white/74">{repo.status}</p>
    <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4"><Signal label="Eligible" value={lock.eligibleForLaunch} /><Signal label="DNS" value={lock.dnsVerified} /><Signal label="SSL" value={lock.sslVerified} /><Signal label="Smoke" value={lock.smokeEvidence} /><Signal label="Production URL" value={lock.productionUrl} /><Signal label="Rollback" value={lock.rollbackEvidence} /><Signal label="Monitoring" value={lock.monitoringEvidence} /><Signal label="Privacy gate" value={lock.privacyGateEvidence || (privacyGate(repo) ? null : "not required by registry dependency")} /></div>
    <div className={blockers.length ? "mt-4 rounded-2xl border border-rose-200/24 bg-rose-200/[0.08] p-4" : "mt-4 rounded-2xl border border-emerald-200/20 bg-emerald-200/[0.07] p-4"}><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-xs font-black uppercase tracking-[0.18em] text-white/58">Launch blockers</h3><span className={blockers.length ? "text-sm font-black text-rose-50" : "text-sm font-black text-emerald-50"}>{blockers.length ? `${blockers.length} recorded` : "none recorded"}</span></div>{blockers.length ? <ul className="mt-3 space-y-2 text-sm leading-6 text-rose-50/78">{blockers.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}</ul> : <p className="mt-3 text-sm leading-6 text-emerald-50/70">No production-lock blockers are listed for this entry. This is not a production claim unless every evidence gate is present.</p>}</div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2 text-xs text-white/48"><span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1">classification: {repo.classification}</span><span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1">staging: {repo.stagingEvidenceState.replaceAll("_", " ")}</span><span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1">can use in V1: {yesNo(repo.canUseInV1)}</span></div><button type="button" onClick={onToggle} aria-expanded={expanded} className="inline-flex min-h-11 items-center rounded-full border border-cyan-200/24 bg-cyan-200/[0.08] px-4 text-sm font-black text-cyan-50 transition hover:border-cyan-100/50 hover:bg-cyan-200/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">{expanded ? "Collapse details" : "Expand evidence"}</button></div>
    {expanded ? <div className="mt-5 grid gap-4 lg:grid-cols-2"><TextList title="Evidence required" values={repo.evidenceRequired} empty="No evidence requirements listed" /><TextList title="Dependencies" values={repo.dependsOn} empty="No dependencies listed" /><TextList title="Staging evidence notes" values={repo.stagingEvidenceNotes} empty="No staging evidence notes recorded" /><TextList title="Notes" values={repo.notes} empty="No notes listed" /><TextList title="Blocks" values={repo.blocks} empty="No downstream blocks listed" /><TextList title="Custom domains" values={lock.customDomains} empty="No custom domains listed" /><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 lg:col-span-2"><h4 className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-white/44">Production lock table</h4><div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4"><Signal label="Firebase project" value={lock.firebaseProject} /><Signal label="Deploy evidence" value={lock.deployEvidence} /><Signal label="Staging URL" value={lock.stagingUrl} /><Signal label="Production claim" value={repo.canClaimProduction} /></div></div>{repo.productionEvidence ? <div className="rounded-2xl border border-amber-200/20 bg-amber-200/[0.065] p-4 lg:col-span-2"><h4 className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-amber-100/70">Historical evidence, not production lock</h4><ul className="mt-3 space-y-2 text-sm leading-6 text-amber-50/72">{repo.productionEvidence.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></div> : null}</div> : null}
  </article>;
}

export default function SystemCommandCenter({ registry, registryValid, sections }: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const allRepos = useMemo(() => sections.flatMap((section) => section.repos), [sections]);
  const repos = useMemo(() => Array.from(new Map(allRepos.map((repo) => [repo.name, repo])).values()), [allRepos]);
  const metrics = useMemo(() => ({
    total: repos.length,
    productionEligible: repos.filter(productionEligible).length,
    blocked: repos.filter(blocked).length,
    demoSafe: repos.filter((repo) => repo.canUseInV1 && !repo.canClaimProduction).length,
    evidenceMissing: repos.filter(evidenceMissing).length,
    roadmapOnly: repos.filter(roadmap).length,
    stagingOnly: repos.filter((repo) => repo.productionLock.launchMode === "staging-only").length,
  }), [repos]);

  const visibleSections = useMemo(() => sections
    .filter((section) => sectionFilter === "all" || section.id === sectionFilter)
    .map((section) => ({ ...section, repos: section.repos.filter((repo) => matches(repo, query, statusFilter)) }))
    .filter((section) => section.repos.length > 0), [query, sectionFilter, sections, statusFilter]);

  const visibleRepoCount = visibleSections.reduce((sum, section) => sum + section.repos.length, 0);
  const expandedCount = visibleSections.reduce((sum, section) => sum + section.repos.filter((repo) => expanded[repo.name]).length, 0);
  function setAllVisible(value: boolean) { setExpanded((current) => { const next = { ...current }; for (const section of visibleSections) for (const repo of section.repos) next[repo.name] = value; return next; }); }

  return <main className="relative min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_18%_8%,rgba(45,212,191,0.2),transparent_32rem),radial-gradient(circle_at_85%_10%,rgba(125,211,252,0.16),transparent_30rem),linear-gradient(145deg,#020617_0%,#06111f_48%,#02030a_100%)] px-4 py-5 text-white sm:px-6 lg:px-8">
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden"><div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] [background-size:82px_82px]" /><div className="absolute left-1/2 top-[22rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full border border-cyan-100/10 shadow-[0_0_120px_rgba(45,212,191,0.12)]" /><div className="absolute inset-x-[-14%] bottom-[-18rem] h-[36rem] rounded-[50%] border-t border-cyan-100/12 bg-[radial-gradient(ellipse_at_50%_0%,rgba(20,184,166,0.16),transparent_58%)]" /><div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/82" /></div>
    <div className="relative z-10 mx-auto w-[min(1320px,100%)] pb-16">
      <nav className="flex flex-wrap items-center justify-between gap-3 rounded-full border border-white/10 bg-slate-950/62 px-4 py-3 shadow-2xl shadow-black/35 backdrop-blur-2xl" aria-label="System command navigation"><Link href="/home" className="inline-flex min-h-11 items-center gap-3 rounded-full font-extrabold tracking-[0.16em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"><span className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_28px_rgba(103,232,249,0.86)]" aria-hidden="true" />URAI</Link><div className="flex flex-wrap justify-end gap-2">{[["Home","/home"],["Launch","/launch"],["Status","/status"],["System","/system"],["Passport","/passport"],["Waitlist","/waitlist"]].map(([label, href]) => <Link key={href} href={href} aria-current={href === "/system" ? "page" : undefined} className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 ${href === "/system" ? "border-cyan-200/35 bg-cyan-200/[0.12] text-cyan-50" : "border-white/10 bg-white/[0.055] text-white/72 hover:border-cyan-200/36 hover:bg-white/10 hover:text-white"}`}>{label}</Link>)}</div></nav>

      <section id="overview" className="relative mt-4 overflow-hidden rounded-[2.75rem] border border-white/10 bg-slate-950/62 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-8 lg:p-10" aria-labelledby="system-command-title"><div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(255,255,255,0.08),transparent_14rem),radial-gradient(circle_at_80%_42%,rgba(45,212,191,0.1),transparent_20rem),linear-gradient(120deg,rgba(14,165,233,0.1),transparent_52%)]" /><div className="relative grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-end"><div><p className="inline-flex rounded-full border border-cyan-100/25 bg-cyan-100/10 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-cyan-100">System Command Center</p><h1 id="system-command-title" className="mt-6 max-w-4xl text-[clamp(3.4rem,7.2vw,6.8rem)] font-semibold leading-[0.86] tracking-[-0.075em] text-white">URAI release truth, locked before launch.</h1><p className="mt-6 max-w-3xl text-base leading-7 text-white/70 md:text-lg">This route is backed by the canonical registry and shows launch mode, production eligibility, DNS/SSL proof, smoke evidence, rollback evidence, monitoring evidence, privacy-gate evidence, and blockers. It makes no private-data calls.</p><p className="mt-5 max-w-3xl rounded-2xl border border-cyan-100/16 bg-cyan-100/[0.065] px-4 py-3 text-sm leading-6 text-cyan-50/76">URAI does not ship by vibes. This page exists so launch claims stay pinned to proof.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/status" className="inline-flex min-h-12 items-center rounded-full border border-cyan-100/40 bg-gradient-to-br from-cyan-100 via-teal-200 to-emerald-200 px-6 text-sm font-black text-slate-950 shadow-[0_20px_54px_rgba(45,212,191,0.24)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Open lightweight status</Link><a href="#registry" className="inline-flex min-h-12 items-center rounded-full border border-white/12 bg-white/[0.075] px-6 text-sm font-bold text-white/82 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Inspect registry</a></div></div>
      <aside className="relative overflow-hidden rounded-[2rem] border border-cyan-100/15 bg-[radial-gradient(circle_at_50%_24%,rgba(125,211,252,0.2),transparent_12rem),linear-gradient(180deg,rgba(15,23,42,0.38),rgba(2,6,23,0.9))] p-5" aria-label="Command center registry state"><div aria-hidden="true" className="absolute left-1/2 top-[36%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/14 shadow-[0_0_80px_rgba(45,212,191,0.14)]" /><div aria-hidden="true" className="absolute left-1/2 top-[36%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff_0_8%,#67e8f9_22%,rgba(45,212,191,0.2)_62%,transparent_74%)] drop-shadow-[0_0_46px_rgba(103,232,249,0.62)]" /><div className="relative mt-56 rounded-[1.5rem] border border-white/12 bg-slate-950/72 p-5 backdrop-blur-xl"><p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-200">Canonical registry</p><p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{registry.generatedAt}</p><dl className="mt-5 grid gap-3 text-sm"><div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3"><dt className="text-white/42">Canonical app</dt><dd className="mt-1 font-semibold text-white">{registry.canonicalProductRepo}</dd></div><div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3"><dt className="text-white/42">Registry health</dt><dd className={registryValid ? "mt-1 font-semibold text-cyan-100" : "mt-1 font-semibold text-amber-100"}>{registryValid ? "valid" : "needs review"}</dd></div></dl></div></aside></div></section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-7" aria-label="System registry rollups"><Metric label="Total repos" value={metrics.total} detail="Canonical registry entries." /><Metric label="Production eligible" value={metrics.productionEligible} detail="True production-lock entries." toneClass="from-emerald-300/18" /><Metric label="Blocked" value={metrics.blocked} detail="Blockers or blocked mode." toneClass="from-rose-300/16" /><Metric label="Demo safe" value={metrics.demoSafe} detail="Genesis-safe without live claims." toneClass="from-emerald-300/18" /><Metric label="Evidence missing" value={metrics.evidenceMissing} detail="Proof absent or incomplete." toneClass="from-amber-300/16" /><Metric label="Roadmap only" value={metrics.roadmapOnly} detail="Future or preview-only." /><Metric label="Staging only" value={metrics.stagingOnly} detail="Proving-ground only." /></section>

      <nav className="sticky top-3 z-20 mt-4 rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-3 shadow-2xl shadow-black/30 backdrop-blur-2xl" aria-label="System registry quick navigation"><div className="flex gap-2 overflow-x-auto pb-1"><a href="#overview" className="shrink-0 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-bold text-white/70 hover:border-cyan-200/36 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Overview</a><a href="#registry" className="shrink-0 rounded-full border border-cyan-200/24 bg-cyan-200/[0.08] px-4 py-2 text-sm font-bold text-cyan-50 hover:border-cyan-200/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Registry</a><a href="#legend" className="shrink-0 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-bold text-white/70 hover:border-cyan-200/36 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Legend</a>{sections.map((section) => <a key={section.id} href={`#${section.id}`} className="shrink-0 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-bold text-white/70 hover:border-cyan-200/36 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">{section.title} <span className="text-white/38">{section.repos.length}</span></a>)}</div></nav>

      <section id="legend" className="mt-4 rounded-[2.25rem] border border-white/10 bg-slate-950/62 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-8" aria-labelledby="legend-title"><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Launch posture explanation</p><h2 id="legend-title" className="mt-4 text-[clamp(2.1rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-white">Truth labels before claims.</h2></div><div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{legend.map(([label, copy]) => <article key={label} className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4"><span className={`inline-flex rounded-full border px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.12em] ${tone(label)}`}>{label}</span><p className="mt-3 text-sm leading-6 text-white/62">{copy}</p></article>)}</div></section>

      <section id="registry" className="mt-4 rounded-[2.25rem] border border-white/10 bg-slate-950/62 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-8" aria-labelledby="registry-title"><div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Canonical registry</p><h2 id="registry-title" className="mt-4 text-[clamp(2.2rem,4vw,3.7rem)] font-semibold leading-none tracking-[-0.06em] text-white">Search the release truth layer.</h2><p className="mt-4 text-sm leading-6 text-white/62">Filtering changes discoverability only. It does not change registry truth, launch posture, or evidence requirements.</p></div><div className="flex flex-wrap gap-3"><button type="button" onClick={() => setAllVisible(true)} className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/[0.055] px-4 text-sm font-bold text-white/74 hover:border-cyan-200/36 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Expand all visible</button><button type="button" onClick={() => setAllVisible(false)} className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/[0.055] px-4 text-sm font-bold text-white/74 hover:border-cyan-200/36 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Collapse all</button></div></div>
      <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_220px_220px]"><label className="grid gap-2 text-sm font-bold text-white/72"><span>Search repos</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by repo, role, blocker, dependency..." className="min-h-12 rounded-2xl border border-white/12 bg-white/[0.075] px-4 text-base text-white outline-none placeholder:text-white/34 focus:border-cyan-200/70 focus:ring-4 focus:ring-cyan-200/18" /></label><label className="grid gap-2 text-sm font-bold text-white/72"><span>Status filter</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="min-h-12 rounded-2xl border border-white/12 bg-white/[0.075] px-4 text-sm text-white [color-scheme:dark] outline-none focus:border-cyan-200/70 focus:ring-4 focus:ring-cyan-200/18">{filters.map((filter) => <option key={filter.id} value={filter.id}>{filter.label}</option>)}</select></label><label className="grid gap-2 text-sm font-bold text-white/72"><span>Section filter</span><select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)} className="min-h-12 rounded-2xl border border-white/12 bg-white/[0.075] px-4 text-sm text-white [color-scheme:dark] outline-none focus:border-cyan-200/70 focus:ring-4 focus:ring-cyan-200/18"><option value="all">All sections</option>{sections.map((section) => <option key={section.id} value={section.id}>{section.title}</option>)}</select></label></div><p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/58">Showing {visibleRepoCount} registry card{visibleRepoCount === 1 ? "" : "s"}. {expandedCount} expanded.</p></section>

      {visibleSections.length ? visibleSections.map((section) => <section key={section.id} id={section.id} className="mt-4 rounded-[2.25rem] border border-white/10 bg-slate-950/62 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-8" aria-labelledby={`${section.id}-title`}><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">{section.repos.length} visible entries</p><h2 id={`${section.id}-title`} className="mt-4 text-[clamp(2rem,3.7vw,3.35rem)] font-semibold leading-none tracking-[-0.06em] text-white">{section.title}</h2><p className="mt-4 text-sm leading-6 text-white/62">{section.description}</p></div><div className="mt-6 grid gap-4">{section.repos.map((repo) => <RegistryCard key={repo.name} repo={repo} expanded={Boolean(expanded[repo.name])} onToggle={() => setExpanded((current) => ({ ...current, [repo.name]: !current[repo.name] }))} />)}</div></section>) : <section className="mt-4 rounded-[2.25rem] border border-amber-200/18 bg-amber-200/[0.07] p-8 text-amber-50 shadow-2xl shadow-black/30" aria-live="polite"><h2 className="text-2xl font-semibold tracking-[-0.04em]">No registry entries matched.</h2><p className="mt-3 text-sm leading-6 text-amber-50/72">Clear the search or filters to return to the canonical registry.</p></section>}

      <footer id="feedback" className="mt-4 grid gap-5 rounded-[2.25rem] border border-white/10 bg-slate-950/62 p-5 text-white shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Feedback and release discipline</p><h2 className="mt-4 text-[clamp(2rem,3.5vw,3.2rem)] font-semibold leading-none tracking-[-0.06em]">Help us tune URAI without weakening truth.</h2><p className="mt-4 max-w-3xl text-sm leading-6 text-white/62">This command center is a registry-backed truth surface. Bug capture and release notes should reference specific repo names, evidence gaps, and blockers rather than general readiness claims.</p></div><div className="flex flex-wrap gap-2 lg:justify-end"><Link href="/support" className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/[0.055] px-4 text-sm font-bold text-white/74 hover:border-cyan-200/36 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Support</Link><Link href="/status" className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/[0.055] px-4 text-sm font-bold text-white/74 hover:border-cyan-200/36 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Lightweight status</Link><a href="mailto:support@urai.app" className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/[0.055] px-4 text-sm font-bold text-white/74 hover:border-cyan-200/36 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Email support</a></div></footer>
    </div>
  </main>;
}
