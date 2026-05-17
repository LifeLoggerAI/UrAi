"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type TouchEvent } from "react";
import { GALAXY_ZOOM } from "@/components/urai/motion/galaxyMotion";

export interface GalaxyCameraState {
  x: number;
  y: number;
  scale: number;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getTouchDistance(event: TouchEvent<HTMLElement>) {
  const first = event.touches[0];
  const second = event.touches[1];
  if (!first || !second) return 0;
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
}

export function useGalaxyCamera(initial: GalaxyCameraState = { x: 0, y: 0, scale: 1 }) {
  const [camera, setCamera] = useState<GalaxyCameraState>(initial);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ x: 0, y: 0, cameraX: 0, cameraY: 0 });
  const touchRef = useRef({ distance: 0, scale: initial.scale });

  const zoomByDelta = useCallback((deltaY: number) => {
    setCamera((current) => ({
      ...current,
      scale: clamp(current.scale - deltaY * GALAXY_ZOOM.wheelSensitivity, GALAXY_ZOOM.min, GALAXY_ZOOM.max),
    }));
  }, []);

  const zoomStep = useCallback((direction: 1 | -1) => {
    setCamera((current) => ({
      ...current,
      scale: clamp(current.scale + direction * GALAXY_ZOOM.keyboardStep, GALAXY_ZOOM.min, GALAXY_ZOOM.max),
    }));
  }, []);

  const recenter = useCallback(() => setCamera({ x: 0, y: 0, scale: 1 }), []);

  const focusCameraOn = useCallback((point: { x: number; y: number }, scale = 1.28) => {
    setCamera({ x: -point.x * 0.22, y: -point.y * 0.22, scale: clamp(scale, GALAXY_ZOOM.min, GALAXY_ZOOM.max) });
  }, []);

  const onPointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    setDragging(true);
    dragRef.current = { x: event.clientX, y: event.clientY, cameraX: camera.x, cameraY: camera.y };
  }, [camera.x, camera.y]);

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (!dragging) return;
    setCamera((current) => ({
      ...current,
      x: dragRef.current.cameraX + event.clientX - dragRef.current.x,
      y: dragRef.current.cameraY + event.clientY - dragRef.current.y,
    }));
  }, [dragging]);

  const onTouchStart = useCallback((event: TouchEvent<HTMLElement>) => {
    if (event.touches.length === 2) {
      touchRef.current = { distance: getTouchDistance(event), scale: camera.scale };
    }
  }, [camera.scale]);

  const onTouchMove = useCallback((event: TouchEvent<HTMLElement>) => {
    if (event.touches.length !== 2 || touchRef.current.distance <= 0) return;
    const distance = getTouchDistance(event);
    const ratio = distance / touchRef.current.distance;
    setCamera((current) => ({
      ...current,
      scale: clamp(touchRef.current.scale * ratio, GALAXY_ZOOM.min, GALAXY_ZOOM.max),
    }));
  }, []);

  const stopDrag = useCallback(() => {
    setDragging(false);
    touchRef.current = { distance: 0, scale: camera.scale };
  }, [camera.scale]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r") recenter();
      if (event.key === "+" || event.key === "=") zoomStep(1);
      if (event.key === "-") zoomStep(-1);
      if (event.key === "ArrowLeft") setCamera((current) => ({ ...current, x: current.x + 36 }));
      if (event.key === "ArrowRight") setCamera((current) => ({ ...current, x: current.x - 36 }));
      if (event.key === "ArrowUp") setCamera((current) => ({ ...current, y: current.y + 36 }));
      if (event.key === "ArrowDown") setCamera((current) => ({ ...current, y: current.y - 36 }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [recenter, zoomStep]);

  return { camera, setCamera, dragging, zoomByDelta, zoomStep, recenter, focusCameraOn, onPointerDown, onPointerMove, onTouchStart, onTouchMove, stopDrag };
}
