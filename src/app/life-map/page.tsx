import Link from "next/link";
import LifeMapScene from "@/components/lifemap/LifeMapScene";

export const metadata = {
  title: "URAI Sky Map V1",
  description:
    "A lightweight 2.5D URAI Life Map demo with constellation memories, narrator cues, and weekly-scroll proof points.",
};

export default function LifeMapPage() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black text-white">
      <LifeMapScene />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 bg-gradient-to-b from-black/80 via-black/35 to-transparent px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/45">
              URAI Sky Map V1
            </p>
            <h1 className="mt-1 text-lg font-semibold tracking-tight text-white md:text-2xl">
              Flat magical Life Map, not blocked by 3D.
            </h1>
          </div>

          <Link
            href="/"
            className="pointer-events-auto rounded-full border border-white/25 bg-black/55 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
          >
            Return home
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-black/90 via-black/35 to-transparent px-4 pb-4 pt-16">
        <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-white/45">Proof</p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Stars are tappable memory moments with narrator reflections and connected emotional arcs.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-white/45">Build order</p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              This route proves the 2.5D sky timeline before any heavy spatial, AR, or WebGL world returns.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-white/45">Demo data</p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Public-safe sample memories keep the emotional loop visible without exposing private capture data.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
