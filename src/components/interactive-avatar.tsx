'use client';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Loader2 } from 'lucide-react';

type BodyZone = 'head' | 'torso' | 'arms' | 'legs' | 'aura';
type AvatarProps = {
  mood: number; // -1 to 1
  onZoneClick: (zone: BodyZone) => void;
  isLoading?: boolean;
  overlayColor?: string;
  overlayStyle?: string;
};

export function InteractiveAvatar({
  mood,
  onZoneClick,
  isLoading = false,
  overlayColor,
  overlayStyle,
}: AvatarProps) {
  // Default hue calculation if no overlay is present
  const defaultHue = (mood + 1) * 60; // maps -1..1 to 0..120
  const auraColor = overlayColor || `hsl(${defaultHue}, 80%, 60%)`;

  const overlayClassName = overlayStyle === 'flicker' ? 'overlay-style-flicker' : '';

  const handleZoneClick = (zone: BodyZone) => {
    if (isLoading) return;
    onZoneClick(zone);
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          'relative flex items-center justify-center w-full max-w-xs mx-auto aspect-[3/5]',
          overlayClassName
        )}
      >
        <div
          className='absolute inset-0 transition-all duration-1000'
          style={{
            filter: `drop-shadow(0 0 40px ${auraColor}) drop-shadow(0 0 15px ${auraColor})`,
            opacity: 0.5 + Math.abs(mood) * 0.5,
          }}
        />
        <svg
          viewBox='0 0 100 160'
          className='relative w-full h-full'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <filter id='glow'>
              <feGaussianBlur stdDeviation='3.5' result='coloredBlur' />
              <feMerge>
                <feMergeNode in='coloredBlur' />
                <feMergeNode in='SourceGraphic' />
              </feMerge>
            </filter>
          </defs>

          {/* Aura - clickable background */}
          <Tooltip>
            <TooltipTrigger asChild>
              <rect
                width='100'
                height='160'
                fill='transparent'
                onClick={() => handleZoneClick('aura')}
                className={cn(isLoading ? 'cursor-wait' : 'cursor-pointer')}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Aura - Overall Mood</p>
            </TooltipContent>
          </Tooltip>

          <g
            className='fill-current text-foreground/50 hover:text-foreground/80 transition-colors duration-300'
            style={{ filter: 'url(#glow)' }}
          >
            {/* Head */}
            <Tooltip>
              <TooltipTrigger asChild>
                <circle
                  cx='50'
                  cy='20'
                  r='15'
                  onClick={() => handleZoneClick('head')}
                  className={cn(isLoading ? 'cursor-wait' : 'cursor-pointer')}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Head - Dreams & Thoughts</p>
              </TooltipContent>
            </Tooltip>

            {/* Torso */}
            <Tooltip>
              <TooltipTrigger asChild>
                <path
                  d='M35,40 Q50,35 65,40 L70,90 Q50,100 30,90 Z'
                  onClick={() => handleZoneClick('torso')}
                  className={cn(isLoading ? 'cursor-wait' : 'cursor-pointer')}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Torso - Emotions & Memories</p>
              </TooltipContent>
            </Tooltip>

            {/* Arms */}
            <Tooltip>
              <TooltipTrigger asChild>
                <g
                  onClick={() => handleZoneClick('arms')}
                  className={cn(isLoading ? 'cursor-wait' : 'cursor-pointer')}
                >
                  <rect x='20' y='45' width='10' height='70' rx='5' />
                  <rect x='70' y='45' width='10' height='70' rx='5' />
                </g>
              </TooltipTrigger>
              <TooltipContent>
                <p>Arms - Actions & Connections</p>
              </TooltipContent>
            </Tooltip>

            {/* Legs */}
            <Tooltip>
              <TooltipTrigger asChild>
                <g
                  onClick={() => handleZoneClick('legs')}
                  className={cn(isLoading ? 'cursor-wait' : 'cursor-pointer')}
                >
                  <rect x='35' y='95' width='10' height='60' rx='5' />
                  <rect x='55' y='95' width='10' height='60' rx='5' />
                </g>
              </TooltipTrigger>
              <TooltipContent>
                <p>Legs - Movement & Direction</p>
              </TooltipContent>
            </Tooltip>
          </g>
        </svg>

        {isLoading && (
          <div className='absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg backdrop-blur-sm z-20'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
