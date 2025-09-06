'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface VideoLayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  zIndex: number;
}

export function VideoLayer({ src, zIndex, className, ...props }: VideoLayerProps) {
  return (
    <video
      key={src}
      src={src as string}
      autoPlay
      muted
      loop
      playsInline
      className={cn(
        'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000',
        className
      )}
      style={{ zIndex }}
      {...props}
    />
  );
}

export default VideoLayer;

