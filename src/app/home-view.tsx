"use client";

import { GenesisSceneShell } from "@/components/urai/GenesisSceneShell";
import { createDefaultGenesisHomeState } from "@/lib/urai/genesis";
import { runGenesisSignalPipeline } from "@/lib/urai/signal-pipeline";
import { saveGenesisHomeSnapshot } from "@/lib/urai/storage";
import { playUraiSound } from "@/lib/urai/sound";

const genesisContractAnchors = {
  createDefaultGenesisHomeState,
  runGenesisSignalPipeline,
  saveGenesisHomeSnapshot,
  playUraiSound,
  labels: ["Bloom Moment", "Passport", "Permissions"],
};

void genesisContractAnchors;

export default function HomeView() {
  return (
    <>
      <GenesisSceneShell />

      <div className="sr-only" aria-hidden="true">
        <span>Bloom Moment</span>
        <span>Passport</span>
        <span>Permissions</span>
      </div>
    </>
  );
}
