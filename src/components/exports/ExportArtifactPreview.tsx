"use client";

import type { ExportArtifact, ExportTemplateId } from "@/lib/exports/exportTypes";

type ExportArtifactPreviewProps = {
  artifact: ExportArtifact | null;
  templateId?: ExportTemplateId;
};

const templateClass: Record<ExportTemplateId, string> = {
  celestial_scroll: "from-indigo-950 via-violet-950 to-black border-violet-100/18",
  ground_bloom: "from-emerald-950 via-stone-950 to-black border-emerald-100/18",
  mirror_glass: "from-slate-950 via-blue-950 to-black border-blue-100/18",
  legacy_archive: "from-amber-950 via-violet-950 to-black border-amber-100/18",
  shadow_soft: "from-indigo-950 via-slate-950 to-black border-indigo-100/18",
  passport_clean: "from-slate-950 via-sky-950 to-black border-sky-100/18",
};

export function ExportArtifactPreview({ artifact, templateId = "celestial_scroll" }: ExportArtifactPreviewProps) {
  if (!artifact) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 text-white/70 backdrop-blur-xl">
        <p className="text-sm">Choose an approved moment to preview an export.</p>
      </section>
    );
  }

  return (
    <section className={`relative min-h-[420px] overflow-hidden rounded-[2rem] border bg-gradient-to-b p-6 shadow-2xl ${templateClass[templateId]}`} aria-label="Export artifact preview">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(255,220,160,0.12),transparent_26%)]" />
      <div className="relative z-10 flex min-h-[370px] flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-white/45">URAI Export</p>
          <h2 className="mt-4 text-3xl font-medium leading-tight text-white">{artifact.title}</h2>
          {artifact.subtitle ? <p className="mt-2 text-sm text-white/62">{artifact.subtitle}</p> : null}
        </div>
        <div>
          <p className="max-w-xl text-base leading-7 text-white/78">{artifact.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/64">{artifact.type.replace(/_/g, " ")}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/64">{artifact.privacyLevel.replace(/_/g, " ")}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/64">{artifact.format}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
