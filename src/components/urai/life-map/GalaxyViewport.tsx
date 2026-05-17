"use client";

import type { PointerEventHandler, ReactNode, WheelEventHandler } from "react";

export function GalaxyViewport({
  children,
  onWheel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  children: ReactNode;
  onWheel: WheelEventHandler<HTMLElement>;
  onPointerDown: PointerEventHandler<HTMLElement>;
  onPointerMove: PointerEventHandler<HTMLElement>;
  onPointerUp: PointerEventHandler<HTMLElement>;
}) {
  return (
    <section
      className="urai-galaxy-viewport"
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {children}
    </section>
  );
}
