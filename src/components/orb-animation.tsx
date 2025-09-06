
'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

type OrbAnimationProps = {
  className?: string;
  style?: React.CSSProperties;
};

export default function OrbAnimation({ className, style }: OrbAnimationProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/orb-animation.json')
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className={cn('flex items-center justify-center text-muted-foreground', className)}
        style={style}
      >
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <div className={cn('relative w-full h-full', className)} style={style} />;
}
