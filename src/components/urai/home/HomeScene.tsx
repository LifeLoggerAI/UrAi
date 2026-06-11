'use client';

import { GenesisSceneShell } from "@/components/urai/GenesisSceneShell";

type HomeSceneProps = {
  ascentTarget?: string;
};

export function HomeScene(_props: HomeSceneProps) {
  return (
    <GenesisSceneShell
      onNavigate={() => {}}
      onOpenOrbChat={() => {}}
      activeScene="home"
    >
      <></>
    </GenesisSceneShell>
  );
}
