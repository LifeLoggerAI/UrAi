"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { UraiRemoteAssetRecord, UraiVisualSlot } from "@/lib/urai-assets";
import { URAI_DEFAULT_VISUAL_SLOTS } from "@/lib/urai-assets";

const ALLOWED_SLOTS = new Set<UraiVisualSlot>(URAI_DEFAULT_VISUAL_SLOTS);
const ASSET_COLLECTIONS = ["uraiVisualAssets", "visualAssets", "assets"] as const;

type LoadState = "idle" | "loading" | "ready" | "error" | "unconfigured";

export type UraiRemoteAssetsState = {
  assets: UraiRemoteAssetRecord[];
  state: LoadState;
  error?: string;
};

function coerceAssetRecord(raw: Record<string, unknown>, id: string): UraiRemoteAssetRecord | null {
  const rawSlot = raw.slot ?? raw.visualSlot ?? raw.key ?? id;
  if (typeof rawSlot !== "string" || !ALLOWED_SLOTS.has(rawSlot as UraiVisualSlot)) return null;

  const url = raw.url ?? raw.src ?? raw.downloadUrl ?? raw.downloadURL;
  const storageUrl = raw.storageUrl ?? raw.storageURL;
  const publicUrl = raw.publicUrl ?? raw.publicURL;
  const alt = raw.alt ?? raw.altText ?? raw.description;
  const kind = raw.kind ?? raw.type;

  return {
    slot: rawSlot as UraiVisualSlot,
    kind: typeof kind === "string" ? (kind as UraiRemoteAssetRecord["kind"]) : undefined,
    url: typeof url === "string" ? url : null,
    storageUrl: typeof storageUrl === "string" ? storageUrl : null,
    publicUrl: typeof publicUrl === "string" ? publicUrl : null,
    approved: typeof raw.approved === "boolean" ? raw.approved : true,
    active: typeof raw.active === "boolean" ? raw.active : true,
    alt: typeof alt === "string" ? alt : null,
  };
}

export function useUraiRemoteAssets(): UraiRemoteAssetsState {
  const [result, setResult] = useState<UraiRemoteAssetsState>({ assets: [], state: "idle" });

  useEffect(() => {
    let cancelled = false;

    async function loadAssets() {
      if (!isFirebaseConfigured()) {
        setResult({ assets: [], state: "unconfigured" });
        return;
      }

      setResult((current) => ({ ...current, state: "loading" }));

      try {
        const bySlot = new Map<UraiVisualSlot, UraiRemoteAssetRecord>();

        for (const collectionName of ASSET_COLLECTIONS) {
          const snapshot = await getDocs(collection(db(), collectionName));

          snapshot.forEach((doc) => {
            const record = coerceAssetRecord(doc.data() as Record<string, unknown>, doc.id);
            const hasUrl = Boolean(record?.url || record?.storageUrl || record?.publicUrl);
            if (!record || !hasUrl || record.active === false || record.approved === false) return;
            bySlot.set(record.slot, record);
          });
        }

        if (!cancelled) {
          setResult({ assets: Array.from(bySlot.values()), state: "ready" });
        }
      } catch (error) {
        if (!cancelled) {
          setResult({
            assets: [],
            state: "error",
            error: error instanceof Error ? error.message : "Unable to load URAI visual assets.",
          });
        }
      }
    }

    loadAssets();

    return () => {
      cancelled = true;
    };
  }, []);

  return result;
}
