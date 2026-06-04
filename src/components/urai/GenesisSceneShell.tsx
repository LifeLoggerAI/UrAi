"use client";

import { useCallback, useEffect, useState } from "react";
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

  const goToScene = useCallback((scene: UraiScene) => {
    setActiveScene((currentScene) => {
      if (scene === currentScene) return currentScene;
      setPreviousScene(currentScene);
      setTransitionDirection("enter");
      return scene;
    });
  }, []);

  const returnHome = useCallback(() => {
    setActiveScene((currentScene) => {
      if (currentScene === "home") return currentScene;
      setPreviousScene(currentScene);
      setTransitionDirection("return");
      return "home";
    });
  }, []);

  const returnToLifeMap = useCallback(() => {
    setActiveScene((currentScene) => {
      if (currentScene === "life-map") return currentScene;
      setPreviousScene(currentScene);
      setTransitionDirection("return");
      return "life-map";
    });
  }, []);

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
  }, [activeScene, returnHome, returnToLifeMap]);

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
