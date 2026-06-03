"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { UraiCompanionShell } from "@/components/companion/UraiCompanionShell";
import { ExportCenter } from "@/components/exports/ExportCenter";
import { AssetPreloader } from "@/components/genesis/AssetPreloader";
import { LayeredGenesisScene } from "@/components/genesis/LayeredGenesisScene";
import { GroundGarden } from "@/components/ground/GroundGarden";
import { LegacyView } from "@/components/legacy/LegacyView";
import { LifeMapGalaxy } from "@/components/lifemap/LifeMapGalaxy";
import { MirrorView } from "@/components/mirror/MirrorView";
import { InAppWhisper } from "@/components/notifications/InAppWhisper";
import { UraiOnboardingFlow } from "@/components/onboarding/UraiOnboardingFlow";
import { RitualFlow } from "@/components/rituals/RitualFlow";
import { RitualShelf } from "@/components/rituals/RitualShelf";
import { UraiSettingsControlMenu } from "@/components/settings/UraiSettingsControlMenu";
import { ShadowRealmView } from "@/components/shadow/ShadowRealmView";
import { PortalNav } from "@/components/urai/PortalNav";
import { SceneCopy } from "@/components/urai/SceneCopy";
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

type HomeSceneProps = {
  onNavigate: (scene: UraiScene) => void;
  onOpenOrbChat?: () => void;
};

