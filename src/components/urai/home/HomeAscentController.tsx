"use client";

import type { ReactNode } from "react";

export function HomeAscentController({ children, onAscend, disabled = false }: { children?: ReactNode; onAscend: () => void; disabled?: boolean }) {
  return (
    <button className="urai-fullscreen-button" type="button" aria-label="Enter Memory Galaxy" disabled={disabled} onClick={onAscend}>
      {children ?? <span className="sr-only">Enter Memory Galaxy</span>}
    </button>
  );
}
