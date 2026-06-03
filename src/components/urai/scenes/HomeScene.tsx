"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { UraiCompanionShell } from "@/components/companion/UraiCompanionShell";
import { AssetPreloader } from "@/components/genesis/AssetPreloader";
import { LayeredGenesisScene } from "@/components/genesis/LayeredGenesisScene";
import { GroundGarden } from "@/components/ground/GroundGarden";
import { LegacyView } from "@/components/legacy/LegacyView";
import { LifeMapGalaxy } from "@/components/lifemap/LifeMapGalaxy";
import { MirrorView } from "@/components/mirror/MirrorView";
import { ShadowRealmView } from "@/components/shadow/ShadowRealmView";
import { PortalNav } from "@/components/urai/PortalNav";
import { SceneCopy } from "@/components/urai/SceneCopy";
import { useUraiGround } from "@/providers/UraiGroundProvider";
import { useUraiLegacy } from "@/providers/UraiLegacyProvider";
import { useUraiLifeMap } from "@/providers/UraiLifeMapProvider";
import { useUraiMirror } from "@/providers/UraiMirrorProvider";
import { useUraiShadow } from "@/providers/UraiShadowProvider";

type HomeSceneProps = {
  onNavigate: (scene: UraiScene) => void;
  onOpenOrbChat?: () => void;
};

export function HomeScene({ onNavigate, onOpenOrbChat }: HomeSceneProps) {
  const router = useRouter();
  const ground = useUraiGround();
  const legacy = useUraiLegacy();
  const lifeMap = useUraiLifeMap();
  const mirror = useUraiMirror();
  const shadow = useUraiShadow();
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);

  const closeAllLayers = useCallback(() => {
    ground.closeGround();
    legacy.closeLegacy();
    lifeMap.closeLifeMap();
    mirror.closeMirror();
    shadow.closeShadow();
  }, [ground, legacy, lifeMap, mirror, shadow]);

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
    legacy.closeLegacy();
    mirror.closeMirror();
    shadow.closeShadow();
    lifeMap.openLifeMap();
  }, [ground, legacy, lifeMap, mirror, shadow]);

  const openGroundFromCompanion = useCallback(() => {
    setIsCompanionOpen(false);
    legacy.closeLegacy();
    lifeMap.closeLifeMap();
    mirror.closeMirror();
    shadow.closeShadow();
    ground.openGround();
  }, [ground, legacy, lifeMap, mirror, shadow]);

  const openMirrorFromCompanion = useCallback(() => {
    setIsCompanionOpen(false);
    legacy.closeLegacy();
    lifeMap.closeLifeMap();
    ground.closeGround();
    shadow.closeShadow();
    mirror.openMirror();
  }, [ground, legacy, lifeMap, mirror, shadow]);

  const openShadowFromCompanion = useCallback(() => {
    setIsCompanionOpen(false);
    legacy.closeLegacy();
    lifeMap.closeLifeMap();
    ground.closeGround();
    mirror.closeMirror();
    shadow.openShadow();
  }, [ground, legacy, lifeMap, mirror, shadow]);

  const openLegacyFromCompanion = useCallback(() => {
    setIsCompanionOpen(false);
    lifeMap.closeLifeMap();
    ground.closeGround();
    mirror.closeMirror();
    shadow.closeShadow();
    legacy.openLegacy();
  }, [ground, legacy, lifeMap, mirror, shadow]);

  return (
    <section className="relative z-10 min-h-screen w-full overflow-hidden">
      <AssetPreloader>
        <LayeredGenesisScene
          moodState="luminous"
          onSkyOpen={lifeMap.openLifeMap}
          onOrbOpen={openCompanion}
          onGroundOpen={ground.openGround}
          onPassportOpen={openPassport}
          isCompanionOpen={isCompanionOpen || lifeMap.isLifeMapOpen || ground.isGroundOpen || mirror.isMirrorOpen || shadow.isShadowOpen || legacy.isLegacyOpen}
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
      <MirrorView isOpen={mirror.isMirrorOpen} onClose={mirror.closeMirror} moodState="luminous" onOpenGround={openGroundFromCompanion} onOpenLifeMap={openLifeMapFromCompanion} onOpenPassport={openPassport} onTalkToCompanion={openCompanion} />
      <ShadowRealmView isOpen={shadow.isShadowOpen} onClose={shadow.closeShadow} onOpenGround={openGroundFromCompanion} onOpenPassport={openPassport} onTalkToGuardian={openCompanion} />
      <LegacyView isOpen={legacy.isLegacyOpen} onClose={legacy.closeLegacy} moodState="luminous" onOpenPassport={openPassport} onOpenLifeMap={openLifeMapFromCompanion} onOpenGround={openGroundFromCompanion} onTalkToCompanion={openCompanion} />

      <UraiCompanionShell
        isOpen={isCompanionOpen}
        onClose={closeCompanion}
        initialMode="companion"
        moodState="luminous"
        onOpenLifeMap={openLifeMapFromCompanion}
        onOpenPassport={openPassport}
        onOpenGround={openGroundFromCompanion}
        onOpenMirror={openMirrorFromCompanion}
        onOpenShadow={openShadowFromCompanion}
        onOpenLegacy={openLegacyFromCompanion}
      />
    </section>
  );
}
