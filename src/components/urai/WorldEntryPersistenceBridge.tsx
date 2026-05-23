"use client";

import { useEffect } from "react";

import type { WorldEntryState } from "@/lib/world-entry";
import { saveWorldEntry } from "@/lib/world-persistence";

export default function WorldEntryPersistenceBridge({ entryState }: { entryState: WorldEntryState }) {
  useEffect(() => {
    if (entryState.kind !== "default") {
      saveWorldEntry(entryState);
    }
  }, [entryState]);

  return null;
}
