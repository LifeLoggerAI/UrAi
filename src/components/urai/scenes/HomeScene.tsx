"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { UraiCompanionShell } from "@/components/companion/UraiCompanionShell";
import { AssetPreloader } from "@/components/genesis/AssetPreloader";
import { LayeredGenesisScene } from "@/components/genesis/LayeredGenesisScene";
import { GroundGarden } from "@/components/ground/GroundGarden";
import { LifeMapGalaxy } from "@/components/lifemap/LifeMapGalaxy";
import { MirrorView } from "@/components/mirror/MirrorView";
import { PortalNav } from "@/components/urai/PortalNav";
import { SceneCopy } from "@/components/urai/SceneCopy";
import { useUraiGround } from "@/providers/UraiGroundProvider";
import { useUraiLifeMap } from "@/providers/UraiLifeMapProvider";
import { useUraiMirror } from "@/providers/UraiMirrorProvider";

type HomeSceneProps = {
  onNavigate: (scene: UraiScene) => void;
  onOpenOrbChat?: () => void;
};

export function HomeScene({ onNavigate, onOpenOrbChat }: HomeSceneProps) {
  const router = useRouter();
  const ground = useUraiGround();
  const lifeMap = useUraiLifeMap();
  const mirror = useUraiMirror();
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);

  const closeAllLayers = useCallback(() => {
    ground.closeGround();
    lifeMap.closeLifeMap();
    mirror.closeMirror();
  }, [ground, lifeMap, mirror]);

  const openCompanion = useCallback(() => {
    onOpenOrbChat?.();
    setIsCompanionOpen(true);
  }, [onOpenOrbChat]);

  const closeCompanion = useCallback(() => {
    setIsCompanionOpen(false);
  }, []);

  const openPassport = useCallback(() => {
    setIsCompanionOpen(false);
    closeAllLayers();
    router.push("/passport");
  }, [closeAllLayers, router]);

  const openLifeMapFromCompanion = useCallback(() => {
    setIsCompanionOpen(false);
    ground.closeGround();
    mirror.closeMirror();
    lifeMap.openLifeMap();
  }, [ground, lifeMap, mirror]);

  const openGroundFromCompanion = useCallback(() => {
    setIsCompanionOpen(false);
    lifeMap.closeLifeMap();
    mirror.closeMirror();
    ground.openGround();
  }, [ground, lifeMap, mirror]);

  const openMirrorFromCompanion = useCallback(() => {
    setIsCompanionOpen(false);
    lifeMap.closeLifeMap();
    ground.closeGround();
    mirror.openMirror();
  }, [ground, lifeMap, mirror]);

  return (
    <section className="relative z-10 min-h-screen w-full overflow-hidden">
      <AssetPreloader>
        <LayeredGenesisScene
          moodState="luminous"
          onSkyOpen={lifeMap.openLifeMap}
          onOrbOpen={openCompanion}
          onGroundOpen={ground.openGround}
          onPassportOpen={openPassport}
          isCompanionOpen={isCompanionOpen || lifeMap.isLifeMapOpen || ground.isGroundOpen || mirror.isMirrorOpen}
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
      <MirrorView
        isOpen={mirror.isMirrorOpen}
        onClose={mirror.closeMirror}
        moodState="luminous"
        onOpenGround={openGroundFromCompanion}
        onOpenLifeMap={openLifeMapFromCompanion}
        onOpenPassport={openPassport}
        onTalkToCompanion={openCompanion}
      />

      <UraiCompanionShell
        isOpen={isCompanionOpen}
        onClose={closeCompanion}
        initialMode="companion"
        moodState="luminous"
        onOpenLifeMap={openLifeMapFromCompanion}
        onOpenPassport={openPassport}
        onOpenGround={openGroundFromCompanion}
        onOpenMirror={openMirrorFromCompanion}
      />
    </section>
  );
}
