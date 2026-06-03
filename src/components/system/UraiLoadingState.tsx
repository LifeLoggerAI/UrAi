"use client";

type UraiLoadingStateProps = {
  label?: "opening" | "returning" | "preparing";
};

const COPY: Record<NonNullable<UraiLoadingStateProps["label"]>, string> = {
  opening: "Opening gently…",
  returning: "Returning to Genesis…",
  preparing: "Preparing the view…",
};

export function UraiLoadingState({ label = "opening" }: UraiLoadingStateProps) {
  return (
    <div className="grid min-h-[240px] place-items-center rounded-[2rem] border border-white/10 bg-black/24 p-6 text-white/70 backdrop-blur-xl" role="status" aria-live="polite">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 rounded-full border border-white/15 bg-white/[0.04] shadow-[0_0_48px_rgba(255,255,255,0.12)]" />
        <p className="mt-4 text-sm tracking-wide">{COPY[label]}</p>
      </div>
    </div>
  );
}
