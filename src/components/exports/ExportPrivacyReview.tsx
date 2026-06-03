"use client";

import type { ExportReviewResult } from "@/lib/exports/exportTypes";

type ExportPrivacyReviewProps = {
  review: ExportReviewResult | null;
  onApprove: () => void;
  onOpenPassport?: () => void;
};

export function ExportPrivacyReview({ review, onApprove, onOpenPassport }: ExportPrivacyReviewProps) {
  if (!review) {
    return (
      <section className="rounded-[1.75rem] border border-white/10 bg-black/28 p-4 text-white/70 backdrop-blur-xl">
        <p className="text-sm">Choose an approved artifact to review before export.</p>
      </section>
    );
  }

  const blocked = review.issues.filter((issue) => issue.severity === "blocked");
  const warnings = review.issues.filter((issue) => issue.severity === "warning");

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-black/28 p-4 text-white backdrop-blur-xl" aria-label="Export privacy review">
      <p className="text-xs uppercase tracking-[0.24em] text-white/45">Privacy review</p>
      <h3 className="mt-2 text-lg font-medium text-white">{review.canExport ? "Ready to create" : "Review needed"}</h3>
      <p className="mt-2 text-sm leading-6 text-white/62">
        URAI exports summaries only unless you explicitly allow more. Hidden, sealed, or blocked layers do not leave.
      </p>
      <div className="mt-4 space-y-2">
        {review.issues.length === 0 ? (
          <p className="rounded-2xl bg-white/[0.06] p-3 text-sm text-white/64">No privacy issues found for this artifact.</p>
        ) : review.issues.map((issue) => (
          <article key={issue.id} className="rounded-2xl bg-white/[0.06] p-3">
            <p className="text-sm font-medium text-white/82">{issue.title}</p>
            <p className="mt-1 text-xs leading-5 text-white/56">{issue.message}</p>
          </article>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" disabled={!review.canExport} onClick={onApprove} className="rounded-full bg-white/12 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40">
          Approve export
        </button>
        {(blocked.length > 0 || warnings.length > 0) && onOpenPassport ? (
          <button type="button" onClick={onOpenPassport} className="rounded-full bg-white/[0.07] px-4 py-2 text-sm text-white/66">
            Open Passport
          </button>
        ) : null}
      </div>
    </section>
  );
}
