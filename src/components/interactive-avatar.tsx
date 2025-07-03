
'use client';

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type BodyZone = 'head' | 'torso' | 'limbs' | 'aura';
type AvatarProps = {
    mood: number; // -1 to 1
    onZoneClick: (zone: BodyZone) => void;
};

export function InteractiveAvatar({ mood, onZoneClick }: AvatarProps) {
    // mood -1 -> hsl(0, 80%, 60%) (red)
    // mood 0 -> hsl(60, 80%, 60%) (yellow)
    // mood 1 -> hsl(120, 80%, 60%) (green)
    const hue = (mood + 1) * 60; // maps -1..1 to 0..120
    const auraColor = `hsl(${hue}, 80%, 60%)`;

    return (
        <TooltipProvider>
            <div className="relative flex items-center justify-center w-full max-w-xs mx-auto aspect-[3/5]">
                <div 
                    className="absolute inset-0 transition-all duration-1000"
                    style={{
                        filter: `drop-shadow(0 0 40px ${auraColor}) drop-shadow(0 0 15px ${auraColor})`,
                        opacity: 0.5 + Math.abs(mood) * 0.5,
                    }}
                />
                <svg
                    viewBox="0 0 100 160"
                    className="relative w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Aura - clickable background */}
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <rect width="100" height="160" fill="transparent" onClick={() => onZoneClick('aura')} className="cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent><p>Aura - Overall Mood</p></TooltipContent>
                    </Tooltip>

                    <g className="fill-current text-foreground/50 hover:text-foreground/80 transition-colors duration-300" style={{ filter: 'url(#glow)' }}>
                        {/* Head */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <circle cx="50" cy="20" r="15" onClick={() => onZoneClick('head')} className="cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent><p>Head - Dreams & Thoughts</p></TooltipContent>
                        </Tooltip>

                        {/* Torso */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <path d="M35,40 Q50,35 65,40 L70,90 Q50,100 30,90 Z" onClick={() => onZoneClick('torso')} className="cursor-pointer" />
                            </TooltipTrigger>
                             <TooltipContent><p>Torso - Emotions & Memories</p></TooltipContent>
                        </Tooltip>

                        {/* Limbs */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <g onClick={() => onZoneClick('limbs')} className="cursor-pointer">
                                    <rect x="20" y="45" width="10" height="70" rx="5" />
                                    <rect x="70" y="45" width="10" height="70" rx="5" />
                                    <rect x="35" y="95" width="10" height="60" rx="5" />
                                    <rect x="55" y="95" width="10" height="60" rx="5" />
                                </g>
                            </TooltipTrigger>
                            <TooltipContent><p>Limbs - Actions & Social Interactions</p></TooltipContent>
                        </Tooltip>
                    </g>
                </svg>
            </div>
        </TooltipProvider>
    );
}
