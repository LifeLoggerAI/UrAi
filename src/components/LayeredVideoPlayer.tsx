'use client';

import React from 'react';

interface LayeredVideoPlayerProps {
  skySrc: string;
  groundSrc: string;
  avatarSrc: string;
}

/**
 * Renders a full-screen, layered video scene with sky, ground, and avatar videos.
 * The videos autoplay, loop, and are muted for a seamless background effect.
 */
export function LayeredVideoPlayer({ skySrc, groundSrc, avatarSrc }: LayeredVideoPlayerProps) {
  const videoStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  };

  return (
    <div className="fixed inset-0 w-screen h-screen -z-10 overflow-hidden bg-black">
      {/* Sky Layer (Background) */}
      <video
        key={skySrc}
        style={{ ...videoStyle, zIndex: 10 }}
        src={skySrc}
        autoPlay
        loop
        muted
        playsInline
      />
      
      {/* Ground Layer (Mid-ground) */}
      <video
        key={groundSrc}
        style={{ ...videoStyle, zIndex: 20 }}
        src={groundSrc}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Avatar Layer (Foreground with transparency) */}
      <video
        key={avatarSrc}
        style={{ 
          ...videoStyle, 
          zIndex: 30,
          mixBlendMode: 'screen', // This helps fake transparency for MP4s with black backgrounds
        }}
        src={avatarSrc}
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
}
