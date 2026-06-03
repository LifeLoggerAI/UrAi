"use client";

type LegacyConsentGateProps = {
  onOpenLegacy: () => void;
  onKeepClosed: () => void;
  onReviewPassport?: () => void;
};

export function LegacyConsentGate({ onOpenLegacy, onKeepClosed, onReviewPassport }: LegacyConsentGateProps) {
  return (
    <section className="pointer-events-auto mx-auto w-[min(92vw,560px)] rounded-[2rem] border border-white/12 bg-black/38 p-5 text-white shadow-2xl backdrop-blur-xl" aria-labelledby="legacy-consent-title">
      <p className="text-xs uppercase tracking-[0.28em] text-white/45">URAI Legacy</p>
      <h2 id="legacy-consent-title" className="mt-2 text-2xl font-medium text-white">Legacy is closed.</h2>
      <p className="mt-3 text-sm leading-6 text-white/70">
        Legacy is where URAI can preserve moments and chapters only if you choose. Nothing is saved here by default.
      </p>
      <p className="mt-3 text-sm leading-6 text-white/58">You can approve what gets carried forward.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={onOpenLegacy} className="rounded-full bg-amber-200/16 px-4 py-2 text-sm text-white/88">Open Legacy</button>
        <button type="button" onClick={onKeepClosed} className="rounded-full bg-white/[0.07] px-4 py-2 text-sm text-white/70">Keep Legacy closed</button>
        <button type="button" onClick={onReviewPassport} className="rounded-full bg-sky-200/12 px-4 py-2 text-sm text-white/74">Review Passport</button>
      </div>
    </section>
  );
}
