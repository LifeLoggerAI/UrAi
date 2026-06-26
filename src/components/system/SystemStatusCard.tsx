import { CheckCircle2, CircleDashed, LockKeyhole, ShieldAlert, ShieldCheck, Workflow } from "lucide-react";
import type { SystemRepo } from "@/lib/system-registry";
import { isProductionEvidenceBacked, isRoadmapOnly, requiresPrivacyGate } from "@/lib/system-registry";

type SystemStatusCardProps = {
  repo: SystemRepo;
  emphasis?: "primary" | "standard" | "warning";
};

const labelStyles: Record<string, string> = {
  Canonical: "border-cyan-200/30 bg-cyan-200/12 text-cyan-50",
  Staging: "border-sky-200/30 bg-sky-200/10 text-sky-50",
  "Privacy Gate": "border-emerald-200/30 bg-emerald-200/10 text-emerald-50",
  "Evidence Missing": "border-amber-200/35 bg-amber-200/12 text-amber-50",
  "Demo Safe": "border-teal-200/30 bg-teal-200/10 text-teal-50",
  "Roadmap Only": "border-white/15 bg-white/[0.06] text-white/70",
  Blocked: "border-rose-200/35 bg-rose-200/12 text-rose-50",
  Legacy: "border-zinc-300/20 bg-zinc-300/10 text-zinc-100",
  Sandbox: "border-orange-200/30 bg-orange-200/10 text-orange-50",
  "Evidence Backed": "border-lime-200/30 bg-lime-200/10 text-lime-50",
};

function statusLabels(repo: SystemRepo) {
  const labels: string[] = [];

  if (repo.classification === "canonical-product") labels.push("Canonical");
  if (repo.classification === "staging") labels.push("Staging");
  if (repo.name === "LifeLoggerAI/urai-privacy") labels.push("Privacy Gate");
  if (repo.classification === "sandbox") labels.push("Sandbox");
  if (repo.classification === "legacy-archive") labels.push("Legacy");
  if (repo.classification === "blocked" || repo.status.toLowerCase().includes("blocked")) labels.push("Blocked");
  if (repo.canUseInV1 && !repo.canClaimProduction) labels.push("Demo Safe");
  if (isRoadmapOnly(repo)) labels.push("Roadmap Only");
  if (isProductionEvidenceBacked(repo)) labels.push("Evidence Backed");
  if (!repo.productionEvidence && repo.evidenceRequired.length > 0) labels.push("Evidence Missing");

  return Array.from(new Set(labels));
}

function BoolPill({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/72">
      <span>{label}</span>
      <span className={value ? "font-semibold text-cyan-100" : "text-white/45"}>{value ? "yes" : "no"}</span>
    </div>
  );
}

function TextList({ title, values, empty }: { title: string; values: string[]; empty: string }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">{title}</h3>
      {values.length ? (
        <ul className="mt-2 space-y-1.5 text-sm leading-6 text-white/68">
          {values.map((value) => (
            <li key={value} className="break-words">{value}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-white/38">{empty}</p>
      )}
    </div>
  );
}

export default function SystemStatusCard({ repo, emphasis = "standard" }: SystemStatusCardProps) {
  const labels = statusLabels(repo);
  const Icon = repo.classification === "canonical-product" ? ShieldCheck : repo.classification === "blocked" ? ShieldAlert : repo.canClaimProduction ? CheckCircle2 : requiresPrivacyGate(repo) ? LockKeyhole : CircleDashed;
  const border = emphasis === "primary" ? "border-cyan-200/30 bg-cyan-200/[0.075]" : emphasis === "warning" ? "border-amber-200/25 bg-amber-200/[0.055]" : "border-white/10 bg-white/[0.045]";

  return (
    <article className={`rounded-lg border ${border} p-5 shadow-2xl shadow-black/20 backdrop-blur-md`}>
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/30">
          <Icon className="h-5 w-5 text-cyan-100" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-semibold text-white">{repo.name}</p>
          <p className="mt-1 text-sm leading-6 text-white/58">{repo.role}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {labels.map((label) => (
          <span key={label} className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${labelStyles[label] ?? labelStyles["Roadmap Only"]}`}>
            {label}
          </span>
        ))}
      </div>

      <p className="mt-4 text-sm leading-6 text-white/78">{repo.status}</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <BoolPill label="Usable in V1" value={repo.canUseInV1} />
        <BoolPill label="Roadmap only" value={isRoadmapOnly(repo)} />
        <BoolPill label="Production claim" value={isProductionEvidenceBacked(repo)} />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <TextList title="Privacy gate" values={requiresPrivacyGate(repo) ? ["Depends on LifeLoggerAI/urai-privacy or is the gate itself"] : ["No privacy dependency listed in registry"]} empty="No privacy requirement recorded" />
        <TextList title="Evidence required" values={repo.evidenceRequired} empty="No remaining evidence listed" />
        <TextList title="Dependencies" values={repo.dependsOn} empty="No dependencies listed" />
        <TextList title="Notes" values={repo.notes} empty="No notes listed" />
      </div>

      {repo.productionEvidence ? (
        <div className="mt-5 rounded-md border border-lime-200/20 bg-lime-200/[0.06] p-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-100/70">Production evidence</h3>
          <ul className="mt-2 space-y-1.5 text-sm leading-6 text-lime-50/72">
            {repo.productionEvidence.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
