'use client';

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Perf } from "r3f-perf";
import { PortalNav, PortalNavProps } from "@/components/urai/PortalNav";
import { UraiScene } from "@/lib/urai/scene-theme";


type GenesisSceneShellProps = {
  children: React.ReactNode;
  onNavigate: (scene: UraiScene) => void;
  onOpenOrbChat: () => void;
  activeScene: PortalNavProps['activeScene'];
};

export function GenesisSceneShell({ children, onNavigate, onOpenOrbChat, activeScene }: GenesisSceneShellProps) {
  return (
    <div className="fixed inset-0">
      <Canvas>
        <Suspense fallback={null}>
          {children}
        </Suspense>
        <Perf position="bottom-left" />
      </Canvas>

      <PortalNav onNavigate={onNavigate} activeScene={activeScene} />
    </div>
  );
}
