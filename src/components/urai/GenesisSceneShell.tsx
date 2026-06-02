"use client";

import { useEffect, useState } from "react";
import type { TransitionDirection, UraiScene } from "@/lib/urai/scene-theme";
import { AmbientParticleLayer } from "./AmbientParticleLayer";
import { CinematicBackdrop } from "./CinematicBackdrop";
import { FocusScene } from "./scenes/FocusScene";
import { GroundScene } from "./scenes/GroundScene";
import { HomeScene } from "./scenes/HomeScene";
import { LifeMapScene } from "./scenes/LifeMapScene";
import { ReplayScene } from "./scenes/ReplayScene";
import { SceneTransitionController } from "./SceneTransitionController";

export function GenesisSceneShell() {
  const [activeScene, setActiveScene] = useState<UraiScene>("home");
  const [previousScene, setPreviousScene] = useState<UraiScene | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>("enter");
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);

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

  const returnToLifeMap = () => {
    if (activeScene === "life-map") return;
    setPreviousScene(activeScene);
    setTransitionDirection("return");
    setActiveScene("life-map");
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (activeScene === "replay") {
        returnToLifeMap();
        return;
      }
      returnHome();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeScene]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <CinematicBackdrop scene={activeScene} />
      <AmbientParticleLayer scene={activeScene} density={activeScene === "life-map" ? "high" : "medium"} />
      <SceneTransitionController activeScene={activeScene} previousScene={previousScene} direction={transitionDirection}>
        {activeScene === "home" ? (
          <HomeScene onNavigate={goToScene} onOpenOrbChat={() => goToScene("life-map")} />
        ) : activeScene === "life-map" ? (
          <LifeMapScene selectedMemoryId={selectedMemoryId} onSelectMemory={setSelectedMemoryId} onNavigate={goToScene} onReturnHome={returnHome} />
        ) : activeScene === "replay" ? (
          <ReplayScene selectedMemoryId={selectedMemoryId} onNavigate={goToScene} onReturnToLifeMap={returnToLifeMap} onReturnHome={returnHome} />
        ) : activeScene === "ground" ? (
          <GroundScene onNavigate={goToScene} onReturnHome={returnHome} />
        ) : activeScene === "focus" ? (
          <FocusScene onNavigate={goToScene} onReturnHome={returnHome} />
        ) : null}
      </SceneTransitionController>
    </main>
  );
}
