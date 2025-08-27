"use client";
import { useRef, useState, useCallback } from "react";

type Status = "queued"|"loading"|"loaded"|"error";
export function useVideoPreloader(limit = 2) {
  const [status, setStatus] = useState<Record<string, Status>>({});
  const q = useRef<string[]>([]);
  const active = useRef(0);

  const run = useCallback(() => {
    if (active.current >= limit) return;
    const url = q.current.shift();
    if (!url) return;
    if (status[url] === "loaded") { run(); return; }

    active.current += 1;
    setStatus(s => ({ ...s, [url]: "loading" }));

    const v = document.createElement("video");
    v.preload = "auto";
    v.src = url;
    v.muted = true;
    v.playsInline = true;
    const done = (ok: boolean) => {
      active.current -= 1;
      setStatus(s => ({ ...s, [url]: ok ? "loaded" : "error" }));
      run();
    };
    v.oncanplaythrough = () => done(true);
    v.onerror = () => done(false);
    // kick load
    v.load();
  }, [limit, status]);

  const enqueue = useCallback((url: string) => {
    if (!url) return;
    if (status[url] === "loaded" || q.current.includes(url)) return;
    q.current.push(url);
    setStatus(s => ({ ...s, [url]: "queued" }));
    // async tick
    setTimeout(run, 0);
  }, [run, status]);

  return { status, enqueue };
}
