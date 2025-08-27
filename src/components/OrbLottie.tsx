"use client";
import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

type Props = {
  jsonPath: string;               // e.g. "/assets/orb/orb.json"
  width?: number;                 // px
  height?: number;                // px
  opacity?: number;               // 0..1
  isPlaying?: boolean;            // HUD toggle
  speed?: number;                 // 0.2..3
  bottom?: number;                // absolute position (px from bottom)
};

export default function OrbLottie({
  jsonPath,
  width = 192,
  height = 192,
  opacity = 0.9,
  isPlaying = true,
  speed = 1,
  bottom = 760,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const a = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "canvas",     // IMPORTANT for export compositing
      loop: true,
      autoplay: true,
      path: jsonPath,
      rendererSettings: { clearCanvas: true, preserveAspectRatio: "xMidYMid meet" },
    });
    animRef.current = a;
    return () => { a.destroy(); };
  }, [jsonPath]);

  useEffect(() => {
    const a = animRef.current;
    if (!a) return;
    a.setSpeed(speed);
    if (isPlaying) a.play(); else a.pause();
  }, [isPlaying, speed]);

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-40"
      style={{ width, height, bottom, opacity }}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
