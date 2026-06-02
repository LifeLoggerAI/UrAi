"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, type DocumentData } from "firebase/firestore";

import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { DEFAULT_HOME_WORLD_STATE, normalizeHomeWorldState, type HomeWorldState } from "@/lib/home-world";

function withSourceFallback(source: DocumentData | undefined, uid?: string): HomeWorldState {
  return normalizeHomeWorldState(source as Record<string, unknown> | undefined, uid ?? DEFAULT_HOME_WORLD_STATE.userId);
}

export function useUraiHomeWorldState(): HomeWorldState {
  const [state, setState] = useState<HomeWorldState>(DEFAULT_HOME_WORLD_STATE);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setState(DEFAULT_HOME_WORLD_STATE);
      return undefined;
    }

    let unsubscribeHomeWorld: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth(), (user) => {
      unsubscribeHomeWorld?.();
      unsubscribeHomeWorld = undefined;

      if (!user) {
        setState(DEFAULT_HOME_WORLD_STATE);
        return;
      }

      const homeWorldRef = doc(db(), "users", user.uid, "homeWorld", "state");
      unsubscribeHomeWorld = onSnapshot(
        homeWorldRef,
        (snapshot) => {
          setState(withSourceFallback(snapshot.exists() ? snapshot.data() : undefined, user.uid));
        },
        () => {
          setState({ ...DEFAULT_HOME_WORLD_STATE, userId: user.uid, moodState: "calm", recoveryState: "stable" });
        }
      );
    });

    return () => {
      unsubscribeHomeWorld?.();
      unsubscribeAuth();
    };
  }, []);

  return useMemo(() => state, [state]);
}
