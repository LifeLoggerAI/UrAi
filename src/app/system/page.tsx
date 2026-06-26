import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, GitBranch, ShieldCheck } from "lucide-react";
import SystemStatusMatrix from "@/components/system/SystemStatusMatrix";
import {
  getBlockedRepos,
  getCanonicalProductRepo,
  getDeferredSystemRepos,
  getExternalSurfaceRepos,
  getGenesisSpineRepos,
  getLaunchEligibleRepos,
  getLegacyAndSandboxRepos,
  getProductionClaimableRepos,
  getSystemRegistry,
  validateSystemRegistryShape,
} from "@/lib/system-registry";

export const metadata: Metadata = {
  title: "URAI System Status",
  description: "Canonical URAI system-of-systems status backed by the release registry.",
};

export default function SystemPage() {
  const registry = getSystemRegistry();
  const canonical = getCanonicalProductRepo();
  const registryValid = validateSystemRegistryShape();
  const productionClaimable = getProductionClaimableRepos();
  const launchEligible = getLaunchEligibleRepos();
  const blockedCount = getBlockedRepos().length;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#050608] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(31,41,55,0.95),rgba(2,6,23,0.82)_48%,rgba(8,47,73,0.72))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(125,211,252,0.18),transparent_26%),radial-gradient(circle_at_76%_12%,rgba(52,211,153,0.14),transparent_25%),linear-gradient(180deg,transparent,rgba(0,0,0,0.72))]" />

      <section className="relative mx-auto w-full max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/62">
          <Link className="rounded-md border border-white/10 bg-white/[0.055] px-3 py-2 hover:bg-white/10" href="/">
            URAI
          </Link>
          <span>Registry generated {registry.generatedAt}</span>
        </div>

        <div className="mt-12 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/70">System status</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">URAI release truth, locked before launch.</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/68 md:text-lg">
            This route is backed by the canonical registry and shows launch mode, production eligibility, DNS/SSL proof, smoke evidence, rollback evidence, monitoring evidence, privacy gate evidence, and blockers. It makes no network calls and fetches no private data.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <a className="rounded-md border border-cyan-200/20 bg-cyan-200/[0.08] px-3 py-2 text-cyan-50 hover:bg-cyan-200/[0.14]" href="https://github.com/LifeLoggerAI/UrAi/blob/main/docs/PRODUCTION_LOCK.md">
              Production lock docs
            </a>
            <a className="rounded-md border border-white/10 bg-white/[0.055] px-3 py-2 text-white/76 hover:bg-white/10" href="https://github.com/LifeLoggerAI/UrAi/blob/main/docs/PRIVACY_RELEASE_GATE_EVIDENCE.md">
              Privacy gate evidence
            </a>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-cyan-200/20 bg-cyan-200/[0.07] p-4">
            <div className="flex items-center gap-2 text-cyan-50">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Canonical app</h2>
            </div>
            <p className="mt-3 text-lg font-semibold">{canonical?.name ?? registry.canonicalProductRepo}</p>
            <p className="mt-1 text-sm text-white/62">canonical product/demo app</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
            <div className="flex items-center gap-2 text-white/82">
              <GitBranch className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Registry shape</h2>
            </div>
            <p className={registryValid ? "mt-3 text-lg font-semibold text-cyan-50" : "mt-3 text-lg font-semibold text-amber-50"}>{registryValid ? "valid" : "needs review"}</p>
            <p className="mt-1 text-sm text-white/62">Source: system/urai-system-registry.json</p>
          </div>

          <div className="rounded-lg border border-amber-200/20 bg-amber-200/[0.07] p-4">
            <div className="flex items-center gap-2 text-amber-50">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Launch posture</h2>
            </div>
            <p className="mt-3 text-lg font-semibold">{launchEligible.length} launch-eligible repos</p>
            <p className="mt-1 text-sm text-white/62">{productionClaimable.length} production claims; {blockedCount} systems blocked or blocked-pending-proof.</p>
          </div>
        </div>

        <SystemStatusMatrix
          title="Genesis Spine"
          description="These systems define the safe V1 path: canonical product app, staging proving ground, privacy gate, operator control plane, async execution, and canonical content layer."
          repos={getGenesisSpineRepos()}
          emphasis="primary"
        />

        <SystemStatusMatrix
          title="Deferred And Gated Systems"
          description="These systems are not allowed to become live product behavior until privacy, consent, export/delete, admin audit, provider, and smoke evidence gates are satisfied."
          repos={getDeferredSystemRepos()}
          emphasis="warning"
        />

        <SystemStatusMatrix
          title="External Ecosystem Surfaces"
          description="These repos may be public surfaces, but they are not product runtime proof for the Genesis spine unless registry evidence says so."
          repos={getExternalSurfaceRepos()}
        />

        <SystemStatusMatrix
          title="Legacy And Sandbox Warning"
          description="These repos are explicitly not production truth. Anything useful must be ported into the canonical product repo before it counts."
          repos={getLegacyAndSandboxRepos()}
          emphasis="warning"
        />
      </section>
    </main>
  );
}
