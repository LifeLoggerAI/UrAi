"use client";

import { useEffect, useState } from "react";
import { URAI_ASSET_MANIFEST, type UraiAssetKey } from "@/lib/assets/uraiAssetManifest";

type VisualLayerInspectorProps = {
  onToggleLayer?: (key: UraiAssetKey, visible: boolean) => void;
};

const DEV_FLAG = "urai.dev.visualLayerInspector";

export function VisualLayerInspector({ onToggleLayer }: VisualLayerInspectorProps) {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (typeof window === "undefined") return;
    setEnabled(window.localStorage.getItem(DEV_FLAG) === "true");
    setVisible(Object.fromEntries(Object.keys(URAI_ASSET_MANIFEST).map((key) => [key, true])));
  }, []);

  if (process.env.NODE_ENV !== "development" || !enabled) return null;

  return (
    <aside className="fixed bottom-4 left-4 z-[9999] max-h-[60vh] w-72 overflow-auto rounded-2xl border border-white/10 bg-black/80 p-3 text-xs text-white/80 shadow-2xl backdrop-blur-xl">
      <div className="mb-2 font-medium text-white">Visual layers</div>
      <div className="space-y-1">
        {(Object.keys(URAI_ASSET_MANIFEST) as UraiAssetKey[]).map((key) => (
          <label key={key} className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.04] px-2 py-1">
            <span className="truncate">{key}</span>
            <input
              type="checkbox"
              checked={visible[key] !== false}
              onChange={(event) => {
                const checked = event.target.checked;
                setVisible((current) => ({ ...current, [key]: checked }));
                onToggleLayer?.(key, checked);
              }}
            />
          </label>
        ))}
      </div>
    </aside>
  );
}
