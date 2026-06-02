"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { UraiCompanionShell } from "@/components/companion/UraiCompanionShell";
import { AssetPreloader } from "@/components/genesis/AssetPreloader";
import { LayeredGenesisScene } from "@/components/genesis/LayeredGenesisScene";
import { PortalNav } from "@/components/urai/PortalNav";
import { SceneCopy } from "@/components/urai/SceneCopy";

type HomeSceneProps = {
  onNavigate: (scene: UraiScene) => void;
  onOpenOrbChat?: () => void;
};

export function HomeScene({ onNavigate, onOpenOrbChat }: HomeSceneProps) {
  const router = useRouter();
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);

  const openCompanion = useCallback(() => {
    onOpenOrbChat?.();
    setIsCompanionOpen(true);
  }, [onOpenOrbChat]);

  const closeCompanion = useCallback(() => {
    setIsCompanionOpen(false);
  }, []);

  const navigateFromCompanion = useCallback((scene: UraiScene) => {
    setIsCompanionOpen(false);
    onNavigate(scene);
  }, [onNavigate]);

  const openPassport = useCallback(() => {
    setIsCompanionOpen(false);
    router.push("/passport");
  }, [router]);

  return (
    <section className="relative z-10 min-h-screen w-full overflow-hidden">
      <AssetPreloader>
        <LayeredGenesisScene
          moodState="luminous"
          onSkyOpen={() => onNavigate("life-map")}
          onOrbOpen={openCompanion}
          onGroundOpen={() => onNavigate("ground")}
          onPassportOpen={openPassport}
          isCompanionOpen={isCompanionOpen}
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

      <UraiCompanionShell
        isOpen={isCompanionOpen}
        onClose={closeCompanion}
        initialMode="companion"
        moodState="luminous"
        onOpenLifeMap={() => navigateFromCompanion("life-map")}
        onOpenPassport={openPassport}
      />
    </section>
  );
}