export function HomeScene({ onNavigate, onOpenOrbChat }: HomeSceneProps) {
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
    if (onboarding.isFirstRun && onboarding.preferences.status === "not_started") onboarding.startOnboarding();
  }, [onboarding]);

  const closeAllLayers = useCallback(() => {
    exports.closeExport();
    ground.closeGround();
    legacy.closeLegacy();
    lifeMap.closeLifeMap();
    mirror.closeMirror();
    shadow.closeShadow();
  }, [exports, ground, legacy, lifeMap, mirror, shadow]);

  const openCompanion = useCallback(() => { onOpenOrbChat?.(); setIsCompanionOpen(true); }, [onOpenOrbChat]);
  const closeCompanion = useCallback(() => setIsCompanionOpen(false), []);
  const openPassport = useCallback(() => { setIsCompanionOpen(false); settings.closeSettings(); closeAllLayers(); router.push("/passport"); }, [closeAllLayers, router, settings]);
  const openLifeMapFromCompanion = useCallback(() => { setIsCompanionOpen(false); closeAllLayers(); lifeMap.openLifeMap(); }, [closeAllLayers, lifeMap]);
  const openGroundFromCompanion = useCallback(() => { setIsCompanionOpen(false); closeAllLayers(); ground.openGround(); }, [closeAllLayers, ground]);
  const openMirrorFromCompanion = useCallback(() => { setIsCompanionOpen(false); closeAllLayers(); mirror.openMirror(); }, [closeAllLayers, mirror]);
  const openShadowFromCompanion = useCallback(() => { setIsCompanionOpen(false); closeAllLayers(); shadow.openShadow(); }, [closeAllLayers, shadow]);
  const openLegacyFromCompanion = useCallback(() => { setIsCompanionOpen(false); closeAllLayers(); legacy.openLegacy(); }, [closeAllLayers, legacy]);
  const openExportFromCompanion = useCallback(() => { setIsCompanionOpen(false); closeAllLayers(); exports.openExport(); }, [closeAllLayers, exports]);
  const openSettingsFromCompanion = useCallback(() => { setIsCompanionOpen(false); closeAllLayers(); settings.openSettings(); }, [closeAllLayers, settings]);

  const suggestSmallRitual = useCallback(() => {
    const [ritual] = rituals.suggestForContext({ moodState: "luminous" });
    if (ritual) rituals.startRitual(ritual.id);
  }, [rituals]);

  const enableOnboardingSound = useCallback(() => {
    audio.setAudioEnabled(true);
    void audio.unlockAudio().then(() => audio.playOneShot("orb-wake", { category: "orb", volume: 0.22 }));
  }, [audio]);

  const keepOnboardingSoundOff = useCallback(() => { audio.setAudioEnabled(false); }, [audio]);
  const enableInAppWhispersOnly = useCallback(() => {
    notifications.setNotificationsEnabled(true);
    notifications.updateTimingProfile({ allowInApp: true, allowPush: false, allowSms: false, allowEmail: false, quietHoursEnabled: true, maxPerDay: 2, maxPerWeek: 7, reducedNotificationMode: true });
  }, [notifications]);
  const keepNotificationsOff = useCallback(() => {
    notifications.setNotificationsEnabled(false);
    notifications.updateTimingProfile({ allowPush: false, allowSms: false, allowEmail: false, allowInApp: true, quietHoursEnabled: true, maxPerDay: 2, maxPerWeek: 7, reducedNotificationMode: true });
  }, [notifications]);

  const onboardingOpen = onboarding.isFirstRun && onboarding.preferences.status === "in_progress";
  const immersiveOpen = isCompanionOpen || lifeMap.isLifeMapOpen || ground.isGroundOpen || mirror.isMirrorOpen || shadow.isShadowOpen || legacy.isLegacyOpen || exports.isExportOpen || rituals.isRitualFlowOpen || onboardingOpen || settings.isSettingsOpen;

  return (
    <section className="relative z-10 min-h-screen w-full overflow-hidden">
      <AssetPreloader>
        <LayeredGenesisScene moodState="luminous" onSkyOpen={lifeMap.openLifeMap} onOrbOpen={openCompanion} onGroundOpen={ground.openGround} onPassportOpen={openPassport} onSettingsOpen={openSettingsFromCompanion} isCompanionOpen={immersiveOpen} />
      </AssetPreloader>
      <div className="pointer-events-none absolute inset-0 z-40 flex min-h-screen w-full flex-col items-center justify-between px-6 py-12">
        <div className="pointer-events-auto pt-4"><SceneCopy scene="home" /></div>
        <div className="pointer-events-auto w-full pb-2"><PortalNav activeScene="home" onNavigate={onNavigate} onReturnHome={() => onNavigate("home")} /></div>
      </div>
      <RitualShelf isVisible={!lifeMap.isLifeMapOpen && !ground.isGroundOpen && !mirror.isMirrorOpen && !shadow.isShadowOpen && !legacy.isLegacyOpen && !exports.isExportOpen && !isCompanionOpen && !onboardingOpen && !settings.isSettingsOpen} />
      <LifeMapGalaxy isOpen={lifeMap.isLifeMapOpen} onClose={lifeMap.closeLifeMap} moodState="luminous" onOpenPassport={openPassport} />
      <GroundGarden isOpen={ground.isGroundOpen} onClose={ground.closeGround} moodState="luminous" onOpenPassport={openPassport} />
      <MirrorView isOpen={mirror.isMirrorOpen} onClose={mirror.closeMirror} moodState="luminous" onOpenGround={openGroundFromCompanion} onOpenLifeMap={openLifeMapFromCompanion} onOpenPassport={openPassport} onTalkToCompanion={openCompanion} />
      <ShadowRealmView isOpen={shadow.isShadowOpen} onClose={shadow.closeShadow} onOpenGround={openGroundFromCompanion} onOpenPassport={openPassport} onTalkToGuardian={openCompanion} />
      <LegacyView isOpen={legacy.isLegacyOpen} onClose={legacy.closeLegacy} moodState="luminous" onOpenPassport={openPassport} onOpenLifeMap={openLifeMapFromCompanion} onOpenGround={openGroundFromCompanion} onTalkToCompanion={openCompanion} />
      <ExportCenter isOpen={exports.isExportOpen} onClose={exports.closeExport} moodState="luminous" onOpenPassport={openPassport} />
      <RitualFlow ritual={rituals.activeRitual} isOpen={rituals.isRitualFlowOpen} onClose={rituals.closeRitualFlow} onComplete={rituals.completeRitual} onSkip={rituals.skipRitual} />
      <InAppWhisper onOpenCompanion={openCompanion} onOpenGround={openGroundFromCompanion} onOpenRitual={suggestSmallRitual} onOpenPassport={openPassport} onOpenLifeMap={openLifeMapFromCompanion} onOpenMirror={openMirrorFromCompanion} onOpenShadow={openShadowFromCompanion} onOpenLegacy={openLegacyFromCompanion} />
      <UraiOnboardingFlow isOpen={onboardingOpen} onComplete={onboarding.completeOnboarding} onSkip={onboarding.skipOnboarding} onOpenPassport={openPassport} onOpenLifeMapPreview={openLifeMapFromCompanion} onOpenGroundPreview={openGroundFromCompanion} onOpenCompanion={openCompanion} onEnableSound={enableOnboardingSound} onKeepSoundOff={keepOnboardingSoundOff} onEnableNotifications={enableInAppWhispersOnly} onKeepNotificationsOff={keepNotificationsOff} />
      <UraiSettingsControlMenu isOpen={settings.isSettingsOpen} onClose={settings.closeSettings} onOpenPassport={openPassport} onOpenExportCenter={openExportFromCompanion} />
      <UraiCompanionShell isOpen={isCompanionOpen} onClose={closeCompanion} initialMode="companion" moodState="luminous" onOpenLifeMap={openLifeMapFromCompanion} onOpenPassport={openPassport} onOpenGround={openGroundFromCompanion} onOpenMirror={openMirrorFromCompanion} onOpenShadow={openShadowFromCompanion} onOpenLegacy={openLegacyFromCompanion} onOpenExport={openExportFromCompanion} onOpenSettings={openSettingsFromCompanion} onSuggestRitual={suggestSmallRitual} />
    </section>
  );
}
