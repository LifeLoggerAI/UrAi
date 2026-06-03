"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { getDemoProfile, URAI_DEMO_DATA } from "@/lib/demo/demoDataRegistry";
import type { DemoProfile, UraiDemoData, UraiDemoMode } from "@/lib/demo/demoTypes";
import { createDemoPassportProfile, type DemoPassportProfile } from "@/lib/demo/createDemoPassportProfile";

type UraiDemoContextValue = {
  demoMode: UraiDemoMode;
  demoProfile: DemoProfile;
  isDemo: boolean;
  isPublicDemo: boolean;
  isFounderDemo: boolean;
  demoData: UraiDemoData;
  enableDemoMode: (mode?: UraiDemoMode, profileId?: string) => void;
  disableDemoMode: () => void;
  getDemoLifeMapData: () => UraiDemoData["lifeMapStars"];
  getDemoGroundData: () => UraiDemoData["groundElements"];
  getDemoMirrorSession: () => UraiDemoData["mirrorReflections"];
  getDemoLegacyArchive: () => UraiDemoData["legacyChapters"];
  getDemoPassportProfile: () => DemoPassportProfile;
};

const UraiDemoContext = createContext<UraiDemoContextValue | null>(null);

export function UraiDemoProvider({ children, initialMode = "off", profileId = "public" }: { children: ReactNode; initialMode?: UraiDemoMode; profileId?: string }) {
  const [demoMode, setDemoMode] = useState<UraiDemoMode>(initialMode);
  const [activeProfileId, setActiveProfileId] = useState(profileId);
  const demoProfile = useMemo(() => getDemoProfile(activeProfileId), [activeProfileId]);
  const demoPassportProfile = useMemo(() => createDemoPassportProfile(), []);

  const value = useMemo<UraiDemoContextValue>(() => ({
    demoMode,
    demoProfile,
    isDemo: demoMode !== "off",
    isPublicDemo: demoMode === "public_demo",
    isFounderDemo: demoMode === "founder_demo",
    demoData: URAI_DEMO_DATA,
    enableDemoMode: (mode = "public_demo", nextProfileId = "public") => { setDemoMode(mode); setActiveProfileId(nextProfileId); },
    disableDemoMode: () => setDemoMode("off"),
    getDemoLifeMapData: () => URAI_DEMO_DATA.lifeMapStars,
    getDemoGroundData: () => URAI_DEMO_DATA.groundElements,
    getDemoMirrorSession: () => URAI_DEMO_DATA.mirrorReflections,
    getDemoLegacyArchive: () => URAI_DEMO_DATA.legacyChapters,
    getDemoPassportProfile: () => demoPassportProfile,
  }), [demoMode, demoPassportProfile, demoProfile]);

  return <UraiDemoContext.Provider value={value}>{children}</UraiDemoContext.Provider>;
}

export function useUraiDemo(): UraiDemoContextValue {
  const context = useContext(UraiDemoContext);
  if (!context) {
    return {
      demoMode: "off",
      demoProfile: getDemoProfile("public"),
      isDemo: false,
      isPublicDemo: false,
      isFounderDemo: false,
      demoData: URAI_DEMO_DATA,
      enableDemoMode: () => undefined,
      disableDemoMode: () => undefined,
      getDemoLifeMapData: () => URAI_DEMO_DATA.lifeMapStars,
      getDemoGroundData: () => URAI_DEMO_DATA.groundElements,
      getDemoMirrorSession: () => URAI_DEMO_DATA.mirrorReflections,
      getDemoLegacyArchive: () => URAI_DEMO_DATA.legacyChapters,
      getDemoPassportProfile: () => createDemoPassportProfile(),
    };
  }
  return context;
}
