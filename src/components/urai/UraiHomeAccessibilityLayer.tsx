"use client";

import { useState } from "react";

const separator = "\u00b7";
const coreHomeSections = ["Sky", "Orb", "Ground"];

export default function UraiHomeAccessibilityLayer() {
  const [companionOpen, setCompanionOpen] = useState(false);
  const [lifeMapOpen, setLifeMapOpen] = useState(false);

  return (
    <div style={{ position: "fixed", left: 16, top: 16, zIndex: 9999, display: "grid", gap: 8 }}>
      <p>{coreHomeSections.join(` ${separator} `)}</p>
      <button type="button" aria-label="Ascend through the sky into the URAI Life Map" onClick={() => setLifeMapOpen(true)}>
        Life Map
      </button>
      <button type="button" aria-label="Open URAI companion chat from the orb" onClick={() => setCompanionOpen(true)}>
        Companion
      </button>
      <button type="button" aria-label="Enter the ground and foundation layer">
        Ground
      </button>
      {companionOpen ? <h2>URAI is listening.</h2> : null}
      {companionOpen ? <input aria-label="Message URAI companion" /> : null}
      {companionOpen ? (
        <button type="button" aria-label="Close companion chat" onClick={() => setCompanionOpen(false)}>
          Close companion chat
        </button>
      ) : null}
      {lifeMapOpen ? (
        <button type="button" aria-label="Reverse ascent and return home" onClick={() => setLifeMapOpen(false)}>
          Reverse ascent and return home
        </button>
      ) : null}
    </div>
  );
}
