export type NarrationItem = { clipId: string; text: string };

export async function requestNarrationQueue(items: NarrationItem[], opts?: {
  voice?: string;
  languageCode?: string;
  speakingRate?: number;
  pitch?: number;
}) {
  const res = await fetch("/api/narrate-queue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, ...opts })
  });
  if (!res.ok) throw new Error(`TTS queue failed: ${res.status}`);
  const data = await res.json();
  return data.results as Record<string, { url: string; path: string }>;
}

// Preload audio elements (returns a map of clipId -> HTMLAudioElement)
export async function preloadNarrations(results: Record<string, { url: string }>) {
  const map: Record<string, HTMLAudioElement> = {};
  await Promise.all(
    Object.entries(results).map(([clipId, { url }]) => {
      return new Promise<void>((resolve, reject) => {
        const a = new Audio();
        a.src = url;
        a.preload = "auto";
        a.oncanplaythrough = () => resolve();
        a.onerror = () => reject(new Error(`failed to preload ${clipId}`));
        map[clipId] = a;
      });
    })
  );
  return map;
}

// Play a sequence in order (awaits each clip); returns a cancel function
export function playSequence(
  orderedClipIds: string[],
  audioMap: Record<string, HTMLAudioElement>
) {
  let cancelled = false;
  const controller = {
    cancel: () => {
      cancelled = true;
      orderedClipIds.forEach(id => {
        const a = audioMap[id];
        if (a && !a.paused) a.pause();
      });
    }
  };

  (async () => {
    for (const id of orderedClipIds) {
      if (cancelled) break;
      const a = audioMap[id];
      if (!a) continue;
      try {
        await a.play();                      // requires user gesture before first call
        await new Promise<void>(resolve => {
          const onEnd = () => { a.removeEventListener("ended", onEnd); resolve(); };
          a.addEventListener("ended", onEnd);
        });
      } catch { /* ignore; move to next */ }
    }
  })();

  return controller;
}
