'use client';
import { seedDemoDataAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, TestTube2 } from 'lucide-react';

export default function DevSeedClient() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsLoading(true);
    const result = await seedDemoDataAction();
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: result.error,
      });
    } else {
      toast({
        title: 'Seeding Complete!',
        description:
          'Demo data has been seeded successfully. Please refresh the page.',
      });
    }
    setIsLoading(false);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 1000 }}
    >
      <Button onClick={handleSeed} disabled={isLoading} variant="destructive" size="sm">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <TestTube2 className="mr-2 h-4 w-4" />
        )}
        {isLoading ? 'Seeding...' : 'Seed Data'}
      </Button>
    </div>
  );
}
