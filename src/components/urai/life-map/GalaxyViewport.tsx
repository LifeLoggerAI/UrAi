"use client";

import type { PointerEventHandler, ReactNode, TouchEventHandler, WheelEventHandler } from "react";

export function GalaxyViewport({
  children,
  onWheel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onTouchStart,
  onTouchMove,
}: {
  children: ReactNode;
  onWheel: WheelEventHandler<HTMLElement>;
  onPointerDown: PointerEventHandler<HTMLElement>;
  onPointerMove: PointerEventHandler<HTMLElement>;
  onPointerUp: PointerEventHandler<HTMLElement>;
  onTouchStart?: TouchEventHandler<HTMLElement>;
  onTouchMove?: TouchEventHandler<HTMLElement>;
}) {
  return (
    <section
      className="urai-galaxy-viewport"
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onPointerUp as unknown as TouchEventHandler<HTMLElement>}
    >
      {children}
    </section>
  );
}
