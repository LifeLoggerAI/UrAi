'use client';
import React from 'react';
import { useProStatus } from '@/hooks/useProStatus';
import { PaywallButton } from './PaywallButton';
import { Skeleton } from './ui/skeleton';
import { Lock } from 'lucide-react';

// This component gates content based on the user's "pro" status.
export function RequirePro({ children, uid, priceId }: { children: React.ReactNode; uid?: string; priceId: string }) {
  const { isPro, loading } = useProStatus();

  if (loading) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (isPro) {
    return <>{children}</>;
  }

  // Pro-locked overlay
  return (
    <div className="relative border border-white/20 rounded-2xl p-4 bg-black/50 overflow-hidden">
      <div className="blur-sm select-none pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center text-center p-4">
         <Lock className="h-8 w-8 text-primary mb-2" />
         <p className="text-sm font-semibold text-foreground mb-4">This is a Pro feature</p>
        {uid && <PaywallButton uid={uid} priceId={priceId} />}
      </div>
    </div>
  );
}
