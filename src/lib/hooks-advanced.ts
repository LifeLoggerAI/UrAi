// lib/hooks-advanced.ts
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import {
  getExportUrl,
  listExports,
  listForecasts,
  listDigests,
  listShadowMetrics,
  listObscuraMetrics,
  listHealthData,
  listRelationshipEdges,
  listLegacyScrolls,
  listWhatIf,
  updateCompanionState,
  type CursorStr,
  type CursorNum,
  type CursorTS,
} from "./queries";
import { doc, onSnapshot } from "firebase/firestore";

// ---------- Shared auth hook ----------
export function useAuthUid() {
  const [uid, setUid] = useState<string | null>(auth.currentUser?.uid ?? null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUid(u?.uid ?? null));
    return () => unsub();
  }, []);
  return uid;
}

// ---------- Pagination helper factory ----------
function usePaginatedFetcher<TCursor, TItem>(
  enabled: boolean,
  fetchPage: (cursor?: TCursor) => Promise<{ items: any[]; nextCursor?: TCursor }>,
  deps: any[] = []
) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cursorRef = useRef<TCursor | undefined>(undefined);

  const loadMore = async () => {
    if (!enabled || end || loading) return;
    setLoading(true);
    setError(null);
    try {
      const { items: page, nextCursor } = await fetchPage(cursorRef.current);
      setItems(prev => [...prev, ...page]);
      cursorRef.current = nextCursor;
      if (!nextCursor || page.length === 0) setEnd(true);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load page");
    } finally {
      setLoading(false);
    }
  };

  // Reset when deps change
  useEffect(() => {
    setItems([]);
    setEnd(false);
    setError(null);
    cursorRef.current = undefined;
    if (enabled) void loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    items,
    loading,
    end,
    error,
    loadMore,
    reset: () => {
      setItems([]);
      setEnd(false);
      setError(null);
      cursorRef.current = undefined;
    },
  };
}

// ========== Exports (weekly scrolls) ==========
export function useExports(pageSize = 12) {
  const uid = useAuthUid();
  return usePaginatedFetcher<CursorStr, any>(
    !!uid,
    cursor => listExports(pageSize, cursor),
    [uid, pageSize]
  );
}

// Helper to compute a Storage URL for an export file
export function useExportFileUrl(weekKey: string | null, fileName: string | null) {
  const uid = useAuthUid();
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!uid || !weekKey || !fileName) {
        setUrl(null);
        return;
      }
      setLoading(true);
      try {
        const u = await getExportUrl(weekKey, fileName);
        if (!cancelled) setUrl(u);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid, weekKey, fileName]);
  return { url, loading };
}

// Helper to get both alpha video URLs at once
export function useExportAlphaUrls(weekKey: string | null) {
  const webm = useExportFileUrl(weekKey, "scroll_alpha.webm");
  const hevc = useExportFileUrl(weekKey, "scroll_alpha_hevc.mp4");
  return { webmUrl: webm.url, hevcUrl: hevc.url, loading: webm.loading || hevc.loading };
}


// ========== Forecasts & Digests ==========
export function useForecasts(limitCount = 14) {
  const uid = useAuthUid();
  return usePaginatedFetcher<CursorStr, any>(
    !!uid,
    cursor => listForecasts(limitCount, cursor),
    [uid, limitCount]
  );
}
export function useDigests(limitCount = 12) {
  const uid = useAuthUid();
  return usePaginatedFetcher<CursorStr, any>(
    !!uid,
    cursor => listDigests(limitCount, cursor),
    [uid, limitCount]
  );
}

// ========== Shadow / Obscura ==========
export function useShadowMetrics(limitCount = 12) {
  const uid = useAuthUid();
  return usePaginatedFetcher<CursorStr, any>(
    !!uid,
    cursor => listShadowMetrics(limitCount, cursor),
    [uid, limitCount]
  );
}
export function useObscuraMetrics(limitCount = 12) {
  const uid = useAuthUid();
  return usePaginatedFetcher<CursorStr, any>(
    !!uid,
    cursor => listObscuraMetrics(limitCount, cursor),
    [uid, limitCount]
  );
}

// ========== Health & Relationships ==========
export function useHealthData(limitCount = 30) {
  const uid = useAuthUid();
  return usePaginatedFetcher<CursorStr, any>(
    !!uid,
    cursor => listHealthData(limitCount, cursor),
    [uid, limitCount]
  );
}
export function useRelationshipEdges(limitCount = 100) {
  const uid = useAuthUid();
  return usePaginatedFetcher<CursorNum, any>(
    !!uid,
    cursor => listRelationshipEdges(limitCount, cursor),
    [uid, limitCount]
  );
}

// ========== Legacy Scrolls & What-If ==========
export function useLegacyScrolls(limitCount = 12) {
  const uid = useAuthUid();
  return usePaginatedFetcher<CursorTS, any>(
    !!uid,
    cursor => listLegacyScrolls(limitCount, cursor),
    [uid, limitCount]
  );
}
export function useWhatIf(limitCount = 12) {
  const uid = useAuthUid();
  return usePaginatedFetcher<CursorTS, any>(
    !!uid,
    cursor => listWhatIf(limitCount, cursor),
    [uid, limitCount]
  );
}

// ========== Companion State ==========
// One doc per user at: /companion/{uid}
export function useCompanionState() {
  const uid = useAuthUid();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(!!uid);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ref = doc(db, "companion", uid);
    const unsub = onSnapshot(
      ref,
      snap => {
        setData(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        setLoading(false);
      },
      e => {
        setError(e?.message ?? "Failed to load companion");
        setLoading(false);
      }
    );
    return () => unsub();
  }, [uid]);

  const update = async (partial: Record<string, any>) => {
    if (!uid) throw new Error("Not authenticated");
    return updateCompanionState(partial);
  };
  return { data, loading, error, update };
}
