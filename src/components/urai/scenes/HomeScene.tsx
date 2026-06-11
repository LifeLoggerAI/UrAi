'use client';

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { LifeMapStar } from "@/lib/lifemap/lifeMapTypes";
import { UraiCompanionShell } from "@/components/companion/UraiCompanionShell";
import { ExportCenter } from "@/components/exports/ExportCenter";
import { AssetPreloader } from "@/components/genesis/AssetPreloader";
import { GroundGarden } from "@/components/ground/GroundGarden";
import { LegacyView } from "@/components/legacy/LegacyView";
import { LifeMapGalaxy } from "@/components/lifemap/LifeMapGalaxy";
import { MirrorView } from "@/components/mirror/MirrorView";
import { InAppWhisper } from "@/components/notifications/InAppWhisper";
import { UraiOnboardingFlow } from "@/components/onboarding/UraiOnboardingFlow";
import { RitualFlow } from "@/components/rituals/RitualFlow";
import { UraiSettingsControlMenu } from "@/components/settings/UraiSettingsControlMenu";
import { ShadowRealmView } from "@/components/shadow/ShadowRealmView";
import { HomeWorldCanvas } from "@/components/urai/home/HomeWorldCanvas";
import { PortalNav } from "@/components/urai/PortalNav";
import { useUraiAudio } from "@/providers/UraiAudioProvider";
import { useUraiExport } from "@/providers/UraiExportProvider";
import { useUraiGround } from "@/providers/UraiGroundProvider";
import { useUraiLegacy } from "@/providers/UraiLegacyProvider";
import { useUraiLifeMap } from "@/providers/UraiLifeMapProvider";
import { useUraiMirror } from "@/providers/UraiMirrorProvider";
import { useUraiNotifications } from "@/providers/UraiNotificationProvider";
import { useUraiOnboarding } from "@/providers/UraiOnboardingProvider";
import { useUraiRituals } from "@/providers/UraiRitualProvider";
import { useUraiSettings } from "@/providers/UraiSettingsProvider";
import { useUraiShadow } from "@/providers/UraiShadowProvider";

export function HomeScene() {
  const router = useRouter();
  const audio = useUraiAudio();
  const exports = useUraiExport();
  const ground = useUraiGround();
  const legacy = useUraiLegacy();
  const lifeMap = useUraiLifeMap();
  const mirror = useUraiMirror();
  const notifications = useUraiNotifications();
  const onboarding = useUraiOnboarding();
  const rituals = useUraiRituals();
  const settings = useUraiSettings();
  const shadow = useUraiShadow();

  const [isCompanionOpen, setIsCompanionOpen] = useState(false);

  useEffect(() => {
    if (onboarding.isFirstRun && onboarding.preferences.status === "not_started") {
      onboarding.startOnboarding();
    }
  }, [onboarding]);

  const closeAllLayers = useCallback(() => {
    exports.closeExport();
    ground.closeGround();
    legacy.closeLegacy();
    lifeMap.closeLifeMap();
    mirror.closeMirror();
    shadow.closeShadow();
  }, [exports, ground, legacy, lifeMap, mirror, shadow]);

  const openCompanion = useCallback(() => setIsCompanionOpen(true), []);
  const closeCompanion = useCallback(() => setIsCompanionOpen(false), []);

  const handleNavigate = (route: string, query?: Record<string, string>) => {
    const url = new URL(route, window.location.origin);
    if (query) {
      Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));
    }
    router.push(url.pathname + url.search);
  };

  const openPassport = useCallback(
    (context?: { starId: string }) => {
      closeAllLayers();
      handleNavigate("/passport", context ? { fromStar: context.starId } : undefined);
    },
    [closeAllLayers, router]
  );

  const openReplay = useCallback(
    (context: { starId: string }) => {
      closeAllLayers();
      handleNavigate("/replay", { fromStar: context.starId });
    },
    [closeAllLayers, router]
  );

  const onReflectStar = useCallback(
    (star: LifeMapStar) => {
      openCompanion();
    },
    [openCompanion]
  );

  const openLifeMapFromCompanion = useCallback(() => {
    setIsCompanionOpen(false);
    closeAllLayers();
    lifeMap.openLifeMap();
  }, [closeAllLayers, lifeMap]);


  return (
    <section className="relative z-10 h-screen w-full overflow-hidden">
      <AssetPreloader>
        <HomeWorldCanvas />
      </AssetPreloader>
      <PortalNav onNavigate={(scene) => router.push(`/${scene}`)} activeScene="home" />

      <LifeMapGalaxy
        isOpen={lifeMap.isLifeMapOpen}
        onClose={lifeMap.closeLifeMap}
        moodState="luminous"
        onOpenPassport={openPassport}
        onReflectStar={onReflectStar}
      />
      <GroundGarden isOpen={ground.isGroundOpen} onClose={ground.closeGround} moodState="luminous" onOpenPassport={openPassport} />

      <UraiCompanionShell
        isOpen={isCompanionOpen}
        onClose={closeCompanion}
        initialMode="companion"
        moodState="luminous"
        onOpenLifeMap={openLifeMapFromCompanion}
        onOpenPassport={openPassport}
      />
    </section>
  );
}
