"use client";

export default function ReplayControls({ isReplaying, onStop }: { isReplaying: boolean; onStop: () => void }) {
  if (!isReplaying) return null;
  return (
    <div className="pointer-events-auto fixed left-1/2 top-24 z-40 -translate-x-1/2 rounded-full border border-cyan-100/15 bg-slate-950/80 px-4 py-2 text-xs text-cyan-50 shadow-[0_0_40px_rgba(14,165,233,0.22)] backdrop-blur-xl">
      <span className="mr-3 inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-100" />
      Replaying emotional thread
      <button onClick={onStop} className="ml-4 rounded-full bg-white/10 px-3 py-1 hover:bg-white/20">Stop</button>
    </div>
  );
}
