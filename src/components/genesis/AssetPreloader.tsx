"use client";

import type { ReactNode } from "react";

type AssetPreloaderProps = {
  children: ReactNode;
};

/**
 * Launch-safe asset wrapper.
 *
 * This intentionally does not fetch private user data or require the full
 * Genesis media pack. It keeps the home scene renderable while optional
 * cinematic assets are still supplied through the manifest/fallback layer.
 */
export function AssetPreloader({ children }: AssetPreloaderProps) {
  return <>{children}</>;
}

export default AssetPreloader;
