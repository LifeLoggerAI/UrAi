// components/TransparentVideo.tsx
import React from "react";

type Props = {
  webmSrc?: string;         // VP9 + alpha
  hevcMp4Src?: string;      // HEVC + alpha (Safari)
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  poster?: string;
};

function canPlay(type: string) {
  if (typeof document === 'undefined') {
    return false;
  }
  const v = document.createElement("video");
  return !!v.canPlayType && v.canPlayType(type) !== "";
}

export default function TransparentVideo({
  webmSrc,
  hevcMp4Src,
  className,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  poster,
}: Props) {
  // Decide at render-time. Safe fallback: try HEVC on Safari, then WebM, else nothing.
  const [order, setOrder] = React.useState<string[]>([]);

  React.useEffect(() => {
    const types: string[] = [];
    // Safari first: HEVC alpha (mp4/hvc1)
    if (hevcMp4Src && canPlay('video/mp4; codecs="hvc1"')) types.push("hevc");
    // Chromium/Firefox: VP9 alpha (webm/vp9)
    if (webmSrc && canPlay('video/webm; codecs="vp9"')) types.push("webm");
    setOrder(types);
  }, [webmSrc, hevcMp4Src]);

  // If neither supported, render nothing (or a PNG fallback)
  if (order.length === 0) {
    return poster ? <img src={poster} alt="" className={className} /> : null;
  }

  // Transparent background by default: the video element shows alpha if the stream has it.
  return (
    <video
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      controls={false}
      // Make sure parent behind it is visible through transparency
      style={{ backgroundColor: "transparent", display: "block" }}
      poster={poster}
    >
      {order.includes("hevc") && hevcMp4Src && (
        <source src={hevcMp4Src} type='video/mp4; codecs="hvc1"' />
      )}
      {order.includes("webm") && webmSrc && (
        <source src={webmSrc} type='video/webm; codecs="vp9"' />
      )}
    </video>
  );
}
