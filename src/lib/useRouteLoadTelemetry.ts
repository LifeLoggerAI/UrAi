"use client";

import { useEffect } from "react";
import { trackRouteLoadComplete, trackRouteLoadStart, TelemetryMetadata } from "@/lib/telemetry";

export function useRouteLoadTelemetry(route: string, metadata?: TelemetryMetadata) {
  useEffect(() => {
    trackRouteLoadStart(route, metadata);
    return () => {
      trackRouteLoadComplete(route, metadata);
    };
    // metadata is intentionally excluded from deps to avoid re-emitting when object identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);
}
