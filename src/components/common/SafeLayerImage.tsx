"use client";

import { useState, type CSSProperties, type ImgHTMLAttributes } from "react";
import { TRANSPARENT_PIXEL } from "@/lib/assets/uraiAssetManifest";

type SafeLayerImageProps = {
  src?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  layerKey?: string;
  onLoad?: () => void;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "className" | "style" | "draggable" | "onLoad">;

export function SafeLayerImage({ src, alt = "", className, style, priority = false, layerKey, onLoad, ...props }: SafeLayerImageProps) {
  const [failed, setFailed] = useState(false);
  const dataLayer = process.env.NODE_ENV === "development" && layerKey ? layerKey : undefined;

  if (failed) return null;

  return (
    <img
      {...props}
      src={src || TRANSPARENT_PIXEL}
      alt={alt}
      className={className}
      style={style}
      draggable={false}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      aria-hidden={alt === "" ? true : undefined}
      data-layer={dataLayer}
      onLoad={() => onLoad?.()}
      onError={() => setFailed(true)}
    />
  );
}
