"use client";

import { useEffect, useState } from "react";
import { loadSpatialLifeMap } from "@/lib/spatial-life-map/lifeMap.firebase";
import { spatialLifeMapMockData } from "@/lib/spatial-life-map/lifeMap.mockData";
import type { LifeMapDataset } from "@/lib/spatial-life-map/lifeMap.types";

export function useLifeMapData(userId = "demo-user") {
  const [data, setData] = useState<LifeMapDataset>(spatialLifeMapMockData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadSpatialLifeMap(userId)
      .then((nextData) => {
        if (!active) return;
        setData(nextData);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setData(spatialLifeMapMockData);
        setError("URAI loaded the local spatial galaxy fallback.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  return { data, loading, error };
}
