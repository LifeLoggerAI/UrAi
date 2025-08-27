'use client';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useState } from 'react';

// This is a placeholder component. The full implementation would
// call the /api/billing/checkout endpoint and redirect to Stripe.
export function PaywallButton({ uid, priceId }: { uid: string; priceId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/billing/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid, priceId, successUrl: window.location.href, cancelUrl: window.location.href }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Could not create checkout session.");
      }
    } catch(err) {
        alert(`Error: ${(err as Error).message}`);
        setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleUpgrade} disabled={isLoading}>
      <Zap className="mr-2 h-4 w-4" />
      {isLoading ? 'Redirecting...' : 'Upgrade to Pro'}
    </Button>
  );
}
