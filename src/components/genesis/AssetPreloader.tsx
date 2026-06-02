"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { getAssetPath, type UraiAssetKey } from "@/lib/assets/uraiAssetManifest";

const CRITICAL_ASSETS: UraiAssetKey[] = [
  "skyBackground",
  "skyCloudFar",
  "skyCloudMid",
  "skyCloudNear",
  "bodySilhouetteBase",
  "bodySilhouetteGlow",
  "auraField",
  "orbCore",
  "orbGlow",
  "groundBase",
  "groundBloom",
  "foregroundVignette",
];

type AssetPreloaderProps = {
  children: ReactNode;
  assets?: UraiAssetKey[];
};

export function AssetPreloader({ children, assets = CRITICAL_ASSETS }: AssetPreloaderProps) {
  const [loaded, setLoaded] = useState(false);
  const assetPaths = useMemo(() => assets.map(getAssetPath), [assets]);

  useEffect(() => {
    let cancelled = false;
    const loaders = assetPaths.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new Image();
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = src;
        }),
    );

    Promise.all(loaders).then(() => {
      if (!cancelled) setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [assetPaths]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: loaded ? 0 : 1,
          background:
            "radial-gradient(circle at 50% 34%, rgba(32,57,99,0.74) 0%, rgba(16,26,56,0.9) 48%, rgba(5,7,20,1) 100%)",
        }}
      />
      <div className="relative min-h-screen w-full transition-opacity duration-[900ms]" style={{ opacity: loaded ? 1 : 0 }}>
        {children}
      </div>
    </div>
  );
}
