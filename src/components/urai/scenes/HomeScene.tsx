"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { UraiCompanionShell } from "@/components/companion/UraiCompanionShell";
import { AssetPreloader } from "@/components/genesis/AssetPreloader";
import { LayeredGenesisScene } from "@/components/genesis/LayeredGenesisScene";
import { GroundGarden } from "@/components/ground/GroundGarden";
import { LifeMapGalaxy } from "@/components/lifemap/LifeMapGalaxy";
import { PortalNav } from "@/components/urai/PortalNav";
import { SceneCopy } from "@/components/urai/SceneCopy";
import { useUraiGround } from "@/providers/UraiGroundProvider";
import { useUraiLifeMap } from "@/providers/UraiLifeMapProvider";

type HomeSceneProps = {
  onNavigate: (scene: UraiScene) => void;
  onOpenOrbChat?: () => void;
};

export function HomeScene({ onNavigate, onOpenOrbChat }: HomeSceneProps) {
  const router = useRouter();
  const ground = useUraiGround();
  const lifeMap = useUraiLifeMap();
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);

  const openCompanion = useCallback(() => {
    onOpenOrbChat?.();
    setIsCompanionOpen(true);
  }, [onOpenOrbChat]);

  const closeCompanion = useCallback(() => {
    setIsCompanionOpen(false);
  }, []);

  const openPassport = useCallback(() => {
    setIsCompanionOpen(false);
    ground.closeGround();
    lifeMap.closeLifeMap();
    router.push("/passport");
  }, [ground, lifeMap, router]);

  const openLifeMapFromCompanion = useCallback(() => {
    setIsCompanionOpen(false);
    ground.closeGround();
    lifeMap.openLifeMap();
  }, [ground, lifeMap]);

  const openGroundFromCompanion = useCallback(() => {
    setIsCompanionOpen(false);
    lifeMap.closeLifeMap();
    ground.openGround();
  }, [ground, lifeMap]);

  return (
    <section className="relative z-10 min-h-screen w-full overflow-hidden">
      <AssetPreloader>
        <LayeredGenesisScene
          moodState="luminous"
          onSkyOpen={lifeMap.openLifeMap}
          onOrbOpen={openCompanion}
          onGroundOpen={ground.openGround}
          onPassportOpen={openPassport}
          isCompanionOpen={isCompanionOpen || lifeMap.isLifeMapOpen || ground.isGroundOpen}
        />
      </AssetPreloader>

      <div className="pointer-events-none absolute inset-0 z-40 flex min-h-screen w-full flex-col items-center justify-between px-6 py-12">
        <div className="pointer-events-auto pt-4">
          <SceneCopy scene="home" />
        </div>
        <div className="pointer-events-auto w-full pb-2">
          <PortalNav activeScene="home" onNavigate={onNavigate} onReturnHome={() => onNavigate("home")} />
        </div>
      </div>

      <LifeMapGalaxy isOpen={lifeMap.isLifeMapOpen} onClose={lifeMap.closeLifeMap} moodState="luminous" onOpenPassport={openPassport} />
      <GroundGarden isOpen={ground.isGroundOpen} onClose={ground.closeGround} moodState="luminous" onOpenPassport={openPassport} />

      <UraiCompanionShell
        isOpen={isCompanionOpen}
        onClose={closeCompanion}
        initialMode="companion"
        moodState="luminous"
        onOpenLifeMap={openLifeMapFromCompanion}
        onOpenPassport={openPassport}
        onOpenGround={openGroundFromCompanion}
      />
    </section>
  );
}
