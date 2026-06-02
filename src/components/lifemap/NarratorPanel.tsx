"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildNarratorResponse,
  type NarratorResponse,
  type NarratorResponseContext,
} from "./narratorResponseEngine";
import { useEmotionalTone } from "./useEmotionalTone";

function speak(response: NarratorResponse) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(response.line);
  utterance.rate = response.pace === "quick" ? 1.08 : response.pace === "slow" ? 0.86 : 0.98;
  utterance.volume = response.intensity === "high" ? 0.95 : response.intensity === "medium" ? 0.78 : 0.62;
  utterance.pitch = response.voiceStyle === "urgent" ? 1.05 : response.voiceStyle === "restorative" ? 0.88 : 0.96;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function NarratorPanel() {
  const tone = useEmotionalTone();
  const [enabled, setEnabled] = useState(false);
  const [response, setResponse] = useState<NarratorResponse>(() =>
    buildNarratorResponse({ tone }),
  );

  const baseline = useMemo(() => buildNarratorResponse({ tone }), [tone]);

  useEffect(() => {
    setResponse(baseline);
  }, [baseline]);

  useEffect(() => {
    const onNarratorEvent = (event: Event) => {
      const customEvent = event as CustomEvent<Partial<NarratorResponseContext>>;
      const next = buildNarratorResponse({ tone, ...customEvent.detail });
      setResponse(next);
      if (enabled) speak(next);
    };

    window.addEventListener("urai:narrator-event", onNarratorEvent);
    return () => window.removeEventListener("urai:narrator-event", onNarratorEvent);
  }, [enabled, tone]);

  return (
    <aside className="narrator-panel" aria-live="polite">
      <div>
        <strong>Narrator</strong>
        <span>{response.voiceStyle} · {response.pace}</span>
      </div>
      <p>{response.line}</p>
      <button
        type="button"
        onClick={() => {
          const nextEnabled = !enabled;
          setEnabled(nextEnabled);
          if (nextEnabled) speak(response);
          else if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
        }}
      >
        {enabled ? "Voice on" : "Voice off"}
      </button>
      <style jsx>{`
        .narrator-panel {
          position: absolute;
          left: 1rem;
          bottom: 1rem;
          z-index: 60;
          max-width: 22rem;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 1rem;
          background: rgba(0, 0, 0, 0.52);
          color: white;
          padding: 0.85rem;
          backdrop-filter: blur(10px);
        }
        .narrator-panel div {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          font-size: 0.8rem;
          opacity: 0.86;
        }
        .narrator-panel p {
          margin: 0.45rem 0 0.65rem;
          line-height: 1.45;
        }
        .narrator-panel button {
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          padding: 0.35rem 0.7rem;
          cursor: pointer;
        }
      `}</style>
    </aside>
  );
}
