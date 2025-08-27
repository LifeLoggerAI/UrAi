
import { Button } from '@/components/ui/button';
import { Frown } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <Frown className="h-24 w-24 text-primary/50" />
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
        404 - Page Not Found
      </h1>
      <p className="mt-6 text-base leading-7 text-muted-foreground">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div className="mt-10">
        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
