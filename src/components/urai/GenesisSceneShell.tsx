"use client";

import { useEffect, useState } from "react";
import type { TransitionDirection, UraiScene } from "@/lib/urai/scene-theme";
import { AmbientParticleLayer } from "./AmbientParticleLayer";
import { CinematicBackdrop } from "./CinematicBackdrop";
import { GenesisSceneCopy } from "./GenesisSceneCopy";
import { OrbCore } from "./OrbCore";
import { PortalNav } from "./PortalNav";
import { SceneTransitionController } from "./SceneTransitionController";

export function GenesisSceneShell() {
  const [activeScene, setActiveScene] = useState<UraiScene>("home");
  const [previousScene, setPreviousScene] = useState<UraiScene | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>("enter");

  const goToScene = (scene: UraiScene) => {
    if (scene === activeScene) return;
    setPreviousScene(activeScene);
    setTransitionDirection("enter");
    setActiveScene(scene);
  };

  const returnHome = () => {
    if (activeScene === "home") return;
    setPreviousScene(activeScene);
    setTransitionDirection("return");
    setActiveScene("home");
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") returnHome();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeScene]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <CinematicBackdrop scene={activeScene} />
      <AmbientParticleLayer scene={activeScene} density={activeScene === "life-map" ? "high" : "medium"} />
      <SceneTransitionController activeScene={activeScene} previousScene={previousScene} direction={transitionDirection}>
        <section className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6">
          <GenesisSceneCopy scene={activeScene} />
          <div className="relative mt-10 flex items-center justify-center">
            <OrbCore
              scene={activeScene}
              size={activeScene === "home" ? "hero" : "large"}
              interactive
              onClick={() => {
                if (activeScene === "home") goToScene("life-map");
              }}
            />
          </div>
          <PortalNav activeScene={activeScene} onNavigate={goToScene} onReturnHome={returnHome} />
        </section>
      </SceneTransitionController>
    </main>
  );
}
