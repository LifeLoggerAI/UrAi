"use client";

export default function HomeAuraScene({ onEnter, reducedMotion = false }: { onEnter: () => void; reducedMotion?: boolean }) {
  return (
    <section className="absolute inset-0 z-20 overflow-hidden bg-[#020817] text-cyan-50" aria-label="URAI home aura scene">
      <button
        type="button"
        onClick={onEnter}
        className="group absolute inset-0 block h-full w-full cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-cyan-100/70 focus:ring-inset"
        aria-label="Open URAI Memory Galaxy"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(34,211,238,0.26),transparent_24%),radial-gradient(circle_at_50%_55%,rgba(134,239,172,0.18),transparent_30%),linear-gradient(180deg,#020817_0%,#061a2a_55%,#030712_100%)]" />
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_30%_28%,rgba(255,255,255,.52)_1px,transparent_1px),radial-gradient(circle_at_82%_58%,rgba(191,233,255,.45)_1px,transparent_1px),radial-gradient(circle_at_62%_22%,rgba(216,180,254,.5)_1px,transparent_1px)] [background-size:124px_124px,176px_176px,220px_220px]" />
        <div className="absolute left-0 right-0 top-[58%] h-px bg-cyan-100/18" />
        <div className="absolute bottom-[17%] left-0 h-[16vh] w-full bg-[linear-gradient(165deg,transparent_0_13%,rgba(38,63,112,.46)_14%_25%,rgba(19,28,64,.66)_26%_42%,transparent_43%),linear-gradient(12deg,transparent_0_45%,rgba(154,130,54,.3)_46%_61%,transparent_62%)] blur-[1px]" />
        <div className="absolute left-1/2 top-[52%] h-[28vh] w-[16vh] -translate-x-1/2 rounded-b-full bg-cyan-100/10 blur-2xl" />
        <div className={`absolute left-1/2 top-[50%] h-[min(20vw,156px)] w-[min(20vw,156px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/20 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,.94),#a8f7ff_30%,#164e63_74%,#06111f_100%)] shadow-[0_0_64px_rgba(103,232,249,.7),0_0_180px_rgba(134,239,172,.35)] ${reducedMotion ? "" : "animate-[auraBreath_5.8s_ease-in-out_infinite]"}`} />
        <div className="absolute left-1/2 top-[50%] h-[36vh] w-[36vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/10 shadow-[0_0_100px_rgba(191,233,255,.13)]" />
        <div className="absolute left-1/2 top-[50%] h-[48vh] w-[48vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-100/8" />
        <div className="absolute left-1/2 top-[72%] -translate-x-1/2 text-center">
          <p className="rounded-full border border-cyan-100/14 bg-slate-950/38 px-5 py-2 text-xs uppercase tracking-[0.26em] text-cyan-50/72 backdrop-blur-xl transition group-hover:border-cyan-100/35 group-hover:text-cyan-50">The sky remembers. Tap to enter.</p>
        </div>
      </button>
      <style jsx global>{`
        @keyframes auraBreath {
          0%, 100% { transform: translate(-50%, -50%) scale(.98); filter: brightness(.95); }
          50% { transform: translate(-50%, -50%) scale(1.04); filter: brightness(1.08); }
        }
      `}</style>
    </section>
  );
}
