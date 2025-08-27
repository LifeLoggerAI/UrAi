"use client";
import dynamic from "next/dynamic";
const VideoLayers = dynamic(() => import("@/components/VideoLayers"), { ssr: false });

export default function Movies420() {
  return (
    <main className="w-screen h-screen">
      <VideoLayers />
    </main>
  );
}
