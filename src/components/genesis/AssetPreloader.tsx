"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CRITICAL_GENESIS_ASSET_KEYS, getAssetPath, type UraiAssetKey } from "@/lib/assets/uraiAssetManifest";

const MIN_FADE_MS = 900;
const FAIL_SAFE_MS = 1200;

type AssetPreloaderProps = {
  children: ReactNode;
  assets?: UraiAssetKey[];
  reducedSensoryMode?: boolean;
};

export function AssetPreloader({ children, assets = CRITICAL_GENESIS_ASSET_KEYS, reducedSensoryMode = false }: AssetPreloaderProps) {
  const [ready, setReady] = useState(reducedSensoryMode);
  const assetPaths = useMemo(() => assets.map(getAssetPath), [assets]);

  useEffect(() => {
    if (reducedSensoryMode) {
      setReady(true);
      return;
    }

    let cancelled = false;
    const startedAt = Date.now();
    const loaders = assetPaths.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new Image();
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = src;
        }),
    );

    const failSafe = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, FAIL_SAFE_MS);

    Promise.all(loaders).then(() => {
      const remaining = Math.max(0, MIN_FADE_MS - (Date.now() - startedAt));
      window.setTimeout(() => {
        if (!cancelled) setReady(true);
      }, remaining);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(failSafe);
    };
  }, [assetPaths, reducedSensoryMode]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_50%_32%,#203963_0%,#101a38_48%,#050714_100%)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-[1100ms]"
        style={{ opacity: ready ? 0 : 1 }}
      />
      <div className="relative min-h-screen w-full transition-opacity duration-[1100ms]" style={{ opacity: ready ? 1 : 0.001 }}>
        {children}
      </div>
    </div>
  );
}
