"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import type { UraiResolvedAsset } from "@/lib/urai-assets";

type Props = {
  asset: UraiResolvedAsset;
  className?: string;
  style?: CSSProperties;
};

const FALLBACK_SVG = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="urai-fallback-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="60%" stop-color="#7EE7FF" stop-opacity="0.45"/><stop offset="100%" stop-color="#7B61FF" stop-opacity="0"/></radialGradient></defs><circle cx="256" cy="256" r="220" fill="url(#urai-fallback-g)"/><circle cx="256" cy="256" r="88" fill="rgba(255,255,255,.55)"/></svg>`;

function InlineFallback({ className, style, alt }: { className?: string; style?: CSSProperties; alt: string }) {
  return (
    <span
      className={className}
      style={{ display: "block", ...style }}
      role="img"
      aria-label={alt}
      dangerouslySetInnerHTML={{ __html: FALLBACK_SVG }}
    />
  );
}

export function ResolvedVisual({ asset, className, style }: Props) {
  if (asset.svg) {
    return (
      <span
        className={className}
        style={{ display: "block", ...style }}
        role="img"
        aria-label={asset.alt}
        dangerouslySetInnerHTML={{ __html: asset.svg }}
      />
    );
  }

  if (asset.src) {
    return (
      <Image
        className={className}
        style={{ objectFit: "contain", ...style }}
        src={asset.src}
        alt={asset.alt}
        width={512}
        height={512}
        priority
        unoptimized
        onError={(event) => {
          const target = event.currentTarget;
          target.style.display = "none";

          const fallback = document.createElement("span");
          fallback.innerHTML = FALLBACK_SVG;
          fallback.setAttribute("aria-label", asset.alt);
          fallback.setAttribute("role", "img");

          target.parentElement?.appendChild(fallback);
        }}
      />
    );
  }

  return <InlineFallback className={className} style={style} alt={asset.alt} />;
}
