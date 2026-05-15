import Link from "next/link";
import LifeMapScene from "@/components/lifemap/LifeMapScene";

export const metadata = {
  title: "URAI WebGL Life Map",
  description:
    "A WebGL-backed URAI Life Map with spatial memory constellations, narrator cues, and accessible controls.",
};

export default function LifeMapPage() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black text-white">
      <LifeMapScene />

      <Link
        href="/"
        className="absolute left-4 top-4 z-50 rounded-full border border-white/25 bg-black/55 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
      >
        Return home
      </Link>
    </main>
  );
}
