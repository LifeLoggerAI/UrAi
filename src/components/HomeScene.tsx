"use client";

import Image from "next/image";

export default function HomeScene() {
  return (
    <div className="relative w-full h-dvh bg-black overflow-hidden">
      <video
        src="/assets/sky/sky-demo.mp4"
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
      />
      <video
        src="/assets/ground/ground-demo.mp4"
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
      />
      <Image
        src="/assets/avatar/Texture.png"
        alt="Avatar preview"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
