"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  LifeMapFilter,
  LifeMapMode,
  MemoryStar,
  QualityMode,
} from "@/lib/life-map/types";
import {
  lifeMapMockData,
  selectedBlueFogMemory,
  spatialARVRScaffold,
} from "@/lib/life-map/mock-data";
import { formatMemoryConfidence } from "@/lib/life-map/formatters";
import CanonButton from "./CanonButton";
import CanonOverlayPanel from "./CanonOverlayPanel";
import CompanionNarratorPanel from "./CompanionNarratorPanel";
import FocusMemoryView from "./FocusMemoryView";
import LifeMapControls from "./LifeMapControls";
import LifeMapFilterBar from "./LifeMapFilterBar";
import QualitySettingsPanel from "./QualitySettingsPanel";
import ReplayControls from "./ReplayControls";
import SpatialMemoryCard from "./SpatialMemoryCard";

const MemoryGalaxyCanvas = dynamic(() => import("./MemoryGalaxyCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center bg-slate-950 text-cyan-100">
      <div className="rounded-[2rem] border border-cyan-100/15 bg-slate-950/80 p-6 text-center shadow-[0_0_60px_rgba(14,165,233,.18)] backdrop-blur-2xl">
        <p className="text-sm">URAI is arranging your memory sky...</p>
      </div>
    </div>
  ),
});