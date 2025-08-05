import { Frown, Meh, Smile } from 'lucide-react';
import type { Sentiment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function SentimentIcon({ sentiment }: { sentiment: Sentiment }) {
  const baseClassName = 'h-5 w-5 capitalize';

  const renderIcon = () => {
    switch (sentiment) {
      case 'positive':
        return <Smile className={cn(baseClassName, 'text-chart-2')} />;
      case 'negative':
        return <Frown className={cn(baseClassName, 'text-chart-5')} />;
      case 'neutral':
        return <Meh className={cn(baseClassName, 'text-chart-4')} />;
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{renderIcon()}</TooltipTrigger>
        <TooltipContent>
          <p>Sentiment: {sentiment}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
