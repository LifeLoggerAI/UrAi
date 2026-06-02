"use client";

import type { CSSProperties, ImgHTMLAttributes } from "react";
import { TRANSPARENT_PIXEL } from "@/lib/assets/uraiAssetManifest";

type SafeLayerImageProps = {
  src?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "className" | "style" | "draggable">;

export function SafeLayerImage({ src, alt = "", className, style, priority = false, ...props }: SafeLayerImageProps) {
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
      aria-hidden={alt === "" ? true : undefined}
      onError={(event) => {
        event.currentTarget.style.opacity = "0";
      }}
    />
  );
}
