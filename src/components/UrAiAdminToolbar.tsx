'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { app } from "@/lib/firebase";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

// Firestore/Functions
const db = getFirestore(app);
const functions = getFunctions(app);

// UI helper
function Btn({ onClick, children, disabled=false }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded-2xl shadow-sm border text-sm ${disabled ? "bg-slate-200 text-slate-500" : "bg-slate-900 text-white hover:opacity-90"}`}
    >
      {children}
    </button>
  );
}

export default function UrAiAdminToolbar() {
  const auth = getAuth(app);
  const [uid, setUid] = useState<string>("");
  const [busy, setBusy] = useState<boolean>(false);
  const [logLines, setLogLines] = useState<string[]>([]);
  const addLog = (s: string) => setLogLines((l) => [new Date().toISOString() + " • " + s, ...l].slice(0, 400));

  // Live log stream
  const [streaming, setStreaming] = useState(false);
  const unsubRef = useRef<() => void>();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try { await signInAnonymously(auth); } catch (e) { addLog("Anon sign-in failed: " + (e as any)?.message); }
      } else {
        setUid(user.uid);
        addLog("Signed in as " + user.uid);
      }
    });
    return () => unsub();
  }, [auth]);

  // Seed demo data under current UID
  const seedDemo = async () => {
    if (!uid) return;
    setBusy(true);
    try {
      const now = new Date();
      await addDoc(collection(db, "moods"), { uid, ts: now, val: 7, sources: ["admin-toolbar"] });
      await addDoc(collection(db, "insights"), { uid, ts: now, type: "mood_shift", text: "Seeded via Admin Toolbar", confidence: 0.66 });
      await addDoc(collection(db, "voiceEvents"), { uid, startedAt: now, durationMs: 42000, tags: ["peer:alex", "support"] });
      await addDoc(collection(db, "rituals"), { uid, title: "Evening reset walk", scheduledAt: now, status: "planned" });
      await addDoc(collection(db, "dreams"), { uid, ts: now, content: "Walking through a bright forest." });
      // companionState as doc keyed by uid
      await addDoc(collection(db, "shadowPatterns"), { uid, window: "seed", score: 18, signals: { seed: 1 } });
      addLog("Seeded demo docs. Star map will mirror from insights if trigger is deployed.");
    } catch (e: any) {
      addLog("Seed failed: " + (e?.message || String(e)));
    } finally { setBusy(false); }
  };

  // Purge all docs for UID across key collections
  const purgeForUid = async () => {
    if (!uid) return;
    setBusy(true);
    try {
      const cols = ["moods", "insights", "voiceEvents", "rituals", "dreams", "shadowPatterns", "companionState", "starMapEvents", "relationships", "ritualSuggestions"] as const;
      let total = 0;
      for (const c of cols) {
        const qRef = query(collection(db, c), where("uid", "==", uid));
        const snap = await getDocs(qRef);
        if (snap.empty) { addLog(`No docs in ${c}`); continue; }
        let batch = writeBatch(db);
        let count = 0; let batchCount = 0;
        for (const d of snap.docs) {
          batch.delete(d.ref);
          batchCount++; count++; total++;
          if (batchCount >= 400) { await batch.commit(); batch = writeBatch(db); batchCount = 0; }
        }
        if (batchCount > 0) await batch.commit();
        addLog(`Purged ${count} from ${c}`);
      }
      addLog(`Purge complete. Total deleted: ${total}`);
    } catch (e: any) {
      addLog("Purge failed: " + (e?.message || String(e)));
    } finally { setBusy(false); }
  };

  // Start/stop live log stream from insights (latest 20)
  const startStream = async () => {
    if (!uid || streaming) return;
    setStreaming(true);
    const qRef = query(collection(db, "insights"), where("uid", "==", uid), orderBy("ts", "desc"), limit(20));
    unsubRef.current = onSnapshot(qRef, (snap) => {
      snap.docChanges().forEach((ch) => {
        if (ch.type === "added") addLog(`Insight ➜ ${ch.doc.data().type}: ${(ch.doc.data() as any).text?.slice(0, 80)}`);
        if (ch.type === "modified") addLog(`Insight updated: ${ch.doc.id}`);
        if (ch.type === "removed") addLog(`Insight removed: ${ch.doc.id}`);
      });
    }, (err) => addLog("Stream error: " + err.message));
    addLog("Live log stream started.");
  };
  const stopStream = () => {
    unsubRef.current?.();
    unsubRef.current = undefined;
    setStreaming(false);
    addLog("Live log stream stopped.");
  };

  // Callable: suggestRituals
  const runSuggestRituals = async () => {
    try {
      const call = httpsCallable(functions, "suggestRituals");
      const res: any = await call({});
      addLog(`suggestRituals → ${res?.data?.title} (${Math.round((res?.data?.confidence||0)*100)}%)`);
    } catch (e: any) {
      addLog("suggestRituals failed: " + (e?.message || String(e)));
    }
  };

  // Health check (proxy through your Next.js /api/health or hit Cloud Function URL directly)
  const runHealth = async () => {
    try {
      const res = await fetch("/api/health");
      addLog(`Health: ${res.status} ${await res.text()}`);
    } catch (e: any) {
      addLog("Health failed: " + (e?.message || String(e)));
    }
  };

  return (
    <div className="p-4 bg-gradient-to-b from-slate-50 to-white rounded-2xl border shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">UrAi Admin Toolbar</h2>
          <p className="text-xs text-slate-600">Seeder · Purger · Live Logs · Callables</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Target UID"
            className="px-3 py-2 rounded-xl border text-sm"
          />
          <Btn onClick={runHealth}>Health</Btn>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 bg-white border space-y-3">
          <h3 className="font-semibold">Seed & Suggestions</h3>
          <div className="flex gap-2 flex-wrap">
            <Btn onClick={seedDemo} disabled={busy}>Seed demo</Btn>
            <Btn onClick={runSuggestRituals}>suggestRituals</Btn>
          </div>
          <p className="text-xs text-slate-500">Seeds data under current UID. Ensure security rules allow writes for your user.</p>
        </div>

        <div className="rounded-2xl p-4 bg-white border space-y-3">
          <h3 className="font-semibold">Purge</h3>
          <div className="flex gap-2 flex-wrap">
            <Btn onClick={purgeForUid} disabled={busy}>Purge all for UID</Btn>
          </div>
          <p className="text-xs text-slate-500">Deletes docs for this UID in key collections. Irreversible.</p>
        </div>

        <div className="rounded-2xl p-4 bg-white border space-y-3 md:col-span-2">
          <h3 className="font-semibold">Live Logs (Insights stream)</h3>
          <div className="flex gap-2 flex-wrap">
            {!streaming ? <Btn onClick={startStream}>Start stream</Btn> : <Btn onClick={stopStream}>Stop stream</Btn>}
          </div>
          <div className="mt-3 h-56 overflow-auto text-xs font-mono bg-slate-50 border rounded-xl p-3">
            {logLines.length === 0 ? <div className="text-slate-400">No logs yet…</div> : logLines.map((l, i) => (<div key={i}>{l}</div>))}
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-500">
        Tips: If writes fail, check Firestore Rules (docs require `uid` to equal `request.auth.uid`). For Cloud Function health directly, call `https://us-central1-<project>.cloudfunctions.net/health`.
      </div>
    </div>
  );
}
