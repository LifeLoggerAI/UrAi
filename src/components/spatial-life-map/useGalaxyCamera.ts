"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { GalaxyCameraState, LifeMapZoomLevel, Vector3Tuple } from "@/lib/spatial-life-map/lifeMap.types";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function zoomToLevel(zoom: number): LifeMapZoomLevel {
  if (zoom > 10.5) return 0;
  if (zoom > 7.2) return 1;
  if (zoom > 4.8) return 2;
  if (zoom > 2.8) return 3;
  return 4;
}

export function useGalaxyCamera(initialTarget: Vector3Tuple = { x: 0, y: 0, z: 0 }, initialZoom = 8.2) {
  const [cameraState, setCameraState] = useState<GalaxyCameraState>({
    target: initialTarget,
    rotation: { x: -0.14, y: 0.08, z: 0 },
    zoom: initialZoom,
    zoomLevel: zoomToLevel(initialZoom),
  });
  const dragRef = useRef<{ x: number; y: number; active: boolean; vx: number; vy: number }>({ x: 0, y: 0, active: false, vx: 0, vy: 0 });

  const setZoom = useCallback((zoom: number) => {
    setCameraState((current) => {
      const nextZoom = clamp(zoom, 1.8, 13.5);
      return { ...current, zoom: nextZoom, zoomLevel: zoomToLevel(nextZoom) };
    });
  }, []);

  const focusPosition = useCallback((position: Vector3Tuple, zoom = 3.2) => {
    setCameraState({
      target: position,
      rotation: { x: -0.1, y: 0.05, z: 0 },
      zoom: clamp(zoom, 1.8, 13.5),
      zoomLevel: zoomToLevel(zoom),
    });
  }, []);

  const resetCamera = useCallback(() => {
    setCameraState({ target: { x: 0, y: 0, z: 0 }, rotation: { x: -0.14, y: 0.08, z: 0 }, zoom: 8.2, zoomLevel: 1 });
  }, []);

  const onWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.55 : -0.55;
    setCameraState((current) => {
      const zoom = clamp(current.zoom + delta, 1.8, 13.5);
      return { ...current, zoom, zoomLevel: zoomToLevel(zoom) };
    });
  }, []);

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    dragRef.current = { x: event.clientX, y: event.clientY, active: true, vx: 0, vy: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    drag.x = event.clientX;
    drag.y = event.clientY;
    drag.vx = dx;
    drag.vy = dy;
    setCameraState((current) => ({
      ...current,
      target: {
        x: current.target.x - dx * 0.012 * (current.zoom / 8),
        y: current.target.y + dy * 0.012 * (current.zoom / 8),
        z: current.target.z,
      },
      rotation: {
        x: clamp(current.rotation.x + dy * 0.0008, -0.45, 0.2),
        y: clamp(current.rotation.y + dx * 0.0008, -0.45, 0.45),
        z: 0,
      },
    }));
  }, []);

  const onPointerUp = useCallback((event: React.PointerEvent) => {
    dragRef.current.active = false;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer may already be released by the browser.
    }
  }, []);

  const bind = useMemo(() => ({ onWheel, onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp }), [onPointerDown, onPointerMove, onPointerUp, onWheel]);

  return { cameraState, setZoom, focusPosition, resetCamera, bind };
}
