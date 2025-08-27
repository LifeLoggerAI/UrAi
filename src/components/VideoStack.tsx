import React from "react";

type Props = { skySrc: string; groundSrc: string; avatarSrc: string };

export default function VideoStack({ skySrc, groundSrc, avatarSrc }: Props) {
  return (
    <div style={{
      position: "fixed", inset: 0, width: "100vw", height: "100vh",
      overflow: "hidden", background: "black"
    }}>
      <VideoLayer src={skySrc} z={1} />
      <VideoLayer src={groundSrc} z={2} />
      <VideoLayer src={avatarSrc} z={3} style={{
        width: 600, left: "50%", transform: "translateX(-50%)", bottom: 700
      }} />
    </div>
  );
}

function VideoLayer(
  { src, z, style = {} }:
  { src: string; z: number; style?: React.CSSProperties }
) {
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      style={{
        position: "absolute",
        zIndex: z,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        ...style
      }}
    />
  );
}
