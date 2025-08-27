
'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

type OrbAnimationProps = {
  className?: string;
  loop?: boolean;
  isPaused?: boolean;
  speed?: number;
  style?: React.CSSProperties;
};

export default function OrbAnimation({
  className,
  loop = true,
  isPaused = false,
  speed = 1,
  style,
}: OrbAnimationProps) {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/orb-animation.json')
      .then(response => response.json())
      .then(data => {
        setAnimationData(data);
      })
      .catch(error => console.error('Error loading Lottie animation:', error));
  }, []);

  if (!animationData) {
    return (
      <div
        className={cn(
          'flex items-center justify-center text-muted-foreground',
          className
        )}
        style={style}
      >
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full', className)} style={style}>
      <Lottie
        animationData={animationData}
        loop={loop}
        isPaused={isPaused}
        speed={speed}
        rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
      />
      <noscript>
        <div className="flex items-center gap-2 text-sm opacity-70">
          <Loader2 className="h-4 w-4 animate-spin" /> Animation requires
          JavaScript
        </div>
      </noscript>
    </div>
  );
}
