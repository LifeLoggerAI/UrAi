"use client";

import { getConsentCopy, ConsentLayerId } from "@/lib/privacy/consentCopyRegistry";

type ConsentGateProps = {
  layerId: ConsentLayerId;
  onConfirm: () => void;
  onCancel: () => void;
  onReviewPassport?: () => void;
};

export function ConsentGate({ layerId, onConfirm, onCancel, onReviewPassport }: ConsentGateProps) {
  const copy = getConsentCopy(layerId);

  return (
    <section className="pointer-events-auto mx-auto w-[min(92vw,560px)] rounded-[2rem] border border-white/12 bg-black/38 p-5 text-white shadow-2xl backdrop-blur-xl" aria-labelledby="consent-gate-title">
      <p className="text-xs uppercase tracking-[0.28em] text-white/45">URAI</p>
      <h2 id="consent-gate-title" className="mt-2 text-2xl font-medium text-white">{copy.title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/70">
        {copy.shortBody}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={onConfirm} className="rounded-full bg-amber-200/16 px-4 py-2 text-sm text-white/88">{copy.confirmLabel}</button>
        <button type="button" onClick={onCancel} className="rounded-full bg-white/[0.07] px-4 py-2 text-sm text-white/70">{copy.cancelLabel}</button>
        {onReviewPassport && (
          <button type="button" onClick={onReviewPassport} className="rounded-full bg-sky-200/12 px-4 py-2 text-sm text-white/74">Review Passport</button>
        )}
      </div>
    </section>
  );
}
