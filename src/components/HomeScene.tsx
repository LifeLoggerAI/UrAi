"use client";

import GroundLayer from "@/components/GroundLayer";

export default function HomeScene() {
  return (
    <div className="relative w-full h-dvh bg-black overflow-hidden">
      {/* SKY */}
      <video
        src="/assets/sky/sky-demo.mp4"
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* GROUND (NEW SYSTEM) */}
      <GroundLayer />

      {/* AVATAR */}
      <video
        src="/assets/avatar/avatar-demo.mp4"
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-contain"
      />
    </div>
  );
}
