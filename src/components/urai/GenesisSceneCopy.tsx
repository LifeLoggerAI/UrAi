import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";

export function GenesisSceneCopy({ scene }: { scene: UraiScene }) {
  const theme = getSceneTheme(scene);
  return (
    <div className="relative z-20 mx-auto max-w-2xl text-center">
      <p className="mb-3 text-xs uppercase tracking-[0.36em]" style={{ color: theme.accent }}>
        {theme.copy.eyebrow}
      </p>
      <h1 className="text-3xl font-light tracking-[-0.04em] text-white md:text-6xl">
        {theme.copy.title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/62 md:text-base">
        {theme.copy.body}
      </p>
    </div>
  );
}
