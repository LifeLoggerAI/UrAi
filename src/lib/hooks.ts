// lib/hooks.ts
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import {
  listTimelinePage,
  listInsights,
  createRitual,
  type CursorTS,
} from "./queries";
import { onSnapshot, query, where, orderBy, limit, collection, doc } from "firebase/firestore";
import { db } from "./firebase";

export function useAuthUid() {
  const [uid, setUid] = useState<string | null>(auth.currentUser?.uid ?? null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUid(u?.uid ?? null));
    return () => unsub();
  }, []);
  return uid;
}

export function watchInsights(onChange: (docs: any[]) => void) {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {};
  const qy = query(
    collection(db, "insights"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  const unsub = onSnapshot(qy, snap => {
    onChange(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
  return unsub;
}

export function watchTimeline(onChange: (docs: any[]) => void, page = 50) {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {};
  const qy = query(
    collection(db, "timelineEvents"),
    where("uid", "==", uid),
    orderBy("timestamp", "desc"),
    limit(page)
  );
  const unsub = onSnapshot(qy, snap => {
    onChange(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
  return unsub;
}

export function useRealtimeInsights() {
  const uid = useAuthUid();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    const u = watchInsights(setData);
    setLoading(false);
    return () => u && u();
  }, [uid]);
  return { data, loading };
}

export function useRealtimeTimeline(size = 50) {
  const uid = useAuthUid();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    const u = watchTimeline(setData, size);
    setLoading(false);
    return () => u && u();
  }, [uid, size]);
  return { data, loading };
}

export function usePaginatedTimeline(pageSize = 25) {
  const uid = useAuthUid();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const cursorRef = useRef<CursorTS>(undefined);
  const loadMore = async () => {
    if (!uid || end || loading) return;
    setLoading(true);
    const { items: page, nextCursor } = await listTimelinePage(
      pageSize,
      cursorRef.current || undefined
    );
    setItems(p => [...p, ...page]);
    cursorRef.current = nextCursor;
    setEnd(!nextCursor || page.length < pageSize);
    setLoading(false);
  };
  useEffect(() => {
    setItems([]);
    cursorRef.current = undefined;
    setEnd(false);
    if (uid) void loadMore();
  }, [uid, pageSize]);
  return { items, loading, end, loadMore };
}

export function useInsightsPage(pageSize = 20) {
  const uid = useAuthUid();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const cursorRef = useRef<any>(undefined);
  const loadMore = async () => {
    if (!uid || end || loading) return;
    setLoading(true);
    const { items: page, nextCursor } = await listInsights(
      pageSize,
      cursorRef.current
    );
    setItems(p => [...p, ...page]);
    cursorRef.current = nextCursor;
    setEnd(!nextCursor || page.length < pageSize);
    setLoading(false);
  };
  useEffect(() => {
    setItems([]);
    cursorRef.current = undefined;
    setEnd(false);
    if (uid) void loadMore();
  }, [uid, pageSize]);
  return { items, loading, end, loadMore };
}

export function useCreateRitual() {
  const uid = useAuthUid();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const create = async (input: { title: string; notes?: string }) => {
    if (!uid) {
      setError("Not authenticated");
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      return await createRitual(input);
    } catch (e: any) {
      setError(e?.message ?? "Failed to create ritual");
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { create, loading, error };
}