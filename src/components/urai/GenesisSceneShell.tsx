'use client';

import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { LegacyFrameSampler, LegacyFrameOverlay } from "@/components/urai/LegacyFrameDiagnostics";
import type { LegacyFrameMetrics } from "@/lib/runtime/frame-diagnostics";
import { PortalNav, PortalNavProps } from "@/components/urai/PortalNav";
import { UraiScene } from "@/lib/urai/scene-theme";


type GenesisSceneShellProps = {
  children: React.ReactNode;
  onNavigate: (scene: UraiScene) => void;
  onOpenOrbChat: () => void;
  activeScene: PortalNavProps['activeScene'];
};

export function GenesisSceneShell({ children, onNavigate, onOpenOrbChat, activeScene }: GenesisSceneShellProps) {
  const [frameMetrics, setFrameMetrics] = useState<LegacyFrameMetrics | null>(null);
  return (
    <div className="fixed inset-0">
      <Canvas>
        <Suspense fallback={null}>
          {children}
        </Suspense>
        <LegacyFrameSampler onSample={setFrameMetrics} />
      </Canvas>

      <LegacyFrameOverlay sample={frameMetrics} />
      <PortalNav onNavigate={onNavigate} activeScene={activeScene} />
    </div>
  );
}
