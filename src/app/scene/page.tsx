"use client";
import dynamic from "next/dynamic";
const VideoLayers = dynamic(() => import("@/components/VideoLayers"), { ssr: false });

export default function Scene() {
  return (
    <main className="w-screen h-screen">
      <VideoLayers />
    </main>
  );
}
